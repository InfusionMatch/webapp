import { useState } from 'react';
import { LandingPage } from './components/landing-page';
import { SupplierDashboardFixed as SupplierDashboard } from './components/supplier-dashboard-fixed';
import { NursePortal } from './components/nurse-portal';
import { AdminPortal } from './components/admin-portal';
import { NurseJobDetail } from './components/nurse-job-detail';
import { NurseActiveJob } from './components/nurse-active-job';
import { SupplierJobDetail } from './components/supplier-job-detail';
import { NurseOnboarding } from './components/nurse-onboarding';
import { NurseVisitAcceptance } from './components/nurse-visit-acceptance';
import { NurseEditProfile } from './components/nurse-edit-profile';
import { VendorViewApplications } from './components/vendor-view-applications';
import { MessagingSystem } from './components/messaging-system';
import { NotificationCenter } from './components/notification-center';
import { NurseLogin } from './components/nurse-login';
import { PharmacyLogin } from './components/pharmacy-login';
import { AdminLogin } from './components/admin-login';
import { Button } from './components/ui/button';
import { ArrowLeft } from 'lucide-react';

type ViewType = 'landing' | 'nurse-login' | 'pharmacy-login' | 'admin-login' | 'nurse' | 'supplier' | 'admin' | 'nurse-job-detail' | 'nurse-visit-acceptance' | 'nurse-active-job' | 'supplier-job-detail' | 'nurse-onboarding' | 'nurse-edit-profile' | 'vendor-view-applications';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [visitAccepted, setVisitAccepted] = useState(false);

  const handleRoleSelect = (role: string) => {
    // Show login screen for each portal
    if (role === 'nurse') {
      setCurrentView('nurse-login');
    } else if (role === 'supplier') {
      setCurrentView('pharmacy-login');
    } else if (role === 'admin') {
      setCurrentView('admin-login');
    }
  };

  const handleNurseLogin = () => {
    // For nurses, show onboarding first for new users
    setCurrentView('nurse-onboarding');
  };

  const handlePharmacyLogin = () => {
    setCurrentView('supplier');
  };

  const handleAdminLogin = () => {
    setCurrentView('admin');
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
  };

  const handleNurseJobClick = () => {
    setCurrentView('nurse-job-detail');
  };

  const handleAcceptVisit = () => {
    setCurrentView('nurse-visit-acceptance');
  };

  const handleVisitAccepted = () => {
    setVisitAccepted(true);
    setCurrentView('nurse-job-detail');
  };

  const handleVisitDeclined = () => {
    setCurrentView('nurse');
  };

  const handleSupplierJobClick = () => {
    setCurrentView('supplier-job-detail');
  };

  const handleStartJob = () => {
    setCurrentView('nurse-active-job');
  };

  const handleCompleteJob = () => {
    setCurrentView('nurse');
  };

  const handleBackToNursePortal = () => {
    setVisitAccepted(false);
    setCurrentView('nurse');
  };

  const handleBackToSupplierDashboard = () => {
    setCurrentView('supplier');
  };

  const handleOnboardingComplete = () => {
    setCurrentView('nurse');
  };

  const handleBackFromOnboarding = () => {
    setCurrentView('landing');
  };

  const handleEditProfile = () => {
    setCurrentView('nurse-edit-profile');
  };

  const handleViewApplications = () => {
    setCurrentView('vendor-view-applications');
  };

  const handleBackFromApplications = () => {
    setCurrentView('supplier-job-detail');
  };

  // Show login screens
  if (currentView === 'landing') {
    return <LandingPage onRoleSelect={handleRoleSelect} />;
  }

  if (currentView === 'nurse-login') {
    return <NurseLogin onLogin={handleNurseLogin} onBack={handleBackToLanding} />;
  }

  if (currentView === 'pharmacy-login') {
    return <PharmacyLogin onLogin={handlePharmacyLogin} onBack={handleBackToLanding} />;
  }

  if (currentView === 'admin-login') {
    return <AdminLogin onLogin={handleAdminLogin} onBack={handleBackToLanding} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header for Portals - hide for onboarding */}
      {currentView !== 'nurse-onboarding' && (
        <div className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToLanding}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[var(--color-brand-gradient-4)] to-[var(--color-brand-gradient-5)] text-white text-sm font-medium">
                  {(currentView === 'nurse' || currentView === 'nurse-onboarding' || currentView === 'nurse-edit-profile' || currentView === 'nurse-job-detail' || currentView === 'nurse-visit-acceptance' || currentView === 'nurse-active-job') ? 'N' : (currentView === 'supplier' || currentView === 'supplier-job-detail' || currentView === 'vendor-view-applications') ? 'S' : 'A'}
                </div>
                <span className="font-medium capitalize text-[var(--color-brand-gradient-3)]">
                  {currentView === 'nurse-onboarding' ? 'Nurse Onboarding' : 
                   currentView === 'nurse-edit-profile' ? 'Edit Profile' :
                   currentView === 'vendor-view-applications' ? 'Review Applications' :
                   (currentView.includes('nurse') ? 'Nurse Portal' : currentView.includes('supplier') ? 'Pharmacy Portal' : 'Admin Portal')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Center */}
              {(currentView === 'nurse' || currentView === 'nurse-job-detail' || currentView === 'nurse-visit-acceptance' || currentView === 'nurse-active-job' || currentView === 'nurse-edit-profile') && (
                <NotificationCenter userRole="nurse" userName="Jane Doe" />
              )}
              {(currentView === 'supplier' || currentView === 'supplier-job-detail' || currentView === 'vendor-view-applications') && (
                <NotificationCenter userRole="supplier" userName="NorthPeak Care" />
              )}
              {currentView === 'admin' && (
                <NotificationCenter userRole="admin" userName="System Administrator" />
              )}

              {/* Messaging System */}
              {(currentView === 'nurse' || currentView === 'nurse-job-detail' || currentView === 'nurse-visit-acceptance' || currentView === 'nurse-active-job' || currentView === 'nurse-edit-profile') && (
                <MessagingSystem userRole="nurse" userName="Jane Doe" />
              )}
              {(currentView === 'supplier' || currentView === 'supplier-job-detail' || currentView === 'vendor-view-applications') && (
                <MessagingSystem userRole="supplier" userName="NorthPeak Care" />
              )}
              {currentView === 'admin' && (
                <MessagingSystem userRole="admin" userName="System Administrator" />
              )}

              {(currentView === 'nurse' || currentView === 'nurse-edit-profile') && (
                <div className="text-right">
                  <p className="text-sm font-medium">Jane Doe, RN</p>
                  <p className="text-xs text-muted-foreground">IV Therapy Specialist</p>
                </div>
              )}
              {(currentView === 'supplier' || currentView === 'vendor-view-applications') && (
                <div className="text-right">
                  <p className="text-sm font-medium">NorthPeak Care</p>
                  <p className="text-xs text-muted-foreground">Pharmacy Partner</p>
                </div>
              )}
              {currentView === 'admin' && (
                <div className="text-right">
                  <p className="text-sm font-medium">System Administrator</p>
                  <p className="text-xs text-muted-foreground">Platform Management</p>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleBackToLanding}>
                Logout
              </Button>
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Portal Content */}
      {currentView === 'nurse' && <NursePortal onJobClick={handleNurseJobClick} onEditProfile={handleEditProfile} />}
      {currentView === 'supplier' && <SupplierDashboard onJobClick={handleSupplierJobClick} />}
      {currentView === 'admin' && <AdminPortal />}
      {currentView === 'nurse-job-detail' && <NurseJobDetail onBack={handleBackToNursePortal} onAcceptVisit={visitAccepted ? undefined : handleAcceptVisit} onStartJob={handleStartJob} />}
      {currentView === 'nurse-visit-acceptance' && <NurseVisitAcceptance onBack={handleBackToNursePortal} onAccept={handleVisitAccepted} onDecline={handleVisitDeclined} />}
      {currentView === 'nurse-active-job' && <NurseActiveJob onBack={handleBackToNursePortal} onCompleteJob={handleCompleteJob} />}
      {currentView === 'supplier-job-detail' && <SupplierJobDetail onBack={handleBackToSupplierDashboard} onViewApplications={handleViewApplications} />}
      {currentView === 'nurse-onboarding' && <NurseOnboarding onComplete={handleOnboardingComplete} onBack={handleBackFromOnboarding} />}
      {currentView === 'nurse-edit-profile' && <NurseEditProfile onBack={handleBackToNursePortal} />}
      {currentView === 'vendor-view-applications' && <VendorViewApplications jobTitle="IV Infusion - Antibiotic Therapy" jobDate="October 2, 2025 at 2:00 PM" onBack={handleBackFromApplications} />}
    </div>
  );
}