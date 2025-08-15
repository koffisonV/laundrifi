'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { FaCrown, FaEnvelope, FaSpinner, FaCheckCircle } from 'react-icons/fa';

export default function Profile() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [apartmentNumber, setApartmentNumber] = useState<string | null>(null);
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [converting, setConverting] = useState(false);
  const [convertEmail, setConvertEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email || null);
        
        // Check if user is anonymous
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          try {
            const payload = JSON.parse(atob(session.access_token.split('.')[1]));
            setIsDemoUser(payload.is_anonymous === true);
          } catch (e) {
            setIsDemoUser(!user.email);
          }
        }
        
        // Fetch apartment number
        const { data: profile } = await supabase
          .from('apartments')
          .select('apt_number')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setApartmentNumber(profile.apt_number);
        }
      }
      setLoading(false);
    }

    loadProfile();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleConvertToRealAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertEmail.trim()) return;

    setConverting(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: convertEmail.trim(),
      });

      if (updateError) {
        if (updateError.message.includes('already registered')) {
          setError('This email is already registered. Please sign in to that account instead.');
        } else {
          setError(updateError.message);
        }
        return;
      }

      setSuccess('Check your email to verify your account and set a password!');
      setShowConvertModal(false);
      setConvertEmail('');
      
      // Update local state
      setEmail(convertEmail.trim());
      setIsDemoUser(false);
      
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
          {isDemoUser && (
            <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
              <FaCrown className="w-4 h-4" />
              Demo Mode
            </div>
          )}
        </div>

        {/* Demo User Notice */}
        {isDemoUser && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-3">
              <FaCrown className="text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Demo Account Active
                </h3>
                <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                  You're currently using a demo account. Your data will be preserved if you convert to a real account.
                </p>
                <button
                  onClick={() => setShowConvertModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Convert to Real Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <FaEnvelope className="text-gray-500 w-5 h-5" />
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {email || 'No email set'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-gray-500 w-5 h-5">🏢</div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Apartment Number</div>
              <div className="font-medium text-gray-900 dark:text-white">
                {apartmentNumber || 'Not set'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-gray-500 w-5 h-5">🆔</div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">User ID</div>
              <div className="font-mono text-sm text-gray-900 dark:text-white">
                {userId}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Sign Out
          </button>
          {isDemoUser && (
            <button
              onClick={() => setShowConvertModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Convert Account
            </button>
          )}
        </div>
      </div>

      {/* Convert to Real Account Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Convert Demo to Real Account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add your email to save your demo data and create a permanent account.
            </p>
            
            <form onSubmit={handleConvertToRealAccount} className="space-y-4">
              <div>
                <label htmlFor="convertEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="convertEmail"
                  value={convertEmail}
                  onChange={(e) => setConvertEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 dark:text-green-400 text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded flex items-center gap-2">
                  <FaCheckCircle />
                  {success}
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={converting}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
                >
                  {converting ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Converting...
                    </>
                  ) : (
                    'Convert Account'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowConvertModal(false);
                    setConvertEmail('');
                    setError(null);
                    setSuccess(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 