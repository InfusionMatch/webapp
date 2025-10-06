import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  User, 
  Calendar, 
  MapPin, 
  FileText,
  Plus,
  Eye,
  Clock,
  Activity
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";

// Mock patient data with visit history
const mockPatients = [
  {
    id: 'P-2847',
    name: 'Maria Rodriguez',
    address: '1456 Oak Street, Apt 3B, Downtown, NY 10001',
    phone: '(555) 123-4567',
    totalVisits: 24,
    lastVisit: '2025-09-15',
    upcomingVisit: '2025-09-25',
    status: 'active',
    primaryMedication: 'Infliximab (Remicade) 400mg',
    diagnoses: ['Crohn\'s Disease'],
    visits: [
      {
        id: 1,
        date: '2025-09-15',
        nurse: 'Jane Doe, RN',
        medication: 'Infliximab (Remicade) 400mg',
        duration: '2.5 hours',
        status: 'completed',
        notes: 'Infusion completed without complications. Patient tolerated treatment well. No adverse reactions observed. Pre-medications administered as ordered.',
        vitals: {
          preInfusion: 'BP: 118/76, HR: 72, Temp: 98.4°F',
          postInfusion: 'BP: 120/78, HR: 74, Temp: 98.6°F'
        }
      },
      {
        id: 2,
        date: '2025-08-18',
        nurse: 'Sarah Mitchell, RN',
        medication: 'Infliximab (Remicade) 400mg',
        duration: '2.75 hours',
        status: 'completed',
        notes: 'Routine infusion. Patient reported feeling well. No issues during administration.',
        vitals: {
          preInfusion: 'BP: 116/74, HR: 70, Temp: 98.2°F',
          postInfusion: 'BP: 118/76, HR: 72, Temp: 98.4°F'
        }
      }
    ]
  },
  {
    id: 'P-1053',
    name: 'Robert Chen',
    address: '789 Maple Ave, West Side, NY 10002',
    phone: '(555) 987-1234',
    totalVisits: 8,
    lastVisit: '2025-09-10',
    upcomingVisit: '2025-09-23',
    status: 'active',
    primaryMedication: 'PICC Line Maintenance',
    diagnoses: ['Chronic UTI', 'Antibiotic Therapy'],
    visits: [
      {
        id: 1,
        date: '2025-09-10',
        nurse: 'Maria Santos, RN',
        medication: 'Sterile dressing change with Biopatch',
        duration: '45 minutes',
        status: 'completed',
        notes: 'PICC line site clean and dry. No signs of infection. Dressing changed per protocol.',
        vitals: {
          preInfusion: 'BP: 128/82, HR: 78, Temp: 98.6°F',
          postInfusion: 'BP: 126/80, HR: 76, Temp: 98.6°F'
        }
      }
    ]
  },
  {
    id: 'P-4562',
    name: 'Linda Thompson',
    address: '2341 Pine Street, East Side, NY 10003',
    phone: '(555) 456-7890',
    totalVisits: 15,
    lastVisit: '2025-09-05',
    upcomingVisit: null,
    status: 'inactive',
    primaryMedication: 'Heparin flush',
    diagnoses: ['Port Maintenance', 'Cancer Survivor'],
    visits: [
      {
        id: 1,
        date: '2025-09-05',
        nurse: 'Jane Doe, RN',
        medication: 'Heparin flush and dressing change',
        duration: '1 hour',
        status: 'completed',
        notes: 'Port accessed successfully. Flush completed without resistance. Patient educated on signs of infection.',
        vitals: {
          preInfusion: 'BP: 122/78, HR: 74, Temp: 98.4°F',
          postInfusion: 'BP: 120/76, HR: 72, Temp: 98.4°F'
        }
      }
    ]
  },
  {
    id: 'P-7291',
    name: 'James Patterson',
    address: '567 Elm Drive, North Suburbs, NY 10004',
    phone: '(555) 234-5678',
    totalVisits: 6,
    lastVisit: '2025-08-28',
    upcomingVisit: '2025-09-24',
    status: 'active',
    primaryMedication: 'Normal Saline with vitamins',
    diagnoses: ['Dehydration', 'Vitamin Deficiency'],
    visits: [
      {
        id: 1,
        date: '2025-08-28',
        nurse: 'Sarah Mitchell, RN',
        medication: 'Normal Saline 1000mL with vitamins',
        duration: '1.5 hours',
        status: 'completed',
        notes: 'IV hydration therapy completed. Patient reported feeling improved. No complications.',
        vitals: {
          preInfusion: 'BP: 110/70, HR: 82, Temp: 98.2°F',
          postInfusion: 'BP: 118/74, HR: 76, Temp: 98.4°F'
        }
      }
    ]
  }
];

interface PharmacyPatientsProps {
  onRebookVisit?: (patient: typeof mockPatients[0]) => void;
}

export function PharmacyPatients({ onRebookVisit }: PharmacyPatientsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null);

  // Filter and sort patients
  const filteredPatients = mockPatients
    .filter(patient => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filterStatus === 'all' || 
        patient.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastVisit':
          return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
        case 'totalVisits':
          return b.totalVisits - a.totalVisits;
        default:
          return 0;
      }
    });

  if (selectedPatient) {
    return (
      <div className="space-y-6">
        {/* Patient Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setSelectedPatient(null)}
          >
            ← Back to All Patients
          </Button>
          <Button 
            onClick={() => onRebookVisit?.(selectedPatient)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Re-book Visit
          </Button>
        </div>

        {/* Patient Info Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{selectedPatient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{selectedPatient.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Patient ID: {selectedPatient.id}</p>
                  <Badge className={selectedPatient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {selectedPatient.status}
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-sm">{selectedPatient.address}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-sm">{selectedPatient.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Primary Medication</p>
                <p className="text-sm">{selectedPatient.primaryMedication}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Diagnoses</p>
                <p className="text-sm">{selectedPatient.diagnoses.join(', ')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Visits</p>
                <p className="text-sm">{selectedPatient.totalVisits} visits</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Last Visit</p>
                <p className="text-sm">{selectedPatient.lastVisit}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visit History */}
        <Card>
          <CardHeader>
            <CardTitle>Visit History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedPatient.visits.map((visit) => (
                <Card key={visit.id} className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{visit.date}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">{visit.status}</Badge>
                      </div>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Nurse</p>
                          <p className="text-sm">{visit.nurse}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Duration</p>
                          <p className="text-sm">{visit.duration}</p>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Medication/Treatment</p>
                        <p className="text-sm">{visit.medication}</p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Visit Notes</p>
                        <p className="text-sm bg-muted/50 p-3 rounded-md">{visit.notes}</p>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Pre-Infusion Vitals</p>
                          <p className="text-sm bg-blue-50 p-2 rounded-md">{visit.vitals.preInfusion}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">Post-Infusion Vitals</p>
                          <p className="text-sm bg-blue-50 p-2 rounded-md">{visit.vitals.postInfusion}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold">My Patients</h2>
        <p className="text-muted-foreground">Manage all patients and their visit history</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, patient ID, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Patients</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name (A-Z)</SelectItem>
                <SelectItem value="lastVisit">Last Visit</SelectItem>
                <SelectItem value="totalVisits">Total Visits</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{patient.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{patient.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {patient.id}
                      </Badge>
                      <Badge className={patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {patient.status}
                      </Badge>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{patient.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>{patient.totalVisits} visits</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Last: {patient.lastVisit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span className="truncate">{patient.primaryMedication}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onRebookVisit?.(patient)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Re-book
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No patients found matching your search.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
