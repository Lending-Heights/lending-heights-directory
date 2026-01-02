/**
 * ARIVE API Client
 *
 * Handles authentication and data fetching from ARIVE LOS (Loan Origination System)
 * via the API-Connect interface.
 *
 * API Documentation: https://api-connect.arive.com/api/docs
 */

// ============================================================================
// TYPES
// ============================================================================

export interface AriveAuthConfig {
  clientId: string;
  secret: string;
  apiKey: string;
  appId: string;
  appSecretHash: string;
}

export interface AriveAuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AriveLoan {
  id: string;
  loanNumber: string;
  currentStage: string;
  currentStageStartDate: string;
  loanAmount: number;
  mortgageType: string;
  propertyType: string;
  propertyAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  borrower: {
    firstName: string;
    lastName: string;
    email: string;
  };
  loanOriginator: {
    name: string;
    email: string;
    nmls: string;
  };
  lender: {
    name: string;
    code: string;
  };
  branch: {
    name: string;
    code: string;
  };
  createdAt: string;
  updatedAt: string;
  // Additional fields from the API
  [key: string]: unknown;
}

export interface AriveLoansResponse {
  loans: AriveLoan[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// ============================================================================
// ARIVE API CLIENT
// ============================================================================

const ARIVE_BASE_URL = 'https://api-connect.arive.com';

/**
 * Authenticate with ARIVE API and get access token
 */
export async function authenticateArive(config: AriveAuthConfig): Promise<{ token: string; error: string | null }> {
  try {
    const response = await fetch(`${ARIVE_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        clientId: config.clientId,
        secret: config.secret,
        apiKey: config.apiKey,
        appId: config.appId,
        appSecretHash: config.appSecretHash,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Authentication failed: ${response.status} - ${errorText}`);
    }

    const data: AriveAuthResponse = await response.json();
    return { token: data.accessToken, error: null };
  } catch (error) {
    return {
      token: '',
      error: error instanceof Error ? error.message : 'Authentication failed',
    };
  }
}

/**
 * Fetch all loans from ARIVE with pagination
 * Uses the Search All Loans endpoint: GET /api/loans
 */
export async function fetchAriveLoans(
  token: string,
  options?: {
    limit?: number;
    offset?: number;
    stage?: string;
  }
): Promise<{ data: AriveLoansResponse | null; error: string | null }> {
  try {
    const params = new URLSearchParams();
    params.set('limit', String(options?.limit || 100)); // Max 100 per API docs
    params.set('offset', String(options?.offset || 0));
    if (options?.stage) {
      params.set('stage', options.stage);
    }

    const response = await fetch(`${ARIVE_BASE_URL}/api/loans?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch loans: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch loans',
    };
  }
}

/**
 * Fetch a single loan by ID
 * Uses the Get Loan Details endpoint: GET /api/loans/{id}
 */
export async function fetchAriveLoan(
  token: string,
  loanId: string
): Promise<{ data: AriveLoan | null; error: string | null }> {
  try {
    const response = await fetch(`${ARIVE_BASE_URL}/api/loans/${loanId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch loan: ${response.status} - ${errorText}`);
    }

    const data: AriveLoan = await response.json();
    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Failed to fetch loan',
    };
  }
}

/**
 * Fetch ALL loans with automatic pagination
 * Handles the 100-item limit by making multiple requests
 */
export async function fetchAllAriveLoans(
  token: string,
  onProgress?: (fetched: number, total: number) => void
): Promise<{ data: AriveLoan[]; error: string | null }> {
  const allLoans: AriveLoan[] = [];
  let offset = 0;
  const limit = 100; // Max per API docs
  let hasMore = true;
  let total = 0;

  try {
    while (hasMore) {
      const { data, error } = await fetchAriveLoans(token, { limit, offset });

      if (error || !data) {
        throw new Error(error || 'Failed to fetch loans');
      }

      allLoans.push(...data.loans);
      total = data.pagination.total;
      hasMore = data.pagination.hasMore;
      offset += limit;

      // Progress callback
      if (onProgress) {
        onProgress(allLoans.length, total);
      }

      // Safety limit to prevent infinite loops
      if (allLoans.length >= 10000) {
        console.warn('Hit safety limit of 10000 loans');
        break;
      }
    }

    return { data: allLoans, error: null };
  } catch (error) {
    return {
      data: allLoans, // Return what we have so far
      error: error instanceof Error ? error.message : 'Failed to fetch all loans',
    };
  }
}

/**
 * Map ARIVE loan stage to our internal status
 */
export function mapAriveStageToStatus(stage: string): string {
  const stageMap: Record<string, string> = {
    'APPLICATION_INTAKE': 'APPLICATION_INTAKE',
    'PROCESSING': 'PROCESSING',
    'UNDERWRITING': 'UNDERWRITING',
    'APPROVED': 'APPROVED',
    'APPROVED_WITH_CONDITIONS': 'APPROVED_WITH_CONDITIONS',
    'CLEAR_TO_CLOSE': 'CLEAR_TO_CLOSE',
    'DOCS_OUT': 'DOCS_OUT',
    'DOCS_SIGNED': 'DOCS_SIGNED',
    'LOAN_FUNDED': 'LOAN_FUNDED',
    'COMMISSION_PAID': 'COMMISSION_PAID',
    'DENIED': 'DENIED',
    'WITHDRAWN': 'WITHDRAWN',
    'SUSPENDED': 'SUSPENDED',
  };
  return stageMap[stage] || stage;
}

/**
 * Transform ARIVE loan data to our database schema
 */
export function transformAriveLoan(loan: AriveLoan): Record<string, unknown> {
  return {
    arive_loan_id: loan.id,
    loan_number: loan.loanNumber,
    current_status: mapAriveStageToStatus(loan.currentStage),
    current_status_date: loan.currentStageStartDate,
    total_loan_amount: loan.loanAmount,
    mortgage_type: loan.mortgageType,
    property_type: loan.propertyType,
    property_address: loan.propertyAddress?.street || null,
    property_city: loan.propertyAddress?.city || null,
    property_state: loan.propertyAddress?.state || null,
    property_zip: loan.propertyAddress?.zip || null,
    borrower_first_name: loan.borrower?.firstName || null,
    borrower_last_name: loan.borrower?.lastName || null,
    borrower_email: loan.borrower?.email || null,
    loan_originator_name: loan.loanOriginator?.name || null,
    loan_originator_email: loan.loanOriginator?.email || null,
    loan_originator_nmls: loan.loanOriginator?.nmls || null,
    lender_name: loan.lender?.name || null,
    lender_code: loan.lender?.code || null,
    org_unit_display_name: loan.branch?.name || null,
    org_unit_code: loan.branch?.code || null,
    arive_created_at: loan.createdAt,
    arive_updated_at: loan.updatedAt,
    // Store raw data for reference
    raw_data: loan,
  };
}
