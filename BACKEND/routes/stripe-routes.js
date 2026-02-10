const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Validate required environment variables
const validateEnvVars = () => {
    const required = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
};

try {
    validateEnvVars();
} catch (error) {
    console.error('Environment variable validation failed:', error.message);
}

// Middleware to verify Firebase ID token
const verifyFirebaseToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                error: 'Unauthorized',
                message: 'Missing or invalid authorization header'
            });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ 
            error: 'Unauthorized',
            message: 'Invalid or expired token'
        });
    }
};

// Create checkout session
router.post('/create-checkout-session', verifyFirebaseToken, async (req, res) => {
    try {
        const { priceId, successUrl, cancelUrl } = req.body;
        const userId = req.user.uid;

        // Validation
        if (!priceId) {
            return res.status(400).json({ 
                error: 'Bad Request',
                message: 'priceId is required'
            });
        }

        if (!successUrl || !cancelUrl) {
            return res.status(400).json({ 
                error: 'Bad Request',
                message: 'successUrl and cancelUrl are required'
            });
        }

        // Get or create Stripe customer
        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();

        let customerId = userDoc.data()?.stripeCustomerId;

        if (!customerId) {
            const customer = await stripe.customers.create({
                email: req.user.email,
                metadata: {
                    firebaseUID: userId
                }
            });
            customerId = customer.id;

            // Save customer ID to Firestore
            await admin.firestore()
                .collection('users')
                .doc(userId)
                .set({ stripeCustomerId: customerId }, { merge: true });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                firebaseUID: userId
            },
            subscription_data: {
                metadata: {
                    firebaseUID: userId
                }
            }
        });

        res.json({ 
            sessionId: session.id,
            url: session.url
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message
        });
    }
});

// Get subscription status
router.get('/subscription', verifyFirebaseToken, async (req, res) => {
    try {
        const userId = req.user.uid;

        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();

        const userData = userDoc.data();

        if (!userData?.stripeCustomerId) {
            return res.json({ 
                hasSubscription: false,
                subscription: null
            });
        }

        // Get subscriptions for customer
        const subscriptions = await stripe.subscriptions.list({
            customer: userData.stripeCustomerId,
            status: 'active',
            limit: 1
        });

        if (subscriptions.data.length === 0) {
            return res.json({ 
                hasSubscription: false,
                subscription: null
            });
        }

        const subscription = subscriptions.data[0];

        res.json({
            hasSubscription: true,
            subscription: {
                id: subscription.id,
                status: subscription.status,
                currentPeriodEnd: subscription.current_period_end,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                plan: {
                    id: subscription.items.data[0].price.id,
                    amount: subscription.items.data[0].price.unit_amount,
                    currency: subscription.items.data[0].price.currency,
                    interval: subscription.items.data[0].price.recurring.interval
                }
            }
        });
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message
        });
    }
});

// Cancel subscription
router.post('/cancel-subscription', verifyFirebaseToken, async (req, res) => {
    try {
        const userId = req.user.uid;

        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();

        const userData = userDoc.data();

        if (!userData?.stripeCustomerId) {
            return res.status(404).json({ 
                error: 'Not Found',
                message: 'No customer found'
            });
        }

        // Get active subscriptions
        const subscriptions = await stripe.subscriptions.list({
            customer: userData.stripeCustomerId,
            status: 'active',
            limit: 1
        });

        if (subscriptions.data.length === 0) {
            return res.status(404).json({ 
                error: 'Not Found',
                message: 'No active subscription found'
            });
        }

        // Cancel subscription at period end
        const subscription = await stripe.subscriptions.update(
            subscriptions.data[0].id,
            {
                cancel_at_period_end: true
            }
        );

        res.json({
            success: true,
            message: 'Subscription will be canceled at the end of the billing period',
            subscription: {
                id: subscription.id,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                currentPeriodEnd: subscription.current_period_end
            }
        });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message
        });
    }
});

// Create customer portal session
router.post('/create-portal-session', verifyFirebaseToken, async (req, res) => {
    try {
        const { returnUrl } = req.body;
        const userId = req.user.uid;

        if (!returnUrl) {
            return res.status(400).json({ 
                error: 'Bad Request',
                message: 'returnUrl is required'
            });
        }

        const userDoc = await admin.firestore()
            .collection('users')
            .doc(userId)
            .get();

        const userData = userDoc.data();

        if (!userData?.stripeCustomerId) {
            return res.status(404).json({ 
                error: 'Not Found',
                message: 'No customer found'
            });
        }

        const session = await stripe.billingPortal.sessions.create({
            customer: userData.stripeCustomerId,
            return_url: returnUrl,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating portal session:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message
        });
    }
});

module.exports = router;