'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getUserProfile, type UserProfile } from '@/lib/api/user-profile'

interface UserProfileContextType {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  refetchProfile: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getUserProfile()
      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user profile')
      console.error('Error fetching user profile:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const refetchProfile = async () => {
    await fetchProfile()
  }

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refetchProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}
