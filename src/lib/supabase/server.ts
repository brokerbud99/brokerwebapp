import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Supabase client for server-side operations (API routes, server components)
// Uses the service role key for admin operations

// Lazy initialization for admin client
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase server environment variables. Check your .env.local file.')
  }

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Regular server-side client with anon key
// We use a getter or function to avoid top-level execution issues during build
export const getSupabaseServer = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, these might be missing. Return null or throw only when used?
    // For now, we'll let it throw if called, but since it's a function, it won't be called at import.
    throw new Error('Missing Supabase environment variables.')
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Deprecated: maintained for backward compatibility but might fail during build if imported
// We'll make it a getter that throws if accessed without env vars
// Actually, to fix the build, we simply REMOVE the top-level execution.
// If code relies on 'supabaseServer' constant, it will break.
// But 'supabaseServer' was just using anon key.

/**
 * Create a Supabase client for server-side authentication
 * This client reads auth session from cookies and should be used in API routes
 * and Server Components for authenticated requests
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The setAll method may fail in Server Components
          }
        },
      },
    }
  )
}
