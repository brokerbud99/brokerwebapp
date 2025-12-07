# Supabase Implementation Guide

This document describes the Supabase implementation in the brokerwebmobile/web project, following the proven patterns from the nritaxconnect project.

## 📁 File Structure

```
web/src/lib/supabase/
├── client.ts       # Browser client for client-side operations
├── server.ts       # Server client for API routes and server components
├── helpers.ts      # Helper utilities for auth, db, storage, and realtime
└── index.ts        # Main export file
```

## 🔧 Environment Variables

Create a `.env.local` file in the `web/` directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these values from: https://app.supabase.com/project/_/settings/api

## 🚀 Usage Examples

### Authentication

```typescript
import { auth } from '@/lib/supabase'

// Sign up a new user
const { data, error } = await auth.signUp('user@example.com', 'password123', {
  name: 'John Doe',
  role: 'customer'
})

// Sign in
const { data, error } = await auth.signIn('user@example.com', 'password123')

// Sign in with Google
await auth.signInWithGoogle()

// Get current user
const user = await auth.getCurrentUser()

// Sign out
await auth.signOut()

// Listen to auth changes
const { data: subscription } = auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session)
})
```

### Database Operations

#### Simple CRUD Operations

```typescript
import { db } from '@/lib/supabase'

// Create a record
const { data, error } = await db.create('customers', {
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890'
})

// Read a record by ID
const { data, error } = await db.read('customers', 'customer-id')

// Update a record
const { data, error } = await db.update('customers', 'customer-id', {
  phone: '0987654321'
})

// Delete a record
const { error } = await db.delete('customers', 'customer-id')

// List records with filters
const { data, error } = await db.list('customers', {
  filters: { status: 'active' },
  orderBy: 'created_at',
  ascending: false,
  limit: 10
})
```

#### Complex Queries

```typescript
import { db } from '@/lib/supabase'

// Use the query builder for complex operations
const { data, error } = await db.query('orders')
  .select(`
    *,
    customer:customers(*),
    items:order_items(*)
  `)
  .eq('status', 'pending')
  .gte('total_amount', 100)
  .order('created_at', { ascending: false })
  .limit(20)
```

### File Storage

```typescript
import { storage } from '@/lib/supabase'

// Upload a file
const file = event.target.files[0]
const { data, error } = await storage.upload('documents', `customer-123/${file.name}`, file)

// Download a file
const { data, error } = await storage.download('documents', 'customer-123/invoice.pdf')

// Get public URL
const { data } = storage.getPublicUrl('documents', 'customer-123/invoice.pdf')

// Create signed URL (for private buckets)
const { data, error } = await storage.createSignedUrl('documents', 'customer-123/invoice.pdf', 3600)

// Delete files
const { error } = await storage.delete('documents', ['customer-123/invoice.pdf'])

// List files in a folder
const { data, error } = await storage.list('documents', 'customer-123/')
```

### Realtime Subscriptions

```typescript
import { realtime } from '@/lib/supabase'

// Subscribe to all changes on a table
const channel = realtime.subscribe('orders', (payload) => {
  console.log('Change received:', payload)
})

// Subscribe to specific events
const channel = realtime.subscribe('orders',
  (payload) => {
    console.log('New order:', payload.new)
  },
  { event: 'INSERT' }
)

// Subscribe with filters
const channel = realtime.subscribe('orders',
  (payload) => {
    console.log('Order updated:', payload)
  },
  { event: 'UPDATE', filter: 'status=eq.pending' }
)

// Unsubscribe when done
await realtime.unsubscribe(channel)
```

### Server-Side Operations

For API routes and server components:

```typescript
import { createClient, getSupabaseAdmin } from '@/lib/supabase'

// In API routes - use createClient for authenticated requests
export async function GET(request: Request) {
  const supabase = await createClient()

  // This will have access to the user's session from cookies
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)

  return Response.json({ data })
}

// For admin operations - use getSupabaseAdmin
export async function POST(request: Request) {
  const supabaseAdmin = getSupabaseAdmin()

  // Admin client bypasses RLS policies
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ role: 'admin' })
    .eq('email', 'admin@example.com')

  return Response.json({ data })
}
```

## 🔐 Security Best Practices

1. **Never expose service role key** - Only use it server-side
2. **Use Row Level Security (RLS)** - Enable RLS on all tables
3. **Validate on server** - Always validate data server-side
4. **Use anon key for client** - The anon key is safe for browser use
5. **Handle errors properly** - Never expose sensitive error details to clients

## 📊 Database Schema Example

Here's a sample schema for reference:

```sql
-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own data" ON customers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own data" ON customers
  FOR UPDATE USING (auth.uid() = user_id);
```

## 🔄 Migration from Old Implementation

If you're migrating from the old auth API:

### Old Way
```typescript
import { signIn, signOut } from '@/lib/api/auth'

await signIn(email, password)
```

### New Way
```typescript
import { auth } from '@/lib/supabase'

await auth.signIn(email, password)
```

### Benefits
- More consistent API
- Better TypeScript support
- Additional features (OAuth, MFA support ready)
- Easier to extend
- Follows proven patterns from nritaxconnect

## 🧪 Testing

Test your Supabase connection:

```bash
cd web
node test-supabase.js
```

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🐛 Troubleshooting

### Build errors about missing env variables
- Ensure `.env.local` exists and has all required variables
- The client uses fallback values during build, but will fail at runtime if vars are missing

### Auth not persisting across page loads
- Make sure you're using the SSR-compatible clients (`createBrowserClient`, `createServerClient`)
- Check that cookies are enabled in the browser

### RLS policy errors
- Verify your RLS policies are set up correctly
- Use the admin client for operations that should bypass RLS
- Check Supabase logs for detailed error messages

### CORS errors
- Ensure your domain is added to Supabase allowed origins
- Check that you're using the correct Supabase URL
