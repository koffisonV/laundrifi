import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Check Your Email</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          We've sent you an email with a verification link. Please check your inbox and click the link to verify your account.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          If you don't see the email, check your spam folder.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/auth/signin"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Sign In
          </Link>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            You can close this page and click the verification link when you receive it.
          </p>
        </div>
      </div>
    </main>
  )
} 