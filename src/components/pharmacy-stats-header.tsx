import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Briefcase, CheckCircle, DollarSign, TrendingUp } from "lucide-react";

export interface PharmacyStats {
  businessName: string;
  activeJobs: number;
  completedVisits: number;
  totalSpent: number;
  averageRating: number;
  pendingApplications: number;
}

interface PharmacyStatsHeaderProps {
  stats: PharmacyStats;
  onPostJob?: () => void;
}

export function PharmacyStatsHeader({ stats, onPostJob }: PharmacyStatsHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl">{stats.businessName}</h1>
            <p className="text-muted-foreground">Pharmacy Partner Portal</p>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="font-semibold">{stats.activeJobs}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="font-semibold">{stats.completedVisits}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg bg-purple-50 px-4 py-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="font-semibold">${stats.totalSpent.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2">
              <TrendingUp className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Rating</p>
                <p className="font-semibold">{stats.averageRating.toFixed(1)} ⭐</p>
              </div>
            </div>
          </div>
          
          {onPostJob && (
            <Button onClick={onPostJob} size="lg">
              Post New Visit
            </Button>
          )}
        </div>
        
        {stats.pendingApplications > 0 && (
          <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <p className="text-sm">
              <Badge className="mr-2">{stats.pendingApplications}</Badge>
              new applications waiting for review
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
