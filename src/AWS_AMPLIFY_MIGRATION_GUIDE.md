# AWS Amplify Migration Guide - NorthPeak Care Platform

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Models & DynamoDB](#data-models--dynamodb)
4. [External API Integrations](#external-api-integrations)
5. [Authentication & Authorization](#authentication--authorization)
6. [Lambda Functions](#lambda-functions)
7. [Frontend Deployment](#frontend-deployment)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Checklist](#deployment-checklist)

---

## Overview

This guide provides step-by-step instructions for migrating the NorthPeak Care platform from a prototype to a production-ready application on AWS Amplify with full integration of external services.

### Technology Stack
- **Frontend**: React + TypeScript + Tailwind CSS v4
- **Backend**: AWS Amplify (AppSync GraphQL)
- **Database**: DynamoDB
- **Authentication**: AWS Cognito
- **File Storage**: S3
- **Functions**: Lambda
- **Notifications**: SNS (SMS) + SES (Email)
- **External APIs**: NURSYS, Stripe, CHECKR, Gusto

---

## Architecture

### High-Level Architecture Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                    React Web Application                     │
│              (Exported from Figma via Anima)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   CloudFront (CDN)                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 AWS Amplify Hosting                          │
│                    (S3 + CI/CD)                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
            ┌──────────┴──────────┐
            │                     │
            ▼                     ▼
┌─────────────────────┐  ┌──────────────────────┐
│   AWS Cognito       │  │   AWS AppSync        │
│   (Auth)            │  │   (GraphQL API)      │
└─────────────────────┘  └──────────┬───────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
         ┌────────────────┐ ┌─────────────┐ ┌────────────────┐
         │   DynamoDB     │ │   Lambda     │ │      S3        │
         │   (Database)   │ │  (Functions) │ │   (Files)      │
         └────────────────┘ └──────┬───────┘ └────────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌──────────┐   ┌──────────┐   ┌──────────┐
            │  NURSYS  │   │  Stripe  │   │  CHECKR  │
            │   API    │   │   API    │   │   API    │
            └──────────┘   └──────────┘   └──────────┘
                                   │
                                   ▼
                            ┌──────────┐
                            │  Gusto   │
                            │   API    │
                            └──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌──────────┐   ┌──────────┐   ┌──────────┐
            │   SNS    │   │   SES    │   │EventBridge│
            │  (SMS)   │   │ (Email)  │   │(Scheduled)│
            └──────────┘   └──────────┘   └──────────┘
```

---

## Data Models & DynamoDB

### DynamoDB Table Design

We'll use a **single-table design** with GSIs for efficient querying.

#### Main Table: `NorthPeakCare`

**Primary Key**:
- `PK` (Partition Key): String
- `SK` (Sort Key): String

**Attributes**:
- All entity attributes as defined in `/types/data-models.ts`
- `GSI1PK`, `GSI1SK` - For secondary access patterns
- `GSI2PK`, `GSI2SK` - For additional access patterns
- `createdAt`, `updatedAt` - Timestamps

#### Access Patterns

| Entity | PK | SK | GSI1PK | GSI1SK |
|--------|----|----|--------|--------|
| User | `USER#<userId>` | `PROFILE` | `EMAIL#<email>` | `USER` |
| Nurse | `NURSE#<nurseId>` | `PROFILE` | `LICENSE#<state>#<number>` | `NURSE` |
| Pharmacy | `PHARMACY#<pharmacyId>` | `PROFILE` | `NAME#<name>` | `PHARMACY` |
| Job | `JOB#<jobId>` | `METADATA` | `PHARMACY#<pharmacyId>` | `DATE#<date>` |
| Job | `JOB#<jobId>` | `STATUS#<status>` | `STATUS#<status>` | `DATE#<date>` |
| Application | `JOB#<jobId>` | `APPLICATION#<nurseId>` | `NURSE#<nurseId>` | `APPLICATION#<date>` |
| Visit | `VISIT#<visitId>` | `METADATA` | `NURSE#<nurseId>` | `DATE#<date>` |
| Credential | `NURSE#<nurseId>` | `CREDENTIAL#<credentialId>` | - | - |
| Message | `CONVERSATION#<convId>` | `MESSAGE#<timestamp>` | - | - |
| Notification | `USER#<userId>` | `NOTIFICATION#<timestamp>` | - | - |
| Payment | `PAYMENT#<paymentId>` | `METADATA` | `NURSE#<nurseId>` | `DATE#<date>` |

### DynamoDB Setup Commands

```bash
# Create main table
aws dynamodb create-table \
  --table-name NorthPeakCare-prod \
  --attribute-definitions \
    AttributeName=PK,AttributeType=S \
    AttributeName=SK,AttributeType=S \
    AttributeName=GSI1PK,AttributeType=S \
    AttributeName=GSI1SK,AttributeType=S \
    AttributeName=GSI2PK,AttributeType=S \
    AttributeName=GSI2SK,AttributeType=S \
  --key-schema \
    AttributeName=PK,KeyType=HASH \
    AttributeName=SK,KeyType=RANGE \
  --global-secondary-indexes \
    "[
      {
        \"IndexName\": \"GSI1\",
        \"KeySchema\": [
          {\"AttributeName\":\"GSI1PK\",\"KeyType\":\"HASH\"},
          {\"AttributeName\":\"GSI1SK\",\"KeyType\":\"RANGE\"}
        ],
        \"Projection\":{\"ProjectionType\":\"ALL\"},
        \"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
      },
      {
        \"IndexName\": \"GSI2\",
        \"KeySchema\": [
          {\"AttributeName\":\"GSI2PK\",\"KeyType\":\"HASH\"},
          {\"AttributeName\":\"GSI2SK\",\"KeyType\":\"RANGE\"}
        ],
        \"Projection\":{\"ProjectionType\":\"ALL\"},
        \"ProvisionedThroughput\":{\"ReadCapacityUnits\":5,\"WriteCapacityUnits\":5}
      }
    ]" \
  --billing-mode PAY_PER_REQUEST \
  --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES
```

---

## External API Integrations

### 1. NURSYS License Verification

**Purpose**: Verify nurse RN licenses automatically

**Implementation**:
- Lambda function triggered when nurse uploads license
- Store API credentials in AWS Secrets Manager
- Update credential status in DynamoDB

**Lambda Function**: `nursys-verify-license`
```javascript
// Pseudo-code
exports.handler = async (event) => {
  const { nurseId, licenseNumber, state, firstName, lastName } = event;
  
  // Get API key from Secrets Manager
  const apiKey = await getSecret('nursys-api-key');
  
  // Call NURSYS API
  const response = await fetch('https://api.nursys.com/verify', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ licenseNumber, state, firstName, lastName })
  });
  
  const result = await response.json();
  
  // Update DynamoDB
  await dynamodb.update({
    TableName: 'NorthPeakCare-prod',
    Key: { PK: `NURSE#${nurseId}`, SK: `CREDENTIAL#LICENSE` },
    UpdateExpression: 'SET #status = :status, licenseVerified = :verified',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': result.verified ? 'verified' : 'rejected',
      ':verified': result.verified
    }
  });
  
  return { success: result.verified };
};
```

**Environment Variables**:
- `NURSYS_API_URL`
- `NURSYS_SECRET_NAME`

---

### 2. Stripe Payment Processing

**Purpose**: Process payments from pharmacies to nurses

**Implementation**:
- Connected Accounts for nurses
- Payment Intents for pharmacy payments
- Transfers to nurse accounts
- Webhook handling for payment events

**Lambda Functions**:

1. **`stripe-create-payment-intent`**
```javascript
exports.handler = async (event) => {
  const { pharmacyId, visitId, amount } = event;
  
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    metadata: { pharmacyId, visitId },
    application_fee_amount: Math.floor(amount * 0.15 * 100), // 15% platform fee
  });
  
  return { clientSecret: paymentIntent.client_secret };
};
```

2. **`stripe-create-connected-account`**
```javascript
exports.handler = async (event) => {
  const { nurseId, email, firstName, lastName } = event;
  
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  const account = await stripe.accounts.create({
    type: 'express',
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual',
    individual: {
      first_name: firstName,
      last_name: lastName,
      email
    }
  });
  
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${process.env.APP_URL}/nurse/onboarding`,
    return_url: `${process.env.APP_URL}/nurse/portal`,
    type: 'account_onboarding',
  });
  
  return { accountId: account.id, onboardingUrl: accountLink.url };
};
```

3. **`stripe-webhook-handler`**
```javascript
exports.handler = async (event) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = event.headers['stripe-signature'];
  
  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: 'Webhook signature verification failed' };
  }
  
  // Handle different event types
  switch (stripeEvent.type) {
    case 'payment_intent.succeeded':
      // Update visit payment status
      break;
    case 'account.updated':
      // Update nurse Stripe onboarding status
      break;
    case 'transfer.created':
      // Log transfer to nurse
      break;
  }
  
  return { statusCode: 200, body: 'Success' };
};
```

**Environment Variables**:
- `STRIPE_SECRET_KEY`
- `STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `APP_URL`

---

### 3. CHECKR Background Checks

**Purpose**: Run background checks on nurses

**Implementation**:
- Create candidate in CHECKR
- Order background check
- Webhook for completion notification
- Update nurse status

**Lambda Functions**:

1. **`checkr-order-background-check`**
```javascript
exports.handler = async (event) => {
  const { nurseId, firstName, lastName, email, dob, ssn, zipCode } = event;
  
  const apiKey = await getSecret('checkr-api-key');
  
  // Create candidate
  const candidateResponse = await fetch('https://api.checkr.com/v1/candidates', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email, first_name: firstName, last_name: lastName,
      dob, ssn, zipcode: zipCode
    })
  });
  
  const candidate = await candidateResponse.json();
  
  // Order background check
  const reportResponse = await fetch('https://api.checkr.com/v1/reports', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      candidate_id: candidate.id,
      package: 'standard'
    })
  });
  
  const report = await reportResponse.json();
  
  // Save to DynamoDB
  await dynamodb.update({
    TableName: 'NorthPeakCare-prod',
    Key: { PK: `NURSE#${nurseId}`, SK: 'PROFILE' },
    UpdateExpression: 'SET backgroundCheckId = :checkId, backgroundCheckStatus = :status',
    ExpressionAttributeValues: {
      ':checkId': report.id,
      ':status': 'pending'
    }
  });
  
  return { checkId: report.id };
};
```

2. **`checkr-webhook-handler`**
```javascript
exports.handler = async (event) => {
  const payload = JSON.parse(event.body);
  
  if (payload.type === 'report.completed') {
    const reportId = payload.data.object.id;
    
    // Get report details
    const apiKey = await getSecret('checkr-api-key');
    const response = await fetch(`https://api.checkr.com/v1/reports/${reportId}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey + ':').toString('base64')}`
      }
    });
    
    const report = await response.json();
    
    // Find nurse by background check ID
    const result = await dynamodb.query({
      TableName: 'NorthPeakCare-prod',
      IndexName: 'GSI2',
      KeyConditionExpression: 'GSI2PK = :pk',
      ExpressionAttributeValues: { ':pk': `BACKGROUND_CHECK#${reportId}` }
    });
    
    if (result.Items.length > 0) {
      const nurse = result.Items[0];
      
      // Update nurse status
      await dynamodb.update({
        TableName: 'NorthPeakCare-prod',
        Key: { PK: nurse.PK, SK: 'PROFILE' },
        UpdateExpression: 'SET backgroundCheckStatus = :status, backgroundCheckDate = :date',
        ExpressionAttributeValues: {
          ':status': report.status, // 'clear', 'consider', 'suspended'
          ':date': new Date().toISOString()
        }
      });
      
      // Send notification to nurse
      await sns.publish({
        TopicArn: process.env.NURSE_NOTIFICATION_TOPIC,
        Message: JSON.stringify({
          nurseId: nurse.id,
          type: 'background_check_completed',
          status: report.status
        })
      });
    }
  }
  
  return { statusCode: 200, body: 'Success' };
};
```

**Environment Variables**:
- `CHECKR_API_KEY_SECRET_NAME`
- `CHECKR_WEBHOOK_SECRET`

---

### 4. Gusto Payroll Integration

**Purpose**: Sync payments to Gusto for payroll processing

**Implementation**:
- Create nurse as employee in Gusto
- Sync completed visit payments
- Generate tax documents

**Lambda Functions**:

1. **`gusto-create-employee`**
```javascript
exports.handler = async (event) => {
  const { nurseId, firstName, lastName, email, dob, ssn, address } = event;
  
  const apiToken = await getSecret('gusto-api-token');
  
  const response = await fetch(
    `https://api.gusto.com/v1/companies/${process.env.GUSTO_COMPANY_ID}/employees`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        date_of_birth: dob,
        ssn,
        home_address: address
      })
    }
  );
  
  const employee = await response.json();
  
  // Save Gusto employee ID
  await dynamodb.update({
    TableName: 'NorthPeakCare-prod',
    Key: { PK: `NURSE#${nurseId}`, SK: 'PROFILE' },
    UpdateExpression: 'SET gustoEmployeeId = :id',
    ExpressionAttributeValues: { ':id': employee.id }
  });
  
  return { gustoEmployeeId: employee.id };
};
```

2. **`gusto-sync-payment`**
```javascript
exports.handler = async (event) => {
  const { paymentId, nurseId, amount, visitDate } = event;
  
  // Get nurse Gusto employee ID
  const nurse = await dynamodb.get({
    TableName: 'NorthPeakCare-prod',
    Key: { PK: `NURSE#${nurseId}`, SK: 'PROFILE' }
  });
  
  if (!nurse.Item.gustoEmployeeId) {
    throw new Error('Nurse not set up in Gusto');
  }
  
  const apiToken = await getSecret('gusto-api-token');
  
  // Create off-cycle payment
  const response = await fetch(
    `https://api.gusto.com/v1/companies/${process.env.GUSTO_COMPANY_ID}/off_cycle_payrolls`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        employee_compensations: [{
          employee_id: nurse.Item.gustoEmployeeId,
          bonus: amount,
          payment_method: 'Direct Deposit'
        }],
        check_date: visitDate
      })
    }
  );
  
  const payroll = await response.json();
  
  // Update payment record
  await dynamodb.update({
    TableName: 'NorthPeakCare-prod',
    Key: { PK: `PAYMENT#${paymentId}`, SK: 'METADATA' },
    UpdateExpression: 'SET gustoPayrollId = :id, gustoSynced = :synced',
    ExpressionAttributeValues: {
      ':id': payroll.id,
      ':synced': true
    }
  });
  
  return { gustoPayrollId: payroll.id };
};
```

**Environment Variables**:
- `GUSTO_API_TOKEN_SECRET_NAME`
- `GUSTO_COMPANY_ID`

---

### 5. SMS & Email Notifications

**Purpose**: Send notifications via SMS and email

**Implementation**:
- SNS for SMS
- SES for Email
- Triggered by DynamoDB Streams or direct invocation

**Lambda Function**: `send-notification`
```javascript
const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const ses = new AWS.SES();

exports.handler = async (event) => {
  const { type, recipient, data } = event;
  
  if (type === 'sms') {
    await sns.publish({
      PhoneNumber: recipient,
      Message: data.message
    }).promise();
  }
  
  if (type === 'email') {
    await ses.sendEmail({
      Source: process.env.FROM_EMAIL,
      Destination: { ToAddresses: [recipient] },
      Message: {
        Subject: { Data: data.subject },
        Body: {
          Html: { Data: data.htmlBody },
          Text: { Data: data.textBody }
        }
      }
    }).promise();
  }
  
  return { success: true };
};
```

**Environment Variables**:
- `FROM_EMAIL`
- `FROM_PHONE_NUMBER`

---

## Authentication & Authorization

### Cognito User Pools

Create **three separate user pools**:

1. **Nurses Pool**: `NorthPeakCare-Nurses-prod`
2. **Pharmacies Pool**: `NorthPeakCare-Pharmacies-prod`
3. **Admin Pool**: `NorthPeakCare-Admin-prod`

### Setup Commands

```bash
# Create Nurses pool
aws cognito-idp create-user-pool \
  --pool-name NorthPeakCare-Nurses-prod \
  --policies "PasswordPolicy={MinimumLength=8,RequireUppercase=true,RequireLowercase=true,RequireNumbers=true,RequireSymbols=false}" \
  --auto-verified-attributes email phone_number \
  --mfa-configuration OPTIONAL \
  --schema \
    Name=custom:nurseId,AttributeDataType=String,Mutable=false \
    Name=custom:licenseNumber,AttributeDataType=String,Mutable=true

# Create app client
aws cognito-idp create-user-pool-client \
  --user-pool-id <nurses-pool-id> \
  --client-name NorthPeakCare-Web \
  --no-generate-secret \
  --explicit-auth-flows ALLOW_USER_PASSWORD_AUTH ALLOW_REFRESH_TOKEN_AUTH
```

### Authorization Rules

**AppSync Resolvers** use Cognito groups for authorization:

```graphql
type Job @aws_cognito_user_pools {
  id: ID!
  # ... other fields
}

type Mutation {
  # Only pharmacies can create jobs
  createJob(input: CreateJobInput!): Job
    @aws_auth(cognito_groups: ["pharmacies"])
  
  # Only nurses can apply to jobs
  applyToJob(jobId: ID!, availability: [TimeSlotInput!]!): Application
    @aws_auth(cognito_groups: ["nurses"])
  
  # Only admins can verify credentials
  verifyCredential(credentialId: ID!): Credential
    @aws_auth(cognito_groups: ["admins"])
}
```

---

## Lambda Functions

### Function List

| Function | Trigger | Purpose |
|----------|---------|---------|
| `nursys-verify-license` | API/Manual | Verify RN license |
| `checkr-order-background-check` | API | Order background check |
| `checkr-webhook-handler` | API Gateway | Handle CHECKR webhooks |
| `stripe-create-payment-intent` | AppSync | Create payment |
| `stripe-create-connected-account` | AppSync | Onboard nurse to Stripe |
| `stripe-webhook-handler` | API Gateway | Handle Stripe webhooks |
| `gusto-create-employee` | AppSync | Create nurse in Gusto |
| `gusto-sync-payment` | EventBridge | Sync payment to Gusto |
| `send-notification` | SNS/Direct | Send SMS/Email |
| `calculate-distance` | AppSync | Calculate job distance for nurses |
| `send-visit-reminder` | EventBridge | Daily job to send reminders |
| `process-payment` | DynamoDB Stream | Process completed visit payment |

### Deployment

Use AWS SAM or Amplify CLI:

```yaml
# template.yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Resources:
  NursysVerifyFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: functions/nursys-verify/
      Handler: index.handler
      Runtime: nodejs18.x
      Environment:
        Variables:
          NURSYS_API_URL: !Ref NursysApiUrl
          TABLE_NAME: !Ref DynamoDBTable
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref DynamoDBTable
        - Statement:
          - Effect: Allow
            Action:
              - secretsmanager:GetSecretValue
            Resource: !Ref NursysApiSecret
```

---

## Frontend Deployment

### Amplify Hosting Setup

1. **Initialize Amplify**:
```bash
amplify init
# Choose: React, JavaScript, build directory: dist
```

2. **Add Hosting**:
```bash
amplify add hosting
# Choose: Amplify Console
```

3. **Configure Build**:
```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

4. **Environment Variables** (in Amplify Console):
```
VITE_AWS_REGION=us-east-1
VITE_COGNITO_NURSES_POOL_ID=us-east-1_xxxxx
VITE_COGNITO_PHARMACIES_POOL_ID=us-east-1_xxxxx
VITE_COGNITO_ADMIN_POOL_ID=us-east-1_xxxxx
VITE_APPSYNC_ENDPOINT=https://xxxxx.appsync-api.us-east-1.amazonaws.com/graphql
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_APP_URL=https://app.northpeakcare.com
```

5. **Deploy**:
```bash
amplify publish
```

---

## Testing Strategy

### 1. Unit Tests
Test individual components and functions.

### 2. Integration Tests
Test API integrations with sandbox/test environments:
- NURSYS: Use test credentials
- Stripe: Use test mode
- CHECKR: Use sandbox
- Gusto: Use demo company

### 3. End-to-End Tests
Test complete workflows:
- Nurse onboarding → License verification → Background check
- Job posting → Nurse application → Payment processing
- Visit completion → Payment transfer → Gusto sync

---

## Deployment Checklist

### Pre-Production
- [ ] Set up AWS account and IAM users
- [ ] Create DynamoDB tables
- [ ] Set up Cognito user pools
- [ ] Deploy Lambda functions
- [ ] Configure API Gateway
- [ ] Set up S3 buckets
- [ ] Configure SNS/SES
- [ ] Set up CloudWatch logging
- [ ] Create Secrets Manager secrets for API keys
- [ ] Configure domain and SSL certificates

### External Services
- [ ] Create NURSYS API account (production)
- [ ] Create Stripe account (live mode)
- [ ] Create CHECKR account (production)
- [ ] Create Gusto account
- [ ] Set up Twilio/SNS for SMS
- [ ] Set up SendGrid/SES for email
- [ ] Configure webhooks for each service

### Testing
- [ ] Test all user flows
- [ ] Test payment processing
- [ ] Test notifications
- [ ] Load testing
- [ ] Security audit
- [ ] Penetration testing

### Launch
- [ ] Deploy to production
- [ ] Monitor logs and metrics
- [ ] Set up alerts
- [ ] Create runbook for common issues
- [ ] Train support team

---

## Cost Estimation

### Monthly Costs (Estimated)
- **Amplify Hosting**: $15-30
- **DynamoDB**: $25-100 (depends on usage)
- **Lambda**: $10-50
- **Cognito**: Free (first 50k MAUs)
- **S3**: $5-20
- **SNS/SES**: $10-50
- **API Costs**:
  - NURSYS: ~$1-3 per verification
  - Stripe: 2.9% + $0.30 per transaction
  - CHECKR: ~$30-50 per background check
  - Gusto: Variable based on payroll

**Total Platform Costs**: $65-250/month + transaction costs

---

## Support & Maintenance

### Monitoring
- CloudWatch dashboards for key metrics
- Alarms for errors and high latency
- Cost monitoring

### Backup
- DynamoDB point-in-time recovery
- S3 versioning for documents
- Regular database backups

### Updates
- Regular dependency updates
- Security patches
- AWS service updates

---

For detailed component documentation, see `/components/README_COMPONENTS.md`
For data models, see `/types/data-models.ts`
For API interfaces, see `/services/api-interfaces.ts`
