import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Star, 
  MapPin, 
  Calendar,
  FileText,
  Phone,
  Mail,
  Award,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Separator } from './ui/separator';

interface Application {
  id: number;
  nurseName: string;
  nurseImage: string;
  rating: number;
  completedVisits: number;
  yearsExperience: number;
  specialties: string[];
  distance: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  email: string;
  phone: string;
  licenseNumber: string;
  certifications: string[];
  availability: string;
  hourlyRate: number;
}

interface VendorViewApplicationsProps {
  jobTitle: string;
  jobDate: string;
  onBack: () => void;
}

export function VendorViewApplications({ jobTitle, jobDate, onBack }: VendorViewApplicationsProps) {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      nurseName: 'Sarah Johnson, RN',
      nurseImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
      rating: 4.9,
      completedVisits: 147,
      yearsExperience: 8,
      specialties: ['IV Therapy', 'Home Infusions', 'PICC Line Care'],
      distance: '2.3 miles',
      appliedDate: '2 hours ago',
      status: 'pending',
      email: 'sarah.johnson@email.com',
      phone: '(555) 123-4567',
      licenseNumber: 'RN-CA-789012',
      certifications: ['IV Certification', 'PICC Line Certified', 'CPR/BLS'],
      availability: 'Available all day',
      hourlyRate: 65
    },
    {
      id: 2,
      nurseName: 'Michael Chen, RN',
      nurseImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop',
      rating: 4.8,
      completedVisits: 203,
      yearsExperience: 12,
      specialties: ['IV Therapy', 'Chemotherapy', 'Pain Management'],
      distance: '5.1 miles',
      appliedDate: '5 hours ago',
      status: 'pending',
      email: 'michael.chen@email.com',
      phone: '(555) 234-5678',
      licenseNumber: 'RN-CA-345678',
      certifications: ['IV Certification', 'Chemo Certified', 'Advanced Cardiac Life Support'],
      availability: 'Available 8am - 4pm',
      hourlyRate: 70
    },
    {
      id: 3,
      nurseName: 'Emily Rodriguez, RN',
      nurseImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
      rating: 5.0,
      completedVisits: 95,
      yearsExperience: 6,
      specialties: ['IV Therapy', 'Pediatric Care', 'Home Infusions'],
      distance: '3.7 miles',
      appliedDate: '1 day ago',
      status: 'approved',
      email: 'emily.rodriguez@email.com',
      phone: '(555) 345-6789',
      licenseNumber: 'RN-CA-901234',
      certifications: ['IV Certification', 'Pediatric Advanced Life Support', 'CPR/BLS'],
      availability: 'Flexible',
      hourlyRate: 68
    },
    {
      id: 4,
      nurseName: 'David Kim, RN',
      nurseImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop',
      rating: 4.7,
      completedVisits: 132,
      yearsExperience: 10,
      specialties: ['IV Therapy', 'Wound Care', 'Antibiotic Therapy'],
      distance: '8.2 miles',
      appliedDate: '2 days ago',
      status: 'rejected',
      email: 'david.kim@email.com',
      phone: '(555) 456-7890',
      licenseNumber: 'RN-CA-567890',
      certifications: ['IV Certification', 'Wound Care Specialist', 'Infection Control'],
      availability: 'Available after 2pm',
      hourlyRate: 67
    },
    {
      id: 5,
      nurseName: 'Amanda Williams, RN',
      nurseImage: 'https://images.unsplash.com/photo-1551601651-05f0a0c7e760?w=200&h=200&fit=crop',
      rating: 4.9,
      completedVisits: 178,
      yearsExperience: 9,
      specialties: ['IV Therapy', 'TPN Administration', 'Central Line Care'],
      distance: '4.5 miles',
      appliedDate: '6 hours ago',
      status: 'pending',
      email: 'amanda.williams@email.com',
      phone: '(555) 567-8901',
      licenseNumber: 'RN-CA-234567',
      certifications: ['IV Certification', 'Central Line Certified', 'Critical Care Certified'],
      availability: 'Available all day',
      hourlyRate: 72
    }
  ]);

  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleApprove = (application: Application) => {
    setSelectedApplication(application);
    setShowApproveDialog(true);
  };

  const confirmApprove = () => {
    if (selectedApplication) {
      setApplications(applications.map(app => 
        app.id === selectedApplication.id ? { ...app, status: 'approved' } : app
      ));
      // Switch to approved tab to show the result
      setActiveTab('approved');
    }
    setShowApproveDialog(false);
    setSelectedApplication(null);
  };

  const handleReject = (application: Application) => {
    setSelectedApplication(application);
    setShowRejectDialog(true);
  };

  const confirmReject = () => {
    if (selectedApplication) {
      setApplications(applications.map(app => 
        app.id === selectedApplication.id ? { ...app, status: 'rejected' } : app
      ));
      // Switch to rejected tab to show the result
      setActiveTab('rejected');
    }
    setShowRejectDialog(false);
    setSelectedApplication(null);
  };

  const pendingApplications = applications.filter(app => app.status === 'pending');
  const approvedApplications = applications.filter(app => app.status === 'approved');
  const rejectedApplications = applications.filter(app => app.status === 'rejected');

  const ApplicationCard = ({ application }: { application: Application }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={application.nurseImage} />
                <AvatarFallback>{application.nurseName.split(' ')[0][0]}{application.nurseName.split(' ')[1][0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3>{application.nurseName}</h3>
                  {application.status === 'approved' && (
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Approved
                    </Badge>
                  )}
                  {application.status === 'rejected' && (
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" />
                      Rejected
                    </Badge>
                  )}
                  {application.status === 'pending' && (
                    <Badge variant="secondary">
                      <Clock className="mr-1 h-3 w-3" />
                      Pending
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {application.rating} ({application.completedVisits} visits)
                  </span>
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {application.yearsExperience} years exp.
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {application.distance}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <Clock className="inline h-3 w-3 mr-1" />
              Applied {application.appliedDate}
            </div>
          </div>

          <Separator />

          {/* Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Contact Information</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {application.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {application.phone}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">License & Rate</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  {application.licenseNumber}
                </p>
                <p className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  ${application.hourlyRate}/hr
                </p>
              </div>
            </div>
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Specialties</p>
            <div className="flex flex-wrap gap-2">
              {application.specialties.map((specialty, idx) => (
                <Badge key={idx} variant="secondary">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Certifications</p>
            <div className="flex flex-wrap gap-2">
              {application.certifications.map((cert, idx) => (
                <Badge key={idx} variant="outline" className="border-green-500 text-green-700">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  {cert}
                </Badge>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <p className="text-sm font-medium">Availability for This Visit</p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {application.availability}
            </p>
          </div>

          {/* Actions */}
          {application.status === 'pending' && (
            <div className="flex gap-3 pt-2">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => handleApprove(application)}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve Nurse
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => handleReject(application)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}

          {application.status === 'approved' && (
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                This nurse has been approved for the visit. They will be notified and can confirm the appointment.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            ← Back to Job Details
          </Button>
          <div>
            <h1 className="mb-2">Review Applications</h1>
            <p className="text-muted-foreground">
              {jobTitle} • {jobDate}
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-3xl">{pendingApplications.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-3xl">{approvedApplications.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-3xl">{rejectedApplications.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending ({pendingApplications.length})
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Approved ({approvedApplications.length})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="gap-2">
              <XCircle className="h-4 w-4" />
              Rejected ({rejectedApplications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingApplications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2">No Pending Applications</h3>
                  <p className="text-muted-foreground">
                    All applications have been reviewed.
                  </p>
                </CardContent>
              </Card>
            ) : (
              pendingApplications.map(application => (
                <ApplicationCard key={application.id} application={application} />
              ))
            )}
          </TabsContent>

          <TabsContent value="approved" className="space-y-4">
            {approvedApplications.length > 0 && (
              <Alert className="border-green-500 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {approvedApplications.length} nurse{approvedApplications.length !== 1 ? 's' : ''} approved for this visit. The approved nurse{approvedApplications.length !== 1 ? 's' : ''} will be notified and can confirm the appointment.
                </AlertDescription>
              </Alert>
            )}
            {approvedApplications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2">No Approved Applications</h3>
                  <p className="text-muted-foreground">
                    You haven't approved any nurses yet.
                  </p>
                </CardContent>
              </Card>
            ) : (
              approvedApplications.map(application => (
                <ApplicationCard key={application.id} application={application} />
              ))
            )}
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            {rejectedApplications.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <XCircle className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="mb-2">No Rejected Applications</h3>
                  <p className="text-muted-foreground">
                    You haven't rejected any applications.
                  </p>
                </CardContent>
              </Card>
            ) : (
              rejectedApplications.map(application => (
                <ApplicationCard key={application.id} application={application} />
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Approve Dialog */}
        <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Nurse Application</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve {selectedApplication?.nurseName} for this visit?
              </DialogDescription>
            </DialogHeader>
            <Alert className="border-green-500 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                The nurse will be notified and can confirm the visit. You can still cancel if needed.
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={confirmApprove}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve Nurse
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Nurse Application</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject {selectedApplication?.nurseName}'s application?
              </DialogDescription>
            </DialogHeader>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The nurse will be notified that their application was not selected. This action cannot be undone.
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmReject}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject Application
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
