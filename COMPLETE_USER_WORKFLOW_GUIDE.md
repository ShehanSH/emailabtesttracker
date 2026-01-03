# Complete User Workflow Guide - Email A/B Testing

## 📋 Overview

This guide walks you through the **complete process** of creating and running an email A/B test using our tool. Follow these steps in order to ensure everything works correctly.

---

## 🎯 The Complete Workflow

### Phase 1: Create Your Email in Your Email Marketing Tool

**Step 1: Design Your Email**
1. Open your email marketing tool (Mailchimp, ConvertKit, Klaviyo, etc.)
2. Create your email campaign as you normally would
3. Design Version A of your email
4. Design Version B of your email (the variation you want to test)
5. **Important:** Make sure both versions have the same links that you want to track
   - Example: Both versions should have a "Buy Now" button linking to `https://myshop.com/products/shoes`

**Step 2: Get the HTML Code**
1. In your email marketing tool, switch to **"Code"** or **"HTML"** view
2. **Copy the entire HTML code** for Version A
3. **Copy the entire HTML code** for Version B
4. Save these HTML codes - you'll need them in the next phase

**Example of what you'll copy:**
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Check out our sale!</h1>
  <a href="https://myshop.com/products/shoes">Buy Now</a>
  <a href="https://myshop.com/about">Learn More</a>
</body>
</html>
```

---

### Phase 2: Create Templates in Our Tool

**Step 1: Create Template A**
1. Go to `/templates/new` in our app
2. Give it a name like "Sale Email - Version A"
3. **Paste the HTML code** you copied from Version A
4. Click "Create Template"
5. Save the template ID or remember which template this is

**Step 2: Create Template B**
1. Go to `/templates/new` again
2. Give it a name like "Sale Email - Version B"
3. **Paste the HTML code** you copied from Version B
4. Click "Create Template"
5. Save the template ID or remember which template this is

**Note:** You can also create templates first and then design emails in your marketing tool based on them. Either order works!

---

### Phase 3: Create A/B Test in Our Tool

**Step 1: Navigate to A/B Test Creation**
1. Go to `/ab-tests/new` in our app
2. You'll see a form to create a new A/B test

**Step 2: Select Your Templates**
1. **Select Template A:** Choose the template you created for Version A
2. **Select Version A:** Choose the version (usually v1.0 if it's the first version)
3. **Select Template B:** Choose the template you created for Version B
4. **Select Version B:** Choose the version

**Step 3: Fill in Test Details**
1. **Campaign Name:** Enter a name like "Summer Sale A/B Test"
2. **Audience Size:** Enter how many people you'll send to (e.g., 10,000)
3. Click **"Create A/B Test"**

**Step 4: Get Your Tracking URLs**
After creating the test, you'll see:
- **Version A Tracking URL:** `https://yourapp.com/t/[versionA-id]/test/[test-id]`
- **Version B Tracking URL:** `https://yourapp.com/t/[versionB-id]/test/[test-id]`
- **Webhook URL:** `https://yourapp.com/api/ab-tests/[test-id]/webhook` (for Zapier)

**Copy these URLs** - you'll need them in the next phase!

---

### Phase 4: Insert Tracking URLs into Your Email HTML

**This is the critical step!** You need to replace the original links in your email HTML with tracking URLs that include redirect parameters.

#### Understanding Redirect Parameters

**Original link in your email:**
```html
<a href="https://myshop.com/products/shoes">Buy Now</a>
```

**After adding tracking URL with redirect:**
```html
<a href="https://yourapp.com/t/versionA-id/test/test-id?redirect=https://myshop.com/products/shoes">Buy Now</a>
```

**How it works:**
1. User clicks the link
2. Goes to our tracking URL first
3. Our app records the click
4. Our app redirects to `https://myshop.com/products/shoes`
5. User sees the product page

#### Step-by-Step: Replace Links in HTML

**For Version A Email:**

1. Take the HTML code you copied from your email marketing tool (Version A)
2. Find all `<a href="...">` tags
3. For each link, replace the `href` with:
   ```
   https://yourapp.com/t/[versionA-id]/test/[test-id]?redirect=[original-destination]
   ```

**Example:**

**Before:**
```html
<a href="https://myshop.com/products/shoes">Buy Now</a>
<a href="https://myshop.com/about">Learn More</a>
```

**After (Version A):**
```html
<a href="https://yourapp.com/t/abc123/test/xyz789?redirect=https://myshop.com/products/shoes">Buy Now</a>
<a href="https://yourapp.com/t/abc123/test/xyz789?redirect=https://myshop.com/about">Learn More</a>
```

**For Version B Email:**

Same process, but use the Version B tracking URL:

**After (Version B):**
```html
<a href="https://yourapp.com/t/def456/test/xyz789?redirect=https://myshop.com/products/shoes">Buy Now</a>
<a href="https://yourapp.com/t/def456/test/xyz789?redirect=https://myshop.com/about">Learn More</a>
```

**Important Notes:**
- ✅ Use the **same tracking URL** for all links in the same version
- ✅ Only change the `redirect=` parameter for different destinations
- ✅ Make sure to URL-encode special characters in redirect URLs if needed
- ✅ Don't replace image sources (`<img src="...">`) or CSS links
- ✅ Only replace clickable links (`<a href="...">`)

---

### Phase 5: Paste Updated HTML Back into Email Marketing Tool

**Step 1: For Version A Campaign**
1. Go back to your email marketing tool
2. Open the Version A campaign
3. Switch to **"Code"** or **"HTML"** view
4. **Replace the entire HTML** with your updated HTML (with tracking URLs)
5. Switch back to visual view to verify it looks correct
6. Save the campaign

**Step 2: For Version B Campaign**
1. Open the Version B campaign
2. Switch to **"Code"** or **"HTML"** view
3. **Replace the entire HTML** with your updated HTML (with tracking URLs)
4. Switch back to visual view to verify it looks correct
5. Save the campaign

**Step 3: Test Before Sending**
1. Send a test email to yourself for Version A
2. Click the links - they should redirect to your destination
3. Check our app dashboard - you should see 1 click recorded
4. Repeat for Version B

---

### Phase 6: Send Your Campaigns

**Step 1: Send Version A**
1. In your email marketing tool, send Version A to **50% of your audience**
2. Make sure to note which campaign this is (for Zapier setup later)

**Step 2: Send Version B**
1. Send Version B to the **other 50% of your audience**
2. Make sure to note which campaign this is (for Zapier setup later)

**Important:** 
- Send both versions at the same time for accurate results
- Make sure the audiences don't overlap
- Use the same audience size for both versions

---

### Phase 7: Track Results

**Automatic Click Tracking:**
- ✅ Clicks are tracked automatically via tracking URLs
- ✅ Results update in real-time on your dashboard
- ✅ Go to `/ab-tests/[testId]` to see results

**Optional: Set Up Zapier for Open Tracking**

If you want to track email opens automatically:

1. **You need a public URL** (see "Zapier and Localhost" section below)
2. Set up Zapier to send open events to your webhook URL
3. See the [Zapier Integration Guide](./ZAPIER_INTEGRATION_GUIDE.md) for details

**Manual Open Tracking:**
- You can manually enter open counts from your email platform
- Or just track clicks (which is often enough for A/B testing)

---

## 🔍 Visual Workflow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Create Email in Marketing Tool (Mailchimp/ConvertKit)    │
│    - Design Version A                                       │
│    - Design Version B                                       │
│    - Copy HTML code for both versions                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Create Templates in Our App                             │
│    - Paste Version A HTML → Create Template A              │
│    - Paste Version B HTML → Create Template B               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Create A/B Test in Our App                              │
│    - Select Template A & Version A                         │
│    - Select Template B & Version B                         │
│    - Get Tracking URLs                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. Replace Links in HTML with Tracking URLs                │
│    Original: <a href="https://shop.com">Buy</a>           │
│    Updated:  <a href="[tracking-url]?redirect=https://    │
│              shop.com">Buy</a>                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. Paste Updated HTML Back into Marketing Tool             │
│    - Replace HTML in Version A campaign                    │
│    - Replace HTML in Version B campaign                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 6. Send Campaigns                                          │
│    - Send Version A to 50% of audience                     │
│    - Send Version B to other 50%                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 7. View Results in Our Dashboard                           │
│    - Clicks tracked automatically                          │
│    - Real-time updates                                     │
│    - See winner when statistically significant             │
└─────────────────────────────────────────────────────────────┘
```

---

## ❓ Frequently Asked Questions

### Q: Do I need to replace ALL links in my email?

**A:** No, only the links you want to track. Usually just the main call-to-action buttons. You don't need to track every link.

### Q: What if I forget to add the redirect parameter?

**A:** The tracking URL will still work and record clicks, but users will be redirected to a default page (currently `https://example.com`). Always include the `redirect=` parameter!

### Q: Can I use the same tracking URL for multiple links?

**A:** Yes! Use the same tracking URL for all links in the same version. Just change the `redirect=` parameter for different destinations.

### Q: What happens if my redirect URL has special characters?

**A:** You may need to URL-encode it. For example:
- `https://myshop.com/products?category=shoes&size=large`
- Becomes: `https://yourapp.com/t/abc123/test/xyz789?redirect=https%3A%2F%2Fmyshop.com%2Fproducts%3Fcategory%3Dshoes%26size%3Dlarge`

Most email marketing tools will handle this automatically when you paste the URL.

### Q: Can I test the tracking URLs before sending?

**A:** Yes! 
1. Click the tracking URL in your browser
2. It should redirect to your destination
3. Check your dashboard - you should see 1 click recorded
4. This confirms everything is working

### Q: What if I want to track opens too?

**A:** You have two options:
1. **Use Zapier** (requires public URL - see next section)
2. **Manual tracking** - Enter open counts from your email platform manually

---

## 🔌 Zapier and Localhost vs Production

### Can I Use Zapier with Localhost?

**Short Answer: NO** ❌

Zapier cannot access `http://localhost:3000` because:
- Localhost URLs are only accessible on your computer
- Zapier's servers are on the internet and can't reach your local machine
- Webhooks need to be publicly accessible

### Your Options:

#### Option 1: Use a Tunneling Service (For Development/Testing)

**Use ngrok or similar:**

1. **Install ngrok:**
   ```bash
   # Download from https://ngrok.com
   # Or use: npm install -g ngrok
   ```

2. **Start your app:**
   ```bash
   npm run dev
   # App runs on http://localhost:3000
   ```

3. **Start ngrok tunnel:**
   ```bash
   ngrok http 3000
   ```

4. **Get your public URL:**
   ```
   Forwarding: https://abc123.ngrok.io -> http://localhost:3000
   ```

5. **Use the ngrok URL in Zapier:**
   - Webhook URL: `https://abc123.ngrok.io/api/ab-tests/[testId]/webhook`
   - Tracking URLs: `https://abc123.ngrok.io/t/[versionId]/test/[testId]`

**Important Notes:**
- ⚠️ ngrok free tier has limitations (URL changes on restart, request limits)
- ⚠️ Only use for testing, not production
- ⚠️ The URL changes every time you restart ngrok (unless you have a paid plan)

#### Option 2: Deploy to Production (Recommended)

**For real use, deploy your app:**

1. **Deploy to Vercel, Netlify, or similar:**
   ```bash
   # Example with Vercel
   npm install -g vercel
   vercel deploy
   ```

2. **Get your production URL:**
   - Example: `https://your-app.vercel.app`

3. **Update environment variables:**
   ```bash
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

4. **Use production URLs:**
   - Webhook URL: `https://your-app.vercel.app/api/ab-tests/[testId]/webhook`
   - Tracking URLs: `https://your-app.vercel.app/t/[versionId]/test/[testId]`

**Benefits:**
- ✅ Permanent URLs that don't change
- ✅ Reliable and fast
- ✅ Works with Zapier perfectly
- ✅ Professional for your users

### Summary: Localhost vs Production

| Scenario | Localhost | Production |
|----------|-----------|------------|
| **Testing tracking URLs** | ✅ Works (click in browser) | ✅ Works |
| **Zapier webhooks** | ❌ Doesn't work | ✅ Works |
| **Email campaigns** | ⚠️ Use ngrok | ✅ Works |
| **Real users** | ❌ Don't use | ✅ Use this |

**Recommendation:**
- **Development/Testing:** Use localhost + ngrok for testing Zapier
- **Production:** Deploy to Vercel/Netlify and use production URLs

---

## ✅ Quick Checklist

Before sending your campaigns, make sure:

- [ ] Created templates in our app with your email HTML
- [ ] Created A/B test and got tracking URLs
- [ ] Replaced all links in Version A HTML with tracking URL + redirect
- [ ] Replaced all links in Version B HTML with tracking URL + redirect
- [ ] Pasted updated HTML back into email marketing tool
- [ ] Tested tracking URLs (clicked them, verified redirect works)
- [ ] Verified dashboard shows test clicks
- [ ] Set up Zapier (optional, for open tracking)
- [ ] Ready to send campaigns!

---

## 🎯 Summary

**The Key Steps:**
1. ✅ Create email in marketing tool → Copy HTML
2. ✅ Create templates in our app → Paste HTML
3. ✅ Create A/B test → Get tracking URLs
4. ✅ **Replace links in HTML** with tracking URLs + redirect parameter
5. ✅ Paste updated HTML back into marketing tool
6. ✅ Send campaigns
7. ✅ View results in dashboard

**The Critical Part:**
You MUST replace the original links in your email HTML with tracking URLs that include the `redirect=` parameter. This is how we track clicks while still sending users to your actual destination.

**Example:**
```html
<!-- Original -->
<a href="https://myshop.com/products">Buy Now</a>

<!-- With Tracking -->
<a href="https://yourapp.com/t/abc123/test/xyz789?redirect=https://myshop.com/products">Buy Now</a>
```

This way, when someone clicks:
1. They go to our tracking URL first
2. We record the click
3. We redirect them to your shop
4. Everyone is happy! 🎉

---

**Need Help?** Check the [Zapier Integration Guide](./ZAPIER_INTEGRATION_GUIDE.md) or [Troubleshooting Guide](./TROUBLESHOOTING.md).

