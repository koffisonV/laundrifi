'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const MAX_RESERVATIONS = 3;

function ConfirmationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slot = searchParams.get('slot');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleConfirmBooking = async () => {
    if (!slot) return;
    
    setLoading(true);
    setError(null);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      // Check current number of reservations
      const { data: existingReservations } = await supabase
        .from('reservations')
        .select('reserved_timeslot')
        .eq('id', user.id);

      if (existingReservations && existingReservations.length >= MAX_RESERVATIONS) {
        setError(`You have reached the maximum number of reservations (${MAX_RESERVATIONS})`);
        return;
      }

      // Get user's apartment number
      const { data: apartment } = await supabase
        .from('apartments')
        .select('apt_number')
        .eq('id', user.id)
        .single();

      if (!apartment) {
        setError('Please set your apartment number before booking');
        return;
      }

      // Save the booking
      const { error: bookingError } = await supabase
        .from('reservations')
        .insert([
          {
            id: user.id,
            apt_number: apartment.apt_number,
            reserved_timeslot: slot,
          },
        ]);

      if (bookingError) {
        setError(bookingError.message);
        return;
      }

      router.push('/schedule');
    } catch (error) {
      setError('An error occurred while booking');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!slot) {
    router.push('/schedule');
    return null;
  }

  return (
    <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6 text-foreground">
        Booking Confirmation
      </h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <p className="text-center text-lg">
          Your laundry slot is scheduled for:
          <br />
          <span className="font-bold">{slot}</span>
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={handleConfirmBooking}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
          <button
            onClick={() => router.push('/schedule')}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <Suspense fallback={
        <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full mb-6"></div>
            <div className="flex gap-4 w-full">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      }>
        <ConfirmationForm />
      </Suspense>
    </main>
  );
} 