
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Search,
  Download,
  Bell,
  MessageSquare,
  Award,
  GraduationCap,
  DollarSign,
  Shield
} from 'lucide-react';

const HRManagement = () => {
  const leaveRequests = [
    { id: 1, employee: 'Sarah Johnson', type: 'Vacation', dates: 'Jan 15-19, 2024', status: 'pending', days: 5 },
    { id: 2, employee: 'Mike Chen', type: 'Sick Leave', dates: 'Jan 12, 2024', status: 'approved', days: 1 },
    { id: 3, employee: 'Emily Davis', type: 'Personal', dates: 'Jan 22-23, 2024', status: 'pending', days: 2 },
    { id: 4, employee: 'Tom Wilson', type: 'Vacation', dates: 'Feb 5-9, 2024', status: 'approved', days: 5 },
  ];

  const employees = [
    { id: 1, name: 'John Doe', department: 'Engineering', role: 'Senior Developer', email: 'john@company.com', location: 'San Francisco' },
    { id: 2, name: 'Sarah Johnson', department: 'Marketing', role: 'Marketing Manager', email: 'sarah@company.com', location: 'New York' },
    { id: 3, name: 'Mike Chen', department: 'Design', role: 'UX Designer', email: 'mike@company.com', location: 'Remote' },
    { id: 4, name: 'Emily Davis', department: 'Sales', role: 'Sales Representative', email: 'emily@company.com', location: 'Chicago' },
  ];

  const hrDocuments = [
    { id: 1, title: 'Employee Handbook', type: 'Policy', lastUpdated: '2024-01-15', version: '2.1' },
    { id: 2, title: 'Leave Request Form', type: 'Form', lastUpdated: '2024-01-10', version: '1.3' },
    { id: 3, title: 'Code of Conduct', type: 'Policy', lastUpdated: '2024-01-08', version: '3.0' },
    { id: 4, title: 'Expense Reimbursement Form', type: 'Form', lastUpdated: '2024-01-05', version: '1.2' },
  ];

  const hrAnnouncements = [
    { id: 1, title: 'Holiday Schedule Updated', content: 'Please review the updated holiday schedule for 2024', priority: 'info', date: '2024-01-15' },
    { id: 2, title: 'New Benefits Enrollment', content: 'Open enrollment period starts February 1st', priority: 'urgent', date: '2024-01-14' },
    { id: 3, title: 'Team Building Event', content: 'Join us for the quarterly team building event', priority: 'reminder', date: '2024-01-12' },
  ];

  const employeeStats = [
    { title: 'Total Employees', value: '247', icon: Users, color: 'bg-blue-500' },
    { title: 'Pending Leave', value: '8', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Performance Reviews', value: '23', icon: TrendingUp, color: 'bg-green-500' },
    { title: 'New Hires (Month)', value: '5', icon: CheckCircle, color: 'bg-purple-500' },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'info': return <Badge variant="default">Info</Badge>;
      case 'reminder': return <Badge variant="secondary">Reminder</Badge>;
      default: return <Badge variant="outline">Normal</Badge>;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Management Portal</h1>
        <p className="text-gray-600">Comprehensive HR management and employee services.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {employeeStats.map((stat, index) => (
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
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="directory" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="directory">Employee Directory</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="documents">HR Documents</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="support">HR Support</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Employee Directory</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Input placeholder="Search employees..." className="w-64" />
                <Button variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                      <p className="text-sm text-gray-600">{employee.role} • {employee.department}</p>
                      <p className="text-xs text-gray-500">{employee.email} • {employee.location}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View Profile</Button>
                      <Button size="sm" variant="outline">Contact</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Leave Management</span>
              </CardTitle>
              <Button>New Request</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{request.employee}</h4>
                          <p className="text-sm text-gray-600">{request.type} • {request.days} days</p>
                          <p className="text-xs text-gray-500">{request.dates}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                        {request.status}
                      </Badge>
                      {request.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Reject</Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>HR Policies & Documents</span>
              </CardTitle>
              <Button>Upload Document</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hrDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                      <p className="text-sm text-gray-600">Type: {doc.type} • Version: {doc.version}</p>
                      <p className="text-xs text-gray-500">Last updated: {doc.lastUpdated}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>HR Announcements</span>
              </CardTitle>
              <Button>New Announcement</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {hrAnnouncements.map((announcement) => (
                  <div key={announcement.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(announcement.priority)}
                        <span className="text-xs text-gray-500">{announcement.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance Management</span>
              </CardTitle>
              <Button>Schedule Review</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Award className="w-8 h-8 text-yellow-500" />
                    <div>
                      <h3 className="font-semibold">Performance Reviews</h3>
                      <p className="text-sm text-gray-600">Manage employee evaluations</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">View Reviews</Button>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <GraduationCap className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">Goal Tracking</h3>
                      <p className="text-sm text-gray-600">Monitor individual & team goals</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">Manage Goals</Button>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <MessageSquare className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold">Feedback</h3>
                      <p className="text-sm text-gray-600">Peer & manager feedback</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full">Give Feedback</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>HR Support & Helpdesk</span>
              </CardTitle>
              <Button>Submit Request</Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      Name Change Request
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Payroll Inquiry
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Report Issue
                    </Button>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Support Statistics</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Open Tickets</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">In Progress</span>
                      <Badge variant="default">8</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Resolved Today</span>
                      <Badge variant="outline">15</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRManagement;
