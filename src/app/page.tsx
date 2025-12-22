import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-white-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-16">
            <Image
              src="/logo.png"
              alt="LaundriFi Logo"
              width={300}
              height={300}
              className="mx-auto"
            />
            <h1 className="text-5xl mt-4 md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              LaundriFi
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
              Smart Laundry Room Management System
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              Streamline your apartment complex laundry room with real-time
              availability tracking, smart scheduling, and an intuitive
              interface for residents.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/demo"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Try Demo
            </Link>
            <Link
              href="/auth/signin"
              className="bg-white hover:bg-gray-50 text-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg border-2 border-gray-200 dark:border-gray-600"
            >
              Sign In
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">📱</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Real-time Updates
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Live machine availability
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Smart Scheduling
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Reserve time slots and manage your laundry schedule
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Apartment Integration
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Seamlessly link reservations to apartment numbers
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
