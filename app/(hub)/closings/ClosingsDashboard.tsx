'use client';

import { useState, useTransition } from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  Building2,
  CreditCard,
  Landmark,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/shared/PageHeader';
import { syncAriveLoans } from '@/app/actions/sync-arive';
import type {
  ClosingMetrics,
  TeamBreakdown,
  LoanOfficerStats,
  LoanTypeBreakdown,
  LenderBreakdown,
  FundedLoan,
} from '@/lib/api/closings';

// ============================================================================
// TYPES
// ============================================================================

interface ClosingsDashboardProps {
  metrics: ClosingMetrics;
  teamBreakdown: TeamBreakdown[];
  loanOfficers: LoanOfficerStats[];
  byLoanType: LoanTypeBreakdown[];
  byLender: LenderBreakdown[];
  fundedLoans: FundedLoan[];
  expectedToClose: FundedLoan[];
  filterOptions: {
    teams: string[];
    loanTypes: string[];
    lenders: string[];
  };
  lastSync: { created_at: string; records_fetched: number; records_upserted: number } | null;
  hasData: boolean;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function MetricCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
  subLabel,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
  subLabel?: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${iconBg}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
            {subLabel && (
              <p className="text-xs text-muted-foreground">{subLabel}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProgressBar({ percentage, color }: { percentage: number; color: string }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ClosingsDashboard({
  metrics,
  teamBreakdown,
  loanOfficers,
  byLoanType,
  byLender,
  fundedLoans,
  expectedToClose,
  filterOptions,
  lastSync,
  hasData,
}: ClosingsDashboardProps) {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [isSyncing, startSync] = useTransition();
  const [syncStatus, setSyncStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const handleSync = () => {
    setSyncStatus(null);
    startSync(async () => {
      const result = await syncAriveLoans();
      setSyncStatus({
        success: result.success,
        message: result.message,
      });
      if (result.success) {
        // Refresh the page to show new data
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Closings"
        description="Month-to-date and year-to-date closings performance"
        icon={DollarSign}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
        badge="Analytics"
        actions={
          <div className="flex items-center gap-2">
            {lastSync && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mr-2">
                <Clock className="h-3 w-3" />
                <span>Last sync: {formatDate(lastSync.created_at)}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleSync}
              disabled={isSyncing}
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync'}
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Sync Status Message */}
      {syncStatus && (
        <Card className={syncStatus.success ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}>
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              {syncStatus.success ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <span className="text-red-600">Error:</span>
              )}
              <p className={`text-sm ${syncStatus.success ? 'text-green-800' : 'text-red-800'}`}>
                {syncStatus.message}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          icon={TrendingUp}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          value={formatNumber(metrics.mtdCount)}
          label="MTD Closings"
          subLabel="This month"
        />
        <MetricCard
          icon={DollarSign}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          value={formatCurrency(metrics.mtdVolume)}
          label="MTD Volume"
          subLabel="This month"
        />
        <MetricCard
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          value={formatNumber(metrics.ytdCount)}
          label="YTD Closings"
          subLabel="Year to date"
        />
        <MetricCard
          icon={DollarSign}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          value={formatCurrency(metrics.ytdVolume)}
          label="YTD Volume"
          subLabel="Year to date"
        />
        <MetricCard
          icon={CreditCard}
          iconBg="bg-pink-100"
          iconColor="text-pink-600"
          value={formatCurrency(metrics.avgLoanSize)}
          label="Avg Loan Size"
        />
      </div>

      {/* Filters Row */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="px-2 py-1 text-sm border rounded"
              />
              <span className="text-muted-foreground">to</span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="px-2 py-1 text-sm border rounded"
              />
            </div>
            <select className="px-3 py-1.5 text-sm border rounded bg-white">
              <option value="">All Teams</option>
              {filterOptions.teams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
            <select className="px-3 py-1.5 text-sm border rounded bg-white">
              <option value="">All Loan Types</option>
              {filterOptions.loanTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <select className="px-3 py-1.5 text-sm border rounded bg-white">
              <option value="">All Lenders</option>
              {filterOptions.lenders.map((lender) => (
                <option key={lender} value={lender}>{lender}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Year to Date by Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamBreakdown.length > 0 ? (
              <div className="space-y-1">
                <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground pb-2 border-b">
                  <span>Team</span>
                  <span className="text-right">Funded</span>
                  <span className="text-right">Volume</span>
                </div>
                {teamBreakdown.map((team) => (
                  <div
                    key={team.team}
                    className="grid grid-cols-3 py-2 hover:bg-muted/50 rounded px-1 cursor-pointer"
                  >
                    <span className="text-sm font-medium truncate">{team.team}</span>
                    <span className="text-sm text-right">{team.funded}</span>
                    <span className="text-sm text-right text-muted-foreground">
                      {formatCurrency(team.volume)}
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-3 pt-2 border-t font-semibold">
                  <span>Total</span>
                  <span className="text-right">
                    {teamBreakdown.reduce((sum, t) => sum + t.funded, 0)}
                  </span>
                  <span className="text-right">
                    {formatCurrency(teamBreakdown.reduce((sum, t) => sum + t.volume, 0))}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No team data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* By Loan Type */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              By Loan Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            {byLoanType.length > 0 ? (
              <div className="space-y-4">
                {byLoanType.map((type) => (
                  <div key={type.type} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${type.color}`} />
                        <span className="text-sm font-medium">{type.type}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          {type.count}
                        </Badge>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {type.percentage}%
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={type.percentage} color={type.color} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No loan type data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Top Loan Officers */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Top Loan Officers (YTD)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loanOfficers.length > 0 ? (
              <div className="space-y-1">
                <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground pb-2 border-b">
                  <span>Loan Officer</span>
                  <span className="text-right">Funded</span>
                  <span className="text-right">Volume</span>
                </div>
                {loanOfficers.slice(0, 10).map((lo, index) => (
                  <div
                    key={lo.name}
                    className="grid grid-cols-3 py-2 hover:bg-muted/50 rounded px-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{index + 1}.</span>
                      <span className="text-sm font-medium truncate">{lo.name}</span>
                    </div>
                    <span className="text-sm text-right">{lo.funded}</span>
                    <span className="text-sm text-right text-muted-foreground">
                      {formatCurrency(lo.volume)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No loan officer data available
              </p>
            )}
          </CardContent>
        </Card>

        {/* By Lender/Investor */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="h-5 w-5 text-green-600" />
              By Lender / Investor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {byLender.length > 0 ? (
              <div className="space-y-4">
                {byLender.map((lender) => (
                  <div key={lender.lender} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${lender.color}`} />
                        <span className="text-sm font-medium">{lender.lender}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs">
                          {lender.count}
                        </Badge>
                        <span className="text-sm text-muted-foreground w-16 text-right">
                          {lender.percentage}%
                        </span>
                      </div>
                    </div>
                    <ProgressBar percentage={lender.percentage} color={lender.color} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No lender data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row - Funded & Expected to Close */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Month to Date Funded */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Funded (Month to Date)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fundedLoans.length > 0 ? (
              <div className="space-y-1">
                <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground pb-2 border-b">
                  <span>Loan Officer</span>
                  <span className="text-right">Funded</span>
                  <span className="text-right">Volume</span>
                </div>
                {fundedLoans.map((loan) => (
                  <div
                    key={loan.loanOfficer}
                    className="grid grid-cols-3 py-2 hover:bg-muted/50 rounded px-1"
                  >
                    <span className="text-sm font-medium">{loan.loanOfficer}</span>
                    <span className="text-sm text-right">{loan.count}</span>
                    <span className="text-sm text-right text-muted-foreground">
                      {formatCurrency(loan.volume)}
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-3 pt-2 border-t font-semibold">
                  <span>Total</span>
                  <span className="text-right">
                    {fundedLoans.reduce((sum, l) => sum + l.count, 0)}
                  </span>
                  <span className="text-right">
                    {formatCurrency(fundedLoans.reduce((sum, l) => sum + l.volume, 0))}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No funded loans this month yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Expected to Close */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-amber-600" />
              Expected to Close
            </CardTitle>
          </CardHeader>
          <CardContent>
            {expectedToClose.length > 0 ? (
              <div className="space-y-1">
                <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground pb-2 border-b">
                  <span>Loan Officer</span>
                  <span className="text-right">Expected</span>
                  <span className="text-right">Volume</span>
                </div>
                {expectedToClose.map((loan) => (
                  <div
                    key={loan.loanOfficer}
                    className="grid grid-cols-3 py-2 hover:bg-muted/50 rounded px-1"
                  >
                    <span className="text-sm font-medium">{loan.loanOfficer}</span>
                    <span className="text-sm text-right">{loan.count}</span>
                    <span className="text-sm text-right text-muted-foreground">
                      {formatCurrency(loan.volume)}
                    </span>
                  </div>
                ))}
                <div className="grid grid-cols-3 pt-2 border-t font-semibold">
                  <span>Total</span>
                  <span className="text-right">
                    {expectedToClose.reduce((sum, l) => sum + l.count, 0)}
                  </span>
                  <span className="text-right">
                    {formatCurrency(expectedToClose.reduce((sum, l) => sum + l.volume, 0))}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No loans expected to close
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
