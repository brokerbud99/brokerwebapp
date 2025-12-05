# Supabase Integration Setup

This guide will help you set up Supabase for the BrokerBud web application.

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - Project Name: `brokerbud`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
5. Click "Create new project"
6. Wait for the project to finish setting up (~2 minutes)

## 2. Get Your API Keys

1. Go to Project Settings (gear icon) → API
2. Copy the following values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon/Public Key**: `eyJhbGci...` (safe to use in browser)
   - **Service Role Key**: `eyJhbGci...` (keep secret, server-only)

## 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your keys:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

3. Restart your dev server:
```bash
npm run dev
```

## 4. Create Database Tables

Run this SQL in the Supabase SQL Editor (Dashboard → SQL Editor):

```sql
-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    loan_amount NUMERIC,
    loan_purpose TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'lost')),
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create loan_applications table
CREATE TABLE IF NOT EXISTS public.loan_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    loan_amount NUMERIC NOT NULL,
    loan_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'on_hold')),
    stage TEXT,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    submitted_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    completed BOOLEAN DEFAULT false,
    assignee TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);

CREATE INDEX idx_applications_user_id ON public.loan_applications(user_id);
CREATE INDEX idx_applications_status ON public.loan_applications(status);
CREATE INDEX idx_applications_lead_id ON public.loan_applications(lead_id);

CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_completed ON public.tasks(completed);
CREATE INDEX idx_tasks_due_date ON public.tasks(due_date);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for leads
CREATE POLICY "Users can view their own leads"
    ON public.leads FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads"
    ON public.leads FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads"
    ON public.leads FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads"
    ON public.leads FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS Policies for loan_applications
CREATE POLICY "Users can view their own applications"
    ON public.loan_applications FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications"
    ON public.loan_applications FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications"
    ON public.loan_applications FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications"
    ON public.loan_applications FOR DELETE
    USING (auth.uid() = user_id);

-- Create RLS Policies for tasks
CREATE POLICY "Users can view their own tasks"
    ON public.tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
    ON public.tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
    ON public.tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON public.loan_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 5. Project Structure

```
web/
├── src/
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts      # Client-side Supabase (browser)
│   │   │   ├── server.ts      # Server-side Supabase (API routes)
│   │   │   └── index.ts       # Exports
│   │   └── api/
│   │       ├── auth.ts        # Authentication functions
│   │       ├── leads.ts       # Leads CRUD operations
│   │       ├── applications.ts # Applications CRUD
│   │       └── index.ts       # Exports
│   └── app/
│       └── api/
│           ├── auth/
│           │   ├── login/route.ts
│           │   ├── signup/route.ts
│           │   └── logout/route.ts
│           └── leads/
│               ├── route.ts          # GET, POST /api/leads
│               └── [id]/route.ts     # GET, PATCH, DELETE /api/leads/:id
└── .env.local                        # Your environment variables
```

## 6. Usage Examples

### Client-Side (React Components)

```typescript
import { supabase } from '@/lib/supabase/client'
import { getLeads, createLead } from '@/lib/api/leads'

// In a component
const fetchData = async () => {
  const leads = await getLeads()
  console.log(leads)
}

// Create a new lead
const handleSubmit = async (formData) => {
  const newLead = await createLead({
    first_name: formData.firstName,
    last_name: formData.lastName,
    email: formData.email,
    status: 'new'
  })
}
```

### API Routes (Server-Side)

```typescript
import { supabaseServer } from '@/lib/supabase/server'

// In an API route
export async function GET(request: NextRequest) {
  const { data } = await supabaseServer
    .from('leads')
    .select('*')

  return NextResponse.json({ data })
}
```

### Using Next.js API Routes

```typescript
// From client component or page
const response = await fetch('/api/leads')
const { data } = await response.json()
```

## 7. Authentication Flow

1. **Sign Up**:
```typescript
import { signUp } from '@/lib/api/auth'

const user = await signUp('email@example.com', 'password123')
// User will receive verification email
```

2. **Sign In**:
```typescript
import { signIn } from '@/lib/api/auth'

const { user, session } = await signIn('email@example.com', 'password123')
```

3. **Sign Out**:
```typescript
import { signOut } from '@/lib/api/auth'

await signOut()
```

4. **Get Current User**:
```typescript
import { getCurrentUser } from '@/lib/api/auth'

const user = await getCurrentUser()
```

## 8. Testing

### Test Authentication

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Test Leads API

```bash
# Create a lead
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com","status":"new"}'

# Get all leads
curl http://localhost:3000/api/leads
```

## 9. Security Notes

- ✅ **Never commit `.env.local`** to git (already in `.gitignore`)
- ✅ **Use `NEXT_PUBLIC_*`** prefix only for client-safe variables
- ✅ **Service Role Key** should only be used in API routes/server-side
- ✅ **Row Level Security (RLS)** is enabled to protect user data
- ✅ **Always validate** user input before database operations

## 10. Next Steps

1. [ ] Set up Supabase project
2. [ ] Add environment variables
3. [ ] Run database migrations
4. [ ] Test authentication
5. [ ] Test API endpoints
6. [ ] Build features using the API

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has the correct values
- Restart your dev server after changing `.env.local`

### Authentication not working
- Check that Row Level Security policies are set up correctly
- Verify email confirmation is working in Supabase dashboard
- Check Supabase Auth logs in Dashboard → Authentication → Logs

### API routes returning errors
- Check server logs in terminal
- Verify table names match your database schema
- Ensure RLS policies allow the operation

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
