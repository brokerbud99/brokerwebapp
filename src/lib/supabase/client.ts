import { createBrowserClient } from '@supabase/ssr'

// Supabase client for client-side operations (browser)
// Uses the anon key which is safe to expose
// This client stores auth session in cookies for SSR compatibility
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Check your .env.local file.')
}

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
