import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Plus, MapPin, Calendar, Clock, DollarSign, Users, TrendingUp, Eye, Activity } from "lucide-react";
import { TodaysVisits } from "./todays-visits";
import { PostNewJob } from "./post-new-job";

const mockJobs = [
  {
    id: 1,
    title: "IV Infusion - Remicade",
    patientCode: "Patient R-2847",
    location: "Downtown Area",
    date: "2025-09-25",
    timeWindow: "9:00 AM - 3:00 PM",
    medication: "Infliximab (Remicade) 400mg",
    hourlyRate: 55,
    totalPay: 165,
    duration: "2-3 hours",
    status: "assigned",
    applicants: 8,
    assignedNurse: "Jane Doe, RN"
  },
  {
    id: 2,
    title: "PICC Line Dressing Change",
    patientCode: "Patient M-1053",
    location: "West Side Residential",
    date: "2025-09-23",
    timeWindow: "8:00 AM - 12:00 PM",
    medication: "Sterile dressing change with Biopatch",
    hourlyRate: 48,
    totalPay: 48,
    duration: "45 minutes",
    status: "completed",
    applicants: 5,
    assignedNurse: "Sarah Mitchell, RN"
  },
  {
    id: 3,
    title: "Central Line Maintenance",
    patientCode: "Patient A-4562",
    location: "East Side",
    date: "2025-09-26",
    timeWindow: "10:00 AM - 4:00 PM",
    medication: "Heparin flush and dressing change",
    hourlyRate: 50,
    totalPay: 50,
    duration: "1 hour",
    status: "open",
    applicants: 3,
    assignedNurse: null
  },
  {
    id: 4,
    title: "IV Hydration Therapy",
    patientCode: "Patient K-7291",
    location: "North Suburbs",
    date: "2025-09-27",
    timeWindow: "1:00 PM - 5:00 PM",
    medication: "Normal Saline 1000mL with vitamins",
    hourlyRate: 52,
    totalPay: 78,
    duration: "1.5 hours",
    status: "assigned",
    applicants: 6,
    assignedNurse: "Maria Santos, RN"
  }
];

interface SupplierDashboardProps {
  onJobClick?: () => void;
}

export function SupplierDashboard({ onJobClick }: SupplierDashboardProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "open":
        return "destructive";
      case "assigned":
        return "default";
      case "completed":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "Needs Nurse";
      case "assigned":
        return "Assigned";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Pharmacy Dashboard</h1>
            <p className="text-muted-foreground">Manage your patient IV therapy and home care visits</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Today's Visits
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Request New Visit
            </Button>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="todays-visits">Today's Visits</TabsTrigger>
            <TabsTrigger value="post-job">Request Visit</TabsTrigger>
            <TabsTrigger value="favorite-nurses">Favorite Nurses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Active Visits</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">23</div>
                  <p className="text-xs text-muted-foreground">+4 from last week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Nurse Applications</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">47</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Completed Visits</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">87</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Fill Success Rate</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">92%</div>
                  <p className="text-xs text-muted-foreground">+7% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Visit Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Your Patient Visit Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockJobs.map((job) => (
                    <div key={job.id} className="rounded-lg border p-4 space-y-3 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => onJobClick?.()}>
                      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-blue-600">{job.medication}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {job.patientCode} • {job.location}
                          </div>
                          {job.assignedNurse && (
                            <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                              <Users className="h-3 w-3" />
                              Assigned to: {job.assignedNurse}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 text-right">
                          <Badge variant={getStatusVariant(job.status)}>
                            {getStatusLabel(job.status)}
                          </Badge>
                          <div className="text-sm font-medium">${job.totalPay}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {job.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {job.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-muted-foreground" />
                          ${job.hourlyRate}/hr
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          {job.applicants} applicants
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                          {job.status === "open" ? "View Applications" : job.status === "assigned" ? "View Nurse Profile" : "View Details"}
                        </Button>
                        <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>Edit Visit</Button>
                        {job.status === "open" && (
                          <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>Cancel Request</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="todays-visits">
            <TodaysVisits />
          </TabsContent>
          
          <TabsContent value="post-job">
            <PostNewJob />
          </TabsContent>
          
          <TabsContent value="favorite-nurses">
            <Card>
              <CardHeader>
                <CardTitle>Your Favorite Nurses</CardTitle>
                <p className="text-sm text-muted-foreground">Nurses you've worked with before and want to prioritize for future visits</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Jane Doe, RN", specialties: ["IV Therapy", "Infusion", "PICC Care"], rating: 4.9, completedVisits: 23, lastVisit: "2025-09-20" },
                    { name: "Sarah Mitchell, RN", specialties: ["Central Line Care", "Port Access", "Chemotherapy"], rating: 4.8, completedVisits: 18, lastVisit: "2025-09-18" },
                    { name: "Maria Santos, RN", specialties: ["IV Hydration", "Home Health", "Pediatric"], rating: 4.9, completedVisits: 31, lastVisit: "2025-09-15" }
                  ].map((nurse, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{nurse.name}</h4>
                          <p className="text-sm text-muted-foreground">{nurse.completedVisits} visits completed • Last visit: {nurse.lastVisit}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">★ {nurse.rating}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {nurse.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">{specialty}</Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Request for Visit</Button>
                        <Button size="sm" variant="outline">View Profile</Button>
                        <Button size="sm" variant="outline">Remove from Favorites</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}