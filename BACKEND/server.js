const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

// Stripe webhook route (MUST be before express.json())
app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));

// JSON middleware for other routes
app.use(express.json());

// Routes
const stripeRoutes = require('./routes/stripe-routes');
app.use('/api/stripeAPI', stripeRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});