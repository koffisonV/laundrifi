'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { FaCalendar, FaUser, FaCrown, FaSpinner } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

export default function Navigation() {
  const pathname = usePathname();
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [converting, setConverting] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUserType = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Check if user is anonymous by looking at the JWT claims
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          try {
            const payload = JSON.parse(atob(session.access_token.split('.')[1]));
            setIsDemoUser(payload.is_anonymous === true);
          } catch (e) {
            // Fallback: check if user has no email (anonymous users typically don't)
            setIsDemoUser(!user.email);
          }
        }
      }
    };

    checkUserType();
  }, [supabase]);

  const handleConvertToRealAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setConverting(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        email: email.trim(),
      });

      if (updateError) {
        if (updateError.message.includes('already registered')) {
          setError('This email is already registered. Please sign in to that account instead.');
        } else {
          setError(updateError.message);
        }
        return;
      }

      // Show success message and close modal
      setShowConvertModal(false);
      setEmail('');
      alert('Check your email to verify your account and set a password!');
      
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg mb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/schedule"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium gap-2 ${
                  pathname === '/schedule'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <FaCalendar className="w-4 h-4" />
                Schedule
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isDemoUser && (
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
                  <FaCrown className="w-4 h-4" />
                  Demo Mode
                  <button
                    onClick={() => setShowConvertModal(true)}
                    className="ml-2 px-2 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-xs rounded transition-colors"
                  >
                    Convert
                  </button>
                </div>
              )}
              <ThemeToggle />
              <Link
                href="/profile"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium gap-2 ${
                  pathname === '/profile'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <FaUser className="w-4 h-4" />
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                    setEmail('');
                    setError(null);
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
    </>
  );
} 