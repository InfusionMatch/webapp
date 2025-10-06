# Anima Export & AWS Amplify Migration Guide

## Overview

This guide provides instructions for exporting the NorthPeak Care platform via Anima and migrating to AWS Amplify with full production readiness.

---

## Table of Contents

1. [Preparing for Anima Export](#preparing-for-anima-export)
2. [Component Structure](#component-structure)
3. [Data Flow Architecture](#data-flow-architecture)
4. [AWS Amplify Setup](#aws-amplify-setup)
5. [External Service Integration](#external-service-integration)
6. [Deployment Workflow](#deployment-workflow)
7. [Post-Export Checklist](#post-export-checklist)

---

## Preparing for Anima Export

### Current Application Structure

The application is already optimized for Anima export with:
- ✅ Modular component architecture
- ✅ Clear prop interfaces with TypeScript
- ✅ Shadcn/ui components (compatible)
- ✅ Tailwind CSS v4 (Anima-compatible)
- ✅ Self-contained components
- ✅ No complex global state
- ✅ Clear data models

### Pre-Export Checklist

- [ ] Review all components for modularity
- [ ] Ensure all TypeScript interfaces are defined
- [ ] Check that all images use ImageWithFallback or imports
- [ ] Verify Tailwind classes are standard (no custom plugins)
- [ ] Test all user flows
- [ ] Document component props

---

## Component Structure

### Portal Components (Main Views)

#### 1. Landing Page
**File**: `/components/landing-page.tsx`
**Purpose**: Portal selection (Nurse, Pharmacy, Admin)
**Props**: `onRoleSelect: (role: string) => void`
**Exported**: Yes

#### 2. Nurse Portal
**File**: `/components/nurse-portal.tsx`
**Purpose**: Main nurse dashboard
**Props**:
```typescript
{
  onJobClick?: () => void;
  onEditProfile?: () => void;
}
```
**Child Components**:
- `NurseStatsHeader` - Profile stats
- `JobListWithSort` - Available jobs with sorting
- `NurseJobCard` - Individual job card
- `UpcomingShifts` - Scheduled visits
- `NurseOnboardingTasks` - Onboarding checklist

#### 3. Pharmacy Portal
**File**: `/components/supplier-dashboard-fixed.tsx`
**Purpose**: Pharmacy dashboard for job management
**Props**:
```typescript
{
  onJobClick?: () => void;
}
```
**Child Components**:
- `PharmacyStatsHeader` - Business stats
- `PharmacyJobCard` - Job posting card
- `PostNewJob` - Create new visit
- `TodaysVisits` - Today's scheduled visits
- `PharmacyPatients` - Patient management

#### 4. Admin Portal
**File**: `/components/admin-portal.tsx`
**Purpose**: Platform administration
**Props**: None
**Child Components**:
- `AdminStatsCards` - Platform metrics

### Reusable Components

#### Nurse Components
| Component | File | Purpose | Props |
|-----------|------|---------|-------|
| NurseStatsHeader | `nurse-stats-header.tsx` | Profile header | `stats`, `onboardingProgress`, `onEditProfile` |
| NurseJobCard | `nurse-job-card.tsx` | Job display card | `job`, `onAcceptVisit`, `onViewDetails` |
| JobListWithSort | `job-list-with-sort.tsx` | Job list with sorting | `jobs`, `onJobClick` |

#### Pharmacy Components
| Component | File | Purpose | Props |
|-----------|------|---------|-------|
| PharmacyStatsHeader | `pharmacy-stats-header.tsx` | Business stats | `stats`, `onPostJob` |
| PharmacyJobCard | `pharmacy-job-card.tsx` | Posted job card | `job`, `onViewDetails`, `onViewApplications` |

#### Admin Components
| Component | File | Purpose | Props |
|-----------|------|---------|-------|
| AdminStatsCards | `admin-stats-cards.tsx` | Platform metrics | `stats` |

#### Authentication Components
| Component | File | Purpose |
|-----------|------|---------|
| NurseLogin | `nurse-login.tsx` | Nurse authentication |
| PharmacyLogin | `pharmacy-login.tsx` | Pharmacy authentication |
| AdminLogin | `admin-login.tsx` | Admin authentication |

#### Shared Components
| Component | File | Purpose |
|-----------|------|---------|
| MessagingSystem | `messaging-system.tsx` | Cross-portal messaging |
| NotificationCenter | `notification-center.tsx` | Notification management |

### Component Dependencies

```
App.tsx
├── Landing Page
│   ├── Nurse Login → Nurse Portal
│   ├── Pharmacy Login → Pharmacy Portal
│   └── Admin Login → Admin Portal
│
├── Nurse Portal
│   ├── NurseStatsHeader
│   ├── JobListWithSort
│   │   └── NurseJobCard
│   ├── UpcomingShifts
│   ├── NurseOnboardingTasks
│   ├── MessagingSystem
│   └── NotificationCenter
│
├── Pharmacy Portal
│   ├── PharmacyStatsHeader
│   ├── PharmacyJobCard
│   ├── PostNewJob
│   ├── TodaysVisits
│   ├── MessagingSystem
│   └── NotificationCenter
│
└── Admin Portal
    ├── AdminStatsCards
    ├── MessagingSystem
    └── NotificationCenter
```

---

## Data Flow Architecture

### Frontend → Backend Communication

```
React Component
      ↓
  GraphQL Query/Mutation (AppSync)
      ↓
  Lambda Resolver
      ↓
  DynamoDB / External API
      ↓
  Response
      ↓
  React Component Update
```

### Data Models Location

All data models are defined in `/types/data-models.ts`:

- `User` - Base user model
- `NurseProfile` - Nurse details
- `PharmacyProfile` - Pharmacy details
- `AdminProfile` - Admin details
- `Job` - Visit/job posting
- `Visit` - Scheduled visit with patient details
- `Credential` - License/certification
- `Message` - Chat message
- `Notification` - System notification
- `Payment` - Payment transaction

### Service Interfaces

All external API interfaces in `/services/api-interfaces.ts`:

- `NotificationService` - SMS/Email
- `NursysService` - License verification
- `StripeService` - Payments
- `CheckrService` - Background checks
- `GustoService` - Payroll
- `GeocodingService` - Distance calculation

---

## AWS Amplify Setup

### Step 1: Initialize Amplify Project

```bash
# Navigate to exported project directory
cd northpeak-care-app

# Install dependencies
npm install

# Initialize Amplify
amplify init

# Prompts:
# - Enter a name for the project: NorthPeakCare
# - Enter a name for the environment: prod
# - Choose your default editor: Visual Studio Code
# - Choose the type of app: javascript
# - What javascript framework: react
# - Source Directory Path: src
# - Distribution Directory Path: dist
# - Build Command: npm run build
# - Start Command: npm run dev
# - Do you want to use an AWS profile: Yes
```

### Step 2: Add Authentication

```bash
amplify add auth

# Prompts:
# - Do you want to use the default authentication: Manual configuration
# - Select the authentication: Username
# - What attributes are required: Email, Phone Number
# - Do you want to enable MFA: Optional
# - Configure Lambda triggers: Yes
# - Which triggers: Pre Sign-up, Post Confirmation
```

**Create 3 User Pools** (manually in AWS Console):
1. Nurses Pool
2. Pharmacies Pool  
3. Admin Pool

### Step 3: Add API (AppSync GraphQL)

```bash
amplify add api

# Prompts:
# - Select from REST or GraphQL: GraphQL
# - Provide API name: NorthPeakCareAPI
# - Choose authorization type: Amazon Cognito User Pool
# - Do you want to configure advanced settings: Yes
# - Configure conflict detection: No
# - Do you have an annotated schema: No
```

**GraphQL Schema** (`amplify/backend/api/NorthPeakCareAPI/schema.graphql`):

```graphql
# See AWS_AMPLIFY_MIGRATION_GUIDE.md for full schema
type Job @model @auth(rules: [
  { allow: groups, groups: ["nurses"], operations: [read] },
  { allow: groups, groups: ["pharmacies"], operations: [create, read, update, delete] },
  { allow: groups, groups: ["admins"], operations: [read, update] }
]) {
  id: ID!
  pharmacyId: ID!
  title: String!
  type: String!
  medication: String!
  patientCode: String!
  location: Location!
  visitDate: AWSDate!
  timeWindow: String!
  hourlyRate: Float!
  totalPay: Float!
  status: String!
  requirements: [String!]!
  applicantIds: [ID!]
  assignedNurseId: ID
}

type NurseProfile @model @auth(rules: [
  { allow: owner, ownerField: "userId", operations: [read, update] },
  { allow: groups, groups: ["admins"], operations: [read, update] }
]) {
  id: ID!
  userId: ID!
  firstName: String!
  lastName: String!
  email: String!
  phoneNumber: String!
  licenseNumber: String!
  licenseState: String!
  licenseVerified: Boolean
  rating: Float
  totalVisits: Int
  completedVisits: Int
  monthlyEarnings: Float
}

# ... more types (see data-models.ts)
```

### Step 4: Add Storage (S3)

```bash
amplify add storage

# Prompts:
# - Select from: Content
# - Provide bucket name: northpeakcare-documents
# - Who should have access: Auth users only
# - What kind of access: create/update, read, delete
```

### Step 5: Add Functions (Lambda)

```bash
# For each external API integration
amplify add function

# Create functions for:
# - nursysVerifyLicense
# - checkrOrderBackgroundCheck
# - stripeCreatePaymentIntent
# - gustoSyncPayment
# - sendNotification
# - calculateDistance
```

### Step 6: Add Hosting

```bash
amplify add hosting

# Prompts:
# - Select the plugin module: Hosting with Amplify Console
# - Choose a type: Continuous deployment
```

### Step 7: Deploy

```bash
# Deploy all resources
amplify push

# Deploy and host
amplify publish
```

---

## External Service Integration

### Required Accounts & API Keys

1. **NURSYS**
   - Create account: https://www.nursys.com/
   - Get API credentials
   - Store in Secrets Manager: `northpeakcare/nursys/api-key`

2. **Stripe**
   - Create account: https://stripe.com/
   - Get live API keys
   - Store in Secrets Manager: `northpeakcare/stripe/keys`
   - Set up webhooks

3. **CHECKR**
   - Create account: https://checkr.com/
   - Get API key
   - Store in Secrets Manager: `northpeakcare/checkr/api-key`
   - Configure webhooks

4. **Gusto**
   - Create account: https://gusto.com/
   - Apply for API access
   - Store in Secrets Manager: `northpeakcare/gusto/credentials`

5. **AWS SNS/SES** (for SMS/Email)
   - Already available in AWS account
   - Verify sender email in SES
   - Request production access for SES

### Secrets Manager Setup

```bash
# NURSYS
aws secretsmanager create-secret \
  --name northpeakcare/nursys/api-key \
  --secret-string '{"apiKey":"xxx","apiUrl":"https://api.nursys.com/v1"}'

# Stripe
aws secretsmanager create-secret \
  --name northpeakcare/stripe/keys \
  --secret-string '{"secretKey":"sk_live_xxx","publishableKey":"pk_live_xxx","webhookSecret":"whsec_xxx"}'

# CHECKR
aws secretsmanager create-secret \
  --name northpeakcare/checkr/api-key \
  --secret-string '{"apiKey":"xxx"}'

# Gusto
aws secretsmanager create-secret \
  --name northpeakcare/gusto/credentials \
  --secret-string '{"apiToken":"xxx","companyId":"xxx"}'
```

### Environment Variables

Add to Amplify Console > App Settings > Environment Variables:

```
VITE_AWS_REGION=us-east-1
VITE_COGNITO_NURSES_POOL_ID=us-east-1_xxxxx
VITE_COGNITO_PHARMACIES_POOL_ID=us-east-1_xxxxx
VITE_COGNITO_ADMIN_POOL_ID=us-east-1_xxxxx
VITE_APPSYNC_ENDPOINT=https://xxxxx.appsync-api.us-east-1.amazonaws.com/graphql
VITE_APPSYNC_API_KEY=da2-xxxxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
VITE_APP_URL=https://app.northpeakcare.com
```

---

## Deployment Workflow

### Anima Export Process

1. **Export from Figma**
   - Use Anima plugin in Figma
   - Select all frames
   - Export as React + TypeScript
   - Choose Tailwind CSS

2. **Download & Extract**
   - Download exported code
   - Extract to project directory
   - Merge with existing components

3. **Integration**
   - Copy exported components to `/components`
   - Update imports in `App.tsx`
   - Integrate with data models
   - Add event handlers

4. **Testing**
   - Test all user flows locally
   - Verify styling consistency
   - Check responsive behavior

### CI/CD Pipeline

Amplify Console automatically deploys on git push:

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
backend:
  phases:
    build:
      commands:
        - amplifyPush --simple
```

### Deployment Stages

1. **Development**: `dev` branch → dev environment
2. **Staging**: `staging` branch → staging environment
3. **Production**: `main` branch → prod environment

---

## Post-Export Checklist

### Immediate (Day 1)

- [ ] Export code from Anima
- [ ] Merge with existing codebase
- [ ] Test all components locally
- [ ] Fix any styling issues
- [ ] Update prop interfaces
- [ ] Connect to mock data

### Week 1

- [ ] Set up AWS Amplify project
- [ ] Create Cognito user pools
- [ ] Deploy API (AppSync)
- [ ] Create DynamoDB tables
- [ ] Set up S3 storage
- [ ] Deploy Lambda functions

### Week 2

- [ ] Integrate NURSYS API
- [ ] Integrate Stripe
- [ ] Set up webhooks
- [ ] Test payment flow
- [ ] Configure CHECKR

### Week 3

- [ ] Integrate Gusto
- [ ] Set up SNS/SES
- [ ] Test all notifications
- [ ] End-to-end testing
- [ ] Security audit

### Week 4 (Launch)

- [ ] Final testing
- [ ] Performance optimization
- [ ] Load testing
- [ ] Deploy to production
- [ ] Monitor logs
- [ ] User acceptance testing

---

## Component Export Best Practices

### 1. Naming Conventions

```typescript
// Component files: kebab-case
nurse-portal.tsx
pharmacy-stats-header.tsx

// Component names: PascalCase
export function NursePortal() {}
export function PharmacyStatsHeader() {}

// Props interfaces: PascalCase + Props suffix
interface NursePortalProps {}
interface PharmacyStatsHeaderProps {}
```

### 2. Props Documentation

```typescript
/**
 * Nurse Portal - Main dashboard for nurses
 * 
 * @param onJobClick - Callback when job is clicked
 * @param onEditProfile - Callback when edit profile is clicked
 */
export function NursePortal({ 
  onJobClick, 
  onEditProfile 
}: NursePortalProps) {
  // ...
}
```

### 3. Data Mocking

```typescript
// Keep mock data separate for easy replacement
const MOCK_JOBS = [/* mock data */];

// In production, replace with:
const { data: jobs } = useQuery(GET_JOBS);
```

### 4. Styling

```typescript
// Use Tailwind classes consistently
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-md">

// Avoid inline styles (except for dynamic values)
<div style={{ height: `${dynamicHeight}px` }}>
```

---

## Troubleshooting

### Common Anima Export Issues

**Issue**: Missing images
**Solution**: Use `ImageWithFallback` component or ensure image URLs are accessible

**Issue**: Custom Tailwind classes not working
**Solution**: Stick to standard Tailwind classes, avoid custom plugins

**Issue**: TypeScript errors after export
**Solution**: Check prop interfaces, ensure all types are defined

### AWS Deployment Issues

**Issue**: Lambda timeout
**Solution**: Increase timeout in function config, optimize code

**Issue**: CORS errors
**Solution**: Configure API Gateway CORS settings

**Issue**: Authentication errors
**Solution**: Check Cognito user pool configuration, verify tokens

---

## Resources

- **Anima Documentation**: https://www.animaapp.com/docs
- **AWS Amplify Documentation**: https://docs.amplify.aws/
- **AppSync Documentation**: https://docs.aws.amazon.com/appsync/
- **DynamoDB Best Practices**: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/best-practices.html

## Related Documentation

- `/AWS_AMPLIFY_MIGRATION_GUIDE.md` - Detailed AWS setup
- `/EXTERNAL_API_INTEGRATION.md` - External API integration
- `/types/data-models.ts` - Data model definitions
- `/services/api-interfaces.ts` - Service interfaces
- `/components/README_COMPONENTS.md` - Component documentation

---

**Ready to export and deploy!** 🚀
