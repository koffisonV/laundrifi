import Link from 'next/link'

export default function AuthErrorPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Authentication Error</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          There was a problem authenticating your account. This could be because:
        </p>
        <ul className="list-disc text-left text-gray-600 dark:text-gray-300 mb-6 pl-6">
          <li>The verification link has expired</li>
          <li>The link has already been used</li>
          <li>There was a technical problem</li>
        </ul>
        <div className="space-y-4">
          <Link 
            href="/auth/signin"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Back to Sign In
          </Link>
          <Link 
            href="/auth/signup"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Create New Account
          </Link>
        </div>
      </div>
    </main>
  )
} 