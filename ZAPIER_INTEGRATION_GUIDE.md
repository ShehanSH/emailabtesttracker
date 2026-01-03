# Complete Zapier Integration Guide

## 📋 Table of Contents
1. [How Tracking URLs Work](#how-tracking-urls-work)
2. [Zapier Integration Overview](#zapier-integration-overview)
3. [Step-by-Step Zapier Setup](#step-by-step-zapier-setup)
4. [What's Already Implemented](#whats-already-implemented)
5. [What You Need to Do](#what-you-need-to-do)
6. [Complete User Workflow](#complete-user-workflow)
7. [Troubleshooting](#troubleshooting)

---

## 🔗 How Tracking URLs Work

### What Are Tracking URLs?

When you create an A/B test, our app generates **two special tracking URLs**:
- **Version A Tracking URL**: `https://yourapp.com/t/[versionA-id]/test/[test-id]`
- **Version B Tracking URL**: `https://yourapp.com/t/[versionB-id]/test/[test-id]`

### How Do Users Use Tracking URLs?

**YES - Users need to insert tracking URLs into their email campaigns!**

Here's the complete process:

#### Step 1: Create A/B Test
1. User creates A/B test in our app
2. Gets two tracking URLs (Version A and Version B)

#### Step 2: Copy Template HTML
1. User copies HTML from Version A template
2. User copies HTML from Version B template

#### Step 3: Create Email Campaigns in Mailchimp/ConvertKit
1. **For Version A Campaign:**
   - User opens Mailchimp/ConvertKit
   - Creates new email campaign
   - Pastes Version A HTML
   - **Finds all links in the email** (e.g., `<a href="https://example.com">Click here</a>`)
   - **Replaces each link** with the Version A tracking URL
   - Example: `<a href="https://yourapp.com/t/abc123/test/xyz789">Click here</a>`
   - Sends to 50% of audience

2. **For Version B Campaign:**
   - Same process but uses Version B HTML
   - Replaces links with Version B tracking URL
   - Sends to other 50% of audience

#### Step 4: How Tracking Works
- **When someone clicks a link** in the email:
  - They click the tracking URL
  - Our app records: "Version A got 1 click" (or Version B)
  - Our app redirects them to the original destination
  - Results update automatically on dashboard

### Example: Replacing Links

**Original Email HTML:**
```html
<a href="https://myshop.com/products/shoes">Buy Now</a>
<a href="https://myshop.com/about">Learn More</a>
```

**After Replacing with Tracking URL:**
```html
<!-- Version A -->
<a href="https://yourapp.com/t/versionA-id/test/test-id?redirect=https://myshop.com/products/shoes">Buy Now</a>
<a href="https://yourapp.com/t/versionA-id/test/test-id?redirect=https://myshop.com/about">Learn More</a>

<!-- Version B -->
<a href="https://yourapp.com/t/versionB-id/test/test-id?redirect=https://myshop.com/products/shoes">Buy Now</a>
<a href="https://yourapp.com/t/versionB-id/test/test-id?redirect=https://myshop.com/about">Learn More</a>
```

**Note:** Currently, our tracking URLs don't include redirect parameters. We need to enhance this (see "What You Need to Do" section).

---

## 🔌 Zapier Integration Overview

### What Zapier Does

Zapier connects your email marketing platform (Mailchimp, ConvertKit, etc.) to our app's webhook. When events happen in your email platform, Zapier automatically sends them to our app.

### Two Types of Tracking

1. **Click Tracking (Automatic via Tracking URLs)**
   - ✅ Already works!
   - Users replace links with tracking URLs
   - Clicks are tracked automatically
   - No Zapier needed for clicks

2. **Open Tracking (Requires Zapier)**
   - ⚠️ Needs Zapier setup
   - When email is opened, Zapier sends event to our webhook
   - Our app records the open
   - Results update automatically

### Why Use Zapier?

- **Automatic**: No manual work needed
- **Real-time**: Results update instantly
- **Accurate**: Direct from email platform
- **Complete**: Tracks both opens and clicks

---

## 📝 Step-by-Step Zapier Setup

### Prerequisites
1. Zapier account (free or paid)
2. A/B test created in our app
3. Webhook URL from A/B test detail page

### Step 1: Get Your Webhook URL

1. Go to your A/B test detail page: `/ab-tests/[testId]`
2. Scroll to "Webhook Integration" section
3. Copy the webhook URL (e.g., `https://yourapp.com/api/ab-tests/abc123/webhook`)

### Step 2: Create a Zap in Zapier

1. **Go to Zapier.com** and log in
2. Click **"Create Zap"** button
3. **Name your Zap**: "Mailchimp to Email AB Tracker" (or your email platform)

### Step 3: Set Up Trigger (Email Platform)

**For Mailchimp:**
1. Search for **"Mailchimp"** as trigger
2. Select **"Email Opened"** or **"Email Clicked"** event
3. Connect your Mailchimp account
4. Select the campaign/list you want to track
5. Test the trigger

**For ConvertKit:**
1. Search for **"ConvertKit"** as trigger
2. Select **"Email Opened"** or **"Email Clicked"** event
3. Connect your ConvertKit account
4. Select the broadcast/campaign
5. Test the trigger

**For Other Platforms:**
- Look for "Email Opened" or "Email Clicked" triggers
- Connect your account
- Select the campaign to track

### Step 4: Set Up Action (Webhook)

1. Search for **"Webhooks by Zapier"**
2. Select **"POST"** as the action
3. **Enter your webhook URL** (from Step 1)
4. **Set Method**: POST
5. **Set Data Pass-Through**: No

### Step 5: Map Event Data

Configure the webhook payload. Our app expects this format:

```json
{
  "eventType": "open" or "click",
  "templateVersionId": "version-id-here",
  "recipientEmail": "user@example.com",
  "metadata": {}
}
```

**Mapping in Zapier:**

1. **eventType**:
   - If trigger is "Email Opened" → Map to: `"open"`
   - If trigger is "Email Clicked" → Map to: `"click"`
   - Or use Zapier's "Text" field and type: `open` or `click`

2. **templateVersionId**:
   - This is tricky! You need to determine which version (A or B) was sent
   - **Option A**: Use Zapier's "Code" step to check campaign name
   - **Option B**: Create separate Zaps for Version A and Version B
   - **Option C**: Use metadata from email platform to identify version
   - **Recommended**: Create two Zaps - one for Version A, one for Version B

3. **recipientEmail**:
   - Map from trigger: `Subscriber Email` or `Recipient Email`
   - This is optional but recommended

4. **metadata**:
   - Optional: Add any additional data
   - Can be empty object: `{}`

### Step 6: Test Your Zap

1. Click **"Test"** button in Zapier
2. Check if webhook receives the data
3. Verify in our app that the event was recorded
4. Check A/B test results page

### Step 7: Activate Your Zap

1. If test is successful, click **"Turn on Zap"**
2. Your integration is now live!

### Step 8: Create Second Zap (For Version B)

Since you need to track both versions separately:
1. Duplicate the first Zap
2. Change the campaign/list to Version B campaign
3. Update `templateVersionId` to Version B ID
4. Activate the second Zap

---

## ✅ What's Already Implemented

### Backend (Already Working)

1. **Webhook Endpoint** ✅
   - Route: `/api/ab-tests/[testId]/webhook`
   - Method: POST
   - Accepts: `eventType`, `templateVersionId`, `recipientEmail`, `metadata`
   - Updates A/B test results automatically
   - Calculates CTR and statistical significance

2. **Tracking URL Handler** ✅
   - Route: `/t/[templateVersionId]/test/[testId]`
   - Tracks clicks automatically
   - Records events in database
   - Updates test results

3. **Webhook Info API** ✅
   - Route: `/api/ab-tests/[testId]/webhook-info`
   - Returns webhook URL and instructions
   - Provides Zapier setup steps

4. **UI Components** ✅
   - Webhook info display on A/B test detail page
   - Copy webhook URL button
   - Zapier instructions

### What Works Right Now

- ✅ Click tracking via tracking URLs (automatic)
- ✅ Webhook endpoint ready for Zapier
- ✅ Real-time result updates
- ✅ Statistical significance calculation
- ✅ Winner determination

---

## ⚠️ What You Need to Do

### 1. Enhance Tracking URLs (Recommended)

**Current Issue:**
- Tracking URLs don't include redirect destination
- When user clicks, they go to our app but don't get redirected to final destination

**Solution:**
Update tracking URL handler to accept redirect parameter:

```typescript
// In app/t/[templateVersionId]/test/[testId]/route.ts
const redirectUrl = req.nextUrl.searchParams.get('redirect') || 'https://example.com';
// After recording click, redirect to redirectUrl
return NextResponse.redirect(redirectUrl);
```

**Update tracking URL generation:**
```typescript
// In app/api/ab-tests/create/route.ts
// Allow users to specify destination URLs
// Generate: `/t/[id]/test/[id]?redirect=https://destination.com`
```

### 2. Improve Webhook Info Instructions

**Current:**
- Basic instructions exist
- Not very detailed for Zapier

**Enhance:**
- Add screenshots/examples
- Provide pre-configured Zap templates
- Add version identification help

### 3. Add Destination URL Field (Optional but Recommended)

**Add to A/B test creation form:**
- Field: "Destination URL" (where links should redirect)
- Use this when generating tracking URLs
- Makes it easier for users

### 4. Create Zapier App (Advanced - Optional)

**For better integration:**
- Create official Zapier app
- Users can install from Zapier marketplace
- Pre-configured triggers and actions
- Better UX

**Steps:**
1. Register at https://developer.zapier.com
2. Create new app
3. Define triggers and actions
4. Submit for review
5. Publish to marketplace

---

## 🔄 Complete User Workflow

### Scenario: User wants to A/B test an email campaign

#### Phase 1: Setup in Our App

1. **Create Templates**
   - User creates Template A and Template B in our app
   - Or creates one template with two versions

2. **Create A/B Test**
   - Go to `/ab-tests/new`
   - Select Version A and Version B
   - Enter campaign name and audience size
   - Click "Create A/B Test"

3. **Get Tracking URLs**
   - Copy Version A tracking URL
   - Copy Version B tracking URL
   - Copy webhook URL (for Zapier)

4. **Copy Template HTML**
   - View Version A template → Copy HTML
   - View Version B template → Copy HTML

#### Phase 2: Setup in Email Platform (Mailchimp Example)

1. **Create Version A Campaign**
   - Open Mailchimp
   - Create new email campaign
   - Switch to "Code" view
   - Paste Version A HTML
   - Find all `<a href="...">` tags
   - Replace `href` with Version A tracking URL
   - Save campaign

2. **Create Version B Campaign**
   - Same process with Version B HTML
   - Use Version B tracking URL

3. **Send Campaigns**
   - Send Version A to 50% of audience
   - Send Version B to other 50%

#### Phase 3: Setup Zapier (For Open Tracking)

1. **Create Zap for Version A**
   - Trigger: Mailchimp "Email Opened"
   - Filter: Campaign = Version A campaign
   - Action: Webhook POST
   - URL: Your webhook URL
   - Payload: `{ "eventType": "open", "templateVersionId": "versionA-id", ... }`

2. **Create Zap for Version B**
   - Same but for Version B

3. **Activate Zaps**
   - Turn on both Zaps

#### Phase 4: Monitor Results

1. **View Dashboard**
   - Go to `/ab-tests/[testId]`
   - See real-time results:
     - Opens (from Zapier)
     - Clicks (from tracking URLs)
     - CTR
     - Winner (when statistically significant)

2. **Export Data**
   - Click "Export CSV" or "Export JSON"
   - Download complete test data

---

## 🐛 Troubleshooting

### Issue: Tracking URLs not working

**Symptoms:**
- Clicks not being recorded
- 404 errors when clicking tracking URLs

**Solutions:**
1. Check if tracking URL format is correct
2. Verify test ID exists in database
3. Check server logs for errors
4. Ensure `NEXT_PUBLIC_APP_URL` is set correctly

### Issue: Zapier webhook not receiving events

**Symptoms:**
- Opens not being tracked
- Webhook returns errors

**Solutions:**
1. **Check webhook URL:**
   - Verify URL is correct
   - Test with curl: `curl -X POST [webhook-url] -d '{"eventType":"open","templateVersionId":"test"}'`

2. **Check payload format:**
   - Ensure JSON is valid
   - Verify all required fields are present
   - Check field names match exactly

3. **Check Zapier logs:**
   - Go to Zapier dashboard
   - View Zap history
   - Check for error messages

4. **Verify templateVersionId:**
   - Must match Version A or Version B ID
   - Check in A/B test detail page

### Issue: Results not updating

**Symptoms:**
- Events received but results don't change
- Dashboard shows old data

**Solutions:**
1. Refresh the page
2. Check database directly
3. Verify webhook is processing correctly
4. Check for errors in server logs

### Issue: Can't identify which version in Zapier

**Problem:**
- Zapier doesn't know if email is Version A or B

**Solutions:**
1. **Use campaign names:**
   - Name campaigns: "Campaign A" and "Campaign B"
   - Use Zapier filters to route to correct version

2. **Use separate lists:**
   - Create separate lists for Version A and Version B
   - Create separate Zaps for each list

3. **Use metadata:**
   - Add custom field in email platform
   - Use Zapier to read metadata
   - Route based on metadata value

---

## 📚 Additional Resources

### Zapier Documentation
- [Webhooks by Zapier](https://zapier.com/apps/webhook/help)
- [Creating Custom Integrations](https://platform.zapier.com/docs/intro)

### Our App Documentation
- A/B Test Detail Page: Shows webhook URL and instructions
- Webhook Info API: Returns setup instructions

### Support
- Check server logs: `/api/ab-tests/[testId]/webhook` errors
- Test webhook manually with curl or Postman
- Verify database records in Firestore

---

## 🎯 Summary

### What Users Need to Do:

1. ✅ **Create A/B test** → Get tracking URLs
2. ✅ **Copy template HTML** from our app
3. ✅ **Paste HTML** into Mailchimp/ConvertKit
4. ✅ **Replace links** with tracking URLs
5. ✅ **Set up Zapier** (optional, for open tracking)
6. ✅ **Send campaigns** from email platform
7. ✅ **View results** in our app dashboard

### What Works Automatically:

- ✅ Click tracking (via tracking URLs)
- ✅ Real-time result updates
- ✅ CTR calculation
- ✅ Winner determination
- ✅ Statistical significance

### What Requires Setup:

- ⚠️ Open tracking (requires Zapier)
- ⚠️ Link replacement (manual, but necessary)
- ⚠️ Zapier configuration (one-time setup)

---

**Next Steps:**
1. Test the workflow end-to-end
2. Create example Zapier Zaps for common platforms
3. Enhance tracking URLs with redirect support
4. Add better documentation in the UI

