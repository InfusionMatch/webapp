import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ArrowUpDown } from "lucide-react";
import { NurseJobCard, Job } from "./nurse-job-card";

interface JobListWithSortProps {
  jobs: Job[];
  onJobClick: (jobId: number) => void;
}

export function JobListWithSort({ jobs, onJobClick }: JobListWithSortProps) {
  const [sortBy, setSortBy] = useState<'distance' | 'pay' | 'type' | 'date'>('distance');

  // Sort jobs based on selected criteria
  const sortedJobs = useMemo(() => {
    const jobsCopy = [...jobs];
    
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
  }, [jobs, sortBy]);

  return (
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
          {sortedJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No available visits at this time.
            </div>
          ) : (
            sortedJobs.map((job) => (
              <NurseJobCard
                key={job.id}
                job={job}
                onAcceptVisit={() => onJobClick(job.id)}
                onViewDetails={() => onJobClick(job.id)}
              />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
