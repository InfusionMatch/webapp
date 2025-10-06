# NorthPeak Care - Documentation Index

## 📚 Complete Documentation Guide

This index provides quick navigation to all documentation for the NorthPeak Care platform, organized by audience and purpose.

---

## 🎯 Quick Start Guides

### For Developers Getting Started
1. **[README.md](./README.md)** - Platform overview and quick start
2. **[SETUP.md](./SETUP.md)** - Local development setup (if exists)
3. **Component Structure** - See [Component Documentation](#component-documentation)

### For Designers/Anima Users
1. **[ANIMA_EXPORT_GUIDE.md](./ANIMA_EXPORT_GUIDE.md)** ⭐ - Complete Anima export workflow
2. **[/components/README_COMPONENTS.md](./components/README_COMPONENTS.md)** - Component library
3. **Brand Colors** - See `/styles/globals.css`

### For DevOps/Deployment
1. **[AWS_AMPLIFY_MIGRATION_GUIDE.md](./AWS_AMPLIFY_MIGRATION_GUIDE.md)** ⭐ - AWS deployment
2. **[EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md)** ⭐ - Third-party APIs
3. **[Deployment Checklist](#deployment-checklist)** - Pre-launch checklist

---

## 📖 Main Documentation Files

### 1. Platform Overview
**File**: [README.md](./README.md)  
**Purpose**: High-level platform description, features, tech stack  
**Audience**: Everyone  
**Contents**:
- Platform overview
- Key features
- Technology stack
- Quick start
- Project structure
- Cost estimation

### 2. Anima Export Guide
**File**: [ANIMA_EXPORT_GUIDE.md](./ANIMA_EXPORT_GUIDE.md)  
**Purpose**: Export from Figma via Anima to React  
**Audience**: Designers, Frontend Developers  
**Contents**:
- Pre-export preparation
- Component structure for export
- Data flow architecture
- AWS Amplify setup overview
- Post-export integration
- Troubleshooting

### 3. AWS Amplify Migration Guide
**File**: [AWS_AMPLIFY_MIGRATION_GUIDE.md](./AWS_AMPLIFY_MIGRATION_GUIDE.md)  
**Purpose**: Complete AWS deployment and architecture  
**Audience**: Backend Developers, DevOps Engineers  
**Contents**:
- Architecture diagrams
- DynamoDB table design
- Lambda functions
- AppSync GraphQL schema
- Cognito setup (3 user pools)
- Step-by-step deployment
- Cost estimation
- Monitoring and logging

### 4. External API Integration Guide
**File**: [EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md)  
**Purpose**: Integrate third-party services  
**Audience**: Backend Developers  
**Contents**:
- **NURSYS** - License verification setup
- **Stripe** - Payment processing implementation
- **CHECKR** - Background checks integration
- **Gusto** - Payroll sync
- **SMS/Email** - Notification services
- Code examples for each service
- Error handling patterns
- Testing strategies

### 5. Component Documentation
**File**: [/components/README_COMPONENTS.md](./components/README_COMPONENTS.md)  
**Purpose**: Component library reference  
**Audience**: Frontend Developers, Designers  
**Contents**:
- Job sorting feature
- Modular component descriptions
- Data interfaces
- Usage examples
- AWS integration guidelines
- Best practices

### 6. Export Guide (General)
**File**: [EXPORT_GUIDE.md](./EXPORT_GUIDE.md)  
**Purpose**: General export information  
**Audience**: Developers  
**Contents**:
- Component export overview
- Data structures
- API integration points
- Best practices

---

## 💻 Technical Reference

### Data Models
**File**: [/types/data-models.ts](./types/data-models.ts)  
**Purpose**: Complete TypeScript data model definitions  
**Contains**:
- `User`, `NurseProfile`, `PharmacyProfile`, `AdminProfile`
- `Job`, `Visit`, `JobApplication`, `TimeSlot`
- `Credential`, `Message`, `Notification`
- `Payment`, `PaymentMethod`
- External API response types

### Service Interfaces
**File**: [/services/api-interfaces.ts](./services/api-interfaces.ts)  
**Purpose**: External API service interfaces  
**Contains**:
- `NotificationService` - SMS/Email
- `NursysService` - License verification
- `StripeService` - Payment processing
- `CheckrService` - Background checks
- `GustoService` - Payroll integration
- `GeocodingService` - Distance calculation

### Styling
**File**: [/styles/globals.css](./styles/globals.css)  
**Purpose**: Tailwind CSS v4 configuration and design tokens  
**Contains**:
- Brand color variables
- Typography settings
- Custom CSS properties
- Dark mode support

---

## 🗂️ Documentation by Topic

### Authentication & Authorization
- **Setup**: [AWS_AMPLIFY_MIGRATION_GUIDE.md](./AWS_AMPLIFY_MIGRATION_GUIDE.md#authentication--authorization)
- **User Pools**: 3 separate Cognito pools (Nurses, Pharmacies, Admin)
- **Authorization Rules**: GraphQL resolver rules
- **Login Components**: 
  - `/components/nurse-login.tsx`
  - `/components/pharmacy-login.tsx`
  - `/components/admin-login.tsx`

### Payment Processing
- **Overview**: [EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md#2-stripe-integration)
- **Stripe Setup**: API keys, webhooks, connected accounts
- **Payment Flow**: Pharmacy → Platform → Nurse
- **Testing**: Test mode cards and accounts
- **Data Models**: `Payment`, `PaymentMethod` in `/types/data-models.ts`

### License Verification
- **Overview**: [EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md#1-nursys-integration)
- **NURSYS Setup**: API credentials, endpoint configuration
- **Verification Flow**: Upload → Verify → Update Status
- **Lambda Function**: `nursys-verify-license`
- **Data Models**: `Credential`, `NursysVerificationResponse`

### Background Checks
- **Overview**: [EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md#3-checkr-integration)
- **CHECKR Setup**: API key, webhook configuration
- **Check Flow**: Create Candidate → Order Check → Receive Results
- **Lambda Functions**: `checkr-order-background-check`, `checkr-webhook-handler`
- **Data Models**: `CheckrBackgroundCheckResponse`

### Payroll Integration
- **Overview**: [EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md#4-gusto-payroll-integration)
- **Gusto Setup**: Company setup, API token
- **Sync Flow**: Visit Complete → Stripe Capture → Gusto Sync
- **Lambda Functions**: `gusto-create-employee`, `gusto-sync-payment`
- **Data Models**: `Payment` with Gusto fields

### Notifications
- **Overview**: [EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md#5-sms-notifications-twilio-or-aws-sns)
- **SMS**: Twilio or AWS SNS
- **Email**: SendGrid or AWS SES
- **Lambda Function**: `send-notification`
- **Data Models**: `Notification`
- **Components**: `/components/notification-center.tsx`

### Messaging System
- **Component**: `/components/messaging-system.tsx`
- **Data Models**: `Message`, `Conversation` in `/types/data-models.ts`
- **Features**: Role-based messaging, real-time updates
- **DynamoDB**: Conversation and message storage

### Job Sorting
- **Component**: `/components/job-list-with-sort.tsx`
- **Documentation**: [/components/README_COMPONENTS.md](./components/README_COMPONENTS.md#job-sorting-feature)
- **Options**: Distance, Pay, Type, Date
- **Implementation**: `useMemo` hook with sort logic

---

## 🎨 Component Reference

### Nurse Portal Components
| Component | File | Documentation |
|-----------|------|---------------|
| Main Portal | `nurse-portal.tsx` | [README_COMPONENTS.md](./components/README_COMPONENTS.md) |
| Stats Header | `nurse-stats-header.tsx` | ✅ Exported |
| Job Card | `nurse-job-card.tsx` | ✅ Exported |
| Job List | `job-list-with-sort.tsx` | ✅ Exported with sorting |
| Onboarding | `nurse-onboarding.tsx` | Multi-step workflow |
| Edit Profile | `nurse-edit-profile.tsx` | Profile management |

### Pharmacy Portal Components
| Component | File | Documentation |
|-----------|------|---------------|
| Main Portal | `supplier-dashboard-fixed.tsx` | [README_COMPONENTS.md](./components/README_COMPONENTS.md) |
| Stats Header | `pharmacy-stats-header.tsx` | ✅ Exported |
| Job Card | `pharmacy-job-card.tsx` | ✅ Exported |
| Post Job | `post-new-job.tsx` | Visit creation |
| View Applications | `vendor-view-applications.tsx` | Application review |

### Admin Portal Components
| Component | File | Documentation |
|-----------|------|---------------|
| Main Portal | `admin-portal.tsx` | [README_COMPONENTS.md](./components/README_COMPONENTS.md) |
| Stats Cards | `admin-stats-cards.tsx` | ✅ Exported |

### Shared Components
| Component | File | Purpose |
|-----------|------|---------|
| Messaging | `messaging-system.tsx` | Cross-portal communication |
| Notifications | `notification-center.tsx` | Notification management |
| Landing Page | `landing-page.tsx` | Portal selection |

---

## 🚀 Deployment Checklist

### Pre-Production (Week 1-2)
- [ ] Review all documentation
- [ ] Complete Anima export
- [ ] Set up AWS account and IAM
- [ ] Create DynamoDB tables
- [ ] Set up Cognito user pools (3)
- [ ] Deploy Lambda functions
- [ ] Configure S3 buckets
- [ ] Set up CloudWatch logging

### External Services (Week 2-3)
- [ ] Create NURSYS account (production)
- [ ] Create Stripe account (live mode)
- [ ] Set up Stripe webhooks
- [ ] Create CHECKR account (production)
- [ ] Set up CHECKR webhooks
- [ ] Create Gusto account
- [ ] Configure SNS/SES for notifications
- [ ] Store all API keys in Secrets Manager

### Testing (Week 3)
- [ ] Unit tests for components
- [ ] Integration tests for APIs
- [ ] End-to-end workflow testing
- [ ] Load testing
- [ ] Security audit
- [ ] Penetration testing
- [ ] Mobile device testing

### Launch (Week 4)
- [ ] Deploy to production
- [ ] Monitor CloudWatch logs
- [ ] Set up alarms and alerts
- [ ] Create runbook for common issues
- [ ] Train support team
- [ ] Soft launch with pilot users
- [ ] Full public launch

---

## 📊 Architecture Diagrams

### Overall Architecture
See: [AWS_AMPLIFY_MIGRATION_GUIDE.md - Architecture](./AWS_AMPLIFY_MIGRATION_GUIDE.md#architecture)

### Data Flow
See: [ANIMA_EXPORT_GUIDE.md - Data Flow Architecture](./ANIMA_EXPORT_GUIDE.md#data-flow-architecture)

### Payment Flow
See: [EXTERNAL_API_INTEGRATION.md - Stripe Integration](./EXTERNAL_API_INTEGRATION.md#2-stripe-integration)

---

## 🔍 Finding Specific Information

### "How do I...?"

**...export components from Figma?**
→ [ANIMA_EXPORT_GUIDE.md - Anima Export Process](./ANIMA_EXPORT_GUIDE.md#anima-export-process)

**...set up AWS Amplify?**
→ [AWS_AMPLIFY_MIGRATION_GUIDE.md - AWS Amplify Setup](./AWS_AMPLIFY_MIGRATION_GUIDE.md#aws-amplify-setup)

**...integrate Stripe payments?**
→ [EXTERNAL_API_INTEGRATION.md - Stripe Integration](./EXTERNAL_API_INTEGRATION.md#2-stripe-integration)

**...verify nurse licenses?**
→ [EXTERNAL_API_INTEGRATION.md - NURSYS Integration](./EXTERNAL_API_INTEGRATION.md#1-nursys-integration)

**...run background checks?**
→ [EXTERNAL_API_INTEGRATION.md - CHECKR Integration](./EXTERNAL_API_INTEGRATION.md#3-checkr-integration)

**...set up payroll?**
→ [EXTERNAL_API_INTEGRATION.md - Gusto Integration](./EXTERNAL_API_INTEGRATION.md#4-gusto-payroll-integration)

**...send notifications?**
→ [EXTERNAL_API_INTEGRATION.md - SMS & Email](./EXTERNAL_API_INTEGRATION.md#5-sms-notifications-twilio-or-aws-sns)

**...understand the data models?**
→ [/types/data-models.ts](./types/data-models.ts)

**...use a specific component?**
→ [/components/README_COMPONENTS.md](./components/README_COMPONENTS.md)

**...configure the brand colors?**
→ [/styles/globals.css](./styles/globals.css)

---

## 🆘 Troubleshooting

### Common Issues

**Issue**: Can't export from Anima
**Solution**: [ANIMA_EXPORT_GUIDE.md - Troubleshooting](./ANIMA_EXPORT_GUIDE.md#troubleshooting)

**Issue**: AWS deployment fails
**Solution**: [AWS_AMPLIFY_MIGRATION_GUIDE.md - Deployment Checklist](./AWS_AMPLIFY_MIGRATION_GUIDE.md#deployment-checklist)

**Issue**: External API integration errors
**Solution**: [EXTERNAL_API_INTEGRATION.md - Error Handling](./EXTERNAL_API_INTEGRATION.md#error-handling-best-practices)

**Issue**: Component not rendering correctly
**Solution**: [/components/README_COMPONENTS.md](./components/README_COMPONENTS.md)

---

## 📞 Support Resources

### Documentation
- Main README: [README.md](./README.md)
- Anima Export: [ANIMA_EXPORT_GUIDE.md](./ANIMA_EXPORT_GUIDE.md)
- AWS Deployment: [AWS_AMPLIFY_MIGRATION_GUIDE.md](./AWS_AMPLIFY_MIGRATION_GUIDE.md)
- API Integration: [EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md)

### External Resources
- **Anima**: https://www.animaapp.com/docs
- **AWS Amplify**: https://docs.amplify.aws/
- **NURSYS**: https://www.nursys.com/
- **Stripe**: https://stripe.com/docs
- **CHECKR**: https://docs.checkr.com/
- **Gusto**: https://docs.gusto.com/

---

## 📝 Documentation Updates

**Last Updated**: October 4, 2025  
**Version**: 1.0  
**Status**: ✅ Complete and ready for export

### Recent Changes
- ✅ Added comprehensive external API integration guide
- ✅ Created modular component library
- ✅ Optimized for Anima export
- ✅ Added job sorting feature
- ✅ Complete AWS Amplify migration guide
- ✅ Full TypeScript data models
- ✅ Service interface definitions

---

## 🎯 Next Steps

1. **Review Documentation** - Familiarize yourself with all guides
2. **Export from Anima** - Follow [ANIMA_EXPORT_GUIDE.md](./ANIMA_EXPORT_GUIDE.md)
3. **Set Up AWS** - Follow [AWS_AMPLIFY_MIGRATION_GUIDE.md](./AWS_AMPLIFY_MIGRATION_GUIDE.md)
4. **Integrate APIs** - Follow [EXTERNAL_API_INTEGRATION.md](./EXTERNAL_API_INTEGRATION.md)
5. **Test Thoroughly** - Use test environments for all services
6. **Deploy to Production** - Follow deployment checklist
7. **Monitor and Iterate** - CloudWatch, user feedback, improvements

---

**Ready to build, export, and deploy!** 🚀
