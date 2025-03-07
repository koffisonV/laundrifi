import SignUpForm from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">Create Account</h1>
        <SignUpForm />
      </div>
    </main>
  )
} 