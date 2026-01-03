# Quick Fix for Localhost Not Loading

## ✅ Server is Running
Port 3000 is active (Process ID: 26468)

## Steps to Fix:

### 1. Open Browser
Try these URLs:
- http://localhost:3000
- http://127.0.0.1:3000

### 2. Check Browser Console (F12)
Look for errors like:
- "Firebase: Error (auth/invalid-api-key)"
- "Firebase admin is not initialized"
- "Module not found"

### 3. Minimum Required Environment Variables

Your `.env.local` file needs at least:

```bash
# Required for app to compile
NEXTAUTH_SECRET=development-secret-12345
NEXTAUTH_URL=http://localhost:3000

# Required for Firebase (can be dummy values to test)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDummy
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test-project
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=test.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Restart Server

1. Stop current server (find terminal, press Ctrl+C)
2. Run: `npm run dev`
3. Wait for "Ready" message
4. Open http://localhost:3000

### 5. If Still Not Working

Check terminal output for specific error and share it.

Common issues:
- Missing NEXTAUTH_SECRET → Add it to .env.local
- Firebase errors → Add dummy Firebase values (app will load but auth won't work)
- Port conflict → Kill process: `taskkill /PID 26468 /F` then restart

