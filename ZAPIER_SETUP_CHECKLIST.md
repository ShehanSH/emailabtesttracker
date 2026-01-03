# Zapier Integration Setup Checklist

## For Users (Step-by-Step)

### ✅ Pre-Setup Checklist
- [ ] A/B test created in our app
- [ ] Webhook URL copied from A/B test detail page
- [ ] Version A and Version B template IDs noted
- [ ] Zapier account created (free or paid)

### ✅ Zapier Setup Steps

#### Zap 1: Version A - Email Opens
- [ ] Go to Zapier.com → Create Zap
- [ ] **Trigger**: Select your email platform (Mailchimp/ConvertKit/etc.)
- [ ] **Event**: "Email Opened"
- [ ] **Filter**: Campaign = Version A campaign name
- [ ] **Action**: "Webhooks by Zapier" → "POST"
- [ ] **URL**: Paste webhook URL from our app
- [ ] **Method**: POST
- [ ] **Data**: Map fields:
  - [ ] `eventType`: "open"
  - [ ] `templateVersionId`: Version A ID
  - [ ] `recipientEmail`: Subscriber email
  - [ ] `metadata`: {}
- [ ] **Test**: Run test and verify
- [ ] **Activate**: Turn on Zap

#### Zap 2: Version A - Email Clicks
- [ ] Duplicate Zap 1
- [ ] Change trigger to "Email Clicked"
- [ ] Change `eventType` to "click"
- [ ] Test and activate

#### Zap 3: Version B - Email Opens
- [ ] Duplicate Zap 1
- [ ] Change filter to Version B campaign
- [ ] Change `templateVersionId` to Version B ID
- [ ] Test and activate

#### Zap 4: Version B - Email Clicks
- [ ] Duplicate Zap 3
- [ ] Change trigger to "Email Clicked"
- [ ] Change `eventType` to "click"
- [ ] Test and activate

### ✅ Verification
- [ ] Send test emails
- [ ] Check Zapier history (should show successful runs)
- [ ] Check A/B test results page (should show opens/clicks)
- [ ] Verify real-time updates

---

## For Developers (Implementation Checklist)

### ✅ Already Implemented
- [x] Webhook endpoint (`/api/ab-tests/[testId]/webhook`)
- [x] Webhook info API (`/api/ab-tests/[testId]/webhook-info`)
- [x] Tracking URL handler (`/t/[versionId]/test/[testId]`)
- [x] UI components for webhook info
- [x] Event recording in database
- [x] Result calculation and updates

### ⚠️ Recommended Enhancements

#### 1. Enhance Tracking URLs with Redirect
- [ ] Update tracking URL handler to accept `?redirect=` parameter
- [ ] Update tracking URL generation to include destination URL
- [ ] Add "Destination URL" field to A/B test creation form
- [ ] Test redirect functionality

#### 2. Improve Webhook Instructions
- [ ] Add detailed Zapier setup guide in UI
- [ ] Create example Zap configurations
- [ ] Add screenshots/videos
- [ ] Provide pre-configured Zap templates

#### 3. Add Version Identification Help
- [ ] Add helper text for identifying Version A vs B
- [ ] Create mapping guide for common platforms
- [ ] Add campaign naming suggestions

#### 4. Create Zapier App (Advanced)
- [ ] Register at Zapier Developer Platform
- [ ] Create app definition
- [ ] Define triggers and actions
- [ ] Submit for review
- [ ] Publish to marketplace

---

## Testing Checklist

### Manual Testing
- [ ] Create A/B test
- [ ] Copy tracking URLs
- [ ] Test tracking URL click (should record event)
- [ ] Test webhook with curl/Postman
- [ ] Verify results update in dashboard

### Zapier Testing
- [ ] Create test Zap
- [ ] Send test email
- [ ] Verify Zap runs successfully
- [ ] Check webhook receives data
- [ ] Verify results update in app

### End-to-End Testing
- [ ] Create A/B test
- [ ] Set up Zapier Zaps
- [ ] Create campaigns in email platform
- [ ] Replace links with tracking URLs
- [ ] Send test emails
- [ ] Verify all events tracked correctly
- [ ] Check dashboard shows accurate results

---

## Common Issues & Solutions

### Issue: Webhook returns 400/404
**Solution**: Check webhook URL format and test ID

### Issue: Events not recorded
**Solution**: Verify payload format matches expected schema

### Issue: Wrong version tracked
**Solution**: Double-check templateVersionId mapping in Zapier

### Issue: Clicks tracked but opens not
**Solution**: Verify Zapier Zaps are active and running

---

## Support Resources

- **Webhook URL**: Found on A/B test detail page
- **Template IDs**: Found in A/B test detail page
- **Zapier Help**: https://help.zapier.com
- **Our App Docs**: See ZAPIER_INTEGRATION_GUIDE.md

