import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { MapPin, Calendar, Clock } from "lucide-react";

export interface Job {
  id: number;
  title: string;
  patientCode: string;
  location: string;
  date: string;
  timeWindow: string;
  duration: string;
  hourlyRate: number;
  totalPay: number;
  medication: string;
  requirements: string[];
  distance: string;
}

interface NurseJobCardProps {
  job: Job;
  onAcceptVisit: () => void;
  onViewDetails: () => void;
}

export function NurseJobCard({ job, onAcceptVisit, onViewDetails }: NurseJobCardProps) {
  return (
    <div className="rounded-lg border p-4 space-y-4 bg-white hover:shadow-md transition-shadow">
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
        <Button className="flex-1" onClick={onAcceptVisit}>Accept Visit</Button>
        <Button variant="outline" onClick={onViewDetails}>View Details</Button>
      </div>
    </div>
  );
}
