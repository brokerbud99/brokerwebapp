import { createBrowserClient } from '@supabase/ssr'

// Supabase client for client-side operations (browser)
// Uses the anon key which is safe to expose
// This client stores auth session in cookies for SSR compatibility

// We use fallback empty strings to prevent build-time errors if env vars are missing
// The client will fail at runtime if these are not provided, which is expected behavior
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
