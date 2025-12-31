// Mock data for Closings dashboard mockup
// Data based on Power BI screenshots provided

export const mockMetrics = {
  mtdCount: 7,
  mtdVolume: 2000000,
  ytdCount: 118,
  ytdVolume: 118260000,
  avgLoanSize: 1002203,
};

export const mockTeamBreakdown = [
  { team: "Game of Loans", funded: 111, volume: 23134276.79 },
  { team: "Equity Lending Group", funded: 101, volume: 30134064.00 },
  { team: "Loan Rangers", funded: 77, volume: 17716269.00 },
  { team: "LH Savannah", funded: 50, volume: 14941098.00 },
  { team: "Team Turner", funded: 47, volume: 9749920.00 },
  { team: "Prosper Home Mortgage", funded: 14, volume: 3694130.00 },
  { team: "Mellett Branch", funded: 6, volume: 2683201.00 },
  { team: "Champions Lending Group", funded: 2, volume: 770810.00 },
];

export const mockLoanOfficers = [
  { name: "James Clarke", funded: 88, volume: 27653254.00 },
  { name: "Stephanie Turner", funded: 57, volume: 9749920.00 },
  { name: "Ann Sullivan", funded: 46, volume: 9897005.00 },
  { name: "Andrew Slavin", funded: 41, volume: 7953618.00 },
  { name: "Lea Steadman", funded: 39, volume: 9558869.00 },
  { name: "Kenaniah Stikkel", funded: 26, volume: 5846091.00 },
  { name: "Cameron Watson", funded: 25, volume: 7604190.00 },
  { name: "Daniel Lariscy", funded: 25, volume: 7336908.00 },
  { name: "Daniel Garrigan", funded: 13, volume: 3195280.00 },
  { name: "Daniel Giannetti", funded: 13, volume: 2480810.00 },
  { name: "Benji Orlowski", funded: 12, volume: 2493368.00 },
  { name: "Todd Hummel", funded: 11, volume: 2088373.79 },
  { name: "Michael Evans", funded: 10, volume: 2723977.00 },
  { name: "Tom Mellett", funded: 6, volume: 2683201.00 },
  { name: "Nicole Herget", funded: 4, volume: 970153.00 },
  { name: "Tina Durst", funded: 4, volume: 779444.00 },
  { name: "Robyn Stikkel", funded: 3, volume: 475830.00 },
  { name: "Sean McHugh", funded: 2, volume: 770810.00 },
];

export const mockByLoanType = [
  { type: "Conventional", count: 102, percentage: 54.26, color: "bg-blue-500" },
  { type: "FHA", count: 43, percentage: 22.87, color: "bg-orange-500" },
  { type: "VA", count: 22, percentage: 11.70, color: "bg-green-500" },
  { type: "Non-QM", count: 15, percentage: 7.98, color: "bg-red-500" },
  { type: "USDA", count: 3, percentage: 1.60, color: "bg-purple-500" },
  { type: "HELOC", count: 3, percentage: 1.60, color: "bg-yellow-500" },
];

export const mockByLender = [
  { lender: "UWM", count: 126, percentage: 67.02, color: "bg-blue-600" },
  { lender: "AmeriHome", count: 23, percentage: 12.23, color: "bg-cyan-500" },
  { lender: "PRMG", count: 10, percentage: 5.32, color: "bg-pink-500" },
  { lender: "WINDSOR", count: 9, percentage: 4.79, color: "bg-orange-500" },
  { lender: "EPM", count: 3, percentage: 1.60, color: "bg-green-500" },
];

// Funding data for the "Funded" and "Expected to Close" sections
export const mockFundedLoans = [
  { loanOfficer: "Nicole Herget", count: 1, volume: 409500.00 },
  { loanOfficer: "James Clarke", count: 1, volume: 214900.00 },
];

export const mockExpectedToClose = [
  { loanOfficer: "Nicole Herget", count: 1, volume: 409500.00 },
  { loanOfficer: "James Clarke", count: 1, volume: 214900.00 },
];

// Helper function to format currency
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

// Helper function to format large numbers
export function formatNumber(num: number): string {
  return num.toLocaleString();
}
