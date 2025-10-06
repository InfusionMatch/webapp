import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Calendar, Clock, DollarSign, Users } from "lucide-react";

export interface PharmacyJob {
  id: string;
  title: string;
  patientCode: string;
  location: string;
  date: string;
  timeWindow: string;
  duration: string;
  hourlyRate: number;
  totalPay: number;
  medication: string;
  status: 'draft' | 'posted' | 'assigned' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  applicantCount: number;
  assignedNurse?: {
    name: string;
    rating: number;
  };
}

interface PharmacyJobCardProps {
  job: PharmacyJob;
  onViewDetails: () => void;
  onViewApplications?: () => void;
}

export function PharmacyJobCard({ job, onViewDetails, onViewApplications }: PharmacyJobCardProps) {
  const getStatusColor = (status: PharmacyJob['status']) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      posted: 'bg-blue-100 text-blue-800',
      assigned: 'bg-purple-100 text-purple-800',
      confirmed: 'bg-green-100 text-green-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.draft;
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{job.title}</h3>
              <Badge className={getStatusColor(job.status)}>
                {job.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="font-medium text-primary">{job.patientCode}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {job.location}
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
        
        {job.assignedNurse && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <p className="text-sm font-medium">
              Assigned to: {job.assignedNurse.name}
            </p>
            <p className="text-xs text-muted-foreground">
              Rating: {job.assignedNurse.rating} ⭐
            </p>
          </div>
        )}
        
        {job.applicantCount > 0 && !job.assignedNurse && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="font-medium">{job.applicantCount} nurse{job.applicantCount !== 1 ? 's' : ''} applied</span>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button className="flex-1" onClick={onViewDetails}>
            View Details
          </Button>
          {job.applicantCount > 0 && onViewApplications && (
            <Button variant="outline" onClick={onViewApplications}>
              Review Applications ({job.applicantCount})
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
