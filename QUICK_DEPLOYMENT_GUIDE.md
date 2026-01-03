# Quick Deployment Guide - 5 Minutes to Live!

## 🚀 Fast Track: Deploy to Vercel in 5 Minutes

### Prerequisites
- ✅ Your code is ready
- ✅ GitHub account (free)
- ✅ 5 minutes of time

---

## Step 1: Push to GitHub (2 minutes)

### 1.1: Create GitHub Repository

1. Go to [github.com](https://github.com) → Sign in
2. Click **"+"** → **"New repository"**
3. Name: `email-ab-tracker`
4. Click **"Create repository"**

### 1.2: Push Your Code

Open terminal in your project folder and run:

```bash
# If you haven't initialized Git yet
git init
git add .
git commit -m "Initial commit"

# Add GitHub remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/email-ab-tracker.git
git branch -M main
git push -u origin main
```

**Done!** Your code is on GitHub.

---

## Step 2: Deploy to Vercel (3 minutes)

### 2.1: Sign Up

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### 2.2: Import Project

1. Click **"Add New Project"**
2. Find `email-ab-tracker` in the list
3. Click **"Import"**

### 2.3: Add Environment Variables

**Click "Environment Variables" and add these:**

Copy from your `.env.local` file:

```
NEXTAUTH_SECRET=your-secret
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email
FIREBASE_PRIVATE_KEY=your-private-key
```

**Important:** 
- For `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`, leave them for now - we'll update after first deploy
- Select **Production**, **Preview**, and **Development** for each variable

### 2.4: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. **You'll get your URL!** 🎉

**Your URL will be:** `https://email-ab-tracker-xxxxx.vercel.app`

---

## Step 3: Update URLs (1 minute)

### 3.1: Update Environment Variables

1. Go to Vercel dashboard → Your project
2. **Settings** → **Environment Variables**
3. Update these two:
   - `NEXTAUTH_URL` = `https://your-actual-url.vercel.app`
   - `NEXT_PUBLIC_APP_URL` = `https://your-actual-url.vercel.app`
4. Click **"Save"**

### 3.2: Redeploy

1. Go to **"Deployments"** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait 1 minute

---

## ✅ Done! Your App is Live!

### Your URLs:

- **App URL:** `https://your-app.vercel.app`
- **Webhook URL:** `https://your-app.vercel.app/api/ab-tests/[testId]/webhook`
- **Tracking URLs:** `https://your-app.vercel.app/t/[versionId]/test/[testId]?redirect=...`

### Use with Zapier:

1. Copy your webhook URL from your A/B test page
2. Use it in Zapier: `https://your-app.vercel.app/api/ab-tests/[testId]/webhook`
3. **That's it!** Zapier can now reach your app! 🎉

---

## 🎯 Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported
- [ ] Environment variables added
- [ ] First deployment done
- [ ] Got Vercel URL
- [ ] Updated NEXTAUTH_URL and NEXT_PUBLIC_APP_URL
- [ ] Redeployed
- [ ] Tested app
- [ ] Ready for Zapier!

---

## 🆘 Need Help?

**Build fails?**
- Check Vercel build logs
- Verify all environment variables are set
- Check for TypeScript errors

**App doesn't load?**
- Check deployment status
- Verify environment variables
- Check browser console

**Webhook not working?**
- Test URL directly: `curl https://your-app.vercel.app/api/ab-tests/[testId]/webhook`
- Check Vercel function logs
- Verify URL is correct

---

## 📚 Full Guide

For detailed instructions, see [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

---

**That's it!** You're live in 5 minutes! 🚀


