# LO Scorecard Planning Session - December 29, 2024

## Project Overview

We are planning to modernize the Power BI sales dashboards by rebuilding them as pages in the Lending Heights Hub. This will replace the manual process of downloading pipeline data, uploading to OneDrive/SharePoint, and having Power BI read from those files.

## Current Power BI Setup

The director of ops currently:
1. Manually downloads loan pipeline from Arive multiple times per day
2. Uploads to OneDrive/SharePoint folder
3. Power BI reads the data and outputs dashboard pages

### Existing Dashboard Pages (10 total):
1. **LO Scorecard** - Team/LO performance metrics (FIRST TO BUILD)
2. **Closings** - MTD/YTD closings by team, officer, loan type, investor
3. Processing Dashboard
4. Closing Dashboard
5. Appraisals
6. Sales Funnel
7. Statistics
8. Turntimes
9. Appraisal Speed
10. Lending Map

## Decisions Made

| Decision | Choice |
|----------|--------|
| Data Source | Arive LOS |
| Integration | New Hub Pages (Next.js + Supabase) |
| Data Input (Future) | API Integration with Arive |
| First Page to Build | LO Scorecard |
| Team Structure | Static teams |
| MVP Scope | Include CSV upload functionality |

## LO Scorecard Metrics

From the Power BI screenshot, the scorecard displays:

| Column | Description |
|--------|-------------|
| Team | Branch/team name (from `Brokerage Branch Name`) |
| Score | 0-100 calculated score |
| Net Sub | Net submission count |
| Net Volume | Dollar volume of submissions |
| 6mo Pullthrough | % of loans funded vs submitted (last 6 months) |

### Teams Identified:
- Equity Lending Group
- Loan Rangers
- Game of Loans
- Prosper Home Mortgage
- Champions Lending Group
- LH Savannah
- Mellett Branch
- Team Turner

### Score Calculation
```
LO Score = 100 - SUM('File Intake'[Score])
```
**Note:** Need details on what penalty factors reduce the score (missing documents, late submissions, etc.)

## CSV Data Structure (Pipeline Reports.csv)

Key fields identified from the Arive export:

### Loan Officer & Team
- `Primary Loan Officer Name` - LO name
- `Primary Loan Officer Email` - LO email
- `Primary Loan Officer NMLS` - NMLS ID
- `Brokerage Branch Name` - Team assignment
- `Primary Loan Processor Name` - Processor

### Loan Details
- `ARIVE Loan Id` - Unique identifier
- `Total Loan Amount` - Volume
- `Mortgage Type` - Conventional, VA, FHA, etc.
- `Loan Purpose` - Purchase, Refinance
- `Lender` - Investor (UWM, AmeriHome, PRMG, etc.)

### Stage Tracking
- `Stage Name` - Current stage
- `Date Created` - Initial date
- `App/TRID Completed Date`
- `Disclosed` - Disclosure date
- `Approved with Conditions`
- `Clear To Close`
- `Docs Out`
- `Loan Funded`
- `Adverse` - If adversed
- `Adverse Reason`
- `Archive Indicator`

### Financial
- `Net Loan Revenue`
- `Gross Loan Revenue`
- `Total Loan Amount`

## Technical Architecture (Planned)

### New Files to Create:
```
app/(hub)/analytics/
  └── lo-scorecard/
      └── page.tsx          # LO Scorecard dashboard

lib/api/
  └── analytics.ts          # Data fetching & aggregation

types/
  └── database.ts           # Add pipeline_loans, teams, scoring tables
```

### Supabase Tables Needed:
1. `pipeline_loans` - Raw loan data from CSV imports
2. `teams` - Static team definitions
3. `loan_officers` - LO roster with team assignments
4. `file_intake_scores` - Scoring penalties (needs formula details)
5. `pipeline_imports` - Track CSV upload history

### Features to Build:
1. CSV upload interface for pipeline data
2. Data parsing and import to Supabase
3. LO Scorecard calculations (once formula confirmed)
4. Dashboard display with:
   - Team summary table (expandable to show LOs)
   - Score, Net Sub, Net Volume, Pullthrough columns
   - Date range filters
   - Export functionality

### Chart Library Needed:
- **Recharts** recommended (React-friendly, lightweight)
- Currently no chart library installed in the project

## Outstanding Questions

Before implementation can begin, we need:

1. **Score Penalty Details**: What specific factors cause point deductions from the base 100?
   - Missing documents?
   - Days in stage?
   - Resubmissions?
   - Adverse outcomes?

2. **Pullthrough Calculation**: Is it simply `(Funded Loans / Submitted Loans) * 100` over 6 months?

3. **Net Submissions**: How is "net" calculated? Gross submissions minus adversed/withdrawn?

## Next Steps

1. Get scoring formula details from user
2. Design Supabase schema
3. Install Recharts for visualizations
4. Build CSV upload component
5. Build LO Scorecard page
6. Test with real pipeline data

---

## Git Branch
All work will continue on the `calendar-feature` branch (to be renamed or merged later).

## Reference Screenshots
User provided 3 Power BI screenshots:
1. LO Scorecard page
2. Closings page
3. Model View (data relationships)
