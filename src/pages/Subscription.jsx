import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { createCheckoutSession, initializeStripe } from "../utils/stripeApi";

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
        stripePriceId: null, // No Stripe ID for free trial
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
        stripePriceId: "price_1QxxxxxProMonthly", // Replace with your actual Stripe price ID
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
        stripePriceId: "price_1QxxxxxPremiumYearly", // Replace with your actual Stripe price ID
    },
];

export default function Subscription() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubscribe = async (planType) => {
        try {
            setLoading(true);
            setError(null);

            // Handle free trial
            if (planType === "free") {
                // Simulate free trial activation
                setTimeout(() => {
                    setLoading(false);
                    navigate("/");
                }, 800);
                return;
            }

            // Get current user
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                setError("Please log in first to subscribe");
                setLoading(false);
                return;
            }

            // Get user's ID token
            const idToken = await user.getIdToken();

            // Get the price ID for this plan
            const selectedPlan = plans.find((p) => p.type === planType);
            if (!selectedPlan?.stripePriceId) {
                setError("Subscription not available for this plan");
                setLoading(false);
                return;
            }

            // Create checkout session via backend API
            const { sessionId } = await createCheckoutSession(idToken, {
                priceId: selectedPlan.stripePriceId,
                planType: planType,
                userId: user.uid,
                userEmail: user.email,
            });

            // Initialize Stripe and redirect to checkout
            const stripe = initializeStripe();
            const result = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (err) {
            console.error("Subscription error:", err);
            setError(err.message || "Failed to process subscription. Please try again.");
            setLoading(false);
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
                        <h3 className="font-semibold text-red-900 mb-1">Error</h3>
                        <p className="text-sm text-red-800">{error}</p>
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
                                    <span className={plan.highlighted ? "text-amber-100" : "text-gray-600"}> {plan.duration}</span>
                                </div>

                                <button
                                    onClick={() => handleSubscribe(plan.type)}
                                    disabled={loading}
                                    className={`w-full py-3 rounded-lg font-semibold mb-8 transition-all ${
                                        plan.highlighted
                                            ? "bg-white text-amber-700 hover:bg-amber-50 disabled:hover:bg-white"
                                            : "bg-amber-700 text-white hover:bg-amber-800 disabled:hover:bg-amber-700"
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {loading ? "Processing..." : plan.buttonText}
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
                    <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Free Trial Information</h3>
                    <p className="text-sm text-blue-800">
                        Your 7-day free trial gives you full access to core features. No credit card required. After 7 days, you'll need to upgrade to continue using Study Planner.
                    </p>
                </div>
            </div>
        </div>
    );
}