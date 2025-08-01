import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { employees } from '@/data/employees';
import { useLeaveRequests } from '@/contexts/LeaveRequestContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  GraduationCap, 
  Calendar, 
  FileText, 
  MessageSquare,
  Download,
  Headphones,
  UserPlus,
  UserCheck,
  Lock,
  Activity,
  DollarSign,
  Award,
  Megaphone,
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  UserCircle
} from 'lucide-react';

const ManagerTools = () => {
  // Context hooks
  const { leaveRequests: contextLeaveRequests, approveLeaveRequest, rejectLeaveRequest, loading, error } = useLeaveRequests();
  const { profile } = useUserProfile();
  
  // State for different sections
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
  const [timesheetModalOpen, setTimesheetModalOpen] = useState(false);
  const [payrollModalOpen, setPayrollModalOpen] = useState(false);
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const [communicationModalOpen, setCommunicationModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [approvingRequestId, setApprovingRequestId] = useState<number | null>(null);
  const [rejectingRequestId, setRejectingRequestId] = useState<number | null>(null);

  // Mock data for manager dashboard
  const [teamMembers, setTeamMembers] = useState(employees.filter(emp => emp.role === 'employee').slice(0, 8));
  const [timesheets, setTimesheets] = useState([
    { id: 1, employee: 'John Doe', week: 'Dec 9-15, 2024', hours: 40, status: 'pending', submitted: '2024-12-16' },
    { id: 2, employee: 'Sarah Johnson', week: 'Dec 9-15, 2024', hours: 38, status: 'approved', submitted: '2024-12-16' },
    { id: 3, employee: 'Mike Chen', week: 'Dec 9-15, 2024', hours: 42, status: 'pending', submitted: '2024-12-16' },
  ]);
  // Use leave requests from context instead of local state
  const leaveRequests = contextLeaveRequests;
  const [performanceReviews, setPerformanceReviews] = useState([
    { id: 1, employee: 'John Doe', status: 'pending', dueDate: '2024-12-31', rating: null },
    { id: 2, employee: 'Sarah Johnson', status: 'completed', dueDate: '2024-12-15', rating: 'Exceeds Expectations' },
  ]);

  // New employee form state
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'employee',
    department: '',
    manager: '',
    salary: '',
    startDate: '',
    phone: '',
    location: ''
  });

  // Filter employees based on search
  const filteredEmployees = teamMembers.filter(employee => {
    const query = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query)
    );
  });

  // Handle employee actions
  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setEmployeeModalOpen(true);
  };

  const handleAddEmployee = () => {
    setAddEmployeeModalOpen(true);
  };

  const handleSubmitNewEmployee = () => {
    const newId = Math.max(...teamMembers.map(emp => emp.id)) + 1;
    const newEmployeeData = {
      id: newId,
      name: newEmployee.name,
      email: newEmployee.email,
      role: newEmployee.role,
      department: newEmployee.department,
      manager: newEmployee.manager,
      salary: newEmployee.salary,
      hireDate: newEmployee.startDate,
      phone: newEmployee.phone,
      location: newEmployee.location,
      performance: 'Good',
      skills: [],
      projects: [],
      certifications: [],
      emergencyContact: { name: '', relationship: '', phone: '' },
      leaveBalance: { vacation: 20, sickLeave: 10, personal: 5, other: 0 }
    };
    setTeamMembers(prev => [...prev, newEmployeeData]);
    setNewEmployee({ name: '', email: '', role: 'employee', department: '', manager: '', salary: '', startDate: '', phone: '', location: '' });
    setAddEmployeeModalOpen(false);
  };

  const handleApproveTimesheet = (timesheetId: number) => {
    setTimesheets(prev => prev.map(ts => 
      ts.id === timesheetId ? { ...ts, status: 'approved' } : ts
    ));
  };

  const handleRejectTimesheet = (timesheetId: number) => {
    setTimesheets(prev => prev.map(ts => 
      ts.id === timesheetId ? { ...ts, status: 'rejected' } : ts
    ));
  };

  const handleApproveLeave = async (leaveId: number) => {
    try {
      setApprovingRequestId(leaveId);
      const managerId = profile?.ID || 1; // Fallback to 1 if profile not available
      await approveLeaveRequest(leaveId, managerId);
    } catch (error) {
      console.error('Error approving leave request:', error);
    } finally {
      setApprovingRequestId(null);
    }
  };

  const handleRejectLeave = async (leaveId: number) => {
    try {
      setRejectingRequestId(leaveId);
      const managerId = profile?.ID || 1; // Fallback to 1 if profile not available
      await rejectLeaveRequest(leaveId, managerId);
    } catch (error) {
      console.error('Error rejecting leave request:', error);
    } finally {
      setRejectingRequestId(null);
    }
  };

  // Handle employee editing
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [editEmployeeModalOpen, setEditEmployeeModalOpen] = useState(false);

  const handleEditEmployee = (employee: any) => {
    setEditingEmployee(employee);
    setEditEmployeeModalOpen(true);
  };

  const handleSaveEmployeeEdit = () => {
    if (editingEmployee) {
      setTeamMembers(prev => prev.map(emp => 
        emp.id === editingEmployee.id ? editingEmployee : emp
      ));
      setEditingEmployee(null);
      setEditEmployeeModalOpen(false);
    }
  };

  // Handle password reset
  const handleResetPassword = (employeeId: number) => {
    console.log(`Password reset requested for employee ${employeeId}`);
    // In a real app, this would trigger a password reset email
    alert(`Password reset email sent to ${teamMembers.find(emp => emp.id === employeeId)?.name}`);
  };

  // Handle document viewing
  const handleViewDocuments = (employeeId: number) => {
    console.log(`Viewing documents for employee ${employeeId}`);
    alert(`Opening document viewer for ${teamMembers.find(emp => emp.id === employeeId)?.name}`);
  };

  // Handle payroll actions
  const handleDownloadPayrollReport = (reportType: string) => {
    console.log(`Downloading ${reportType} report`);
    alert(`${reportType} report downloaded successfully`);
  };

  const handleManageBenefits = (benefitType: string) => {
    console.log(`Managing ${benefitType} benefits`);
    alert(`Opening ${benefitType} benefits management`);
  };

  // Handle performance actions
  const handleEditPerformanceReview = (reviewId: number) => {
    console.log(`Editing performance review ${reviewId}`);
    alert(`Opening performance review editor`);
  };

  const handleAssignTraining = () => {
    console.log('Assigning training');
    alert('Training assignment modal opened');
  };

  const handleTrackCertifications = () => {
    console.log('Tracking certifications');
    alert('Certification tracking opened');
  };

  const handlePerformanceAnalytics = () => {
    console.log('Opening performance analytics');
    alert('Performance analytics dashboard opened');
  };

  // Handle communication
  const [communicationForm, setCommunicationForm] = useState({
    subject: '',
    message: '',
    recipients: 'all'
  });

  const handleSendTeamMessage = () => {
    console.log('Sending team message:', communicationForm);
    alert(`Message sent to ${communicationForm.recipients === 'all' ? 'all team members' : 'specific employees'}`);
    setCommunicationForm({ subject: '', message: '', recipients: 'all' });
    setCommunicationModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600">Comprehensive management tools for your team</p>
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
      
      {/* Loading Indicator */}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800">Processing request...</p>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                <p className="text-2xl font-bold">{teamMembers.length}</p>
                  <p className="text-sm text-gray-600">Direct Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                <p className="text-2xl font-bold">{timesheets.filter(ts => ts.status === 'pending').length}</p>
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
                  <p className="text-2xl font-bold">92%</p>
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
                <p className="text-2xl font-bold">{leaveRequests.filter(lr => lr.status === 'pending').length}</p>
                <p className="text-sm text-gray-600">Leave Requests</p>
              </div>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="records">Employee Records</TabsTrigger>
          <TabsTrigger value="time">Time & Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Clock className="w-5 h-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">Timesheet Submitted</p>
                      <p className="text-sm text-gray-600">John Doe - Dec 9-15, 2024</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Calendar className="w-5 h-5 text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">Leave Request</p>
                      <p className="text-sm text-gray-600">Sarah Johnson - Vacation</p>
                    </div>
                    <Badge variant="default">Approved</Badge>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Award className="w-5 h-5 text-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium">Performance Review</p>
                      <p className="text-sm text-gray-600">Mike Chen - Due Dec 31</p>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
                <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                    onClick={() => setActiveTab('users')}
              >
                    <UserPlus className="w-5 h-5" />
                    <span className="text-xs">Add Employee</span>
              </Button>
              <Button 
                variant="outline" 
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                    onClick={() => setActiveTab('time')}
              >
                    <Clock className="w-5 h-5" />
                    <span className="text-xs">Review Timesheets</span>
              </Button>
              <Button 
                variant="outline" 
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                    onClick={() => setActiveTab('performance')}
              >
                    <Award className="w-5 h-5" />
                    <span className="text-xs">Performance Reviews</span>
              </Button>
              <Button 
                variant="outline" 
                    className="h-16 flex flex-col items-center justify-center space-y-1"
                    onClick={() => setCommunicationModalOpen(true)}
                  >
                    <Megaphone className="w-5 h-5" />
                    <span className="text-xs">Send Message</span>
              </Button>
            </div>
          </CardContent>
        </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>User & Access Management</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Search employees..." 
                  className="w-64" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button onClick={handleAddEmployee}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                      <p className="text-sm text-gray-600">{employee.role} • {employee.department}</p>
                      <p className="text-xs text-gray-500">{employee.email}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewEmployee(employee)}>
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditEmployee(employee)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleResetPassword(employee.id)}>
                        <Lock className="w-4 h-4 mr-1" />
                        Reset Password
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employee Records Tab */}
        <TabsContent value="records" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Employee Records</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                {filteredEmployees.map((employee) => (
                  <div key={employee.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                        <p className="text-sm text-gray-600">{employee.role} • {employee.department}</p>
                </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditEmployee(employee)}>
                          <Edit className="w-4 h-4 mr-1" />
                          Edit Details
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleViewDocuments(employee.id)}>
                          <FileText className="w-4 h-4 mr-1" />
                          View Documents
                        </Button>
                </div>
              </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Email:</span> {employee.email}
                      </div>
                      <div>
                        <span className="font-medium">Phone:</span> {employee.phone || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {employee.location}
                      </div>
                    <div>
                        <span className="font-medium">Start Date:</span> {employee.hireDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Time & Attendance Tab */}
        <TabsContent value="time" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timesheets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>Timesheet Approvals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timesheets.map((timesheet) => (
                    <div key={timesheet.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                        <h4 className="font-medium">{timesheet.employee}</h4>
                        <p className="text-sm text-gray-600">{timesheet.week} • {timesheet.hours} hours</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={timesheet.status === 'approved' ? 'default' : 'secondary'}>
                          {timesheet.status}
                        </Badge>
                        {timesheet.status === 'pending' && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => handleRejectTimesheet(timesheet.id)}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm" onClick={() => handleApproveTimesheet(timesheet.id)}>
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Leave Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Leave Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{request.employeeName}</h4>
                        <p className="text-sm text-gray-600">{request.type} • {request.days} days</p>
                        <p className="text-xs text-gray-500">{request.startDate} - {request.endDate}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                          {request.status}
                        </Badge>
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleRejectLeave(request.id)}
                              disabled={loading || rejectingRequestId === request.id || approvingRequestId === request.id}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveLeave(request.id)}
                              disabled={loading || approvingRequestId === request.id || rejectingRequestId === request.id}
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
            </div>
          </CardContent>
        </Card>
          </div>
        </TabsContent>

        {/* Payroll Tab */}
        <TabsContent value="payroll" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Payroll & Compensation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Salary Information</h4>
              <div className="space-y-3">
                    {filteredEmployees.map((employee) => (
                      <div key={employee.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{employee.name}</span>
                          <span className="text-sm text-gray-600">{employee.salary}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Payroll Reports</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadPayrollReport('Team Payroll Summary')}>
                    <Download className="w-4 h-4 mr-2" />
                      Team Payroll Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadPayrollReport('Overtime Report')}>
                    <Download className="w-4 h-4 mr-2" />
                      Overtime Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => handleDownloadPayrollReport('Benefits Summary')}>
                    <Download className="w-4 h-4 mr-2" />
                      Benefits Summary
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Benefits Management</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleManageBenefits('Health Benefits')}>
                      <Shield className="w-4 h-4 mr-2" />
                      Health Benefits
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleManageBenefits('Training Budget')}>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Training Budget
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => handleManageBenefits('Bonuses & Incentives')}>
                      <Award className="w-4 h-4 mr-2" />
                      Bonuses & Incentives
                  </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Performance & Evaluation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Performance Reviews</h4>
              <div className="space-y-3">
                    {performanceReviews.map((review) => (
                      <div key={review.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{review.employee}</h4>
                          <p className="text-sm text-gray-600">Due: {review.dueDate}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={review.status === 'completed' ? 'default' : 'secondary'}>
                            {review.status}
                          </Badge>
                          {review.rating && (
                            <Badge variant="outline">{review.rating}</Badge>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleEditPerformanceReview(review.id)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Training & Certifications</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={handleAssignTraining}>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Assign Training
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handleTrackCertifications}>
                      <Award className="w-4 h-4 mr-2" />
                      Track Certifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={handlePerformanceAnalytics}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Performance Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Employee Modal */}
      <Dialog open={addEmployeeModalOpen} onOpenChange={setAddEmployeeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Add New Employee</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={newEmployee.role} onValueChange={(value) => setNewEmployee(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="it">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, department: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="manager">Manager</Label>
              <Input 
                id="manager"
                value={newEmployee.manager}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, manager: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="salary">Salary</Label>
              <Input 
                id="salary"
                value={newEmployee.salary}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, salary: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate"
                type="date"
                value={newEmployee.startDate}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input 
                id="phone"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, phone: e.target.value }))}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location"
                value={newEmployee.location}
                onChange={(e) => setNewEmployee(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setAddEmployeeModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitNewEmployee} disabled={!newEmployee.name || !newEmployee.email}>
              Add Employee
                  </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={editEmployeeModalOpen} onOpenChange={setEditEmployeeModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="w-5 h-5" />
              <span>Edit Employee Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {editingEmployee && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editName">Full Name</Label>
                <Input 
                  id="editName"
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editEmail">Email</Label>
                <Input 
                  id="editEmail"
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editRole">Role</Label>
                <Select value={editingEmployee.role} onValueChange={(value) => setEditingEmployee(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="hr">HR</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editDepartment">Department</Label>
                <Input 
                  id="editDepartment"
                  value={editingEmployee.department}
                  onChange={(e) => setEditingEmployee(prev => ({ ...prev, department: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editManager">Manager</Label>
                <Input 
                  id="editManager"
                  value={editingEmployee.manager}
                  onChange={(e) => setEditingEmployee(prev => ({ ...prev, manager: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editSalary">Salary</Label>
                <Input 
                  id="editSalary"
                  value={editingEmployee.salary}
                  onChange={(e) => setEditingEmployee(prev => ({ ...prev, salary: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editHireDate">Start Date</Label>
                <Input 
                  id="editHireDate"
                  type="date"
                  value={editingEmployee.hireDate}
                  onChange={(e) => setEditingEmployee(prev => ({ ...prev, hireDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="editPhone">Phone</Label>
                <Input 
                  id="editPhone"
                  value={editingEmployee.phone}
                  onChange={(e) => setEditingEmployee(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="editLocation">Location</Label>
                <Input 
                  id="editLocation"
                  value={editingEmployee.location}
                  onChange={(e) => setEditingEmployee(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setEditEmployeeModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmployeeEdit} disabled={!editingEmployee}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Employee Detail Modal */}
      <Dialog open={employeeModalOpen} onOpenChange={setEmployeeModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserCircle className="w-5 h-5" />
              <span>Employee Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedEmployee.name}</div>
                    <div><span className="font-medium">Email:</span> {selectedEmployee.email}</div>
                    <div><span className="font-medium">Phone:</span> {selectedEmployee.phone || 'N/A'}</div>
                    <div><span className="font-medium">Location:</span> {selectedEmployee.location}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Employment Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Role:</span> {selectedEmployee.role}</div>
                    <div><span className="font-medium">Department:</span> {selectedEmployee.department}</div>
                    <div><span className="font-medium">Manager:</span> {selectedEmployee.manager}</div>
                    <div><span className="font-medium">Start Date:</span> {selectedEmployee.hireDate}</div>
                    <div><span className="font-medium">Salary:</span> {selectedEmployee.salary}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Communication Modal */}
      <Dialog open={communicationModalOpen} onOpenChange={setCommunicationModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Send Team Message</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Enter message subject" value={communicationForm.subject} onChange={(e) => setCommunicationForm(prev => ({ ...prev, subject: e.target.value }))} />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                rows={4}
                placeholder="Enter your message..."
                value={communicationForm.message}
                onChange={(e) => setCommunicationForm(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="recipients">Recipients</Label>
              <Select value={communicationForm.recipients} onValueChange={(value) => setCommunicationForm(prev => ({ ...prev, recipients: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Team Members</SelectItem>
                  <SelectItem value="specific">Specific Employees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setCommunicationModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendTeamMessage}>
                Send Message
              </Button>
            </div>
      </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManagerTools;
