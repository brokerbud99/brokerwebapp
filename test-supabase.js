// Test script to verify Supabase connection
// Run with: node test-supabase.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...\n')
console.log('URL:', supabaseUrl)
console.log('Anon Key:', supabaseAnonKey?.substring(0, 20) + '...\n')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
async function testConnection() {
  try {
    // Try to get session (should return null if not logged in, but won't error)
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('❌ Connection failed:', error.message)
    } else {
      console.log('✅ Supabase connection successful!')
      console.log('📊 Current session:', data.session ? 'Logged in' : 'No active session')
    }
  } catch (err) {
    console.error('❌ Error:', err.message)
  }
}

testConnection()
