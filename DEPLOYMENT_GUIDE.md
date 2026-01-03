# Complete Deployment Guide - Host Your App for Zapier

## 📋 Overview

This guide will help you deploy your email A/B testing app to a free hosting service so you can use Zapier. We'll use **Vercel** (recommended) as it's free, easy, and perfect for Next.js apps.

---

## 🎯 Why Deploy?

- ✅ **Zapier needs a public URL** - Can't use localhost
- ✅ **Free hosting available** - No credit card needed
- ✅ **Automatic HTTPS** - Secure URLs
- ✅ **Free subdomain** - Get a URL like `your-app.vercel.app`
- ✅ **Easy deployment** - Deploy in minutes

---

## 🚀 Option 1: Deploy to Vercel (Recommended)

### Why Vercel?

- ✅ **Made for Next.js** - Created by Next.js team
- ✅ **Free tier** - Generous limits
- ✅ **Automatic deployments** - Deploy from Git
- ✅ **Free HTTPS** - Secure by default
- ✅ **Free subdomain** - `your-app.vercel.app`
- ✅ **Easy setup** - 5 minutes to deploy

### Step 1: Prepare Your Code

**1.1: Make sure your code is ready**

```bash
# Navigate to your project
cd C:\SaaSNew\email-ab-tracker

# Make sure everything is committed to Git
git status
```

**1.2: Check your environment variables**

Make sure you have a `.env.local` file with all required variables. You'll need to add these to Vercel later.

**Required variables:**
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `NEXT_PUBLIC_APP_URL` (will be set automatically by Vercel)

### Step 2: Create GitHub Repository (If Not Already Done)

**2.1: Initialize Git (if not already done)**

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"
```

**2.2: Create GitHub Repository**

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `email-ab-tracker` (or any name you like)
4. Description: "Email A/B Testing Tool"
5. Choose **Public** (free tier) or **Private** (if you have GitHub Pro)
6. **Don't** initialize with README, .gitignore, or license
7. Click **"Create repository"**

**2.3: Push Your Code to GitHub**

GitHub will show you commands. Run these in your terminal:

```bash
# Add GitHub as remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/email-ab-tracker.git

# Push your code
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

**3.1: Sign Up for Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (easiest option)
4. Authorize Vercel to access your GitHub account

**3.2: Import Your Project**

1. After signing in, click **"Add New Project"** or **"Import Project"**
2. You'll see your GitHub repositories
3. Find and click **"Import"** next to `email-ab-tracker`

**3.3: Configure Project**

Vercel will auto-detect Next.js. Configure:

1. **Project Name:** `email-ab-tracker` (or any name)
2. **Framework Preset:** Next.js (auto-detected)
3. **Root Directory:** `./` (default)
4. **Build Command:** `npm run build` (auto-detected)
5. **Output Directory:** `.next` (auto-detected)
6. **Install Command:** `npm install` (auto-detected)

**3.4: Add Environment Variables**

**This is critical!** Add all your environment variables:

1. Click **"Environment Variables"** section
2. Add each variable one by one:

```
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.vercel.app (will be set after first deploy)
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email
FIREBASE_PRIVATE_KEY=your-private-key
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app (will be set after first deploy)
```

**Important Notes:**
- For `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`, you'll need to update these after the first deployment with your actual Vercel URL
- For `FIREBASE_PRIVATE_KEY`, paste the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Make sure to select **"Production"**, **"Preview"**, and **"Development"** for each variable

**3.5: Deploy**

1. Click **"Deploy"** button
2. Wait 2-3 minutes for deployment to complete
3. You'll see a success message with your URL!

**3.6: Get Your URL**

After deployment, you'll see:
- **Your URL:** `https://email-ab-tracker.vercel.app` (or similar)
- Copy this URL - you'll need it!

### Step 4: Update Environment Variables with Your URL

**4.1: Update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL**

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Environment Variables"**
3. Find `NEXTAUTH_URL` and update it to: `https://your-actual-url.vercel.app`
4. Find `NEXT_PUBLIC_APP_URL` and update it to: `https://your-actual-url.vercel.app`
5. Click **"Save"**

**4.2: Redeploy**

1. Go to **"Deployments"** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Wait for redeployment to complete

### Step 5: Test Your Deployment

**5.1: Visit Your URL**

1. Open your browser
2. Go to: `https://your-app.vercel.app`
3. Your app should load!

**5.2: Test Tracking URLs**

1. Log in to your app
2. Create a test A/B test
3. Copy a tracking URL
4. Click it - it should work and redirect

**5.3: Test Webhook Endpoint**

You can test your webhook with curl:

```bash
curl -X POST https://your-app.vercel.app/api/ab-tests/[testId]/webhook \
  -H "Content-Type: application/json" \
  -d '{"eventType":"open","templateVersionId":"test-id"}'
```

---

## 🔌 Using Your Vercel URL with Zapier

### Step 1: Get Your Webhook URL

1. Log in to your deployed app
2. Go to an A/B test detail page
3. Copy the webhook URL (it will be like: `https://your-app.vercel.app/api/ab-tests/[testId]/webhook`)

### Step 2: Use in Zapier

1. Go to Zapier.com
2. Create a new Zap
3. When setting up the webhook action, use your Vercel URL
4. Example: `https://your-app.vercel.app/api/ab-tests/abc123/webhook`

**That's it!** Your webhook is now publicly accessible and Zapier can reach it.

---

## 🆓 Vercel Free Tier Limits

**What you get for free:**
- ✅ 100GB bandwidth per month
- ✅ Unlimited deployments
- ✅ Free HTTPS
- ✅ Free subdomain
- ✅ Automatic deployments from Git
- ✅ Preview deployments for pull requests

**Limits:**
- ⚠️ 100GB bandwidth/month (usually enough for testing)
- ⚠️ Serverless function execution time limits
- ⚠️ No custom domain on free tier (but subdomain works fine!)

**For your use case:** The free tier is perfect! You'll have plenty of bandwidth for A/B testing.

---

## 🔄 Updating Your App

**Automatic Updates:**

Every time you push to GitHub, Vercel automatically deploys:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically deploys in ~2 minutes!
```

**Manual Updates:**

1. Go to Vercel dashboard
2. Click **"Deployments"**
3. Click **"Redeploy"** on any deployment

---

## 🛠️ Alternative: Deploy to Netlify

If you prefer Netlify, here's a quick guide:

### Step 1: Sign Up

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub

### Step 2: Deploy

1. Click **"Add new site"** → **"Import an existing project"**
2. Connect to GitHub
3. Select your repository
4. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Add environment variables (same as Vercel)
6. Click **"Deploy"**

### Step 3: Get Your URL

You'll get a URL like: `https://random-name-123.netlify.app`

**Netlify vs Vercel:**
- Both are free
- Vercel is better for Next.js (made by Next.js team)
- Netlify is also great
- Choose either one!

---

## 🛠️ Alternative: Deploy to Railway

### Step 1: Sign Up

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Deploy

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Next.js
5. Add environment variables
6. Deploy!

**Railway Free Tier:**
- $5 credit per month
- Enough for small apps
- May need to upgrade for production

---

## 🛠️ Alternative: Deploy to Render

### Step 1: Sign Up

1. Go to [render.com](https://render.com)
2. Sign up with GitHub

### Step 2: Deploy

1. Click **"New"** → **"Web Service"**
2. Connect GitHub repository
3. Configure:
   - **Name:** `email-ab-tracker`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add environment variables
5. Deploy!

**Render Free Tier:**
- Free tier available
- Spins down after 15 minutes of inactivity
- Good for testing

---

## ✅ Recommended: Vercel

**For your use case, I recommend Vercel because:**

1. ✅ **Best for Next.js** - Made by Next.js creators
2. ✅ **Easiest setup** - 5 minutes to deploy
3. ✅ **Free tier is generous** - 100GB bandwidth
4. ✅ **Automatic HTTPS** - Secure by default
5. ✅ **Free subdomain** - Works perfectly with Zapier
6. ✅ **No credit card needed** - Completely free

---

## 🐛 Troubleshooting

### Issue: Build Fails

**Solution:**
1. Check build logs in Vercel dashboard
2. Common issues:
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

### Issue: App Doesn't Load

**Solution:**
1. Check if deployment succeeded
2. Check environment variables are set
3. Check browser console for errors
4. Verify `NEXT_PUBLIC_APP_URL` is set correctly

### Issue: Webhook Not Working

**Solution:**
1. Test webhook URL directly with curl
2. Check Vercel function logs
3. Verify environment variables
4. Check if URL is correct (no typos)

### Issue: Tracking URLs Not Working

**Solution:**
1. Verify `NEXT_PUBLIC_APP_URL` is set to your Vercel URL
2. Check tracking URL format
3. Test in browser directly
4. Check Vercel function logs

---

## 📝 Quick Checklist

Before deploying:

- [ ] Code is committed to Git
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported to Vercel
- [ ] All environment variables added
- [ ] First deployment completed
- [ ] Got your Vercel URL
- [ ] Updated `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`
- [ ] Redeployed with updated URLs
- [ ] Tested app in browser
- [ ] Tested tracking URLs
- [ ] Ready to use with Zapier!

---

## 🎯 Summary

**Quick Steps:**

1. ✅ Push code to GitHub
2. ✅ Sign up for Vercel
3. ✅ Import project from GitHub
4. ✅ Add environment variables
5. ✅ Deploy
6. ✅ Get your URL: `https://your-app.vercel.app`
7. ✅ Use URL in Zapier webhooks
8. ✅ Done!

**Your Zapier webhook URL will be:**
```
https://your-app.vercel.app/api/ab-tests/[testId]/webhook
```

**Your tracking URLs will be:**
```
https://your-app.vercel.app/t/[versionId]/test/[testId]?redirect=...
```

---

## 🚀 Next Steps

1. **Deploy to Vercel** (follow steps above)
2. **Test your app** - Make sure everything works
3. **Set up Zapier** - Use your Vercel URL
4. **Start A/B testing!** - You're ready to go!

---

**Need Help?** Check the [Zapier Integration Guide](./ZAPIER_INTEGRATION_GUIDE.md) for Zapier setup details.


