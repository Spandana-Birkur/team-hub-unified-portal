import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Download, Upload, Calendar, DollarSign, Shield, Heart, Clock, FileText, CreditCard, Building2 } from "lucide-react";

const Pay = () => {
  // Pay Information State
  const [payStubs, setPayStubs] = useState([
    { period: 'Dec 2024', amount: 4500, status: 'Paid', date: '2024-12-15' },
    { period: 'Nov 2024', amount: 4500, status: 'Paid', date: '2024-11-15' },
    { period: 'Oct 2024', amount: 4500, status: 'Paid', date: '2024-10-15' },
  ]);

  // Tax Information State
  const [taxInfo, setTaxInfo] = useState({
    w4Status: 'Current',
    exemptions: 2,
    additionalWithholding: 0,
    lastUpdated: '2024-01-15'
  });

  // Timesheet State
  const [timesheetData, setTimesheetData] = useState({
    week: '',
    hours: {
      monday: 8,
      tuesday: 8,
      wednesday: 8,
      thursday: 8,
      friday: 8,
      saturday: 0,
      sunday: 0
    },
    notes: ''
  });

  const [timesheets, setTimesheets] = useState([
    { week: 'Dec 9-15, 2024', status: 'Approved', totalHours: 40, submitted: '2024-12-16' },
    { week: 'Dec 2-8, 2024', status: 'Approved', totalHours: 40, submitted: '2024-12-09' },
    { week: 'Nov 25-Dec 1, 2024', status: 'Approved', totalHours: 40, submitted: '2024-12-02' },
  ]);

  // Benefits State
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [showTaxUpdateModal, setShowTaxUpdateModal] = useState(false);
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);

  const handleDownloadPayStub = (period: string) => {
    // Simulate download
    console.log(`Downloading pay stub for ${period}`);
  };

  const handleDownloadTaxDocument = (docName: string) => {
    // Simulate download
    console.log(`Downloading ${docName}`);
  };

  const handleTaxInfoUpdate = () => {
    // Simulate tax info update
    console.log('Tax information updated');
    setShowTaxUpdateModal(false);
  };

  const handleTimesheetSubmit = () => {
    // Simulate timesheet submission
    const newTimesheet = {
      week: timesheetData.week,
      status: 'Pending',
      totalHours: Object.values(timesheetData.hours).reduce((a, b) => a + b, 0),
      submitted: new Date().toISOString().split('T')[0]
    };
    setTimesheets([newTimesheet, ...timesheets]);
    setShowTimesheetModal(false);
    setTimesheetData({
      week: '',
      hours: {
        monday: 8,
        tuesday: 8,
        wednesday: 8,
        thursday: 8,
        friday: 8,
        saturday: 0,
        sunday: 0
      },
      notes: ''
    });
  };

  const handleBenefitsUpdate = () => {
    // Simulate benefits update
    console.log('Benefits information updated');
    setShowBenefitsModal(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pay & Benefits</h1>
          <p className="text-gray-600">Manage your compensation, benefits, and tax information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pay Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Pay Information
            </CardTitle>
            <CardDescription>View and download your pay stubs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold">Current Salary</p>
                <p className="text-2xl font-bold text-green-600">$54,000/year</p>
              </div>
              <Badge variant="secondary">Full-time</Badge>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Recent Pay Stubs</h4>
              {payStubs.map((stub, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{stub.period}</p>
                    <p className="text-sm text-gray-600">${stub.amount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={stub.status === 'Paid' ? 'default' : 'secondary'}>
                      {stub.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadPayStub(stub.period)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Health Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Health Benefits
            </CardTitle>
            <CardDescription>Manage your health insurance and wellness benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Medical Insurance</p>
                  <p className="text-sm text-gray-600">Blue Cross Blue Shield</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Dental Insurance</p>
                  <p className="text-sm text-gray-600">Delta Dental</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Vision Insurance</p>
                  <p className="text-sm text-gray-600">VSP</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
            
            <Dialog open={showBenefitsModal} onOpenChange={setShowBenefitsModal}>
              <DialogTrigger asChild>
                <Button className="w-full">Update Benefits</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Benefits Information</DialogTitle>
                  <DialogDescription>
                    Make changes to your benefits selections
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="medical">Medical Plan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medical plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Plan</SelectItem>
                        <SelectItem value="standard">Standard Plan</SelectItem>
                        <SelectItem value="premium">Premium Plan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dental">Dental Plan</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dental plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic Plan</SelectItem>
                        <SelectItem value="premium">Premium Plan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleBenefitsUpdate}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setShowBenefitsModal(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Retirement & Savings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Retirement & Savings
            </CardTitle>
            <CardDescription>Track your retirement accounts and savings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold">401(k) Account</p>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-2xl font-bold text-blue-600">$12,450</p>
                <p className="text-sm text-gray-600">Current balance</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Contribution Rate</span>
                  <span className="text-sm font-medium">6%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Employer Match</span>
                  <span className="text-sm font-medium">3%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Life & Disability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Life & Disability
            </CardTitle>
            <CardDescription>Life insurance and disability coverage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Life Insurance</p>
                  <p className="text-sm text-gray-600">2x Annual Salary</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Short-term Disability</p>
                  <p className="text-sm text-gray-600">60% of salary</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Long-term Disability</p>
                  <p className="text-sm text-gray-600">60% of salary</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Additional Benefits
            </CardTitle>
            <CardDescription>Other benefits and perks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Flexible Spending Account</p>
                  <p className="text-sm text-gray-600">$2,650 remaining</p>
                </div>
                <Badge variant="secondary">Available</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Commuter Benefits</p>
                  <p className="text-sm text-gray-600">$265/month</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Employee Stock Purchase</p>
                  <p className="text-sm text-gray-600">15% discount</p>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tax Documents
            </CardTitle>
            <CardDescription>Access your tax forms and documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">W-2 Form (2024)</p>
                  <p className="text-sm text-gray-600">Available Jan 31, 2025</p>
                </div>
                <Button size="sm" variant="outline" disabled>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">W-2 Form (2023)</p>
                  <p className="text-sm text-gray-600">Tax year 2023</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownloadTaxDocument('W-2 2023')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">1095-C Form (2023)</p>
                  <p className="text-sm text-gray-600">Health coverage</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleDownloadTaxDocument('1095-C 2023')}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tax Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tax Information
            </CardTitle>
            <CardDescription>Manage your tax withholding and exemptions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">W-4 Status</p>
                  <p className="text-sm text-gray-600">{taxInfo.w4Status}</p>
                </div>
                <Badge variant="secondary">Current</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Exemptions</p>
                  <p className="text-sm text-gray-600">{taxInfo.exemptions} allowances</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Additional Withholding</p>
                  <p className="text-sm text-gray-600">${taxInfo.additionalWithholding}/paycheck</p>
                </div>
              </div>
            </div>
            
            <Dialog open={showTaxUpdateModal} onOpenChange={setShowTaxUpdateModal}>
              <DialogTrigger asChild>
                <Button className="w-full">Update Tax Information</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Tax Information</DialogTitle>
                  <DialogDescription>
                    Update your W-4 withholding information
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="exemptions">Number of Allowances</Label>
                    <Input 
                      id="exemptions" 
                      type="number" 
                      value={taxInfo.exemptions}
                      onChange={(e) => setTaxInfo({...taxInfo, exemptions: parseInt(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="withholding">Additional Withholding</Label>
                    <Input 
                      id="withholding" 
                      type="number" 
                      value={taxInfo.additionalWithholding}
                      onChange={(e) => setTaxInfo({...taxInfo, additionalWithholding: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleTaxInfoUpdate}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setShowTaxUpdateModal(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Timesheets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Timesheets
            </CardTitle>
            <CardDescription>Submit and track your work hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {timesheets.map((timesheet, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{timesheet.week}</p>
                    <p className="text-sm text-gray-600">{timesheet.totalHours} hours</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={timesheet.status === 'Approved' ? 'default' : 'secondary'}>
                      {timesheet.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            
            <Dialog open={showTimesheetModal} onOpenChange={setShowTimesheetModal}>
              <DialogTrigger asChild>
                <Button className="w-full">Submit Timesheet</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Submit Timesheet</DialogTitle>
                  <DialogDescription>
                    Enter your work hours for the week
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="week">Week Ending</Label>
                    <Input 
                      id="week" 
                      type="date" 
                      value={timesheetData.week}
                      onChange={(e) => setTimesheetData({...timesheetData, week: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Daily Hours</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="monday">Monday</Label>
                        <Input 
                          id="monday" 
                          type="number" 
                          value={timesheetData.hours.monday}
                          onChange={(e) => setTimesheetData({
                            ...timesheetData, 
                            hours: {...timesheetData.hours, monday: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tuesday">Tuesday</Label>
                        <Input 
                          id="tuesday" 
                          type="number" 
                          value={timesheetData.hours.tuesday}
                          onChange={(e) => setTimesheetData({
                            ...timesheetData, 
                            hours: {...timesheetData.hours, tuesday: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="wednesday">Wednesday</Label>
                        <Input 
                          id="wednesday" 
                          type="number" 
                          value={timesheetData.hours.wednesday}
                          onChange={(e) => setTimesheetData({
                            ...timesheetData, 
                            hours: {...timesheetData.hours, wednesday: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="thursday">Thursday</Label>
                        <Input 
                          id="thursday" 
                          type="number" 
                          value={timesheetData.hours.thursday}
                          onChange={(e) => setTimesheetData({
                            ...timesheetData, 
                            hours: {...timesheetData.hours, thursday: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="friday">Friday</Label>
                        <Input 
                          id="friday" 
                          type="number" 
                          value={timesheetData.hours.friday}
                          onChange={(e) => setTimesheetData({
                            ...timesheetData, 
                            hours: {...timesheetData.hours, friday: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="saturday">Saturday</Label>
                        <Input 
                          id="saturday" 
                          type="number" 
                          value={timesheetData.hours.saturday}
                          onChange={(e) => setTimesheetData({
                            ...timesheetData, 
                            hours: {...timesheetData.hours, saturday: parseInt(e.target.value)}
                          })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any additional notes..."
                      value={timesheetData.notes}
                      onChange={(e) => setTimesheetData({...timesheetData, notes: e.target.value})}
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={handleTimesheetSubmit}>Submit Timesheet</Button>
                    <Button variant="outline" onClick={() => setShowTimesheetModal(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pay; 