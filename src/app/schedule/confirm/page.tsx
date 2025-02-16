'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slot = searchParams.get('slot');

  if (!slot) {
    router.push('/schedule');
    return null;
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
          Booking Confirmation
        </h1>
        <div className="space-y-4">
          <p className="text-center text-lg">
            Your laundry slot is scheduled for:
            <br />
            <span className="font-bold">{slot}</span>
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => router.push('/schedule')}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Cancel Booking
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 