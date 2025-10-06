# NorthPeak Care - Healthcare Staffing Platform

A comprehensive, production-ready platform for gig staffing of nurses specializing in IV infusions and home medical care. Features three distinct user interfaces with full external API integration support for payments, background checks, payroll, and license verification.

## 🏥 Overview

NorthPeak Care is designed for the modern healthcare staffing landscape, focusing on IV therapy and home medical care services. The platform handles the complete workflow from nurse onboarding through visit completion, with integrated payment processing and compliance verification.

## ✨ Key Features

### 🎯 **Three User Portals**
- **Nurse Portal**: Job browsing with sorting (distance, pay, type, date), comprehensive onboarding, credential management
- **Pharmacy Portal**: Visit posting, nurse application review, real-time visit monitoring, payment management
- **Admin Portal**: Platform oversight, user management, analytics, compliance monitoring

### 🩺 **IV Infusion Specialization**
- Medication-specific visit types (Remicade, PICC line care, chemotherapy, hydration therapy)
- Professional healthcare workflow optimization
- Patient privacy protection (names revealed only upon visit acceptance)
- Day-before confirmation call workflow

### 📱 **Mobile-Optimized**
- Designed for mobile phone use by healthcare professionals
- Responsive design across all screen sizes
- Touch-friendly interface with quick access to essential information

### 🔄 **Complete Workflow Management**
- **Nurse Onboarding**: Multi-step verification with NURSYS license verification and CHECKR background checks
- **Visit Management**: From posting to completion with full documentation
- **Real-time Communication**: Built-in messaging system with role-based access
- **Comprehensive Notifications**: SMS and email notifications via Twilio/SNS and SendGrid/SES

### 💳 **Payment Processing**
- **Stripe Integration**: Payment intents, connected accounts, automatic transfers
- **Gusto Payroll**: Automatic payroll sync for tax reporting

### 🔐 **Compliance & Verification**
- **NURSYS**: Automated RN license verification
- **CHECKR**: Background check integration
- **Document Management**: S3-based credential storage

## 🚀 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS V4** with custom design tokens
- **shadcn/ui** component library
- **Vite** for development and builds
- **Lucide React** for icons

### Backend (AWS Amplify)
- **AWS Amplify** for hosting and CI/CD
- **AWS AppSync** (GraphQL API)
- **AWS Cognito** (authentication with 3 user pools)
- **DynamoDB** (single-table design)
- **AWS Lambda** (serverless functions)
- **S3** (document storage)
- **SNS/SES** (notifications)

### External Integrations
- **NURSYS** - RN license verification
- **Stripe** - Payment processing
- **CHECKR** - Background checks
- **Gusto** - Payroll integration
- **Twilio/AWS SNS** - SMS notifications
- **SendGrid/AWS SES** - Email notifications

## 📦 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### AWS Deployment

See detailed guides:
- **[ANIMA_EXPORT_GUIDE.md](./ANIMA_EXPORT_GUIDE.md)** - Export from Figma via Anima
- **[AWS_AMPLIFY_MIGRATION_GUIDE.md](./AWS_AMPLIFY_MIGRATION_GUIDE.md)** - Complete AWS setup
- **[EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md)** - Third-party API setup

## 🏗️ Project Structure

```
northpeak-care/
├── App.tsx                           # Main application router
├── types/
│   └── data-models.ts               # Complete data model definitions
├── services/
│   └── api-interfaces.ts            # External API service interfaces
├── components/
│   ├── ui/                          # shadcn/ui components
│   ├── figma/                       # Figma-specific components
│   │
│   ├── Nurse Portal Components
│   │   ├── nurse-portal.tsx         # Main nurse dashboard
│   │   ├── nurse-stats-header.tsx   # Profile stats header
│   │   ├── nurse-job-card.tsx       # Individual job card
│   │   ├── job-list-with-sort.tsx   # Job list with sorting
│   │   ├── nurse-onboarding.tsx     # Multi-step onboarding
│   │   ├── nurse-login.tsx          # Authentication
│   │   └── [other nurse components]
│   │
│   ├── Pharmacy Portal Components
│   │   ├── supplier-dashboard-fixed.tsx  # Main pharmacy dashboard
│   │   ├── pharmacy-stats-header.tsx     # Business stats header
│   │   ├── pharmacy-job-card.tsx         # Posted job card
│   │   ├── post-new-job.tsx             # Create visit
│   │   ├── pharmacy-login.tsx           # Authentication
│   │   └── [other pharmacy components]
│   │
│   ├── Admin Portal Components
│   │   ├── admin-portal.tsx         # Main admin dashboard
│   │   ├── admin-stats-cards.tsx    # Platform metrics
│   │   ├── admin-login.tsx          # Authentication
│   │   └── [other admin components]
│   │
│   └── Shared Components
│       ├── messaging-system.tsx     # Cross-portal messaging
│       ├── notification-center.tsx  # Notification management
│       └── landing-page.tsx         # Portal selection
│
├── styles/
│   └── globals.css                  # Tailwind V4 config & design tokens
│
└── Documentation
    ├── README.md                    # This file
    ├── ANIMA_EXPORT_GUIDE.md       # Anima export instructions
    ├── AWS_AMPLIFY_MIGRATION_GUIDE.md  # AWS deployment guide
    ├── EXTERNAL_API_INTEGRATION.md      # External API setup
    ├── EXPORT_GUIDE.md             # General export guide
    └── components/README_COMPONENTS.md  # Component documentation
```

## 🎯 Component Architecture

### Modular Design for Export

All components are optimized for Anima export and AWS Amplify migration:

#### Nurse Components
| Component | Purpose | Exported |
|-----------|---------|----------|
| `NurseStatsHeader` | Profile header with stats | ✅ |
| `NurseJobCard` | Individual job display | ✅ |
| `JobListWithSort` | Job list with 4 sort options | ✅ |
| `NursePortal` | Main dashboard | ✅ |

#### Pharmacy Components
| Component | Purpose | Exported |
|-----------|---------|----------|
| `PharmacyStatsHeader` | Business stats header | ✅ |
| `PharmacyJobCard` | Posted job card | ✅ |
| `SupplierDashboard` | Main dashboard | ✅ |

#### Admin Components
| Component | Purpose | Exported |
|-----------|---------|----------|
| `AdminStatsCards` | Platform metrics | ✅ |
| `AdminPortal` | Main dashboard | ✅ |

### Job Sorting Feature

Nurses can sort available visits by:
- **Distance** (nearest first) - Default
- **Pay** (highest first)
- **Type** (A-Z alphabetical)
- **Date** (earliest first)

## 🔧 Development Features

### Nurse Portal
- ✅ Job browsing with advanced sorting
- ✅ Real-time availability management
- ✅ Visit acceptance workflow
- ✅ Active job tracking
- ✅ Comprehensive onboarding (9 steps)
- ✅ Credential management

### Pharmacy Portal
- ✅ Visit posting and management
- ✅ Nurse application review
- ✅ Real-time visit monitoring
- ✅ Payment oversight
- ✅ Performance analytics

### Admin Portal
- ✅ User management
- ✅ Platform analytics
- ✅ Compliance monitoring
- ✅ System oversight

### Shared Features
- ✅ Role-based messaging
- ✅ Notification center with SMS/Email
- ✅ Document upload to S3
- ✅ Real-time updates

## 💾 Data Models

Complete TypeScript data models in `/types/data-models.ts`:

- `User`, `NurseProfile`, `PharmacyProfile`, `AdminProfile`
- `Job`, `Visit`, `JobApplication`, `TimeSlot`
- `Credential`, `Message`, `Conversation`, `Notification`
- `Payment`, `PaymentMethod`
- `NursysVerificationResponse`, `CheckrBackgroundCheckResponse`
- `PlatformAnalytics`

## 🔌 External API Services

Service interfaces in `/services/api-interfaces.ts`:

### NotificationService
- `sendSMS()` - Send SMS via Twilio/SNS
- `sendEmail()` - Send email via SendGrid/SES
- `sendVisitReminder()` - Automated reminders

### NursysService
- `verifyLicense()` - Verify RN license
- `checkLicenseStatus()` - Check expiry/status
- `autoVerifyCredential()` - Auto-update credentials

### StripeService
- `createPaymentIntent()` - Pharmacy payment
- `createConnectedAccount()` - Nurse onboarding
- `transferToNurse()` - Payout after visit
- `handleWebhook()` - Process Stripe events

### CheckrService
- `orderBackgroundCheck()` - Order check
- `getCheckStatus()` - Poll for results
- `handleWebhook()` - Process completion
- `updateNurseBackgroundCheck()` - Update status

### GustoService
- `createEmployee()` - Add nurse to payroll
- `createOffCyclePayment()` - Process visit payment
- `syncStripePayment()` - Sync Stripe → Gusto
- `getTaxDocuments()` - W2/1099 retrieval

## 🚀 Deployment

### Step 1: Export from Anima
```bash
# Use Anima plugin in Figma
# Export as React + TypeScript + Tailwind
# Download and merge with codebase
```

### Step 2: AWS Amplify Setup
```bash
# Initialize Amplify
amplify init

# Add authentication (3 user pools)
amplify add auth

# Add API (GraphQL)
amplify add api

# Add storage (S3)
amplify add storage

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

### Step 3: Configure External Services
```bash
# Store API credentials in Secrets Manager
aws secretsmanager create-secret --name northpeakcare/nursys/api-key
aws secretsmanager create-secret --name northpeakcare/stripe/keys
aws secretsmanager create-secret --name northpeakcare/checkr/api-key
aws secretsmanager create-secret --name northpeakcare/gusto/credentials
```

### Step 4: Deploy Lambda Functions
```bash
# Deploy all Lambda functions for external API integration
# See AWS_AMPLIFY_MIGRATION_GUIDE.md for details
```

## 📖 Documentation

### Main Guides
- **[ANIMA_EXPORT_GUIDE.md](./ANIMA_EXPORT_GUIDE.md)** - Complete Anima export workflow
- **[AWS_AMPLIFY_MIGRATION_GUIDE.md](./AWS_AMPLIFY_MIGRATION_GUIDE.md)** - AWS Amplify deployment
- **[EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md)** - Third-party API integration

### Technical Docs
- **[/types/data-models.ts](./types/data-models.ts)** - Data model definitions
- **[/services/api-interfaces.ts](./services/api-interfaces.ts)** - Service interfaces
- **[/components/README_COMPONENTS.md](./components/README_COMPONENTS.md)** - Component docs

## 🔐 Security & Compliance

### Production Requirements
- ✅ AWS Cognito with 3 separate user pools
- ✅ HIPAA-compliant data handling (AWS HIPAA-eligible services)
- ✅ Encrypted data at rest (DynamoDB encryption, S3 encryption)
- ✅ Encrypted data in transit (HTTPS, TLS)
- ✅ NURSYS license verification
- ✅ CHECKR background checks
- ✅ Audit logging (CloudWatch)
- ✅ PII protection (Secrets Manager, KMS)

### Best Practices Implemented
- Secrets Manager for API keys
- IAM roles with least privilege
- Webhook signature verification
- Rate limiting on APIs
- Input validation
- SQL injection prevention (using DynamoDB)
- XSS protection

## 💰 Cost Estimation

### Monthly AWS Costs (Estimated)
- Amplify Hosting: $15-30
- DynamoDB: $25-100
- Lambda: $10-50
- Cognito: Free (first 50k MAUs)
- S3: $5-20
- SNS/SES: $10-50

### External Service Costs
- NURSYS: ~$1-3 per verification
- Stripe: 2.9% + $0.30 per transaction
- CHECKR: ~$30-50 per background check
- Gusto: Variable based on payroll volume

**Total Platform Cost**: ~$65-250/month + transaction fees

## 🧪 Testing

### Test Environments
- **NURSYS**: Sandbox environment with test credentials
- **Stripe**: Test mode with test cards
- **CHECKR**: Sandbox with test SSNs
- **Gusto**: Demo company

### Test Coverage
- Unit tests for components
- Integration tests for APIs
- End-to-end workflow tests
- Load testing for scalability

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the component structure guidelines
4. Add tests for new features
5. Update documentation
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with React 18 and TypeScript
- UI components powered by shadcn/ui and Radix UI
- Styled with Tailwind CSS V4
- Deployed on AWS Amplify
- External services: NURSYS, Stripe, CHECKR, Gusto

---

## 📞 Support

For questions about:
- **Anima Export**: See [ANIMA_EXPORT_GUIDE.md](./ANIMA_EXPORT_GUIDE.md)
- **AWS Deployment**: See [AWS_AMPLIFY_MIGRATION_GUIDE.md](./AWS_AMPLIFY_MIGRATION_GUIDE.md)
- **External APIs**: See [EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md)
- **Components**: See [/components/README_COMPONENTS.md](./components/README_COMPONENTS.md)

---

**Status**: ✅ Optimized for Anima Export and AWS Amplify Migration

**Last Updated**: October 4, 2025
