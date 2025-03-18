'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Turnstile from './Turnstile'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!turnstileToken) {
      setError('Please complete the security check')
      setLoading(false)
      return
    }

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken: turnstileToken
        }
      })

      if (signInError) {
        console.error('Sign in error:', signInError)
        // Handle specific error cases
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email or password is incorrect. If you have not registered yet, please sign up first.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please verify your email before signing in.')
        } else if (signInError.status === 500) {
          setError('Server error. Please try again in a few moments.')
        } else {
          setError('Unable to sign in. Please check your credentials and try again.')
        }
        setLoading(false)
        return
      }

      // Check if email is verified
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) {
        console.error('Error getting user:', userError)
        setError('An error occurred while verifying your account.')
        setLoading(false)
        return
      }

      if (!user?.email_confirmed_at) {
        setError('Please verify your email before signing in. Check your inbox for the verification link.')
        setLoading(false)
        return
      }

      router.push('/schedule')
      router.refresh()
    } catch (error) {
      console.error('Sign in error:', error)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
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
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            required
          />
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
          >
            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      <Turnstile onVerify={setTurnstileToken} />
      <div className="flex items-center justify-between">
        <Link
          href="/auth/reset-password"
          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Forgot password?
        </Link>
        <Link
          href="/auth/signup"
          className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Don&apos;t have an account?
        </Link>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}