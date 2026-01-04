/**
 * CSV Column Mapping for Pipeline Reports
 *
 * Maps CSV column headers from ARIVE Pipeline Reports to database column names.
 * SSN fields are intentionally excluded for security.
 */

export interface ColumnMapping {
  csvHeader: string;
  dbColumn: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'integer';
  exclude?: boolean; // If true, skip this column (for SSN, etc.)
}

export const CSV_COLUMN_MAPPING: ColumnMapping[] = [
  // Primary Borrower
  { csvHeader: 'Primary Borrower', dbColumn: 'primary_borrower', type: 'text' },
  { csvHeader: 'ARIVE Loan Id', dbColumn: 'arive_loan_id', type: 'text' },
  { csvHeader: 'Date Created', dbColumn: 'date_created', type: 'date' },
  { csvHeader: 'Brokerage Name', dbColumn: 'brokerage_name', type: 'text' },
  { csvHeader: 'Brokerage NMLS', dbColumn: 'brokerage_nmls', type: 'text' },
  { csvHeader: 'Brokerage Branch Name', dbColumn: 'brokerage_branch_name', type: 'text' },
  { csvHeader: 'Brokerage Branch NMLS', dbColumn: 'brokerage_branch_nmls', type: 'text' },
  { csvHeader: 'Primary Borrower First Name', dbColumn: 'borrower_first_name', type: 'text' },
  { csvHeader: 'Primary Borrower Last Name', dbColumn: 'borrower_last_name', type: 'text' },
  { csvHeader: 'Primary Borrower Email', dbColumn: 'borrower_email', type: 'text' },
  { csvHeader: 'Primary Borrower Home Phone', dbColumn: 'borrower_home_phone', type: 'text' },
  { csvHeader: 'Primary Borrower Cell Phone', dbColumn: 'borrower_cell_phone', type: 'text' },
  { csvHeader: 'Primary Borrower SSN', dbColumn: '', type: 'text', exclude: true }, // EXCLUDED
  { csvHeader: 'Primary Borrower Birthday', dbColumn: 'borrower_birthday', type: 'date' },
  { csvHeader: 'Loan FICO', dbColumn: 'loan_fico', type: 'integer' },
  { csvHeader: 'Primary Borrower Gender', dbColumn: 'borrower_gender', type: 'text' },
  { csvHeader: 'Primary Borrower Marital Status', dbColumn: 'borrower_marital_status', type: 'text' },
  { csvHeader: 'Primary Borrower Monthly Income', dbColumn: 'borrower_monthly_income', type: 'number' },
  { csvHeader: 'Primary Borrower Occupancy Type', dbColumn: 'borrower_occupancy_type', type: 'text' },
  { csvHeader: 'Primary Borrower Street Address', dbColumn: 'borrower_street_address', type: 'text' },
  { csvHeader: 'Primary Borrower Unit #', dbColumn: 'borrower_unit', type: 'text' },
  { csvHeader: 'Primary Borrower City', dbColumn: 'borrower_city', type: 'text' },
  { csvHeader: 'Primary Borrower State', dbColumn: 'borrower_state', type: 'text' },
  { csvHeader: 'Primary Borrower Zip', dbColumn: 'borrower_zip', type: 'text' },
  { csvHeader: 'Primary Borrower Mailing Address', dbColumn: 'borrower_mailing_address', type: 'text' },
  { csvHeader: 'Primary Borrower Self-Employed', dbColumn: 'borrower_self_employed', type: 'boolean' },
  { csvHeader: 'Primary Borrower Employer', dbColumn: 'borrower_employer', type: 'text' },

  // Co-Borrower
  { csvHeader: 'Co-Borrower First Name', dbColumn: 'co_borrower_first_name', type: 'text' },
  { csvHeader: 'Co-Borrower Last Name', dbColumn: 'co_borrower_last_name', type: 'text' },
  { csvHeader: 'Co-Borrower Email', dbColumn: 'co_borrower_email', type: 'text' },
  { csvHeader: 'Co-Borrower Home Phone', dbColumn: 'co_borrower_home_phone', type: 'text' },
  { csvHeader: 'Co-Borrower Cell Phone', dbColumn: 'co_borrower_cell_phone', type: 'text' },
  { csvHeader: 'Co-Borrower SSN', dbColumn: '', type: 'text', exclude: true }, // EXCLUDED
  { csvHeader: 'Co-Borrower Birthday', dbColumn: 'co_borrower_birthday', type: 'date' },
  { csvHeader: 'Co-Borrower Gender', dbColumn: 'co_borrower_gender', type: 'text' },
  { csvHeader: 'Co-Borrower Marital Status', dbColumn: 'co_borrower_marital_status', type: 'text' },
  { csvHeader: 'Co-Borrower Monthly Income', dbColumn: 'co_borrower_monthly_income', type: 'number' },
  { csvHeader: 'Co-Borrower Occupancy Type', dbColumn: 'co_borrower_occupancy_type', type: 'text' },
  { csvHeader: 'Co-Borrower Street Address', dbColumn: 'co_borrower_street_address', type: 'text' },
  { csvHeader: 'Co-Borrower Unit #', dbColumn: 'co_borrower_unit', type: 'text' },
  { csvHeader: 'Co-Borrower City', dbColumn: 'co_borrower_city', type: 'text' },
  { csvHeader: 'Co-Borrower State', dbColumn: 'co_borrower_state', type: 'text' },
  { csvHeader: 'Co-Borrower Zip', dbColumn: 'co_borrower_zip', type: 'text' },
  { csvHeader: 'Co-Borrower Mailing Address', dbColumn: 'co_borrower_mailing_address', type: 'text' },
  { csvHeader: 'Co-Borrower Self-Employed', dbColumn: 'co_borrower_self_employed', type: 'boolean' },
  { csvHeader: 'Co-Borrower Employer', dbColumn: 'co_borrower_employer', type: 'text' },
  { csvHeader: 'Other Co-Borrower(s)', dbColumn: 'other_co_borrowers', type: 'text' },

  // Agents
  { csvHeader: 'Seller Agent', dbColumn: 'seller_agent', type: 'text' },
  { csvHeader: 'Seller Agent Email', dbColumn: 'seller_agent_email', type: 'text' },
  { csvHeader: 'Seller Agent Phone', dbColumn: 'seller_agent_phone', type: 'text' },
  { csvHeader: 'Buyer Agent', dbColumn: 'buyer_agent', type: 'text' },
  { csvHeader: 'Buyer Agent Email', dbColumn: 'buyer_agent_email', type: 'text' },
  { csvHeader: 'Buyer Agent Phone', dbColumn: 'buyer_agent_phone', type: 'text' },
  { csvHeader: 'Seller Agent Company Name', dbColumn: 'seller_agent_company_name', type: 'text' },
  { csvHeader: 'Buyer Agent Company Name', dbColumn: 'buyer_agent_company_name', type: 'text' },

  // Appraiser
  { csvHeader: 'Appraiser Name', dbColumn: 'appraiser_name', type: 'text' },
  { csvHeader: 'Appraiser Email', dbColumn: 'appraiser_email', type: 'text' },
  { csvHeader: 'Appraiser Phone', dbColumn: 'appraiser_phone', type: 'text' },
  { csvHeader: 'Appraiser License #', dbColumn: 'appraiser_license', type: 'text' },

  // Loan Details
  { csvHeader: 'Loan Purpose', dbColumn: 'loan_purpose', type: 'text' },
  { csvHeader: 'Purchase Price', dbColumn: 'purchase_price', type: 'number' },
  { csvHeader: 'Total Loan Amount', dbColumn: 'total_loan_amount', type: 'number' },
  { csvHeader: 'Lien Position', dbColumn: 'lien_position', type: 'text' },
  { csvHeader: 'LTV', dbColumn: 'ltv', type: 'number' },
  { csvHeader: 'CLTV', dbColumn: 'cltv', type: 'number' },
  { csvHeader: 'HCLTV', dbColumn: 'hcltv', type: 'number' },
  { csvHeader: 'DTI', dbColumn: 'dti', type: 'number' },
  { csvHeader: 'Refinance Purpose Type', dbColumn: 'refinance_purpose_type', type: 'text' },
  { csvHeader: 'Refinance CashOut Amount', dbColumn: 'refinance_cashout_amount', type: 'number' },
  { csvHeader: 'Occupancy', dbColumn: 'occupancy', type: 'text' },
  { csvHeader: 'Property Type (Housing Type)', dbColumn: 'property_type', type: 'text' },
  { csvHeader: 'Attachment Type', dbColumn: 'attachment_type', type: 'text' },
  { csvHeader: 'Number of Units', dbColumn: 'number_of_units', type: 'integer' },
  { csvHeader: 'Construction Method', dbColumn: 'construction_method', type: 'text' },
  { csvHeader: 'Located in Project', dbColumn: 'located_in_project', type: 'boolean' },
  { csvHeader: 'Project Design Type', dbColumn: 'project_design_type', type: 'text' },
  { csvHeader: 'Construction Loan', dbColumn: 'construction_loan', type: 'boolean' },
  { csvHeader: 'Improvements', dbColumn: 'improvements', type: 'text' },
  { csvHeader: 'Improvement Costs', dbColumn: 'improvement_costs', type: 'number' },
  { csvHeader: 'Title', dbColumn: 'title', type: 'text' },

  // Subject Property
  { csvHeader: 'Subject Address Line 1', dbColumn: 'subject_address_line_1', type: 'text' },
  { csvHeader: 'Subject Address Line 2', dbColumn: 'subject_address_line_2', type: 'text' },
  { csvHeader: 'Apt/Unit #', dbColumn: 'subject_apt_unit', type: 'text' },
  { csvHeader: 'Subject City', dbColumn: 'subject_city', type: 'text' },
  { csvHeader: 'Subject County', dbColumn: 'subject_county', type: 'text' },
  { csvHeader: 'Subject ZIP', dbColumn: 'subject_zip', type: 'text' },
  { csvHeader: 'Subject State', dbColumn: 'subject_state', type: 'text' },
  { csvHeader: 'Subject Property', dbColumn: 'subject_property', type: 'text' },

  // Mortgage Details
  { csvHeader: 'Mortgage Type', dbColumn: 'mortgage_type', type: 'text' },
  { csvHeader: 'Interest Rate', dbColumn: 'interest_rate', type: 'number' },
  { csvHeader: 'Base Price', dbColumn: 'base_price', type: 'number' },
  { csvHeader: 'Points Adjustments', dbColumn: 'points_adjustments', type: 'number' },
  { csvHeader: 'Compensation Percentage', dbColumn: 'compensation_percentage', type: 'number' },
  { csvHeader: 'Net Discount Points', dbColumn: 'net_discount_points', type: 'number' },
  { csvHeader: 'Total Margin Adjustments', dbColumn: 'total_margin_adjustments', type: 'number' },
  { csvHeader: 'Origination Fees', dbColumn: 'origination_fees', type: 'number' },
  { csvHeader: 'Prepayment Penalty', dbColumn: 'prepayment_penalty', type: 'text' },
  { csvHeader: 'Escrow Impound Type', dbColumn: 'escrow_impound_type', type: 'text' },
  { csvHeader: 'Loan Product', dbColumn: 'loan_product', type: 'text' },
  { csvHeader: 'Amortization Type', dbColumn: 'amortization_type', type: 'text' },
  { csvHeader: 'Amortization Term', dbColumn: 'amortization_term', type: 'integer' },

  // Lender
  { csvHeader: 'Lender', dbColumn: 'lender_name', type: 'text' },
  { csvHeader: 'Lender NMLS', dbColumn: 'lender_nmls', type: 'text' },
  { csvHeader: 'Lender Loan #', dbColumn: 'lender_loan_number', type: 'text' },
  { csvHeader: 'Cure Amount', dbColumn: 'cure_amount', type: 'number' },

  // Payment Info
  { csvHeader: 'First Mortgage Payment', dbColumn: 'first_mortgage_payment', type: 'number' },
  { csvHeader: 'Homeowners Insurance', dbColumn: 'homeowners_insurance', type: 'number' },
  { csvHeader: 'Mortgage Insurance Payment', dbColumn: 'mortgage_insurance_payment', type: 'number' },
  { csvHeader: 'HOA Dues', dbColumn: 'hoa_dues', type: 'number' },
  { csvHeader: 'Supplemental Property Insurance', dbColumn: 'supplemental_property_insurance', type: 'number' },
  { csvHeader: 'Property Tax', dbColumn: 'property_tax', type: 'number' },
  { csvHeader: 'Total Housing Payment', dbColumn: 'total_housing_payment', type: 'number' },
  { csvHeader: 'Appraised Value', dbColumn: 'appraised_value', type: 'number' },

  // Underwriting
  { csvHeader: 'AUS', dbColumn: 'aus', type: 'text' },
  { csvHeader: 'Lock Date', dbColumn: 'lock_date', type: 'date' },
  { csvHeader: 'Lock Expiration', dbColumn: 'lock_expiration', type: 'date' },
  { csvHeader: 'Lock Expiration Timezone', dbColumn: 'lock_expiration_timezone', type: 'text' },
  { csvHeader: 'Stage Name', dbColumn: 'stage_name', type: 'text' },

  // Loan Officers
  { csvHeader: 'Primary Loan Officer Name', dbColumn: 'primary_loan_officer_name', type: 'text' },
  { csvHeader: 'Primary Loan Officer Email', dbColumn: 'primary_loan_officer_email', type: 'text' },
  { csvHeader: 'Primary Loan Officer NMLS', dbColumn: 'primary_loan_officer_nmls', type: 'text' },
  { csvHeader: 'Primary Loan Officer Assistant Name', dbColumn: 'primary_loan_officer_assistant_name', type: 'text' },
  { csvHeader: 'Primary Loan Officer Assistant Email', dbColumn: 'primary_loan_officer_assistant_email', type: 'text' },
  { csvHeader: 'Primary Loan Processor Name', dbColumn: 'primary_loan_processor_name', type: 'text' },
  { csvHeader: 'Primary Loan Processor Email', dbColumn: 'primary_loan_processor_email', type: 'text' },
  { csvHeader: 'Loan Officer #2 Name', dbColumn: 'loan_officer_2_name', type: 'text' },
  { csvHeader: 'Loan Officer #2 Email', dbColumn: 'loan_officer_2_email', type: 'text' },
  { csvHeader: 'Loan Officer #2 NMLS', dbColumn: 'loan_officer_2_nmls', type: 'text' },
  { csvHeader: 'Loan Officer #3 Name', dbColumn: 'loan_officer_3_name', type: 'text' },
  { csvHeader: 'Loan Officer #3 Email', dbColumn: 'loan_officer_3_email', type: 'text' },
  { csvHeader: 'Loan Officer #3 NMLS', dbColumn: 'loan_officer_3_nmls', type: 'text' },
  { csvHeader: 'Other Loan Officer(s)', dbColumn: 'other_loan_officers', type: 'text' },
  { csvHeader: 'Loan Officer Assistant #2 Name', dbColumn: 'loan_officer_assistant_2_name', type: 'text' },
  { csvHeader: 'Loan Officer Assistant #2 Email', dbColumn: 'loan_officer_assistant_2_email', type: 'text' },
  { csvHeader: 'Loan Officer Assistant #3 Name', dbColumn: 'loan_officer_assistant_3_name', type: 'text' },
  { csvHeader: 'Loan Officer Assistant #3 Email', dbColumn: 'loan_officer_assistant_3_email', type: 'text' },
  { csvHeader: 'Other Loan Officer Assistants(s)', dbColumn: 'other_loan_officer_assistants', type: 'text' },
  { csvHeader: 'Loan Processor #2 Name', dbColumn: 'loan_processor_2_name', type: 'text' },
  { csvHeader: 'Loan Processor #2 Email', dbColumn: 'loan_processor_2_email', type: 'text' },
  { csvHeader: 'Loan Processor #3 Name', dbColumn: 'loan_processor_3_name', type: 'text' },
  { csvHeader: 'Loan Processor #3 Email', dbColumn: 'loan_processor_3_email', type: 'text' },
  { csvHeader: 'Other Loan Processor(s)', dbColumn: 'other_loan_processors', type: 'text' },

  // Compensation & Revenue
  { csvHeader: 'Compensation Amount', dbColumn: 'compensation_amount', type: 'number' },
  { csvHeader: 'Payer Type', dbColumn: 'payer_type', type: 'text' },
  { csvHeader: 'Company Margin', dbColumn: 'company_margin', type: 'number' },
  { csvHeader: 'Lender Credit (Non-Del)', dbColumn: 'lender_credit_non_del', type: 'number' },
  { csvHeader: 'Net SRP Amount', dbColumn: 'net_srp_amount', type: 'number' },
  { csvHeader: 'Investor Holdback', dbColumn: 'investor_holdback', type: 'number' },
  { csvHeader: 'Other Adjustments', dbColumn: 'other_adjustments', type: 'number' },
  { csvHeader: 'Pass Through Fees', dbColumn: 'pass_through_fees', type: 'number' },
  { csvHeader: 'Broker/Non-Del Fee', dbColumn: 'broker_non_del_fee', type: 'number' },
  { csvHeader: 'Final Discount Point Amount', dbColumn: 'final_discount_point_amount', type: 'number' },
  { csvHeader: 'Net Loan Revenue', dbColumn: 'net_loan_revenue', type: 'number' },
  { csvHeader: 'Gross Loan Revenue', dbColumn: 'gross_loan_revenue', type: 'number' },

  // Milestone Dates
  { csvHeader: 'Registration Status', dbColumn: 'registration_status', type: 'text' },
  { csvHeader: 'POS App Date', dbColumn: 'pos_app_date', type: 'date' },
  { csvHeader: 'App/TRID Completed Date', dbColumn: 'app_trid_completed_date', type: 'date' },
  { csvHeader: 'App Intake', dbColumn: 'app_intake_date', type: 'date' },
  { csvHeader: 'PreApproval Date', dbColumn: 'preapproval_date', type: 'date' },
  { csvHeader: 'Qualification', dbColumn: 'qualification_date', type: 'date' },
  { csvHeader: 'Loan Setup', dbColumn: 'loan_setup_date', type: 'date' },
  { csvHeader: 'Disclosed', dbColumn: 'disclosed_date', type: 'date' },
  { csvHeader: 'Submit to Underwriting', dbColumn: 'submit_to_underwriting_date', type: 'date' },
  { csvHeader: 'Approved with Conditions', dbColumn: 'approved_with_conditions_date', type: 'date' },
  { csvHeader: 'Re Submittal Date', dbColumn: 're_submittal_date', type: 'date' },
  { csvHeader: 'Clear To Close', dbColumn: 'clear_to_close_date', type: 'date' },
  { csvHeader: 'Docs Out', dbColumn: 'docs_out_date', type: 'date' },
  { csvHeader: 'Loan Funded', dbColumn: 'loan_funded_date', type: 'date' },
  { csvHeader: 'Docs Signed / Loan Closed', dbColumn: 'docs_signed_loan_closed_date', type: 'date' },
  { csvHeader: 'Broker Check Received Date', dbColumn: 'broker_check_received_date', type: 'date' },
  { csvHeader: 'Loan Finalized Date', dbColumn: 'loan_finalized_date', type: 'date' },
  { csvHeader: 'Suspended', dbColumn: 'suspended_date', type: 'date' },
  { csvHeader: 'Adverse', dbColumn: 'adverse_date', type: 'date' },
  { csvHeader: 'Adverse Reason', dbColumn: 'adverse_reason', type: 'text' },
  { csvHeader: 'Estimated Closing Date', dbColumn: 'estimated_closing_date', type: 'date' },
  { csvHeader: 'Estimated First Payment Date', dbColumn: 'estimated_first_payment_date', type: 'date' },

  // Contingencies & Compliance Dates
  { csvHeader: 'Loan Contingency', dbColumn: 'loan_contingency', type: 'date' },
  { csvHeader: 'Appraisal Contingency', dbColumn: 'appraisal_contingency', type: 'date' },
  { csvHeader: 'Credit Order Date', dbColumn: 'credit_order_date', type: 'date' },
  { csvHeader: 'Credit Expiration Date', dbColumn: 'credit_expiration_date', type: 'date' },
  { csvHeader: 'Tax Transcript Ordered Date', dbColumn: 'tax_transcript_ordered_date', type: 'date' },
  { csvHeader: 'Tax Transcript Received Date', dbColumn: 'tax_transcript_received_date', type: 'date' },
  { csvHeader: 'Appraisal Ordered Date', dbColumn: 'appraisal_ordered_date', type: 'date' },
  { csvHeader: 'Appraisal Completed Date', dbColumn: 'appraisal_completed_date', type: 'date' },
  { csvHeader: 'Appraisal Waiver Date', dbColumn: 'appraisal_waiver_date', type: 'date' },
  { csvHeader: 'Title Ordered Date', dbColumn: 'title_ordered_date', type: 'date' },
  { csvHeader: 'Title Received Date', dbColumn: 'title_received_date', type: 'date' },
  { csvHeader: 'HOI Ordered Date', dbColumn: 'hoi_ordered_date', type: 'date' },
  { csvHeader: 'HOI Received Date', dbColumn: 'hoi_received_date', type: 'date' },

  // Disclosure Dates
  { csvHeader: 'Initial LE Sent', dbColumn: 'initial_le_sent', type: 'date' },
  { csvHeader: 'Initial LE Signed', dbColumn: 'initial_le_signed', type: 'date' },
  { csvHeader: 'Most Recent LE Sent', dbColumn: 'most_recent_le_sent', type: 'date' },
  { csvHeader: 'Most Recent LE Signed', dbColumn: 'most_recent_le_signed', type: 'date' },
  { csvHeader: 'Intent to Proceed', dbColumn: 'intent_to_proceed', type: 'date' },
  { csvHeader: 'Initial CD Sent', dbColumn: 'initial_cd_sent', type: 'date' },
  { csvHeader: 'Initial CD Signed', dbColumn: 'initial_cd_signed', type: 'date' },
  { csvHeader: 'Pre Approval Expiry Date', dbColumn: 'pre_approval_expiry_date', type: 'date' },
  { csvHeader: 'Most Recent CD Sent', dbColumn: 'most_recent_cd_sent', type: 'date' },
  { csvHeader: 'Most Recent CD Signed', dbColumn: 'most_recent_cd_signed', type: 'date' },
  { csvHeader: 'First Payment Date', dbColumn: 'first_payment_date', type: 'date' },
  { csvHeader: 'Date to Avoid EPO', dbColumn: 'date_to_avoid_epo', type: 'date' },
  { csvHeader: 'VOE Received Date', dbColumn: 'voe_received_date', type: 'date' },
  { csvHeader: 'VOE Expiration Date', dbColumn: 'voe_expiration_date', type: 'date' },

  // Lead Source & Referral
  { csvHeader: 'Lead Source', dbColumn: 'lead_source', type: 'text' },
  { csvHeader: 'Referral Contact Name', dbColumn: 'referral_contact_name', type: 'text' },
  { csvHeader: 'Referral Contact Email', dbColumn: 'referral_contact_email', type: 'text' },
  { csvHeader: 'Referral Contact Phone', dbColumn: 'referral_contact_phone', type: 'text' },
  { csvHeader: 'Referral Contact Description', dbColumn: 'referral_contact_description', type: 'text' },
  { csvHeader: 'Lead Provided By', dbColumn: 'lead_provided_by', type: 'text' },
  { csvHeader: 'Channel', dbColumn: 'channel', type: 'text' },

  // Additional Fields
  { csvHeader: 'MERS MIN', dbColumn: 'mers_min', type: 'text' },
  { csvHeader: 'Archive Indicator', dbColumn: 'archive_indicator', type: 'boolean' },
  { csvHeader: 'APR', dbColumn: 'apr', type: 'number' },
  { csvHeader: 'Co-Borrower', dbColumn: 'co_borrower', type: 'text' },
  { csvHeader: 'Funded / Est. Closing Date', dbColumn: 'funded_est_closing_date', type: 'date' },
  { csvHeader: 'Financed Funding Fees', dbColumn: 'financed_funding_fees', type: 'number' },
  { csvHeader: 'Interest Rate Buydown', dbColumn: 'interest_rate_buydown', type: 'text' },
  { csvHeader: 'Loan Status Date', dbColumn: 'loan_status_date', type: 'date' },
  { csvHeader: 'Title Company', dbColumn: 'title_company', type: 'text' },
  { csvHeader: 'Closer Contact Name', dbColumn: 'closer_contact_name', type: 'text' },
  { csvHeader: 'Processing Type', dbColumn: 'processing_type', type: 'text' },
  { csvHeader: 'Keep Flag', dbColumn: 'keep_flag', type: 'text' },
];

// Create a lookup map for faster access
export const CSV_HEADER_TO_DB_COLUMN = new Map<string, ColumnMapping>(
  CSV_COLUMN_MAPPING.map(m => [m.csvHeader, m])
);

// Get list of excluded columns (for UI display)
export const EXCLUDED_COLUMNS = CSV_COLUMN_MAPPING
  .filter(m => m.exclude)
  .map(m => m.csvHeader);

// Helper to convert CSV value to appropriate type
export function convertValue(value: string, type: ColumnMapping['type']): unknown {
  if (!value || value.trim() === '') {
    return null;
  }

  const trimmed = value.trim();

  switch (type) {
    case 'number':
      const num = parseFloat(trimmed.replace(/,/g, ''));
      return isNaN(num) ? null : num;

    case 'integer':
      const int = parseInt(trimmed.replace(/,/g, ''), 10);
      return isNaN(int) ? null : int;

    case 'boolean':
      const lower = trimmed.toLowerCase();
      if (lower === 'true' || lower === 'yes' || lower === '1') return true;
      if (lower === 'false' || lower === 'no' || lower === '0') return false;
      return null;

    case 'date':
      // Handle various date formats from ARIVE
      if (!trimmed) return null;
      // Try parsing as ISO date first
      const isoDate = new Date(trimmed);
      if (!isNaN(isoDate.getTime())) {
        return isoDate.toISOString().split('T')[0]; // Return YYYY-MM-DD
      }
      // Try MM/DD/YYYY format
      const parts = trimmed.split('/');
      if (parts.length === 3) {
        const [month, day, year] = parts;
        const parsed = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(parsed.getTime())) {
          return parsed.toISOString().split('T')[0];
        }
      }
      return null;

    case 'text':
    default:
      return trimmed;
  }
}
