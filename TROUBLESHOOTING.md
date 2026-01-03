# Troubleshooting - Localhost Not Loading

## Server Status
✅ Port 3000 is listening (Process ID: 26468)

## Common Issues & Solutions

### 1. Check Browser Console
Open browser DevTools (F12) and check the Console tab for errors.

### 2. Required Environment Variables

The app needs these minimum variables to load:

**Critical (Required):**
```bash
NEXTAUTH_SECRET=any-random-string-for-development
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
```

**For Authentication to Work:**
```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### 3. Quick Test - Minimal Setup

If you just want to see the app load (without full functionality), create `.env.local` with:

```bash
NEXTAUTH_SECRET=development-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=test
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=test.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=test
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

This will let the app compile, but authentication won't work.

### 4. Check Server Logs

Look at the terminal where `npm run dev` is running. Common errors:

- **"Firebase admin is not initialized"** → Missing Firebase Admin credentials
- **"Module not found"** → Run `npm install`
- **Port already in use** → Kill process on port 3000 or use different port

### 5. Restart Server

1. Stop the server (Ctrl+C in terminal)
2. Delete `.next` folder: `rm -rf .next` (or `Remove-Item -Recurse -Force .next` in PowerShell)
3. Restart: `npm run dev`

### 6. Check Network Tab

In browser DevTools > Network tab:
- Look for failed requests (red)
- Check if `localhost:3000` is being blocked
- Try `127.0.0.1:3000` instead

### 7. Firewall/Antivirus

Some security software blocks localhost. Try:
- Adding exception for Node.js
- Temporarily disabling firewall
- Using `127.0.0.1` instead of `localhost`

### 8. Clear Browser Cache

- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache completely

## Quick Diagnostic Commands

```powershell
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Kill process on port 3000 (if needed)
taskkill /PID 26468 /F

# Check Node version
node --version

# Reinstall dependencies
npm install

# Clear Next.js cache
Remove-Item -Recurse -Force .next
```

## Still Not Working?

1. Check the terminal output for specific error messages
2. Share the error from browser console
3. Verify all environment variables are set correctly
4. Try accessing `http://127.0.0.1:3000` instead of `http://localhost:3000`

