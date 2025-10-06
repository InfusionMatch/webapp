import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  ArrowLeft,
  User,
  Phone,
  CheckCircle,
  Circle,
  FileText,
  CreditCard,
  Navigation,
  Timer,
  Star
} from "lucide-react";

interface SupplierJobDetailProps {
  onBack: () => void;
  onViewApplications?: () => void;
}

const jobDetails = {
  id: 1,
  title: "ICU Nurse - Night Shift",
  location: "St. Mary's Hospital",
  date: "2025-09-25",
  time: "7:00 PM - 7:00 AM",
  hourlyRate: 45,
  totalCost: 594, // $540 + platform fee
  platformFee: 54,
  status: "in-progress",
  assignedNurse: {
    name: "Jane Doe",
    rating: 4.9,
    completedJobs: 87,
    specialties: ["ICU", "Critical Care"],
    phone: "(555) 987-6543",
    photo: "https://images.unsplash.com/photo-1622567182060-95c7dcf6a2f3?w=100&h=100&fit=crop&crop=face"
  },
  timeline: {
    applied: { time: "6:30 PM", completed: true },
    enRoute: { time: "6:45 PM", completed: true },
    checkedIn: { time: "7:15 PM", completed: true },
    pharmacyCheck: { time: "7:30 PM", completed: true },
    patientAssessment: { time: "8:00 PM", completed: true },
    endOfShift: { time: "6:45 AM", completed: false },
    paperwork: { completed: true },
    payment: { completed: false }
  }
};

export function SupplierJobDetail({ onBack, onViewApplications }: SupplierJobDetailProps) {
  const getProgressPercentage = () => {
    const total = Object.keys(jobDetails.timeline).length;
    const completed = Object.values(jobDetails.timeline).filter(item => item.completed).length;
    return (completed / total) * 100;
  };

  const getJobStatus = () => {
    if (jobDetails.timeline.endOfShift.completed && jobDetails.timeline.payment.completed) {
      return { label: "Completed", variant: "secondary" as const };
    } else if (jobDetails.timeline.checkedIn.completed) {
      return { label: "In Progress", variant: "default" as const };
    } else if (jobDetails.timeline.enRoute.completed) {
      return { label: "En Route", variant: "secondary" as const };
    } else {
      return { label: "Assigned", variant: "outline" as const };
    }
  };

  const status = getJobStatus();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Job Tracking</h1>
            <p className="text-muted-foreground">Monitor nurse assignment and job progress</p>
          </div>
          <Button variant="outline" onClick={onViewApplications}>
            <User className="mr-2 h-4 w-4" />
            View Applications
          </Button>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Job Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{jobDetails.title}</CardTitle>
                  <p className="text-muted-foreground">{jobDetails.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">${jobDetails.totalCost}</p>
                  <p className="text-sm text-muted-foreground">Total cost</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Job Progress</span>
                  <span>{Math.round(getProgressPercentage())}% Complete</span>
                </div>
                <Progress value={getProgressPercentage()} className="h-2" />
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{jobDetails.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{jobDetails.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${jobDetails.hourlyRate}/hr</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span>12 hours</span>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-medium mb-4">Job Timeline</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nurse Assigned</p>
                      <p className="text-xs text-muted-foreground">Job accepted and confirmed</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{jobDetails.timeline.applied.time}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">En Route</p>
                      <p className="text-xs text-muted-foreground">Nurse traveling to location</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{jobDetails.timeline.enRoute.time}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Checked In</p>
                      <p className="text-xs text-muted-foreground">Arrived and started shift</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{jobDetails.timeline.checkedIn.time}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Pharmacy Check</p>
                      <p className="text-xs text-muted-foreground">Completed initial protocols</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{jobDetails.timeline.pharmacyCheck.time}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Patient Assessment</p>
                      <p className="text-xs text-muted-foreground">Initial patient care begun</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{jobDetails.timeline.patientAssessment.time}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Circle className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">End of Shift</p>
                      <p className="text-xs text-muted-foreground">Shift completion and handoff</p>
                    </div>
                    <span className="text-xs text-muted-foreground">Pending</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Paperwork Completed</p>
                      <p className="text-xs text-muted-foreground">All documentation submitted</p>
                    </div>
                    <span className="text-xs text-green-600">Complete</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assigned Nurse */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Nurse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={jobDetails.assignedNurse.photo} />
                    <AvatarFallback>{jobDetails.assignedNurse.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{jobDetails.assignedNurse.name}</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{jobDetails.assignedNurse.rating}</span>
                      <span className="text-muted-foreground">• {jobDetails.assignedNurse.completedJobs} jobs</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <p className="font-medium">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {jobDetails.assignedNurse.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Nurse
                </Button>
              </CardContent>
            </Card>

            {/* Payment Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Nurse payment:</span>
                    <span>${jobDetails.hourlyRate * 12}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee:</span>
                    <span>${jobDetails.platformFee}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-2">
                    <span>Total:</span>
                    <span>${jobDetails.totalCost}</span>
                  </div>
                </div>

                {jobDetails.timeline.payment.completed ? (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Payment processed
                  </div>
                ) : (
                  <Alert>
                    <AlertDescription className="text-sm">
                      Payment will be processed after job completion
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  variant={jobDetails.timeline.payment.completed ? "secondary" : "default"}
                  size="sm" 
                  className="w-full"
                  disabled={!jobDetails.timeline.endOfShift.completed}
                >
                  {jobDetails.timeline.payment.completed ? "Payment Complete" : "Process Payment"}
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Navigation className="h-4 w-4 mr-2" />
                  Edit Job Details
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  24/7 support for any job-related issues
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}