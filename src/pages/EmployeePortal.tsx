import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRole } from '@/contexts/RoleContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  FileText, 
  Settings, 
  Headphones,
  Bell,
  User,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Target,
  Award,
  Coffee,
  MessageSquare,
  Search,
  Star,
  Building2,
  MapPin,
  Shield
} from 'lucide-react';
import QuickActions from '@/components/QuickActions';
import RecentActivity from '@/components/RecentActivity';
import EmployeeITSupport from '@/components/EmployeeITSupport';

const EmployeePortal = () => {
  const { userRole } = useRole();
  const { notifications } = useNotifications();
  const { profile } = useUserProfile();
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Handle URL parameters to open specific tabs
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'support') {
      setSelectedTab('support');
    }
  }, [searchParams]);

  const stats = [
    { title: 'Hours This Week', value: '38', icon: Clock, color: 'bg-blue-500' },
    { title: 'Leave Balance', value: '12 days', icon: Calendar, color: 'bg-green-500' },
    { title: 'Training Progress', value: '85%', icon: BookOpen, color: 'bg-purple-500' },
    { title: 'Team Members', value: '8', icon: Users, color: 'bg-orange-500' },
  ];

  const announcements = [
    {
      title: 'Holiday Schedule Updated',
      content: 'Please review the updated holiday schedule for Q2 2024.',
      date: '2024-01-15',
      priority: 'info',
      category: 'Company News'
    },
    {
      title: 'New Security Training Required',
      content: 'All employees must complete the new cybersecurity training by March 1st.',
      date: '2024-01-14',
      priority: 'urgent',
      category: 'Training'
    },
    {
      title: 'Office WiFi Maintenance',
      content: 'Network maintenance scheduled for this weekend. Minimal disruption expected.',
      date: '2024-01-13',
      priority: 'info',
      category: 'IT Updates'
    }
  ];

  const recentActivities = [
    {
      action: 'Leave request approved',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      action: 'Training module completed',
      time: '1 day ago',
      icon: BookOpen,
      color: 'text-blue-600'
    },
    {
      action: 'Performance review submitted',
      time: '3 days ago',
      icon: Star,
      color: 'text-purple-600'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'important': return 'bg-orange-100 text-orange-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {profile?.firstName || 'Employee'}!
        </h1>
        <p className="text-gray-600">Here's what's happening in your workplace today.</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="leave">Time Off</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="support">IT Support</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
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
                
                <Button
                  className="w-full mt-4 rounded-xl shadow-lg border-2 border-blue-500 bg-blue-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            {/* Announcements */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span>Company Announcements</span>
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl border-2 border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-400"
                >
                  View All
                </Button>
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

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>My Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Employee Profile</h3>
                <p className="text-gray-600 mb-4">View and update your personal information, contact details, and preferences.</p>
                <Button>Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
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
                  <Button
                    onClick={() => setShowTimeOffModal(true)}
                    className="rounded-xl shadow-lg border-2 border-blue-500 bg-blue-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
                  >
                    Request Time Off
                  </Button>
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
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-2 border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-400"
                onClick={() => setShowDocumentUploadModal(true)}
              >
                Upload Document
              </Button>
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
                            className="rounded-xl border-2 border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-400"
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
              <Button
                onClick={() => setShowCreateEventModal(true)}
                className="rounded-xl shadow-lg border-2 border-blue-500 bg-blue-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
              >
                Create Event
              </Button>
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
                  onClick={() => setShowTaxUpdateModal(true)}
                  className="w-full rounded-xl border-2 border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-400"
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
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Learning Modules</h3>
                <p className="text-gray-600 mb-4">Access training materials, track your progress, and earn certifications.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button>Browse Courses</Button>
                  <Button variant="outline">My Progress</Button>
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
              <Button
                onClick={() => setShowTimesheetModal(true)}
                className="rounded-xl shadow-lg border-2 border-blue-500 bg-blue-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
              >
                Submit Timesheet
              </Button>
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
                          <TableCell><Button variant="outline" size="sm" className="rounded-xl border-2 border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-400">View</Button></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Safety & Compliance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Safety Resources</h3>
                <p className="text-gray-600 mb-4">Access safety guidelines, report incidents, and stay compliant with company policies.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button>Safety Guidelines</Button>
                  <Button variant="outline">Report Incident</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
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
            <Button
              onClick={handleTaxInfoUpdate}
              className="rounded-xl shadow-lg border-2 border-blue-500 bg-blue-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
            >
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
            <Button
              onClick={handleTimesheetSubmit}
              className="rounded-xl shadow-lg border-2 border-blue-500 bg-blue-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
            >
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
                className="flex-1 rounded-xl shadow-lg border-2 border-blue-500 bg-blue-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
                onClick={() => selectedEvent && handleEventRSVP(selectedEvent, 'accepted')}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-xl border-2 border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-400"
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
            <Button
              variant="outline"
              onClick={() => setShowCreateEventModal(false)}
              className="rounded-xl border-2 border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:ring-2 focus:ring-blue-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={!newEventForm.title || !newEventForm.date}
              className="rounded-xl shadow-lg border-2 border-blue-500 bg-blue-600 text-white font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl focus:ring-2 focus:ring-blue-400"
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
