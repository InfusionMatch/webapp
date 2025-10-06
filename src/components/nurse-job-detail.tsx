import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MapPin, Calendar, Clock, DollarSign, Activity, ArrowLeft, AlertTriangle, Phone, Navigation, User, CheckCircle, Edit2, ExternalLink, Pill } from "lucide-react";

interface NurseJobDetailProps {
  onBack: () => void;
  onAcceptVisit?: () => void;
  onStartJob: () => void;
}

const visitDetails = {
  id: 1,
  title: "IV Infusion - Remicade",
  patient: "Maria Rodriguez",
  patientCode: "Patient R-2847",
  medication: "Infliximab (Remicade) 400mg",
  location: "Downtown Area",
  address: "1456 Oak Street, Apt 3B, Downtown, NY 10001",
  date: "2025-09-25",
  scheduledTime: "10:00 AM",
  timeWindow: "Flexible 9:00 AM - 3:00 PM",
  duration: "2-3 hours",
  hourlyRate: 55,
  totalPay: 165,
  requirements: ["IV Therapy Certified", "Infusion Experience", "Biologic Experience Preferred"],
  distance: "2.3 miles",
  contactPerson: "Maria Rodriguez (Patient)",
  contactPhone: "(555) 123-4567",
  description: "Patient requires Remicade infusion for Crohn's disease management. Pre-medications needed (Benadryl, Tylenol). Patient has port access. Previous infusions have been well-tolerated with no adverse reactions.",
  supplies: "All infusion supplies and medications provided by home health pharmacy. Pre-medications available on-site.",
  preferredTime: "10:00 AM start preferred",
  specialInstructions: [
    "Call patient day before to confirm appointment time",
    "Verify all supplies delivered before arrival",
    "Patient has chest port - previous nurse noted easy access",
    "Pre-medicate 30 minutes before infusion",
    "Patient prefers to recline in living room chair during treatment"
  ],
  patientNotes: "Pleasant 34-year-old female with Crohn's disease. Very compliant with treatment. Lives with husband who may assist. Small dog on premises (friendly). Street parking available."
};

export function NurseJobDetail({ onBack, onAcceptVisit, onStartJob }: NurseJobDetailProps) {
  // If onAcceptVisit is provided, this is a new visit to accept
  const isNewVisit = !!onAcceptVisit;
  
  // State for time/date adjustment/reschedule
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [adjustedDate, setAdjustedDate] = useState(visitDetails.date);
  const [adjustedTime, setAdjustedTime] = useState(visitDetails.scheduledTime);
  const [rescheduleReason, setRescheduleReason] = useState('');
  
  const handleSaveReschedule = () => {
    // In a real app, this would save to backend and notify patient
    // No pharmacy approval needed
    setShowRescheduleDialog(false);
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
            Back to Available Visits
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{isNewVisit ? 'Visit Details' : 'Visit Confirmation'}</h1>
            <p className="text-muted-foreground">{isNewVisit ? 'Review visit details before accepting' : 'Review details and confirm your patient visit'}</p>
          </div>
        </div>

        {/* Status Alert */}
        {!isNewVisit && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              You have successfully been assigned to this patient visit. Please review all details before starting.
            </AlertDescription>
          </Alert>
        )}

        {isNewVisit && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              This visit is available for acceptance. Review all details and requirements before proceeding.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Visit Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{visitDetails.title}</CardTitle>
                  <p className="text-lg font-medium text-primary">{isNewVisit ? visitDetails.patientCode : visitDetails.patient}</p>
                  <p className="text-sm text-blue-600">{visitDetails.medication}</p>
                </div>
                <Badge className={isNewVisit ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}>
                  {isNewVisit ? "Available" : "Confirmed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Visit Date</p>
                    <p className="text-sm text-muted-foreground">{visitDetails.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{isNewVisit ? 'Time Window' : 'Preferred Time'}</p>
                    <p className="text-sm text-muted-foreground">{isNewVisit ? visitDetails.timeWindow : visitDetails.scheduledTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Patient Location</p>
                    <p className="text-sm text-muted-foreground">{isNewVisit ? visitDetails.location : visitDetails.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Visit Payment</p>
                    <p className="text-sm text-muted-foreground">${visitDetails.totalPay} (${visitDetails.hourlyRate}/hr)</p>
                  </div>
                </div>
              </div>

              {/* Patient Contact & Notes - Only show for confirmed visits */}
              {!isNewVisit && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Scheduled Time & Date</h4>
                      <Button variant="ghost" size="sm" onClick={() => setShowRescheduleDialog(true)}>
                        <Edit2 className="h-3 w-3 mr-1" />
                        Reschedule
                      </Button>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{adjustedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{adjustedTime}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Need to change the time? Use the reschedule button to coordinate with the patient
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Patient Contact</h4>
                    <div className="flex items-center gap-2 text-sm mb-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{visitDetails.contactPerson}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-primary">{visitDetails.contactPhone}</span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Patient
                    </Button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Visit Address</h4>
                    <p className="text-sm text-muted-foreground mb-2">{visitDetails.address}</p>
                    <Button variant="outline" size="sm">
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </div>
              )}

              {/* Treatment Description */}
              <div>
                <h4 className="font-medium mb-2">Treatment Details</h4>
                <p className="text-sm text-muted-foreground">{visitDetails.description}</p>
              </div>

              {/* Supply Information */}
              <div>
                <h4 className="font-medium mb-2">Supply Information</h4>
                <p className="text-sm text-muted-foreground">{visitDetails.supplies}</p>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="font-medium mb-2">Required Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {visitDetails.requirements.map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <h4 className="font-medium mb-2">Visit Instructions</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {visitDetails.specialInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Patient Notes - Only show for confirmed visits */}
              {!isNewVisit && (
                <div>
                  <h4 className="font-medium mb-2">Patient Information</h4>
                  <p className="text-sm text-muted-foreground">{visitDetails.patientNotes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Panel */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Visit Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{isNewVisit ? 'Flexible time window' : 'Confirmed time'}</p>
                  <p className="text-lg font-semibold text-blue-700">{isNewVisit ? visitDetails.timeWindow : visitDetails.scheduledTime}</p>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="font-medium">{visitDetails.distance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{visitDetails.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hourly Rate:</span>
                    <span className="font-medium">${visitDetails.hourlyRate}/hr</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Earnings:</span>
                    <span className="text-green-600">${visitDetails.totalPay}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Visit Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isNewVisit ? (
                  <>
                    <Button className="w-full" onClick={onAcceptVisit}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Visit
                    </Button>
                    <Button variant="outline" className="w-full">
                      View More Details
                    </Button>
                    <Button variant="outline" className="w-full">
                      Message Support
                    </Button>
                  </>
                ) : (
                  <>
                    <Button className="w-full" onClick={onStartJob}>
                      Start Patient Visit
                    </Button>
                    <Button variant="outline" className="w-full">
                      Call Patient
                    </Button>
                    <Button variant="outline" className="w-full">
                      Message Support
                    </Button>
                    <Button variant="destructive" className="w-full">
                      Withdraw from Visit
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={handleDrugsComReference}
                >
                  <Pill className="h-4 w-4 mr-2" />
                  <span className="flex-1 text-left">Medication Info</span>
                  <ExternalLink className="h-4 w-4 ml-2 text-muted-foreground" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  View detailed information about {getMedicationSearchTerm()} on Drugs.com
                </p>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  24/7 clinical support available for any complications
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Phone className="h-4 w-4 mr-2" />
                  Clinical Support: (555) 999-0000
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reschedule Visit Dialog */}
        <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reschedule Patient Visit</DialogTitle>
              <DialogDescription>
                Update the visit schedule after coordinating with the patient. The patient will be notified of the change. No pharmacy approval required.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Alert className="border-blue-200 bg-blue-50">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <p className="font-medium mb-1">Current Schedule:</p>
                  <p className="text-sm">{adjustedDate} at {adjustedTime}</p>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="new-visit-date">New Visit Date *</Label>
                <Input
                  id="new-visit-date"
                  type="date"
                  defaultValue={adjustedDate}
                  onChange={(e) => setAdjustedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-visit-time">New Visit Time *</Label>
                <Input
                  id="new-visit-time"
                  type="time"
                  defaultValue={adjustedTime}
                  onChange={(e) => setAdjustedTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reschedule-reason">Reason for Rescheduling (Optional)</Label>
                <Input
                  id="reschedule-reason"
                  placeholder="e.g., Patient requested different time"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                />
              </div>

              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  <p className="font-medium mb-1">Important:</p>
                  <ul className="text-sm space-y-1 list-disc ml-4">
                    <li>Coordinate with the patient before rescheduling</li>
                    <li>Patient will be automatically notified of the change</li>
                    <li>No pharmacy approval is needed for rescheduling</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveReschedule}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}