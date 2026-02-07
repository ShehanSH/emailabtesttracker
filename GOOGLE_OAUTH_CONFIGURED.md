# Google OAuth Configuration - Complete ✅

## ✅ Credentials Added to .env.local

Your Google OAuth credentials have been successfully added:

- **Client ID**: `876661897018-ba2nd0caaejks1m8n000itpgc5hrm669.apps.googleusercontent.com`
- **Client Secret**: `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`

## ✅ Redirect URIs Verified

From your Google Cloud Console configuration, I can see:

**Authorized Redirect URIs:**
- ✅ `http://localhost:3000/api/auth/callback/google` - **CORRECT for NextAuth**
- ✅ `https://email-template-ab-tracker.firebaseapp.com/__/auth/handler` - For Firebase

**Authorized JavaScript Origins:**
- ✅ `http://localhost` - Works, but consider adding `http://localhost:3000` for better compatibility
- ✅ `http://localhost:5000`
- ✅ `https://email-template-ab-tracker.firebaseapp.com`

## ⚠️ Optional: Add Specific Port to JavaScript Origins

While `http://localhost` should work, it's better to be explicit. Consider adding:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:3000
   ```
5. Click **Save**

This ensures better compatibility with Next.js.

## 🚀 Next Steps

### 1. Restart Your Development Server

The environment variables are updated, but you need to restart the server:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 2. Test Google Sign-In

1. Go to http://localhost:3000/login
2. Click **"Sign in with Google"** button
3. You should now see the Google account selection screen! 🎉

### 3. If It Still Doesn't Work

Check browser console (F12) for errors:
- `redirect_uri_mismatch` → Wait 1-2 minutes after saving in Google Cloud Console
- `invalid_client` → Verify credentials in `.env.local`
- `access_denied` → Check OAuth consent screen is configured

## ✅ Configuration Summary

| Item | Status | Value |
|------|--------|-------|
| GOOGLE_CLIENT_ID | ✅ Set | `876661897018-ba2nd0caaejks1m8n000itpgc5hrm669.apps.googleusercontent.com` |
| GOOGLE_CLIENT_SECRET | ✅ Set | `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` |
| Redirect URI (NextAuth) | ✅ Configured | `http://localhost:3000/api/auth/callback/google` |
| JavaScript Origin | ✅ Configured | `http://localhost` (works, but `:3000` is better) |
| OAuth Consent Screen | ⚠️ Verify | Make sure it's configured in Google Cloud Console |

## 🔍 Verification Checklist

Before testing, verify:

- [x] `GOOGLE_CLIENT_ID` added to `.env.local`
- [x] `GOOGLE_CLIENT_SECRET` added to `.env.local`
- [x] Redirect URI configured in Google Cloud Console
- [ ] Dev server restarted (do this now!)
- [ ] OAuth consent screen configured (check in Google Cloud Console)
- [ ] Test user added (if app is in "Testing" mode)

## 🎯 Expected Behavior

After restarting the server:

1. Click "Sign in with Google"
2. Browser redirects to Google OAuth page
3. Select your Google account
4. Grant permissions (if first time)
5. Redirected back to your app
6. Logged in successfully! ✅

## 📝 For Production (Vercel)

When you deploy to Vercel, remember to:

1. **Add production redirect URI** in Google Cloud Console:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

2. **Add production JavaScript origin**:
   ```
   https://your-app.vercel.app
   ```

3. **Add environment variables in Vercel**:
   - `GOOGLE_CLIENT_ID` (same value works for both)
   - `GOOGLE_CLIENT_SECRET` (same value works for both)

---

**Everything is configured! Just restart your dev server and test it!** 🚀

