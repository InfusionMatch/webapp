import { signUp, signIn, signOut, confirmSignUp, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  userType: 'nurse' | 'admin';
}

export interface SignInParams {
  email: string;
  password: string;
}

export const authService = {
  /**
   * Sign up a new user
   */
  async signUp({ email, password, firstName, lastName, phoneNumber, userType }: SignUpParams) {
    try {
      const { userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            phone_number: phoneNumber,
            'custom:userType': userType,
            given_name: firstName,
            family_name: lastName
          },
          autoSignIn: true
        }
      });

      return { userId, nextStep, success: true };
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  },

  /**
   * Confirm sign up with verification code
   */
  async confirmSignUp(email: string, code: string) {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code
      });

      return { isSignUpComplete, nextStep, success: true };
    } catch (error) {
      console.error('Error confirming sign up:', error);
      throw error;
    }
  },

  /**
   * Sign in
   */
  async signIn({ email, password }: SignInParams) {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: email,
        password
      });

      return { isSignedIn, nextStep, success: true };
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  },

  /**
   * Sign out
   */
  async signOut() {
    try {
      await signOut();
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    try {
      const user = await getCurrentUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Get user attributes including custom attributes
   */
  async getUserAttributes() {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      
      if (idToken) {
        return {
          userId: idToken.payload.sub as string,
          email: idToken.payload.email as string,
          userType: idToken.payload['custom:userType'] as string,
          profileId: idToken.payload['custom:profileId'] as string,
          emailVerified: idToken.payload.email_verified as boolean
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting user attributes:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated() {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }
};