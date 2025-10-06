import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Star, CheckCircle, DollarSign } from "lucide-react";

export interface NurseStats {
  name: string;
  title: string;
  rating: number;
  visitsCompleted: number;
  monthlyEarnings: number;
  avatarUrl?: string;
}

export interface OnboardingProgress {
  completedTasks: number;
  totalTasks: number;
  readyForFirstJob: boolean;
}

interface NurseStatsHeaderProps {
  stats: NurseStats;
  onboardingProgress?: OnboardingProgress;
  onEditProfile?: () => void;
}

export function NurseStatsHeader({ stats, onboardingProgress, onEditProfile }: NurseStatsHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Avatar className="h-16 w-16 md:h-20 md:w-20">
            <AvatarImage src={stats.avatarUrl} />
            <AvatarFallback>{stats.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div>
              <h1 className="text-2xl">Welcome back, {stats.name}</h1>
              <p className="text-muted-foreground">{stats.title}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                {stats.rating} Rating
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {stats.visitsCompleted} Visits Completed
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                ${stats.monthlyEarnings.toLocaleString()} This Month
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={onEditProfile}>Edit Profile</Button>
        </div>

        {onboardingProgress && !onboardingProgress.readyForFirstJob && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Progress to First Visit</h3>
              <Badge variant={onboardingProgress.readyForFirstJob ? "default" : "secondary"}>
                {onboardingProgress.completedTasks}/{onboardingProgress.totalTasks} Tasks
              </Badge>
            </div>
            <Progress value={(onboardingProgress.completedTasks / onboardingProgress.totalTasks) * 100} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {onboardingProgress.readyForFirstJob 
                ? "🎉 Ready to accept your first patient visit!" 
                : `Complete ${onboardingProgress.totalTasks - onboardingProgress.completedTasks} more onboarding tasks to start accepting visits.`
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
