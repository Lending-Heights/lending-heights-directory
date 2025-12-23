import { supabase, handleSupabaseError } from '@/lib/supabase';
import type { Database } from '@/types/database';

type CalendarEvent = Database['public']['Tables']['calendar_events']['Row'];
type CalendarEventInsert = Database['public']['Tables']['calendar_events']['Insert'];
type CalendarEventUpdate = Database['public']['Tables']['calendar_events']['Update'];

// ============================================================================
// FETCH OPERATIONS
// ============================================================================

/**
 * Fetch all events for a specific month and year
 * @param month Month (0-11)
 * @param year Full year (e.g., 2026)
 * @returns Array of events for that month
 */
export async function fetchEventsByMonth(month: number, year: number) {
  try {
    // Calculate first and last day of the month
    const firstDay = new Date(year, month, 1).toISOString().split('T')[0];
    const lastDay = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .gte('event_date', firstDay)
      .lte('event_date', lastDay)
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Fetch all events (no date filter)
 * @returns Array of all events
 */
export async function fetchAllEvents() {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Fetch a single event by ID
 * @param id Event UUID
 * @returns Single event or error
 */
export async function fetchEventById(id: string) {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Fetch upcoming events (from today onwards)
 * @param limit Max number of events to return
 * @returns Array of upcoming events
 */
export async function fetchUpcomingEvents(limit: number = 10) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .gte('event_date', today)
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true })
      .limit(limit);

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
 * Create a new calendar event
 * @param event Event data to insert
 * @returns Created event or error
 */
export async function createEvent(event: CalendarEventInsert) {
  try {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert(event as any)
      .select()
      .single();

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
 * Update an existing calendar event
 * @param id Event UUID
 * @param updates Fields to update
 * @returns Updated event or error
 */
export async function updateEvent(id: string, updates: CalendarEventUpdate) {
  try {
    const { data, error } = await (supabase
      .from('calendar_events') as any)
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a calendar event
 * @param id Event UUID
 * @returns Success or error
 */
export async function deleteEvent(id: string) {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// REAL-TIME SUBSCRIPTIONS
// ============================================================================

/**
 * Subscribe to calendar event changes
 * @param callback Function to call when events change
 * @returns Subscription object (call .unsubscribe() to stop)
 */
export function subscribeToEvents(callback: (payload: any) => void) {
  return supabase
    .channel('calendar-events-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'calendar_events',
      },
      callback
    )
    .subscribe();
}
