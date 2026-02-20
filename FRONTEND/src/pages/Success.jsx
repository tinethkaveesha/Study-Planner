import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function Success() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [subscriptionData, setSubscriptionData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;

                if (!user) {
                    setError("Please log in to view your subscription");
                    setLoading(false);
                    return;
                }

                // Get updated user data from Firestore
                const userDoc = await getDoc(doc(db, "users", user.uid));
                
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setSubscriptionData({
                        plan: userData.subscriptionPlan,
                        status: userData.subscriptionStatus,
                    });
                }

                setLoading(false);
            } catch (err) {
                console.error("Error verifying session:", err);
                setError("Failed to verify subscription");
                setLoading(false);
            }
        };

        if (sessionId) {
            verifySession();
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false);
        }
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700 mb-4"></div>
                    <p className="text-gray-600">Verifying your subscription...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="text-6xl mb-4 text-red-600">⚠</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops!</h1>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <Link
                        to="/subscription"
                        className="inline-block bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
                    >
                        Back to Subscriptions
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                        <svg
                            className="w-12 h-12 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Subscription Successful!
                </h1>
                <p className="text-gray-600 mb-2">
                    Thank you for subscribing to Study Planner.
                </p>
                
                {subscriptionData && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
                        <p className="text-sm text-amber-900">
                            <span className="font-semibold">Plan: </span>
                            {subscriptionData.plan === 'pro' ? 'Pro Monthly' : 
                             subscriptionData.plan === 'premium' ? 'Premium Yearly' : 
                             subscriptionData.plan}
                        </p>
                        <p className="text-sm text-amber-900 mt-1">
                            <span className="font-semibold">Status: </span>
                            {subscriptionData.status}
                        </p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                    <Link
                        to="/profile"
                        className="block w-full bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-800 transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        to="/"
                        className="block w-full bg-white text-amber-700 border-2 border-amber-700 px-8 py-3 rounded-lg font-semibold hover:bg-amber-50 transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>

                {/* Additional Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        A confirmation email has been sent to your registered email address.
                        You can manage your subscription anytime from your profile.
                    </p>
                </div>
            </div>
        </div>
    );
}
