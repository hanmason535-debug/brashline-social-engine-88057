# Stripe Integration Testing Guide

This guide provides comprehensive testing procedures for the Stripe payment integration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Test Scenarios](#test-scenarios)
4. [Database Verification](#database-verification)
5. [Webhook Testing](#webhook-testing)
6. [Production Testing](#production-testing)

## Prerequisites

### Required Tools

- [Stripe CLI](https://stripe.com/docs/stripe-cli) installed
- Stripe test account with API keys
- Local development environment running
- Database access (Neon dashboard or local tools)

### Environment Setup

Ensure your `.env` file contains:

```env
# Stripe Test Keys
STRIPE_SECRET_KEY=sk_test_xxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Other required keys
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
DATABASE_URL=postgresql://...
```

## Local Development Setup

### Step 1: Start Development Servers

```bash
# Terminal 1: Frontend (React + Vite)
npm run dev

# Terminal 2: Backend (Express API)
cd server
npm run dev

# Terminal 3: Stripe Webhook Forwarding
stripe listen --forward-to http://localhost:3001/api/webhooks/stripe
```

### Step 2: Verify Services

1. **Frontend:** http://localhost:5173
2. **Backend:** http://localhost:3001/health
3. **Stripe CLI:** Should show "Ready! You're getting webhook events"

Copy the webhook signing secret (`whsec_...`) from Stripe CLI output and add to `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

## Test Scenarios

### Test 1: One-Time Payment (Payment Intent)

#### Steps:
1. Navigate to `/checkout`
2. Sign in with Clerk
3. Enter payment details:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits
4. Click "Pay Now"

#### Expected Results:
- ✅ Payment form submits successfully
- ✅ Redirect to `/payment/success`
- ✅ Payment appears in `/payment/history`
- ✅ Webhook event `payment_intent.succeeded` received
- ✅ Database record created in `payments` table

#### Database Verification:
```sql
SELECT 
  id, 
  stripe_payment_intent_id, 
  amount, 
  currency, 
  status, 
  created_at
FROM payments
ORDER BY created_at DESC
LIMIT 1;
```

Expected status: `succeeded`

---

### Test 2: Subscription Checkout

#### Steps:
1. Navigate to `/pricing`
2. Sign in with Clerk
3. Click "Get Started" on any plan
4. Complete Stripe Checkout with test card:
   - Card: `4242 4242 4242 4242`
5. Complete checkout flow

#### Expected Results:
- ✅ Redirects to Stripe Checkout
- ✅ Checkout completes successfully
- ✅ Redirects to `/payment/success`
- ✅ Webhook events received:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `invoice.paid`
- ✅ Records created in database:
  - `stripe_customers` table
  - `subscriptions` table
  - `payments` table

#### Database Verification:
```sql
-- Check customer
SELECT * FROM stripe_customers
WHERE user_id = (SELECT id FROM users WHERE clerk_id = 'user_xxxxx');

-- Check subscription
SELECT 
  s.stripe_subscription_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  p.unit_amount,
  pr.name as product_name
FROM subscriptions s
LEFT JOIN prices p ON s.price_id = p.id
LEFT JOIN products pr ON p.product_id = pr.id
WHERE s.user_id = (SELECT id FROM users WHERE clerk_id = 'user_xxxxx')
ORDER BY s.created_at DESC;

-- Check payment
SELECT * FROM payments
WHERE user_id = (SELECT id FROM users WHERE clerk_id = 'user_xxxxx')
ORDER BY created_at DESC
LIMIT 1;
```

---

### Test 3: Failed Payment

#### Steps:
1. Navigate to `/checkout`
2. Sign in with Clerk
3. Enter payment details:
   - Card: `4000 0000 0000 9995` (declined card)
4. Click "Pay Now"

#### Expected Results:
- ✅ Payment fails with error message
- ✅ User stays on checkout page
- ✅ Error message displayed
- ✅ Webhook event `payment_intent.payment_failed` received
- ✅ Database record status: `failed`

---

### Test 4: 3D Secure Authentication

#### Steps:
1. Navigate to `/checkout`
2. Sign in with Clerk
3. Enter payment details:
   - Card: `4000 0025 0000 3155` (requires authentication)
4. Click "Pay Now"
5. Complete 3D Secure challenge

#### Expected Results:
- ✅ 3D Secure modal appears
- ✅ After authentication, payment succeeds
- ✅ Normal success flow continues

---

### Test 5: Customer Portal

#### Steps:
1. Create a subscription (Test 2)
2. Navigate to `/dashboard`
3. Click "Manage Subscription" or "Billing Portal"
4. Opens Stripe Customer Portal

#### Expected Results:
- ✅ Redirects to Stripe Customer Portal
- ✅ Can view subscription details
- ✅ Can update payment method
- ✅ Can cancel subscription
- ✅ Webhook events for any changes received

---

### Test 6: Payment History

#### Steps:
1. Complete multiple payments/subscriptions
2. Navigate to `/payment/history`

#### Expected Results:
- ✅ All payments displayed in chronological order
- ✅ Each payment shows:
  - Amount
  - Status
  - Date
  - Description
  - Receipt link (if available)
- ✅ Pagination works for many payments

---

### Test 7: Subscription Status Display

#### Steps:
1. Create subscription
2. Navigate to `/dashboard`
3. View subscription status component

#### Expected Results:
- ✅ Subscription details displayed:
  - Plan name
  - Amount
  - Billing interval
  - Current period dates
  - Status (active/canceled/etc.)
- ✅ "Manage Subscription" button works

---

## Webhook Testing

### Manual Webhook Triggers

Use Stripe CLI to trigger specific events:

```bash
# Test successful payment
stripe trigger payment_intent.succeeded

# Test failed payment
stripe trigger payment_intent.payment_failed

# Test subscription created
stripe trigger customer.subscription.created

# Test subscription updated
stripe trigger customer.subscription.updated

# Test subscription canceled
stripe trigger customer.subscription.deleted

# Test invoice paid
stripe trigger invoice.paid

# Test invoice payment failed
stripe trigger invoice.payment_failed

# Test checkout completed
stripe trigger checkout.session.completed
```

### Verify Webhook Processing

After each trigger, check:

1. **Server Logs:**
   ```bash
   # Look for webhook processing logs
   [INFO] Webhook event received: payment_intent.succeeded
   [INFO] Payment intent succeeded: pi_xxxxx
   ```

2. **Database Updates:**
   - Query relevant tables
   - Verify status changes
   - Check timestamps

3. **Stripe Dashboard:**
   - Go to Developers → Webhooks
   - View event details
   - Check response logs

---

## Database Verification

### Check All Stripe Tables

```sql
-- Stripe customers
SELECT 
  sc.id,
  sc.stripe_customer_id,
  sc.email,
  u.first_name,
  u.last_name,
  sc.created_at
FROM stripe_customers sc
JOIN users u ON sc.user_id = u.id
ORDER BY sc.created_at DESC;

-- Products
SELECT 
  id,
  stripe_product_id,
  name,
  description,
  active,
  created_at
FROM products
ORDER BY created_at DESC;

-- Prices
SELECT 
  p.id,
  p.stripe_price_id,
  p.unit_amount,
  p.currency,
  p.interval,
  pr.name as product_name,
  p.active
FROM prices p
JOIN products pr ON p.product_id = pr.id
ORDER BY p.created_at DESC;

-- Subscriptions
SELECT 
  s.id,
  s.stripe_subscription_id,
  s.status,
  s.current_period_start,
  s.current_period_end,
  s.cancel_at_period_end,
  u.email as user_email,
  pr.name as product_name
FROM subscriptions s
JOIN users u ON s.user_id = u.id
LEFT JOIN prices p ON s.price_id = p.id
LEFT JOIN products pr ON p.product_id = pr.id
ORDER BY s.created_at DESC;

-- Payments
SELECT 
  p.id,
  p.stripe_payment_intent_id,
  p.amount,
  p.currency,
  p.status,
  p.description,
  p.created_at,
  u.email as user_email
FROM payments p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC;
```

### Verify Foreign Key Relationships

```sql
-- Check orphaned records
SELECT COUNT(*) as orphaned_payments
FROM payments
WHERE user_id IS NOT NULL
  AND user_id NOT IN (SELECT id FROM users);

SELECT COUNT(*) as orphaned_subscriptions
FROM subscriptions
WHERE user_id NOT IN (SELECT id FROM users);

SELECT COUNT(*) as orphaned_customers
FROM stripe_customers
WHERE user_id NOT IN (SELECT id FROM users);
```

Should all return 0 orphaned records.

---

## Production Testing

### Pre-Production Checklist

Before going live, verify:

- [ ] All test scenarios pass locally
- [ ] Database migrations applied to production
- [ ] Stripe production keys configured in Vercel
- [ ] Production webhook endpoint created in Stripe
- [ ] Webhook signing secret added to Vercel env vars
- [ ] SSL/HTTPS enabled (required by Stripe)
- [ ] Error logging configured
- [ ] Rate limiting enabled on payment endpoints

### Production Webhook Setup

1. **Create Webhook Endpoint:**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to send: Select all payment/subscription events

2. **Configure Events:**
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

3. **Save Signing Secret:**
   - Copy webhook signing secret
   - Add to Vercel: `STRIPE_WEBHOOK_SECRET=whsec_xxxxx`

### Production Test Mode

Use test mode in production first:

1. Keep test API keys in Vercel
2. Test full flow end-to-end
3. Verify webhooks received
4. Check database updates
5. Test error scenarios

### Switch to Live Mode

When ready for real payments:

1. **Replace API Keys:**
   - Update `STRIPE_SECRET_KEY` with live key
   - Update `VITE_STRIPE_PUBLISHABLE_KEY` with live key

2. **Update Webhook:**
   - Create new webhook endpoint for live mode
   - Update `STRIPE_WEBHOOK_SECRET` with live webhook secret

3. **Test Small Transaction:**
   - Make a small real payment ($1-5)
   - Verify full flow works
   - Check for any errors

4. **Monitor:**
   - Watch server logs
   - Monitor Stripe Dashboard
   - Check database for issues

---

## Troubleshooting

### Common Issues

**"No signature found in webhook request"**
- Check webhook secret is configured
- Verify raw body is passed to webhook handler
- Ensure webhook route is BEFORE body parsing middleware

**"Payment not recorded in database"**
- Check webhook is receiving events
- Verify webhook handler is processing without errors
- Check database connection
- Look for SQL errors in logs

**"Stripe customer not created"**
- Verify user is authenticated
- Check Clerk integration is working
- Ensure user exists in database
- Check `stripe_customers` table for errors

**"Redirect to Stripe fails"**
- Verify publishable key is correct
- Check CORS settings allow Stripe domain
- Ensure success/cancel URLs are valid

### Debug Tools

1. **Server Logs:**
   ```bash
   cd server
   npm run dev
   # Watch for errors and warnings
   ```

2. **Stripe Dashboard:**
   - Events → View all events
   - Webhooks → View event logs
   - Payments → View payment details

3. **Browser Console:**
   - Check for JavaScript errors
   - Look for network request failures
   - Verify Stripe.js loaded correctly

4. **Database Queries:**
   - Run verification queries above
   - Check for constraint violations
   - Look for missing foreign keys

---

## Test Coverage

### Required Test Cases

- ✅ Successful one-time payment
- ✅ Successful subscription checkout
- ✅ Failed payment handling
- ✅ 3D Secure authentication
- ✅ Customer portal access
- ✅ Payment history display
- ✅ Subscription status display
- ✅ Webhook event processing
- ✅ Database record creation
- ✅ Error handling and recovery
- ✅ Unauthenticated user handling
- ✅ Rate limiting
- ✅ Security (no secret key exposure)

### Performance Testing

Test with:
- Multiple concurrent payments
- Large payment history (pagination)
- Webhook event bursts
- Database connection limits

---

## Success Criteria

All tests pass when:

1. ✅ All payment flows complete successfully
2. ✅ Database records created correctly
3. ✅ Webhooks processed without errors
4. ✅ No secret keys exposed in frontend
5. ✅ Error handling works gracefully
6. ✅ User experience is smooth
7. ✅ Security best practices followed
8. ✅ Performance is acceptable
9. ✅ Documentation is complete
10. ✅ Production deployment successful

---

**Need Help?**

- [Stripe Testing Docs](https://stripe.com/docs/testing)
- [Stripe Webhook Guide](https://stripe.com/docs/webhooks)
- [Stripe API Reference](https://stripe.com/docs/api)
