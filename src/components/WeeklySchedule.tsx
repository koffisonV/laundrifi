'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = Array.from({ length: 24 }, (_, i) => 
  i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`
);

export default function WeeklySchedule() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const router = useRouter();
  
  // More mock data for unavailable slots
  const unavailableSlots = [
    'Monday-9 AM', 
    'Monday-10 AM',
    'Wednesday-2 PM',
    'Thursday-3 PM',
    'Friday-1 PM'
  ];

  const handleSlotClick = (day: string, hour: string) => {
    const slot = `${day}-${hour}`;
    if (!unavailableSlots.includes(slot)) {
      setSelectedSlot(slot);
    }
  };

  const isSlotAvailable = (day: string, hour: string) => {
    return !unavailableSlots.includes(`${day}-${hour}`);
  };

  const handleConfirmBooking = () => {
    if (selectedSlot) {
      router.push(`/schedule/confirm?slot=${selectedSlot}`);
    }
  };

  return (
    <>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-800 p-6">
        <table className="min-w-full border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 bg-white dark:bg-gray-800 px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700">
                Time
              </th>
              {DAYS.map(day => (
                <th key={day} className="px-6 py-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 border-b-2 border-gray-200 dark:border-gray-700">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800">
            {HOURS.map(hour => (
              <tr key={hour} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                <td className="sticky left-0 bg-white dark:bg-gray-800 px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
                  {hour}
                </td>
                {DAYS.map(day => (
                  <td
                    key={`${day}-${hour}`}
                    className={`px-6 py-4 text-sm border-b border-gray-200 dark:border-gray-700 transition-all duration-200
                      ${isSlotAvailable(day, hour)
                        ? 'cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20 cursor-not-allowed'}
                      ${selectedSlot === `${day}-${hour}`
                        ? 'bg-blue-100 dark:bg-blue-900/40 ring-2 ring-blue-500 dark:ring-blue-400'
                        : ''}`}
                    onClick={() => handleSlotClick(day, hour)}
                  >
                    <div className="flex items-center justify-center">
                      {isSlotAvailable(day, hour) ? (
                        <span className="h-8 w-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400">
                          ✓
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-red-600 dark:text-red-400">
                          Booked
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedSlot && (
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
    </>
  );
} 