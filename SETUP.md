# Email A/B Tracker - Setup Guide

## Prerequisites

- Node.js 18+ installed
- Firebase project created
- Stripe account (for payments)

## Firebase Configuration

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (Email/Password and Google)
5. Enable Cloud Storage

### 2. Get Firebase Credentials

1. Go to Project Settings > General
2. Scroll to "Your apps" and add a Web app
3. Copy the Firebase config values
4. Go to Project Settings > Service Accounts
5. Generate a new private key (download JSON)

### 3. Update Firestore Security Rules

Copy the contents of `firestore.rules` to Firebase Console > Firestore Database > Rules

### 4. Create Firestore Indexes

Firestore will prompt you to create indexes when needed. Alternatively, create these composite indexes:

- Collection: `templates`
  - Fields: `userId` (Ascending), `createdAt` (Descending)
  
- Collection: `abTests`
  - Fields: `userId` (Ascending), `startDate` (Descending)

- Collection: `templateVersions`
  - Fields: `createdBy` (Ascending), `createdAt` (Descending)

## Stripe Configuration

### 1. Create Products and Prices

1. Go to Stripe Dashboard > Products
2. Create three products:
   - **Solo**: $19/month (recurring)
   - **Agency**: $49/month (recurring)
   - **Pro**: $99/month (recurring)
3. Copy the Price IDs (starts with `price_...`)

### 2. Set Up Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the webhook signing secret (starts with `whsec_...`)

## Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in all the values:

```bash
# Next.js
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000

# Firebase (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...

# Firebase Admin (from Service Account JSON)
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_SOLO=price_...
STRIPE_PRICE_ID_AGENCY=price_...
STRIPE_PRICE_ID_PRO=price_...

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Installation

```bash
cd email-ab-tracker
npm install
```

## Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Structure

The app uses the following Firestore collections:

- `users` - User profiles and subscriptions
- `templates` - Email template metadata
- `templateVersions` - Template version history
- `abTests` - A/B test configurations and results
- `trackingEvents` - Email open/click events
- `insights` - Aggregated insights per user

## Plan Limits

- **Free**: 5 templates, no A/B testing
- **Solo ($19/mo)**: Unlimited templates, unlimited A/B tests
- **Agency ($49/mo)**: Everything in Solo + team collaboration, advanced analytics
- **Pro ($99/mo)**: Everything in Agency + API access, white-label

## Testing Stripe Locally

1. Use Stripe test mode
2. Use test card: `4242 4242 4242 4242`
3. Use Stripe CLI to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/billing/webhook
   ```
4. Copy the webhook secret from Stripe CLI output

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXT_PUBLIC_APP_URL` to your production URL
5. Update Stripe webhook URL to production

## Troubleshooting

### Firebase Admin Not Initialized
- Check that `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` are set
- Ensure private key includes `\n` characters (use double quotes in .env)

### Stripe Checkout Not Working
- Verify Stripe keys are in test mode for development
- Check that price IDs are correct
- Ensure webhook is configured

### Firestore Permission Denied
- Verify security rules are deployed
- Check that user is authenticated
- Ensure indexes are created for queries

