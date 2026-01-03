# Tracking URLs - Complete Explanation

## 🔗 What Are Tracking URLs?

Tracking URLs are special links that:
1. **Track clicks automatically** when someone clicks them
2. **Record which version** (A or B) was clicked
3. **Update results in real-time** on your dashboard
4. **Redirect to your actual destination** after tracking

## 📍 Where Do Users Insert Tracking URLs?

### ✅ YES - Users MUST insert tracking URLs into their email campaigns!

**The Process:**

1. **User creates A/B test** in our app
2. **Gets two tracking URLs:**
   - Version A: `https://yourapp.com/t/abc123/test/xyz789`
   - Version B: `https://yourapp.com/t/def456/test/xyz789`

3. **User copies HTML** from templates in our app

4. **User creates email campaigns** in Mailchimp/ConvertKit:
   - **Campaign A**: Pastes Version A HTML
   - **Campaign B**: Pastes Version B HTML

5. **User replaces ALL links** in the email HTML:
   - Finds: `<a href="https://myshop.com/products">Buy Now</a>`
   - Replaces with: `<a href="https://yourapp.com/t/abc123/test/xyz789?redirect=https://myshop.com/products">Buy Now</a>`

6. **User sends campaigns:**
   - Version A to 50% of audience
   - Version B to other 50%

## 🎯 How It Works

### When Someone Clicks a Link:

```
User clicks email link
    ↓
Goes to: https://yourapp.com/t/abc123/test/xyz789?redirect=https://myshop.com/products
    ↓
Our app records: "Version A got 1 click"
    ↓
Our app redirects to: https://myshop.com/products
    ↓
User sees the actual product page
```

### What Gets Tracked:

- ✅ **Which version** was clicked (A or B)
- ✅ **When** it was clicked (timestamp)
- ✅ **Who** clicked it (user agent, optional email)
- ✅ **Where** they came from (campaign metadata)

### What Updates Automatically:

- ✅ Click count for each version
- ✅ CTR (Click-Through Rate)
- ✅ Winner determination
- ✅ Statistical significance

## 📝 Example: Replacing Links

### Original Email HTML:
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Check out our sale!</h1>
  <a href="https://myshop.com/products/shoes">Buy Shoes</a>
  <a href="https://myshop.com/about">Learn More</a>
  <a href="https://myshop.com/contact">Contact Us</a>
</body>
</html>
```

### After Replacing with Tracking URLs (Version A):
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Check out our sale!</h1>
  <a href="https://yourapp.com/t/abc123/test/xyz789?redirect=https://myshop.com/products/shoes">Buy Shoes</a>
  <a href="https://yourapp.com/t/abc123/test/xyz789?redirect=https://myshop.com/about">Learn More</a>
  <a href="https://yourapp.com/t/abc123/test/xyz789?redirect=https://myshop.com/contact">Contact Us</a>
</body>
</html>
```

### After Replacing with Tracking URLs (Version B):
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Check out our sale!</h1>
  <a href="https://yourapp.com/t/def456/test/xyz789?redirect=https://myshop.com/products/shoes">Buy Shoes</a>
  <a href="https://yourapp.com/t/def456/test/xyz789?redirect=https://myshop.com/about">Learn More</a>
  <a href="https://yourapp.com/t/def456/test/xyz789?redirect=https://myshop.com/contact">Contact Us</a>
</body>
</html>
```

## 🔧 How to Replace Links

### Method 1: Manual (Find & Replace)

1. Open email HTML in text editor
2. Find all instances of: `href="https://`
3. Replace with tracking URL + redirect parameter
4. Save and use in email platform

### Method 2: Using Mailchimp/ConvertKit Editor

1. Paste HTML into email editor
2. Switch to "Code" view
3. Find and replace links manually
4. Switch back to visual view
5. Verify links work

### Method 3: Automated (Future Enhancement)

We could add a feature to automatically replace links when copying HTML, but this requires parsing HTML which can be complex.

## ⚠️ Important Notes

### What Links Should Be Replaced?

- ✅ **All clickable links** (`<a href="...">`)
- ✅ **Call-to-action buttons**
- ✅ **Product links**
- ✅ **Navigation links**
- ✅ **Social media links** (if you want to track them)

### What Should NOT Be Replaced?

- ❌ **Image sources** (`<img src="...">`)
- ❌ **CSS links** (`<link href="...">`)
- ❌ **Script sources** (`<script src="...">`)
- ❌ **Email addresses** (`mailto:` links - optional)

### Redirect Parameter Format

```
https://yourapp.com/t/[versionId]/test/[testId]?redirect=[destination]
```

**Example:**
```
https://yourapp.com/t/abc123/test/xyz789?redirect=https://myshop.com/products
```

**Important:** The `redirect` parameter must be URL-encoded if it contains special characters.

## 🎯 Complete Workflow

### Step-by-Step for Users:

1. ✅ Create A/B test → Get tracking URLs
2. ✅ Copy HTML from Version A template
3. ✅ Copy HTML from Version B template
4. ✅ Open Mailchimp/ConvertKit
5. ✅ Create Campaign A:
   - Paste Version A HTML
   - Replace all links with Version A tracking URL + redirect
   - Save campaign
6. ✅ Create Campaign B:
   - Paste Version B HTML
   - Replace all links with Version B tracking URL + redirect
   - Save campaign
7. ✅ Send Campaign A to 50% of audience
8. ✅ Send Campaign B to other 50%
9. ✅ View results in our app dashboard

## 🔍 Testing Tracking URLs

### Before Sending Campaign:

1. **Test tracking URL directly:**
   - Click the tracking URL in browser
   - Should redirect to destination
   - Check dashboard - should show 1 click

2. **Test in email preview:**
   - Send test email to yourself
   - Click links in email
   - Verify redirect works
   - Check dashboard for events

3. **Verify results:**
   - Go to A/B test detail page
   - Should see clicks being recorded
   - Results update in real-time

## 💡 Pro Tips

1. **Use consistent redirect URLs:**
   - Same destination for both versions
   - Only the tracking URL changes

2. **Test before sending:**
   - Always test tracking URLs
   - Verify redirect works
   - Check dashboard shows events

3. **Track important links:**
   - Focus on main CTA buttons
   - Track product links
   - Don't need to track every link

4. **Monitor results:**
   - Check dashboard regularly
   - Wait for statistical significance
   - Don't end test too early

## ❓ FAQ

**Q: Do I need to replace ALL links?**
A: No, only the links you want to track. Usually just the main call-to-action buttons.

**Q: What if I forget to replace a link?**
A: That link won't be tracked, but other links will still work. The tracking URL only tracks clicks on links that use it.

**Q: Can I use the same tracking URL for multiple links?**
A: Yes! The same tracking URL can be used for all links in a version. Just change the `redirect` parameter.

**Q: What happens if redirect URL is wrong?**
A: Our app validates the URL. If invalid, it redirects to a default page (currently example.com).

**Q: Do tracking URLs expire?**
A: No, they work as long as the A/B test exists. You can use them for multiple campaigns.

---

## 📊 Summary

- ✅ **Tracking URLs are required** - Users must insert them
- ✅ **Replace links in email HTML** - Before sending campaigns
- ✅ **Use redirect parameter** - To send users to final destination
- ✅ **Works automatically** - No additional setup needed for clicks
- ✅ **Real-time updates** - Dashboard shows results instantly

**The key point:** Users create emails in Mailchimp/ConvertKit, but they need to replace the links with our tracking URLs to enable click tracking!

