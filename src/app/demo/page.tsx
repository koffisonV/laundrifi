"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Turnstile from "@/components/auth/Turnstile";
import Link from "next/link";
import {
  FaSpinner,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<
    "initial" | "signing-in" | "seeding-data" | "success"
  >("initial");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const startDemo = async () => {
    if (!turnstileToken) {
      setError("Please complete the security check first");
      return;
    }

    setIsLoading(true);
    setError(null);
    setStep("signing-in");

    try {
      // Step 1: Sign in anonymously with CAPTCHA token
      const { data: signInData, error: signInError } =
        await supabase.auth.signInAnonymously({
          options: {
            captchaToken: turnstileToken,
          },
        });

      if (signInError) {
        throw new Error(`Sign-in failed: ${signInError.message}`);
      }

      if (!signInData.user) {
        throw new Error("No user returned from anonymous sign-in");
      }

      setStep("seeding-data");

      // Step 2: Seed demo data
      await seedDemoData(signInData.user.id);

      setStep("success");

      // Redirect to schedule page after a brief success message
      setTimeout(() => {
        router.push("/schedule");
      }, 1500);
    } catch (err) {
      console.error("Demo setup error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setStep("initial");
    } finally {
      setIsLoading(false);
    }
  };

  const seedDemoData = async (userId: string) => {
    try {
      const demoApartmentNumber = `${
        Math.floor(Math.random() * 9) + 1
      }${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
      console.log("demoApartmentNumber", demoApartmentNumber);

      const { error: apartmentError } = await supabase
        .from("apartments")
        .insert([
          {
            id: userId,
            apt_number: demoApartmentNumber,
          },
        ]);

      if (apartmentError) {
        console.warn(
          "Could not create demo apartment:",
          apartmentError.message
        );
      }

      const demoSlots = ["Monday-2 PM"];

      for (const slot of demoSlots) {
        const { error: reservationError } = await supabase
          .from("reservations")
          .insert([
            {
              id: userId,
              apt_number: demoApartmentNumber,
              reserved_timeslot: slot,
            },
          ]);

        if (reservationError) {
          console.warn(
            `Could not create demo reservation for ${slot}:`,
            reservationError.message
          );
        }
      }
    } catch (err) {
      console.error("Error seeding demo data:", err);
      // Don't throw here - we want to continue even if seeding fails
    }
  };

  const getStepContent = () => {
    switch (step) {
      case "signing-in":
        return (
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Creating Demo Account
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Setting up your anonymous demo session...
            </p>
          </div>
        );

      case "seeding-data":
        return (
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Preparing Demo Data</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Creating sample laundry schedules...
            </p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <FaCheckCircle className="text-4xl text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">
              Demo Ready!
            </h3>
            <p className="text-green-600 dark:text-green-400">
              Redirecting to your demo schedule...
            </p>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              Welcome to LaundriFi Demo
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Click the button below to start your demo.
            </p>

            {/* Turnstile CAPTCHA - Only show while waiting for verification */}
            {!turnstileToken && (
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-3 text-gray-600 dark:text-gray-400">
                  <FaSpinner className="animate-spin text-xl" />
                  <span className="text-sm">
                    Verifying you're human... This will only take a moment
                  </span>
                </div>
                <Turnstile
                  onVerify={setTurnstileToken}
                  onError={() => setTurnstileToken(null)}
                  action="demo_signin"
                />
              </div>
            )}
            <div className="flex flex-col items-center justify-center space-x-3 text-gray-600 dark:text-gray-400">
              <button
                onClick={startDemo}
                disabled={isLoading || !turnstileToken}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed"
              >
                {isLoading ? "Setting Up..." : "🚀 Start Demo"}
              </button>
              <Link
                href="/"
                className="text-sm mt-4 text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-white-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              LaundriFi Demo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Experience the full laundry scheduling system without creating an
              account.
            </p>
          </div>

          {/* Demo Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            {error ? (
              <div className="text-center">
                <FaExclamationTriangle className="text-4xl text-red-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">
                  Demo Setup Failed
                </h3>
                <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setStep("initial");
                    setTurnstileToken(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              getStepContent()
            )}
          </div>

          {/* Demo Info */}
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              This demo creates a temporary anonymous account with sample data.
            </p>
            <p>
              You'll start with 1 sample reservation and can book up to 2 more
              slots.
            </p>
            <p>Your data will be automatically cleaned up after the session.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
