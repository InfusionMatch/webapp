import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft } from 'lucide-react';
import { authService } from '../services/auth-service';
import { dataService } from '../services/data-service';

interface NurseLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function NurseLogin({ onLogin, onBack }: NurseLoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.signIn({ email, password });
      
      if (result.isSignedIn) {
        // Get user attributes
        const userAttrs = await authService.getUserAttributes();
        
        // Check if profile exists
        if (userAttrs) {
          const profile = await dataService.getNurseProfile(userAttrs.userId);
          
          if (!profile) {
            // Create profile if doesn't exist
            await dataService.createNurseProfile({
              userId: userAttrs.userId,
              email: userAttrs.email,
              firstName: firstName || 'Nurse',
              lastName: lastName || 'User',
              phoneNumber: phoneNumber || ''
            });
          }
        }
        
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.signUp({
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        userType: 'nurse'
      });

      if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setNeedsConfirmation(true);
      } else if (result.nextStep.signUpStep === 'DONE') {
        // Auto-signed in, create profile
        const userAttrs = await authService.getUserAttributes();
        if (userAttrs) {
          await dataService.createNurseProfile({
            userId: userAttrs.userId,
            email,
            firstName,
            lastName,
            phoneNumber
          });
        }
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.confirmSignUp(email, confirmationCode);
      
      // Sign in after confirmation
      await authService.signIn({ email, password });
      
      // Create profile
      const userAttrs = await authService.getUserAttributes();
      if (userAttrs) {
        await dataService.createNurseProfile({
          userId: userAttrs.userId,
          email,
          firstName,
          lastName,
          phoneNumber
        });
      }
      
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Failed to confirm sign up');
    } finally {
      setLoading(false);
    }
  };

  if (needsConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-gradient-4)] to-[var(--color-brand-gradient-5)] p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Confirm Your Email</CardTitle>
            <CardDescription>
              We sent a verification code to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConfirmSignUp} className="space-y-4">
              <div>
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                />
              </div>
              
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                  {error}
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Confirming...' : 'Confirm'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-brand-gradient-4)] to-[var(--color-brand-gradient-5)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="w-fit mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <CardTitle>{isSignUp ? 'Create Nurse Account' : 'Nurse Login'}</CardTitle>
          <CardDescription>
            {isSignUp ? 'Join NorthPeak Care as a nurse' : 'Sign in to your nurse account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    required
                  />
                </div>
              </>
            )}
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {isSignUp && (
                <p className="text-xs text-muted-foreground mt-1">
                  Min 12 characters, uppercase, lowercase, number, symbol
                </p>
              )}
            </div>
            
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </Button>
            
            <Button
              type="button"
              variant="link"
              className="w-full"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
            >
              {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}