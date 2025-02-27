'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [email, setEmail] = useState<string | null>(null);
  const [apartmentNumber, setApartmentNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || null);
        
        // Fetch apartment number
        const { data: profile } = await supabase
          .from('profiles')
          .select('apartment_number')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setApartmentNumber(profile.apartment_number);
        }
      }
      setLoading(false);
    }

    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/signin');
    router.refresh();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
          <p className="text-gray-900 dark:text-white">{email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Apartment Number</label>
          <p className="text-gray-900 dark:text-white">{apartmentNumber}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
} 