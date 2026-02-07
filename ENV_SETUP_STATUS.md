# Environment Variables Setup Status

## ✅ What's Already Configured

### Firebase Admin SDK (Server-Side) - ✅ COMPLETE
- `FIREBASE_PROJECT_ID` = `email-template-ab-tracker`
- `FIREBASE_CLIENT_EMAIL` = `firebase-adminsdk-fbsvc@email-template-ab-tracker.iam.gserviceaccount.com`
- `FIREBASE_PRIVATE_KEY` = ✅ Set (from your service account JSON)

### NextAuth Configuration - ✅ COMPLETE
- `NEXTAUTH_SECRET` = ✅ Generated automatically
- `NEXTAUTH_URL` = `http://localhost:3000`

### App URL - ✅ COMPLETE
- `NEXT_PUBLIC_APP_URL` = `http://localhost:3000`

---

## ⚠️ What's Still Missing (Required for Full Functionality)

### Firebase Client Configuration (Client-Side) - ⚠️ NEEDS VALUES

These are **different** from the Admin SDK credentials. You need to get them from Firebase Console.

**Where to find them:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `email-template-ab-tracker`
3. Click the ⚙️ (Settings) icon → **Project Settings**
4. Scroll down to **"Your apps"** section
5. If you don't have a web app yet, click **"Add app"** → **Web** (</> icon)
6. Copy the config values from the Firebase SDK snippet

**Required variables:**
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY          # ⚠️ Missing
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=email-template-ab-tracker.firebaseapp.com  # ✅ Auto-set
NEXT_PUBLIC_FIREBASE_PROJECT_ID=email-template-ab-tracker   # ✅ Auto-set
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=email-template-ab-tracker.appspot.com  # ✅ Auto-set
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID     # ⚠️ Missing
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID                     # ⚠️ Missing
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID     # ⚠️ Missing (optional)
```

**What they look like:**
```javascript
// From Firebase Console > Project Settings > Your apps > Web app config
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // ← NEXT_PUBLIC_FIREBASE_API_KEY
  authDomain: "email-template-ab-tracker.firebaseapp.com",
  projectId: "email-template-ab-tracker",
  storageBucket: "email-template-ab-tracker.appspot.com",
  messagingSenderId: "123456789012",              // ← NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456789012:web:abcdef123456",      // ← NEXT_PUBLIC_FIREBASE_APP_ID
  measurementId: "G-XXXXXXXXXX"                    // ← NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID (optional)
};
```

---

## 🔧 How to Add Missing Values

### Option 1: Edit .env.local Manually

1. Open `.env.local` in your editor
2. Find the lines with `YOUR_FIREBASE_API_KEY`, etc.
3. Replace with actual values from Firebase Console
4. Save the file
5. Restart the dev server (it should auto-reload)

### Option 2: Use PowerShell (Quick Update)

```powershell
# Get values from Firebase Console first, then run:
$apiKey = "YOUR_ACTUAL_API_KEY"
$senderId = "YOUR_ACTUAL_SENDER_ID"
$appId = "YOUR_ACTUAL_APP_ID"
$measurementId = "YOUR_MEASUREMENT_ID"  # Optional

# Read current .env.local
$content = Get-Content .env.local -Raw

# Replace placeholders
$content = $content -replace "YOUR_FIREBASE_API_KEY", $apiKey
$content = $content -replace "YOUR_MESSAGING_SENDER_ID", $senderId
$content = $content -replace "YOUR_FIREBASE_APP_ID", $appId
$content = $content -replace "YOUR_MEASUREMENT_ID", $measurementId

# Write back
$content | Out-File .env.local -Encoding utf8 -NoNewline
```

---

## ✅ Optional Variables (Not Required for Basic Functionality)

### Google OAuth (Optional)
- `GOOGLE_CLIENT_ID` - Only needed if you want Google sign-in
- `GOOGLE_CLIENT_SECRET` - Only needed if you want Google sign-in

### Stripe (Optional - Only for Payment Features)
- `STRIPE_SECRET_KEY` - Only needed for subscription payments
- `STRIPE_WEBHOOK_SECRET` - Only needed for subscription webhooks
- `STRIPE_PRICE_ID_SOLO` - Only needed for Solo plan checkout
- `STRIPE_PRICE_ID_AGENCY` - Only needed for Agency plan checkout
- `STRIPE_PRICE_ID_PRO` - Only needed for Pro plan checkout

**Note:** The app will work without Stripe - you just won't be able to process payments. Users can still use the free tier.

---

## 🎯 Current Status

### What Works Now:
- ✅ App compiles and runs
- ✅ UI loads correctly
- ✅ Server-side operations (with Firebase Admin)
- ✅ Database operations (with Firebase Admin)

### What Won't Work Until You Add Client Config:
- ⚠️ Client-side Firebase Auth (sign up, login)
- ⚠️ Client-side Firestore reads (if any)
- ⚠️ Firebase Storage operations

### What Works Without Client Config:
- ✅ Server-side API routes (using Admin SDK)
- ✅ Server-side authentication (using Admin SDK)
- ✅ Database operations (using Admin SDK)

---

## 📝 Quick Checklist

- [x] Firebase Admin credentials added
- [x] NextAuth secret generated
- [x] App URL configured
- [ ] Firebase Client API Key (get from Firebase Console)
- [ ] Firebase Client Messaging Sender ID (get from Firebase Console)
- [ ] Firebase Client App ID (get from Firebase Console)
- [ ] Firebase Client Measurement ID (optional, get from Firebase Console)

---

## 🚀 Next Steps

1. **Get Firebase Client Config:**
   - Go to Firebase Console
   - Project Settings > Your apps > Web app
   - Copy the config values

2. **Update .env.local:**
   - Replace `YOUR_FIREBASE_API_KEY` with actual API key
   - Replace `YOUR_MESSAGING_SENDER_ID` with actual sender ID
   - Replace `YOUR_FIREBASE_APP_ID` with actual app ID

3. **Restart Server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

4. **Test:**
   - Go to http://localhost:3000
   - Try signing up/logging in
   - Should work now!

---

## 🔍 How to Verify Everything is Working

1. **Check Server Logs:**
   - Look for "Firebase admin is not initialized" errors
   - Should NOT see this error anymore ✅

2. **Test Authentication:**
   - Go to http://localhost:3000/signup
   - Create an account
   - Should create user in Firestore ✅

3. **Test Database:**
   - After signing up, go to /dashboard
   - Should see your user data ✅

4. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for Firebase errors
   - Should NOT see "Invalid API key" errors ✅

---

## 📚 Resources

- [Firebase Console](https://console.firebase.google.com/)
- [Firebase Setup Guide](./SETUP.md)
- [Security Guide](./SECURITY.md)

