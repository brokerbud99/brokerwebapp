export interface UserProfile {
  id: string
  user_email: string
  first_name: string | null
  last_name: string | null
  full_name: string | null
  phone: string | null
  avatar_url: string | null

  // Company/Tenant identification
  company_code: string
  company_name: string | null
  company_abn: string | null
  company_address: any | null

  // User role and permissions
  role: string
  permissions: any | null

  // User status
  is_active: boolean
  is_verified: boolean
  email_verified_at: string | null
  last_login_at: string | null

  // Subscription/License info
  license_type: string | null
  license_expires_at: string | null
  max_applications: number | null

  // Preferences
  timezone: string
  date_format: string
  language: string
  notification_preferences: any | null

  // Metadata
  metadata: any | null

  // Audit fields
  created_at: string
  created_by: string | null
  updated_at: string
  updated_by: string | null
}

/**
 * Fetch the current user's profile
 */
export async function getUserProfile(): Promise<UserProfile> {
  const response = await fetch('/api/user-profile', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to fetch user profile')
  }

  return response.json()
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  const response = await fetch('/api/user-profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to update user profile')
  }

  return response.json()
}
