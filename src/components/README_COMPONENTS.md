# NorthPeak Care Component Library

## Overview
This document describes the modular component architecture designed for easy export and integration with AWS low-code tools.

## Job Sorting Feature

### Location
- **Component**: `nurse-portal.tsx` (lines 220-236)
- **Modular Version**: `job-list-with-sort.tsx`

### Functionality
Nurses can sort available patient visits by:
1. **Distance** (Nearest First) - Default sorting
2. **Pay** (Highest First) - Sorts by totalPay descending
3. **Type** (A-Z) - Alphabetical by job title
4. **Date** (Earliest First) - Sorts by visit date ascending

### Implementation Details

#### State Management
```typescript
const [sortBy, setSortBy] = useState<'distance' | 'pay' | 'type' | 'date'>('distance');
```

#### Sorting Logic
```typescript
const sortedJobs = useMemo(() => {
  const jobsCopy = [...jobs];
  
  switch (sortBy) {
    case 'distance':
      return jobsCopy.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    case 'pay':
      return jobsCopy.sort((a, b) => b.totalPay - a.totalPay);
    case 'type':
      return jobsCopy.sort((a, b) => a.title.localeCompare(b.title));
    case 'date':
      return jobsCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    default:
      return jobsCopy;
  }
}, [sortBy]);
```

#### UI Component
Uses shadcn/ui `Select` component with clear labels:
- Distance (Nearest)
- Pay (Highest)
- Type (A-Z)
- Date (Earliest)

## Modular Components for Export

### 1. NurseJobCard
**File**: `nurse-job-card.tsx`

Single job card component with all job details.

**Props**:
```typescript
interface NurseJobCardProps {
  job: Job;
  onAcceptVisit: () => void;
  onViewDetails: () => void;
}
```

**Features**:
- Displays job title, patient code, location
- Shows pay information (hourly rate and total)
- Lists requirements as badges
- Includes accept and view details actions
- Responsive layout

**Usage**:
```tsx
<NurseJobCard 
  job={jobData}
  onAcceptVisit={() => handleAccept(jobData.id)}
  onViewDetails={() => handleViewDetails(jobData.id)}
/>
```

### 2. JobListWithSort
**File**: `job-list-with-sort.tsx`

Complete job list with integrated sorting.

**Props**:
```typescript
interface JobListWithSortProps {
  jobs: Job[];
  onJobClick: (jobId: number) => void;
}
```

**Features**:
- Sorting dropdown in header
- Displays list of jobs using NurseJobCard
- Empty state handling
- Memoized sorting for performance

**Usage**:
```tsx
<JobListWithSort 
  jobs={availableJobs}
  onJobClick={(jobId) => navigateToJobDetail(jobId)}
/>
```

### 3. NurseStatsHeader
**File**: `nurse-stats-header.tsx`

Profile header with stats and onboarding progress.

**Props**:
```typescript
interface NurseStatsHeaderProps {
  stats: NurseStats;
  onboardingProgress?: OnboardingProgress;
  onEditProfile?: () => void;
}
```

**Features**:
- Avatar with fallback initials
- Stats display (rating, visits, earnings)
- Optional onboarding progress bar
- Edit profile action

**Usage**:
```tsx
<NurseStatsHeader 
  stats={nurseStats}
  onboardingProgress={progress}
  onEditProfile={() => navigate('/edit-profile')}
/>
```

## Data Interfaces

### Job
```typescript
interface Job {
  id: number;
  title: string;                    // e.g., "IV Infusion - Remicade"
  patientCode: string;              // e.g., "Patient R-2847"
  location: string;                 // e.g., "Downtown Area"
  date: string;                     // ISO date format
  timeWindow: string;               // e.g., "Flexible 9:00 AM - 3:00 PM"
  duration: string;                 // e.g., "2-3 hours"
  hourlyRate: number;               // e.g., 55
  totalPay: number;                 // e.g., 165
  medication: string;               // e.g., "Infliximab (Remicade) 400mg"
  requirements: string[];           // e.g., ["IV Therapy Certified"]
  distance: string;                 // e.g., "2.3 miles"
}
```

### NurseStats
```typescript
interface NurseStats {
  name: string;                     // e.g., "Jane Doe"
  title: string;                    // e.g., "Registered Nurse • IV Therapy Specialist"
  rating: number;                   // e.g., 4.9
  visitsCompleted: number;          // e.g., 143
  monthlyEarnings: number;          // e.g., 8750
  avatarUrl?: string;               // Optional profile picture URL
}
```

### OnboardingProgress
```typescript
interface OnboardingProgress {
  completedTasks: number;           // e.g., 6
  totalTasks: number;               // e.g., 9
  readyForFirstJob: boolean;        // e.g., false
}
```

## AWS Integration Guidelines

### DynamoDB Schema

#### Jobs Table
```
PK: JOB#${jobId}
SK: METADATA
attributes: {
  title, patientCode, location, date, timeWindow,
  duration, hourlyRate, totalPay, medication,
  requirements[], distance, status, pharmacyId
}
```

#### Nurses Table
```
PK: NURSE#${nurseId}
SK: PROFILE
attributes: {
  name, email, title, rating, visitsCompleted,
  monthlyEarnings, avatarUrl, credentials[]
}
```

### AppSync Queries

#### Get Available Jobs
```graphql
query GetAvailableJobs($nurseId: ID!) {
  listJobs(
    filter: {
      status: { eq: "AVAILABLE" }
    }
  ) {
    items {
      id
      title
      patientCode
      location
      date
      timeWindow
      duration
      hourlyRate
      totalPay
      medication
      requirements
      distance
    }
  }
}
```

#### Get Nurse Profile
```graphql
query GetNurseProfile($nurseId: ID!) {
  getNurse(id: $nurseId) {
    id
    name
    title
    rating
    visitsCompleted
    monthlyEarnings
    avatarUrl
  }
}
```

### Cognito Setup

**User Pools**:
- Nurses Pool: Email/password authentication
- Pharmacies Pool: Email/password authentication  
- Admin Pool: Email/password with MFA

**User Attributes**:
- `custom:userType`: "nurse" | "pharmacy" | "admin"
- `custom:profileId`: Reference to DynamoDB profile
- `email_verified`: Boolean
- `phone_number_verified`: Boolean (for nurses)

## Styling Guidelines

### Brand Colors (CSS Variables)
```css
--color-brand-gradient-1: #231f20
--color-brand-gradient-2: #262262
--color-brand-gradient-3: #2b3990
--color-brand-gradient-4: #1c75bc
--color-brand-gradient-5: #27aae1
--color-brand-gradient-6: #0097b2
```

### Component Styling Patterns
- **Cards**: White background, border, rounded corners
- **Buttons**: Gradient background using brand colors
- **Badges**: Outline style for tags, solid for status
- **Spacing**: Consistent 4px grid (gap-4, p-4, etc.)
- **Typography**: Default sizes from globals.css, no manual font classes

## Performance Optimizations

### Memoization
- Job sorting uses `useMemo` to prevent unnecessary recalculations
- Only re-sorts when `sortBy` state or `jobs` array changes

### Code Splitting
Components are separate files for:
- Better tree-shaking
- Easier code splitting with lazy loading
- Independent testing and development

### Best Practices
1. Use functional components with hooks
2. Keep components under 300 lines
3. Extract reusable logic to custom hooks
4. Pass callbacks via props (avoid inline functions in JSX)
5. Use TypeScript for type safety

## Testing Recommendations

### Unit Tests
```typescript
describe('Job Sorting', () => {
  it('sorts by distance correctly', () => {
    // Test distance sorting
  });
  
  it('sorts by pay correctly', () => {
    // Test pay sorting
  });
});
```

### Integration Tests
- Test job list rendering
- Test sort dropdown interaction
- Test job card click handlers
- Test empty state display

## Deployment Notes

### Environment Variables
```env
VITE_AWS_REGION=us-east-1
VITE_COGNITO_USER_POOL_ID=xxx
VITE_COGNITO_CLIENT_ID=xxx
VITE_APPSYNC_ENDPOINT=xxx
VITE_APPSYNC_API_KEY=xxx
```

### Build for Production
```bash
npm run build
```

### Deploy to AWS Amplify
```bash
amplify init
amplify add hosting
amplify publish
```

## Future Enhancements

1. **Real-time Updates**: Use AppSync subscriptions for new jobs
2. **Distance Calculation**: Use Google Maps API for accurate distances
3. **Favorites**: Allow nurses to save favorite job types
4. **Filters**: Add filtering by location, pay range, date range
5. **Search**: Full-text search across job titles and descriptions
6. **Notifications**: Push notifications for new jobs matching preferences
