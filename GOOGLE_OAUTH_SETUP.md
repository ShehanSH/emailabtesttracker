# Google OAuth Setup Guide - Complete Instructions

## 🔍 Problem

The "Sign in with Google" button is clickable but nothing happens because:
1. ❌ `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are not set in `.env.local`
2. ❌ Google OAuth app is not created in Google Cloud Console
3. ❌ Authorized redirect URIs are not configured

## ✅ Solution: Complete Setup Steps

### Step 1: Create Google OAuth Credentials

#### 1.1 Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project (or create one if you don't have one)
   - If creating new: Click "Select a project" → "New Project"
   - Name it: "Email AB Tracker" (or any name)
   - Click "Create"

#### 1.2 Enable Google+ API

1. In Google Cloud Console, go to **APIs & Services** → **Library**
2. Search for **"Google+ API"** or **"Google Identity"**
3. Click on it and click **"Enable"**

**Note:** Actually, for OAuth 2.0, you don't need Google+ API anymore. The OAuth 2.0 API is enabled by default. But if you see "Google Identity" or "People API", you can enable that.

#### 1.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

**If this is your first time:**
- You'll be asked to configure the OAuth consent screen first
- Click **"Configure Consent Screen"**
- Choose **"External"** (unless you have a Google Workspace)
- Click **"Create"**

**OAuth Consent Screen Setup:**
- **App name**: Email AB Tracker (or your app name)
- **User support email**: Your email
- **Developer contact information**: Your email
- Click **"Save and Continue"**
- **Scopes**: Click "Save and Continue" (default scopes are fine)
- **Test users**: Click "Save and Continue" (skip for now)
- **Summary**: Click "Back to Dashboard"

**Now create OAuth Client ID:**
1. Go back to **Credentials** → **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
2. **Application type**: Select **"Web application"**
3. **Name**: "Email AB Tracker Web Client" (or any name)
4. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   ```
   (Add this for localhost development)

5. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (This is the NextAuth callback URL)

6. Click **"Create"**

#### 1.4 Copy Your Credentials

After creating, you'll see a popup with:
- **Your Client ID**: `123456789-abcdefghijklmnop.apps.googleusercontent.com`
- **Your Client Secret**: `GOCSPX-abcdefghijklmnopqrstuvwxyz`

**⚠️ IMPORTANT:** Copy these immediately - you won't see the secret again!

---

### Step 2: Add Credentials to .env.local

1. Open `.env.local` in your project
2. Add these lines (replace with your actual values):

```bash
# Google OAuth
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

3. Save the file

---

### Step 3: Enable Google Sign-In in Firebase (Optional but Recommended)

This is **optional** but recommended for better integration:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `email-template-ab-tracker`
3. Go to **Authentication** → **Sign-in method**
4. Click on **"Google"**
5. Toggle **"Enable"**
6. **Project support email**: Select your email
7. **Web SDK configuration**:
   - **Web client ID**: Paste your `GOOGLE_CLIENT_ID` from Step 1.4
   - **Web client secret**: Paste your `GOOGLE_CLIENT_SECRET` from Step 1.4
8. Click **"Save"**

**Note:** This step is optional because NextAuth handles OAuth directly. But it's good to have it configured in Firebase too.

---

### Step 4: Restart Your Development Server

After adding the environment variables:

1. Stop your current server (Ctrl+C in terminal)
2. Restart it:
   ```bash
   npm run dev
   ```

---

### Step 5: Test Google Sign-In

1. Go to http://localhost:3000/login or http://localhost:3000/signup
2. Click **"Sign in with Google"** button
3. You should now see the Google account selection screen! ✅

---

## 🔧 Troubleshooting

### Issue 1: "redirect_uri_mismatch" Error

**Error message:**
```
Error 400: redirect_uri_mismatch
```

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Click on your OAuth 2.0 Client ID
3. Make sure **Authorized redirect URIs** includes:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. Click **"Save"**
5. Wait 1-2 minutes for changes to propagate
6. Try again

### Issue 2: Button Still Doesn't Work

**Check:**
1. Open browser DevTools (F12) → Console tab
2. Click the Google button
3. Look for errors

**Common errors:**
- `GOOGLE_CLIENT_ID is not defined` → Add it to `.env.local`
- `redirect_uri_mismatch` → Fix redirect URI in Google Cloud Console
- `invalid_client` → Check Client ID and Secret are correct

### Issue 3: "Access blocked: This app's request is invalid"

**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Make sure you've completed all steps
3. If in "Testing" mode, add your email as a test user
4. Or publish the app (for production)

### Issue 4: Environment Variables Not Loading

**Solution:**
1. Make sure `.env.local` is in the project root (same folder as `package.json`)
2. Restart the dev server after adding variables
3. Check for typos in variable names:
   - ✅ `GOOGLE_CLIENT_ID` (correct)
   - ❌ `GOOGLE_CLIENTID` (wrong)
   - ❌ `GOOGLE_CLIENT_ID=` (no value)

---

## 📋 Quick Checklist

Before testing, make sure:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 Client ID created (Web application type)
- [ ] Authorized redirect URI added: `http://localhost:3000/api/auth/callback/google`
- [ ] Authorized JavaScript origin added: `http://localhost:3000`
- [ ] `GOOGLE_CLIENT_ID` added to `.env.local`
- [ ] `GOOGLE_CLIENT_SECRET` added to `.env.local`
- [ ] Development server restarted
- [ ] No errors in browser console

---

## 🌐 For Production (Vercel Deployment)

When you deploy to Vercel, you'll need to:

1. **Add production redirect URI in Google Cloud Console:**
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

2. **Add production JavaScript origin:**
   ```
   https://your-app.vercel.app
   ```

3. **Add environment variables in Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `GOOGLE_CLIENT_ID` (with production value)
   - Add `GOOGLE_CLIENT_SECRET` (with production value)
   - Set for: Production, Preview, Development

**Note:** You can use the same OAuth credentials for both localhost and production, just add both redirect URIs.

---

## 🔐 Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore` ✅
2. **Client Secret is sensitive** - Keep it private
3. **Use different credentials for production** (optional but recommended)
4. **Rotate secrets** if accidentally exposed

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth.js Google Provider](https://next-auth.js.org/providers/google)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## ✅ Expected Behavior After Setup

1. Click "Sign in with Google" button
2. Google account selection popup appears
3. Select your Google account
4. Grant permissions (if first time)
5. Redirected back to your app
6. Logged in successfully! 🎉

---

**Need Help?** Check the browser console (F12) for specific error messages and share them for troubleshooting.

