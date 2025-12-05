# Authentication Setup Guide

Your BrokerBud web application is already configured for Supabase authentication!

## ✅ What's Already Set Up

1. **Environment Variables** (`.env.local`)
   - ✅ Supabase URL configured
   - ✅ Anon key configured
   - ✅ Service role key configured

2. **Supabase Client** (`src/lib/supabase/client.ts`)
   - ✅ Client initialized with your credentials
   - ✅ Session persistence enabled
   - ✅ Auto-refresh tokens enabled

3. **Auth Functions** (`src/lib/api/auth.ts`)
   - ✅ `signIn(email, password)` - Login users
   - ✅ `signUp(email, password)` - Register users
   - ✅ `signOut()` - Logout users
   - ✅ `getSession()` - Get current session
   - ✅ `getCurrentUser()` - Get current user

4. **Login Page** (`src/app/login/page.tsx`)
   - ✅ Login form
   - ✅ Registration form with first name, last name, company
   - ✅ Error handling
   - ✅ Loading states
   - ✅ Auto-redirect to `/dashboard` after successful login

## 🚀 How to Use Authentication

### Step 1: Create Your First User

**Option A: Via Supabase Dashboard (Recommended for Testing)**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **Add User** → **Create new user**
5. Enter:
   - Email: `test@example.com`
   - Password: `password123`
6. Click **Create user**

**Option B: Via Your App (Registration)**
1. Start dev server: `cd web && npm run dev`
2. Go to http://localhost:3000/login
3. Click **Register** tab
4. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Company: `Test Brokerage` (optional)
   - Email: `test@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
5. Click **Create Account**

### Step 2: Disable Email Confirmation (For Development)

If you want to skip email verification during testing:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to **Authentication** → **Providers**
3. Click on **Email** provider
4. Toggle **OFF** the "Confirm email" option
5. Click **Save**

Now you can login immediately after registration without email verification!

### Step 3: Test Login

1. Go to http://localhost:3000/login
2. Enter your credentials:
   - Email: `test@example.com`
   - Password: `password123`
3. Click **Sign In**
4. You should be redirected to `/dashboard`

## 🔧 How It Works

### Login Flow

```
User enters email/password
       ↓
Click "Sign In"
       ↓
signIn(email, password) called
       ↓
Supabase Auth validates credentials
       ↓
Success: Returns user & session
       ↓
Router redirects to /dashboard
```

### Registration Flow

```
User fills registration form
       ↓
Click "Create Account"
       ↓
Validation (names, password match, length)
       ↓
signUp(email, password) called
       ↓
Supabase creates user account
       ↓
Email confirmation sent (if enabled)
       ↓
Success message shown
       ↓
Form cleared & switched to Login
```

## 🐛 Troubleshooting

### "Invalid login credentials"
- User doesn't exist → Register first
- Wrong password → Check password
- Email not confirmed → Disable email confirmation or check email

### "User already registered"
- Email already exists in Supabase
- Try logging in instead of registering
- Or use different email

### Environment variable errors
- Make sure `.env.local` exists in `/web` folder
- Restart dev server after changing `.env.local`
- Check variable names start with `NEXT_PUBLIC_` for client-side

### Connection errors
- Verify Supabase URL is correct
- Check API keys are valid
- Ensure Supabase project is active

## 📚 Next Steps

### Store User Profile Data

Currently, the registration form collects firstName, lastName, and companyName but doesn't store them. To save this data:

1. Create a `profiles` table in Supabase
2. Add a trigger to create profile on user signup
3. Update the signUp function to store profile data

See `SUPABASE_SETUP.md` for database schema details.

### Protect Dashboard Routes

Add authentication middleware to protect routes:

```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}
```

## 🔗 Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Next.js Auth Guide](https://nextjs.org/docs/authentication)
- Project Supabase Dashboard: https://zdrpsotacqzthgqvpxrr.supabase.co
