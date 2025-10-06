# External API Integration Guide

## Overview

This guide provides detailed implementation instructions for integrating NorthPeak Care with external services:
- NURSYS (RN License Verification)
- Stripe (Payments)
- CHECKR (Background Checks)
- Gusto (Payroll)
- Twilio/AWS SNS (SMS)
- SendGrid/AWS SES (Email)

---

## 1. NURSYS Integration

### Purpose
Automatically verify nurse RN licenses during onboarding.

### Setup

1. **Create NURSYS Account**
   - Visit: https://www.nursys.com/
   - Sign up for API access
   - Get API credentials

2. **Store Credentials in AWS Secrets Manager**
```bash
aws secretsmanager create-secret \
  --name northpeakcare/nursys/api-key \
  --description "NURSYS API credentials" \
  --secret-string '{
    "apiKey": "your-api-key",
    "apiUrl": "https://api.nursys.com/v1",
    "environment": "production"
  }'
```

3. **Implementation Flow**
```
Nurse Uploads License
      ↓
Extract License Number, State, Name
      ↓
Call NURSYS API
      ↓
Update Credential Status in DB
      ↓
Send Notification to Nurse
```

### API Endpoints

#### Verify License
```http
POST https://api.nursys.com/v1/verify
Content-Type: application/json
Authorization: Bearer {apiKey}

{
  "firstName": "Jane",
  "lastName": "Doe",
  "licenseNumber": "RN1234567",
  "state": "CA",
  "dateOfBirth": "1990-01-15"
}
```

**Response**:
```json
{
  "verified": true,
  "licenseNumber": "RN1234567",
  "firstName": "Jane",
  "lastName": "Doe",
  "licenseType": "Registered Nurse",
  "state": "CA",
  "status": "active",
  "expiryDate": "2026-03-15",
  "verificationDate": "2025-10-04T12:00:00Z"
}
```

### Error Handling

```javascript
try {
  const result = await verifyLicense(licenseData);
  if (!result.verified) {
    // License not verified
    await updateCredentialStatus('rejected', result.reason);
    await sendNotification('license_verification_failed');
  } else {
    await updateCredentialStatus('verified');
    await sendNotification('license_verified');
  }
} catch (error) {
  // API error - retry or manual review
  await updateCredentialStatus('pending_manual_review');
  await sendAdminAlert('nursys_api_error', error);
}
```

### Testing

**Sandbox Environment**:
- URL: https://sandbox.nursys.com/v1
- Test credentials provided by NURSYS
- Use test license numbers for different scenarios

---

## 2. Stripe Integration

### Purpose
Process payments from pharmacies and transfer to nurses.

### Architecture

```
Pharmacy → Payment Intent → Platform
                              ↓
                        Capture Payment
                              ↓
                   (Hold in Platform Account)
                              ↓
                     Visit Completed
                              ↓
                  Transfer to Nurse Account
```

### Setup

1. **Create Stripe Account**
   - Visit: https://stripe.com/
   - Create account
   - Get API keys (test and live)

2. **Store Credentials**
```bash
aws secretsmanager create-secret \
  --name northpeakcare/stripe/keys \
  --secret-string '{
    "secretKey": "sk_live_xxxxx",
    "publishableKey": "pk_live_xxxxx",
    "webhookSecret": "whsec_xxxxx"
  }'
```

3. **Configure Webhooks**
   - Webhook URL: `https://api.northpeakcare.com/webhooks/stripe`
   - Events to listen for:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `account.updated`
     - `transfer.created`
     - `transfer.failed`

### Implementation

#### 1. Create Connected Account for Nurse

**When**: During nurse onboarding

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function createNurseAccount(nurse) {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: nurse.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual',
    individual: {
      first_name: nurse.firstName,
      last_name: nurse.lastName,
      email: nurse.email,
      phone: nurse.phoneNumber,
    }
  });

  // Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'https://app.northpeakcare.com/nurse/onboarding/stripe/refresh',
    return_url: 'https://app.northpeakcare.com/nurse/portal',
    type: 'account_onboarding',
  });

  // Save account ID to database
  await saveNurseStripeAccount(nurse.id, account.id);

  return {
    accountId: account.id,
    onboardingUrl: accountLink.url
  };
}
```

#### 2. Create Customer for Pharmacy

**When**: Pharmacy signs up

```javascript
async function createPharmacyCustomer(pharmacy) {
  const customer = await stripe.customers.create({
    email: pharmacy.email,
    name: pharmacy.businessName,
    metadata: {
      pharmacyId: pharmacy.id
    }
  });

  await savePharmacyStripeCustomer(pharmacy.id, customer.id);

  return customer.id;
}
```

#### 3. Create Payment Intent (When Job is Posted)

```javascript
async function createJobPaymentIntent(job, pharmacy) {
  const platformFee = Math.floor(job.totalPay * 0.15); // 15% fee

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.floor(job.totalPay * 100), // Convert to cents
    currency: 'usd',
    customer: pharmacy.stripeCustomerId,
    metadata: {
      jobId: job.id,
      pharmacyId: pharmacy.id,
      nurseId: job.assignedNurseId
    },
    application_fee_amount: platformFee * 100,
    capture_method: 'manual', // Don't capture until visit completed
  });

  await savePaymentIntent(job.id, paymentIntent.id);

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id
  };
}
```

#### 4. Capture Payment (After Visit Completion)

```javascript
async function captureVisitPayment(visitId) {
  const visit = await getVisit(visitId);
  const payment = await getPayment(visit.paymentId);

  // Capture the payment
  const captured = await stripe.paymentIntents.capture(
    payment.stripePaymentIntentId
  );

  await updatePaymentStatus(payment.id, 'captured');

  return captured;
}
```

#### 5. Transfer to Nurse

```javascript
async function transferToNurse(visitId) {
  const visit = await getVisit(visitId);
  const nurse = await getNurse(visit.nurseId);
  const payment = await getPayment(visit.paymentId);

  const platformFee = Math.floor(payment.amount * 0.15);
  const nurseAmount = payment.amount - platformFee;

  const transfer = await stripe.transfers.create({
    amount: Math.floor(nurseAmount * 100),
    currency: 'usd',
    destination: nurse.stripeAccountId,
    transfer_group: visit.id,
    metadata: {
      visitId: visit.id,
      nurseId: nurse.id
    }
  });

  await updatePaymentTransfer(payment.id, transfer.id);

  // Send notification to nurse
  await sendNotification(nurse.id, 'payment_received', {
    amount: nurseAmount,
    visitId: visit.id
  });

  return transfer;
}
```

#### 6. Handle Webhooks

```javascript
const express = require('express');
const app = express();

app.post('/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      await handlePaymentSuccess(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object;
      await handlePaymentFailed(failedIntent);
      break;

    case 'account.updated':
      const account = event.data.object;
      await updateNurseAccountStatus(account);
      break;

    case 'transfer.created':
      const transfer = event.data.object;
      await handleTransferCreated(transfer);
      break;

    case 'transfer.failed':
      const failedTransfer = event.data.object;
      await handleTransferFailed(failedTransfer);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({received: true});
});
```

### Testing

**Test Mode**:
- Use test API keys (starts with `sk_test_`)
- Test card numbers:
  - Success: `4242 4242 4242 4242`
  - Decline: `4000 0000 0000 0002`
  - Requires authentication: `4000 0025 0000 3155`

---

## 3. CHECKR Integration

### Purpose
Run background checks on nurses during onboarding.

### Setup

1. **Create CHECKR Account**
   - Visit: https://checkr.com/
   - Sign up for API access
   - Get API key

2. **Store Credentials**
```bash
aws secretsmanager create-secret \
  --name northpeakcare/checkr/api-key \
  --secret-string '{
    "apiKey": "your-checkr-api-key",
    "environment": "production",
    "webhookSecret": "your-webhook-secret"
  }'
```

3. **Configure Webhooks**
   - Webhook URL: `https://api.northpeakcare.com/webhooks/checkr`
   - Events: `report.completed`, `report.disputed`

### Implementation

#### 1. Create Candidate

```javascript
const fetch = require('node-fetch');

async function createCheckrCandidate(nurse) {
  const apiKey = await getSecret('checkr-api-key');
  
  const response = await fetch('https://api.checkr.com/v1/candidates', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: nurse.email,
      first_name: nurse.firstName,
      last_name: nurse.lastName,
      middle_name: nurse.middleName,
      phone: nurse.phoneNumber,
      zipcode: nurse.address.zipCode,
      dob: nurse.dateOfBirth, // YYYY-MM-DD
      ssn: nurse.ssn,
      copy_requested: false
    })
  });

  const candidate = await response.json();
  
  await saveCheckrCandidateId(nurse.id, candidate.id);
  
  return candidate.id;
}
```

#### 2. Order Background Check

```javascript
async function orderBackgroundCheck(nurseId, candidateId) {
  const apiKey = await getSecret('checkr-api-key');
  
  const response = await fetch('https://api.checkr.com/v1/reports', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      candidate_id: candidateId,
      package: 'pro_criminal_only', // or 'standard', 'basic'
      consider_adjudication: true
    })
  });

  const report = await response.json();
  
  await updateNurseBackgroundCheck(nurseId, {
    checkId: report.id,
    status: 'pending'
  });

  // Send notification to nurse
  await sendNotification(nurseId, 'background_check_initiated');

  return report;
}
```

#### 3. Handle Webhook (Report Completed)

```javascript
app.post('/webhooks/checkr', express.json(), async (req, res) => {
  const event = req.body;
  
  if (event.type === 'report.completed') {
    const reportId = event.data.object.id;
    
    // Get full report details
    const apiKey = await getSecret('checkr-api-key');
    const response = await fetch(`https://api.checkr.com/v1/reports/${reportId}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`
      }
    });
    
    const report = await response.json();
    
    // Find nurse by candidate ID
    const nurse = await getNurseByCandidateId(report.candidate_id);
    
    // Update nurse status based on result
    const status = report.status; // 'clear', 'consider', 'suspended'
    
    await updateNurseBackgroundCheck(nurse.id, {
      checkId: report.id,
      status: status,
      completedAt: report.completed_at,
      reportUrl: report.report_url
    });

    // Send notification
    await sendNotification(nurse.id, 'background_check_completed', {
      status: status,
      reportUrl: report.report_url
    });

    // If clear, mark as ready for jobs
    if (status === 'clear') {
      await updateNurseStatus(nurse.id, 'approved');
    } else {
      // Require manual review
      await sendAdminAlert('background_check_requires_review', {
        nurseId: nurse.id,
        status: status,
        reportUrl: report.report_url
      });
    }
  }

  res.json({received: true});
});
```

### Testing

**Sandbox Environment**:
- API URL: https://api.checkr.com/v1 (same as production)
- Use sandbox API key
- Test SSNs for different outcomes:
  - `000-00-0001`: Clear
  - `000-00-0002`: Consider
  - `000-00-0003`: Suspended

---

## 4. Gusto Payroll Integration

### Purpose
Sync completed visit payments to Gusto for tax reporting and payroll.

### Setup

1. **Create Gusto Account**
   - Visit: https://gusto.com/
   - Set up as employer
   - Apply for API access
   - Get OAuth credentials

2. **Store Credentials**
```bash
aws secretsmanager create-secret \
  --name northpeakcare/gusto/credentials \
  --secret-string '{
    "apiToken": "your-gusto-api-token",
    "companyId": "your-company-id",
    "environment": "production"
  }'
```

### Implementation

#### 1. Create Employee (Nurse)

```javascript
async function createGustoEmployee(nurse) {
  const credentials = await getSecret('gusto-credentials');
  
  const response = await fetch(
    `https://api.gusto.com/v1/companies/${credentials.companyId}/employees`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: nurse.firstName,
        last_name: nurse.lastName,
        email: nurse.email,
        date_of_birth: nurse.dateOfBirth,
        ssn: nurse.ssn,
        home_address: {
          street_1: nurse.address.street,
          street_2: nurse.address.unit,
          city: nurse.address.city,
          state: nurse.address.state,
          zip: nurse.address.zipCode
        }
      })
    }
  );

  const employee = await response.json();
  
  await updateNurseGustoId(nurse.id, employee.id);

  return employee;
}
```

#### 2. Sync Payment After Visit

```javascript
async function syncPaymentToGusto(visitId) {
  const visit = await getVisit(visitId);
  const nurse = await getNurse(visit.nurseId);
  const payment = await getPayment(visit.paymentId);
  const credentials = await getSecret('gusto-credentials');

  // Create off-cycle payment
  const response = await fetch(
    `https://api.gusto.com/v1/companies/${credentials.companyId}/off_cycle_payrolls`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${credentials.apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        employee_compensations: [{
          employee_id: nurse.gustoEmployeeId,
          bonus: payment.nurseAmount,
          payment_method: 'Direct Deposit'
        }],
        check_date: visit.scheduledDate
      })
    }
  );

  const payroll = await response.json();

  await updatePaymentGustoSync(payment.id, {
    gustoPayrollId: payroll.id,
    gustoSynced: true,
    syncedAt: new Date().toISOString()
  });

  return payroll;
}
```

#### 3. Scheduled Sync (Daily)

```javascript
// Lambda function triggered by EventBridge daily
exports.handler = async (event) => {
  // Get all completed visits from yesterday that haven't been synced
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const visits = await getCompletedVisits({
    date: yesterday.toISOString().split('T')[0],
    gustoSynced: false
  });

  const results = [];
  
  for (const visit of visits) {
    try {
      const result = await syncPaymentToGusto(visit.id);
      results.push({ visitId: visit.id, success: true });
    } catch (error) {
      console.error(`Failed to sync visit ${visit.id}:`, error);
      results.push({ visitId: visit.id, success: false, error: error.message });
      
      // Alert admin
      await sendAdminAlert('gusto_sync_failed', {
        visitId: visit.id,
        error: error.message
      });
    }
  }

  return { processed: visits.length, results };
};
```

### Testing

**Demo Environment**:
- Use Gusto demo/sandbox company
- Test employee creation and payments
- Verify tax calculations

---

## 5. SMS Notifications (Twilio or AWS SNS)

### Option A: Twilio

**Setup**:
```bash
aws secretsmanager create-secret \
  --name northpeakcare/twilio/credentials \
  --secret-string '{
    "accountSid": "your-twilio-account-sid",
    "authToken": "your-twilio-auth-token",
    "fromPhoneNumber": "+1234567890"
  }'
```

**Implementation**:
```javascript
const twilio = require('twilio');

async function sendSMS(to, message) {
  const credentials = await getSecret('twilio-credentials');
  const client = twilio(credentials.accountSid, credentials.authToken);

  const result = await client.messages.create({
    body: message,
    from: credentials.fromPhoneNumber,
    to: to
  });

  return { messageId: result.sid, success: true };
}
```

### Option B: AWS SNS (Recommended for AWS-native)

**Setup**:
```bash
# SNS is already available, just configure permissions
# No credentials needed (use IAM role)
```

**Implementation**:
```javascript
const AWS = require('aws-sdk');
const sns = new AWS.SNS();

async function sendSMS(to, message) {
  const params = {
    Message: message,
    PhoneNumber: to,
    MessageAttributes: {
      'AWS.SNS.SMS.SMSType': {
        DataType: 'String',
        StringValue: 'Transactional' // or 'Promotional'
      }
    }
  };

  const result = await sns.publish(params).promise();
  
  return { messageId: result.MessageId, success: true };
}
```

---

## 6. Email Notifications (SendGrid or AWS SES)

### Option A: SendGrid

**Setup**:
```bash
aws secretsmanager create-secret \
  --name northpeakcare/sendgrid/api-key \
  --secret-string '{
    "apiKey": "your-sendgrid-api-key",
    "fromEmail": "notifications@northpeakcare.com"
  }'
```

**Implementation**:
```javascript
const sgMail = require('@sendgrid/mail');

async function sendEmail(to, subject, htmlBody, textBody) {
  const credentials = await getSecret('sendgrid-api-key');
  sgMail.setApiKey(credentials.apiKey);

  const msg = {
    to,
    from: credentials.fromEmail,
    subject,
    text: textBody,
    html: htmlBody,
  };

  const result = await sgMail.send(msg);
  
  return { messageId: result[0].headers['x-message-id'], success: true };
}
```

### Option B: AWS SES (Recommended for AWS-native)

**Setup**:
```bash
# Verify sender email
aws ses verify-email-identity --email-address notifications@northpeakcare.com

# Move out of sandbox (for production)
# Request via AWS Support console
```

**Implementation**:
```javascript
const AWS = require('aws-sdk');
const ses = new AWS.SES();

async function sendEmail(to, subject, htmlBody, textBody) {
  const params = {
    Source: 'notifications@northpeakcare.com',
    Destination: {
      ToAddresses: [to]
    },
    Message: {
      Subject: {
        Data: subject
      },
      Body: {
        Html: {
          Data: htmlBody
        },
        Text: {
          Data: textBody
        }
      }
    }
  };

  const result = await ses.sendEmail(params).promise();
  
  return { messageId: result.MessageId, success: true };
}
```

---

## Error Handling Best Practices

### 1. Retry Logic

```javascript
async function callExternalAPIWithRetry(apiCall, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // Don't retry client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

### 2. Circuit Breaker

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000) {
    this.failureCount = 0;
    this.threshold = threshold;
    this.timeout = timeout;
    this.state = 'CLOSED';
    this.nextAttempt = Date.now();
  }

  async execute(fn) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
    }
  }
}
```

### 3. Fallback Mechanisms

```javascript
async function sendNotificationWithFallback(nurse, message) {
  try {
    // Try SMS first
    await sendSMS(nurse.phoneNumber, message);
  } catch (error) {
    console.error('SMS failed, falling back to email:', error);
    
    try {
      // Fallback to email
      await sendEmail(nurse.email, 'Important Notification', message);
    } catch (emailError) {
      console.error('Both SMS and email failed:', emailError);
      
      // Store in notifications table for in-app notification
      await createInAppNotification(nurse.id, message);
    }
  }
}
```

---

## Monitoring & Logging

### CloudWatch Metrics

```javascript
const AWS = require('aws-sdk');
const cloudwatch = new AWS.CloudWatch();

async function logMetric(metricName, value, unit = 'Count') {
  await cloudwatch.putMetricData({
    Namespace: 'NorthPeakCare/ExternalAPIs',
    MetricData: [{
      MetricName: metricName,
      Value: value,
      Unit: unit,
      Timestamp: new Date()
    }]
  }).promise();
}

// Usage
await logMetric('NURSYS/VerificationSuccess', 1);
await logMetric('Stripe/PaymentCaptured', payment.amount, 'None');
await logMetric('CHECKR/BackgroundCheckOrdered', 1);
```

### Alerts

```bash
# Create CloudWatch alarm for API failures
aws cloudwatch put-metric-alarm \
  --alarm-name "NorthPeakCare-NURSYS-HighFailureRate" \
  --alarm-description "Alert when NURSYS verification failure rate is high" \
  --metric-name "NURSYS/VerificationFailure" \
  --namespace "NorthPeakCare/ExternalAPIs" \
  --statistic Sum \
  --period 300 \
  --threshold 5 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1
```

---

## Security Best Practices

1. **API Keys in Secrets Manager**: Never hardcode keys
2. **Least Privilege IAM**: Grant minimal permissions
3. **Webhook Signature Verification**: Always verify webhooks
4. **Encrypt Sensitive Data**: Use KMS for PII
5. **Audit Logs**: Log all external API calls
6. **Rate Limiting**: Implement rate limits to prevent abuse
7. **IP Whitelisting**: Restrict webhook sources

---

For implementation details, see:
- `/AWS_AMPLIFY_MIGRATION_GUIDE.md` - Full AWS deployment
- `/services/api-interfaces.ts` - TypeScript interfaces
- `/types/data-models.ts` - Data models
