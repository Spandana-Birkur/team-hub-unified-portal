import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface Timesheet {
  id?: number;
  employeeId?: number;
  week?: string;
  hours?: {
    monday?: number;
    tuesday?: number;
    wednesday?: number;
    thursday?: number;
    friday?: number;
    saturday?: number;
    sunday?: number;
  };
  totalHours?: number;
  status?: string;
  submitted?: string;
  notes?: string;
}

interface TimesheetFormData {
  weekOf: Date;
  monday: number;
  tuesday: number;
  wednesday: number;
  thursday: number;
  friday: number;
  saturday: number;
  notes: string;
}

const TimesheetList = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimesheet, setSelectedTimesheet] = useState<Timesheet | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [formData, setFormData] = useState<TimesheetFormData>({
    weekOf: new Date(),
    monday: 0,
    tuesday: 0,
    wednesday: 0,
    thursday: 0,
    friday: 0,
    saturday: 0,
    notes: ''
  });
  const { toast } = useToast();
  const { profile } = useUserProfile();

  const formatWeek = (date: string) => {
    try {
      const weekStart = new Date(date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const formatDate = (d: Date) => {
        return d.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: 'numeric'
        });
      };
      
      return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const fetchTimesheets = async () => {
    if (!profile?.ID) {
      setError('No employee ID found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/timesheets/${profile.ID}`);
      if (!response.ok) {
        throw new Error('Failed to fetch timesheets');
      }
      const data = await response.json();
      console.log('Raw timesheet data:', data);
      // Ensure we have an array of timesheets
      const timesheetArray = Array.isArray(data) ? data : data.timesheets || [];
      console.log('Processed timesheet array:', timesheetArray);
      setTimesheets(timesheetArray);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch timesheets');
      setTimesheets([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.ID) {
      toast({
        title: "Error",
        description: "No employee ID found",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}/api/timesheets/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: profile.ID,
          weekOf: format(formData.weekOf, 'yyyy-MM-dd'),
          monday: formData.monday,
          tuesday: formData.tuesday,
          wednesday: formData.wednesday,
          thursday: formData.thursday,
          friday: formData.friday,
          saturday: formData.saturday,
          notes: formData.notes
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit timesheet');
      }

      toast({
        title: "Success",
        description: "Timesheet submitted successfully",
      });

      // Reset form and close dialog
      setFormData({
        weekOf: new Date(),
        monday: 0,
        tuesday: 0,
        wednesday: 0,
        thursday: 0,
        friday: 0,
        saturday: 0,
        notes: ''
      });
      setShowSubmitForm(false);

      // Refresh the timesheet list
      await fetchTimesheets();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to submit timesheet",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchTimesheets();
    };
    loadData();
  }, [profile?.ID]);

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Timesheets
        </CardTitle>
        <Button onClick={() => setShowSubmitForm(true)} size="sm">
          Submit Timesheet
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {timesheets.map((timesheet) => (
            <div key={timesheet?.id || Math.random()} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-grow">
                <p className="font-medium">{timesheet?.week ? formatWeek(timesheet.week) : 'Invalid Date'}</p>
                <p className="text-sm text-gray-600">{timesheet?.totalHours || 0} hours</p>
                {timesheet?.notes && (
                  <p className="text-sm text-gray-500 mt-1 truncate max-w-md">{timesheet.notes}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge variant={timesheet?.status?.toLowerCase() === 'approved' ? 'default' : 'secondary'}>
                  {timesheet?.status || 'Pending'}
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedTimesheet(timesheet)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <Dialog open={!!selectedTimesheet} onOpenChange={() => setSelectedTimesheet(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Timesheet Details</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Week of {selectedTimesheet?.week ? formatWeek(selectedTimesheet.week) : 'N/A'}</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Monday</p>
                        <p className="font-medium">{selectedTimesheet?.hours?.monday || 0} hours</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Tuesday</p>
                        <p className="font-medium">{selectedTimesheet?.hours?.tuesday || 0} hours</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Wednesday</p>
                        <p className="font-medium">{selectedTimesheet?.hours?.wednesday || 0} hours</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Thursday</p>
                        <p className="font-medium">{selectedTimesheet?.hours?.thursday || 0} hours</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Friday</p>
                        <p className="font-medium">{selectedTimesheet?.hours?.friday || 0} hours</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Saturday</p>
                        <p className="font-medium">{selectedTimesheet?.hours?.saturday || 0} hours</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <p className="font-medium">Total Hours</p>
                      <p className="font-medium">{selectedTimesheet?.totalHours || 0}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-medium">Status</p>
                      <Badge variant={selectedTimesheet?.status?.toLowerCase() === 'approved' ? 'default' : 'secondary'}>
                        {selectedTimesheet?.status || 'Pending'}
                      </Badge>
                    </div>
                    {selectedTimesheet?.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600 mb-1">Notes</p>
                        <p className="text-sm">{selectedTimesheet.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Submit Timesheet Form Dialog */}
          <Dialog open={showSubmitForm} onOpenChange={setShowSubmitForm}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Submit Timesheet</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Week Of</Label>
                    <Calendar
                      mode="single"
                      selected={formData.weekOf}
                      onSelect={(date) => date && setFormData(prev => ({ ...prev, weekOf: date }))}
                      disabled={(date) => {
                        // 0 is Sunday, 1 is Monday in JavaScript's getDay()
                        return date.getDay() !== 1;
                      }}
                      className="rounded-md border"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="monday">Monday</Label>
                      <Input
                        id="monday"
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={formData.monday}
                        onChange={(e) => setFormData(prev => ({ ...prev, monday: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tuesday">Tuesday</Label>
                      <Input
                        id="tuesday"
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={formData.tuesday}
                        onChange={(e) => setFormData(prev => ({ ...prev, tuesday: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="wednesday">Wednesday</Label>
                      <Input
                        id="wednesday"
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={formData.wednesday}
                        onChange={(e) => setFormData(prev => ({ ...prev, wednesday: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="thursday">Thursday</Label>
                      <Input
                        id="thursday"
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={formData.thursday}
                        onChange={(e) => setFormData(prev => ({ ...prev, thursday: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="friday">Friday</Label>
                      <Input
                        id="friday"
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={formData.friday}
                        onChange={(e) => setFormData(prev => ({ ...prev, friday: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="saturday">Saturday</Label>
                      <Input
                        id="saturday"
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={formData.saturday}
                        onChange={(e) => setFormData(prev => ({ ...prev, saturday: parseFloat(e.target.value) || 0 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any notes or comments..."
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit">Submit Timesheet</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimesheetList;
