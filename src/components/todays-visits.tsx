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
  User, 
  Phone, 
  CheckCircle, 
  Circle, 
  Timer,
  Star,
  AlertTriangle,
  Stethoscope,
  Building2,
  Navigation
} from "lucide-react";

const todaysVisits = [
  {
    id: 1,
    nurse: {
      name: "Jane Doe",
      rating: 4.9,
      photo: "https://images.unsplash.com/photo-1622567182060-95c7dcf6a2f3?w=100&h=100&fit=crop&crop=face",
      phone: "(555) 987-6543",
      specialties: ["IV Therapy", "Infusion Specialist"]
    },
    job: {
      title: "IV Infusion - Remicade",
      patientCode: "Patient R-2847",
      time: "10:00 AM - 1:00 PM",
      hourlyRate: 55,
      totalHours: 3,
      medication: "Infliximab (Remicade) 400mg"
    },
    status: "in-progress",
    timeline: {
      preCall: { time: "Yesterday 2:00 PM", completed: true },
      checkedIn: { time: "10:15 AM", completed: true },
      patientAssessment: { time: "10:20 AM", completed: true },
      treatmentComplete: { time: "In Progress", completed: false },
      documentation: { time: "Pending", completed: false }
    },
    startTime: "10:00 AM",
    currentTime: "11:30 AM"
  },
  {
    id: 2,
    nurse: {
      name: "Sarah Mitchell",
      rating: 4.8,
      photo: "https://images.unsplash.com/photo-1594824804732-5f8ff8b831d7?w=100&h=100&fit=crop&crop=face",
      phone: "(555) 456-7890",
      specialties: ["PICC Care", "Central Line"]
    },
    job: {
      title: "PICC Line Dressing Change",
      patientCode: "Patient M-1053",
      time: "8:00 AM - 9:00 AM",
      hourlyRate: 48,
      totalHours: 1,
      medication: "Sterile dressing change with Biopatch"
    },
    status: "completed",
    timeline: {
      preCall: { time: "Yesterday 4:00 PM", completed: true },
      checkedIn: { time: "8:00 AM", completed: true },
      patientAssessment: { time: "8:05 AM", completed: true },
      treatmentComplete: { time: "8:45 AM", completed: true },
      documentation: { time: "9:15 AM", completed: true }
    },
    startTime: "8:00 AM",
    currentTime: "9:30 AM"
  },
  {
    id: 3,
    nurse: {
      name: "Maria Santos",
      rating: 4.9,
      photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face",
      phone: "(555) 234-5678",
      specialties: ["IV Hydration", "Home Health"]
    },
    job: {
      title: "IV Hydration Therapy",
      patientCode: "Patient K-7291",
      time: "1:00 PM - 3:00 PM",
      hourlyRate: 52,
      totalHours: 2,
      medication: "Normal Saline 1000mL with vitamins"
    },
    status: "scheduled",
    timeline: {
      preCall: { time: "Today 11:00 AM", completed: false },
      checkedIn: { time: "1:00 PM", completed: false },
      patientAssessment: { time: "1:05 PM", completed: false },
      treatmentComplete: { time: "Pending", completed: false },
      documentation: { time: "Pending", completed: false }
    },
    startTime: "1:00 PM",
    currentTime: "12:30 PM"
  }
];

interface TodaysVisitsProps {
  onNurseContact?: (nurseId: number) => void;
}

export function TodaysVisits({ onNurseContact }: TodaysVisitsProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "outline";
      case "in-progress":
        return "default";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Starting Soon";
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const getProgressPercentage = (timeline: any) => {
    const total = Object.keys(timeline).length;
    const completed = Object.values(timeline).filter((item: any) => item.completed).length;
    return (completed / total) * 100;
  };

  const getTimeElapsed = (startTime: string, currentTime: string, status: string) => {
    if (status === "scheduled") return "Not started";
    if (status === "completed") return "12h 0m";
    
    // Mock calculation - in real app would use actual times
    return "4h 30m";
  };

  const getTodaysStats = () => {
    const total = todaysVisits.length;
    const inProgress = todaysVisits.filter(v => v.status === "in-progress").length;
    const completed = todaysVisits.filter(v => v.status === "completed").length;
    const scheduled = todaysVisits.filter(v => v.status === "scheduled").length;
    
    return { total, inProgress, completed, scheduled };
  };

  const stats = getTodaysStats();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--color-brand-gradient-3)]">Today's Patient Visits</h1>
            <p className="text-muted-foreground">Monitor all IV therapy and home care visits for {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-[var(--color-brand-gradient-4)] text-[var(--color-brand-gradient-4)] hover:bg-[var(--color-brand-gradient-4)] hover:text-white">
              <Phone className="h-4 w-4 mr-2" />
              Call All Nurses
            </Button>
            <Button className="bg-gradient-to-r from-[var(--color-brand-gradient-4)] to-[var(--color-brand-gradient-5)] text-white border-0 hover:from-[var(--color-brand-gradient-3)] hover:to-[var(--color-brand-gradient-4)]">
              <Navigation className="h-4 w-4 mr-2" />
              Emergency Protocols
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-l-4 border-l-[var(--color-brand-gradient-4)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Visits</CardTitle>
              <Building2 className="h-4 w-4 text-[var(--color-brand-gradient-4)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--color-brand-gradient-4)]">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[var(--color-brand-gradient-5)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">In Progress</CardTitle>
              <Timer className="h-4 w-4 text-[var(--color-brand-gradient-5)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--color-brand-gradient-5)]">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[var(--color-brand-gradient-6)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-[var(--color-brand-gradient-6)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--color-brand-gradient-6)]">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">Finished shifts</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[var(--color-brand-gradient-3)]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Starting Soon</CardTitle>
              <Calendar className="h-4 w-4 text-[var(--color-brand-gradient-3)]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[var(--color-brand-gradient-3)]">{stats.scheduled}</div>
              <p className="text-xs text-muted-foreground">Not yet started</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Alert */}
        {stats.scheduled > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {stats.scheduled} nurse{stats.scheduled > 1 ? 's' : ''} {stats.scheduled > 1 ? 'are' : 'is'} scheduled to start soon. Ensure all preparations are complete.
            </AlertDescription>
          </Alert>
        )}

        {/* Visits List */}
        <div className="space-y-6">
          {todaysVisits.map((visit) => (
            <Card key={visit.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={visit.nurse.photo} />
                      <AvatarFallback>{visit.nurse.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{visit.nurse.name}</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3 w-3 text-yellow-500" />
                          <span>{visit.nurse.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{visit.job.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Stethoscope className="h-3 w-3" />
                        {visit.job.patientCode}
                      </div>
                      <p className="text-xs text-blue-600">{visit.job.medication}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge variant={getStatusVariant(visit.status)} className="mb-2">
                        {getStatusLabel(visit.status)}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {getTimeElapsed(visit.startTime, visit.currentTime, visit.status)}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => onNurseContact?.(visit.id)}>
                      <Phone className="h-4 w-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Shift Progress</span>
                    <span>{Math.round(getProgressPercentage(visit.timeline))}% Complete</span>
                  </div>
                  <Progress value={getProgressPercentage(visit.timeline)} className="h-2" />
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{visit.job.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${visit.job.hourlyRate}/hr</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span>{visit.job.totalHours} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{visit.nurse.phone}</span>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="font-medium mb-3">Shift Timeline</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    {Object.entries(visit.timeline).map(([key, item]: [string, any]) => (
                      <div key={key} className="flex items-center gap-2 p-2 rounded border">
                        {item.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/^pre/, 'Pre-')}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.completed ? item.time : 'Pending'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h4 className="font-medium mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {visit.nurse.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm">
                    View Full Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Send Message
                  </Button>
                  {visit.status === "in-progress" && (
                    <Button variant="outline" size="sm">
                      Check Status
                    </Button>
                  )}
                  {visit.status === "scheduled" && (
                    <Button variant="outline" size="sm">
                      Send Reminder
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Contact */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Emergency Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-red-600 mb-3">
              For immediate assistance with any visitor or patient-related emergencies
            </p>
            <div className="flex gap-2">
              <Button variant="destructive" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call Emergency: (555) 911-0000
              </Button>
              <Button variant="outline" size="sm">
                Alert All Nurses
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}