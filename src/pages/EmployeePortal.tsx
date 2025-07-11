
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, Phone, MapPin, Calendar, Users, Bell, User, CreditCard, 
  DollarSign, Plane, FileText, PartyPopper, Calculator, 
  GraduationCap, Clock, Download, Upload, Plus, Edit, Eye,
  TrendingUp, AlertTriangle, Shield, UserCheck, Headphones, BookOpen, ShieldCheck
} from 'lucide-react';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useNavigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { useLeaveRequests } from '@/contexts/LeaveRequestContext';
import { useEvents } from '@/contexts/EventsContext';

const EmployeePortal = () => {
  const { toast } = useToast();
  const { submitLeaveRequest, getRequestsByEmployee } = useLeaveRequests();
  const { addEvent, getCompanyEvents } = useEvents();
  
  // Modal states
  const [showTimeOffModal, setShowTimeOffModal] = useState(false);
  const [showDocumentUploadModal, setShowDocumentUploadModal] = useState(false);
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);
  const [showTaxUpdateModal, setShowTaxUpdateModal] = useState(false);
  const [showTimesheetModal, setShowTimesheetModal] = useState(false);
  const [showEventRSVPModal, setShowEventRSVPModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);
  const [newEventForm, setNewEventForm] = useState({
    type: 'Event' as 'Meeting' | 'Holiday' | 'Deadline' | 'Event' | 'Personal',
    title: '',
    date: '',
    time: '',
    endTime: '',
    isAllDay: false,
    location: '',
    description: '',
    isPersonal: false
  });
  
  // Form states
  const [timeOffForm, setTimeOffForm] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  
  const [documentUpload, setDocumentUpload] = useState({
    name: '',
    type: '',
    file: null
  });
  
  // State for dynamic data
  const [payStubs, setPayStubs] = useState([
    { period: 'Dec 15 - Dec 31, 2023', grossPay: '$5,200.00', netPay: '$3,890.00', status: 'Available' },
    { period: 'Dec 1 - Dec 14, 2023', grossPay: '$5,200.00', netPay: '$3,890.00', status: 'Available' },
    { period: 'Nov 15 - Nov 30, 2023', grossPay: '$5,200.00', netPay: '$3,890.00', status: 'Available' },
  ]);
  const [documents, setDocuments] = useState([
    { name: 'Employee Handbook 2024', type: 'PDF', uploadDate: '2024-01-01' },
    { name: 'W-2 Form 2023', type: 'PDF', uploadDate: '2024-01-15' },
    { name: 'Benefits Enrollment', type: 'PDF', uploadDate: '2023-12-01' },
  ]);
  // Get user's leave requests from context
  const userEmployeeId = 'emp001'; // This would come from user profile in a real app
  const timeOffRequests = getRequestsByEmployee(userEmployeeId).map(request => ({
    type: request.type,
    dates: `${request.startDate} - ${request.endDate}`,
    days: request.days,
    status: request.status === 'pending' ? 'Pending' : request.status === 'approved' ? 'Approved' : 'Rejected'
  }));
  const [taxInfo, setTaxInfo] = useState({
    filingStatus: 'Single',
    allowances: 2,
    additionalWithholding: 0,
    state: 'California'
  });
  
  const [timesheetData, setTimesheetData] = useState({
    weekEnding: '',
    hours: Array(7).fill(8),
    notes: ''
  });

  const [timesheets, setTimesheets] = useState([
    { weekEnding: 'Jan 12, 2024', regularHours: 40.0, overtimeHours: 2.5, status: 'Approved' },
    { weekEnding: 'Jan 5, 2024', regularHours: 38.5, overtimeHours: 0.0, status: 'Approved' },
    { weekEnding: 'Dec 29, 2023', regularHours: 32.0, overtimeHours: 0.0, status: 'Pending' },
  ]);

  const announcements = [
    {
      id: 1,
      title: 'Annual Company Retreat 2024',
      content: 'Join us for our annual company retreat in Lake Tahoe. Registration opens next week.',
      date: '2024-01-15',
      priority: 'high'
    },
    {
      id: 2,
      title: 'New Health Benefits Package',
      content: 'We are excited to announce enhanced health benefits starting February 1st.',
      date: '2024-01-10',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Office Holiday Schedule',
      content: 'Please note the updated holiday schedule for the upcoming months.',
      date: '2024-01-08',
      priority: 'low'
    }
  ];

  const teamMembers = [
    { name: 'Alice Smith', role: 'Team Lead', avatar: 'AS', department: 'Engineering' },
    { name: 'Bob Johnson', role: 'Designer', avatar: 'BJ', department: 'Design' },
    { name: 'Carol White', role: 'Developer', avatar: 'CW', department: 'Engineering' },
    { name: 'David Brown', role: 'Product Manager', avatar: 'DB', department: 'Product' },
  ];

  // Get upcoming events from context
  const upcomingEvents = getCompanyEvents()
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5); // Show next 5 events

  const { profile } = useUserProfile();
  const { userRole } = useRole();
  const userProfile = {
    name: profile.firstName + ' ' + profile.lastName,
    email: profile.email,
    phone: profile.phone,
    position: profile.position,
    department: profile.department,
    initials: (profile.firstName[0] || '') + (profile.lastName[0] || ''),
  };
  const roleLabels = {
    employee: 'Employee',
    hr: 'HR Manager',
    manager: 'Manager',
    it: 'IT Support',
  };
  const navigate = useNavigate();
  
  // Helper functions
  const handleDownloadPayStub = (period: string) => {
    toast({
      title: "Download Started",
      description: `Pay stub for ${period} is being downloaded.`,
    });
  };
  
  const handleDownloadDocument = (docName: string) => {
    toast({
      title: "Download Started",
      description: `${docName} is being downloaded.`,
    });
  };
  
  const handleDownloadTaxDocument = (docName: string) => {
    toast({
      title: "Download Started",
      description: `${docName} is being downloaded.`,
    });
  };
  
  // Update handlers
  const handleTimeOffSubmit = () => {
    const days = timeOffForm.startDate && timeOffForm.endDate ? 
      Math.ceil((new Date(timeOffForm.endDate).getTime() - new Date(timeOffForm.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 1;
    
    submitLeaveRequest({
      employeeId: userEmployeeId,
      employeeName: profile.firstName + ' ' + profile.lastName,
      type: timeOffForm.type as 'Vacation' | 'Sick Leave' | 'Personal' | 'Other',
      startDate: timeOffForm.startDate,
      endDate: timeOffForm.endDate,
      reason: timeOffForm.reason,
      days: days
    });
    
    toast({
      title: "Time Off Request Submitted",
      description: "Your time off request has been submitted for approval.",
    });
    setShowTimeOffModal(false);
    setTimeOffForm({ type: '', startDate: '', endDate: '', reason: '' });
  };
  const handleDocumentUpload = () => {
    setDocuments(prev => [
      {
        name: documentUpload.name || (documentUpload.file ? documentUpload.file.name : 'Untitled'),
        type: documentUpload.type || 'PDF',
        uploadDate: new Date().toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    toast({
      title: "Document Uploaded",
      description: "Your document has been uploaded successfully.",
    });
    setShowDocumentUploadModal(false);
    setDocumentUpload({ name: '', type: '', file: null });
  };
  const handleBenefitsUpdate = () => {
    toast({
      title: "Benefits Updated",
      description: "Your benefits information has been updated.",
    });
    setShowBenefitsModal(false);
  };
  const handleTaxInfoUpdate = () => {
    setTaxInfo({ ...taxInfo }); // Already updated via form binding
    toast({
      title: "Tax Information Updated",
      description: "Your tax information has been updated successfully.",
    });
    setShowTaxUpdateModal(false);
  };
  const handleTimesheetSubmit = () => {
    setTimesheets(prev => [
      {
        weekEnding: timesheetData.weekEnding,
        regularHours: timesheetData.hours.reduce((a, b) => a + b, 0),
        overtimeHours: timesheetData.hours.filter(h => h > 8).reduce((a, b) => a + (b - 8), 0),
        status: 'Pending',
      },
      ...prev,
    ]);
    toast({
      title: "Timesheet Submitted",
      description: "Your timesheet has been submitted for approval.",
    });
    setShowTimesheetModal(false);
    setTimesheetData({ weekEnding: '', hours: Array(7).fill(8), notes: '' });
  };
  
  const handleEventRSVP = (event: any, response: string) => {
    toast({
      title: "RSVP Submitted",
      description: `You have ${response} for ${event.title}.`,
    });
    setShowEventRSVPModal(false);
    setSelectedEvent(null);
  };

  const handleCreateEvent = () => {
    addEvent({
      type: newEventForm.type,
      title: newEventForm.title,
      date: newEventForm.date,
      time: newEventForm.isAllDay ? undefined : newEventForm.time || undefined,
      endTime: newEventForm.isAllDay ? undefined : newEventForm.endTime || undefined,
      isAllDay: newEventForm.isAllDay,
      location: newEventForm.location || undefined,
      description: newEventForm.description || undefined,
      createdBy: userEmployeeId,
      isPersonal: newEventForm.isPersonal
    });
    
    toast({
      title: "Event Created",
      description: `${newEventForm.title} has been added to the calendar.`,
    });
    
    setShowCreateEventModal(false);
    setNewEventForm({
      type: 'Event',
      title: '',
      date: '',
      time: '',
      endTime: '',
      isAllDay: false,
      location: '',
      description: '',
      isPersonal: false
    });
  };

  const handleAddToCalendar = (event: any) => {
    // This would typically add to the user's personal calendar
    // For now, we'll just show a toast
    toast({
      title: "Added to Calendar",
      description: `${event.title} has been added to your personal calendar.`,
    });
  };
  
  const handleAnnouncementClick = (announcement: any) => {
    toast({
      title: announcement.title,
      description: announcement.content,
    });
  };
  
  const handleEmployeeContact = (employee: any) => {
    toast({
      title: "Contact Information",
      description: `Contact ${employee.name} at ${employee.email || 'email@company.com'}`,
    });
  };
  
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Portal</h1>
        <p className="text-gray-600">Manage your profile and access all employee resources.</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="pay">Pay</TabsTrigger>
          <TabsTrigger value="timeoff">Time Off</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="taxes">Taxes</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="timesheets">Timesheets</TabsTrigger>
          {userRole === 'manager' && <TabsTrigger value="management">Management</TabsTrigger>}
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>My Profile</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">{userProfile.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{userProfile.name}</h3>
                    <p className="text-gray-600">{userProfile.position}</p>
                    <Badge className="mt-1" variant="secondary">{roleLabels[userRole] || 'Employee'}</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{userProfile.email}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{userProfile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>Joined: Jan 15, 2022</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4" onClick={() => navigate('/settings')}>Edit Profile</Button>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Company Announcements</span>
                </CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {announcements.map((announcement) => (
                    <div 
                      key={announcement.id} 
                      className="border-l-4 border-blue-500 pl-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleAnnouncementClick(announcement)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                        <Badge variant={announcement.priority === 'high' ? 'destructive' : announcement.priority === 'medium' ? 'default' : 'secondary'}>
                          {announcement.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{announcement.content}</p>
                      <p className="text-xs text-gray-400">{announcement.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Organization Directory */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Organization</span>
              </CardTitle>
              <Button variant="outline" size="sm">View All Employees</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleEmployeeContact(member)}
                  >
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-purple-100 text-purple-600">{member.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{member.name}</p>
                      <p className="text-xs text-gray-600">{member.role}</p>
                      <Badge variant="outline" className="text-xs mt-1">{member.department}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Health Benefits</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Medical Plan:</strong> Premium Health Plus</p>
                  <p><strong>Dental Plan:</strong> Comprehensive Dental</p>
                  <p><strong>Vision Plan:</strong> Complete Vision Care</p>
                  <p><strong>Deductible:</strong> $1,500 (Individual)</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowBenefitsModal(true)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Retirement & Savings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>401(k) Plan:</strong> Enrolled</p>
                  <p><strong>Contribution:</strong> 8% of salary</p>
                  <p><strong>Company Match:</strong> 4% (100% match)</p>
                  <p><strong>Vesting:</strong> Immediate</p>
                </div>
                <Button variant="outline" className="w-full">Manage Contributions</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Life & Disability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Life Insurance:</strong> $250,000</p>
                  <p><strong>Short-term Disability:</strong> 60% salary</p>
                  <p><strong>Long-term Disability:</strong> 60% salary</p>
                </div>
                <Button variant="outline" className="w-full">View Coverage</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Flexible Spending Account:</strong> $2,500</p>
                  <p><strong>Employee Assistance Program:</strong> Available</p>
                  <p><strong>Wellness Program:</strong> Active</p>
                </div>
                <Button variant="outline" className="w-full">Enroll in Benefits</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pay">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Pay Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">$124,800</p>
                    <p className="text-sm text-gray-600">Annual Salary</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">$10,400</p>
                    <p className="text-sm text-gray-600">Monthly Gross</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">$7,780</p>
                    <p className="text-sm text-gray-600">Monthly Net</p>
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-4">Recent Pay Stubs</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pay Period</TableHead>
                      <TableHead>Gross Pay</TableHead>
                      <TableHead>Net Pay</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payStubs.map((stub, index) => (
                      <TableRow key={index}>
                        <TableCell>{stub.period}</TableCell>
                        <TableCell>{stub.grossPay}</TableCell>
                        <TableCell>{stub.netPay}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{stub.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadPayStub(stub.period)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeoff">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plane className="w-5 h-5" />
                    <span>Time Off Balance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Vacation Days</span>
                      <span className="font-semibold">18 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sick Leave</span>
                      <span className="font-semibold">5 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Personal Days</span>
                      <span className="font-semibold">3 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Time Off Requests</CardTitle>
                  <Button onClick={() => setShowTimeOffModal(true)}>Request Time Off</Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeOffRequests.map((request, index) => (
                        <TableRow key={index}>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{request.dates}</TableCell>
                          <TableCell>{request.days}</TableCell>
                          <TableCell>
                            <Badge variant={request.status === 'Approved' ? 'default' : 'secondary'}>
                              {request.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>My Documents</span>
              </CardTitle>
              <Button onClick={() => setShowDocumentUploadModal(true)}>Upload Document</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Upload Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc, index) => (
                    <TableRow key={index}>
                      <TableCell>{doc.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.type}</Badge>
                      </TableCell>
                      <TableCell>{doc.uploadDate}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownloadDocument(doc.name)}
                          >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <PartyPopper className="w-5 h-5" />
                <span>Upcoming Events</span>
              </CardTitle>
              <Button onClick={() => setShowCreateEventModal(true)}>Create Event</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{event.title}</h4>
                        <p className="text-gray-600 text-sm">{event.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{event.date}</p>
                        <p className="text-sm text-gray-600">{event.time}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventRSVPModal(true);
                        }}
                      >
                        RSVP
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAddToCalendar(event)}
                      >
                        Add to Calendar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="taxes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calculator className="w-5 h-5" />
                  <span>Tax Documents</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>W-2 Form 2023</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadTaxDocument('W-2 Form 2023')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>1095-C Form 2023</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadTaxDocument('1095-C Form 2023')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-3 border rounded">
                    <span>Tax Summary 2023</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownloadTaxDocument('Tax Summary 2023')}
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tax Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p><strong>Filing Status:</strong> {taxInfo.filingStatus}</p>
                  <p><strong>Allowances:</strong> {taxInfo.allowances}</p>
                  <p><strong>Additional Withholding:</strong> ${taxInfo.additionalWithholding}</p>
                  <p><strong>State:</strong> {taxInfo.state}</p>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowTaxUpdateModal(true)}
                >
                  Update Tax Information
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="onboarding">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5" />
                <span>Onboarding Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Complete Profile Information</h4>
                      <p className="text-sm text-gray-600">Update your personal and contact details</p>
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">IT Setup & Security Training</h4>
                      <p className="text-sm text-gray-600">Complete mandatory security awareness training</p>
                    </div>
                    <Badge>Completed</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Benefits Enrollment</h4>
                      <p className="text-sm text-gray-600">Select your health and retirement benefits</p>
                    </div>
                    <Badge variant="secondary">In Progress</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-semibold">Department Orientation</h4>
                      <p className="text-sm text-gray-600">Meet your team and learn about department processes</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Onboarding Progress: 75%</h4>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timesheets">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Timesheets</span>
              </CardTitle>
              <Button onClick={() => setShowTimesheetModal(true)}>Submit Timesheet</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{timesheets[0]?.regularHours ?? 0}</p>
                    <p className="text-sm text-gray-600">Hours This Week</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{timesheets.reduce((a, t) => a + t.regularHours, 0)}</p>
                    <p className="text-sm text-gray-600">Hours This Month</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{timesheets.reduce((a, t) => a + t.overtimeHours, 0)}</p>
                    <p className="text-sm text-gray-600">Overtime Hours</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Recent Timesheets</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Week Ending</TableHead>
                        <TableHead>Regular Hours</TableHead>
                        <TableHead>Overtime Hours</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timesheets.map((ts, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{ts.weekEnding}</TableCell>
                          <TableCell>{ts.regularHours}</TableCell>
                          <TableCell>{ts.overtimeHours}</TableCell>
                          <TableCell><Badge variant={ts.status === 'Pending' ? 'secondary' : undefined}>{ts.status}</Badge></TableCell>
                          <TableCell><Button variant="outline" size="sm">View</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {userRole === 'manager' && (
          <TabsContent value="management">
            <div className="space-y-6">
              {/* Manager Dashboard Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-gray-600">Team Members</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-8 h-8 text-yellow-600" />
                      <div>
                        <p className="text-2xl font-bold">3</p>
                        <p className="text-sm text-gray-600">Pending Approvals</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold">85%</p>
                        <p className="text-sm text-gray-600">Team Performance</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-8 h-8 text-red-600" />
                      <div>
                        <p className="text-2xl font-bold">2</p>
                        <p className="text-sm text-gray-600">Active Issues</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Team Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Team Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">Direct Reports</h3>
                      <Button variant="outline" size="sm">View All Team</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamMembers.slice(0, 6).map((member, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback className="bg-purple-100 text-purple-600">{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-gray-600">{member.role}</p>
                              <Badge variant="outline" className="text-xs mt-1">{member.department}</Badge>
                            </div>
                            <Button variant="outline" size="sm">Manage</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions for Managers */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5" />
                    <span>Manager Actions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => navigate('/hr')}
                    >
                      <UserCheck className="w-6 h-6" />
                      <span>HR Management</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => navigate('/helpdesk')}
                    >
                      <Headphones className="w-6 h-6" />
                      <span>IT Helpdesk</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => navigate('/training')}
                    >
                      <BookOpen className="w-6 h-6" />
                      <span>Training Management</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => navigate('/calendar')}
                    >
                      <Calendar className="w-6 h-6" />
                      <span>Calendar Management</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => navigate('/documents')}
                    >
                      <FileText className="w-6 h-6" />
                      <span>Document Center</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="h-20 flex flex-col items-center justify-center space-y-2"
                      onClick={() => navigate('/safety')}
                    >
                      <ShieldCheck className="w-6 h-6" />
                      <span>Safety & Compliance</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Team Performance</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-green-600">92%</p>
                        <p className="text-sm text-gray-600">On-time Delivery</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">4.2/5</p>
                        <p className="text-sm text-gray-600">Team Satisfaction</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">85%</p>
                        <p className="text-sm text-gray-600">Goal Achievement</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Recent Performance Reviews</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Alice Smith</p>
                            <p className="text-sm text-gray-600">Software Engineer</p>
                          </div>
                          <Badge variant="default">Exceeds Expectations</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">Bob Johnson</p>
                            <p className="text-sm text-gray-600">UI Designer</p>
                          </div>
                          <Badge variant="secondary">Meets Expectations</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Time Off Request Modal */}
      <Dialog open={showTimeOffModal} onOpenChange={setShowTimeOffModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request Time Off</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">Type</Label>
              <Select value={timeOffForm.type} onValueChange={(value) => setTimeOffForm({...timeOffForm, type: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vacation">Vacation</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="bereavement">Bereavement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                className="col-span-3"
                value={timeOffForm.startDate}
                onChange={(e) => setTimeOffForm({...timeOffForm, startDate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">End Date</Label>
              <Input
                id="endDate"
                type="date"
                className="col-span-3"
                value={timeOffForm.endDate}
                onChange={(e) => setTimeOffForm({...timeOffForm, endDate: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">Reason</Label>
              <Textarea
                id="reason"
                className="col-span-3"
                placeholder="Please provide a reason for your time off request"
                value={timeOffForm.reason}
                onChange={(e) => setTimeOffForm({...timeOffForm, reason: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowTimeOffModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleTimeOffSubmit}>
              Submit Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Upload Modal */}
      <Dialog open={showDocumentUploadModal} onOpenChange={setShowDocumentUploadModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docName" className="text-right">Document Name</Label>
              <Input
                id="docName"
                className="col-span-3"
                placeholder="Enter document name"
                value={documentUpload.name}
                onChange={(e) => setDocumentUpload({...documentUpload, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="docType" className="text-right">Type</Label>
              <Select value={documentUpload.type} onValueChange={(value) => setDocumentUpload({...documentUpload, type: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">Word Document</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="file" className="text-right">File</Label>
              <Input
                id="file"
                type="file"
                className="col-span-3"
                onChange={(e) => setDocumentUpload({...documentUpload, file: e.target.files?.[0] || null})}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDocumentUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleDocumentUpload}>
              Upload
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Benefits Details Modal */}
      <Dialog open={showBenefitsModal} onOpenChange={setShowBenefitsModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Benefits Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Medical Benefits</h4>
                <p className="text-sm text-gray-600">Premium Health Plus Plan</p>
                <p className="text-sm text-gray-600">Coverage: 90% after deductible</p>
                <p className="text-sm text-gray-600">Deductible: $1,500 individual</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Dental Benefits</h4>
                <p className="text-sm text-gray-600">Comprehensive Dental Plan</p>
                <p className="text-sm text-gray-600">Coverage: 100% preventive, 80% basic</p>
                <p className="text-sm text-gray-600">Annual maximum: $2,000</p>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Vision Benefits</h4>
              <p className="text-sm text-gray-600">Complete Vision Care</p>
              <p className="text-sm text-gray-600">Coverage: Annual eye exam, frames every 2 years</p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleBenefitsUpdate}>
              Update Benefits
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tax Information Update Modal */}
      <Dialog open={showTaxUpdateModal} onOpenChange={setShowTaxUpdateModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Tax Information</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="filingStatus" className="text-right">Filing Status</Label>
              <Select value={taxInfo.filingStatus} onValueChange={(value) => setTaxInfo({...taxInfo, filingStatus: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Head of Household">Head of Household</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="allowances" className="text-right">Allowances</Label>
              <Input
                id="allowances"
                type="number"
                className="col-span-3"
                value={taxInfo.allowances}
                onChange={(e) => setTaxInfo({...taxInfo, allowances: parseInt(e.target.value)})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="additionalWithholding" className="text-right">Additional Withholding</Label>
              <Input
                id="additionalWithholding"
                type="number"
                className="col-span-3"
                value={taxInfo.additionalWithholding}
                onChange={(e) => setTaxInfo({...taxInfo, additionalWithholding: parseInt(e.target.value)})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="state" className="text-right">State</Label>
              <Select value={taxInfo.state} onValueChange={(value) => setTaxInfo({...taxInfo, state: value})}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="California">California</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="Texas">Texas</SelectItem>
                  <SelectItem value="Florida">Florida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowTaxUpdateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleTaxInfoUpdate}>
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Timesheet Submission Modal */}
      <Dialog open={showTimesheetModal} onOpenChange={setShowTimesheetModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Timesheet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weekEnding" className="text-right">Week Ending</Label>
              <Input
                id="weekEnding"
                type="date"
                className="col-span-3"
                value={timesheetData.weekEnding}
                onChange={(e) => setTimesheetData({...timesheetData, weekEnding: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Daily Hours</Label>
              <div className="grid grid-cols-7 gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="space-y-1">
                    <Label className="text-xs">{day}</Label>
                    <Input
                      type="number"
                      min="0"
                      max="24"
                      step="0.5"
                      value={timesheetData.hours[index]}
                      onChange={(e) => {
                        const newHours = [...timesheetData.hours];
                        newHours[index] = parseFloat(e.target.value) || 0;
                        setTimesheetData({...timesheetData, hours: newHours});
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">Notes</Label>
              <Textarea
                id="notes"
                className="col-span-3"
                placeholder="Any additional notes about your timesheet"
                value={timesheetData.notes}
                onChange={(e) => setTimesheetData({...timesheetData, notes: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowTimesheetModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleTimesheetSubmit}>
              Submit Timesheet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event RSVP Modal */}
      <Dialog open={showEventRSVPModal} onOpenChange={setShowEventRSVPModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>RSVP for Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedEvent && (
              <div className="space-y-2">
                <h4 className="font-semibold">{selectedEvent.title}</h4>
                <p className="text-sm text-gray-600">{selectedEvent.date} at {selectedEvent.time}</p>
                <p className="text-sm text-gray-600">Location: {selectedEvent.location}</p>
              </div>
            )}
            <div className="flex space-x-2">
              <Button 
                className="flex-1" 
                onClick={() => selectedEvent && handleEventRSVP(selectedEvent, 'accepted')}
              >
                Accept
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => selectedEvent && handleEventRSVP(selectedEvent, 'declined')}
              >
                Decline
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={showCreateEventModal} onOpenChange={setShowCreateEventModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventType" className="text-right">Event Type</Label>
              <Select 
                value={newEventForm.type} 
                onValueChange={(value) => setNewEventForm({...newEventForm, type: value as any})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Deadline">Deadline</SelectItem>
                  <SelectItem value="Holiday">Holiday</SelectItem>
                  <SelectItem value="Personal">Personal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventTitle" className="text-right">Title</Label>
              <Input
                id="eventTitle"
                className="col-span-3"
                placeholder="Event title"
                value={newEventForm.title}
                onChange={(e) => setNewEventForm({...newEventForm, title: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventDate" className="text-right">Date</Label>
              <Input
                id="eventDate"
                type="date"
                className="col-span-3"
                value={newEventForm.date}
                onChange={(e) => setNewEventForm({...newEventForm, date: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventAllDay" className="text-right">All Day Event</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <input
                  id="eventAllDay"
                  type="checkbox"
                  checked={newEventForm.isAllDay}
                  onChange={(e) => setNewEventForm({...newEventForm, isAllDay: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="eventAllDay" className="text-sm">This is an all-day event</Label>
              </div>
            </div>
            {!newEventForm.isAllDay && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="eventTime" className="text-right">Start Time</Label>
                  <Select 
                    value={newEventForm.time} 
                    onValueChange={(value) => setNewEventForm({...newEventForm, time: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12:00 AM">12:00 AM</SelectItem>
                      <SelectItem value="12:30 AM">12:30 AM</SelectItem>
                      <SelectItem value="1:00 AM">1:00 AM</SelectItem>
                      <SelectItem value="1:30 AM">1:30 AM</SelectItem>
                      <SelectItem value="2:00 AM">2:00 AM</SelectItem>
                      <SelectItem value="2:30 AM">2:30 AM</SelectItem>
                      <SelectItem value="3:00 AM">3:00 AM</SelectItem>
                      <SelectItem value="3:30 AM">3:30 AM</SelectItem>
                      <SelectItem value="4:00 AM">4:00 AM</SelectItem>
                      <SelectItem value="4:30 AM">4:30 AM</SelectItem>
                      <SelectItem value="5:00 AM">5:00 AM</SelectItem>
                      <SelectItem value="5:30 AM">5:30 AM</SelectItem>
                      <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                      <SelectItem value="6:30 AM">6:30 AM</SelectItem>
                      <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                      <SelectItem value="7:30 AM">7:30 AM</SelectItem>
                      <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                      <SelectItem value="8:30 AM">8:30 AM</SelectItem>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                      <SelectItem value="9:30 AM">9:30 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                      <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                      <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                      <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                      <SelectItem value="1:30 PM">1:30 PM</SelectItem>
                      <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                      <SelectItem value="2:30 PM">2:30 PM</SelectItem>
                      <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                      <SelectItem value="3:30 PM">3:30 PM</SelectItem>
                      <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                      <SelectItem value="4:30 PM">4:30 PM</SelectItem>
                      <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                      <SelectItem value="5:30 PM">5:30 PM</SelectItem>
                      <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                      <SelectItem value="6:30 PM">6:30 PM</SelectItem>
                      <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                      <SelectItem value="7:30 PM">7:30 PM</SelectItem>
                      <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                      <SelectItem value="8:30 PM">8:30 PM</SelectItem>
                      <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                      <SelectItem value="9:30 PM">9:30 PM</SelectItem>
                      <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                      <SelectItem value="10:30 PM">10:30 PM</SelectItem>
                      <SelectItem value="11:00 PM">11:00 PM</SelectItem>
                      <SelectItem value="11:30 PM">11:30 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="eventEndTime" className="text-right">End Time</Label>
                  <Select 
                    value={newEventForm.endTime} 
                    onValueChange={(value) => setNewEventForm({...newEventForm, endTime: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select end time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12:00 AM">12:00 AM</SelectItem>
                      <SelectItem value="12:30 AM">12:30 AM</SelectItem>
                      <SelectItem value="1:00 AM">1:00 AM</SelectItem>
                      <SelectItem value="1:30 AM">1:30 AM</SelectItem>
                      <SelectItem value="2:00 AM">2:00 AM</SelectItem>
                      <SelectItem value="2:30 AM">2:30 AM</SelectItem>
                      <SelectItem value="3:00 AM">3:00 AM</SelectItem>
                      <SelectItem value="3:30 AM">3:30 AM</SelectItem>
                      <SelectItem value="4:00 AM">4:00 AM</SelectItem>
                      <SelectItem value="4:30 AM">4:30 AM</SelectItem>
                      <SelectItem value="5:00 AM">5:00 AM</SelectItem>
                      <SelectItem value="5:30 AM">5:30 AM</SelectItem>
                      <SelectItem value="6:00 AM">6:00 AM</SelectItem>
                      <SelectItem value="6:30 AM">6:30 AM</SelectItem>
                      <SelectItem value="7:00 AM">7:00 AM</SelectItem>
                      <SelectItem value="7:30 AM">7:30 AM</SelectItem>
                      <SelectItem value="8:00 AM">8:00 AM</SelectItem>
                      <SelectItem value="8:30 AM">8:30 AM</SelectItem>
                      <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                      <SelectItem value="9:30 AM">9:30 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="10:30 AM">10:30 AM</SelectItem>
                      <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                      <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                      <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                      <SelectItem value="12:30 PM">12:30 PM</SelectItem>
                      <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                      <SelectItem value="1:30 PM">1:30 PM</SelectItem>
                      <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                      <SelectItem value="2:30 PM">2:30 PM</SelectItem>
                      <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                      <SelectItem value="3:30 PM">3:30 PM</SelectItem>
                      <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                      <SelectItem value="4:30 PM">4:30 PM</SelectItem>
                      <SelectItem value="5:00 PM">5:00 PM</SelectItem>
                      <SelectItem value="5:30 PM">5:30 PM</SelectItem>
                      <SelectItem value="6:00 PM">6:00 PM</SelectItem>
                      <SelectItem value="6:30 PM">6:30 PM</SelectItem>
                      <SelectItem value="7:00 PM">7:00 PM</SelectItem>
                      <SelectItem value="7:30 PM">7:30 PM</SelectItem>
                      <SelectItem value="8:00 PM">8:00 PM</SelectItem>
                      <SelectItem value="8:30 PM">8:30 PM</SelectItem>
                      <SelectItem value="9:00 PM">9:00 PM</SelectItem>
                      <SelectItem value="9:30 PM">9:30 PM</SelectItem>
                      <SelectItem value="10:00 PM">10:00 PM</SelectItem>
                      <SelectItem value="10:30 PM">10:30 PM</SelectItem>
                      <SelectItem value="11:00 PM">11:00 PM</SelectItem>
                      <SelectItem value="11:30 PM">11:30 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventLocation" className="text-right">Location</Label>
              <Input
                id="eventLocation"
                className="col-span-3"
                placeholder="Event location (optional)"
                value={newEventForm.location}
                onChange={(e) => setNewEventForm({...newEventForm, location: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventDescription" className="text-right">Description</Label>
              <Textarea
                id="eventDescription"
                className="col-span-3"
                placeholder="Event description (optional)"
                value={newEventForm.description}
                onChange={(e) => setNewEventForm({...newEventForm, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="eventPersonal" className="text-right">Personal Event</Label>
              <div className="col-span-3 flex items-center space-x-2">
                <input
                  id="eventPersonal"
                  type="checkbox"
                  checked={newEventForm.isPersonal}
                  onChange={(e) => setNewEventForm({...newEventForm, isPersonal: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="eventPersonal" className="text-sm">Make this a personal event</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateEventModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateEvent}
              disabled={!newEventForm.title || !newEventForm.date}
            >
              Create Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeePortal;
