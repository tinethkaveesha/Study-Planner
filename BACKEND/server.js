const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Validate critical environment variables
const validateEnvironment = () => {
    const required = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error('Missing required environment variables:', missing.join(', '));
        console.warn('Some features may not work properly');
    }
};

validateEnvironment();

// Initialize Firebase Admin SDK
let firebaseInitialized = false;
try {
    // Try to use the service account from environment variable first (for production/cloud)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized with service account');
    } else {
        // Use application default credentials (for local development with gcloud CLI)
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
        console.log('Firebase Admin SDK initialized with application default credentials');
    }
    firebaseInitialized = true;
} catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error.message);
    console.warn('Some features may not work without Firebase Admin initialization');
    console.warn('Please check your Firebase configuration in .env file');
}

// CORS Configuration - allow frontend to make requests
const getAllowedOrigins = () => {
    const origins = [
        'http://localhost:5173',      // Local development
        'http://localhost:5174',      // Alt local (Vite), if 5173 is busy
        'http://localhost:3000',       // Alternative local
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:3000'
    ];

    // Add production origins from environment variable
    if (process.env.ALLOWED_ORIGINS) {
        origins.push(...process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()));
    }

    // Add CLIENT_URL if provided
    if (process.env.CLIENT_URL && !origins.includes(process.env.CLIENT_URL)) {
        origins.push(process.env.CLIENT_URL);
    }

    // Vercel/Netlify preview deployments
    if (process.env.VERCEL_URL) {
        origins.push(`https://${process.env.VERCEL_URL}`);
    }
    
    if (process.env.NETLIFY_URL) {
        origins.push(`https://${process.env.NETLIFY_URL}`);
    }

    return origins;
};

const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = getAllowedOrigins();
        
        // Allow requests with no origin (mobile apps, curl requests, etc)
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// Stripe webhook route (MUST be before express.json())
// webhook handler needs raw body for signature verification
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
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

// Webhook helper functions
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

// JSON middleware for other routes
app.use(express.json());

// Routes
const stripeRoutes = require('./routes/stripe-routes');
app.use('/api/stripeAPI', stripeRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'Server is running',
        firebaseInitialized,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Study Planner Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: 'GET /health',
            stripe: {
                createCheckout: 'POST /api/stripeAPI/create-checkout-session',
                getSubscription: 'GET /api/stripeAPI/subscription',
                cancelSubscription: 'POST /api/stripeAPI/cancel-subscription',
                createPortal: 'POST /api/stripeAPI/create-portal-session',
                webhook: 'POST /api/stripe/webhook'
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    console.warn(`404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ 
        error: 'Route not found',
        path: req.path,
        method: req.method,
        availableRoutes: [
            'GET /',
            'GET /health',
            'POST /api/stripeAPI/create-checkout-session',
            'GET /api/stripeAPI/subscription',
            'POST /api/stripeAPI/cancel-subscription',
            'POST /api/stripeAPI/create-portal-session',
            'POST /api/stripe/webhook'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    // Don't leak error details in production
    const errorResponse = {
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message || 'Internal server error'
    };
    
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }
    
    res.status(err.status || 500).json(errorResponse);
});

// Graceful shutdown handler
const gracefulShutdown = (signal) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
    
    server.close(() => {
        console.log('Server closed. Exiting process.');
        process.exit(0);
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

// Start server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
    const allowedOrigins = getAllowedOrigins();
    
    console.log('\n========================================');
    console.log('Study Planner Backend Server');
    console.log('========================================');
    console.log(`Port: ${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    console.log(`Node Version: ${process.version}`);
    console.log(`Firebase: ${firebaseInitialized ? 'Ready' : 'Not initialized'}`);
    console.log('\nCORS Origins Allowed:');
    allowedOrigins.forEach(origin => console.log(`  - ${origin}`));
    
    if (!firebaseInitialized) {
        console.warn('\n[WARNING] Firebase not initialized. Some features may not work.');
        console.warn('Setup Firebase in your .env file as described in README');
    }
    
    console.log(`\nHealth Check: http://localhost:${PORT}/health`);
    console.log('Ready to accept connections!');
    console.log('========================================\n');
});

// Handle process termination
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

module.exports = app;