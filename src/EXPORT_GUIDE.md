# Export Guide for AWS Low-Code Tools

## Overview
This application is structured for easy export to AWS low-code tools like AWS Amplify Studio. The components are modular, self-contained, and use clear prop interfaces.

## Component Architecture

### Modular Components (Optimized for Export)

#### 1. Job Management Components
- **`nurse-job-card.tsx`** - Individual job card component
  - Props: `job`, `onAcceptVisit`, `onViewDetails`
  - Self-contained, reusable card for displaying job details
  
- **`job-list-with-sort.tsx`** - Job list with sorting functionality
  - Props: `jobs`, `onJobClick`
  - Includes sorting by distance, pay, type, and date
  - Can be used standalone or integrated

#### 2. Header Components
- **`nurse-stats-header.tsx`** - Nurse profile stats header
  - Props: `stats`, `onboardingProgress`, `onEditProfile`
  - Displays profile information and onboarding progress
  - Reusable across nurse portal pages

#### 3. Portal Components
- **`nurse-portal.tsx`** - Main nurse portal (uses modular components above)
- **`supplier-dashboard-fixed.tsx`** - Pharmacy/supplier portal
- **`admin-portal.tsx`** - Admin management portal

#### 4. Authentication Components
- **`nurse-login.tsx`** - Nurse authentication
- **`pharmacy-login.tsx`** - Pharmacy authentication
- **`admin-login.tsx`** - Admin authentication
- **`landing-page.tsx`** - Portal selection page

## Data Structures

### Job Interface
```typescript
interface Job {
  id: number;
  title: string;
  patientCode: string;
  location: string;
  date: string;
  timeWindow: string;
  duration: string;
  hourlyRate: number;
  totalPay: number;
  medication: string;
  requirements: string[];
  distance: string;
}
```

### Nurse Stats Interface
```typescript
interface NurseStats {
  name: string;
  title: string;
  rating: number;
  visitsCompleted: number;
  monthlyEarnings: number;
  avatarUrl?: string;
}
```

## Export Steps for AWS Amplify Studio

### 1. Component Export
Each component can be exported individually:
- Components use standard React patterns
- Props are clearly typed with TypeScript interfaces
- No complex global state management
- All data is passed via props

### 2. State Management
- Local state using `useState` for UI interactions
- No Redux or complex state libraries
- Easy to connect to AWS AppSync/DynamoDB

### 3. Styling
- Tailwind CSS v4 with custom design tokens
- Design tokens defined in `/styles/globals.css`
- Brand colors available as CSS variables
- Mobile-responsive by default

### 4. API Integration Points
To connect to AWS services:

#### DynamoDB Tables Needed:
- **Jobs** - Store available patient visits
- **Nurses** - Nurse profiles and credentials
- **Pharmacies** - Pharmacy/supplier information
- **Appointments** - Accepted visits and scheduling
- **Messages** - Messaging system data
- **Notifications** - Notification data

#### AppSync GraphQL Schema:
```graphql
type Job {
  id: ID!
  title: String!
  patientCode: String!
  location: String!
  date: AWSDate!
  timeWindow: String!
  duration: String!
  hourlyRate: Float!
  totalPay: Float!
  medication: String!
  requirements: [String!]!
  distance: String!
}

type Nurse {
  id: ID!
  name: String!
  email: String!
  title: String!
  rating: Float
  visitsCompleted: Int
  monthlyEarnings: Float
}
```

### 5. Authentication
- Currently uses simple navigation (demo mode)
- Replace with AWS Cognito for production:
  - User pools for nurses, pharmacies, admins
  - Separate user groups for role-based access
  - JWT tokens for API authentication

## Component Usage Examples

### Using Job List Component
```tsx
import { JobListWithSort } from './components/job-list-with-sort';

const jobs = [
  {
    id: 1,
    title: "IV Infusion - Remicade",
    // ... other job properties
  }
];

function MyPage() {
  const handleJobClick = (jobId: number) => {
    // Navigate to job detail
  };

  return (
    <JobListWithSort 
      jobs={jobs} 
      onJobClick={handleJobClick}
    />
  );
}
```

### Using Stats Header
```tsx
import { NurseStatsHeader } from './components/nurse-stats-header';

const stats = {
  name: "Jane Doe",
  title: "Registered Nurse • IV Therapy Specialist",
  rating: 4.9,
  visitsCompleted: 143,
  monthlyEarnings: 8750
};

function MyPage() {
  return (
    <NurseStatsHeader 
      stats={stats}
      onEditProfile={() => {/* navigate to profile */}}
    />
  );
}
```

## Best Practices for AWS Export

1. **Keep Components Pure**: Each component should work independently
2. **Use Prop Drilling**: Pass data through props rather than context
3. **Mock Data First**: Start with mock data, then replace with API calls
4. **Clear Interfaces**: Use TypeScript for all prop types
5. **Responsive Design**: All components are mobile-first
6. **Brand Consistency**: Use CSS variables for colors

## Next Steps for Production

1. Replace mock data with AWS AppSync queries
2. Implement Cognito authentication
3. Add error handling and loading states
4. Set up DynamoDB tables
5. Configure API endpoints
6. Add real-time subscriptions for messaging
7. Implement file upload to S3 for credentials
8. Add CloudWatch logging

## Contact
For questions about the component architecture or export process, refer to this guide and the inline documentation in each component file.
