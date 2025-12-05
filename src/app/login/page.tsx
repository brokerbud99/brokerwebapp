'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { signIn, signUp } from '@/lib/api/auth'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLogin, setIsLogin] = useState(true)

  // Check URL parameter to determine initial mode
  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'register') {
      setIsLogin(false)
    }
  }, [searchParams])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const { user, session } = await signIn(email, password)
        if (user && session) {
          router.push('/dashboard')
        }
      } else {
        // Register
        if (!firstName.trim() || !lastName.trim()) {
          setError('First name and last name are required')
          setLoading(false)
          return
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters')
          setLoading(false)
          return
        }

        const data = await signUp(email, password)
        if (data) {
          // TODO: Store firstName, lastName, companyName in user profile
          setError('Registration successful! Please check your email to verify your account.')
          setEmail('')
          setPassword('')
          setConfirmPassword('')
          setFirstName('')
          setLastName('')
          setCompanyName('')
          setIsLogin(true)
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col transition-colors duration-300">
      {/* Home Button - Fixed at top */}
      <div className="px-4 pt-6 md:px-8 md:pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          Home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
        <div className="w-full max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Login Form */}
            <div className="bg-card rounded-2xl shadow-lg p-8 border border-border">
              {/* Toggle Tabs */}
              <div className="flex gap-2 mb-8 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => {
                    setIsLogin(true)
                    setError('')
                  }}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${isLogin
                      ? 'bg-card text-primary shadow-sm border-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground border-2 border-transparent'
                    }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false)
                    setError('')
                  }}
                  className={`flex-1 py-2 px-4 rounded-md font-medium transition-all ${!isLogin
                      ? 'bg-card text-primary shadow-sm border-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground border-2 border-transparent'
                    }`}
                >
                  Register
                </button>
              </div>

              {/* Form Title */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-muted-foreground">
                  {isLogin
                    ? 'Sign in to access your mortgage dashboard'
                    : 'Register to start managing your mortgage business'}
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  className={`mb-6 p-4 rounded-lg ${error.includes('successful')
                      ? 'bg-success/10 text-success border border-success/20'
                      : 'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}
                >
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* First Name (Register only) */}
                {!isLogin && (
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-muted-foreground mb-2">
                      First Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                      placeholder="John"
                    />
                  </div>
                )}

                {/* Last Name (Register only) */}
                {!isLogin && (
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-muted-foreground mb-2">
                      Last Name <span className="text-destructive">*</span>
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                      placeholder="Doe"
                    />
                  </div>
                )}

                {/* Company Name (Register only - Optional) */}
                {!isLogin && (
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-muted-foreground mb-2">
                      Company Name <span className="text-muted-foreground/70 text-xs">(Optional)</span>
                    </label>
                    <input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                      placeholder="Your Brokerage pty."
                    />
                  </div>
                )}

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                    placeholder="you@example.com"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-muted-foreground mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                    placeholder={isLogin ? 'Enter your password' : 'At least 6 characters'}
                  />
                </div>

                {/* Confirm Password (Register only) */}
                {!isLogin && (
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-muted-foreground mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-foreground"
                      placeholder="Re-enter your password"
                    />
                  </div>
                )}

                {/* Forgot Password (Login only) */}
                {isLogin && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isLogin ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>
            </div>

            {/* Right Side - Features Content */}
            <div className="hidden md:block">
              <div className="space-y-6">


                {/* Features List */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-sm border border-border">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Lead & Application Management</h3>
                      <p className="text-sm text-muted-foreground">Track and manage your mortgage leads and applications from a single dashboard</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-sm border border-border">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">AI-Powered Document Processing</h3>
                      <p className="text-sm text-muted-foreground">Automatically extract and process document data with intelligent AI</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-sm border border-border">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary text-xl">✓</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Voice AI & Call Analytics</h3>
                      <p className="text-sm text-muted-foreground">Enhance customer interactions with voice AI and detailed call analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
