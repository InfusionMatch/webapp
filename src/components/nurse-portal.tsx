import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { MapPin, Calendar, Clock, DollarSign, Star, CheckCircle, FileText, Award, GraduationCap, ArrowUpDown } from "lucide-react";
import { UpcomingShifts } from "./upcoming-shifts";
import { NurseOnboardingTasks } from "./nurse-onboarding-tasks";
import { WelcomeSplash } from "./welcome-splash";

const mockJobs = [
  {
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
    distance: "2.3 miles"
  },
  {
    id: 2,
    title: "PICC Line Dressing Change",
    patientCode: "Patient M-1053",
    location: "West Side Residential",
    date: "2025-09-23",
    timeWindow: "Morning Preferred 8:00 AM - 12:00 PM",
    duration: "45 minutes",
    hourlyRate: 48,
    totalPay: 48,
    medication: "Sterile dressing change with Biopatch",
    requirements: ["Central Line Care", "Sterile Technique", "PICC Experience"],
    distance: "4.1 miles"
  },
  {
    id: 3,
    title: "IV Hydration Therapy",
    patientCode: "Patient K-7291",
    location: "North Suburbs",
    date: "2025-09-24",
    timeWindow: "Afternoon 1:00 PM - 5:00 PM",
    duration: "1.5 hours",
    hourlyRate: 52,
    totalPay: 78,
    medication: "Normal Saline 1000mL with vitamins",
    requirements: ["IV Therapy", "Home Health Experience"],
    distance: "6.8 miles"
  },
  {
    id: 4,
    title: "Central Line Maintenance",
    patientCode: "Patient A-4562",
    location: "East Side",
    date: "2025-09-26",
    timeWindow: "Flexible 10:00 AM - 4:00 PM",
    duration: "1 hour",
    hourlyRate: 50,
    totalPay: 50,
    medication: "Heparin flush and dressing change",
    requirements: ["Central Line Certified", "Port Access Experience", "Oncology Experience Preferred"],
    distance: "3.2 miles"
  }
];

const credentials = [
  { name: "RN License", status: "verified", expiry: "2026-03-15" },
  { name: "BLS Certification", status: "verified", expiry: "2025-12-01" },
  { name: "ACLS Certification", status: "verified", expiry: "2026-01-20" },
  { name: "Background Check", status: "verified", expiry: "2025-11-30" },
  { name: "TB Test", status: "pending", expiry: null }
];

const completedJobs = [
  {
    id: 1,
    title: "IV Infusion - Rituximab",
    location: "Downtown Area",
    date: "2025-09-15",
    rating: 4.8,
    earnings: 220
  },
  {
    id: 2,
    title: "Port Access & Flush",
    location: "West Side",
    date: "2025-09-10",
    rating: 5.0,
    earnings: 65
  }
];

interface NursePortalProps {
  onJobClick?: () => void;
  onEditProfile?: () => void;
}

export function NursePortal({ onJobClick, onEditProfile }: NursePortalProps) {
  // Check if user has already seen the welcome splash
  const [showWelcomeSplash, setShowWelcomeSplash] = useState(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    return hasSeenWelcome !== 'true';
  });

  // Sorting state
  const [sortBy, setSortBy] = useState<'distance' | 'pay' | 'type' | 'date'>('distance');

  const nurseData = {
    name: "Jane",
    completedTasks: 6,
    totalTasks: 9,
    readyForFirstJob: false,
    pendingVerifications: [
      "License verification (24-48 hours)",
      "Background check (3-5 business days)"
    ],
    nextSteps: [
      "Complete HIPAA training",
      "Upload IV therapy certification",
      "Review platform infusion protocols"
    ]
  };

  // Sort jobs based on selected criteria
  const sortedJobs = useMemo(() => {
    const jobsCopy = [...mockJobs];
    
    switch (sortBy) {
      case 'distance':
        return jobsCopy.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      case 'pay':
        return jobsCopy.sort((a, b) => b.totalPay - a.totalPay);
      case 'type':
        return jobsCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'date':
        return jobsCopy.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      default:
        return jobsCopy;
    }
  }, [sortBy]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header with Profile */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <Avatar className="h-16 w-16 md:h-20 md:w-20">
                <AvatarImage src="https://images.unsplash.com/photo-1622567182060-95c7dcf6a2f3?w=100&h=100&fit=crop&crop=face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div>
                  <h1 className="text-2xl">Welcome back, Jane Doe</h1>
                  <p className="text-muted-foreground">Registered Nurse • IV Therapy Specialist</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    4.9 Rating
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    143 Visits Completed
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    $8,750 This Month
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={onEditProfile}>Edit Profile</Button>
            </div>

            {/* Progress to First Job */}
            {!nurseData.readyForFirstJob && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Progress to First Visit</h3>
                  <Badge variant={nurseData.readyForFirstJob ? "default" : "secondary"}>
                    {nurseData.completedTasks}/{nurseData.totalTasks} Tasks
                  </Badge>
                </div>
                <Progress value={(nurseData.completedTasks / nurseData.totalTasks) * 100} className="h-3 mb-2" />
                <p className="text-sm text-muted-foreground">
                  {nurseData.readyForFirstJob 
                    ? "🎉 Ready to accept your first patient visit!" 
                    : `Complete ${nurseData.totalTasks - nurseData.completedTasks} more onboarding tasks to start accepting visits.`
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="available-jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="available-jobs">Available Visits</TabsTrigger>
            <TabsTrigger value="upcoming-shifts">My Visits</TabsTrigger>
            <TabsTrigger value="availability">My Availability</TabsTrigger>
            <TabsTrigger value="onboarding">
              <GraduationCap className="h-4 w-4 mr-2" />
              Onboarding
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="available-jobs" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Available Jobs */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <CardTitle>Available Patient Visits</CardTitle>
                    <div className="flex items-center gap-2">
                      <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="distance">Distance (Nearest)</SelectItem>
                          <SelectItem value="pay">Pay (Highest)</SelectItem>
                          <SelectItem value="type">Type (A-Z)</SelectItem>
                          <SelectItem value="date">Date (Earliest)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sortedJobs.map((job) => (
                      <div key={job.id} className="rounded-lg border p-4 space-y-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="font-medium text-primary">{job.patientCode}</p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {job.location} • {job.distance} away
                            </div>
                            <p className="text-sm text-blue-600">{job.medication}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-green-600">${job.totalPay}</div>
                            <div className="text-sm text-muted-foreground">${job.hourlyRate}/hr • {job.duration}</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            {job.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {job.timeWindow}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Requirements:</p>
                          <div className="flex flex-wrap gap-1">
                            {job.requirements.map((req, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button className="flex-1" onClick={() => onJobClick?.()}>Accept Visit</Button>
                          <Button variant="outline">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar */}
              <div className="space-y-6">
            {/* Credentials Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Credentials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {credentials.map((credential, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{credential.name}</p>
                        {credential.expiry && (
                          <p className="text-xs text-muted-foreground">
                            Expires: {credential.expiry}
                          </p>
                        )}
                      </div>
                      <Badge 
                        variant={credential.status === "verified" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {credential.status}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <FileText className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Onboarding Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{Math.round((nurseData.completedTasks / nurseData.totalTasks) * 100)}% Complete</span>
                    <span className="text-muted-foreground">{nurseData.totalTasks - nurseData.completedTasks} tasks remaining</span>
                  </div>
                  <Progress value={(nurseData.completedTasks / nurseData.totalTasks) * 100} className="h-2" />
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">Complete onboarding to access all visits:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• HIPAA training required</li>
                    <li>• Upload IV therapy certification</li>
                    <li>• Platform training modules</li>
                  </ul>
                </div>
                <Button size="sm" className="w-full">
                  <GraduationCap className="h-4 w-4 mr-2" />
                  View Onboarding Tasks
                </Button>
              </CardContent>
            </Card>

            {/* Recent Visits */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Completed Visits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedJobs.map((job) => (
                    <div key={job.id} className="space-y-2 pb-3 border-b last:border-b-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium">{job.title}</p>
                          <p className="text-xs text-muted-foreground">{job.location}</p>
                          <p className="text-xs text-muted-foreground">{job.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs">
                            <Star className="h-3 w-3 text-yellow-500" />
                            {job.rating}
                          </div>
                          <p className="text-xs font-medium text-green-600">+${job.earnings}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View All Visits
                </Button>
              </CardContent>
            </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming-shifts">
            <UpcomingShifts onShiftClick={onJobClick} />
          </TabsContent>
          
          <TabsContent value="availability">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Clock className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Availability Set Per Visit</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  You'll provide your availability when accepting each visit. This allows you to coordinate specific time slots with each patient during the confirmation process.
                </p>
                <Badge variant="outline" className="text-sm">
                  <CheckCircle className="h-3 w-3 mr-2" />
                  Flexible scheduling per patient
                </Badge>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="onboarding">
            <NurseOnboardingTasks />
          </TabsContent>
        </Tabs>

        {/* Welcome Splash */}
        <WelcomeSplash 
          isOpen={showWelcomeSplash} 
          onClose={() => {
            setShowWelcomeSplash(false);
            localStorage.setItem('hasSeenWelcome', 'true');
          }}
          nurseData={nurseData}
        />
      </div>
    </div>
  );
}