/**
 * Stripe API Utilities
 * Handle all Stripe-related API calls
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Create a checkout session for subscription
 * @param {string} idToken - Firebase ID token
 * @param {Object} params - Subscription parameters
 * @returns {Promise<Object>} Response with sessionId
 */
export async function createCheckoutSession(idToken, params) {
  const response = await fetch(`${API_URL}/api/stripeAPI/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error(`HTTP ${response.status}: Failed to create checkout session`);
    }
    throw new Error(error.error || "Failed to create checkout session");
  }

  return response.json();
}

/**
 * Get user's subscription status
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} Subscription status
 */
export async function getSubscriptionStatus(idToken) {
  const response = await fetch(`${API_URL}/api/stripeAPI/subscription`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error(`HTTP ${response.status}: Failed to fetch subscription`);
    }
    throw new Error(error.error || "Failed to fetch subscription");
  }

  return response.json();
}

/**
 * Create a customer portal session for managing subscriptions
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} Portal session URL
 */
export async function createPortalSession(idToken) {
  const response = await fetch(`${API_URL}/api/stripeAPI/create-portal-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error(`HTTP ${response.status}: Failed to create portal session`);
    }
    throw new Error(error.error || "Failed to create portal session");
  }

  return response.json();
}

/**
 * Cancel user's subscription
 * @param {string} subscriptionId - Stripe subscription ID
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} Cancellation response
 */
export async function cancelSubscription(subscriptionId, idToken) {
  const response = await fetch(`${API_URL}/api/stripeAPI/cancel-subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ subscriptionId }),
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      throw new Error(`HTTP ${response.status}: Failed to cancel subscription`);
    }
    throw new Error(error.error || "Failed to cancel subscription");
  }

  return response.json();
}

/**
 * Initialize Stripe
 * @returns {Promise<Stripe>} Stripe instance
 */
export function initializeStripe() {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

  if (!stripeKey) {
    throw new Error(
      "Stripe public key not configured. Add VITE_STRIPE_PUBLIC_KEY to .env.local"
    );
  }

  if (typeof window === "undefined" || !window.Stripe) {
    throw new Error("Stripe script not loaded");
  }

  return window.Stripe(stripeKey);
}
