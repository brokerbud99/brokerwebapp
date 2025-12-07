// Export Supabase clients
export { supabase } from './client'
export { getSupabaseAdmin, getSupabaseServer, createClient } from './server'

// Export helper utilities
export { auth, db, storage, realtime } from './helpers'

// Re-export types from Supabase
export type { User, Session, AuthError } from '@supabase/supabase-js'
