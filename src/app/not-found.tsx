import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-6 text-foreground">404 - Page Not Found</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Oops! The page you are looking for does not exist or has been moved. This could be because:
        </p>
        <ul className="list-disc text-left text-gray-600 dark:text-gray-300 mb-6 pl-6">
          <li>The URL might be incorrect</li>
          <li>The page might have been moved or deleted</li>
          <li>You might have typed the wrong address</li>
        </ul>
        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Go to Homepage
          </Link>
          <Link 
            href="/auth/signin"
            className="block w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Sign In
          </Link>
        </div>
      </div>
    </main>
  )
} 