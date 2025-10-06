import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Calendar, Clock, DollarSign, MapPin, Users, Plus, Save, FileText } from "lucide-react";

const specialtyOptions = [
  "IV Therapy Certified",
  "Infusion Experience",
  "PICC Line Care",
  "Central Line Access",
  "Port Access",
  "Biologic Experience",
  "Chemotherapy Administration",
  "Home Health Experience",
  "Pediatric IV",
  "Geriatric Care"
];

const visitTypes = [
  { value: "iv-infusion", label: "IV Infusion (2-4 hours)" },
  { value: "picc-dressing", label: "PICC Line Dressing Change (30-60 min)" },
  { value: "central-line", label: "Central Line Maintenance (45-90 min)" },
  { value: "iv-hydration", label: "IV Hydration Therapy (1-2 hours)" },
  { value: "port-access", label: "Port Access & Flush (30-45 min)" },
  { value: "medication-admin", label: "Medication Administration (varies)" }
];

const shiftTypes = [
  { value: "iv-infusion", label: "IV Infusion (2-4 hours)" },
  { value: "picc-dressing", label: "PICC Line Dressing Change (30-60 min)" },
  { value: "central-line", label: "Central Line Maintenance (45-90 min)" },
  { value: "iv-hydration", label: "IV Hydration Therapy (1-2 hours)" },
  { value: "port-access", label: "Port Access & Flush (30-45 min)" },
  { value: "medication-admin", label: "Medication Administration (varies)" }
];

export function PostNewJob() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center pb-6 border-b bg-gradient-to-r from-[var(--color-brand-gradient-4)] to-[var(--color-brand-gradient-5)] text-white rounded-lg p-6 mb-8">
        <h2 className="text-3xl font-semibold mb-2">Request New Patient Visit</h2>
        <p className="text-blue-100">Connect with qualified nurses for IV therapy and home medical care services</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-[var(--color-brand-gradient-3)]">Patient & Visit Information</h4>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">Patient Full Name *</Label>
                  <Input id="patient-name" placeholder="e.g., Maria Rodriguez" />
                  <p className="text-xs text-muted-foreground">A unique patient ID will be automatically generated</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-phone">Patient Phone *</Label>
                  <Input id="patient-phone" placeholder="(555) 123-4567" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="patient-address">Patient Address *</Label>
                <Input id="patient-address" placeholder="123 Main Street, Downtown, NY 10001" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="visit-type">Visit Type *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visit type" />
                  </SelectTrigger>
                  <SelectContent>
                    {visitTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="medication">Medication/Treatment *</Label>
                <Input id="medication" placeholder="e.g., Infliximab (Remicade) 400mg" />
              </div>
            </div>

            {/* Schedule & Compensation */}
            <div className="space-y-4">
              <h4 className="font-medium text-[var(--color-brand-gradient-3)]">Schedule & Compensation</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date">Visit Date *</Label>
                  <Input id="date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-window">Preferred Time Window *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time window" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">8:00 AM - 12:00 PM</SelectItem>
                      <SelectItem value="afternoon">12:00 PM - 5:00 PM</SelectItem>
                      <SelectItem value="evening">5:00 PM - 8:00 PM</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Expected Duration *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30min">30 minutes</SelectItem>
                      <SelectItem value="1hr">1 hour</SelectItem>
                      <SelectItem value="2hr">2 hours</SelectItem>
                      <SelectItem value="3hr">3 hours</SelectItem>
                      <SelectItem value="4hr">4+ hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hourly-rate">Hourly Rate ($) *</Label>
                  <Input id="hourly-rate" type="number" placeholder="55" min="0" step="0.01" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total-pay">Estimated Total Pay ($)</Label>
                  <Input id="total-pay" placeholder="165" readOnly className="bg-gray-50" />
                </div>
              </div>
            </div>

            {/* Requirements */}
            <div className="space-y-4">
              <h4 className="font-medium text-[var(--color-brand-gradient-3)]">Requirements & Qualifications</h4>
              <div className="space-y-2">
                <Label>Required Specialties *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specialtyOptions.map((specialty) => (
                    <div key={specialty} className="flex items-center space-x-2">
                      <Checkbox id={specialty} />
                      <Label htmlFor={specialty} className="text-sm">
                        {specialty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="experience">Minimum Experience (years)</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">New Graduate</SelectItem>
                    <SelectItem value="1">1+ years</SelectItem>
                    <SelectItem value="2">2+ years</SelectItem>
                    <SelectItem value="3">3+ years</SelectItem>
                    <SelectItem value="5">5+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="certifications">Required Certifications</Label>
                <Textarea 
                  id="certifications" 
                  placeholder="e.g., BLS, ACLS, PALS, NIH Stroke Scale..."
                  className="min-h-20"
                />
              </div>
            </div>

            {/* Visit Details */}
            <div className="space-y-4">
              <h4 className="font-medium text-[var(--color-brand-gradient-3)]">Visit Details</h4>
              <div className="space-y-2">
                <Label htmlFor="special-instructions">Special Instructions</Label>
                <Textarea 
                  id="special-instructions" 
                  placeholder="Any special instructions for the nurse, patient conditions, access information, etc."
                  className="min-h-24"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equipment-needed">Equipment Needed</Label>
                <Textarea 
                  id="equipment-needed" 
                  placeholder="IV supplies, medication, pumps, dressing materials, etc."
                  className="min-h-20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="access-notes">Access & Parking Notes</Label>
                <Textarea 
                  id="access-notes" 
                  placeholder="Building access codes, parking information, contact instructions..."
                  className="min-h-20"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-[var(--color-brand-gradient-3)]">Contact Information</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Primary Contact *</Label>
                  <Input id="contact-name" placeholder="Dr. Sarah Johnson" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone *</Label>
                  <Input id="contact-phone" placeholder="(555) 123-4567" />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Input id="emergency-contact" placeholder="(555) 911-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-contact">Patient Contact (if different)</Label>
                  <Input id="patient-contact" placeholder="Family member phone" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview & Actions */}
        <div className="space-y-6">
          {/* Job Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Job Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">ICU Nurse - Night Shift</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>St. Mary's Hospital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>Sep 25, 2025</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span>7:00 PM - 7:00 AM</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-3 w-3 text-muted-foreground" />
                    <span>$45/hour</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">ICU</Badge>
                  <Badge variant="outline" className="text-xs">Critical Care</Badge>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                This is how your job posting will appear to nurses
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Publish Job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Posting Fee:</span>
                  <span className="font-medium">$0</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Platform Fee:</span>
                  <span className="font-medium">10% of total pay</span>
                </div>
                <div className="flex items-center justify-between font-medium border-t pt-2">
                  <span>Total Cost:</span>
                  <span>$594 (12h × $45 + $54 fee)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full bg-gradient-to-r from-[var(--color-brand-gradient-4)] to-[var(--color-brand-gradient-5)] text-white border-0 hover:from-[var(--color-brand-gradient-3)] hover:to-[var(--color-brand-gradient-4)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Publish Visit Request
                </Button>
                <Button variant="outline" className="w-full border-[var(--color-brand-gradient-4)] text-[var(--color-brand-gradient-4)] hover:bg-[var(--color-brand-gradient-4)] hover:text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Tips for Success</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h5 className="font-medium">Clear Requirements</h5>
                <p className="text-muted-foreground">Be specific about specialties and experience needed</p>
              </div>
              <div>
                <h5 className="font-medium">Competitive Pay</h5>
                <p className="text-muted-foreground">Research local rates to attract quality nurses</p>
              </div>
              <div>
                <h5 className="font-medium">Detailed Description</h5>
                <p className="text-muted-foreground">Include unit details and patient population info</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}