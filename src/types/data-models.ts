/**
 * Data Models for NorthPeak Care Platform
 * Optimized for AWS Amplify Migration
 */

// ============================================================================
// USER MODELS
// ============================================================================

export interface User {
  id: string;
  email: string;
  phoneNumber?: string;
  userType: 'nurse' | 'pharmacy' | 'admin';
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLogin?: string;
}

export interface NurseProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string;
  
  // Professional Info
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: string;
  licenseVerified: boolean; // NURSYS verification
  
  // Specializations
  specializations: string[];
  yearsOfExperience: number;
  
  // Stats
  rating: number;
  totalVisits: number;
  completedVisits: number;
  cancelledVisits: number;
  monthlyEarnings: number;
  lifetimeEarnings: number;
  
  // Onboarding
  onboardingCompleted: boolean;
  onboardingProgress: {
    completedTasks: number;
    totalTasks: number;
  };
  
  // Stripe
  stripeAccountId?: string;
  stripeOnboardingCompleted: boolean;
  
  // Background Check (CHECKR)
  backgroundCheckStatus: 'pending' | 'clear' | 'consider' | 'suspended';
  backgroundCheckDate?: string;
  backgroundCheckId?: string;
  
  // Status
  availabilityStatus: 'available' | 'busy' | 'offline';
  isActive: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface PharmacyProfile {
  id: string;
  userId: string;
  businessName: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  
  // Business Info
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  licenseNumber: string;
  taxId?: string;
  
  // Stats
  totalJobsPosted: number;
  activeJobs: number;
  completedJobs: number;
  totalSpent: number;
  averageRating: number;
  
  // Stripe
  stripeCustomerId?: string;
  
  // Gusto Payroll
  gustoCompanyId?: string;
  gustoIntegrated: boolean;
  
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'super_admin' | 'support' | 'finance' | 'operations';
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// JOB/VISIT MODELS
// ============================================================================

export interface Job {
  id: string;
  pharmacyId: string;
  
  // Job Details
  title: string;
  description: string;
  type: 'iv_infusion' | 'dressing_change' | 'central_line' | 'port_access' | 'hydration' | 'other';
  medication: string;
  
  // Patient Info (anonymized until accepted)
  patientCode: string; // e.g., "Patient R-2847"
  patientName?: string; // Only revealed after acceptance
  patientPhone?: string; // Only revealed after acceptance
  
  // Location
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number;
    longitude?: number;
  };
  distance?: string; // Calculated per nurse
  
  // Timing
  visitDate: string; // ISO date
  timeWindow: string; // e.g., "Flexible 9:00 AM - 3:00 PM"
  estimatedDuration: string; // e.g., "2-3 hours"
  
  // Payment
  hourlyRate: number;
  totalPay: number;
  
  // Requirements
  requirements: string[];
  certifications: string[];
  
  // Status
  status: 'draft' | 'posted' | 'assigned' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  
  // Assigned Nurse
  assignedNurseId?: string;
  applicantIds: string[];
  
  // Confirmation
  patientConfirmed: boolean;
  confirmationCallDate?: string;
  
  // Payment Status
  paymentStatus: 'pending' | 'authorized' | 'captured' | 'refunded';
  stripePaymentIntentId?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  nurseId: string;
  
  // Availability submitted by nurse
  availability: TimeSlot[];
  
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  appliedAt: string;
  respondedAt?: string;
}

export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface Visit {
  id: string;
  jobId: string;
  nurseId: string;
  pharmacyId: string;
  
  // Scheduling
  scheduledDate: string;
  scheduledTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  
  // Patient Info (revealed)
  patientName: string;
  patientPhone: string;
  patientAddress: string;
  
  // Status
  status: 'scheduled' | 'confirmed' | 'in_transit' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';
  
  // Confirmation
  confirmationCallCompleted: boolean;
  confirmationCallDate?: string;
  confirmationNotes?: string;
  
  // Documentation
  documentation?: {
    vitalSigns?: {
      bloodPressure?: string;
      heartRate?: number;
      temperature?: number;
      oxygenSaturation?: number;
    };
    medicationAdministered: boolean;
    medicationTime?: string;
    patientResponse?: string;
    adverseReactions?: string;
    complications?: string;
    nurseNotes?: string;
    photos?: string[];
    signature?: string;
  };
  
  // Payment
  paymentAmount: number;
  paymentStatus: 'pending' | 'processing' | 'paid' | 'failed';
  paidAt?: string;
  
  // Rating
  nurseRating?: number;
  nurseReview?: string;
  pharmacyRating?: number;
  pharmacyReview?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// CREDENTIAL MODELS
// ============================================================================

export interface Credential {
  id: string;
  nurseId: string;
  
  type: 'license' | 'certification' | 'background_check' | 'tb_test' | 'insurance' | 'other';
  name: string;
  
  // Document
  documentUrl?: string;
  
  // Verification
  status: 'pending' | 'verified' | 'expired' | 'rejected';
  verificationMethod?: 'nursys' | 'checkr' | 'manual' | 'other';
  verificationId?: string; // External service ID
  
  // Dates
  issueDate?: string;
  expiryDate?: string;
  verifiedDate?: string;
  
  // Notes
  notes?: string;
  rejectionReason?: string;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// MESSAGING MODELS
// ============================================================================

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: 'nurse' | 'pharmacy' | 'admin' | 'system';
  
  content: string;
  attachments?: string[];
  
  isRead: boolean;
  readAt?: string;
  
  createdAt: string;
}

export interface Conversation {
  id: string;
  participants: {
    id: string;
    type: 'nurse' | 'pharmacy' | 'admin';
    name: string;
  }[];
  
  relatedJobId?: string;
  relatedVisitId?: string;
  
  lastMessage?: string;
  lastMessageAt?: string;
  
  unreadCount: {
    [userId: string]: number;
  };
  
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// NOTIFICATION MODELS
// ============================================================================

export interface Notification {
  id: string;
  userId: string;
  
  type: 'job_posted' | 'application_received' | 'visit_confirmed' | 'visit_reminder' | 
        'payment_received' | 'credential_expiring' | 'message_received' | 'system' | 'other';
  
  title: string;
  message: string;
  
  // Related entities
  relatedJobId?: string;
  relatedVisitId?: string;
  relatedUserId?: string;
  
  // Actions
  actionUrl?: string;
  actionLabel?: string;
  
  // Status
  isRead: boolean;
  readAt?: string;
  
  // Delivery
  sentViaEmail: boolean;
  sentViaSMS: boolean;
  emailSentAt?: string;
  smsSentAt?: string;
  
  createdAt: string;
}

// ============================================================================
// PAYMENT MODELS
// ============================================================================

export interface Payment {
  id: string;
  
  // Parties
  fromPharmacyId: string;
  toNurseId: string;
  relatedVisitId: string;
  
  // Amount
  amount: number;
  platformFee: number;
  nurseAmount: number;
  
  // Stripe
  stripePaymentIntentId: string;
  stripeTransferId?: string;
  
  // Status
  status: 'pending' | 'authorized' | 'captured' | 'transferred' | 'refunded' | 'failed';
  
  // Dates
  authorizedAt?: string;
  capturedAt?: string;
  transferredAt?: string;
  
  // Gusto Integration
  gustoPaymentId?: string;
  gustoSynced: boolean;
  
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  
  type: 'card' | 'bank_account';
  
  // Stripe
  stripePaymentMethodId: string;
  
  // Display Info
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  
  isDefault: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// VERIFICATION MODELS (External Service Responses)
// ============================================================================

export interface NursysVerificationResponse {
  licenseNumber: string;
  firstName: string;
  lastName: string;
  licenseType: string;
  state: string;
  status: 'active' | 'inactive' | 'suspended' | 'expired';
  expiryDate: string;
  verified: boolean;
  verificationDate: string;
}

export interface CheckrBackgroundCheckResponse {
  id: string;
  candidateId: string;
  status: 'pending' | 'consider' | 'clear' | 'suspended';
  completedAt?: string;
  reportUrl?: string;
  adjudication?: 'engaged' | 'clear' | 'adverse_action';
}

// ============================================================================
// ANALYTICS MODELS
// ============================================================================

export interface PlatformAnalytics {
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  
  // Jobs
  jobsPosted: number;
  jobsCompleted: number;
  jobsCancelled: number;
  
  // Nurses
  activeNurses: number;
  newNurses: number;
  totalNurses: number;
  
  // Pharmacies
  activePharmacies: number;
  newPharmacies: number;
  totalPharmacies: number;
  
  // Visits
  totalVisits: number;
  completedVisits: number;
  cancelledVisits: number;
  noShows: number;
  
  // Revenue
  totalRevenue: number;
  platformFees: number;
  nursePayments: number;
  
  // Ratings
  averageNurseRating: number;
  averagePharmacyRating: number;
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export type UserRole = 'nurse' | 'pharmacy' | 'admin';
export type JobStatus = Job['status'];
export type VisitStatus = Visit['status'];
export type PaymentStatus = Payment['status'];
export type CredentialStatus = Credential['status'];
export type NotificationType = Notification['type'];
