import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  Heart, 
  CheckCircle, 
  AlertTriangle, 
  Users, 
  Award, 
  TrendingUp,
  ArrowRight,
  Sparkles
} from "lucide-react";

interface WelcomeSplashProps {
  isOpen: boolean;
  onClose: () => void;
  nurseData: {
    name: string;
    completedTasks: number;
    totalTasks: number;
    readyForFirstJob: boolean;
    pendingVerifications: string[];
    nextSteps: string[];
  };
}

export function WelcomeSplash({ isOpen, onClose, nurseData }: WelcomeSplashProps) {
  const progressPercentage = (nurseData.completedTasks / nurseData.totalTasks) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="h-10 w-10 text-white" />
          </div>
          <DialogTitle className="text-2xl">
            Welcome to NorthPeak Care, {nurseData.name}! 🎉
          </DialogTitle>
          <DialogDescription className="text-base">
            You're joining a platform that's transforming home-based IV therapy and infusion care. 
            Let's get you set up to start helping patients in their homes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Your Onboarding Progress</h3>
                <Badge variant={nurseData.readyForFirstJob ? "default" : "secondary"}>
                  {nurseData.readyForFirstJob ? "Ready for Jobs!" : "Getting Ready"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{nurseData.completedTasks} of {nurseData.totalTasks} tasks completed</span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground">
                {nurseData.readyForFirstJob 
                  ? "🎉 Congratulations! You've completed all required tasks and can now accept patient visits."
                  : `Complete ${nurseData.totalTasks - nurseData.completedTasks} more tasks to start accepting visits.`
                }
              </p>
            </CardContent>
          </Card>

          {/* Platform Benefits */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Why Nurses Love Our Platform</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Higher Pay</p>
                    <p className="text-xs text-muted-foreground">$48-65/hour</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Flexible Schedule</p>
                    <p className="text-xs text-muted-foreground">Choose your hours</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Heart className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Meaningful Work</p>
                    <p className="text-xs text-muted-foreground">One-on-one patient care</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Award className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Professional Growth</p>
                    <p className="text-xs text-muted-foreground">Specialized skills</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pending Verifications */}
            {nurseData.pendingVerifications.length > 0 && (
              <Card>
                <CardHeader>
                  <h3 className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Pending Verifications
                  </h3>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {nurseData.pendingVerifications.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground mt-3">
                    These are being processed automatically. You'll be notified when complete.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Your Next Steps
                </h3>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {nurseData.nextSteps.map((step, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      {step}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">2,847</div>
                  <div className="text-xs text-muted-foreground">Active Nurses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">15,293</div>
                  <div className="text-xs text-muted-foreground">Completed Visits</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">4.9★</div>
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button className="flex-1" onClick={onClose}>
              <ArrowRight className="h-4 w-4 mr-2" />
              {nurseData.readyForFirstJob ? "Start Browsing Visits" : "Complete Onboarding"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Take a Tour
            </Button>
          </div>

          {/* Footer Note */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              Need help getting started? Our support team is available 24/7 at{" "}
              <span className="text-primary">support@ivcareconnect.com</span> or (555) 123-HELP
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Default props for the component
WelcomeSplash.defaultProps = {
  nurseData: {
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
  }
};