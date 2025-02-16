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
  // Mock data for unavailable slots
  const unavailableSlots = ['Monday-9AM', 'Wednesday-2PM'];

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
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-100 dark:bg-gray-800">Time</th>
            {DAYS.map(day => (
              <th key={day} className="border p-2 bg-gray-100 dark:bg-gray-800">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {HOURS.map(hour => (
            <tr key={hour}>
              <td className="border p-2 font-medium">{hour}</td>
              {DAYS.map(day => (
                <td
                  key={`${day}-${hour}`}
                  className={`border p-2 text-center cursor-pointer transition-colors
                    ${isSlotAvailable(day, hour) 
                      ? 'hover:bg-blue-100 dark:hover:bg-blue-900'
                      : 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed'}
                    ${selectedSlot === `${day}-${hour}`
                      ? 'bg-blue-200 dark:bg-blue-800'
                      : ''}`}
                  onClick={() => handleSlotClick(day, hour)}
                >
                  {isSlotAvailable(day, hour) ? '✓' : '×'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {selectedSlot && (
        <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Confirm Your Selection</h2>
          <p className="mb-4">You selected: {selectedSlot}</p>
          <div className="flex gap-4">
            <button
              onClick={handleConfirmBooking}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Confirm Booking
            </button>
            <button
              onClick={() => setSelectedSlot(null)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 