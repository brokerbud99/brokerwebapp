 --- Drop existing table with CASCADE to handle dependencies
DROP TABLE IF EXISTS public.document_analysis_ai CASCADE;

-- Create table with new application_id column
CREATE TABLE public.document_analysis_ai (
  id bigserial NOT NULL,
  company_code text NOT NULL,
  user_email text NOT NULL,
  application_id text NULL,
  document_type text NOT NULL,
  document_name text NOT NULL,
  s3_document_url text NOT NULL,
  file_size bigint NULL,
  mime_type text NULL,
  upload_date timestamp with time zone NULL DEFAULT now(),
  result_ai jsonb NULL,
  created_at timestamp with time zone NULL DEFAULT now(),
  updated_at timestamp with time zone NULL DEFAULT now(),
  adhoc text NULL,
  doc_status text NULL,
  response_time text NULL,
  CONSTRAINT document_analysis_ai_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_document_analysis_ai_company_code 
  ON public.document_analysis_ai USING btree (company_code) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_document_analysis_ai_document_type 
  ON public.document_analysis_ai USING btree (document_type) TABLESPACE pg_default;

-- Create trigger
CREATE TRIGGER update_document_analysis_ai_updated_at_trigger 
  BEFORE UPDATE ON document_analysis_ai 
  FOR EACH ROW
  EXECUTE FUNCTION update_document_analysis_ai_updated_at();

create table public.application (
  id bigserial not null,
  application_id character varying(255) not null,
  lead_id character varying(255) not null,
  company_code character varying(100) not null,
  user_email character varying(255) not null,
  modified_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  constraint application_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_lead_id on public.application using btree (lead_id) TABLESPACE pg_default;

create index IF not exists idx_company_code on public.application using btree (company_code) TABLESPACE pg_default;

create index IF not exists idx_user_email on public.application using btree (user_email) TABLESPACE pg_default;

create trigger update_application_modified_at BEFORE
update on application for EACH row
execute FUNCTION update_modified_at_column ();

create table public.leads (
  id bigserial not null,
  company_code text not null,
  user_email text not null,
  lead_number text not null,
  lead_source text null,
  lead_status text not null,
  referrer_name text null,
  first_name text not null,
  last_name text not null,
  email text null,
  mobile_phone text null,
  alternative_phone text null,
  preferred_contact_method text null,
  best_time_to_contact text null,
  loan_purpose text null,
  property_type text null,
  estimated_loan_amount numeric(12, 2) null,
  estimated_property_value numeric(12, 2) null,
  employment_status text null,
  approximate_annual_income_range text null,
  current_location text null,
  property_location text null,
  is_first_home_buyer boolean null,
  expected_settlement_timeline text null,
  urgency_level text null,
  pre_approval_needed boolean null,
  notes text null,
  tags text[] null,
  credit_issues_known text null,
  existing_property_owner boolean null,
  deposit_available_range text null,
  current_lender text null,
  number_of_dependents integer null,
  marketing_consent boolean null default false,
  assigned_broker uuid null,
  last_contact_date timestamp with time zone null,
  next_followup_date timestamp with time zone null,
  converted_to_application_date timestamp with time zone null,
  conversion_status text null,
  created_at timestamp with time zone null default now(),
  created_by uuid null,
  updated_at timestamp with time zone null default now(),
  updated_by uuid null,
  constraint leads_pkey primary key (id),
  constraint leads_lead_number_key unique (lead_number),
  constraint leads_assigned_broker_fkey foreign KEY (assigned_broker) references auth.users (id),
  constraint leads_created_by_fkey foreign KEY (created_by) references auth.users (id),
  constraint leads_updated_by_fkey foreign KEY (updated_by) references auth.users (id)
) TABLESPACE pg_default;

create index IF not exists idx_leads_company_code on public.leads using btree (company_code) TABLESPACE pg_default;

create index IF not exists idx_leads_user_email on public.leads using btree (user_email) TABLESPACE pg_default;

create index IF not exists idx_leads_lead_status on public.leads using btree (lead_status) TABLESPACE pg_default;

create index IF not exists idx_leads_assigned_broker on public.leads using btree (assigned_broker) TABLESPACE pg_default;

create index IF not exists idx_leads_created_at on public.leads using btree (created_at) TABLESPACE pg_default;

create trigger set_leads_company_code_email BEFORE INSERT on leads for EACH row
execute FUNCTION set_company_code_and_email ();

create trigger set_leads_created_by BEFORE INSERT on leads for EACH row
execute FUNCTION set_created_by_column ();

create trigger update_leads_updated_at BEFORE
update on leads for EACH row
execute FUNCTION update_updated_at_and_by_column ();