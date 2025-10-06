import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Calendar, Clock, Plus, X, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface NurseAvailabilitySelectorProps {
  onAvailabilitySet?: (slots: TimeSlot[]) => void;
}

export function NurseAvailabilitySelector({ onAvailabilitySet }: NurseAvailabilitySelectorProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      date: '2025-10-03',
      startTime: '09:00',
      endTime: '12:00'
    },
    {
      id: '2',
      date: '2025-10-03',
      startTime: '14:00',
      endTime: '18:00'
    }
  ]);

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStartTime, setNewSlotStartTime] = useState('');
  const [newSlotEndTime, setNewSlotEndTime] = useState('');

  const handleAddTimeSlot = () => {
    if (newSlotDate && newSlotStartTime && newSlotEndTime) {
      const newSlot: TimeSlot = {
        id: Date.now().toString(),
        date: newSlotDate,
        startTime: newSlotStartTime,
        endTime: newSlotEndTime
      };
      setTimeSlots([...timeSlots, newSlot]);
      setNewSlotDate('');
      setNewSlotStartTime('');
      setNewSlotEndTime('');
      setShowAddDialog(false);
    }
  };

  const handleRemoveTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const groupSlotsByDate = () => {
    const grouped: { [key: string]: TimeSlot[] } = {};
    timeSlots.forEach(slot => {
      if (!grouped[slot.date]) {
        grouped[slot.date] = [];
      }
      grouped[slot.date].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDate();
  const sortedDates = Object.keys(groupedSlots).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">My Availability</h2>
        <p className="text-muted-foreground">Set multiple time windows throughout the day when you're available for visits</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Time Slots</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{timeSlots.length}</div>
            <p className="text-xs text-muted-foreground">Available windows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Days Covered</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortedDates.length}</div>
            <p className="text-xs text-muted-foreground">Unique dates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Active</div>
            <p className="text-xs text-muted-foreground">Accepting visits</p>
          </CardContent>
        </Card>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Clock className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Add multiple time windows per day to maximize your earning potential. Facilities will match you with visits during these times.
        </AlertDescription>
      </Alert>

      {/* Time Slots by Date */}
      <div className="space-y-4">
        {sortedDates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Availability Set</h3>
              <p className="text-muted-foreground text-center mb-4">
                Add your available time slots to start receiving visit requests
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Time Slot
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {sortedDates.map(date => (
              <Card key={date}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <CardTitle>{formatDate(date)}</CardTitle>
                    </div>
                    <Badge variant="secondary">
                      {groupedSlots[date].length} time {groupedSlots[date].length === 1 ? 'slot' : 'slots'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {groupedSlots[date].map(slot => (
                      <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50/50">
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-primary" />
                          <div>
                            <p className="font-medium">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(() => {
                                const start = slot.startTime.split(':');
                                const end = slot.endTime.split(':');
                                const startMinutes = parseInt(start[0]) * 60 + parseInt(start[1]);
                                const endMinutes = parseInt(end[0]) * 60 + parseInt(end[1]);
                                const duration = (endMinutes - startMinutes) / 60;
                                return `${duration} hour${duration !== 1 ? 's' : ''} available`;
                              })()}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveTimeSlot(slot.id)}
                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={() => setShowAddDialog(true)} className="flex-1">
          <Plus className="h-4 w-4 mr-2" />
          Add Time Slot
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onAvailabilitySet?.(timeSlots)}
          disabled={timeSlots.length === 0}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Save Availability
        </Button>
      </div>

      {/* Add Time Slot Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Available Time Slot</DialogTitle>
            <DialogDescription>
              Set a specific date and time window when you're available to provide care
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="slot-date">Date</Label>
              <Input
                id="slot-date"
                type="date"
                value={newSlotDate}
                onChange={(e) => setNewSlotDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={newSlotStartTime}
                  onChange={(e) => setNewSlotStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={newSlotEndTime}
                  onChange={(e) => setNewSlotEndTime(e.target.value)}
                />
              </div>
            </div>
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 text-sm">
                You can add multiple time slots for the same day to accommodate breaks or preferred working hours
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddTimeSlot}
              disabled={!newSlotDate || !newSlotStartTime || !newSlotEndTime}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Time Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
