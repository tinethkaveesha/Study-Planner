# Study Planner

A modern web application designed to help students organize, plan, and track their study schedules efficiently.

**Team Name:** P.E.K.K.A.  
**Team Leader:** K. B. Tineth Kaveesha Madubhashana  
**Contact Email:** tinethkaveesha@gmail.com  

## Team Members

- **Tineth Kaveesha** - Project Leader / Full Stack Developer
- **Thenuka Sandeepa** - Frontend Developer
- **Yamin Jagoda** - UI/UX Designer

## Technology Stack

### Frontend
- React 19 with TypeScript
- Vite (fast build tool)
- Tailwind CSS (utility-first CSS)
- React Router v7 (routing)
- Firebase (authentication & database)
- Stripe (payments)
- Recharts (data visualization)
- ESLint (code quality)

### Backend
- Express.js (web framework)
- Firebase Admin SDK
- Stripe API
- Node.js
- nodemon (development)
- CORS support

## Features

- Create and manage study schedules
- Track progress and goals
- Organize subjects and topics
- User authentication
- Payment processing with Stripe
- Real-time data with Firebase
- Analytics and insights

## Setup Instructions

### Prerequisites
- Node.js (v14.0 or higher)
- npm or yarn package manager
- Git

## Installation & Setup

### Prerequisites
- Node.js v14.0 or higher
- npm or yarn package manager
- Git (optional)

### FRONTEND Setup

```bash
# Navigate to frontend directory
cd FRONTEND

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:5173**

### BACKEND Setup

```bash
# Navigate to backend directory
cd BACKEND

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Add your Stripe keys, Firebase credentials, etc.

# Start development server
npm run dev
```

Backend will run on: **http://localhost:5000**

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start server with nodemon (auto-reload)
- `npm start` - Start server in production

### Build for Production
```bash
npm run build
# or
yarn build
```

## Project Structure

```
Study Planner 1.0.2/
│
├── FRONTEND/                          # React Frontend Application
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   │   ├── AuthModal.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── BlogCard.jsx
│   │   │   ├── ChartBar.jsx
│   │   │   ├── GroupModal.tsx
│   │   │   └── ... (other components)
│   │   │
│   │   ├── pages/                    # Page components (routes)
│   │   │   ├── Home.jsx
│   │   │   ├── Scheduler.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Subscription.jsx
│   │   │   └── ... (other pages)
│   │   │
│   │   ├── context/                  # React Context API
│   │   │   ├── AuthContext.jsx       # Authentication context
│   │   │   ├── AuthManager.ts
│   │   │   └── SubscriptionContext.jsx
│   │   │
│   │   ├── hooks/                    # Custom React hooks
│   │   │   └── useActivityTracking.js
│   │   │
│   │   ├── firebase/                 # Firebase configuration
│   │   │   └── config.js
│   │   │
│   │   ├── utils/                    # Utility functions
│   │   │   ├── userDataApi.js
│   │   │   ├── blogApi.js
│   │   │   ├── stripeApi.js
│   │   │   ├── activityTracker.js
│   │   │   └── cacheUtils.js
│   │   │
│   │   ├── styles/                   # Global styles
│   │   │   └── globals.css
│   │   │
│   │   ├── types/                    # TypeScript definitions
│   │   │   └── index.ts
│   │   │
│   │   ├── assets/                   # Static assets
│   │   │   └── CookiePolicy.txt
│   │   │
│   │   ├── App.tsx                   # Main App component
│   │   ├── main.tsx                  # React entry point
│   │   ├── firebase.js               # Firebase initialization
│   │   └── index.css                 # Global CSS imports
│   │
│   ├── public/                        # Static files served as-is
│   │   └── _redirects                # Netlify redirect rules
│   │
│   ├── package.json                  # Frontend dependencies
│   ├── vite.config.ts                # Vite build configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tsconfig.app.json             # App TypeScript configuration
│   ├── tsconfig.node.json            # Node TypeScript configuration
│   ├── eslint.config.js              # ESLint rules
│   ├── index.html                    # HTML template
│   ├── .gitignore                    # Git ignore rules
│   └── README.md                     # Frontend-specific documentation
│
├── BACKEND/                           # Express.js Backend Server
│   ├── routes/                        # API route definitions
│   │   └── (route files to be created)
│   │
│   ├── controllers/                  # Route handlers/logic
│   │   └── (controller files to be created)
│   │
│   ├── middleware/                   # Express middleware
│   │   └── (middleware files to be created)
│   │
│   ├── utils/                        # Utility functions
│   │   └── (utility files to be created)
│   │
│   ├── server.js                     # Main server file
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Environment variables template
│   ├── .gitignore                    # Git ignore rules
│   └── README.md                     # Backend-specific documentation
│
├── QUICK_START.md                    # This file - Quick startup guide
├── README_MONOREPO.md                # Monorepo documentation
├── README.md                         # Project README
├── SECURITY.md                       # Security policy
├── tsconfig.json                     # Root TypeScript config
├── package.json                      # Root-level dependencies (original)
└── (other root configuration files)
```

## File Organization Guide

### Components (`FRONTEND/src/components/`)
- **AuthModal.jsx** - User authentication modal (login/signup)
- **Header.jsx** - Navigation header with user menu
- **Footer.jsx** - Application footer
- **BlogCard.jsx** - Blog post card component
- **ChartBar.jsx** - Chart visualization component
- **NotificationPanel.jsx** - Notification sidebar
- **ScrollToTop.jsx** - Scroll-to-top button utility
- **FeatureCard.jsx** - Feature display card
- **HeroImage.jsx** - Hero section image
- **GroupModal.tsx** - Group creation/management modal
- **StatCard.jsx** - Statistics display card
- **CreateBlogModal.jsx** - Blog creation modal

### Pages (`FRONTEND/src/pages/`)
- **Home.jsx** - Landing/home page
- **Scheduler.jsx** - Study schedule management
- **Resources.jsx** - Learning resources
- **Progress.jsx** - Progress tracking
- **Analytics.jsx** - Analytics dashboard
- **Quizzes.jsx** - Quiz management
- **Groups.jsx** - Study groups
- **Subscription.jsx** - Subscription/pricing page
- **Blog.jsx** - Blog listing page
- **BlogDetail.jsx** - Individual blog post
- **Other Pages** - Settings, Profile, Support, Docs, Privacy, etc.

### Context API (`FRONTEND/src/context/`)
- **AuthContext.jsx** - Authentication state management
- **AuthManager.ts** - Auth logic
- **SubscriptionContext.jsx** - Subscription state

### Utilities (`FRONTEND/src/utils/`)
- **userDataApi.js** - User data API calls
- **blogApi.js** - Blog API calls
- **stripeApi.js** - Stripe payment integration
- **activityTracker.js** - User activity tracking
- **cacheUtils.js** - Caching utilities

### Backend (`BACKEND/`)
- **server.js** - Express server setup
- **routes/** - API endpoint definitions
- **controllers/** - Business logic
- **middleware/** - Authentication, validation, etc.
- **utils/** - Helper functions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues and questions, please open an issue in the repository.
