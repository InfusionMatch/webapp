import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Building2, Lock, ArrowLeft, AlertCircle, Mail } from "lucide-react";
import logo from "figma:asset/e517e42b1d1ec299bfb1df70699dd4198ba56b80.png";

interface PharmacyLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export function PharmacyLogin({ onLogin, onBack }: PharmacyLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple validation for demo
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // For demo purposes, accept any credentials
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-brand-gradient-3)] to-[var(--color-brand-gradient-4)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        {/* Login Card */}
        <Card className="shadow-2xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex justify-center">
              <img src={logo} alt="NorthPeak Care" className="h-12" />
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl">Pharmacy Portal Login</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage your patient visits and IV therapy services
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-800 rounded-lg text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Organization Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="pharmacy@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm text-[var(--color-brand-gradient-4)] hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--color-brand-gradient-3)] to-[var(--color-brand-gradient-4)] text-white border-0 hover:from-[var(--color-brand-gradient-2)] hover:to-[var(--color-brand-gradient-3)]"
              >
                Sign In to Portal
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Need access for your organization?{' '}
                  <button
                    type="button"
                    className="text-[var(--color-brand-gradient-4)] hover:underline"
                  >
                    Contact us
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Footer */}
        <Card className="bg-white/90 backdrop-blur">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-muted-foreground">
              For demo purposes, any email and password will work
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
