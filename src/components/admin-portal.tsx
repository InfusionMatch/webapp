import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { NurseLocationMap } from "./nurse-location-map";
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  Filter,
  MoreVertical,
  Eye,
  UserCheck,
  UserX,
  MapPin
} from "lucide-react";

const mockStats = {
  totalNurses: 1247,
  activeSuppliers: 89,
  totalJobs: 156,
  completedJobs: 1289
};

const mockNurses = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane.doe@email.com",
    rating: 4.9,
    completedJobs: 87,
    status: "active",
    credentials: "verified",
    joinDate: "2024-03-15"
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike.j@email.com",
    rating: 4.7,
    completedJobs: 54,
    status: "active",
    credentials: "pending",
    joinDate: "2024-07-22"
  },
  {
    id: 3,
    name: "Sarah Wilson",
    email: "sarah.w@email.com",
    rating: 4.8,
    completedJobs: 23,
    status: "suspended",
    credentials: "verified",
    joinDate: "2024-11-10"
  }
];

const mockSuppliers = [
  {
    id: 1,
    name: "St. Mary's Hospital",
    contact: "hr@stmarys.com",
    activeJobs: 12,
    totalPosted: 145,
    status: "active",
    joinDate: "2023-01-15"
  },
  {
    id: 2,
    name: "City General Medical",
    contact: "staffing@citygeneral.com",
    activeJobs: 8,
    totalPosted: 89,
    status: "active",
    joinDate: "2023-05-20"
  },
  {
    id: 3,
    name: "Regional Health Center",
    contact: "jobs@regional.com",
    activeJobs: 15,
    totalPosted: 234,
    status: "active",
    joinDate: "2022-11-03"
  }
];

const mockPendingCredentials = [
  {
    id: 1,
    nurseName: "Alex Rodriguez",
    document: "ACLS Certification",
    submittedDate: "2025-09-18",
    status: "pending"
  },
  {
    id: 2,
    nurseName: "Lisa Chen",
    document: "Background Check",
    submittedDate: "2025-09-17",
    status: "pending"
  },
  {
    id: 3,
    nurseName: "David Brown",
    document: "TB Test Results",
    submittedDate: "2025-09-16",
    status: "pending"
  }
];

export function AdminPortal() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Admin Portal</h1>
            <p className="text-muted-foreground">Manage platform users and oversee operations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Export Data</Button>
            <Button>Generate Report</Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total Nurses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalNurses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Active Pharmacies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.activeSuppliers}</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.totalJobs}</div>
              <p className="text-xs text-muted-foreground">85% fill rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Jobs Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.completedJobs.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month: 342</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="nurses" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="nurses">Nurses</TabsTrigger>
            <TabsTrigger value="nurse-map">Nurse Map</TabsTrigger>
            <TabsTrigger value="suppliers">Pharmacies</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Nurses Tab */}
          <TabsContent value="nurses" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <CardTitle>Nurse Management</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search nurses..." className="pl-10 w-full md:w-64" />
                    </div>
                    <Select>
                      <SelectTrigger className="w-32">
                        <Filter className="h-4 w-4" />
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nurse</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Jobs</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Credentials</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockNurses.map((nurse) => (
                      <TableRow key={nurse.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{nurse.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{nurse.name}</p>
                              <p className="text-sm text-muted-foreground">{nurse.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <span>{nurse.rating}</span>
                            <span className="text-muted-foreground">★</span>
                          </div>
                        </TableCell>
                        <TableCell>{nurse.completedJobs}</TableCell>
                        <TableCell>
                          <Badge variant={nurse.status === "active" ? "default" : nurse.status === "pending" ? "secondary" : "destructive"}>
                            {nurse.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={nurse.credentials === "verified" ? "default" : "secondary"}>
                            {nurse.credentials}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <UserCheck className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nurse Location Map Tab */}
          <TabsContent value="nurse-map">
            <NurseLocationMap />
          </TabsContent>

          {/* Pharmacies Tab */}
          <TabsContent value="suppliers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pharmacy Partner Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Organization</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Active Jobs</TableHead>
                      <TableHead>Total Posted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{supplier.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{supplier.name}</p>
                              <p className="text-sm text-muted-foreground">Since {supplier.joinDate}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.contact}</TableCell>
                        <TableCell>{supplier.activeJobs}</TableCell>
                        <TableCell>{supplier.totalPosted}</TableCell>
                        <TableCell>
                          <Badge variant="default">{supplier.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Credentials Tab */}
          <TabsContent value="credentials" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Pending Credential Reviews
                  </CardTitle>
                  <Badge variant="destructive">{mockPendingCredentials.length}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nurse</TableHead>
                      <TableHead>Document Type</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockPendingCredentials.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nurseName}</TableCell>
                        <TableCell>{item.document}</TableCell>
                        <TableCell>{item.submittedDate}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <UserX className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Job Fill Rate</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Response Time</span>
                      <span className="font-medium">2.3 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span>User Satisfaction</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Growth</span>
                      <span className="font-medium text-green-600">+12%</span>
                    </div>
                  </div>
                  <Button className="w-full">Generate Detailed Report</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly Revenue</span>
                      <span className="font-medium">$125,430</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fees</span>
                      <span className="font-medium">$12,543</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Growth Rate</span>
                      <span className="font-medium text-green-600">+18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Job Value</span>
                      <span className="font-medium">$420</span>
                    </div>
                  </div>
                  <Button className="w-full">Download Financial Report</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}