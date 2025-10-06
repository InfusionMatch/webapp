import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  MapPin, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  FileText,
  Shield,
  Plus,
  X
} from "lucide-react";

interface VisitAcceptanceProps {
  onBack: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

const mockJob = {
  id: 1,
  title: "IV Infusion - Remicade",
  patientCode: "Patient R-2847",
  location: "Downtown Area",
  date: "2025-09-25",
  timeWindow: "Flexible 9:00 AM - 3:00 PM",
  duration: "2-3 hours",
  hourlyRate: 55,
  totalPay: 165,
  medication: "Infliximab (Remicade) 400mg",
  requirements: ["IV Therapy Certified", "Infusion Experience", "Biologic Experience Preferred"],
  distance: "2.3 miles",
  specialInstructions: "Patient has port access. Please bring portable IV pole and infusion pump. Patient prefers morning appointments when possible."
};

export function NurseVisitAcceptance({ onBack, onAccept, onDecline }: VisitAcceptanceProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [cancellationPolicyAccepted, setCancellationPolicyAccepted] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStartTime, setNewSlotStartTime] = useState('');
  const [newSlotEndTime, setNewSlotEndTime] = useState('');

  // Calculate the three dates: day before, requested day, day after
  const requestedDate = new Date(mockJob.date);
  const dayBefore = new Date(requestedDate);
  dayBefore.setDate(dayBefore.getDate() - 1);
  const dayAfter = new Date(requestedDate);
  dayAfter.setDate(dayAfter.getDate() + 1);

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const allowedDates = [
    formatDateForInput(dayBefore),
    formatDateForInput(requestedDate),
    formatDateForInput(dayAfter)
  ];

  const canAccept = timeSlots.length > 0 && termsAccepted && cancellationPolicyAccepted;

  const handleAccept = () => {
    if (canAccept) {
      onAccept();
    }
  };

  const handleAddTimeSlot = () => {
    if (newSlotDate && newSlotStartTime && newSlotEndTime) {
      const newSlot: TimeSlot = {
        id: Date.now().toString(),
        date: newSlotDate,
        startTime: newSlotStartTime,
        endTime: newSlotEndTime
      };
      setTimeSlots([...timeSlots, newSlot]);
      setNewSlotDate('');
      setNewSlotStartTime('');
      setNewSlotEndTime('');
      setShowAddDialog(false);
    }
  };

  const handleRemoveTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const groupSlotsByDate = () => {
    const grouped: { [key: string]: TimeSlot[] } = {};
    timeSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDate();
  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Available Visits
          </Button>
          <div>
            <h1 className="text-3xl font-semibold">Accept Patient Visit</h1>
            <p className="text-muted-foreground">Review terms and confirm your availability</p>
          </div>
        </div>

        {/* Visit Details Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Visit Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-lg">{mockJob.title}</h3>
                <p className="text-primary font-medium">{mockJob.patientCode}</p>
                <p className="text-blue-600">{mockJob.medication}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">${mockJob.totalPay}</div>
                <div className="text-muted-foreground">${mockJob.hourlyRate}/hr • {mockJob.duration}</div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{mockJob.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{mockJob.timeWindow}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{mockJob.location} • {mockJob.distance} away</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Requirements:</p>
              <div className="flex flex-wrap gap-2">
                {mockJob.requirements.map((req, index) => (
                  <Badge key={index} variant="outline">{req}</Badge>
                ))}
              </div>
            </div>

            {mockJob.specialInstructions && (
              <div className="border-t pt-4">
                <p className="font-medium mb-2">Special Instructions:</p>
                <p className="text-sm text-muted-foreground">{mockJob.specialInstructions}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability Entry */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Enter Your Availability
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Please provide your available time slots for {formatDate(mockJob.date)} and the surrounding days. The actual start time will be confirmed with the patient.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <Calendar className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                Add one or more time windows when you're available. This helps coordinate the best time with the patient during the confirmation call.
              </AlertDescription>
            </Alert>

            {/* Available Dates Indicator */}
            <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Available Dates for This Visit</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(allowedDates[0])} • {formatDate(allowedDates[1])} • {formatDate(allowedDates[2])}
                </p>
              </div>
            </div>

            {/* Time Slots Display */}
            {timeSlots.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg">
                <Clock className="h-12 w-12 text-muted-foreground mb-3" />
                <h4 className="font-medium mb-1">No Availability Added Yet</h4>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Add at least one time slot to proceed with accepting this visit
                </p>
                <Button onClick={() => setShowAddDialog(true)} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Time Slot
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {allowedDates.map(date => {
                  const slotsForDate = groupedSlots[date] || [];
                  if (slotsForDate.length === 0) return null;
                  
                  return (
                    <div key={date} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <h4 className="font-medium">{formatDate(date)}</h4>
                          {date === formatDateForInput(requestedDate) && (
                            <Badge variant="default" className="ml-2">Requested Date</Badge>
                          )}
                        </div>
                        <Badge variant="secondary">
                          {slotsForDate.length} time {slotsForDate.length === 1 ? 'slot' : 'slots'}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {slotsForDate.map(slot => (
                          <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50/50">
                            <div className="flex items-center gap-3">
                              <Clock className="h-4 w-4 text-primary" />
                              <div>
                                <p className="font-medium">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(() => {
                                    const start = slot.startTime.split(':');
                                    const end = slot.endTime.split(':');
                                    const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
                                    const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
                                    const duration = (endMinutes - startMinutes) / 60;
                                    return `${duration} hour${duration !== 1 ? 's' : ''} available`;
                                  })()}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTimeSlot(slot.id)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Button */}
            <Button onClick={() => setShowAddDialog(true)} variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>

            <p className="text-xs text-muted-foreground">
              Note: Final start time will be coordinated with the patient via confirmation call the day before.
            </p>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cancellation Policy */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Cancellation Policy:</p>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    <li>You may cancel this visit with at least 48 hours advance notice</li>
                    <li>Cancellations within 48 hours may result in a penalty fee</li>
                    <li>No-call, no-show incidents may result in temporary or permanent suspension from the platform</li>
                    <li>Emergency cancellations will be reviewed on a case-by-case basis</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>

            {/* Visit Responsibilities */}
            <div className="border rounded-lg p-4 space-y-3 bg-blue-50">
              <h4 className="font-medium">Visit Responsibilities:</h4>
              <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                <li>Arrive promptly at the confirmed appointment time</li>
                <li>Bring all required equipment and supplies as specified</li>
                <li>Complete all required documentation within 24 hours of visit completion</li>
                <li>Follow all safety protocols and infection control procedures</li>
                <li>Maintain professional conduct and patient confidentiality</li>
                <li>Contact clinical support immediately for any complications or concerns</li>
              </ul>
            </div>

            {/* Confirmation Process */}
            <div className="border rounded-lg p-4 space-y-3 bg-green-50">
              <h4 className="font-medium">Confirmation Process:</h4>
              <ul className="text-sm space-y-1 ml-4 list-disc text-muted-foreground">
                <li>You will receive patient contact information and exact address upon acceptance</li>
                <li>A confirmation call to the patient is required 24 hours before the visit</li>
                <li>Verify appointment time, special instructions, and equipment needs during the call</li>
                <li>Patient may reschedule or cancel during this confirmation call</li>
              </ul>
            </div>

            {/* Agreement Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="termsAccepted"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                />
                <Label htmlFor="termsAccepted" className="text-sm leading-relaxed">
                  I have read and agree to all visit responsibilities and professional standards outlined above. 
                  I understand that I am accepting this visit as an independent contractor.
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="cancellationPolicyAccepted"
                  checked={cancellationPolicyAccepted}
                  onCheckedChange={(checked) => setCancellationPolicyAccepted(checked as boolean)}
                />
                <Label htmlFor="cancellationPolicyAccepted" className="text-sm leading-relaxed">
                  I acknowledge and agree to the 48-hour cancellation policy. I understand that late cancellations 
                  or no-shows may result in penalties or suspension from the platform.
                </Label>
              </div>
            </div>

            {!canAccept && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Please add at least one available time slot and accept all terms and conditions to proceed with accepting this visit.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={onDecline} className="min-w-32">
            Decline Visit
          </Button>
          <Button 
            onClick={handleAccept} 
            disabled={!canAccept}
            className="min-w-32 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Accept Visit
          </Button>
        </div>

        {/* Contact Support */}
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Questions about this visit? Contact clinical support at{" "}
              <span className="text-primary font-medium">support@ivcareconnect.com</span> or (555) 123-HELP
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Time Slot Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Available Time Slot</DialogTitle>
            <DialogDescription>
              Set a specific date and time window when you're available for this visit
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="slot-date">Date *</Label>
              <select
                id="slot-date"
                value={newSlotDate}
                onChange={(e) => setNewSlotDate(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select a date</option>
                {allowedDates.map(date => (
                  <option key={date} value={date}>
                    {formatDate(date)} {date === formatDateForInput(requestedDate) ? '(Requested Date)' : ''}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                You can only select dates within one day of the requested visit date
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time *</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newSlotStartTime}
                  onChange={(e) => setNewSlotStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time *</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newSlotEndTime}
                  onChange={(e) => setNewSlotEndTime(e.target.value)}
                />
              </div>
            </div>
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                Add multiple time slots to give the patient more scheduling flexibility during the confirmation call
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddTimeSlot}
              disabled={!newSlotDate || !newSlotStartTime || !newSlotEndTime}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Time Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}