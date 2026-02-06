/**
 * Stripe API Utilities
 * Handle all Stripe-related API calls
 */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/**
 * Create a checkout session for subscription
 * @param {string} idToken - Firebase ID token
 * @param {Object} params - Subscription parameters
 * @returns {Promise<string>} Session ID
 */
export async function createCheckoutSession(idToken, params) {
  const response = await fetch(`${API_URL}/api/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create checkout session");
  }

  return response.json();
}

/**
 * Get user's subscription status
 * @param {string} userId - Firebase user ID
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} Subscription status
 */
export async function getSubscriptionStatus(userId, idToken) {
  const response = await fetch(`${API_URL}/api/subscription-status/${userId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscription status");
  }

  return response.json();
}

/**
 * Get user's invoices
 * @param {string} userId - Firebase user ID
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Array>} Array of invoices
 */
export async function getUserInvoices(userId, idToken) {
  const response = await fetch(`${API_URL}/api/invoices/${userId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch invoices");
  }

  return response.json();
}

/**
 * Cancel user's subscription
 * @param {string} userId - Firebase user ID
 * @param {string} idToken - Firebase ID token
 * @returns {Promise<Object>} Cancellation response
 */
export async function cancelSubscription(userId, idToken) {
  const response = await fetch(`${API_URL}/api/cancel-subscription/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
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
