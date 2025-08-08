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
import { Download, Upload, Calendar, DollarSign, Shield, Heart, Clock, FileText, CreditCard, Building2, Users, BarChart3, PieChart, TrendingUp, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import TimesheetList from '@/components/TimesheetList';
import { useRole } from '@/contexts/RoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import DatePicker from 'react-datepicker';


const Pay = () => {
  const { userRole } = useRole();
  const { profile, loading } = useUserProfile();
  const isManager = userRole === 'manager';
  
  // Manager-specific state
  const [teamMembers] = useState([
    { id: 1, name: 'John Doe', position: 'Software Engineer', salary: 85000, status: 'Active', lastPayDate: '2024-12-15' },
    { id: 2, name: 'Sarah Johnson', position: 'Product Manager', salary: 95000, status: 'Active', lastPayDate: '2024-12-15' },
    { id: 3, name: 'Mike Chen', position: 'UI/UX Designer', salary: 75000, status: 'Active', lastPayDate: '2024-12-15' },
    { id: 4, name: 'Emily Davis', position: 'QA Engineer', salary: 70000, status: 'Active', lastPayDate: '2024-12-15' },
    { id: 5, name: 'Alex Rodriguez', position: 'DevOps Engineer', salary: 90000, status: 'Active', lastPayDate: '2024-12-15' },
  ]);

  const [pendingApprovals] = useState([
    { id: 1, employee: 'John Doe', type: 'Overtime', amount: 450, status: 'Pending', date: '2024-12-20' },
    { id: 2, employee: 'Sarah Johnson', type: 'Bonus', amount: 2500, status: 'Pending', date: '2024-12-19' },
    { id: 3, employee: 'Mike Chen', type: 'Overtime', amount: 320, status: 'Pending', date: '2024-12-18' },
  ]);

  const [payrollReports] = useState([
    { period: 'December 2024', totalPayroll: 245000, employees: 5, status: 'Processed' },
    { period: 'November 2024', totalPayroll: 245000, employees: 5, status: 'Processed' },
    { period: 'October 2024', totalPayroll: 240000, employees: 5, status: 'Processed' },
  ]);

  // Employee-specific state (only used if not manager)
  const [taxInfo, setTaxInfo] = useState({
    w4Status: 'Current',
    exemptions: 2,
    additionalWithholding: 0,
    lastUpdated: '2024-01-15'
  });

  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [showTaxUpdateModal, setShowTaxUpdateModal] = useState(false);

  // Manager functions
  const handleApproveRequest = (id: number) => {
    console.log(`Approved request ${id}`);
  };

  const handleRejectRequest = (id: number) => {
    console.log(`Rejected request ${id}`);
  };

  const handleDownloadReport = (reportType: string) => {
    console.log(`Downloading ${reportType} report`);
  };

  // Employee functions
  const handleDownloadTaxDocument = (docName: string) => {
    console.log(`Downloading ${docName}`);
  };

  const handleTaxInfoUpdate = () => {
    console.log('Tax information updated');
    setShowTaxUpdateModal(false);
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  // This function returns `true` only if the date is a Monday.
  const isMonday = (date) => {
    // getDay() returns 0 for Sunday, 1 for Monday, 2 for Tuesday, etc.
    return date.getDay() === 1;
  };



  const handleBenefitsUpdate = () => {
    console.log('Benefits information updated');
    setShowBenefitsModal(false);
  };

  // Manager Dashboard
  if (isManager) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Payroll Management</h1>
            <p className="text-gray-600">Manage team compensation, approvals, and payroll reports</p>
          </div>
        </div>

        {/* Team Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">$245,000</p>
                  <p className="text-sm text-gray-600">Monthly Payroll</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">$12,500</p>
                  <p className="text-sm text-gray-600">Overtime This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-8 h-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">5</p>
                  <p className="text-sm text-gray-600">Team Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Salary Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team Salary Overview
              </CardTitle>
              <CardDescription>Current team member salaries and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.position}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${member.salary.toLocaleString()}</p>
                      <Badge variant="secondary">{member.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Pending Approvals
              </CardTitle>
              <CardDescription>Review and approve team requests</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {pendingApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{approval.employee}</p>
                      <p className="text-sm text-gray-600">{approval.type} - ${approval.amount}</p>
                      <p className="text-xs text-gray-500">{approval.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{approval.status}</Badge>
                      <Button
                        size="sm"
                        onClick={() => handleApproveRequest(approval.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectRequest(approval.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payroll Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Payroll Reports
              </CardTitle>
              <CardDescription>Download team payroll reports and summaries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {payrollReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{report.period}</p>
                      <p className="text-sm text-gray-600">${report.totalPayroll.toLocaleString()} - {report.employees} employees</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === 'Processed' ? 'default' : 'secondary'}>
                        {report.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReport(`${report.period} Payroll Report`)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 pt-4 border-t">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Team Payroll Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Overtime Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Benefits Summary
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Tax Reports
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common payroll management tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="w-4 h-4 mr-2" />
                  Review Timesheets
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Approve Leave Requests
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Process Bonuses
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Manage Benefits
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Generate Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Update Payroll Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Employee Dashboard (original content)
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
                <p className="text-2xl font-bold text-green-600">
                  {loading ? 'Loading...' : (profile && typeof profile.salary === 'number' ? profile.salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A')}
                </p>
              </div>
              <Badge variant="secondary">Full-time</Badge>
            </div>
          </CardContent>
        </Card>
        
        
        {/* Timesheets */}
        <TimesheetList />

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
      </div>
    </div>
  );
};

export default Pay;
