# Google OAuth Troubleshooting - Step by Step

## ✅ Your Credentials Are Set

Good news! Your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are already in `.env.local`.

## 🔍 Common Issues & Solutions

### Issue 1: Redirect URI Not Configured in Google Cloud Console

**This is the #1 most common issue!**

**Symptoms:**
- Button is clickable but nothing happens
- Or you see "redirect_uri_mismatch" error

**Solution:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Click on your **OAuth 2.0 Client ID**
5. Under **"Authorized redirect URIs"**, make sure you have:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Under **"Authorized JavaScript origins"**, make sure you have:
   ```
   http://localhost:3000
   ```
7. Click **"Save"**
8. **Wait 1-2 minutes** for changes to propagate
9. Try again

### Issue 2: OAuth Consent Screen Not Configured

**Symptoms:**
- Error: "Access blocked: This app's request is invalid"
- Error: "Error 403: access_denied"

**Solution:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Go to **APIs & Services** → **OAuth consent screen**
3. Make sure you've completed all required fields:
   - App name
   - User support email
   - Developer contact information
4. If your app is in "Testing" mode:
   - Add your email as a **Test user**
   - Or click **"PUBLISH APP"** to make it available to all users
5. Save and try again

### Issue 3: Check Browser Console for Errors

**How to check:**
1. Open your app: http://localhost:3000/login
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Click the "Sign in with Google" button
5. Look for errors

**Common errors:**
- `redirect_uri_mismatch` → Fix redirect URI (Issue 1)
- `invalid_client` → Check Client ID and Secret are correct
- `access_denied` → Fix OAuth consent screen (Issue 2)
- `GOOGLE_CLIENT_ID is not defined` → Restart dev server

### Issue 4: Server Not Restarted After Adding Variables

**Solution:**
1. Stop your dev server (Ctrl+C)
2. Restart it:
   ```bash
   npm run dev
   ```
3. Try again

### Issue 5: Wrong Client ID or Secret

**How to verify:**
1. Check `.env.local` file
2. Make sure `GOOGLE_CLIENT_ID` starts with numbers and ends with `.apps.googleusercontent.com`
3. Make sure `GOOGLE_CLIENT_SECRET` starts with `GOCSPX-`
4. No extra spaces or quotes around the values

**Correct format:**
```bash
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

**Wrong format:**
```bash
GOOGLE_CLIENT_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"  # ❌ No quotes needed
GOOGLE_CLIENT_ID = 123456789-...  # ❌ No spaces around =
```

---

## 🧪 Quick Test

### Test 1: Check if Google Provider is Loaded

1. Open browser console (F12)
2. Go to Network tab
3. Click "Sign in with Google"
4. Look for a request to `/api/auth/signin/google`
5. If you see it, the button is working
6. If you see an error, check the error message

### Test 2: Check Server Logs

1. Look at your terminal where `npm run dev` is running
2. Click "Sign in with Google"
3. Check for any error messages
4. Common errors:
   - `[GOOGLE_SIGNIN_ERROR]` → Check Firebase Admin credentials
   - `redirect_uri_mismatch` → Fix redirect URI

### Test 3: Direct URL Test

Try accessing the sign-in URL directly:
```
http://localhost:3000/api/auth/signin/google
```

If this redirects to Google, your setup is correct!

---

## 🔧 Step-by-Step Verification

### Step 1: Verify Environment Variables

Run this in PowerShell:
```powershell
# Check if variables are set
$env:GOOGLE_CLIENT_ID
$env:GOOGLE_CLIENT_SECRET
```

If they're empty, restart your dev server.

### Step 2: Verify Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Click on it
5. Verify:
   - ✅ **Authorized redirect URIs** includes: `http://localhost:3000/api/auth/callback/google`
   - ✅ **Authorized JavaScript origins** includes: `http://localhost:3000`

### Step 3: Verify OAuth Consent Screen

1. **APIs & Services** → **OAuth consent screen**
2. Verify:
   - ✅ App name is set
   - ✅ User support email is set
   - ✅ App is either "Published" or you're added as a test user

### Step 4: Test the Flow

1. Go to http://localhost:3000/login
2. Open browser DevTools (F12) → Console tab
3. Click "Sign in with Google"
4. **Expected behavior:**
   - Should redirect to Google account selection
   - If not, check console for errors

---

## 🐛 Debug Mode

Add this to see what's happening:

1. Open browser console (F12)
2. Before clicking the button, run:
   ```javascript
   localStorage.setItem('debug', 'next-auth:*')
   ```
3. Click "Sign in with Google"
4. Check console for detailed logs

---

## 📋 Complete Checklist

Before testing, verify:

- [ ] `GOOGLE_CLIENT_ID` is in `.env.local` (no quotes, no spaces)
- [ ] `GOOGLE_CLIENT_SECRET` is in `.env.local` (no quotes, no spaces)
- [ ] Dev server restarted after adding variables
- [ ] Redirect URI added in Google Cloud Console: `http://localhost:3000/api/auth/callback/google`
- [ ] JavaScript origin added: `http://localhost:3000`
- [ ] OAuth consent screen configured
- [ ] App is published OR you're added as test user
- [ ] No errors in browser console
- [ ] No errors in server logs

---

## 🆘 Still Not Working?

If you've checked everything above and it's still not working:

1. **Share the exact error message** from browser console
2. **Share the exact error message** from server logs
3. **Check the Network tab** in DevTools:
   - What URL is being called when you click the button?
   - What's the response?

Common final issues:
- **Firewall blocking localhost** → Try `127.0.0.1:3000` instead
- **Browser extensions blocking OAuth** → Try incognito mode
- **Cached credentials** → Clear browser cache and cookies

---

## ✅ Expected Working Flow

1. User clicks "Sign in with Google"
2. Browser redirects to: `http://localhost:3000/api/auth/signin/google`
3. NextAuth redirects to Google OAuth page
4. User selects Google account
5. Google redirects back to: `http://localhost:3000/api/auth/callback/google?code=...`
6. NextAuth processes the callback
7. User is redirected to `/dashboard`
8. User is logged in! 🎉

If any step fails, check the error message at that step.

