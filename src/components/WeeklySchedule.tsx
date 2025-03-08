'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ApartmentNumberModal from './ApartmentNumberModal';
import { FaTrash } from 'react-icons/fa';

interface WeeklyScheduleProps {
  userSlot?: string | null;
  bookedSlots?: string[];
}

const MAX_RESERVATIONS = 3;
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 24 }, (_, i) => 
  i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`
);

export default function WeeklySchedule({ bookedSlots = [] }: WeeklyScheduleProps) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [userSlots, setUserSlots] = useState<string[]>([]);
  const [showApartmentModal, setShowApartmentModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkApartmentNumber = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No user found');
          return;
        }

        setUserId(user.id);

        // Check if user has an apartment number
        const { data: apartmentData, error: apartmentError } = await supabase
          .from('apartments')
          .select('apt_number')
          .eq('id', user.id)
          .maybeSingle();

        if (apartmentError) {
          console.error('Error fetching apartment data:', apartmentError.message);
          return;
        }

        if (!apartmentData?.apt_number) {
          setShowApartmentModal(true);
        }
      } catch (error) {
        console.error('Error checking apartment number:', error);
      }
    };
    checkApartmentNumber();
  }, [supabase]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Get current user's reservations
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: userReservations } = await supabase
          .from('reservations')
          .select('reserved_timeslot')
          .eq('id', user.id);

        if (userReservations) {
          setUserSlots(userReservations.map(res => res.reserved_timeslot));
        } else {
          setUserSlots([]);
        }
      } catch (err) {
        console.error('Error fetching reservations:', err);
      }
    };

    fetchReservations();

    // Subscribe to changes in reservations
    const channel = supabase
      .channel('reservations_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'reservations' 
      }, () => {
        fetchReservations();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [supabase]);

  const handleSlotClick = (day: string, hour: string) => {
    const slot = `${day}-${hour}`;
    if (!isSlotBooked(day, hour) && !isUserSlot(day, hour) && userSlots.length < MAX_RESERVATIONS) {
      setSelectedSlot(slot);
    }
  };

  const isSlotBooked = (day: string, hour: string) => {
    const slot = `${day}-${hour}`;
    return bookedSlots.includes(slot);
  };

  const handleConfirmBooking = async () => {
    if (selectedSlot && userSlots.length < MAX_RESERVATIONS) {
      router.push(`/schedule/confirm?slot=${encodeURIComponent(selectedSlot)}`);
    }
  };

  const isUserSlot = (day: string, hour: string) => {
    const slot = `${day}-${hour}`;
    return userSlots.includes(slot);
  };

  const remainingSlots = MAX_RESERVATIONS - userSlots.length;

  const handleCancelReservation = async (slot: string) => {
    if (cancelLoading) return;
    
    setCancelLoading(slot);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('reservations')
        .delete()
        .eq('id', user.id)
        .eq('reserved_timeslot', slot);

      if (error) {
        console.error('Error canceling reservation:', error);
        return;
      }

      // Update local state
      setUserSlots(userSlots.filter(s => s !== slot));
    } catch (err) {
      console.error('Error canceling reservation:', err);
    } finally {
      setCancelLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      {showApartmentModal && userId && (
        <ApartmentNumberModal
          isOpen={showApartmentModal}
          onClose={() => setShowApartmentModal(false)}
          userId={userId}
        />
      )}
      
      {/* Reservations Status */}
      <div className="space-y-2">
        <div className={`p-4 rounded-lg ${
          userSlots.length > 0
            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
            : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
        }`}>
          <div className="flex justify-between items-center">
            <div>
              {userSlots.length > 0 ? (
                <p>Your reserved time slots:</p>
              ) : (
                <p>You currently have no reservations</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm">
                Remaining slots: <span className="font-bold">{remainingSlots}</span>/{MAX_RESERVATIONS}
              </p>
            </div>
          </div>
          {userSlots.length > 0 && (
            <ul className="mt-2 space-y-1">
              {userSlots.map((slot, index) => (
                <li key={index} className="flex items-center justify-between">
                  <span className="font-semibold">• {slot}</span>
                  <button
                    onClick={() => handleCancelReservation(slot)}
                    disabled={cancelLoading === slot}
                    className="ml-2 p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50"
                    title="Cancel reservation"
                  >
                    {cancelLoading === slot ? (
                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FaTrash size={14} />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {userSlots.length >= MAX_RESERVATIONS && (
          <div className="bg-yellow-50 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 p-3 rounded-lg text-sm">
            You have reached the maximum number of reservations ({MAX_RESERVATIONS})
          </div>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
        <div className="min-w-[1200px]">
          <table className="w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700 w-20">
                  Time
                </th>
                {DAYS.map(day => (
                  <th key={day} className="px-4 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800">
              {HOURS.map(hour => (
                <tr key={hour} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="sticky left-0 bg-white dark:bg-gray-800 px-4 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                    {hour}
                  </td>
                  {DAYS.map(day => {
                    const isBooked = isSlotBooked(day, hour);
                    const isUserReservation = isUserSlot(day, hour);
                    const canBook = userSlots.length < MAX_RESERVATIONS;
                    return (
                      <td
                        key={`${day}-${hour}`}
                        className={`px-4 py-4 text-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-200
                          ${isUserReservation
                            ? 'bg-green-100 dark:bg-green-900/40 cursor-not-allowed'
                            : isBooked
                              ? 'bg-red-50 dark:bg-red-900/20 cursor-not-allowed'
                              : canBook
                                ? 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                : 'bg-gray-50 dark:bg-gray-900/20 cursor-not-allowed'}
                          ${selectedSlot === `${day}-${hour}`
                            ? 'ring-2 ring-blue-500 dark:ring-blue-400'
                            : ''}`}
                        onClick={() => !isBooked && !isUserSlot(day, hour) && canBook && handleSlotClick(day, hour)}
                      >
                        <div className="flex items-center justify-center">
                          {isUserReservation ? (
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              Your Slot
                            </span>
                          ) : isBooked ? (
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">
                              Booked
                            </span>
                          ) : !canBook ? (
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Max Reached
                            </span>
                          ) : (
                            <span className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
                              ✓
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSlot && userSlots.length < MAX_RESERVATIONS && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
              Confirm Your Selection
            </h2>
            <p className="mb-8 text-gray-600 dark:text-gray-300">
              You selected: <span className="font-semibold text-gray-900 dark:text-white">{selectedSlot}</span>
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmBooking}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 
                  transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Confirm Booking
              </button>
              <button
                onClick={() => setSelectedSlot(null)}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium 
                  hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600
                  transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 