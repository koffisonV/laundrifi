import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm'

export default function UpdatePasswordPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">Update Password</h1>
        <UpdatePasswordForm />
      </div>
    </main>
  )
} 