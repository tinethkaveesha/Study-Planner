const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();

// Initialize Firebase Admin SDK
let firebaseInitialized = false;
try {
    // Try to use the service account from environment variable first (for production/cloud)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        });
    } else {
        // Use application default credentials (for local development with gcloud CLI)
        admin.initializeApp({
            credential: admin.credential.applicationDefault(),
        });
    }
    console.log('✓ Firebase Admin SDK initialized successfully');
    firebaseInitialized = true;
} catch (error) {
    console.error('✗ Failed to initialize Firebase Admin SDK:', error.message);
    console.warn('⚠ Some features may not work without Firebase Admin initialization');
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

    // Vercel/Netlify preview deployments
    if (process.env.VERCEL_URL) {
        origins.push(`https://${process.env.VERCEL_URL}`);
    }
    
    if (process.env.NETLIFY_SITE_ID) {
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
            console.warn(`❌ CORS blocked origin: ${origin}`);
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
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

// Stripe webhook route (MUST be before express.json())
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

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
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    console.warn(`✗ 404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ 
        error: 'Route not found',
        path: req.path,
        method: req.method,
        availableRoutes: [
            'GET /health',
            'POST /api/stripeAPI/create-checkout-session',
            'GET /api/stripeAPI/subscription',
            'POST /api/stripeAPI/cancel-subscription',
            'POST /api/stripeAPI/create-portal-session'
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('✗ Server error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, () => {
    const allowedOrigins = getAllowedOrigins();
    
    console.log(`\n✓ Study Planner Backend Server`);
    console.log(`  Port: ${PORT}`);
    console.log(`  Environment: ${NODE_ENV}`);
    console.log(`  Firebase: ${firebaseInitialized ? '✓ Ready' : '✗ Not initialized'}`);
    console.log(`  CORS Origins Allowed:`);
    allowedOrigins.forEach(origin => console.log(`    • ${origin}`));
    
    if (!firebaseInitialized) {
        console.warn(`\n⚠️  Firebase not initialized. Some features may not work.`);
        console.warn(`    Setup Firebase in your .env file as described in SETUP.md`);
    }
    
    console.log(`\n  Health Check: http://localhost:${PORT}/health`);
    console.log(`  Ready to accept connections!\n`);
});