# Security Guide - Environment Variables

## 🔒 Why Firebase Admin Variables Are Needed

Firebase Admin SDK is used for **server-side operations** that require elevated permissions:

1. **User Authentication** - Creating and managing user accounts in Firestore
2. **Database Operations** - Reading/writing user data, templates, A/B tests
3. **Security Rules Bypass** - Server-side operations need admin access to enforce business logic
4. **User Management** - Updating user plans, subscriptions, etc.

**Without Firebase Admin:**
- ❌ App will compile and start
- ❌ But authentication won't work
- ❌ Database operations will fail
- ❌ Most features won't function

**With Firebase Admin:**
- ✅ Full functionality
- ✅ Secure server-side operations
- ✅ Proper user management

## 🚨 Security Best Practices

### 1. Never Commit Secrets to Git

✅ **SAFE to commit:**
- `.env.example` (placeholder values only)
- `.gitignore` (already configured to ignore `.env*`)

❌ **NEVER commit:**
- `.env.local`
- `.env`
- Any file containing actual secrets

### 2. How to Use with Public Git Repository

**Step 1: Create `.env.local` (already ignored by Git)**
```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your actual values
# This file is already in .gitignore - it will NOT be committed
```

**Step 2: Verify `.gitignore` includes `.env*`**
```gitignore
# This should already be in your .gitignore
.env*
```

**Step 3: Before pushing to Git**
```bash
# Double-check that .env.local is not tracked
git status

# If you see .env.local, it means it was committed before .gitignore was added
# Remove it from Git (but keep the local file):
git rm --cached .env.local
git commit -m "Remove .env.local from Git"
```

### 3. Deploying to Vercel

**Vercel Environment Variables (Recommended):**

1. Go to Vercel Dashboard > Your Project > Settings > Environment Variables
2. Add each variable from `.env.example`
3. Set for: Production, Preview, and Development
4. **Never** put secrets in your code or commit them

**Benefits:**
- ✅ Secrets are encrypted and stored securely
- ✅ Different values for production/preview/development
- ✅ Team members can't see each other's secrets
- ✅ Easy to rotate secrets without code changes

**How to Add Variables in Vercel:**
1. Go to: `https://vercel.com/your-project/settings/environment-variables`
2. Click "Add New"
3. Enter variable name (e.g., `FIREBASE_PRIVATE_KEY`)
4. Enter variable value
5. Select environments (Production, Preview, Development)
6. Click "Save"

### 4. Firebase Admin Private Key Format

The `FIREBASE_PRIVATE_KEY` must include the full key with newlines:

```bash
# ✅ CORRECT Format:
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"

# ❌ WRONG Format (missing \n):
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...-----END PRIVATE KEY-----"
```

**How to get the correct format:**
1. Download service account JSON from Firebase Console
2. Copy the `private_key` value (it already has `\n` characters)
3. Wrap it in double quotes in `.env.local`

### 5. What Happens If Secrets Are Exposed?

**If you accidentally commit secrets:**

1. **Immediately rotate them:**
   - Generate new Firebase service account key
   - Generate new Stripe API keys
   - Update all environment variables

2. **Remove from Git history:**
   ```bash
   # Use git-filter-repo or BFG Repo-Cleaner
   # This removes the file from all commits
   ```

3. **Notify your team** if working with others

4. **Check for unauthorized access:**
   - Review Firebase usage logs
   - Review Stripe transaction logs
   - Check for unexpected API calls

## 🔐 Minimum Required Variables for Localhost

**To just see the app compile (no functionality):**
```bash
NEXTAUTH_SECRET=any-random-string
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=test
NEXT_PUBLIC_FIREBASE_PROJECT_ID=test
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=test.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=test
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**For full functionality (requires Firebase project):**
- All variables from `.env.example`
- Real Firebase credentials
- Real Stripe credentials (for payments)

## ✅ Checklist Before Pushing to Public Repo

- [ ] `.env.local` exists and contains real secrets
- [ ] `.gitignore` includes `.env*`
- [ ] `.env.local` is NOT in `git status`
- [ ] `.env.example` exists with placeholder values
- [ ] No secrets in code comments
- [ ] No secrets in documentation files
- [ ] Ready to add secrets to Vercel environment variables

## 📚 Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Firebase Service Accounts](https://firebase.google.com/docs/admin/setup)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [Git Secrets Best Practices](https://www.gitguardian.com/secrets-detection)

