const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

const validateEnvironment = () => {
    const required = ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'];
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.error('Missing required environment variables:', missing.join(', '));
        console.warn('Some features may not work properly');
    }
};

validateEnvironment();

let firebaseInitialized = false;
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase Admin SDK initialized with service account');
    } else {
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

const getAllowedOrigins = () => {
    const origins = [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
        'http://127.0.0.1:3000'
    ];

    if (process.env.ALLOWED_ORIGINS) {
        origins.push(...process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()));
    }

    if (process.env.CLIENT_URL && !origins.includes(process.env.CLIENT_URL)) {
        origins.push(process.env.CLIENT_URL);
    }

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
    maxAge: 86400
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

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

app.use(express.json());

app.post('/api/generate-quiz', async (req, res) => {
    try {
        if (!process.env.GOOGLE_API_KEY) {
            return res.status(500).json({ 
                error: 'Quiz generation unavailable',
                message: 'Google API key not configured on server' 
            });
        }

        const { subject, topic, questions } = req.body;

        if (!topic || !subject) {
            return res.status(400).json({ 
                error: 'Missing required fields',
                message: 'topic and subject are required' 
            });
        }

        const questionCount = Math.min(Math.max(parseInt(questions) || 10, 5), 20);

        const quizPrompt = `Generate a quiz with ${questionCount} multiple choice questions about ${topic} in ${subject}. 

For each question, provide:
1. The question text
2. Four answer options (A, B, C, D)
3. The correct answer (just the letter)
4. A brief explanation

Format your response as a JSON array with NO markdown formatting, NO backticks, NO preamble. Just the raw JSON array of objects with this structure:
[
  {
    "question": "question text",
    "options": ["A) option 1", "B) option 2", "C) option 3", "D) option 4"],
    "correct": "A",
    "explanation": "explanation text"
  }
]

Return ONLY the JSON array, nothing else.`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GOOGLE_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                {
                                    text: quizPrompt
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `Google AI API request failed with status ${response.status}`);
        }

        const data = await response.json();
        let quizContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        // Clean up the response
        quizContent = quizContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        
        const quizData = JSON.parse(quizContent);

        if (!Array.isArray(quizData) || quizData.length === 0) {
            throw new Error('Invalid quiz format received from AI');
        }

        res.json({ quizData });
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ 
            error: 'Failed to generate quiz',
            message: error.message 
        });
    }
});

const stripeRoutes = require('./routes/stripe-routes');
app.use('/api/stripeAPI', stripeRoutes);

app.get('/health', (req, res) => {
    res.json({ 
        status: 'Server is running',
        firebaseInitialized,
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({
        message: 'Study Planner Backend API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            health: 'GET /health',
            quiz: {
                generateQuiz: 'POST /api/generate-quiz'
            },
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

app.use((req, res) => {
    console.warn(`404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ 
        error: 'Route not found',
        path: req.path,
        method: req.method,
        availableRoutes: [
            'GET /',
            'GET /health',
            'POST /api/generate-quiz',
            'POST /api/stripeAPI/create-checkout-session',
            'GET /api/stripeAPI/subscription',
            'POST /api/stripeAPI/cancel-subscription',
            'POST /api/stripeAPI/create-portal-session',
            'POST /api/stripe/webhook'
        ]
    });
});

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
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

const gracefulShutdown = (signal) => {
    console.log(`\nReceived ${signal}. Starting graceful shutdown...`);
    
    server.close(() => {
        console.log('Server closed. Exiting process.');
        process.exit(0);
    });
    
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

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

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

module.exports = app;