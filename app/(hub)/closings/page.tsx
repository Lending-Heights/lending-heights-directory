import { Suspense } from 'react';

// Force dynamic rendering since we use cookies for auth
export const dynamic = 'force-dynamic';

import {
  getClosingMetrics,
  getClosingsByTeam,
  getTopLoanOfficers,
  getClosingsByLoanType,
  getClosingsByLender,
  getMTDFundedByLO,
  getExpectedToClose,
  getFilterOptions,
  getLastSyncInfo,
} from '@/lib/api/closings';
import ClosingsDashboard from './ClosingsDashboard';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Loading component
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading closings data...</p>
      </div>
    </div>
  );
}

// Server component that fetches data
async function ClosingsData() {
  // Fetch all data in parallel
  const [
    metricsResult,
    teamResult,
    loResult,
    loanTypeResult,
    lenderResult,
    fundedResult,
    expectedResult,
    filterResult,
    syncResult,
  ] = await Promise.all([
    getClosingMetrics(),
    getClosingsByTeam(),
    getTopLoanOfficers(),
    getClosingsByLoanType(),
    getClosingsByLender(),
    getMTDFundedByLO(),
    getExpectedToClose(),
    getFilterOptions(),
    getLastSyncInfo(),
  ]);

  // Check if we have data
  const hasData = metricsResult.data && (metricsResult.data.ytdCount > 0 || metricsResult.data.mtdCount > 0);

  if (!hasData) {
    return (
      <div className="space-y-6">
        <ClosingsDashboard
          metrics={{ mtdCount: 0, mtdVolume: 0, ytdCount: 0, ytdVolume: 0, avgLoanSize: 0 }}
          teamBreakdown={[]}
          loanOfficers={[]}
          byLoanType={[]}
          byLender={[]}
          fundedLoans={[]}
          expectedToClose={[]}
          filterOptions={{ teams: [], loanTypes: [], lenders: [] }}
          lastSync={null}
          hasData={false}
        />
        <Card className="border-dashed border-2 border-amber-300 bg-amber-50">
          <CardContent className="p-4">
            <p className="text-sm text-amber-800 text-center">
              <strong>No Data:</strong> The loans table is empty. Configure ARIVE API credentials
              and run a sync to populate the dashboard with real data.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ClosingsDashboard
      metrics={metricsResult.data || { mtdCount: 0, mtdVolume: 0, ytdCount: 0, ytdVolume: 0, avgLoanSize: 0 }}
      teamBreakdown={teamResult.data || []}
      loanOfficers={loResult.data || []}
      byLoanType={loanTypeResult.data || []}
      byLender={lenderResult.data || []}
      fundedLoans={fundedResult.data || []}
      expectedToClose={expectedResult.data || []}
      filterOptions={filterResult.data || { teams: [], loanTypes: [], lenders: [] }}
      lastSync={syncResult.data}
      hasData={true}
    />
  );
}

export default function ClosingsPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ClosingsData />
    </Suspense>
  );
}
