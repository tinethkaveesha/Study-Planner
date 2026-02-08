// backend/routes/stripe.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const admin = require('firebase-admin');
const router = express.Router();

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

// Create Stripe checkout session
router.post('/create-checkout-session', verifyToken, async (req, res) => {
    try {
        const { priceId, planType, userId, userEmail } = req.body;

        // Validate request
        if (!priceId || !planType || !userId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if customer already exists in Stripe
        let customer;
        const customers = await stripe.customers.list({
            email: userEmail,
            limit: 1,
        });

        if (customers.data.length > 0) {
            customer = customers.data[0];
        } else {
            // Create new Stripe customer
            customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    firebaseUID: userId,
                },
            });

            // Store Stripe customer ID in Firestore
            await admin.firestore().collection('users').doc(userId).update({
                stripeCustomerId: customer.id,
            });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customer.id,
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/subscription`,
            metadata: {
                userId: userId,
                planType: planType,
            },
            subscription_data: {
                metadata: {
                    userId: userId,
                    planType: planType,
                },
            },
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error('Create checkout session error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get subscription details
router.get('/subscription', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;

        // Get user from Firestore
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.data();
        const stripeCustomerId = userData.stripeCustomerId;

        if (!stripeCustomerId) {
            return res.json({ subscription: null });
        }

        // Get active subscriptions from Stripe
        const subscriptions = await stripe.subscriptions.list({
            customer: stripeCustomerId,
            status: 'active',
            limit: 1,
        });

        if (subscriptions.data.length === 0) {
            return res.json({ subscription: null });
        }

        const subscription = subscriptions.data[0];

        res.json({
            subscription: {
                id: subscription.id,
                status: subscription.status,
                planType: subscription.metadata.planType,
                currentPeriodEnd: subscription.current_period_end,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
        });
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Cancel subscription
router.post('/cancel-subscription', verifyToken, async (req, res) => {
    try {
        const { subscriptionId } = req.body;

        if (!subscriptionId) {
            return res.status(400).json({ error: 'Subscription ID required' });
        }

        // Cancel subscription at period end
        const subscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });

        res.json({ 
            success: true,
            subscription: {
                id: subscription.id,
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
                currentPeriodEnd: subscription.current_period_end,
            },
        });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create customer portal session
router.post('/create-portal-session', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;

        // Get user from Firestore
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const stripeCustomerId = userDoc.data().stripeCustomerId;

        if (!stripeCustomerId) {
            return res.status(400).json({ error: 'No Stripe customer found' });
        }

        // Create portal session
        const session = await stripe.billingPortal.sessions.create({
            customer: stripeCustomerId,
            return_url: `${process.env.CLIENT_URL}/profile`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Create portal session error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Webhook endpoint to handle Stripe events
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

    // Handle the event
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;
                const userId = session.metadata.userId;
                const planType = session.metadata.planType;

                // Update user's subscription in Firestore
                await admin.firestore().collection('users').doc(userId).update({
                    subscriptionPlan: planType,
                    subscriptionStatus: 'active',
                    stripeCustomerId: session.customer,
                    subscriptionId: session.subscription,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });
                break;

            case 'customer.subscription.updated':
                const updatedSubscription = event.data.object;
                const updateUserId = updatedSubscription.metadata.userId;

                if (updateUserId) {
                    await admin.firestore().collection('users').doc(updateUserId).update({
                        subscriptionStatus: updatedSubscription.status,
                        subscriptionCancelAtPeriodEnd: updatedSubscription.cancel_at_period_end,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    });
                }
                break;

            case 'customer.subscription.deleted':
                const deletedSubscription = event.data.object;
                const deleteUserId = deletedSubscription.metadata.userId;

                if (deleteUserId) {
                    await admin.firestore().collection('users').doc(deleteUserId).update({
                        subscriptionPlan: null,
                        subscriptionStatus: 'canceled',
                        subscriptionId: null,
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    });
                }
                break;

            case 'invoice.payment_succeeded':
                const invoice = event.data.object;
                console.log('Payment succeeded for invoice:', invoice.id);
                break;

            case 'invoice.payment_failed':
                const failedInvoice = event.data.object;
                console.log('Payment failed for invoice:', failedInvoice.id);
                
                // Optionally notify user about failed payment
                const customerId = failedInvoice.customer;
                const customer = await stripe.customers.retrieve(customerId);
                const failedUserId = customer.metadata.firebaseUID;

                if (failedUserId) {
                    await admin.firestore().collection('users').doc(failedUserId).update({
                        subscriptionStatus: 'past_due',
                        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    });
                }
                break;

            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        res.status(500).json({ error: 'Webhook handler failed' });
    }
});

module.exports = router;
