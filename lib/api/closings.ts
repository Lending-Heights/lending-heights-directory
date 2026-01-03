import { createClient } from '@/lib/supabase/server';

// Helper function to handle Supabase errors
function handleSupabaseError(error: unknown): string {
  console.error('Supabase error:', error);
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  return 'An unexpected error occurred';
}

// ============================================================================
// TYPES
// ============================================================================

export interface ClosingMetrics {
  mtdCount: number;
  mtdVolume: number;
  ytdCount: number;
  ytdVolume: number;
  avgLoanSize: number;
}

export interface TeamBreakdown {
  team: string;
  funded: number;
  volume: number;
}

export interface LoanOfficerStats {
  name: string;
  email?: string;
  funded: number;
  volume: number;
}

export interface LoanTypeBreakdown {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface LenderBreakdown {
  lender: string;
  count: number;
  percentage: number;
  color: string;
}

export interface FundedLoan {
  loanOfficer: string;
  count: number;
  volume: number;
}

// Color mappings for loan types
const loanTypeColors: Record<string, string> = {
  'Conventional': 'bg-blue-500',
  'FHA': 'bg-orange-500',
  'VA': 'bg-green-500',
  'USDARuralDevelopment': 'bg-purple-500',
  'NonQM': 'bg-red-500',
  'HELOC': 'bg-yellow-500',
  'HELOAN': 'bg-cyan-500',
  'REVERSE': 'bg-pink-500',
};

// Color mappings for lenders (top 5 get specific colors, rest get gray)
const lenderColors: Record<string, string> = {
  'UWM': 'bg-blue-600',
  'AmeriHome': 'bg-cyan-500',
  'PRMG': 'bg-pink-500',
  'WINDSOR': 'bg-orange-500',
  'EPM': 'bg-green-500',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getFirstDayOfMonth(): string {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
}

function getFirstDayOfYear(): string {
  const today = new Date();
  return new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

// ============================================================================
// AGGREGATE QUERIES - Dashboard Metrics
// ============================================================================

/**
 * Get MTD/YTD closing metrics
 */
export async function getClosingMetrics(): Promise<{ data: ClosingMetrics | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const firstDayOfMonth = getFirstDayOfMonth();
    const firstDayOfYear = getFirstDayOfYear();
    const today = getToday();

    // MTD funded loans
    const { data: mtdLoans, error: mtdError } = await supabase
      .from('loans')
      .select('total_loan_amount')
      .eq('current_status', 'LOAN_FUNDED')
      .gte('current_status_date', firstDayOfMonth)
      .lte('current_status_date', today) as any;

    if (mtdError) throw mtdError;

    // YTD funded loans
    const { data: ytdLoans, error: ytdError } = await supabase
      .from('loans')
      .select('total_loan_amount')
      .eq('current_status', 'LOAN_FUNDED')
      .gte('current_status_date', firstDayOfYear)
      .lte('current_status_date', today) as any;

    if (ytdError) throw ytdError;

    const mtdCount = mtdLoans?.length || 0;
    const mtdVolume = mtdLoans?.reduce((sum: number, l: any) => sum + (Number(l.total_loan_amount) || 0), 0) || 0;
    const ytdCount = ytdLoans?.length || 0;
    const ytdVolume = ytdLoans?.reduce((sum: number, l: any) => sum + (Number(l.total_loan_amount) || 0), 0) || 0;
    const avgLoanSize = ytdCount > 0 ? ytdVolume / ytdCount : 0;

    return {
      data: {
        mtdCount,
        mtdVolume,
        ytdCount,
        ytdVolume,
        avgLoanSize,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Get closings breakdown by team/branch
 */
export async function getClosingsByTeam(
  startDate?: string,
  endDate?: string
): Promise<{ data: TeamBreakdown[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const start = startDate || getFirstDayOfYear();
    const end = endDate || getToday();

    const { data: loans, error } = await supabase
      .from('loans')
      .select('org_unit_display_name, total_loan_amount')
      .eq('current_status', 'LOAN_FUNDED')
      .gte('current_status_date', start)
      .lte('current_status_date', end) as any;

    if (error) throw error;

    // Aggregate by team
    const teamStats = (loans || []).reduce((acc: Record<string, TeamBreakdown>, loan: any) => {
      const team = loan.org_unit_display_name || 'Unknown';
      if (!acc[team]) {
        acc[team] = { team, funded: 0, volume: 0 };
      }
      acc[team].funded += 1;
      acc[team].volume += Number(loan.total_loan_amount) || 0;
      return acc;
    }, {});

    const result = (Object.values(teamStats) as TeamBreakdown[]).sort((a, b) => b.funded - a.funded);

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Get top loan officers by closings
 */
export async function getTopLoanOfficers(
  startDate?: string,
  endDate?: string,
  limit: number = 20
): Promise<{ data: LoanOfficerStats[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const start = startDate || getFirstDayOfYear();
    const end = endDate || getToday();

    const { data: loans, error } = await supabase
      .from('loans')
      .select('loan_originator_name, loan_originator_email, total_loan_amount')
      .eq('current_status', 'LOAN_FUNDED')
      .gte('current_status_date', start)
      .lte('current_status_date', end) as any;

    if (error) throw error;

    // Aggregate by LO
    const loStats = (loans || []).reduce((acc: Record<string, LoanOfficerStats>, loan: any) => {
      const name = loan.loan_originator_name || 'Unknown';
      const email = loan.loan_originator_email || '';
      const key = email || name;
      if (!acc[key]) {
        acc[key] = { name, email, funded: 0, volume: 0 };
      }
      acc[key].funded += 1;
      acc[key].volume += Number(loan.total_loan_amount) || 0;
      return acc;
    }, {});

    const result = (Object.values(loStats) as LoanOfficerStats[])
      .sort((a, b) => b.funded - a.funded)
      .slice(0, limit);

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Get closings breakdown by loan type
 */
export async function getClosingsByLoanType(
  startDate?: string,
  endDate?: string
): Promise<{ data: LoanTypeBreakdown[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const start = startDate || getFirstDayOfYear();
    const end = endDate || getToday();

    const { data: loans, error } = await supabase
      .from('loans')
      .select('mortgage_type')
      .eq('current_status', 'LOAN_FUNDED')
      .gte('current_status_date', start)
      .lte('current_status_date', end) as any;

    if (error) throw error;

    const totalCount = loans?.length || 0;

    // Aggregate by type
    const typeStats = (loans || []).reduce((acc: Record<string, LoanTypeBreakdown>, loan: any) => {
      const type = loan.mortgage_type || 'Other';
      if (!acc[type]) {
        acc[type] = { type, count: 0, percentage: 0, color: loanTypeColors[type] || 'bg-gray-500' };
      }
      acc[type].count += 1;
      return acc;
    }, {});

    // Calculate percentages
    const result = (Object.values(typeStats) as LoanTypeBreakdown[])
      .map((item) => ({
        ...item,
        percentage: totalCount > 0 ? Math.round((item.count / totalCount) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Get closings breakdown by lender/investor
 */
export async function getClosingsByLender(
  startDate?: string,
  endDate?: string
): Promise<{ data: LenderBreakdown[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const start = startDate || getFirstDayOfYear();
    const end = endDate || getToday();

    const { data: loans, error } = await supabase
      .from('loans')
      .select('lender_name')
      .eq('current_status', 'LOAN_FUNDED')
      .gte('current_status_date', start)
      .lte('current_status_date', end) as any;

    if (error) throw error;

    const totalCount = loans?.length || 0;

    // Aggregate by lender
    const lenderStats = (loans || []).reduce((acc: Record<string, LenderBreakdown>, loan: any) => {
      const lender = loan.lender_name || 'Other';
      if (!acc[lender]) {
        acc[lender] = { lender, count: 0, percentage: 0, color: lenderColors[lender] || 'bg-gray-500' };
      }
      acc[lender].count += 1;
      return acc;
    }, {});

    // Calculate percentages
    const result = (Object.values(lenderStats) as LenderBreakdown[])
      .map((item) => ({
        ...item,
        percentage: totalCount > 0 ? Math.round((item.count / totalCount) * 10000) / 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Get MTD funded loans grouped by loan officer
 */
export async function getMTDFundedByLO(): Promise<{ data: FundedLoan[] | null; error: string | null }> {
  try {
    const supabase = await createClient();
    const firstDayOfMonth = getFirstDayOfMonth();
    const today = getToday();

    const { data: loans, error } = await supabase
      .from('loans')
      .select('loan_originator_name, total_loan_amount')
      .eq('current_status', 'LOAN_FUNDED')
      .gte('current_status_date', firstDayOfMonth)
      .lte('current_status_date', today) as any;

    if (error) throw error;

    // Aggregate by LO
    const loStats = (loans || []).reduce((acc: Record<string, FundedLoan>, loan: any) => {
      const name = loan.loan_originator_name || 'Unknown';
      if (!acc[name]) {
        acc[name] = { loanOfficer: name, count: 0, volume: 0 };
      }
      acc[name].count += 1;
      acc[name].volume += Number(loan.total_loan_amount) || 0;
      return acc;
    }, {});

    const result = (Object.values(loStats) as FundedLoan[]).sort((a, b) => b.count - a.count);

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Get loans expected to close (have CTC/Docs Out/Docs Signed but not funded)
 */
export async function getExpectedToClose(): Promise<{ data: FundedLoan[] | null; error: string | null }> {
  try {
    const supabase = await createClient();

    const { data: loans, error } = await supabase
      .from('loans')
      .select('loan_originator_name, total_loan_amount')
      .in('current_status', ['CLEAR_TO_CLOSE', 'DOCS_OUT', 'DOCS_SIGNED']) as any;

    if (error) throw error;

    // Aggregate by LO
    const loStats = (loans || []).reduce((acc: Record<string, FundedLoan>, loan: any) => {
      const name = loan.loan_originator_name || 'Unknown';
      if (!acc[name]) {
        acc[name] = { loanOfficer: name, count: 0, volume: 0 };
      }
      acc[name].count += 1;
      acc[name].volume += Number(loan.total_loan_amount) || 0;
      return acc;
    }, {});

    const result = (Object.values(loStats) as FundedLoan[]).sort((a, b) => b.count - a.count);

    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Get unique filter values for dropdowns
 */
export async function getFilterOptions(): Promise<{
  data: { teams: string[]; loanTypes: string[]; lenders: string[] } | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data: loans, error } = await supabase
      .from('loans')
      .select('org_unit_display_name, mortgage_type, lender_name')
      .eq('current_status', 'LOAN_FUNDED') as any;

    if (error) throw error;

    const teams = [...new Set((loans || []).map((l: any) => l.org_unit_display_name).filter(Boolean))].sort() as string[];
    const loanTypes = [...new Set((loans || []).map((l: any) => l.mortgage_type).filter(Boolean))].sort() as string[];
    const lenders = [...new Set((loans || []).map((l: any) => l.lender_name).filter(Boolean))].sort() as string[];

    return {
      data: { teams, loanTypes, lenders },
      error: null,
    };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

/**
 * Get last sync information
 */
export async function getLastSyncInfo(): Promise<{
  data: { created_at: string; records_fetched: number; records_upserted: number } | null;
  error: string | null;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('sync_logs')
      .select('created_at, records_fetched, records_upserted')
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single() as any;

    if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}

// ============================================================================
// FETCH OPERATIONS
// ============================================================================

/**
 * Fetch all loans with optional filters
 */
export async function fetchLoans(filters?: {
  status?: string;
  loanOfficer?: string;
  team?: string;
  lender?: string;
  mortgageType?: string;
  startDate?: string;
  endDate?: string;
}) {
  try {
    const supabase = await createClient();

    let query = supabase
      .from('loans')
      .select('*')
      .order('arive_created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('current_status', filters.status);
    }
    if (filters?.loanOfficer) {
      query = query.eq('loan_originator_email', filters.loanOfficer);
    }
    if (filters?.team) {
      query = query.eq('org_unit_display_name', filters.team);
    }
    if (filters?.lender) {
      query = query.eq('lender_name', filters.lender);
    }
    if (filters?.mortgageType) {
      query = query.eq('mortgage_type', filters.mortgageType);
    }
    if (filters?.startDate) {
      query = query.gte('current_status_date', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('current_status_date', filters.endDate);
    }

    const { data, error } = await query as any;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: handleSupabaseError(error) };
  }
}
