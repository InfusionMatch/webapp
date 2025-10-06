import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { VisitDocumentation } from "./visit-documentation";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  Circle, 
  ArrowLeft,
  FileText,
  Phone,
  AlertTriangle,
  Timer,
  User,
  Activity,
  Edit2,
  ExternalLink,
  Pill
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface NurseActiveJobProps {
  onBack: () => void;
  onCompleteJob: () => void;
}

const visitDetails = {
  title: "IV Infusion - Remicade",
  patient: "Maria Rodriguez",
  patientCode: "Patient R-2847",
  medication: "Infliximab (Remicade) 400mg",
  location: "Downtown Area",
  address: "1456 Oak Street, Apt 3B",
  date: "2025-09-25",
  scheduledTime: "10:00 AM",
  duration: "2-3 hours",
  hourlyRate: 55,
  totalPay: 165,
  contactPerson: "Maria Rodriguez (Patient)",
  contactPhone: "(555) 123-4567"
};

export function NurseActiveJob({ onBack, onCompleteJob }: NurseActiveJobProps) {
  const [checkpoints, setCheckpoints] = useState({
    preCall: false,
    patientCheckin: false,
    treatmentComplete: false
  });
  
  const [documentationOpen, setDocumentationOpen] = useState(false);
  const [documentationCompleted, setDocumentationCompleted] = useState(false);
  const [startTime, setStartTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showManualTimeDialog, setShowManualTimeDialog] = useState(false);
  const [manualStartTime, setManualStartTime] = useState('');
  const [manualStartDate, setManualStartDate] = useState('');
  
  // Update time every minute
  useState(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  });

  const handleCheckpoint = (checkpoint: 'preCall' | 'patientCheckin' | 'treatmentComplete') => {
    setCheckpoints(prev => ({
      ...prev,
      [checkpoint]: true
    }));
  };

  const handleDocumentationSubmit = () => {
    setDocumentationCompleted(true);
    setDocumentationOpen(false);
  };

  const getElapsedTime = () => {
    const diff = currentTime.getTime() - startTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getProgress = () => {
    const total = Object.keys(checkpoints).length + (documentationCompleted ? 1 : 0);
    const completed = Object.values(checkpoints).filter(Boolean).length + (documentationCompleted ? 1 : 0);
    return (completed / total) * 100;
  };

  const canCompleteJob = () => {
    return checkpoints.preCall && checkpoints.patientCheckin && checkpoints.treatmentComplete && documentationCompleted;
  };

  const handleSaveManualTime = () => {
    if (manualStartDate && manualStartTime) {
      const newStartTime = new Date(`${manualStartDate}T${manualStartTime}`);
      setStartTime(newStartTime);
      setShowManualTimeDialog(false);
    }
  };

  // Function to get medication search term for drugs.com
  const getMedicationSearchTerm = () => {
    // Extract the medication name (first part before dosage)
    // e.g., "Infliximab (Remicade) 400mg" -> "Remicade"
    const match = visitDetails.medication.match(/\(([^)]+)\)/);
    return match ? match[1] : visitDetails.medication.split(' ')[0];
  };

  const handleDrugsComReference = () => {
    const searchTerm = getMedicationSearchTerm();
    window.open(`https://www.drugs.com/${searchTerm.toLowerCase().replace(/\s+/g, '-')}.html`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Active Patient Visit</h1>
            <p className="text-muted-foreground">Track your progress and complete visit tasks</p>
          </div>
          <Badge className="bg-green-100 text-green-800">Visit In Progress</Badge>
        </div>

        {/* Status Overview */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  {visitDetails.title}
                </CardTitle>
                <p className="text-muted-foreground">{visitDetails.patient}</p>
                <p className="text-sm text-blue-600">{visitDetails.medication}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Timer className="h-5 w-5 text-primary" />
                  {getElapsedTime()}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowManualTimeDialog(true)}
                    className="h-6 w-6 p-0"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">Time on visit</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Visit Progress</span>
                  <span>{Math.round(getProgress())}% Complete</span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{visitDetails.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{visitDetails.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{visitDetails.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${visitDetails.totalPay} total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Check-in Progress */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Visit Tasks</CardTitle>
              <p className="text-sm text-muted-foreground">Complete these tasks throughout your patient visit</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pre-call Check-in */}
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {checkpoints.preCall ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Pre-visit Call Completed</h4>
                  <p className="text-sm text-muted-foreground">Confirmed appointment and supplies with patient day before</p>
                  {checkpoints.preCall && (
                    <p className="text-xs text-green-600 mt-1">Completed yesterday at 2:00 PM</p>
                  )}
                </div>
                <Button 
                  size="sm" 
                  disabled={checkpoints.preCall}
                  onClick={() => handleCheckpoint('preCall')}
                  variant={checkpoints.preCall ? "secondary" : "default"}
                >
                  {checkpoints.preCall ? "Completed" : "Mark Complete"}
                </Button>
              </div>

              {/* Patient Check-in */}
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {checkpoints.patientCheckin ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Patient Check-in & Assessment</h4>
                  <p className="text-sm text-muted-foreground">Arrived at patient location, completed intake and pre-treatment vitals</p>
                  {checkpoints.patientCheckin && (
                    <p className="text-xs text-green-600 mt-1">Checked in at 10:15 AM</p>
                  )}
                </div>
                <Button 
                  size="sm" 
                  disabled={checkpoints.patientCheckin}
                  onClick={() => handleCheckpoint('patientCheckin')}
                  variant={checkpoints.patientCheckin ? "secondary" : "default"}
                >
                  {checkpoints.patientCheckin ? "Completed" : "Check In"}
                </Button>
              </div>

              {/* Treatment Completed */}
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {checkpoints.treatmentComplete ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Treatment Completed</h4>
                  <p className="text-sm text-muted-foreground">Infusion completed, post-treatment assessment done</p>
                  {checkpoints.treatmentComplete && (
                    <p className="text-xs text-green-600 mt-1">Completed at 12:45 PM</p>
                  )}
                </div>
                <Button 
                  size="sm" 
                  disabled={checkpoints.treatmentComplete}
                  onClick={() => handleCheckpoint('treatmentComplete')}
                  variant={checkpoints.treatmentComplete ? "secondary" : "default"}
                >
                  {checkpoints.treatmentComplete ? "Completed" : "Complete"}
                </Button>
              </div>

              {/* Documentation */}
              <div className="flex items-center gap-4 p-4 border rounded-lg bg-blue-50">
                <div className="flex-shrink-0">
                  {documentationCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <FileText className="h-6 w-6 text-blue-500" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Visit Documentation</h4>
                  <p className="text-sm text-muted-foreground">Complete patient vitals, treatment notes, and outcomes</p>
                  {documentationCompleted && (
                    <p className="text-xs text-green-600 mt-1">Submitted successfully</p>
                  )}
                </div>
                <Button 
                  size="sm" 
                  disabled={documentationCompleted}
                  onClick={() => setDocumentationOpen(true)}
                  variant={documentationCompleted ? "secondary" : "default"}
                >
                  {documentationCompleted ? "Submitted" : "Document Visit"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Patient
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  View Protocols
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleDrugsComReference}
                >
                  <Pill className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">Medication Info</span>
                  <ExternalLink className="h-4 w-4 ml-2 text-muted-foreground" />
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Patient Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="font-medium">{visitDetails.contactPerson}</p>
                  <p className="text-muted-foreground">{visitDetails.contactPhone}</p>
                  <p className="text-xs text-muted-foreground">{visitDetails.address}</p>
                </div>
                <Button size="sm" className="w-full mt-3">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
              </CardContent>
            </Card>

            {/* Emergency */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Emergency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  For immediate medical emergencies or complications
                </p>
                <Button variant="destructive" size="sm" className="w-full">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Emergency Support
                </Button>
              </CardContent>
            </Card>

            {/* Complete Visit */}
            {canCompleteJob() ? (
              <Card className="border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">Ready to Complete</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    All tasks and documentation completed. You can now finish your visit.
                  </p>
                  <Button className="w-full" onClick={onCompleteJob}>
                    Complete Visit
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Complete all tasks and documentation to finish your visit.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>

        {/* Documentation Modal */}
        <VisitDocumentation
          isOpen={documentationOpen}
          onClose={() => setDocumentationOpen(false)}
          onSubmit={handleDocumentationSubmit}
          visitDetails={{
            patient: visitDetails.patient,
            medication: visitDetails.medication,
            visitType: visitDetails.title
          }}
        />

        {/* Manual Time Entry Dialog */}
        <Dialog open={showManualTimeDialog} onOpenChange={setShowManualTimeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manual Time Entry</DialogTitle>
              <DialogDescription>
                Enter the actual start time if the system was unavailable when you clocked in.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={manualStartDate}
                  onChange={(e) => setManualStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={manualStartTime}
                  onChange={(e) => setManualStartTime(e.target.value)}
                />
              </div>
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Manual time entries are logged for accuracy and compliance purposes.
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowManualTimeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveManualTime}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Save Time
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}