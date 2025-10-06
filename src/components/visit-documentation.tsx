import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { FileText, User, Activity, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface VisitDocumentationProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  visitDetails?: {
    patient: string;
    medication: string;
    visitType: string;
  };
}

export function VisitDocumentation({ isOpen, onClose, onSubmit, visitDetails }: VisitDocumentationProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Visit Documentation
          </DialogTitle>
          <DialogDescription>
            Complete the patient visit documentation including vitals, treatment details, and outcomes.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Visit Summary */}
          {visitDetails && (
            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <Label className="text-xs text-muted-foreground">Patient</Label>
                    <p className="font-medium">{visitDetails.patient}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Treatment</Label>
                    <p className="font-medium">{visitDetails.medication}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Visit Type</Label>
                    <p className="font-medium">{visitDetails.visitType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pre-Visit Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4" />
                Pre-Visit Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pre-bp">Blood Pressure</Label>
                  <Input id="pre-bp" placeholder="120/80" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pre-hr">Heart Rate</Label>
                  <Input id="pre-hr" placeholder="72" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pre-temp">Temperature (°F)</Label>
                  <Input id="pre-temp" placeholder="98.6" type="number" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pre-o2">O2 Sat (%)</Label>
                  <Input id="pre-o2" placeholder="98" type="number" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="patient-condition">Patient Condition/Complaints</Label>
                <Textarea 
                  id="patient-condition" 
                  placeholder="Patient reports feeling well today. No new symptoms or concerns..."
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label>Access Assessment</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="access-patent" />
                    <Label htmlFor="access-patent" className="text-sm">Access site patent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="access-intact" />
                    <Label htmlFor="access-intact" className="text-sm">Dressing intact</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="no-redness" />
                    <Label htmlFor="no-redness" className="text-sm">No redness/swelling</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="easy-access" />
                    <Label htmlFor="easy-access" className="text-sm">Easy blood return</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Treatment Administration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Treatment Administration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input id="start-time" type="time" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input id="end-time" type="time" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pre-meds">Pre-medications Given</Label>
                <Textarea 
                  id="pre-meds" 
                  placeholder="Benadryl 25mg PO, Tylenol 650mg PO given 30 minutes prior..."
                  className="min-h-16"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="infusion-rate">Infusion Rate/Method</Label>
                <Input id="infusion-rate" placeholder="Initial rate 50ml/hr, increased to 100ml/hr after 30 minutes" />
              </div>

              <div className="space-y-2">
                <Label>Treatment Tolerance</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tolerance level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent - No issues</SelectItem>
                    <SelectItem value="good">Good - Minor discomfort</SelectItem>
                    <SelectItem value="fair">Fair - Some side effects managed</SelectItem>
                    <SelectItem value="poor">Poor - Significant issues</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="adverse-events">Adverse Events/Reactions</Label>
                <Textarea 
                  id="adverse-events" 
                  placeholder="None observed. Patient tolerated treatment well..."
                  className="min-h-16"
                />
              </div>
            </CardContent>
          </Card>

          {/* Post-Treatment Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Post-Treatment Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="post-bp">Blood Pressure</Label>
                  <Input id="post-bp" placeholder="118/78" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-hr">Heart Rate</Label>
                  <Input id="post-hr" placeholder="68" type="number" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-temp">Temperature (°F)</Label>
                  <Input id="post-temp" placeholder="98.4" type="number" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post-o2">O2 Sat (%)</Label>
                  <Input id="post-o2" placeholder="99" type="number" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="post-condition">Patient Condition Post-Treatment</Label>
                <Textarea 
                  id="post-condition" 
                  placeholder="Patient feels well post-infusion. No complaints. Ambulating independently..."
                  className="min-h-20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="access-post">Access Site Post-Treatment</Label>
                <Textarea 
                  id="access-post" 
                  placeholder="Access flushed with saline. Good blood return. Site clean and intact..."
                  className="min-h-16"
                />
              </div>
            </CardContent>
          </Card>

          {/* Patient Education & Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Patient Education & Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="education">Patient Education Provided</Label>
                <Textarea 
                  id="education" 
                  placeholder="Reviewed signs/symptoms to watch for. Patient verbalized understanding..."
                  className="min-h-16"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="next-visit">Next Scheduled Visit</Label>
                <Input id="next-visit" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="follow-up">Follow-up Instructions</Label>
                <Textarea 
                  id="follow-up" 
                  placeholder="Continue current medications. Contact provider if any concerns..."
                  className="min-h-16"
                />
              </div>

              <div className="space-y-2">
                <Label>Supplies Left with Patient</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="emergency-supplies" />
                    <Label htmlFor="emergency-supplies" className="text-sm">Emergency contact info</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="medication-list" />
                    <Label htmlFor="medication-list" className="text-sm">Updated medication list</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="care-instructions" />
                    <Label htmlFor="care-instructions" className="text-sm">Care instructions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="symptom-guide" />
                    <Label htmlFor="symptom-guide" className="text-sm">Symptom monitoring guide</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="additional-notes">Additional Notes</Label>
                <Textarea 
                  id="additional-notes" 
                  placeholder="Any other observations, concerns, or important information..."
                  className="min-h-20"
                />
              </div>
            </CardContent>
          </Card>
        </form>

        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={onClose}>
            Save as Draft
          </Button>
          <Button onClick={handleSubmit}>
            Submit Documentation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}