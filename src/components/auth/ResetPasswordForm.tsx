'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ResetPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (error) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Reset password error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold mb-4">Check your email</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We&apos;ve sent you a password reset link. Please check your email.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          If you don&apos;t see the email, please check your spam folder.
        </p>
        <div className="mt-6">
          <Link
            href="/auth/signin"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleResetPassword} className="space-y-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>
      <div className="text-right">
        <Link
          href="/auth/signin"
          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Back to Sign In
        </Link>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Sending reset link...' : 'Send Reset Link'}
      </button>
    </form>
  )
} 