import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Users, 
  Building2,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import logo from "figma:asset/e517e42b1d1ec299bfb1df70699dd4198ba56b80.png";

export function LandingPage({ onRoleSelect }: { onRoleSelect: (role: string) => void }) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-center">
            <img src={logo} alt="NorthPeak Care" className="h-12" />
          </div>
        </div>
      </header>

      {/* Portal Selection */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-3xl sm:text-4xl">Portal Access</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select your portal to access the NorthPeak Care platform
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Nurse Portal */}
            <Card className="relative overflow-hidden transition-all hover:shadow-xl cursor-pointer border-2 hover:border-[var(--color-brand-gradient-4)]" onClick={() => onRoleSelect('nurse')}>
              <CardHeader className="text-center space-y-4 pb-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand-gradient-4)] to-[var(--color-brand-gradient-5)]">
                  <Users className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">IV Therapy Nurses</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground">
                  Find flexible IV therapy opportunities and provide specialized patient care at home
                </p>
                <ul className="space-y-3 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    Browse patient visits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    Manage IV certifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    Higher pay rates ($48-65/hr)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    One-on-one patient care
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-[var(--color-brand-gradient-4)] to-[var(--color-brand-gradient-5)] text-white border-0 hover:from-[var(--color-brand-gradient-3)] hover:to-[var(--color-brand-gradient-4)]" size="lg">
                  Enter Nurse Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Pharmacy Portal */}
            <Card className="relative overflow-hidden transition-all hover:shadow-xl cursor-pointer border-2 hover:border-[var(--color-brand-gradient-3)]" onClick={() => onRoleSelect('supplier')}>
              <CardHeader className="text-center space-y-4 pb-4">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand-gradient-3)] to-[var(--color-brand-gradient-4)]">
                  <Building2 className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl">Pharmacies</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-muted-foreground">
                  Request IV therapy nurses for your patients and manage home-based medical care
                </p>
                <ul className="space-y-3 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    Request patient visits
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    Match with certified nurses
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    Visit progress monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    Clinical documentation
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-[var(--color-brand-gradient-3)] to-[var(--color-brand-gradient-4)] text-white border-0 hover:from-[var(--color-brand-gradient-2)] hover:to-[var(--color-brand-gradient-3)]" size="lg">
                  Enter Pharmacy Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Admin Login Button - Bottom Left */}
      <div className="fixed bottom-6 left-6">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onRoleSelect('admin')}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Admin Login
        </Button>
      </div>

      {/* Footer */}
      <footer className="border-t bg-white py-8 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4">
            <img src={logo} alt="NorthPeak Care" className="h-8 opacity-60" />
            <p className="text-sm text-muted-foreground text-center">
              © 2025 NorthPeak Care. Bringing IV therapy home to patients.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
