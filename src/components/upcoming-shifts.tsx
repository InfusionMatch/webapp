import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  DollarSign, 
  Navigation, 
  Phone,
  AlertTriangle,
  CheckCircle,
  Timer,
  Building2,
  Star,
  Users
} from "lucide-react";

const upcomingShifts = [
  {
    id: 1,
    title: "IV Infusion - Remicade",
    patient: "Maria Rodriguez",
    patientCode: "Patient R-2847",
    medication: "Infliximab (Remicade) 400mg",
    date: "2025-09-25",
    scheduledTime: "10:00 AM",
    duration: "2-3 hours",
    hourlyRate: 55,
    totalPay: 165,
    status: "confirmed",
    timeUntilStart: "2 days",
    address: "1456 Oak Street, Apt 3B, Downtown, NY 10001",
    contact: {
      name: "Maria Rodriguez (Patient)",
      phone: "(555) 123-4567",
      relationship: "Patient"
    },
    requirements: ["IV Therapy Certified", "Infusion Experience"],
    supplies: "Pre-medication, IV supplies, and Remicade provided by home health pharmacy",
    preCallCompleted: false,
    notes: "Please call patient day before to confirm appointment and verify all supplies are delivered. Patient has port access. Premedicate with Benadryl and Tylenol 30 minutes before infusion."
  },
  {
    id: 2,
    title: "PICC Line Dressing Change",
    patient: "Robert Chen",
    patientCode: "Patient M-1053",
    medication: "Sterile dressing change with Biopatch",
    date: "2025-09-23",
    scheduledTime: "9:30 AM",
    duration: "45 minutes",
    hourlyRate: 48,
    totalPay: 48,
    status: "confirmed",
    timeUntilStart: "Tomorrow",
    address: "789 Maple Ave, West Side, NY 10002",
    contact: {
      name: "Susan Chen (Wife/Caregiver)",
      phone: "(555) 987-1234",
      relationship: "Spouse/Caregiver"
    },
    requirements: ["Central Line Care", "Sterile Technique"],
    supplies: "Sterile dressing kit and Biopatch provided",
    preCallCompleted: true,
    notes: "Patient has double lumen PICC in right arm. Wife will assist. All supplies confirmed delivered. Patient prefers morning appointments."
  },
  {
    id: 3,
    title: "Central Line Maintenance",
    patient: "Linda Thompson",
    patientCode: "Patient A-4562",
    medication: "Heparin flush and dressing change",
    date: "2025-09-26",
    scheduledTime: "2:00 PM",
    duration: "1 hour",
    hourlyRate: 50,
    totalPay: 50,
    status: "pending",
    timeUntilStart: "3 days",
    address: "2134 Pine Street, East Side, NY 10003",
    contact: {
      name: "Linda Thompson (Patient)",
      phone: "(555) 456-7890",
      relationship: "Patient"
    },
    requirements: ["Central Line Certified", "Port Access Experience"],
    supplies: "Heparin, sterile supplies, and dressing materials provided",
    preCallCompleted: false,
    notes: "Waiting for physician approval. Patient has chest port. Previous nurse noted port was slightly difficult to access."
  }
];

interface UpcomingShiftsProps {
  onShiftClick?: () => void;
}

export function UpcomingShifts({ onShiftClick }: UpcomingShiftsProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending Approval";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getTotalEarnings = () => {
    return upcomingShifts
      .filter(shift => shift.status === "confirmed")
      .reduce((total, shift) => total + shift.totalPay, 0);
  };

  const getShiftStats = () => {
    const confirmed = upcomingShifts.filter(s => s.status === "confirmed").length;
    const pending = upcomingShifts.filter(s => s.status === "pending").length;
    const total = upcomingShifts.length;
    
    return { confirmed, pending, total };
  };

  const stats = getShiftStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">Upcoming Patient Visits</h2>
        <p className="text-muted-foreground">Your scheduled IV infusions, line care, and patient visits</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Visits</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <p className="text-xs text-muted-foreground">Ready to work</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Expected Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${getTotalEarnings()}</div>
            <p className="text-xs text-muted-foreground">From confirmed shifts</p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Visit Alert */}
      {upcomingShifts.some(visit => visit.timeUntilStart === "Tomorrow" || !visit.preCallCompleted) && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {upcomingShifts.some(v => !v.preCallCompleted) 
              ? "Remember to call patients the day before their scheduled visits to confirm appointment and supplies."
              : "You have a visit starting soon. Ensure you have confirmed with the patient."
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Visits List */}
      <div className="space-y-4">
        {upcomingShifts.map((visit) => (
          <Card key={visit.id} className="overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onShiftClick?.()}>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{visit.title}</h3>
                    <Badge variant={getStatusVariant(visit.status)}>
                      {getStatusLabel(visit.status)}
                    </Badge>
                    {!visit.preCallCompleted && visit.status === "confirmed" && (
                      <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600">
                        Pre-call needed
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{visit.patient}</span>
                    <span>•</span>
                    <span className="text-sm">{visit.contact.relationship}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    <span>{visit.address}</span>
                  </div>
                  <p className="text-sm text-blue-600">{visit.medication}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-lg">${visit.totalPay}</p>
                  <p className="text-sm text-muted-foreground">{visit.duration}</p>
                  <p className="text-xs text-blue-600 mt-1">{visit.timeUntilStart}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Visit Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{visit.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{visit.scheduledTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <span>Duration: {visit.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{visit.contact.phone}</span>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h5 className="font-medium text-sm mb-2">Requirements</h5>
                <div className="flex flex-wrap gap-2">
                  {visit.requirements.map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Contact & Supplies */}
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-1">Contact Person</h5>
                  <p className="text-muted-foreground">{visit.contact.name}</p>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Supply Status</h5>
                  <p className="text-muted-foreground">{visit.supplies}</p>
                </div>
              </div>

              {/* Pre-call Status */}
              {visit.status === "confirmed" && (
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-medium text-sm">Pre-visit Confirmation</h5>
                    {visit.preCallCompleted ? (
                      <Badge variant="default" className="text-xs">✓ Completed</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">⚠ Pending</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {visit.preCallCompleted 
                      ? "Patient contacted and visit confirmed" 
                      : "Call patient day before to confirm appointment and verify supplies"
                    }
                  </p>
                </div>
              )}

              {visit.notes && (
                <div>
                  <h5 className="font-medium text-sm mb-1">Visit Notes</h5>
                  <p className="text-sm text-muted-foreground">{visit.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call Patient
                </Button>
                {visit.status === "confirmed" && !visit.preCallCompleted && (
                  <Button size="sm" onClick={(e) => e.stopPropagation()}>
                    Complete Pre-call
                  </Button>
                )}
                {visit.status === "pending" && (
                  <Button variant="destructive" size="sm" onClick={(e) => e.stopPropagation()}>
                    Withdraw Application
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {upcomingShifts.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Upcoming Visits</h3>
            <p className="text-muted-foreground text-center mb-4">
              You don't have any scheduled patient visits yet. Browse available visits to get started.
            </p>
            <Button>Browse Available Visits</Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Need Help?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Questions about your upcoming visits or need to make changes?
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-2" />
              Call Support
            </Button>
            <Button variant="outline" size="sm">
              Message Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}