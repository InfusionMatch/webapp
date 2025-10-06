/**
 * External API Service Interfaces
 * For integration with third-party services
 */

import { 
  NursysVerificationResponse, 
  CheckrBackgroundCheckResponse,
  Credential,
  Payment,
  NurseProfile
} from '../types/data-models';

// ============================================================================
// SMS/EMAIL NOTIFICATION SERVICE (e.g., Twilio, SendGrid, AWS SNS/SES)
// ============================================================================

export interface NotificationServiceConfig {
  smsProvider: 'twilio' | 'aws-sns' | 'other';
  emailProvider: 'sendgrid' | 'aws-ses' | 'other';
  smsApiKey?: string;
  emailApiKey?: string;
  fromPhoneNumber?: string;
  fromEmailAddress?: string;
}

export interface SMSPayload {
  to: string;
  message: string;
  type: 'visit_reminder' | 'confirmation' | 'alert' | 'verification' | 'other';
}

export interface EmailPayload {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
  attachments?: {
    filename: string;
    content: string;
    contentType: string;
  }[];
}

export interface NotificationService {
  /**
   * Send SMS message
   */
  sendSMS(payload: SMSPayload): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }>;

  /**
   * Send email
   */
  sendEmail(payload: EmailPayload): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }>;

  /**
   * Send visit reminder (day before)
   */
  sendVisitReminder(
    nursePhone: string,
    nurseEmail: string,
    visitDetails: {
      patientName: string;
      date: string;
      time: string;
      address: string;
    }
  ): Promise<{
    smsSent: boolean;
    emailSent: boolean;
  }>;

  /**
   * Send patient confirmation reminder
   */
  sendConfirmationReminder(
    nursePhone: string,
    patientPhone: string,
    visitDate: string
  ): Promise<boolean>;
}

// ============================================================================
// NURSYS LICENSE VERIFICATION SERVICE
// ============================================================================

export interface NursysServiceConfig {
  apiKey: string;
  apiUrl: string;
  environment: 'production' | 'sandbox';
}

export interface NursysVerificationRequest {
  firstName: string;
  lastName: string;
  licenseNumber: string;
  state: string;
  dateOfBirth?: string; // Optional, for better matching
}

export interface NursysService {
  /**
   * Verify nurse license
   */
  verifyLicense(
    request: NursysVerificationRequest
  ): Promise<NursysVerificationResponse>;

  /**
   * Batch verify licenses (for bulk onboarding)
   */
  batchVerifyLicenses(
    requests: NursysVerificationRequest[]
  ): Promise<NursysVerificationResponse[]>;

  /**
   * Check license expiry and status
   */
  checkLicenseStatus(
    licenseNumber: string,
    state: string
  ): Promise<{
    isActive: boolean;
    expiryDate: string;
    status: string;
  }>;

  /**
   * Auto-verify credentials in database
   */
  autoVerifyCredential(
    nurseId: string,
    credentialId: string
  ): Promise<Credential>;
}

// ============================================================================
// STRIPE PAYMENT SERVICE
// ============================================================================

export interface StripeServiceConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
  environment: 'production' | 'test';
  platformFeePercentage: number; // e.g., 0.15 for 15%
}

export interface CreatePaymentIntentRequest {
  amount: number; // in cents
  pharmacyId: string;
  visitId: string;
  description: string;
  metadata?: Record<string, string>;
}

export interface CreateTransferRequest {
  amount: number; // in cents
  destination: string; // Stripe account ID
  transferGroup?: string;
  metadata?: Record<string, string>;
}

export interface StripeService {
  /**
   * Create payment intent for pharmacy to pay for visit
   */
  createPaymentIntent(
    request: CreatePaymentIntentRequest
  ): Promise<{
    clientSecret: string;
    paymentIntentId: string;
  }>;

  /**
   * Capture payment after visit completion
   */
  capturePayment(
    paymentIntentId: string
  ): Promise<{
    success: boolean;
    captured: boolean;
    amount: number;
  }>;

  /**
   * Transfer payment to nurse's Stripe account
   */
  transferToNurse(
    request: CreateTransferRequest
  ): Promise<{
    transferId: string;
    amount: number;
    destination: string;
  }>;

  /**
   * Create Connected Account for nurse
   */
  createConnectedAccount(
    nurseProfile: NurseProfile
  ): Promise<{
    accountId: string;
    onboardingUrl: string;
  }>;

  /**
   * Get Connected Account status
   */
  getAccountStatus(
    accountId: string
  ): Promise<{
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
  }>;

  /**
   * Create customer for pharmacy
   */
  createCustomer(
    email: string,
    name: string,
    metadata?: Record<string, string>
  ): Promise<{
    customerId: string;
  }>;

  /**
   * Attach payment method to customer
   */
  attachPaymentMethod(
    customerId: string,
    paymentMethodId: string
  ): Promise<boolean>;

  /**
   * Refund payment
   */
  refundPayment(
    paymentIntentId: string,
    amount?: number,
    reason?: string
  ): Promise<{
    refundId: string;
    amount: number;
    status: string;
  }>;

  /**
   * Handle webhook events
   */
  handleWebhook(
    rawBody: string,
    signature: string
  ): Promise<{
    type: string;
    data: any;
  }>;
}

// ============================================================================
// CHECKR BACKGROUND CHECK SERVICE
// ============================================================================

export interface CheckrServiceConfig {
  apiKey: string;
  environment: 'production' | 'sandbox';
  webhookUrl?: string;
}

export interface CreateBackgroundCheckRequest {
  candidateId?: string; // If candidate already exists
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string; // YYYY-MM-DD
  ssn: string;
  zipCode: string;
  package: 'basic' | 'standard' | 'premium'; // Different screening levels
}

export interface CheckrService {
  /**
   * Create candidate
   */
  createCandidate(
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    dateOfBirth: string,
    ssn: string,
    zipCode: string
  ): Promise<{
    candidateId: string;
  }>;

  /**
   * Order background check
   */
  orderBackgroundCheck(
    request: CreateBackgroundCheckRequest
  ): Promise<CheckrBackgroundCheckResponse>;

  /**
   * Get background check status
   */
  getCheckStatus(
    checkId: string
  ): Promise<CheckrBackgroundCheckResponse>;

  /**
   * Get background check report
   */
  getReport(
    reportId: string
  ): Promise<{
    status: string;
    completedAt?: string;
    result: 'clear' | 'consider' | 'suspended';
    reportUrl: string;
    records: any[];
  }>;

  /**
   * Handle webhook for check completion
   */
  handleWebhook(
    payload: any,
    signature: string
  ): Promise<{
    checkId: string;
    status: string;
    result?: string;
  }>;

  /**
   * Update nurse credential status based on Checkr result
   */
  updateNurseBackgroundCheck(
    nurseId: string,
    checkResult: CheckrBackgroundCheckResponse
  ): Promise<boolean>;
}

// ============================================================================
// GUSTO PAYROLL SERVICE
// ============================================================================

export interface GustoServiceConfig {
  apiToken: string;
  environment: 'production' | 'sandbox';
  companyId?: string; // Platform's Gusto company ID
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  ssn: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface CreatePaymentRequest {
  employeeId: string;
  amount: number;
  paymentDate: string;
  workPeriod: {
    startDate: string;
    endDate: string;
  };
  description: string;
  visitId?: string;
}

export interface GustoService {
  /**
   * Create employee (nurse) in Gusto
   */
  createEmployee(
    request: CreateEmployeeRequest
  ): Promise<{
    employeeId: string;
    gustoId: string;
  }>;

  /**
   * Create off-cycle payment for completed visit
   */
  createOffCyclePayment(
    request: CreatePaymentRequest
  ): Promise<{
    paymentId: string;
    amount: number;
    status: string;
  }>;

  /**
   * Get employee by ID
   */
  getEmployee(
    employeeId: string
  ): Promise<{
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    status: string;
  }>;

  /**
   * Update employee information
   */
  updateEmployee(
    employeeId: string,
    updates: Partial<CreateEmployeeRequest>
  ): Promise<boolean>;

  /**
   * Get payment history for nurse
   */
  getPaymentHistory(
    employeeId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Payment[]>;

  /**
   * Sync Stripe payments to Gusto
   */
  syncStripePayment(
    stripePaymentId: string,
    nurseId: string,
    amount: number
  ): Promise<{
    gustoPaymentId: string;
    synced: boolean;
  }>;

  /**
   * Get tax documents for nurse
   */
  getTaxDocuments(
    employeeId: string,
    year: number
  ): Promise<{
    w2Url?: string;
    form1099Url?: string;
  }>;
}

// ============================================================================
// GEOCODING SERVICE (for distance calculation)
// ============================================================================

export interface GeocodingService {
  /**
   * Get coordinates from address
   */
  geocodeAddress(
    address: string
  ): Promise<{
    latitude: number;
    longitude: number;
  }>;

  /**
   * Calculate distance between two points
   */
  calculateDistance(
    from: { latitude: number; longitude: number },
    to: { latitude: number; longitude: number }
  ): Promise<{
    distance: number; // in miles
    duration: number; // in minutes
  }>;

  /**
   * Get formatted address
   */
  reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<{
    formattedAddress: string;
    city: string;
    state: string;
    zipCode: string;
  }>;
}

// ============================================================================
// SERVICE FACTORY
// ============================================================================

export interface ServiceFactory {
  notificationService: NotificationService;
  nursysService: NursysService;
  stripeService: StripeService;
  checkrService: CheckrService;
  gustoService: GustoService;
  geocodingService: GeocodingService;
}

/**
 * Initialize all services with configuration
 */
export function createServices(config: {
  notification: NotificationServiceConfig;
  nursys: NursysServiceConfig;
  stripe: StripeServiceConfig;
  checkr: CheckrServiceConfig;
  gusto: GustoServiceConfig;
}): ServiceFactory {
  // This would be implemented to return actual service instances
  // For now, return placeholder
  throw new Error('Service factory not implemented - use AWS Lambda functions');
}
