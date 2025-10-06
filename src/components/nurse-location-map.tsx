import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MapPin, Navigation, Users } from "lucide-react";
import { useState } from "react";

// Mock nurse location data with coordinates
const nurseLocations = [
  {
    id: 1,
    name: "Jane Doe, RN",
    status: "available",
    rating: 4.9,
    completedJobs: 87,
    location: { lat: 40.7580, lng: -73.9855, area: "Times Square, Manhattan" },
    specialties: ["IV Therapy", "Infusion"]
  },
  {
    id: 2,
    name: "Mike Johnson, RN",
    status: "on-job",
    rating: 4.7,
    completedJobs: 54,
    location: { lat: 40.7489, lng: -73.9680, area: "Midtown East, Manhattan" },
    specialties: ["PICC Line", "Central Line"]
  },
  {
    id: 3,
    name: "Sarah Wilson, RN",
    status: "available",
    rating: 4.8,
    completedJobs: 23,
    location: { lat: 40.7282, lng: -73.9942, area: "Greenwich Village, Manhattan" },
    specialties: ["IV Therapy", "Port Access"]
  },
  {
    id: 4,
    name: "Maria Santos, RN",
    status: "available",
    rating: 4.9,
    completedJobs: 156,
    location: { lat: 40.7614, lng: -73.9776, area: "Central Park South, Manhattan" },
    specialties: ["Infusion", "Biologic Experience"]
  },
  {
    id: 5,
    name: "David Chen, RN",
    status: "on-job",
    rating: 4.6,
    completedJobs: 34,
    location: { lat: 40.7831, lng: -73.9712, area: "Upper West Side, Manhattan" },
    specialties: ["Central Line", "PICC Line"]
  },
  {
    id: 6,
    name: "Lisa Anderson, RN",
    status: "available",
    rating: 4.8,
    completedJobs: 92,
    location: { lat: 40.7128, lng: -74.0060, area: "Financial District, Manhattan" },
    specialties: ["IV Therapy", "Home Health"]
  },
  {
    id: 7,
    name: "Robert Taylor, RN",
    status: "off-duty",
    rating: 4.7,
    completedJobs: 67,
    location: { lat: 40.7480, lng: -73.9862, area: "Chelsea, Manhattan" },
    specialties: ["Infusion", "Medication Admin"]
  },
  {
    id: 8,
    name: "Emily White, RN",
    status: "available",
    rating: 5.0,
    completedJobs: 112,
    location: { lat: 40.7589, lng: -73.9851, area: "Theater District, Manhattan" },
    specialties: ["IV Therapy", "Oncology"]
  },
  {
    id: 9,
    name: "James Martinez, RN",
    status: "on-job",
    rating: 4.9,
    completedJobs: 78,
    location: { lat: 40.7794, lng: -73.9632, area: "Upper East Side, Manhattan" },
    specialties: ["Port Access", "Infusion"]
  },
  {
    id: 10,
    name: "Amanda Brown, RN",
    status: "available",
    rating: 4.8,
    completedJobs: 45,
    location: { lat: 40.7209, lng: -73.9897, area: "Lower East Side, Manhattan" },
    specialties: ["PICC Line", "Home Health"]
  },
  {
    id: 11,
    name: "Kevin Lee, RN",
    status: "available",
    rating: 4.7,
    completedJobs: 89,
    location: { lat: 40.7400, lng: -73.9900, area: "East Village, Manhattan" },
    specialties: ["IV Therapy", "Central Line"]
  },
  {
    id: 12,
    name: "Jessica Garcia, RN",
    status: "on-job",
    rating: 4.9,
    completedJobs: 134,
    location: { lat: 40.7549, lng: -73.9840, area: "Midtown West, Manhattan" },
    specialties: ["Infusion", "Biologic Experience"]
  }
];

export function NurseLocationMap() {
  const [selectedNurse, setSelectedNurse] = useState<typeof nurseLocations[0] | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'on-job':
        return 'bg-blue-500';
      case 'off-duty':
        return 'bg-gray-400';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'on-job':
        return 'bg-blue-100 text-blue-800';
      case 'off-duty':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNurses = filterStatus === 'all' 
    ? nurseLocations 
    : nurseLocations.filter(n => n.status === filterStatus);

  const statusCounts = {
    available: nurseLocations.filter(n => n.status === 'available').length,
    onJob: nurseLocations.filter(n => n.status === 'on-job').length,
    offDuty: nurseLocations.filter(n => n.status === 'off-duty').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold">Nurse Location Map</h2>
        <p className="text-muted-foreground">Real-time view of nurse contractor locations</p>
      </div>

      {/* Status Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('available')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Nurses</CardTitle>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.available}</div>
            <p className="text-xs text-muted-foreground">Ready for assignments</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('on-job')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Active Visit</CardTitle>
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.onJob}</div>
            <p className="text-xs text-muted-foreground">Currently with patients</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setFilterStatus('off-duty')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Off Duty</CardTitle>
            <div className="h-3 w-3 rounded-full bg-gray-400"></div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{statusCounts.offDuty}</div>
            <p className="text-xs text-muted-foreground">Not currently working</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Map Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Manhattan Coverage Map</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <button 
                  onClick={() => setFilterStatus('all')}
                  className="text-blue-600 hover:underline"
                >
                  Show All ({nurseLocations.length})
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Simplified map visualization */}
            <div className="relative h-[600px] bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-border overflow-hidden">
              {/* Map grid */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div key={i} className="border border-gray-300"></div>
                ))}
              </div>

              {/* Map label */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm">
                <p className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  Manhattan, NY
                </p>
              </div>

              {/* Legend */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm space-y-1">
                <p className="text-xs font-medium mb-2">Status</p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  <span>On Visit</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                  <span>Off Duty</span>
                </div>
              </div>

              {/* Nurse markers - positioned relatively on the map */}
              {filteredNurses.map((nurse, index) => {
                // Calculate relative position based on lat/lng (simplified for visualization)
                const normalizedLat = ((nurse.location.lat - 40.70) / 0.10) * 100;
                const normalizedLng = ((nurse.location.lng + 74.02) / 0.10) * 100;
                
                const top = `${100 - normalizedLat}%`;
                const left = `${normalizedLng}%`;

                return (
                  <div
                    key={nurse.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{ top, left }}
                    onClick={() => setSelectedNurse(nurse)}
                  >
                    {/* Pulse animation for available nurses */}
                    {nurse.status === 'available' && (
                      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
                    )}
                    
                    {/* Marker dot */}
                    <div className={`relative h-4 w-4 rounded-full ${getStatusColor(nurse.status)} border-2 border-white shadow-lg group-hover:scale-150 transition-transform z-10`}>
                    </div>

                    {/* Hover tooltip */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border">
                        <p className="text-xs font-medium">{nurse.name}</p>
                        <p className="text-xs text-muted-foreground">{nurse.location.area}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map info */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Interactive Map:</strong> Click on any marker to view nurse details. The heat distribution shows nurse availability across Manhattan.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Nurse Details Panel */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedNurse ? 'Nurse Details' : 'Select a Nurse'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedNurse ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{selectedNurse.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{selectedNurse.name}</p>
                    <Badge className={getStatusBadge(selectedNurse.status)}>
                      {selectedNurse.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating:</span>
                    <span className="font-medium">⭐ {selectedNurse.rating}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed Visits:</span>
                    <span className="font-medium">{selectedNurse.completedJobs}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Location</p>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{selectedNurse.location.area}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedNurse.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedNurse(null)}
                  className="w-full mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Close Details
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">Click on a marker on the map to view nurse details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
