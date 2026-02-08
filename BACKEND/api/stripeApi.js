import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
let stripePromise;

export const initializeStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
};

/**
 * Create a Stripe checkout session
 * @param {string} idToken - Firebase ID token for authentication
 * @param {Object} data - Checkout session data
 * @returns {Promise<{sessionId: string}>}
 */
export const createCheckoutSession = async (idToken, data) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create checkout session');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
};

/**
 * Get customer's subscription details
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>}
 */
export const getSubscription = async (idToken) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/subscription`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch subscription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching subscription:', error);
        throw error;
    }
};

/**
 * Cancel a subscription
 * @param {string} idToken - Firebase ID token
 * @param {string} subscriptionId - Stripe subscription ID
 * @returns {Promise<Object>}
 */
export const cancelSubscription = async (idToken, subscriptionId) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/cancel-subscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
            body: JSON.stringify({ subscriptionId }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to cancel subscription');
        }

        return await response.json();
    } catch (error) {
        console.error('Error canceling subscription:', error);
        throw error;
    }
};

/**
 * Create a portal session for subscription management
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<{url: string}>}
 */
export const createPortalSession = async (idToken) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stripe/create-portal-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create portal session');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating portal session:', error);
        throw error;
    }
};
