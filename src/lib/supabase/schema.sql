-- Drop existing tables if they exist (in correct order due to dependencies)
DROP TABLE IF EXISTS application_third_parties CASCADE;
DROP TABLE IF EXISTS application_documents CASCADE;
DROP TABLE IF EXISTS application_lender_submissions CASCADE;
DROP TABLE IF EXISTS application_expenses CASCADE;
DROP TABLE IF EXISTS applicant_assets CASCADE;
DROP TABLE IF EXISTS applicant_liabilities CASCADE;
DROP TABLE IF EXISTS application_properties CASCADE;
DROP TABLE IF EXISTS application_loan_details CASCADE;
DROP TABLE IF EXISTS applicant_income CASCADE;
DROP TABLE IF EXISTS applicant_employment CASCADE;
DROP TABLE IF EXISTS application_applicants CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS voice_records CASCADE;
DROP TABLE IF EXISTS document_ai_records CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Drop existing trigger functions
DROP FUNCTION IF EXISTS update_updated_at_and_by_column() CASCADE;
DROP FUNCTION IF EXISTS set_created_by_column() CASCADE;
DROP FUNCTION IF EXISTS set_company_code_and_email() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- User Profiles table for SaaS multi-tenancy
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  phone TEXT,
  avatar_url TEXT,
  
  -- Company/Tenant identification
  company_code TEXT NOT NULL,
  company_name TEXT,
  company_abn TEXT,
  company_address JSONB,
  
  -- User role and permissions
  role TEXT NOT NULL DEFAULT 'viewer', -- 'admin', 'broker', 'assistant', 'viewer'
  permissions JSONB,
  
  -- User status
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  
  -- Subscription/License info (for SaaS)
  license_type TEXT, -- 'trial', 'basic', 'professional', 'enterprise'
  license_expires_at TIMESTAMPTZ,
  max_applications INTEGER,
  
  -- Preferences
  timezone TEXT DEFAULT 'Australia/Sydney',
  date_format TEXT DEFAULT 'DD/MM/YYYY',
  language TEXT DEFAULT 'en',
  notification_preferences JSONB,
  
  -- Metadata
  metadata JSONB,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Leads table
CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  lead_number TEXT UNIQUE NOT NULL,
  lead_source TEXT,
  lead_status TEXT NOT NULL,
  referrer_name TEXT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  mobile_phone TEXT,
  alternative_phone TEXT,
  preferred_contact_method TEXT,
  best_time_to_contact TEXT,
  loan_purpose TEXT,
  property_type TEXT,
  estimated_loan_amount DECIMAL(12,2),
  estimated_property_value DECIMAL(12,2),
  employment_status TEXT,
  approximate_annual_income_range TEXT,
  current_location TEXT,
  property_location TEXT,
  is_first_home_buyer BOOLEAN,
  expected_settlement_timeline TEXT,
  urgency_level TEXT,
  pre_approval_needed BOOLEAN,
  notes TEXT,
  tags TEXT[],
  credit_issues_known TEXT,
  existing_property_owner BOOLEAN,
  deposit_available_range TEXT,
  current_lender TEXT,
  number_of_dependents INTEGER,
  marketing_consent BOOLEAN DEFAULT false,
  assigned_broker UUID REFERENCES auth.users(id),
  last_contact_date TIMESTAMPTZ,
  next_followup_date TIMESTAMPTZ,
  converted_to_application_date TIMESTAMPTZ,
  conversion_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Main Applications table
CREATE TABLE applications (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_number TEXT UNIQUE NOT NULL,
  lead_id BIGINT REFERENCES leads(id),
  application_status TEXT NOT NULL,
  loan_purpose TEXT,
  expected_settlement_date DATE,
  actual_settlement_date DATE,
  assigned_broker UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Applicants table
CREATE TABLE application_applicants (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  applicant_type TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  email TEXT,
  mobile TEXT,
  marital_status TEXT,
  dependents INTEGER,
  current_address JSONB,
  previous_addresses JSONB[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Employment details
CREATE TABLE applicant_employment (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  applicant_id BIGINT REFERENCES application_applicants(id) ON DELETE CASCADE,
  employment_type TEXT NOT NULL,
  employer_name TEXT,
  job_title TEXT,
  industry TEXT,
  start_date DATE,
  annual_income DECIMAL(12,2),
  is_primary_employment BOOLEAN DEFAULT true,
  abn TEXT,
  years_in_business DECIMAL(4,1),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Income sources
CREATE TABLE applicant_income (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  applicant_id BIGINT REFERENCES application_applicants(id) ON DELETE CASCADE,
  income_type TEXT NOT NULL,
  source_description TEXT,
  amount DECIMAL(12,2),
  frequency TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Loan details
CREATE TABLE application_loan_details (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  loan_amount DECIMAL(12,2),
  loan_term INTEGER,
  loan_type TEXT,
  repayment_type TEXT,
  interest_rate_type TEXT,
  split_ratio DECIMAL(5,2),
  lvr DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Property details
CREATE TABLE application_properties (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  property_address JSONB NOT NULL,
  property_type TEXT,
  property_value DECIMAL(12,2),
  purchase_price DECIMAL(12,2),
  property_purpose TEXT,
  property_condition TEXT,
  settlement_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Liabilities
CREATE TABLE applicant_liabilities (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  applicant_id BIGINT REFERENCES application_applicants(id) ON DELETE CASCADE,
  liability_type TEXT NOT NULL,
  lender_name TEXT,
  account_number TEXT,
  outstanding_balance DECIMAL(12,2),
  credit_limit DECIMAL(12,2),
  monthly_payment DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Assets
CREATE TABLE applicant_assets (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  applicant_id BIGINT REFERENCES application_applicants(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL,
  description TEXT,
  estimated_value DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Expenses
CREATE TABLE application_expenses (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  applicant_id BIGINT REFERENCES application_applicants(id),
  expense_type TEXT NOT NULL,
  amount DECIMAL(12,2),
  frequency TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Lender submissions
CREATE TABLE application_lender_submissions (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  lender_name TEXT NOT NULL,
  submission_status TEXT,
  submission_date DATE,
  reference_number TEXT,
  conditional_approval_date DATE,
  formal_approval_date DATE,
  conditions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Documents
CREATE TABLE application_documents (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  applicant_id BIGINT REFERENCES application_applicants(id),
  document_type TEXT NOT NULL,
  document_name TEXT,
  file_url TEXT,
  received_date DATE,
  status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Third parties
CREATE TABLE application_third_parties (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  party_type TEXT NOT NULL,
  company_name TEXT,
  contact_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Voice AI Records
CREATE TABLE voice_records (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  applicant_id BIGINT REFERENCES application_applicants(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL,
  call_direction TEXT,
  call_duration INTEGER,
  s3_audio_url TEXT NOT NULL,
  transcription TEXT,
  transcription_status TEXT,
  ai_summary TEXT,
  ai_sentiment TEXT,
  ai_extracted_data JSONB,
  ai_action_items JSONB,
  call_date TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  CONSTRAINT voice_records_check CHECK (
    (lead_id IS NOT NULL AND applicant_id IS NULL) OR 
    (lead_id IS NULL AND applicant_id IS NOT NULL)
  )
);

-- Document AI Records
CREATE TABLE document_ai_records (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  applicant_id BIGINT REFERENCES application_applicants(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  s3_document_url TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  processing_status TEXT,
  ai_extracted_data JSONB,
  ai_confidence_score DECIMAL(3,2),
  ai_validation_status TEXT,
  ai_validation_notes TEXT,
  ai_document_classification TEXT,
  ai_detected_issues JSONB,
  ai_processing_time INTEGER,
  processed_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Trigger function to auto-update updated_at and updated_by
CREATE OR REPLACE FUNCTION update_updated_at_and_by_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to auto-set created_by on INSERT
CREATE OR REPLACE FUNCTION set_created_by_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function to auto-set company_code and user_email from user profile
CREATE OR REPLACE FUNCTION set_company_code_and_email()
RETURNS TRIGGER AS $$
BEGIN
  SELECT company_code, user_email INTO NEW.company_code, NEW.user_email
  FROM user_profiles
  WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



-- Apply UPDATE triggers to all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_applicants_updated_at BEFORE UPDATE ON application_applicants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_applicant_employment_updated_at BEFORE UPDATE ON applicant_employment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_applicant_income_updated_at BEFORE UPDATE ON applicant_income
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_loan_details_updated_at BEFORE UPDATE ON application_loan_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_properties_updated_at BEFORE UPDATE ON application_properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_applicant_liabilities_updated_at BEFORE UPDATE ON applicant_liabilities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_applicant_assets_updated_at BEFORE UPDATE ON applicant_assets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_expenses_updated_at BEFORE UPDATE ON application_expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_lender_submissions_updated_at BEFORE UPDATE ON application_lender_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_documents_updated_at BEFORE UPDATE ON application_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_third_parties_updated_at BEFORE UPDATE ON application_third_parties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_voice_records_updated_at BEFORE UPDATE ON voice_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_document_ai_records_updated_at BEFORE UPDATE ON document_ai_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

-- Apply INSERT triggers for created_by
CREATE TRIGGER set_user_profiles_created_by BEFORE INSERT ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_leads_created_by BEFORE INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_applications_created_by BEFORE INSERT ON applications
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_applicants_created_by BEFORE INSERT ON application_applicants
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_applicant_employment_created_by BEFORE INSERT ON applicant_employment
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_applicant_income_created_by BEFORE INSERT ON applicant_income
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_loan_details_created_by BEFORE INSERT ON application_loan_details
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_properties_created_by BEFORE INSERT ON application_properties
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_applicant_liabilities_created_by BEFORE INSERT ON applicant_liabilities
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_applicant_assets_created_by BEFORE INSERT ON applicant_assets
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_expenses_created_by BEFORE INSERT ON application_expenses
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_lender_submissions_created_by BEFORE INSERT ON application_lender_submissions
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_documents_created_by BEFORE INSERT ON application_documents
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_third_parties_created_by BEFORE INSERT ON application_third_parties
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_voice_records_created_by BEFORE INSERT ON voice_records
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_document_ai_records_created_by BEFORE INSERT ON document_ai_records
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

-- Apply INSERT triggers for company_code and user_email (auto-populate from user profile)
CREATE TRIGGER set_leads_company_code_email BEFORE INSERT ON leads
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_applications_company_code_email BEFORE INSERT ON applications
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_applicants_company_code_email BEFORE INSERT ON application_applicants
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_applicant_employment_company_code_email BEFORE INSERT ON applicant_employment
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_applicant_income_company_code_email BEFORE INSERT ON applicant_income
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_loan_details_company_code_email BEFORE INSERT ON application_loan_details
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_properties_company_code_email BEFORE INSERT ON application_properties
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_applicant_liabilities_company_code_email BEFORE INSERT ON applicant_liabilities
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_applicant_assets_company_code_email BEFORE INSERT ON applicant_assets
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_expenses_company_code_email BEFORE INSERT ON application_expenses
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_lender_submissions_company_code_email BEFORE INSERT ON application_lender_submissions
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_documents_company_code_email BEFORE INSERT ON application_documents
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_third_parties_company_code_email BEFORE INSERT ON application_third_parties
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_voice_records_company_code_email BEFORE INSERT ON voice_records
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_document_ai_records_company_code_email BEFORE INSERT ON document_ai_records
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

-- Create indexes for better query performance
CREATE INDEX idx_user_profiles_company_code ON user_profiles(company_code);
CREATE INDEX idx_user_profiles_user_email ON user_profiles(user_email);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_is_active ON user_profiles(is_active);

CREATE INDEX idx_leads_company_code ON leads(company_code);
CREATE INDEX idx_leads_user_email ON leads(user_email);
CREATE INDEX idx_leads_lead_status ON leads(lead_status);
CREATE INDEX idx_leads_assigned_broker ON leads(assigned_broker);
CREATE INDEX idx_leads_created_at ON leads(created_at);

CREATE INDEX idx_applications_company_code ON applications(company_code);
CREATE INDEX idx_applications_user_email ON applications(user_email);
CREATE INDEX idx_applications_application_status ON applications(application_status);
CREATE INDEX idx_applications_assigned_broker ON applications(assigned_broker);
CREATE INDEX idx_applications_lead_id ON applications(lead_id);
CREATE INDEX idx_applications_created_at ON applications(created_at);

CREATE INDEX idx_application_applicants_company_code ON application_applicants(company_code);
CREATE INDEX idx_application_applicants_application_id ON application_applicants(application_id);

CREATE INDEX idx_applicant_employment_company_code ON applicant_employment(company_code);
CREATE INDEX idx_applicant_employment_applicant_id ON applicant_employment(applicant_id);

CREATE INDEX idx_applicant_income_company_code ON applicant_income(company_code);
CREATE INDEX idx_applicant_income_applicant_id ON applicant_income(applicant_id);

CREATE INDEX idx_application_loan_details_company_code ON application_loan_details(company_code);
CREATE INDEX idx_application_loan_details_application_id ON application_loan_details(application_id);

CREATE INDEX idx_application_properties_company_code ON application_properties(company_code);
CREATE INDEX idx_application_properties_application_id ON application_properties(application_id);

CREATE INDEX idx_applicant_liabilities_company_code ON applicant_liabilities(company_code);
CREATE INDEX idx_applicant_liabilities_applicant_id ON applicant_liabilities(applicant_id);

CREATE INDEX idx_applicant_assets_company_code ON applicant_assets(company_code);
CREATE INDEX idx_applicant_assets_applicant_id ON applicant_assets(applicant_id);

CREATE INDEX idx_application_expenses_company_code ON application_expenses(company_code);
CREATE INDEX idx_application_expenses_application_id ON application_expenses(application_id);

CREATE INDEX idx_application_lender_submissions_company_code ON application_lender_submissions(company_code);
CREATE INDEX idx_application_lender_submissions_application_id ON application_lender_submissions(application_id);

CREATE INDEX idx_application_documents_company_code ON application_documents(company_code);
CREATE INDEX idx_application_documents_application_id ON application_documents(application_id);

CREATE INDEX idx_application_third_parties_company_code ON application_third_parties(company_code);
CREATE INDEX idx_application_third_parties_application_id ON application_third_parties(application_id);

CREATE INDEX idx_voice_records_company_code ON voice_records(company_code);
CREATE INDEX idx_voice_records_lead_id ON voice_records(lead_id);
CREATE INDEX idx_voice_records_applicant_id ON voice_records(applicant_id);
CREATE INDEX idx_voice_records_call_date ON voice_records(call_date);

CREATE INDEX idx_document_ai_records_company_code ON document_ai_records(company_code);
CREATE INDEX idx_document_ai_records_application_id ON document_ai_records(application_id);
CREATE INDEX idx_document_ai_records_processing_status ON document_ai_records(processing_status);

-- Comments for documentation
COMMENT ON TABLE user_profiles IS 'User profiles with multi-tenant support via company_code';
COMMENT ON TABLE leads IS 'Stores lead information before conversion to application';
COMMENT ON TABLE applications IS 'Main application/case table for mortgage applications';
COMMENT ON TABLE voice_records IS 'Stores voice call recordings, transcriptions, and AI analysis';
COMMENT ON TABLE document_ai_records IS 'Stores application documents with AI extraction and validation';
COMMENT ON COLUMN user_profiles.company_code IS 'Unique identifier for tenant/company - isolates data between customers';


---------- second phase
-- ============================================
-- DROP EXISTING TABLES IF THEY EXIST
-- ============================================

DROP TABLE IF EXISTS application_stage_history CASCADE;
DROP TABLE IF EXISTS application_commissions CASCADE;
DROP TABLE IF EXISTS application_conditions CASCADE;
DROP TABLE IF EXISTS application_proposals CASCADE;
DROP TABLE IF EXISTS lender_products CASCADE;
DROP TABLE IF EXISTS application_communications CASCADE;
DROP TABLE IF EXISTS application_tasks CASCADE;

-- ============================================
-- 1. APPLICATION TASKS TABLE
-- ============================================

CREATE TABLE application_tasks (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL, -- 'followup', 'document_request', 'lender_call', 'settlement_coordination', 'client_meeting'
  task_title TEXT NOT NULL,
  task_description TEXT,
  task_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'completed', 'cancelled'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  assigned_to UUID REFERENCES auth.users(id),
  due_date DATE,
  completed_date TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  reminder_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  CONSTRAINT application_tasks_check CHECK (
    (application_id IS NOT NULL AND lead_id IS NULL) OR 
    (application_id IS NULL AND lead_id IS NOT NULL)
  )
);

CREATE INDEX idx_application_tasks_company_code ON application_tasks(company_code);
CREATE INDEX idx_application_tasks_user_email ON application_tasks(user_email);
CREATE INDEX idx_application_tasks_application_id ON application_tasks(application_id);
CREATE INDEX idx_application_tasks_lead_id ON application_tasks(lead_id);
CREATE INDEX idx_application_tasks_assigned_to ON application_tasks(assigned_to);
CREATE INDEX idx_application_tasks_task_status ON application_tasks(task_status);
CREATE INDEX idx_application_tasks_due_date ON application_tasks(due_date);
CREATE INDEX idx_application_tasks_priority ON application_tasks(priority);

COMMENT ON TABLE application_tasks IS 'Track follow-ups, to-dos, and workflow tasks for leads and applications';

-- ============================================
-- 2. APPLICATION COMMUNICATIONS TABLE
-- ============================================

CREATE TABLE application_communications (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  lead_id BIGINT REFERENCES leads(id) ON DELETE CASCADE,
  communication_type TEXT NOT NULL, -- 'email', 'phone', 'sms', 'meeting', 'note'
  direction TEXT, -- 'inbound', 'outbound'
  subject TEXT,
  content TEXT,
  contact_person TEXT, -- who was contacted (client, lender, solicitor)
  communication_date TIMESTAMPTZ DEFAULT NOW(),
  attachments JSONB, -- array of file URLs
  linked_document_id BIGINT REFERENCES application_documents(id),
  linked_voice_record_id BIGINT REFERENCES voice_records(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id),
  CONSTRAINT application_communications_check CHECK (
    (application_id IS NOT NULL AND lead_id IS NULL) OR 
    (application_id IS NULL AND lead_id IS NOT NULL)
  )
);

CREATE INDEX idx_application_communications_company_code ON application_communications(company_code);
CREATE INDEX idx_application_communications_user_email ON application_communications(user_email);
CREATE INDEX idx_application_communications_application_id ON application_communications(application_id);
CREATE INDEX idx_application_communications_lead_id ON application_communications(lead_id);
CREATE INDEX idx_application_communications_communication_date ON application_communications(communication_date);
CREATE INDEX idx_application_communications_communication_type ON application_communications(communication_type);

COMMENT ON TABLE application_communications IS 'Track all interactions and communications with clients, lenders, and third parties';

-- ============================================
-- 3. LENDER PRODUCTS TABLE
-- ============================================

CREATE TABLE lender_products (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  lender_name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_type TEXT, -- 'variable', 'fixed', 'split'
  interest_rate DECIMAL(5,4),
  comparison_rate DECIMAL(5,4),
  loan_type TEXT, -- 'owner-occupied', 'investment'
  repayment_type TEXT, -- 'P&I', 'interest-only'
  max_lvr DECIMAL(5,2),
  fees JSONB, -- {application_fee, annual_fee, discharge_fee, etc}
  features JSONB, -- {offset_account, redraw, extra_repayments, etc}
  eligibility_criteria JSONB, -- {min_income, employment_type, etc}
  is_active BOOLEAN DEFAULT true,
  effective_from DATE,
  effective_to DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_lender_products_company_code ON lender_products(company_code);
CREATE INDEX idx_lender_products_user_email ON lender_products(user_email);
CREATE INDEX idx_lender_products_lender_name ON lender_products(lender_name);
CREATE INDEX idx_lender_products_is_active ON lender_products(is_active);
CREATE INDEX idx_lender_products_loan_type ON lender_products(loan_type);

COMMENT ON TABLE lender_products IS 'Catalog of loan products from various lenders for comparison and proposal';

-- ============================================
-- 4. APPLICATION PROPOSALS TABLE
-- ============================================

CREATE TABLE application_proposals (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  lender_product_id BIGINT REFERENCES lender_products(id),
  lender_name TEXT, -- denormalized for convenience
  product_name TEXT, -- denormalized for convenience
  proposed_loan_amount DECIMAL(12,2),
  proposed_loan_term INTEGER,
  proposed_interest_rate DECIMAL(5,4),
  estimated_monthly_payment DECIMAL(12,2),
  estimated_total_fees DECIMAL(12,2),
  estimated_comparison_rate DECIMAL(5,4),
  pros TEXT,
  cons TEXT,
  recommendation_notes TEXT,
  is_selected BOOLEAN DEFAULT false,
  presented_to_client_date DATE,
  client_feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_application_proposals_company_code ON application_proposals(company_code);
CREATE INDEX idx_application_proposals_user_email ON application_proposals(user_email);
CREATE INDEX idx_application_proposals_application_id ON application_proposals(application_id);
CREATE INDEX idx_application_proposals_is_selected ON application_proposals(is_selected);

COMMENT ON TABLE application_proposals IS 'Multiple lender offers presented to client for comparison';

-- ============================================
-- 5. APPLICATION CONDITIONS TABLE
-- ============================================

CREATE TABLE application_conditions (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  lender_submission_id BIGINT REFERENCES application_lender_submissions(id) ON DELETE CASCADE,
  condition_type TEXT NOT NULL, -- 'pre-approval', 'conditional', 'settlement', 'general'
  condition_description TEXT NOT NULL,
  condition_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'in_progress', 'satisfied', 'waived', 'not_satisfied'
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  required_by_date DATE,
  satisfied_date DATE,
  satisfied_by UUID REFERENCES auth.users(id),
  satisfaction_notes TEXT,
  linked_document_id BIGINT REFERENCES application_documents(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_application_conditions_company_code ON application_conditions(company_code);
CREATE INDEX idx_application_conditions_user_email ON application_conditions(user_email);
CREATE INDEX idx_application_conditions_application_id ON application_conditions(application_id);
CREATE INDEX idx_application_conditions_lender_submission_id ON application_conditions(lender_submission_id);
CREATE INDEX idx_application_conditions_condition_status ON application_conditions(condition_status);
CREATE INDEX idx_application_conditions_required_by_date ON application_conditions(required_by_date);

COMMENT ON TABLE application_conditions IS 'Track lender conditions from conditional approval that need to be satisfied';

-- ============================================
-- 6. APPLICATION COMMISSIONS TABLE
-- ============================================

CREATE TABLE application_commissions (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  broker_id UUID REFERENCES auth.users(id),
  commission_type TEXT NOT NULL, -- 'upfront', 'trail'
  loan_amount DECIMAL(12,2),
  commission_rate DECIMAL(5,4), -- e.g., 0.0065 for 0.65%
  commission_amount DECIMAL(12,2),
  commission_status TEXT DEFAULT 'pending', -- 'pending', 'invoiced', 'received', 'clawed_back'
  expected_payment_date DATE,
  actual_payment_date DATE,
  payment_reference TEXT,
  invoice_number TEXT,
  clawback_date DATE,
  clawback_amount DECIMAL(12,2),
  clawback_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_application_commissions_company_code ON application_commissions(company_code);
CREATE INDEX idx_application_commissions_user_email ON application_commissions(user_email);
CREATE INDEX idx_application_commissions_application_id ON application_commissions(application_id);
CREATE INDEX idx_application_commissions_broker_id ON application_commissions(broker_id);
CREATE INDEX idx_application_commissions_commission_status ON application_commissions(commission_status);
CREATE INDEX idx_application_commissions_commission_type ON application_commissions(commission_type);
CREATE INDEX idx_application_commissions_expected_payment_date ON application_commissions(expected_payment_date);

COMMENT ON TABLE application_commissions IS 'Track expected and received commissions for business revenue management';

-- ============================================
-- 7. APPLICATION STAGE HISTORY TABLE
-- ============================================

CREATE TABLE application_stage_history (
  id BIGSERIAL PRIMARY KEY,
  company_code TEXT NOT NULL,
  user_email TEXT NOT NULL,
  application_id BIGINT REFERENCES applications(id) ON DELETE CASCADE,
  stage TEXT NOT NULL, -- 'consultation', 'assessment', 'lender_selection', 'document_collection', 'submission', 'lender_assessment', 'additional_info', 'approval', 'settlement'
  stage_status TEXT NOT NULL, -- 'started', 'in_progress', 'completed', 'on_hold', 'skipped'
  entered_stage_date TIMESTAMPTZ DEFAULT NOW(),
  exited_stage_date TIMESTAMPTZ,
  days_in_stage INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_application_stage_history_company_code ON application_stage_history(company_code);
CREATE INDEX idx_application_stage_history_user_email ON application_stage_history(user_email);
CREATE INDEX idx_application_stage_history_application_id ON application_stage_history(application_id);
CREATE INDEX idx_application_stage_history_stage ON application_stage_history(stage);
CREATE INDEX idx_application_stage_history_stage_status ON application_stage_history(stage_status);

COMMENT ON TABLE application_stage_history IS 'Track application progression through the 8-step business process with audit trail';

-- ============================================
-- APPLY UPDATE TRIGGERS TO ALL NEW TABLES
-- ============================================

CREATE TRIGGER update_application_tasks_updated_at BEFORE UPDATE ON application_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_communications_updated_at BEFORE UPDATE ON application_communications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_lender_products_updated_at BEFORE UPDATE ON lender_products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_proposals_updated_at BEFORE UPDATE ON application_proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_conditions_updated_at BEFORE UPDATE ON application_conditions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_commissions_updated_at BEFORE UPDATE ON application_commissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

CREATE TRIGGER update_application_stage_history_updated_at BEFORE UPDATE ON application_stage_history
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_and_by_column();

-- ============================================
-- APPLY INSERT TRIGGERS FOR created_by
-- ============================================

CREATE TRIGGER set_application_tasks_created_by BEFORE INSERT ON application_tasks
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_communications_created_by BEFORE INSERT ON application_communications
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_lender_products_created_by BEFORE INSERT ON lender_products
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_proposals_created_by BEFORE INSERT ON application_proposals
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_conditions_created_by BEFORE INSERT ON application_conditions
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_commissions_created_by BEFORE INSERT ON application_commissions
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

CREATE TRIGGER set_application_stage_history_created_by BEFORE INSERT ON application_stage_history
  FOR EACH ROW EXECUTE FUNCTION set_created_by_column();

-- ============================================
-- APPLY INSERT TRIGGERS FOR company_code AND user_email
-- ============================================

CREATE TRIGGER set_application_tasks_company_code_email BEFORE INSERT ON application_tasks
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_communications_company_code_email BEFORE INSERT ON application_communications
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_lender_products_company_code_email BEFORE INSERT ON lender_products
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_proposals_company_code_email BEFORE INSERT ON application_proposals
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_conditions_company_code_email BEFORE INSERT ON application_conditions
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_commissions_company_code_email BEFORE INSERT ON application_commissions
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();

CREATE TRIGGER set_application_stage_history_company_code_email BEFORE INSERT ON application_stage_history
  FOR EACH ROW EXECUTE FUNCTION set_company_code_and_email();