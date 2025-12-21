import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { Database } from '@/types/database';

type Teammate = Database['public']['Tables']['teammates']['Row'];
type TeammateInsert = Database['public']['Tables']['teammates']['Insert'];
type TeammateUpdate = Database['public']['Tables']['teammates']['Update'];

// ============================================================================
// FETCH OPERATIONS
// ============================================================================

/**
 * Fetch all teammates
 * @param filters Optional filters for department, branch, status
 * @returns Array of teammates or error
 */
export async function fetchTeammates(filters?: {
  department?: string;
  branch?: string;
  onboardingStatus?: string;
}) {
  try {
    let query = supabase
      .from('teammates')
      .select('*')
      .order('full_name', { ascending: true });

    // Apply filters if provided
    if (filters?.department && filters.department !== 'All') {
      query = query.eq('department', filters.department);
    }
    if (filters?.branch && filters.branch !== 'All') {
      query = query.eq('branch', filters.branch);
    }
    if (filters?.onboardingStatus && filters.onboardingStatus !== 'All') {
      query = query.eq('onboarding_status', filters.onboardingStatus);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Fetch a single teammate by ID with all related data
 * @param id Teammate UUID
 * @returns Teammate with tags, licensed states, documents, reviews
 */
export async function fetchTeammateById(id: string) {
  try {
    const { data, error } = await supabase
      .from('teammates')
      .select(`
        *,
        manager:manager_id(id, full_name, email),
        tags:teammate_tags(id, tag_name, tag_color),
        licensed_states:teammate_licensed_states(
          id,
          state_code,
          license_number,
          state:licensed_states(state_name)
        ),
        documents:teammate_documents!teammate_id(id, document_type, file_url, file_name),
        reviews:client_reviews!teammate_id(id, client_name, review_text, rating, review_date)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Fetch teammates with manager information
 * Uses the pre-built view for efficiency
 */
export async function fetchTeammatesWithManagers() {
  try {
    const { data, error } = await supabase
      .from('teammates_with_manager_info')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Search teammates by name, position, email
 * @param searchTerm Search query string
 * @returns Matching teammates
 */
export async function searchTeammates(searchTerm: string) {
  try {
    const { data, error } = await supabase
      .from('teammates')
      .select('*')
      .or(`full_name.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
      .order('full_name', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new teammate
 * @param teammate Teammate data to insert
 * @returns Created teammate or error
 */
export async function createTeammate(teammate: TeammateInsert) {
  try {
    const { data, error } = await supabase
      .from('teammates')
      .insert(teammate as any)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Add tags to a teammate
 * @param teammateId Teammate UUID
 * @param tags Array of tag names and optional colors
 */
export async function addTeammateTags(
  teammateId: string,
  tags: Array<{ tag_name: string; tag_color?: string }>
) {
  try {
    const tagsToInsert = tags.map(tag => ({
      teammate_id: teammateId,
      ...tag,
    }));

    const { data, error } = await supabase
      .from('teammate_tags')
      .insert(tagsToInsert as any)
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update a teammate's information
 * @param id Teammate UUID
 * @param updates Fields to update
 * @returns Updated teammate or error
 */
export async function updateTeammate(id: string, updates: TeammateUpdate) {
  try {
    const { data, error } = await (supabase
      .from('teammates') as any)
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Update onboarding status
 * @param id Teammate UUID
 * @param status New onboarding status
 */
export async function updateOnboardingStatus(
  id: string,
  status: 'Not started' | 'In progress' | 'Done' | 'Offboard'
) {
  return updateTeammate(id, { onboarding_status: status });
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a teammate
 * @param id Teammate UUID
 * @returns Success or error
 */
export async function deleteTeammate(id: string) {
  try {
    const { error } = await supabase
      .from('teammates')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
}

/**
 * Remove a tag from a teammate
 * @param teammateId Teammate UUID
 * @param tagName Tag name to remove
 */
export async function removeTeammateTag(teammateId: string, tagName: string) {
  try {
    const { error } = await supabase
      .from('teammate_tags')
      .delete()
      .eq('teammate_id', teammateId)
      .eq('tag_name', tagName);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// AGGREGATE QUERIES
// ============================================================================

/**
 * Get teammate statistics
 * @returns Count by department, branch, status
 */
export async function getTeammateStats() {
  try {
    // Count by department
    const { data: deptCounts, error: deptError } = await supabase
      .from('teammates')
      .select('department')
      .not('onboarding_status', 'eq', 'Offboard');

    // Count by status
    const { data: statusCounts, error: statusError } = await supabase
      .from('teammates')
      .select('onboarding_status');

    // Count by branch
    const { data: branchCounts, error: branchError } = await supabase
      .from('teammates')
      .select('branch')
      .not('onboarding_status', 'eq', 'Offboard');

    if (deptError || statusError || branchError) {
      throw deptError || statusError || branchError;
    }

    // Aggregate counts
    const departmentStats = (deptCounts || []).reduce((acc, t) => {
      acc[t.department] = (acc[t.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusStats = (statusCounts || []).reduce((acc, t) => {
      acc[t.onboarding_status] = (acc[t.onboarding_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const branchStats = (branchCounts || []).reduce((acc, t) => {
      acc[t.branch] = (acc[t.branch] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      data: {
        total: deptCounts?.length || 0,
        byDepartment: departmentStats,
        byStatus: statusStats,
        byBranch: branchStats,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to teammate changes
 * @param callback Function to call when teammates change
 * @returns Subscription object (call .unsubscribe() to stop)
 */
export function subscribeToTeammates(callback: (payload: any) => void) {
  return supabase
    .channel('teammates-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'teammates',
      },
      callback
    )
    .subscribe();
}
