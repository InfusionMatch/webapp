import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  CheckCircle, 
  FileText, 
  User, 
  Shield, 
  CreditCard, 
  Signature,
  AlertTriangle,
  Heart
} from "lucide-react";

interface NurseOnboardingProps {
  onComplete: () => void;
  onBack?: () => void;
}

const onboardingSteps = [
  { id: 'personal', title: 'Personal Information', icon: User },
  { id: 'license', title: 'Nursing License', icon: Shield },
  { id: 'certifications', title: 'Certifications', icon: FileText },
  { id: 'payroll', title: 'Payroll Information', icon: CreditCard },
  { id: 'contractor', title: 'Contractor Agreement', icon: Signature },
  { id: 'background', title: 'Background Check', icon: Shield },
  { id: 'welcome', title: 'Welcome!', icon: Heart }
];

export function NurseOnboarding({ onComplete, onBack }: NurseOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    personal: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      emergencyContact: '',
      emergencyPhone: ''
    },
    license: {
      licenseNumber: '',
      state: '',
      expirationDate: '',
      licenseFile: null as File | null
    },
    certifications: {
      cprExpiry: '',
      aclsExpiry: '',
      ivTherapy: false,
      infusionCert: false,
      oncologyCert: false,
      piccCert: false,
      certFiles: [] as File[]
    },
    payroll: {
      ssn: '',
      bankName: '',
      routingNumber: '',
      accountNumber: '',
      accountType: 'checking',
      w4Completed: false
    },
    agreements: {
      contractorSigned: false,
      backgroundSigned: false
    }
  });

  const getCurrentProgress = () => {
    return ((currentStep + 1) / onboardingSteps.length) * 100;
  };

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack?.();
    }
  };

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const renderPersonalInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Personal Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please provide your basic contact information and emergency contact details.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input 
              id="firstName"
              value={formData.personal.firstName}
              onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
              placeholder="Jane"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input 
              id="lastName"
              value={formData.personal.lastName}
              onChange={(e) => handleInputChange('personal', 'lastName', e.target.value)}
              placeholder="Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input 
              id="email"
              type="email"
              value={formData.personal.email}
              onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
              placeholder="jane.doe@email.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input 
              id="phone"
              value={formData.personal.phone}
              onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="address">Street Address *</Label>
          <Input 
            id="address"
            value={formData.personal.address}
            onChange={(e) => handleInputChange('personal', 'address', e.target.value)}
            placeholder="123 Main Street, Apt 4B"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input 
              id="city"
              value={formData.personal.city}
              onChange={(e) => handleInputChange('personal', 'city', e.target.value)}
              placeholder="New York"
            />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Select onValueChange={(value) => handleInputChange('personal', 'state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="ca">California</SelectItem>
                <SelectItem value="tx">Texas</SelectItem>
                <SelectItem value="fl">Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input 
              id="zipCode"
              value={formData.personal.zipCode}
              onChange={(e) => handleInputChange('personal', 'zipCode', e.target.value)}
              placeholder="10001"
            />
          </div>
        </div>

        <div className="border-t pt-4 mt-6">
          <h4 className="font-medium mb-4">Emergency Contact Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
              <Input 
                id="emergencyContact"
                value={formData.personal.emergencyContact}
                onChange={(e) => handleInputChange('personal', 'emergencyContact', e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
              <Input 
                id="emergencyPhone"
                value={formData.personal.emergencyPhone}
                onChange={(e) => handleInputChange('personal', 'emergencyPhone', e.target.value)}
                placeholder="(555) 987-6543"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderLicenseInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Nursing License Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please provide your current nursing license details and upload a digital copy.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="licenseNumber">License Number *</Label>
            <Input 
              id="licenseNumber"
              value={formData.license.licenseNumber}
              onChange={(e) => handleInputChange('license', 'licenseNumber', e.target.value)}
              placeholder="RN123456"
            />
          </div>
          <div>
            <Label htmlFor="licenseState">Licensing State *</Label>
            <Select onValueChange={(value) => handleInputChange('license', 'state', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ny">New York</SelectItem>
                <SelectItem value="ca">California</SelectItem>
                <SelectItem value="tx">Texas</SelectItem>
                <SelectItem value="fl">Florida</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expirationDate">Expiration Date *</Label>
            <Input 
              id="expirationDate"
              type="date"
              value={formData.license.expirationDate}
              onChange={(e) => handleInputChange('license', 'expirationDate', e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>License Document Upload *</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Click to upload or drag and drop your nursing license
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, JPG, or PNG (Max 5MB)
            </p>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleInputChange('license', 'licenseFile', e.target.files?.[0] || null)}
            />
            <Button variant="outline" className="mt-2">
              Choose File
            </Button>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your license must be current and valid. We will verify all information with the state licensing board.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const renderCertifications = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Professional Certifications
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please provide information about your professional certifications and upload digital copies.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cprExpiry">CPR Certification Expiry *</Label>
            <Input 
              id="cprExpiry"
              type="date"
              value={formData.certifications.cprExpiry}
              onChange={(e) => handleInputChange('certifications', 'cprExpiry', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="aclsExpiry">ACLS Certification Expiry</Label>
            <Input 
              id="aclsExpiry"
              type="date"
              value={formData.certifications.aclsExpiry}
              onChange={(e) => handleInputChange('certifications', 'aclsExpiry', e.target.value)}
            />
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Specialized Certifications</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ivTherapy"
                checked={formData.certifications.ivTherapy}
                onCheckedChange={(checked) => handleInputChange('certifications', 'ivTherapy', checked)}
              />
              <Label htmlFor="ivTherapy">IV Therapy Certified</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="infusionCert"
                checked={formData.certifications.infusionCert}
                onCheckedChange={(checked) => handleInputChange('certifications', 'infusionCert', checked)}
              />
              <Label htmlFor="infusionCert">Infusion Therapy Certified</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="oncologyCert"
                checked={formData.certifications.oncologyCert}
                onCheckedChange={(checked) => handleInputChange('certifications', 'oncologyCert', checked)}
              />
              <Label htmlFor="oncologyCert">Oncology Nursing Certified (OCN)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="piccCert"
                checked={formData.certifications.piccCert}
                onCheckedChange={(checked) => handleInputChange('certifications', 'piccCert', checked)}
              />
              <Label htmlFor="piccCert">PICC Line Certified</Label>
            </div>
          </div>
        </div>

        <div>
          <Label>Certification Documents Upload</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Upload all relevant certification documents
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, JPG, or PNG (Max 5MB each)
            </p>
            <Button variant="outline" className="mt-2">
              Choose Files
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPayrollInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payroll Information
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Secure payroll setup for direct deposit and tax purposes.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            All information is encrypted and secure. This information is only used for payroll processing.
          </AlertDescription>
        </Alert>

        <div>
          <Label htmlFor="ssn">Social Security Number *</Label>
          <Input 
            id="ssn"
            type="password"
            value={formData.payroll.ssn}
            onChange={(e) => handleInputChange('payroll', 'ssn', e.target.value)}
            placeholder="xxx-xx-xxxx"
          />
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-4">Direct Deposit Information</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input 
                id="bankName"
                value={formData.payroll.bankName}
                onChange={(e) => handleInputChange('payroll', 'bankName', e.target.value)}
                placeholder="Chase Bank"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="routingNumber">Routing Number *</Label>
                <Input 
                  id="routingNumber"
                  value={formData.payroll.routingNumber}
                  onChange={(e) => handleInputChange('payroll', 'routingNumber', e.target.value)}
                  placeholder="123456789"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number *</Label>
                <Input 
                  id="accountNumber"
                  value={formData.payroll.accountNumber}
                  onChange={(e) => handleInputChange('payroll', 'accountNumber', e.target.value)}
                  placeholder="1234567890"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="accountType">Account Type *</Label>
              <Select onValueChange={(value) => handleInputChange('payroll', 'accountType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="w4Completed"
            checked={formData.payroll.w4Completed}
            onCheckedChange={(checked) => handleInputChange('payroll', 'w4Completed', checked)}
          />
          <Label htmlFor="w4Completed">I will complete my W-4 form separately</Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderContractorAgreement = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Signature className="h-5 w-5" />
          Contractor Agreement
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Please review and electronically sign the independent contractor agreement.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
          <h4 className="font-medium mb-3">Independent Contractor Agreement</h4>
          <div className="text-sm space-y-3 text-muted-foreground">
            <p>
              This Independent Contractor Agreement ("Agreement") is entered into between NorthPeak Care, LLC 
              ("Company") and the healthcare professional ("Contractor").
            </p>
            <p>
              <strong>1. Services:</strong> Contractor agrees to provide IV therapy, infusion services, and related 
              nursing care to patients as requested through the platform.
            </p>
            <p>
              <strong>2. Independent Contractor Status:</strong> Contractor is an independent contractor and not an 
              employee of the Company. Contractor is responsible for their own taxes, insurance, and licensing.
            </p>
            <p>
              <strong>3. Compensation:</strong> Contractor will be paid on a per-visit basis according to the rates 
              posted on the platform. Payment will be processed within 7 days of completed visit documentation.
            </p>
            <p>
              <strong>4. Professional Standards:</strong> Contractor agrees to maintain all required licenses, 
              certifications, and insurance, and to provide services according to professional nursing standards.
            </p>
            <p>
              <strong>5. Confidentiality:</strong> Contractor agrees to maintain strict confidentiality of all 
              patient information in accordance with HIPAA regulations.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="contractorSigned"
            checked={formData.agreements.contractorSigned}
            onCheckedChange={(checked) => handleInputChange('agreements', 'contractorSigned', checked)}
          />
          <Label htmlFor="contractorSigned">
            I have read, understood, and agree to the terms of this Independent Contractor Agreement
          </Label>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            By checking the box above, you are providing your electronic signature and agreeing to be bound by this contract.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );

  const renderBackgroundCheck = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Background Check Authorization
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Authorization for background check and screening process.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            All nurses must pass a comprehensive background check including criminal history, 
            professional license verification, and reference checks.
          </AlertDescription>
        </Alert>

        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium mb-3">Background Check Authorization</h4>
          <div className="text-sm space-y-2 text-muted-foreground">
            <p>
              I authorize NorthPeak Care, LLC and its designated agents to conduct a comprehensive 
              background investigation including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Criminal history check (federal, state, and local)</li>
              <li>Professional license verification</li>
              <li>Employment history verification</li>
              <li>Professional reference checks</li>
              <li>National sex offender registry check</li>
              <li>OIG exclusion list check</li>
            </ul>
            <p className="mt-3">
              I understand that any false information or omission may result in immediate 
              disqualification or termination.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="backgroundSigned"
            checked={formData.agreements.backgroundSigned}
            onCheckedChange={(checked) => handleInputChange('agreements', 'backgroundSigned', checked)}
          />
          <Label htmlFor="backgroundSigned">
            I authorize the background check and certify that all information provided is accurate
          </Label>
        </div>
      </CardContent>
    </Card>
  );

  const renderWelcome = () => (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Heart className="h-8 w-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Welcome to NorthPeak Care!</CardTitle>
        <p className="text-muted-foreground">
          Congratulations! You've successfully completed the onboarding process.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Profile information submitted</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Documents uploaded for review</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span>Agreements signed</span>
          </div>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your application is now under review. You'll receive an email notification within 24-48 hours 
            regarding your approval status. Once approved, you can start accepting patient visits!
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <h4 className="font-medium">What's Next?</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Document verification (24-48 hours)</li>
            <li>• Background check processing (3-5 business days)</li>
            <li>• Account activation and welcome email</li>
            <li>• Complete additional training modules</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderPersonalInfo();
      case 1: return renderLicenseInfo();
      case 2: return renderCertifications();
      case 3: return renderPayrollInfo();
      case 4: return renderContractorAgreement();
      case 5: return renderBackgroundCheck();
      case 6: return renderWelcome();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold">Nurse Onboarding</h1>
          <p className="text-muted-foreground">Complete your profile to start accepting patient visits</p>
        </div>

        {/* Progress */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Step {currentStep + 1} of {onboardingSteps.length}</span>
                <span>{Math.round(getCurrentProgress())}% Complete</span>
              </div>
              <Progress value={getCurrentProgress()} className="h-2" />
              <div className="flex justify-between">
                {onboardingSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === currentStep ? 'bg-primary text-primary-foreground' :
                        index < currentStep ? 'bg-green-500 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {index < currentStep ? <CheckCircle className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                      </div>
                      <span className="text-xs mt-1 hidden md:block">{step.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        {renderCurrentStep()}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {currentStep === 0 ? 'Back to Login' : 'Previous'}
          </Button>
          <Button onClick={nextStep}>
            {currentStep === onboardingSteps.length - 1 ? 'Complete Onboarding' : 'Next Step'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}