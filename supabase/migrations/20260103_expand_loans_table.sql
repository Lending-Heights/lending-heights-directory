-- Migration: Expand loans table to support full Pipeline Reports CSV data
-- Date: 2026-01-03
-- Purpose: Add all 220 columns from ARIVE Pipeline Reports (excluding SSN fields for security)
--
-- IMPORTANT: This migration adds columns for loan data imported via CSV upload.
-- SSN fields are intentionally excluded to protect PII.

-- ============================================================================
-- PRIMARY BORROWER INFO (excluding SSN)
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS primary_borrower text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS date_created timestamp with time zone;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS brokerage_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS brokerage_nmls text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS brokerage_branch_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS brokerage_branch_nmls text;
-- borrower_first_name already exists
-- borrower_last_name already exists
-- borrower_email already exists
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_home_phone text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_cell_phone text;
-- SSN EXCLUDED: Primary Borrower SSN
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_birthday date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_fico integer;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_gender text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_marital_status text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_monthly_income numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_occupancy_type text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_street_address text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_unit text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_city text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_state text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_zip text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_mailing_address text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_self_employed boolean;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS borrower_employer text;

-- ============================================================================
-- CO-BORROWER INFO (excluding SSN)
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_first_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_last_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_home_phone text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_cell_phone text;
-- SSN EXCLUDED: Co-Borrower SSN
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_birthday date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_gender text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_marital_status text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_monthly_income numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_occupancy_type text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_street_address text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_unit text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_city text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_state text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_zip text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_mailing_address text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_self_employed boolean;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower_employer text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS other_co_borrowers text;

-- ============================================================================
-- AGENT INFO
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS seller_agent text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS seller_agent_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS seller_agent_phone text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS buyer_agent text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS buyer_agent_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS buyer_agent_phone text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS seller_agent_company_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS buyer_agent_company_name text;

-- ============================================================================
-- APPRAISER INFO
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS appraiser_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS appraiser_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS appraiser_phone text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS appraiser_license text;

-- ============================================================================
-- LOAN DETAILS
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_purpose text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS purchase_price numeric;
-- total_loan_amount already exists
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lien_position text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS ltv numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS cltv numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS hcltv numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS dti numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS refinance_purpose_type text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS refinance_cashout_amount numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS occupancy text;
-- property_type already exists (as property_type)
ALTER TABLE loans ADD COLUMN IF NOT EXISTS attachment_type text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS number_of_units integer;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS construction_method text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS located_in_project boolean;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS project_design_type text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS construction_loan boolean;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS improvements text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS improvement_costs numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS title text;

-- ============================================================================
-- SUBJECT PROPERTY
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS subject_address_line_1 text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS subject_address_line_2 text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS subject_apt_unit text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS subject_city text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS subject_county text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS subject_zip text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS subject_state text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS subject_property text;

-- ============================================================================
-- MORTGAGE DETAILS
-- ============================================================================
-- mortgage_type already exists
ALTER TABLE loans ADD COLUMN IF NOT EXISTS interest_rate numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS base_price numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS points_adjustments numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS compensation_percentage numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS net_discount_points numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS total_margin_adjustments numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS origination_fees numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS prepayment_penalty text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS escrow_impound_type text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_product text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS amortization_type text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS amortization_term integer;

-- ============================================================================
-- LENDER INFO
-- ============================================================================
-- lender_name already exists
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lender_nmls text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lender_loan_number text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS cure_amount numeric;

-- ============================================================================
-- PAYMENT INFO
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS first_mortgage_payment numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS homeowners_insurance numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS mortgage_insurance_payment numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS hoa_dues numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS supplemental_property_insurance numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS property_tax numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS total_housing_payment numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS appraised_value numeric;

-- ============================================================================
-- UNDERWRITING
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS aus text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lock_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lock_expiration date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lock_expiration_timezone text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS stage_name text;

-- ============================================================================
-- LOAN OFFICERS
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS primary_loan_officer_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS primary_loan_officer_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS primary_loan_officer_nmls text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS primary_loan_officer_assistant_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS primary_loan_officer_assistant_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS primary_loan_processor_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS primary_loan_processor_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_officer_2_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_officer_2_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_officer_2_nmls text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_officer_3_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_officer_3_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_officer_3_nmls text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS other_loan_officers text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_officer_assistant_2_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_officer_assistant_2_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_officer_assistant_3_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_officer_assistant_3_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS other_loan_officer_assistants text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_processor_2_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_processor_2_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_processor_3_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_processor_3_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS other_loan_processors text;

-- ============================================================================
-- COMPENSATION & REVENUE
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS compensation_amount numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS payer_type text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS company_margin numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lender_credit_non_del numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS net_srp_amount numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS investor_holdback numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS other_adjustments numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS pass_through_fees numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS broker_non_del_fee numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS final_discount_point_amount numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS net_loan_revenue numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS gross_loan_revenue numeric;

-- ============================================================================
-- MILESTONE DATES
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS registration_status text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS pos_app_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS app_trid_completed_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS app_intake_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS preapproval_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS qualification_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_setup_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS disclosed_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS submit_to_underwriting_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS approved_with_conditions_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS re_submittal_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS clear_to_close_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS docs_out_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_funded_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS docs_signed_loan_closed_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS broker_check_received_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_finalized_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS suspended_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS adverse_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS adverse_reason text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS estimated_closing_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS estimated_first_payment_date date;

-- ============================================================================
-- CONTINGENCIES & COMPLIANCE DATES
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_contingency date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS appraisal_contingency date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS credit_order_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS credit_expiration_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS tax_transcript_ordered_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS tax_transcript_received_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS appraisal_ordered_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS appraisal_completed_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS appraisal_waiver_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS title_ordered_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS title_received_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS hoi_ordered_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS hoi_received_date date;

-- ============================================================================
-- DISCLOSURE DATES
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS initial_le_sent date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS initial_le_signed date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS most_recent_le_sent date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS most_recent_le_signed date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS intent_to_proceed date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS initial_cd_sent date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS initial_cd_signed date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS pre_approval_expiry_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS most_recent_cd_sent date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS most_recent_cd_signed date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS first_payment_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS date_to_avoid_epo date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS voe_received_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS voe_expiration_date date;

-- ============================================================================
-- LEAD SOURCE & REFERRAL
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lead_source text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS referral_contact_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS referral_contact_email text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS referral_contact_phone text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS referral_contact_description text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS lead_provided_by text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS channel text;

-- ============================================================================
-- ADDITIONAL FIELDS
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS mers_min text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS archive_indicator boolean;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS apr numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS co_borrower text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS funded_est_closing_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS financed_funding_fees numeric;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS interest_rate_buydown text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS loan_status_date date;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS title_company text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS closer_contact_name text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS processing_type text;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS keep_flag text;

-- ============================================================================
-- SYNC METADATA
-- ============================================================================
ALTER TABLE loans ADD COLUMN IF NOT EXISTS csv_import_date timestamp with time zone;
ALTER TABLE loans ADD COLUMN IF NOT EXISTS csv_row_number integer;

-- ============================================================================
-- UPDATE sync_logs TABLE TO FIX NOT-NULL CONSTRAINT ERROR
-- ============================================================================
ALTER TABLE sync_logs ADD COLUMN IF NOT EXISTS sync_type text DEFAULT 'csv';
UPDATE sync_logs SET sync_type = 'api' WHERE sync_type IS NULL;

-- ============================================================================
-- CREATE INDEX FOR FASTER QUERIES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_loans_stage_name ON loans(stage_name);
CREATE INDEX IF NOT EXISTS idx_loans_primary_loan_officer ON loans(primary_loan_officer_name);
CREATE INDEX IF NOT EXISTS idx_loans_loan_funded_date ON loans(loan_funded_date);
CREATE INDEX IF NOT EXISTS idx_loans_estimated_closing_date ON loans(estimated_closing_date);
CREATE INDEX IF NOT EXISTS idx_loans_date_created ON loans(date_created);

-- ============================================================================
-- RLS POLICY FOR CSV UPLOADS (authenticated users only)
-- ============================================================================
-- Note: You may need to adjust these based on your auth setup
-- These policies ensure only authenticated users can access loan data

-- Enable RLS if not already enabled
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read loans
DROP POLICY IF EXISTS "Authenticated users can read loans" ON loans;
CREATE POLICY "Authenticated users can read loans" ON loans
  FOR SELECT TO authenticated USING (true);

-- Policy for authenticated users to insert loans (for CSV import)
DROP POLICY IF EXISTS "Authenticated users can insert loans" ON loans;
CREATE POLICY "Authenticated users can insert loans" ON loans
  FOR INSERT TO authenticated WITH CHECK (true);

-- Policy for authenticated users to update loans
DROP POLICY IF EXISTS "Authenticated users can update loans" ON loans;
CREATE POLICY "Authenticated users can update loans" ON loans
  FOR UPDATE TO authenticated USING (true);

-- Policy for service role (for server-side operations)
DROP POLICY IF EXISTS "Service role has full access to loans" ON loans;
CREATE POLICY "Service role has full access to loans" ON loans
  FOR ALL TO service_role USING (true);

COMMENT ON TABLE loans IS 'Loan pipeline data imported from ARIVE via CSV upload. SSN fields are intentionally excluded for security.';
