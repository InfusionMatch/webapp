import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  User, 
  FileText, 
  Lock, 
  CreditCard, 
  Upload, 
  Camera,
  Save,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  FileCheck,
  Download
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

interface NurseEditProfileProps {
  onBack: () => void;
}

export function NurseEditProfile({ onBack }: NurseEditProfileProps) {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Mock credentials data
  const credentials = [
    {
      id: 1,
      type: 'RN License',
      status: 'approved',
      expiry: '2026-03-15',
      file: 'rn-license.pdf'
    },
    {
      id: 2,
      type: 'IV Certification',
      status: 'approved',
      expiry: '2025-12-20',
      file: 'iv-cert.pdf'
    },
    {
      id: 3,
      type: 'CPR Certification',
      status: 'pending',
      expiry: '2025-11-10',
      file: 'cpr-cert.pdf'
    },
    {
      id: 4,
      type: 'Background Check',
      status: 'approved',
      expiry: '2026-01-30',
      file: 'background-check.pdf'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            ← Back to Portal
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="mb-2">Edit Profile</h1>
              <p className="text-muted-foreground">
                Manage your personal information, credentials, and account settings
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <Alert className="mb-6 border-green-500 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Your changes have been saved successfully!
            </AlertDescription>
          </Alert>
        )}

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="credentials" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Credentials</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="banking" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Banking</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your profile details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Photo */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <p className="text-sm">Profile Photo</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Camera className="mr-2 h-4 w-4" />
                        Change Photo
                      </Button>
                      <Button variant="ghost" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="Jane" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                </div>

                {/* Professional Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input id="title" defaultValue="Registered Nurse - IV Therapy Specialist" />
                </div>

                {/* Contact Information */}
                <Separator />
                <div className="space-y-4">
                  <h3>Contact Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <Mail className="mr-2 inline h-4 w-4" />
                      Email Address
                    </Label>
                    <Input id="email" type="email" defaultValue="jane.doe@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <Phone className="mr-2 inline h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input id="phone" type="tel" defaultValue="(555) 123-4567" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">
                      <MapPin className="mr-2 inline h-4 w-4" />
                      Address
                    </Label>
                    <Input id="address" defaultValue="123 Healthcare Ave" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="San Francisco" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" defaultValue="CA" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" defaultValue="94102" />
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <Separator />
                <div className="space-y-4">
                  <h3>Emergency Contact</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="emergencyName">Contact Name</Label>
                      <Input id="emergencyName" defaultValue="John Doe" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="emergencyRelation">Relationship</Label>
                      <Input id="emergencyRelation" defaultValue="Spouse" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Contact Phone</Label>
                    <Input id="emergencyPhone" type="tel" defaultValue="(555) 987-6543" />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={onBack}>Cancel</Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Licenses & Certifications</CardTitle>
                <CardDescription>
                  Manage your professional credentials and upload new documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Upload New Credential */}
                <div className="rounded-lg border-2 border-dashed p-6 text-center">
                  <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                  <p className="mb-2">Upload New Credential</p>
                  <p className="mb-4 text-sm text-muted-foreground">
                    PDF, JPG, or PNG up to 10MB
                  </p>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                </div>

                <Separator />

                {/* Existing Credentials */}
                <div className="space-y-4">
                  <h3>Current Credentials</h3>
                  
                  {credentials.map((credential) => (
                    <Card key={credential.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-[var(--color-brand-gradient-4)] to-[var(--color-brand-gradient-5)]">
                              <FileCheck className="h-6 w-6 text-white" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p>{credential.type}</p>
                                <Badge 
                                  variant={credential.status === 'approved' ? 'default' : 'secondary'}
                                  className={credential.status === 'approved' ? 'bg-green-500' : ''}
                                >
                                  {credential.status}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  Expires: {credential.expiry}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  {credential.file}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* License Information */}
                <Separator />
                <div className="space-y-4">
                  <h3>License Details</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">
                        <Building className="mr-2 inline h-4 w-4" />
                        License Number
                      </Label>
                      <Input id="licenseNumber" defaultValue="RN-CA-123456" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseState">State of Licensure</Label>
                      <Input id="licenseState" defaultValue="California" />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="licenseIssue">Issue Date</Label>
                      <Input id="licenseIssue" type="date" defaultValue="2020-03-15" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="licenseExpiry">Expiration Date</Label>
                      <Input id="licenseExpiry" type="date" defaultValue="2026-03-15" />
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Keep your credentials up to date to maintain active status on the platform.
                    You'll receive notifications 30 days before any credential expires.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={onBack}>Cancel</Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Login & Security</CardTitle>
                <CardDescription>
                  Update your password and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="loginEmail">Email Address (Username)</Label>
                  <Input id="loginEmail" type="email" defaultValue="jane.doe@example.com" />
                  <p className="text-sm text-muted-foreground">
                    This is the email you use to log in to your account
                  </p>
                </div>

                <Separator />

                {/* Change Password */}
                <div className="space-y-4">
                  <h3>Change Password</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                    </AlertDescription>
                  </Alert>
                </div>

                <Separator />

                {/* Two-Factor Authentication */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3>Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Badge variant="secondary">Not Enabled</Badge>
                  </div>
                  <Button variant="outline">
                    Enable Two-Factor Authentication
                  </Button>
                </div>

                <Separator />

                {/* Active Sessions */}
                <div className="space-y-4">
                  <h3>Active Sessions</h3>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p>iPhone 13 - Safari</p>
                          <p className="text-sm text-muted-foreground">
                            San Francisco, CA • Last active: 2 hours ago
                          </p>
                        </div>
                        <Badge className="bg-green-500">Current</Badge>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p>MacBook Pro - Chrome</p>
                          <p className="text-sm text-muted-foreground">
                            San Francisco, CA • Last active: Yesterday
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={onBack}>Cancel</Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Update Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Banking Tab */}
          <TabsContent value="banking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Banking & Payroll</CardTitle>
                <CardDescription>
                  Manage your payment and tax information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Direct Deposit */}
                <div className="space-y-4">
                  <h3>Direct Deposit Information</h3>
                  
                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Your banking information is encrypted and secure. We never share this information with third parties.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">Account Type</Label>
                    <select 
                      id="accountType" 
                      className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2"
                      defaultValue="checking"
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input id="bankName" defaultValue="Chase Bank" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input id="routingNumber" defaultValue="••••••021" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input id="accountNumber" defaultValue="••••••5678" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountHolder">Account Holder Name</Label>
                    <Input id="accountHolder" defaultValue="Jane Doe" />
                  </div>
                </div>

                <Separator />

                {/* Tax Information */}
                <div className="space-y-4">
                  <h3>Tax Information</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ssn">Social Security Number</Label>
                      <Input id="ssn" defaultValue="•••-••-6789" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxStatus">Tax Filing Status</Label>
                      <select 
                        id="taxStatus" 
                        className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2"
                        defaultValue="single"
                      >
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="head">Head of Household</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>W-9 Form</Label>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FileCheck className="h-8 w-8 text-green-500" />
                            <div>
                              <p>W9-Form-2025.pdf</p>
                              <p className="text-sm text-muted-foreground">Uploaded on Jan 15, 2025</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <Separator />

                {/* Payment Preferences */}
                <div className="space-y-4">
                  <h3>Payment Preferences</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                    <select 
                      id="paymentFrequency" 
                      className="flex h-10 w-full rounded-md border border-input bg-input-background px-3 py-2"
                      defaultValue="weekly"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p>Current Pay Rate</p>
                          <p className="text-muted-foreground text-sm">Based on your experience and credentials</p>
                        </div>
                        <p className="text-2xl">$65/hr</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={onBack}>Cancel</Button>
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Banking Info
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
