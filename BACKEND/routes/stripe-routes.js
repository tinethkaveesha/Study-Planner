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

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;

            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                await handleSubscriptionUpdate(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;

            case 'invoice.paid':
                await handleInvoicePaid(event.data.object);
                break;

            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ 
            error: 'Webhook processing failed',
            message: error.message
        });
    }
});

// Helper functions for webhook handling
async function handleCheckoutSessionCompleted(session) {
    const firebaseUID = session.metadata?.firebaseUID;
    if (!firebaseUID) {
        console.error('No firebaseUID in session metadata');
        return;
    }

    await admin.firestore()
        .collection('users')
        .doc(firebaseUID)
        .set({
            stripeCustomerId: session.customer,
            subscriptionStatus: 'active',
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

    console.log(`Checkout completed for user ${firebaseUID}`);
}

async function handleSubscriptionUpdate(subscription) {
    const firebaseUID = subscription.metadata?.firebaseUID;
    if (!firebaseUID) {
        console.error('No firebaseUID in subscription metadata');
        return;
    }

    await admin.firestore()
        .collection('users')
        .doc(firebaseUID)
        .set({
            subscriptionStatus: subscription.status,
            subscriptionId: subscription.id,
            currentPeriodEnd: subscription.current_period_end,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

    console.log(`Subscription updated for user ${firebaseUID}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription) {
    const firebaseUID = subscription.metadata?.firebaseUID;
    if (!firebaseUID) {
        console.error('No firebaseUID in subscription metadata');
        return;
    }

    await admin.firestore()
        .collection('users')
        .doc(firebaseUID)
        .set({
            subscriptionStatus: 'canceled',
            lastUpdated: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

    console.log(`Subscription deleted for user ${firebaseUID}`);
}

async function handleInvoicePaid(invoice) {
    const customerId = invoice.customer;
    
    // Find user by customer ID
    const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('stripeCustomerId', '==', customerId)
        .limit(1)
        .get();

    if (usersSnapshot.empty) {
        console.error('No user found for customer:', customerId);
        return;
    }

    const userDoc = usersSnapshot.docs[0];
    await userDoc.ref.set({
        lastPaymentDate: invoice.created,
        lastPaymentAmount: invoice.amount_paid,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`Invoice paid for customer ${customerId}`);
}

async function handleInvoicePaymentFailed(invoice) {
    const customerId = invoice.customer;
    
    // Find user by customer ID
    const usersSnapshot = await admin.firestore()
        .collection('users')
        .where('stripeCustomerId', '==', customerId)
        .limit(1)
        .get();

    if (usersSnapshot.empty) {
        console.error('No user found for customer:', customerId);
        return;
    }

    const userDoc = usersSnapshot.docs[0];
    await userDoc.ref.set({
        paymentFailed: true,
        lastPaymentFailureDate: invoice.created,
        lastUpdated: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    console.log(`Invoice payment failed for customer ${customerId}`);
}

module.exports = router;