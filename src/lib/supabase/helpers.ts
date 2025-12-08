'use client'

import { supabase } from './client'

/**
 * Auth Helper Functions
 * Simplified authentication operations
 */
export const auth = {
  /**
   * Sign up a new user with email and password
   */
  signUp: async (email: string, password: string, userData?: Record<string, any>) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  /**
   * Sign out the current user
   */
  signOut: async () => {
    return await supabase.auth.signOut()
  },

  /**
   * Sign in with Google OAuth
   */
  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  /**
   * Get the current session
   */
  getSession: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },

  /**
   * Reset password via email
   */
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
  },

  /**
   * Update user password
   */
  updatePassword: async (newPassword: string) => {
    return await supabase.auth.updateUser({
      password: newPassword
    })
  }
}

/**
 * Database Helper Functions
 * Simplified database operations with common patterns
 */
export const db = {
  /**
   * Generic create operation
   */
  create: async <T = any>(table: string, data: Record<string, any>) => {
    return await supabase
      .from(table)
      .insert(data)
      .select()
      .single() as { data: T | null, error: any }
  },

  /**
   * Generic read operation by ID
   */
  read: async <T = any>(table: string, id: string, idColumn = 'id') => {
    return await supabase
      .from(table)
      .select('*')
      .eq(idColumn, id)
      .single() as { data: T | null, error: any }
  },

  /**
   * Generic update operation
   */
  update: async <T = any>(table: string, id: string, data: Record<string, any>, idColumn = 'id') => {
    return await supabase
      .from(table)
      .update(data)
      .eq(idColumn, id)
      .select()
      .single() as { data: T | null, error: any }
  },

  /**
   * Generic delete operation
   */
  delete: async (table: string, id: string, idColumn = 'id') => {
    return await supabase
      .from(table)
      .delete()
      .eq(idColumn, id)
  },

  /**
   * Generic list operation with optional filtering
   */
  list: async <T = any>(
    table: string,
    options?: {
      filters?: Record<string, any>
      orderBy?: string
      ascending?: boolean
      limit?: number
    }
  ) => {
    let query = supabase.from(table).select('*')

    // Apply filters
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    // Apply ordering
    if (options?.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? false })
    }

    // Apply limit
    if (options?.limit) {
      query = query.limit(options.limit)
    }

    return await query as { data: T[] | null, error: any }
  },

  /**
   * Custom query builder for complex operations
   */
  query: (table: string) => {
    return supabase.from(table)
  }
}

/**
 * Storage Helper Functions
 * Simplified file storage operations
 */
export const storage = {
  /**
   * Upload a file to a bucket
   */
  upload: async (bucket: string, path: string, file: File, options?: { upsert?: boolean }) => {
    return await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options?.upsert ?? false
      })
  },

  /**
   * Download a file from a bucket
   */
  download: async (bucket: string, path: string) => {
    return await supabase.storage
      .from(bucket)
      .download(path)
  },

  /**
   * Delete a file from a bucket
   */
  delete: async (bucket: string, paths: string[]) => {
    return await supabase.storage
      .from(bucket)
      .remove(paths)
  },

  /**
   * Get public URL for a file
   */
  getPublicUrl: (bucket: string, path: string) => {
    return supabase.storage
      .from(bucket)
      .getPublicUrl(path)
  },

  /**
   * Create signed URL for private file access
   */
  createSignedUrl: async (bucket: string, path: string, expiresIn: number = 3600) => {
    return await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
  },

  /**
   * List files in a bucket folder
   */
  list: async (bucket: string, path?: string, options?: { limit?: number, offset?: number }) => {
    return await supabase.storage
      .from(bucket)
      .list(path, {
        limit: options?.limit ?? 100,
        offset: options?.offset ?? 0
      })
  }
}

/**
 * Realtime Helper Functions
 * Subscribe to database changes
 */
export const realtime = {
  /**
   * Subscribe to table changes
   */
  subscribe: (
    table: string,
    callback: (payload: any) => void,
    filters?: { event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*', filter?: string }
  ) => {
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes' as any,
        {
          event: filters?.event ?? '*',
          schema: 'public',
          table: table,
          filter: filters?.filter
        },
        callback
      )
      .subscribe()

    return channel
  },

  /**
   * Unsubscribe from a channel
   */
  unsubscribe: async (channel: any) => {
    return await supabase.removeChannel(channel)
  }
}
