import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // ============================================================================
  // USER PROFILES
  // ============================================================================
  
  NurseProfile: a
    .model({
      userId: a.id().required(),
      email: a.email().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      phoneNumber: a.phone().required(),
      
      // Professional info
      licenseNumber: a.string(),
      licenseState: a.string(),
      licenseExpiry: a.date(),
      specialties: a.string().array(),
      certifications: a.string().array(),
      
      // Profile details
      bio: a.string(),
      avatarUrl: a.string(),
      hourlyRate: a.float(),
      
      // Address (for distance calculations)
      street: a.string(),
      city: a.string(),
      state: a.string(),
      zipCode: a.string(),
      latitude: a.float(),
      longitude: a.float(),
      
      // Stats
      rating: a.float().default(0),
      totalVisits: a.integer().default(0),
      completedVisits: a.integer().default(0),
      monthlyEarnings: a.float().default(0),
      lifetimeEarnings: a.float().default(0),
      
      // Verification status
      backgroundCheckStatus: a.enum(['pending', 'approved', 'rejected', 'expired']),
      backgroundCheckDate: a.date(),
      backgroundCheckExpiry: a.date(),
      nursysVerified: a.boolean().default(false),
      nursysVerifiedDate: a.date(),
      
      // Onboarding
      onboardingComplete: a.boolean().default(false),
      onboardingStep: a.integer().default(0),
      
      // Payment info
      stripeAccountId: a.string(),
      gustoEmployeeId: a.string(),
      
      // Availability
      isAvailable: a.boolean().default(true),
      availabilityNotes: a.string(),
      
      // Account status
      accountStatus: a.enum(['active', 'suspended', 'deactivated']),
      suspensionReason: a.string(),
      
      // Timestamps
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      lastLoginAt: a.datetime()
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read'])
    ]),

  AdminProfile: a
    .model({
      userId: a.id().required(),
      email: a.email().required(),
      firstName: a.string().required(),
      lastName: a.string().required(),
      role: a.enum(['superadmin', 'support', 'compliance', 'finance']),
      permissions: a.string().array(),
      
      // Activity tracking
      lastLoginAt: a.datetime(),
      
      createdAt: a.datetime(),
      updatedAt: a.datetime()
    })
    .authorization((allow) => [
      allow.authenticated().to(['read'])
    ]),

  // ============================================================================
  // VISITS/JOBS (Posted by Platform/Admins)
  // ============================================================================
  
  Visit: a
    .model({
      postedBy: a.id().required(),
      assignedNurseId: a.id(),
      
      // Visit details
      title: a.string().required(),
      description: a.string(),
      medicationType: a.enum([
        'remicade',
        'humira',
        'stelara',
        'entyvio',
        'orencia',
        'simponi',
        'actemra',
        'hydration',
        'iron_infusion',
        'antibiotic',
        'chemotherapy',
        'picc_care',
        'wound_care',
        'lab_draw',
        'other'
      ]),
      medication: a.string(),
      dosage: a.string(),
      
      // Client/Patient info
      clientName: a.string().required(),
      clientPhone: a.string(),
      clientEmail: a.string(),
      patientCode: a.string().required(),
      patientName: a.string(),
      patientPhone: a.string(),
      patientAge: a.integer(),
      patientNotes: a.string(),
      
      // Location
      address: a.string().required(),
      city: a.string().required(),
      state: a.string().required(),
      zipCode: a.string().required(),
      latitude: a.float(),
      longitude: a.float(),
      locationNotes: a.string(),
      
      // Scheduling
      visitDate: a.date().required(),
      startTime: a.time().required(),
      endTime: a.time().required(),
      duration: a.integer(),
      flexibleTiming: a.boolean().default(false),
      timeWindow: a.string(),
      
      // Payment
      hourlyRate: a.float().required(),
      totalPay: a.float().required(),
      platformFee: a.float(),
      nurseEarnings: a.float(),
      
      // Requirements
      requiredCertifications: a.string().array(),
      specialInstructions: a.string(),
      suppliesProvided: a.string().array(),
      suppliesNurseProvides: a.string().array(),
      
      // Status (no default on enum)
      status: a.enum([
        'draft',
        'posted',
        'assigned',
        'accepted',
        'confirmed',
        'in_progress',
        'completed',
        'cancelled',
        'disputed',
        'no_show'
      ]),
      
      // Confirmation
      confirmationCallMade: a.boolean().default(false),
      confirmationCallDate: a.datetime(),
      confirmationNotes: a.string(),
      
      // Visit outcome
      visitStartedAt: a.datetime(),
      visitCompletedAt: a.datetime(),
      visitNotes: a.string(),
      visitDocuments: a.string().array(),
      
      // Ratings & Reviews
      nurseRating: a.integer(),
      nurseReview: a.string(),
      clientRating: a.integer(),
      clientReview: a.string(),
      platformRating: a.integer(),
      platformReview: a.string(),
      
      // Cancellation
      cancelledBy: a.id(),
      cancellationReason: a.string(),
      cancelledAt: a.datetime(),
      cancellationFee: a.float(),
      
      // Timestamps
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      publishedAt: a.datetime()
    })
    .authorization((allow) => [
      allow.authenticated().to(['read']),
      allow.owner()
    ]),

  // ============================================================================
  // APPLICATIONS
  // ============================================================================
  
  Application: a
    .model({
      visitId: a.id().required(),
      nurseId: a.id().required(),
      
      // Application details
      coverLetter: a.string(),
      availabilityConfirmed: a.boolean().default(true),
      
      // Status (no default on enum)
      status: a.enum([
        'pending',
        'accepted',
        'rejected',
        'withdrawn',
        'expired'
      ]),
      
      // Response
      adminResponse: a.string(),
      respondedBy: a.id(),
      respondedAt: a.datetime(),
      
      // Timestamps
      createdAt: a.datetime(),
      updatedAt: a.datetime()
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read', 'create'])
    ]),

  // ============================================================================
  // CREDENTIALS
  // ============================================================================
  
  Credential: a
    .model({
      nurseId: a.id().required(),
      
      type: a.enum([
        'rn_license',
        'lpn_license',
        'iv_certification',
        'cpr_certification',
        'bls_certification',
        'acls_certification',
        'pals_certification',
        'oncology_certification',
        'insurance_certificate',
        'background_check',
        'tb_test',
        'hepatitis_vaccine',
        'other'
      ]),
      
      title: a.string().required(),
      issuingOrganization: a.string(),
      credentialNumber: a.string(),
      issueDate: a.date(),
      expiryDate: a.date(),
      
      // Verification (no default on enum)
      verificationStatus: a.enum([
        'pending',
        'verified',
        'rejected',
        'expired'
      ]),
      verifiedBy: a.string(),
      verifiedAt: a.datetime(),
      verificationNotes: a.string(),
      
      // Document
      documentUrl: a.string(),
      
      // Auto-verification
      autoVerified: a.boolean().default(false),
      nursysData: a.json(),
      
      // Expiry notifications
      expiryNotificationSent: a.boolean().default(false),
      
      createdAt: a.datetime(),
      updatedAt: a.datetime()
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read'])
    ]),

  // ============================================================================
  // MESSAGING
  // ============================================================================
  
  Conversation: a
    .model({
      participantIds: a.id().array().required(),
      participantNames: a.string().array(),
      visitId: a.id(),
      
      subject: a.string(),
      lastMessageAt: a.datetime(),
      lastMessagePreview: a.string(),
      lastMessageSenderId: a.id(),
      
      unreadCounts: a.json(),
      
      createdAt: a.datetime(),
      updatedAt: a.datetime()
    })
    .authorization((allow) => [
      allow.authenticated()
    ]),

  Message: a
    .model({
      conversationId: a.id().required(),
      senderId: a.id().required(),
      senderName: a.string(),
      senderType: a.enum(['nurse', 'admin', 'system']),
      
      content: a.string().required(),
      messageType: a.enum(['text', 'document', 'system']),
      
      // Attachments
      attachments: a.string().array(),
      attachmentNames: a.string().array(),
      
      // Read status
      readBy: a.id().array(),
      readAt: a.json(),
      
      createdAt: a.datetime()
    })
    .authorization((allow) => [
      allow.authenticated()
    ]),

  // ============================================================================
  // NOTIFICATIONS
  // ============================================================================
  
  Notification: a
    .model({
      userId: a.id().required(),
      
      type: a.enum([
        'new_visit',
        'application_received',
        'application_accepted',
        'application_rejected',
        'visit_assigned',
        'visit_reminder',
        'visit_confirmed',
        'visit_cancelled',
        'visit_started',
        'visit_completed',
        'payment_processed',
        'message_received',
        'credential_expiring',
        'credential_expired',
        'account_suspended',
        'system_alert',
        'platform_update'
      ]),
      
      title: a.string().required(),
      message: a.string().required(),
      
      // Related entities
      visitId: a.id(),
      applicationId: a.id(),
      conversationId: a.id(),
      credentialId: a.id(),
      
      // Priority (no default on enum)
      priority: a.enum(['low', 'normal', 'high', 'urgent']),
      
      // Status
      isRead: a.boolean().default(false),
      readAt: a.datetime(),
      
      // Delivery
      emailSent: a.boolean().default(false),
      smsSent: a.boolean().default(false),
      emailSentAt: a.datetime(),
      smsSentAt: a.datetime(),
      
      // Actions
      actionUrl: a.string(),
      actionLabel: a.string(),
      
      createdAt: a.datetime()
    })
    .authorization((allow) => [
      allow.owner()
    ]),

  // ============================================================================
  // PAYMENTS
  // ============================================================================
  
  Payment: a
    .model({
      visitId: a.id().required(),
      nurseId: a.id().required(),
      
      // Amounts
      totalAmount: a.float().required(),
      nurseAmount: a.float().required(),
      platformFee: a.float().required(),
      
      // Payment method (no default on enum)
      paymentMethod: a.enum(['stripe', 'direct_deposit', 'check', 'other']),
      
      // Stripe
      stripePaymentIntentId: a.string(),
      stripeTransferId: a.string(),
      stripeChargeId: a.string(),
      
      // Gusto
      gustoPaymentId: a.string(),
      
      // Status (no default on enum)
      status: a.enum([
        'pending',
        'processing',
        'authorized',
        'captured',
        'transferred',
        'completed',
        'refunded',
        'failed',
        'disputed'
      ]),
      
      // Failure details
      failureReason: a.string(),
      failureCode: a.string(),
      
      // Timestamps
      authorizedAt: a.datetime(),
      capturedAt: a.datetime(),
      transferredAt: a.datetime(),
      completedAt: a.datetime(),
      refundedAt: a.datetime(),
      
      // Tax reporting
      taxYear: a.integer(),
      reported1099: a.boolean().default(false),
      
      createdAt: a.datetime(),
      updatedAt: a.datetime()
    })
    .authorization((allow) => [
      allow.authenticated().to(['read'])
    ]),

  // ============================================================================
  // ANALYTICS
  // ============================================================================
  
  PlatformAnalytics: a
    .model({
      date: a.date().required(),
      
      // User metrics
      totalNurses: a.integer().default(0),
      activeNurses: a.integer().default(0),
      newNurses: a.integer().default(0),
      verifiedNurses: a.integer().default(0),
      
      // Visit metrics
      visitsPosted: a.integer().default(0),
      visitsCompleted: a.integer().default(0),
      visitsCancelled: a.integer().default(0),
      visitsNoShow: a.integer().default(0),
      averageVisitDuration: a.float().default(0),
      
      // Application metrics
      totalApplications: a.integer().default(0),
      applicationAcceptanceRate: a.float().default(0),
      
      // Financial metrics
      totalRevenue: a.float().default(0),
      platformFees: a.float().default(0),
      nursePayouts: a.float().default(0),
      
      // Performance
      averageNurseRating: a.float().default(0),
      averageClientRating: a.float().default(0),
      completionRate: a.float().default(0),
      onTimeRate: a.float().default(0),
      
      // Popular medication types
      topMedicationTypes: a.json(),
      
      createdAt: a.datetime()
    })
    .authorization((allow) => [
      allow.authenticated().to(['read'])
    ]),

  // ============================================================================
  // AUDIT LOG
  // ============================================================================
  
  AuditLog: a
    .model({
      adminId: a.id().required(),
      action: a.string().required(),
      entityType: a.string(),
      entityId: a.id(),
      
      changesBefore: a.json(),
      changesAfter: a.json(),
      
      ipAddress: a.string(),
      userAgent: a.string(),
      
      createdAt: a.datetime()
    })
    .authorization((allow) => [
      allow.authenticated()
    ])
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  }
});
