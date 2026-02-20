import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const plans = [
    {
        name: "Free Trial",
        price: "$0",
        duration: "7 days",
        features: [
            "Access to basic scheduler",
            "Limited to 5 subjects",
            "Basic progress tracking",
            "Community support",
        ],
        type: "free",
        buttonText: "Start Free Trial",
        stripePriceId: null,
    },
    {
        name: "Pro Monthly",
        price: "$9.99",
        duration: "per month",
        features: [
            "Unlimited subjects",
            "Advanced analytics",
            "Priority support",
            "Custom study plans",
            "Group collaboration",
            "Quiz generation with AI",
            "Resource library access",
        ],
        type: "pro",
        buttonText: "Subscribe Now",
        highlighted: true,
        stripePriceId: "price_1Syc2M35w6HjLDvcSE3O4hys",
    },
    {
        name: "Premium Yearly",
        price: "$99.99",
        duration: "per year",
        features: [
            "Everything in Pro",
            "30% savings vs monthly",
            "Lifetime progress backup",
            "Advanced AI tutoring",
            "Exclusive course materials",
            "Priority feature requests",
        ],
        type: "premium",
        buttonText: "Subscribe Now",
        stripePriceId: "price_1Syc3235w6HjLDvciOXWp7Py",
    },
];

export default function Subscription() {
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [loading, setLoading] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        setUser(currentUser);
    }, []);

    const handleFreeTrial = async () => {
        try {
            setLoadingPlan("free");
            setError(null);

            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                setError("Please log in first to start your free trial");
                setLoadingPlan(null);
                return;
            }

            // Update user's subscription in Firestore
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                subscriptionPlan: "free",
                subscriptionStatus: "active",
                trialStartDate: new Date(),
                trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            });

            // Redirect to profile or dashboard
            setTimeout(() => {
                setLoadingPlan(null);
                navigate("/profile");
            }, 800);
        } catch (err) {
            console.error("Free trial error:", err);
            setError("Failed to activate free trial. Please try again.");
            setLoadingPlan(null);
        }
    };

    const handleSubscribe = async (plan) => {
        try {
            setLoadingPlan(plan.type);
            setError(null);

            // Handle free trial separately
            if (plan.type === "free") {
                await handleFreeTrial();
                return;
            }

            const auth = getAuth();
            const currentUser = auth.currentUser;

            if (!currentUser) {
                setError("Please log in first to subscribe");
                setLoadingPlan(null);
                return;
            }

            if (!plan.stripePriceId) {
                setError("Invalid subscription plan");
                setLoadingPlan(null);
                return;
            }

            // Get user's ID token for backend authentication
            const idToken = await currentUser.getIdToken();

            // Call your backend to create checkout session
            const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const apiUrl = `${apiBaseUrl}/api/stripeAPI/create-checkout-session`;
            
            // Get current origin for redirect URLs
            const origin = window.location.origin;
            const successUrl = `${origin}/success`;
            const cancelUrl = `${origin}/subscription`;
            
            console.log("Making API request to:", apiUrl);
            console.log("User ID:", currentUser.uid);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({
                    priceId: plan.stripePriceId,
                    successUrl: successUrl,
                    cancelUrl: cancelUrl,
                }),
            });

            console.log("API Response Status:", response.status, response.statusText);

            let data;
            try {
                const responseText = await response.text();
                data = responseText ? JSON.parse(responseText) : {};
            } catch (parseError) {
                console.error("Failed to parse response:", parseError);
                throw new Error(`Invalid response from server: ${response.status} ${response.statusText}`);
            }

            if (!response.ok) {
                console.error("API Error Response:", data);
                let errorMsg = data.error || data.message || `HTTP ${response.status}`;
                
                if (response.status === 404) {
                    errorMsg += '\n\nBackend server may not be running. Make sure to start it with:\ncd BACKEND && npm start';
                } else if (response.status === 401) {
                    errorMsg += '\n\nAuthentication failed. Please try logging in again.';
                } else if (response.status === 400) {
                    errorMsg += `\n\nInvalid request: ${JSON.stringify(data)}`;
                }
                
                throw new Error(errorMsg);
            }

            const sessionId = data.sessionId;
            if (!sessionId) {
                throw new Error('No session ID received from server');
            }

            console.log("Successfully created Stripe session:", sessionId);

            // Redirect to Stripe Checkout
            const stripe = await stripePromise;
            const { error: stripeError } = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (stripeError) {
                throw new Error(stripeError.message);
            }
        } catch (err) {
            console.error("Subscription error:", err);
            setError(err.message || "Failed to process subscription. Please try again.");
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-amber-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Choose Your Learning Path
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Start with a free trial or upgrade to unlock full potential of Study Planner
                    </p>
                </div>

                {error && (
                    <div className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 max-w-2xl mx-auto">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {!user && (
                    <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-2xl mx-auto">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <h3 className="font-semibold text-amber-900 mb-1">Sign in required</h3>
                                <p className="text-sm text-amber-800">Please sign in to subscribe to a plan.</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan) => (
                        <div
                            key={plan.type}
                            className={`relative rounded-2xl transition-all duration-300 ${
                                plan.highlighted
                                    ? "md:scale-105 bg-gradient-to-br from-amber-700 to-amber-800 text-white shadow-2xl"
                                    : "bg-white text-gray-900 border border-gray-200 shadow-lg hover:shadow-xl"
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-sm font-bold">
                                    Most Popular
                                </div>
                            )}

                            <div className="p-8">
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <div className="mb-6">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className={plan.highlighted ? "text-amber-100" : "text-gray-600"}>
                                        {" "}{plan.duration}
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    disabled={loadingPlan !== null}
                                    className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                                        plan.highlighted
                                            ? "bg-white text-amber-700 hover:bg-amber-50 disabled:hover:bg-white"
                                            : "bg-amber-700 text-white hover:bg-amber-800 disabled:hover:bg-amber-700"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {loadingPlan === plan.type ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Processing...
                                        </span>
                                    ) : (
                                        plan.buttonText
                                    )}
                                </button>

                                <div className="space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <svg
                                                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                                                    plan.highlighted ? "text-amber-300" : "text-amber-600"
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">ℹ️</span>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Free Trial Information</h3>
                            <p className="text-sm text-blue-800">
                                Your 7-day free trial gives you full access to core features. No credit card required. 
                                After 7 days, you'll need to upgrade to continue using Study Planner.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                        All payments are securely processed by{" "}
                        <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 hover:text-amber-800 font-medium">
                            Stripe
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}