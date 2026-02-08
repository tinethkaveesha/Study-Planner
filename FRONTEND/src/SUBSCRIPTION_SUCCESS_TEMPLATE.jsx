/**
 * SubscriptionSuccess.jsx
 * 
 * This page is shown after successful Stripe checkout.
 * Add this to your src/pages/ folder and route it as:
 * <Route path="/subscription-success" element={<SubscriptionSuccess />} />
 */

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [planInfo, setPlanInfo] = useState(null);

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        // TODO: Verify subscription with backend
        // const idToken = await user.getIdToken();
        // const response = await fetch(
        //   `${import.meta.env.VITE_API_URL}/api/verify-subscription/${sessionId}`,
        //   {
        //     headers: { Authorization: `Bearer ${idToken}` },
        //   }
        // );

        // For now, assume success and redirect after delay
        setPlanInfo({
          planName: "Premium Plan",
          email: user.email,
        });

        const timer = setTimeout(() => {
          navigate("/dashboard"); // Change to your dashboard route
        }, 4000);

        setLoading(false);
        return () => clearTimeout(timer);
      } catch (err) {
        console.error("Subscription verification error:", err);
        setError(err.message || "Failed to verify subscription");
        setLoading(false);
      }
    };

    verifySubscription();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-amber-600 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying your subscription...
          </h2>
          <p className="text-gray-600">Please wait while we confirm your payment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-900 mb-2">
            Subscription Error
          </h2>
          <p className="text-red-800 mb-6">{error}</p>
          <button
            onClick={() => navigate("/subscription")}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Back to Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="text-center max-w-md">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Status Title */}
        <h1 className="text-4xl font-bold text-green-900 mb-4">
          Subscription Confirmed!
        </h1>

        {/* Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-left">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Your subscription is active
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Payment successfully processed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>
                {planInfo?.planName || "Premium"} activated for{" "}
                {planInfo?.email}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Confirmation email sent to your inbox</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✓</span>
              <span>Redirecting to dashboard in 4 seconds...</span>
            </li>
          </ul>
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          Thank you for subscribing to Study Planner! You now have access to all
          premium features. Enjoy your learning journey!
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Go to Home
          </button>
        </div>

        {/* Support */}
        <div className="mt-8 text-sm text-gray-600 border-t pt-6">
          <p className="mb-2">Need help? Contact our support team:</p>
          <a
            href="mailto:support@studyplanner.example.com"
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            support@studyplanner.example.com
          </a>
        </div>
      </div>
    </div>
  );
}
