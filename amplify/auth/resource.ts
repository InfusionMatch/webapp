import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject: 'Verify your NorthPeak Care account',
      verificationEmailBody: (createCode) => 
        `Welcome to NorthPeak Care! Your verification code is ${createCode()}`
    }
  },
  userAttributes: {
    email: {
      required: true,
      mutable: false  // HIPAA: Immutable for audit trail
    },
    phoneNumber: {
      required: true,
      mutable: true
    },
    // Custom attributes for user roles
    'custom:userType': {
      dataType: 'String',
      mutable: false  // 'nurse' or 'admin'
    },
    'custom:profileId': {
      dataType: 'String',
      mutable: false
    },
    'custom:onboardingComplete': {
      dataType: 'String',
      mutable: true
    }
  },
  // HIPAA: Enable MFA (optional for nurses, required for admins via policy)
  multifactor: {
    mode: 'OPTIONAL',
    totp: true,
    sms: true
  },
  accountRecovery: 'EMAIL_ONLY',
  // HIPAA: Strong password requirements (correct syntax for Gen 2)
  password: {
    minLength: 12,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true
  }
});
