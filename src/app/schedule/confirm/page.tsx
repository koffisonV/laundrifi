'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ConfirmationPage() {
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
      // Get current user's profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      // Get user's apartment number
      const { data: profile } = await supabase
        .from('profiles')
        .select('apartment_number')
        .eq('id', user.id)
        .single();

      if (!profile) {
        setError('Profile not found');
        return;
      }

      // Save the booking
      const { error: bookingError } = await supabase
        .from('laundry_bookings')
        .insert([
          {
            user_id: user.id,
            apartment_number: profile.apartment_number,
            slot_time: new Date(slot).toISOString(),
          },
        ]);

      if (bookingError) {
        setError(bookingError.message);
        return;
      }

      router.push('/schedule');
    } catch (err) {
      setError('An error occurred while booking');
    } finally {
      setLoading(false);
    }
  };

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
    </main>
  );
} 