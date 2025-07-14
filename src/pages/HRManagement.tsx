import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { employees } from '@/data/employees';
import { SearchableDropdown } from '@/components/SearchableDropdown';
import { useLeaveRequests } from '@/contexts/LeaveRequestContext';
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
  Shield,
  Mail,
  Phone,
  MapPin,
  User,
  Building,
  CalendarDays,
  Star,
  Eye,
  AlertTriangle,
  Headphones
} from 'lucide-react';
import { safetyReports } from '../data/safetyReports';

const HRManagement = () => {
  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useLeaveRequests();
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<any>(null);
  const [leaveRequestDetailModalOpen, setLeaveRequestDetailModalOpen] = useState(false);
  const [hrDocuments, setHrDocuments] = useState([
    { id: 1, title: 'Employee Handbook', type: 'Policy', lastUpdated: '2024-01-15', version: '2.1', category: 'Policies' },
    { id: 2, title: 'Leave Request Form', type: 'Form', lastUpdated: '2024-01-10', version: '1.3', category: 'Forms' },
    { id: 3, title: 'Code of Conduct', type: 'Policy', lastUpdated: '2024-01-08', version: '3.0', category: 'Policies' },
    { id: 4, title: 'Expense Reimbursement Form', type: 'Form', lastUpdated: '2024-01-05', version: '1.2', category: 'Forms' },
    { id: 5, title: 'Onboarding Checklist', type: 'Checklist', lastUpdated: '2024-01-02', version: '1.0', category: 'Onboarding' },
    { id: 6, title: 'Remote Work Policy', type: 'Policy', lastUpdated: '2023-12-20', version: '1.1', category: 'Policies' },
    { id: 7, title: 'Performance Review Template', type: 'Template', lastUpdated: '2023-12-15', version: '2.0', category: 'Templates' },
    { id: 8, title: 'Employee Guide', type: 'Guide', lastUpdated: '2023-12-10', version: '1.0', category: 'Guides' },
  ]);
  const [hrAnnouncements, setHrAnnouncements] = useState([
    { id: 1, title: 'Holiday Schedule Updated', content: 'Please review the updated holiday schedule for 2024', priority: 'info', date: '2024-01-15' },
    { id: 2, title: 'New Benefits Enrollment', content: 'Open enrollment period starts February 1st', priority: 'urgent', date: '2024-01-14' },
    { id: 3, title: 'Team Building Event', content: 'Join us for the quarterly team building event', priority: 'reminder', date: '2024-01-12' },
  ]);
  const [newDocumentModalOpen, setNewDocumentModalOpen] = useState(false);
  const [newAnnouncementModalOpen, setNewAnnouncementModalOpen] = useState(false);
  const [newDocument, setNewDocument] = useState({
    title: '',
    type: 'Policy',
    category: 'Policies',
    version: '1.0'
  });
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    content: '',
    priority: 'info'
  });
  const [performanceReviews, setPerformanceReviews] = useState([
    { id: 1, employee: 'John Doe', status: 'pending', dueDate: '2024-02-15', manager: 'Jane Smith', rating: null },
    { id: 2, employee: 'Sarah Johnson', status: 'completed', dueDate: '2024-02-10', manager: 'David Wilson', rating: 'Exceeds Expectations' },
    { id: 3, employee: 'Mike Chen', status: 'in-progress', dueDate: '2024-02-20', manager: 'Lisa Chen', rating: null },
  ]);
  const [employeeGoals, setEmployeeGoals] = useState([
    { id: 1, employee: 'John Doe', goal: 'Complete AWS certification', status: 'in-progress', progress: 75, dueDate: '2024-03-15' },
    { id: 2, employee: 'Sarah Johnson', goal: 'Increase team productivity by 20%', status: 'on-track', progress: 60, dueDate: '2024-06-30' },
    { id: 3, employee: 'Mike Chen', goal: 'Redesign company website', status: 'completed', progress: 100, dueDate: '2024-01-31' },
  ]);
  const [feedbackEntries, setFeedbackEntries] = useState([
    { id: 1, from: 'Jane Smith', to: 'John Doe', type: 'positive', content: 'Excellent work on the recent project', date: '2024-01-15' },
    { id: 2, from: 'David Wilson', to: 'Sarah Johnson', type: 'constructive', content: 'Great leadership shown in team meetings', date: '2024-01-14' },
  ]);
  const [reports, setReports] = useState(safetyReports);
  const [viewReport, setViewReport] = React.useState(null);

  const pendingLeaveCount = leaveRequests.filter(request => request.status === 'pending').length;
  
  const employeeStats = [
    { title: 'Total Employees', value: '247', icon: Users, color: 'bg-blue-500' },
    { title: 'Pending Leave', value: pendingLeaveCount.toString(), icon: Clock, color: 'bg-yellow-500' },
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

  const handleViewProfile = (employee: any) => {
    setSelectedEmployee(employee);
    setProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setProfileModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleContact = (employee: any) => {
    setSelectedEmployee(employee);
    setContactModalOpen(true);
  };

  const closeContactModal = () => {
    setContactModalOpen(false);
    setSelectedEmployee(null);
  };

  // Filter employees based on search query
  const filteredEmployees = employees.filter(employee => {
    const query = searchQuery.toLowerCase();
    return (
      employee.name.toLowerCase().includes(query) ||
      employee.role.toLowerCase().includes(query) ||
      employee.department.toLowerCase().includes(query) ||
      employee.email.toLowerCase().includes(query) ||
      employee.location.toLowerCase().includes(query)
    );
  });

  // Leave management functions
  const handleApproveLeave = (requestId: number) => {
    approveLeaveRequest(requestId);
  };

  const handleRejectLeave = (requestId: number) => {
    rejectLeaveRequest(requestId);
  };

  const handleViewLeaveRequest = (request: any) => {
    setSelectedLeaveRequest(request);
    setLeaveRequestDetailModalOpen(true);
  };

  const closeLeaveRequestDetailModal = () => {
    setLeaveRequestDetailModalOpen(false);
    setSelectedLeaveRequest(null);
  };

  // HR Documents functions
  const handleUploadDocument = () => {
    setNewDocumentModalOpen(true);
  };

  const handleSubmitNewDocument = () => {
    const newId = Math.max(...hrDocuments.map(d => d.id)) + 1;
    const newDoc = {
      id: newId,
      title: newDocument.title,
      type: newDocument.type,
      category: newDocument.category,
      version: newDocument.version,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setHrDocuments(prev => [...prev, newDoc]);
    setNewDocument({ title: '', type: 'Policy', category: 'Policies', version: '1.0' });
    setNewDocumentModalOpen(false);
  };

  const closeNewDocumentModal = () => {
    setNewDocumentModalOpen(false);
    setNewDocument({ title: '', type: 'Policy', category: 'Policies', version: '1.0' });
  };

  const handleDownloadDocument = (document: any) => {
    // Simulate download
    alert(`Downloading ${document.title}...`);
  };

  const handleViewDocument = (document: any) => {
    alert(`Opening ${document.title}...`);
  };

  // HR Announcements functions
  const handleNewAnnouncement = () => {
    setNewAnnouncementModalOpen(true);
  };

  const handleSubmitNewAnnouncement = () => {
    const newId = Math.max(...hrAnnouncements.map(a => a.id)) + 1;
    const newAnnouncementData = {
      id: newId,
      title: newAnnouncement.title,
      content: newAnnouncement.content,
      priority: newAnnouncement.priority,
      date: new Date().toISOString().split('T')[0]
    };
    setHrAnnouncements(prev => [newAnnouncementData, ...prev]);
    setNewAnnouncement({ title: '', content: '', priority: 'info' });
    setNewAnnouncementModalOpen(false);
  };

  const closeNewAnnouncementModal = () => {
    setNewAnnouncementModalOpen(false);
    setNewAnnouncement({ title: '', content: '', priority: 'info' });
  };

  // Performance functions
  const [performanceModalOpen, setPerformanceModalOpen] = useState(false);
  const [goalsModalOpen, setGoalsModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedPerformanceData, setSelectedPerformanceData] = useState<any>(null);
  const [newFeedbackModalOpen, setNewFeedbackModalOpen] = useState(false);
  const [newReviewModalOpen, setNewReviewModalOpen] = useState(false);
  const [newGoalModalOpen, setNewGoalModalOpen] = useState(false);
  const [newFeedback, setNewFeedback] = useState({
    from: '',
    to: '',
    type: 'positive',
    content: ''
  });
  const [newReview, setNewReview] = useState({
    employee: '',
    manager: '',
    dueDate: ''
  });
  const [newGoal, setNewGoal] = useState({
    employee: '',
    goal: '',
    dueDate: '',
    progress: 0
  });

  const handleViewReviews = () => {
    setSelectedPerformanceData({ type: 'reviews', data: performanceReviews });
    setPerformanceModalOpen(true);
  };

  const handleManageGoals = () => {
    setSelectedPerformanceData({ type: 'goals', data: employeeGoals });
    setGoalsModalOpen(true);
  };

  const handleGiveFeedback = () => {
    setSelectedPerformanceData({ type: 'feedback', data: feedbackEntries });
    setFeedbackModalOpen(true);
  };

  const closePerformanceModal = () => {
    setPerformanceModalOpen(false);
    setSelectedPerformanceData(null);
  };

  const closeGoalsModal = () => {
    setGoalsModalOpen(false);
    setSelectedPerformanceData(null);
  };

  const closeFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setSelectedPerformanceData(null);
  };

  // New feedback functions
  const handleGiveNewFeedback = () => {
    setNewFeedbackModalOpen(true);
  };

  const handleSubmitNewFeedback = () => {
    const newId = Math.max(...feedbackEntries.map(f => f.id)) + 1;
    const newFeedbackEntry = {
      id: newId,
      from: newFeedback.from,
      to: newFeedback.to,
      type: newFeedback.type,
      content: newFeedback.content,
      date: new Date().toISOString().split('T')[0]
    };
    setFeedbackEntries(prev => [newFeedbackEntry, ...prev]);
    setNewFeedback({ from: '', to: '', type: 'positive', content: '' });
    setNewFeedbackModalOpen(false);
  };

  const closeNewFeedbackModal = () => {
    setNewFeedbackModalOpen(false);
    setNewFeedback({ from: '', to: '', type: 'positive', content: '' });
  };

  // New review functions
  const handleScheduleNewReview = () => {
    setNewReviewModalOpen(true);
  };

  const handleSubmitNewReview = () => {
    const newId = Math.max(...performanceReviews.map(r => r.id)) + 1;
    const newReviewEntry = {
      id: newId,
      employee: newReview.employee,
      manager: newReview.manager,
      status: 'pending',
      dueDate: newReview.dueDate,
      rating: null
    };
    setPerformanceReviews(prev => [...prev, newReviewEntry]);
    setNewReview({ employee: '', manager: '', dueDate: '' });
    setNewReviewModalOpen(false);
  };

  const closeNewReviewModal = () => {
    setNewReviewModalOpen(false);
    setNewReview({ employee: '', manager: '', dueDate: '' });
  };

  // New goal functions
  const handleAddNewGoal = () => {
    setNewGoalModalOpen(true);
  };

  const handleSubmitNewGoal = () => {
    const newId = Math.max(...employeeGoals.map(g => g.id)) + 1;
    const newGoalEntry = {
      id: newId,
      employee: newGoal.employee,
      goal: newGoal.goal,
      status: 'in-progress',
      progress: newGoal.progress,
      dueDate: newGoal.dueDate
    };
    setEmployeeGoals(prev => [...prev, newGoalEntry]);
    setNewGoal({ employee: '', goal: '', dueDate: '', progress: 0 });
    setNewGoalModalOpen(false);
  };

  const closeNewGoalModal = () => {
    setNewGoalModalOpen(false);
    setNewGoal({ employee: '', goal: '', dueDate: '', progress: 0 });
  };

  // Helper function to convert employees to dropdown options
  const employeeOptions = employees.map(employee => ({
    value: employee.name,
    label: `${employee.name} - ${employee.role} (${employee.department})`
  }));



  // Helper to group documents by category
  const documentsByCategory = hrDocuments.reduce((acc, doc) => {
    acc[doc.category] = acc[doc.category] || [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof hrDocuments>);

  // Function to calculate remaining leave balance for an employee
  const calculateRemainingLeaveBalance = (employeeId: string, leaveType: string) => {
    const employee = employees.find(emp => emp.id.toString() === employeeId.replace('emp', ''));
    if (!employee) return 0;

    const approvedRequests = leaveRequests.filter(
      request => request.employeeId === employeeId && 
      request.status === 'approved' && 
      request.type.toLowerCase().includes(leaveType.toLowerCase())
    );

    const usedDays = approvedRequests.reduce((total, request) => total + request.days, 0);
    
    let initialBalance = 0;
    switch (leaveType.toLowerCase()) {
      case 'vacation':
        initialBalance = employee.leaveBalance.vacation;
        break;
      case 'sick':
        initialBalance = employee.leaveBalance.sickLeave;
        break;
      case 'personal':
        initialBalance = employee.leaveBalance.personal;
        break;
      case 'other':
        initialBalance = employee.leaveBalance.other;
        break;
      default:
        return 0;
    }

    return Math.max(0, initialBalance - usedDays);
  };

  // Function to get employee by ID
  const getEmployeeById = (employeeId: string) => {
    return employees.find(emp => emp.id.toString() === employeeId.replace('emp', ''));
  };

  const handleDownloadReport = (report: any) => {
    alert(`Downloading ${report.file}...`);
  };

  const handleResolveReport = (id) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
    setViewReport(null);
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
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="directory">Employee Directory</TabsTrigger>
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="documents">HR Documents</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="manager">Manager Tools</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Employee Directory</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Search employees..." 
                  className="w-64" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="outline">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{employee.name}</h4>
                        <p className="text-sm text-gray-600">{employee.role} • {employee.department}</p>
                        <p className="text-xs text-gray-500">{employee.email} • {employee.location}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewProfile(employee)}>View Profile</Button>
                        <Button size="sm" variant="outline" onClick={() => handleContact(employee)}>Contact</Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
                    <p className="text-gray-500">
                      {searchQuery ? `No employees match "${searchQuery}"` : 'No employees available'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <div className="space-y-6">
            {/* Leave Management Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pending Requests</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {leaveRequests.filter(r => r.status === 'pending').length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Approved This Month</p>
                      <p className="text-2xl font-bold text-green-600">
                        {leaveRequests.filter(r => r.status === 'approved' && 
                          new Date(r.submittedAt).getMonth() === new Date().getMonth()).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Low Balance Alerts</p>
                      <p className="text-2xl font-bold text-red-600">
                        {leaveRequests.filter(r => {
                          const balance = calculateRemainingLeaveBalance(r.employeeId, r.type.toLowerCase());
                          return r.status === 'pending' && (balance - r.days) < 0;
                        }).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Requests</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {leaveRequests.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Leave Requests List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Leave Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((request) => {
                  const employee = getEmployeeById(request.employeeId);
                  const remainingBalance = calculateRemainingLeaveBalance(request.employeeId, request.type.toLowerCase());
                  const willExceed = request.status === 'pending' && (remainingBalance - request.days) < 0;
                  
                  return (
                    <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{request.employeeName}</h4>
                            <p className="text-sm text-gray-600">{request.type} • {request.days} days</p>
                            <p className="text-xs text-gray-500">{request.startDate} - {request.endDate}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {request.type} balance: {remainingBalance} days remaining
                              </span>
                              {willExceed && (
                                <Badge variant="destructive" className="text-xs">
                                  Would exceed balance
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                          {request.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewLeaveRequest(request)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleRejectLeave(request.id)}>Reject</Button>
                            <Button size="sm" onClick={() => handleApproveLeave(request.id)}>Approve</Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>HR Policies & Documents</span>
              </CardTitle>
              <Button onClick={handleUploadDocument}>Upload Document</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {Object.keys(documentsByCategory).map((category) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-2 text-blue-700">{category}</h3>
                    <div className="space-y-4">
                      {documentsByCategory[category].map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                            <p className="text-sm text-gray-600">Type: {doc.type} • Version: {doc.version}</p>
                            <p className="text-xs text-gray-500">Last updated: {doc.lastUpdated}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleDownloadDocument(doc)}>
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleViewDocument(doc)}>View</Button>
                          </div>
                        </div>
                      ))}
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
              <Button onClick={handleNewAnnouncement}>New Announcement</Button>
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
                  <Button size="sm" className="w-full" onClick={handleViewReviews}>View Reviews</Button>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <GraduationCap className="w-8 h-8 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">Goal Tracking</h3>
                      <p className="text-sm text-gray-600">Monitor individual & team goals</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" onClick={handleManageGoals}>Manage Goals</Button>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <MessageSquare className="w-8 h-8 text-green-500" />
                    <div>
                      <h3 className="font-semibold">Feedback</h3>
                      <p className="text-sm text-gray-600">Peer & manager feedback</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full" onClick={handleGiveFeedback}>Give Feedback</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manager">
          <div className="space-y-6">
            {/* Manager Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">15</p>
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
                      <p className="text-2xl font-bold">8</p>
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
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-sm text-gray-600">Active Issues</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Manager Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Manager Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => window.location.href = '/helpdesk'}
                  >
                    <Headphones className="w-6 h-6" />
                    <span>IT Helpdesk</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => window.location.href = '/training'}
                  >
                    <GraduationCap className="w-6 h-6" />
                    <span>Training Management</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => window.location.href = '/calendar'}
                  >
                    <Calendar className="w-6 h-6" />
                    <span>Calendar Management</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => window.location.href = '/documents'}
                  >
                    <FileText className="w-6 h-6" />
                    <span>Document Center</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => window.location.href = '/safety'}
                  >
                    <Shield className="w-6 h-6" />
                    <span>Safety & Compliance</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <MessageSquare className="w-6 h-6" />
                    <span>Team Communication</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Team Performance Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-green-600">94%</p>
                      <p className="text-sm text-gray-600">On-time Delivery</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">4.3/5</p>
                      <p className="text-sm text-gray-600">Team Satisfaction</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">88%</p>
                      <p className="text-sm text-gray-600">Goal Achievement</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Recent Team Activities</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Team Meeting - Q1 Planning</p>
                          <p className="text-sm text-gray-600">Scheduled for tomorrow at 10 AM</p>
                        </div>
                        <Badge variant="default">Scheduled</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <p className="font-medium">Performance Reviews Due</p>
                          <p className="text-sm text-gray-600">5 reviews pending completion</p>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Manager Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Manager Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">HR Reports</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Team Leave Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Performance Summary
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Training Completion
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold">IT Reports</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        System Access Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Equipment Inventory
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Security Compliance
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>Employee Feedback</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {feedbackEntries.length === 0 ? (
                  <div className="text-gray-500">No feedback entries yet.</div>
                ) : (
                  feedbackEntries.map(entry => (
                    <div key={entry.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md transition-shadow">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`text-xs font-semibold ${entry.type === 'positive' ? 'text-green-600' : 'text-yellow-600'}`}>{entry.type === 'positive' ? 'Positive' : 'Constructive'}</span>
                          <span className="text-xs text-gray-400">{entry.date}</span>
                        </div>
                        <div className="font-medium text-gray-900">{entry.content}</div>
                        <div className="text-xs text-gray-500 mt-1">From: {entry.from} &rarr; To: {entry.to}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Reports</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Category</th>
                      <th className="px-4 py-2 text-left">Description</th>
                      <th className="px-4 py-2 text-left">Employee</th>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.filter(r => r.type !== 'Special').length === 0 ? (
                      <tr><td colSpan={6} className="text-gray-500 px-4 py-4 text-center">No reports available.</td></tr>
                    ) : (
                      reports.filter(r => r.type !== 'Special').map(report => (
                        <tr key={report.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-2">{report.category}</td>
                          <td className="px-4 py-2">{report.description}</td>
                          <td className="px-4 py-2">{report.employee}</td>
                          <td className="px-4 py-2">{report.date}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${report.status === 'Submitted' ? 'bg-yellow-100 text-yellow-700' : report.status === 'In Review' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{report.status}</span>
                          </td>
                          <td className="px-4 py-2">
                            <Button size="sm" variant="outline" onClick={() => setViewReport(report)}>View</Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Special Reports Section */}
              <div className="mt-10">
                <h3 className="font-semibold text-lg mb-2">Special Reports (Non-Male Form)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Category</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-left">Employee</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reports.filter(r => r.type === 'Special').length === 0 ? (
                        <tr><td colSpan={6} className="text-gray-500 px-4 py-4 text-center">No special reports available.</td></tr>
                      ) : (
                        reports.filter(r => r.type === 'Special').map(report => (
                          <tr key={report.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{report.category}</td>
                            <td className="px-4 py-2">{report.description}</td>
                            <td className="px-4 py-2">{report.employee}</td>
                            <td className="px-4 py-2">{report.date}</td>
                            <td className="px-4 py-2">
                              <span className={`px-2 py-1 rounded text-xs font-semibold ${report.status === 'Submitted' ? 'bg-yellow-100 text-yellow-700' : report.status === 'In Review' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{report.status}</span>
                            </td>
                            <td className="px-4 py-2">
                              <Button size="sm" variant="outline" onClick={() => setViewReport(report)}>View</Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Report View Dialog */}
          <Dialog open={!!viewReport} onOpenChange={open => !open && setViewReport(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Details</DialogTitle>
              </DialogHeader>
              {viewReport && (
                <div className="space-y-2">
                  <p><strong>Category:</strong> {viewReport.category}</p>
                  <p><strong>Description:</strong> {viewReport.description}</p>
                  <p><strong>Employee:</strong> {viewReport.employee}</p>
                  <p><strong>Date:</strong> {viewReport.date}</p>
                  <div><strong>Status:</strong> {viewReport.status}</div>
                  <p><strong>Details:</strong> {viewReport.details || 'N/A'}</p>
                  <p><strong>Anonymous:</strong> {viewReport.anonymous ? 'Yes' : 'No'}</p>
                  {viewReport.status !== 'Resolved' && (
                    <div className="flex justify-end pt-4">
                      <Button onClick={() => handleResolveReport(viewReport.id)}>
                        Mark as Resolved
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>

      {/* Employee Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Employee Profile</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedEmployee.name}</h2>
                  <p className="text-lg text-gray-600">{selectedEmployee.role}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.department} Department</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className="mb-2">{selectedEmployee.performance}</Badge>
                  <p className="text-sm text-gray-500">Employee ID: {selectedEmployee.id}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEmployee.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEmployee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEmployee.location}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Employment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Hired: {selectedEmployee.hireDate}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Building className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Manager: {selectedEmployee.manager}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Salary: {selectedEmployee.salary}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Skills and Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmployee.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Current Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedEmployee.projects.map((project: string, index: number) => (
                        <div key={index} className="text-sm text-gray-600">• {project}</div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Certifications and Emergency Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedEmployee.certifications.map((cert: string, index: number) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEmployee.emergencyContact.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{selectedEmployee.emergencyContact.relationship}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{selectedEmployee.emergencyContact.phone}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closeProfileModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>Contact Employee</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h3>
                <p className="text-sm text-gray-600">{selectedEmployee.role}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Mail className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Phone className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-gray-600">{selectedEmployee.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Button className="w-full" onClick={() => window.open(`mailto:${selectedEmployee.email}`, '_blank')}>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.open(`tel:${selectedEmployee.phone}`, '_blank')}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call Employee
                </Button>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closeContactModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Leave Request Detail Modal */}
      <Dialog open={leaveRequestDetailModalOpen} onOpenChange={setLeaveRequestDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Leave Request Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedLeaveRequest && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedLeaveRequest.employeeName}</h2>
                  <p className="text-lg text-gray-600">{selectedLeaveRequest.type}</p>
                  <Badge variant={selectedLeaveRequest.status === 'approved' ? 'default' : selectedLeaveRequest.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {selectedLeaveRequest.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Request ID: {selectedLeaveRequest.id}</p>
                  <p className="text-sm text-gray-500">Submitted: {new Date(selectedLeaveRequest.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Request Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Type: {selectedLeaveRequest.type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CalendarDays className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Duration: {selectedLeaveRequest.days} days</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Status: {selectedLeaveRequest.status}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Date Range</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Start Date: {selectedLeaveRequest.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="text-sm">End Date: {selectedLeaveRequest.endDate}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Total Days: {selectedLeaveRequest.days}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Leave Balance Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employee Leave Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {calculateRemainingLeaveBalance(selectedLeaveRequest.employeeId, 'vacation')}
                      </div>
                      <div className="text-sm text-blue-600 font-medium">Vacation Days</div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {calculateRemainingLeaveBalance(selectedLeaveRequest.employeeId, 'sick')}
                      </div>
                      <div className="text-sm text-red-600 font-medium">Sick Leave</div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {calculateRemainingLeaveBalance(selectedLeaveRequest.employeeId, 'personal')}
                      </div>
                      <div className="text-sm text-green-600 font-medium">Personal Days</div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {calculateRemainingLeaveBalance(selectedLeaveRequest.employeeId, 'other')}
                      </div>
                      <div className="text-sm text-purple-600 font-medium">Other Leave</div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                  </div>
                  
                  {/* Request Impact */}
                  {selectedLeaveRequest.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Request Impact</span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">
                        If approved, this request will use {selectedLeaveRequest.days} {selectedLeaveRequest.type.toLowerCase()} days.
                        {(() => {
                          const remaining = calculateRemainingLeaveBalance(selectedLeaveRequest.employeeId, selectedLeaveRequest.type.toLowerCase());
                          const afterApproval = remaining - selectedLeaveRequest.days;
                          return afterApproval >= 0 
                            ? ` After approval, ${selectedLeaveRequest.employeeName} will have ${afterApproval} days remaining.`
                            : ` Warning: This would exceed the available balance by ${Math.abs(afterApproval)} days.`;
                        })()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reason */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reason for Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedLeaveRequest.reason || "No reason provided"}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons for Pending Requests */}
              {selectedLeaveRequest.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => handleRejectLeave(selectedLeaveRequest.id)}>
                    Reject Request
                  </Button>
                  <Button onClick={() => handleApproveLeave(selectedLeaveRequest.id)}>
                    Approve Request
                  </Button>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closeLeaveRequestDetailModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Document Modal */}
      <Dialog open={newDocumentModalOpen} onOpenChange={setNewDocumentModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Upload New Document</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Document Title</label>
              <Input 
                placeholder="Enter document title"
                value={newDocument.title}
                onChange={(e) => setNewDocument(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Document Type</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={newDocument.type}
                onChange={(e) => setNewDocument(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="Policy">Policy</option>
                <option value="Form">Form</option>
                <option value="Template">Template</option>
                <option value="Guide">Guide</option>
                <option value="Checklist">Checklist</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={newDocument.category}
                onChange={(e) => setNewDocument(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="Policies">Policies</option>
                <option value="Forms">Forms</option>
                <option value="Templates">Templates</option>
                <option value="Guides">Guides</option>
                <option value="Onboarding">Onboarding</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Version</label>
              <Input 
                placeholder="1.0"
                value={newDocument.version}
                onChange={(e) => setNewDocument(prev => ({ ...prev, version: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={closeNewDocumentModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewDocument} disabled={!newDocument.title}>
                Upload Document
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Announcement Modal */}
      <Dialog open={newAnnouncementModalOpen} onOpenChange={setNewAnnouncementModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>New Announcement</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input 
                placeholder="Enter announcement title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea 
                className="w-full mt-1 p-2 border rounded-md"
                rows={4}
                placeholder="Enter announcement content..."
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Priority</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={newAnnouncement.priority}
                onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
              >
                <option value="info">Info</option>
                <option value="urgent">Urgent</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={closeNewAnnouncementModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewAnnouncement} disabled={!newAnnouncement.title || !newAnnouncement.content}>
                Post Announcement
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Performance Reviews Modal */}
      <Dialog open={performanceModalOpen} onOpenChange={setPerformanceModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Performance Reviews</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPerformanceData && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Review Status</h3>
                <Button onClick={handleScheduleNewReview}>Schedule Review</Button>
              </div>
              
              <div className="space-y-3">
                {selectedPerformanceData.data.map((review: any) => (
                  <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{review.employee}</h4>
                      <p className="text-sm text-gray-600">Manager: {review.manager}</p>
                      <p className="text-xs text-gray-500">Due: {review.dueDate}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant={
                        review.status === 'completed' ? 'default' : 
                        review.status === 'in-progress' ? 'secondary' : 'outline'
                      }>
                        {review.status}
                      </Badge>
                      {review.rating && (
                        <Badge variant="outline">{review.rating}</Badge>
                      )}
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closePerformanceModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Goals Management Modal */}
      <Dialog open={goalsModalOpen} onOpenChange={setGoalsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span>Goal Management</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPerformanceData && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Employee Goals</h3>
                <Button onClick={handleAddNewGoal}>Add Goal</Button>
              </div>
              
              <div className="space-y-3">
                {selectedPerformanceData.data.map((goal: any) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{goal.employee}</h4>
                      <Badge variant={
                        goal.status === 'completed' ? 'default' : 
                        goal.status === 'on-track' ? 'secondary' : 'outline'
                      }>
                        {goal.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{goal.goal}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Due: {goal.dueDate}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closeGoalsModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Feedback Modal */}
      <Dialog open={newFeedbackModalOpen} onOpenChange={setNewFeedbackModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <span>New Feedback Entry</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">From</label>
              <SearchableDropdown
                options={employeeOptions}
                placeholder="Select employee"
                value={newFeedback.from}
                onValueChange={(value) => setNewFeedback(prev => ({ ...prev, from: value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">To</label>
              <SearchableDropdown
                options={employeeOptions}
                placeholder="Select employee"
                value={newFeedback.to}
                onValueChange={(value) => setNewFeedback(prev => ({ ...prev, to: value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Type</label>
              <select 
                className="w-full mt-1 p-2 border rounded-md"
                value={newFeedback.type}
                onChange={(e) => setNewFeedback(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="positive">Positive</option>
                <option value="constructive">Constructive</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Content</label>
              <textarea 
                className="w-full mt-1 p-2 border rounded-md"
                rows={4}
                placeholder="Enter feedback content..."
                value={newFeedback.content}
                onChange={(e) => setNewFeedback(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={closeNewFeedbackModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewFeedback} disabled={!newFeedback.from || !newFeedback.to || !newFeedback.content}>
                Submit Feedback
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Review Modal */}
      <Dialog open={newReviewModalOpen} onOpenChange={setNewReviewModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Schedule New Performance Review</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Employee</label>
              <SearchableDropdown
                options={employeeOptions}
                placeholder="Select employee"
                value={newReview.employee}
                onValueChange={(value) => setNewReview(prev => ({ ...prev, employee: value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Manager</label>
              <SearchableDropdown
                options={employeeOptions}
                placeholder="Select manager"
                value={newReview.manager}
                onValueChange={(value) => setNewReview(prev => ({ ...prev, manager: value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input 
                type="date"
                value={newReview.dueDate}
                onChange={(e) => setNewReview(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={closeNewReviewModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewReview} disabled={!newReview.employee || !newReview.manager || !newReview.dueDate}>
                Schedule Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Goal Modal */}
      <Dialog open={newGoalModalOpen} onOpenChange={setNewGoalModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span>Add New Employee Goal</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Employee</label>
              <SearchableDropdown
                options={employeeOptions}
                placeholder="Select employee"
                value={newGoal.employee}
                onValueChange={(value) => setNewGoal(prev => ({ ...prev, employee: value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Goal</label>
              <Input 
                placeholder="e.g., Increase sales by 10% in Q2"
                value={newGoal.goal}
                onChange={(e) => setNewGoal(prev => ({ ...prev, goal: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Due Date</label>
              <Input 
                type="date"
                value={newGoal.dueDate}
                onChange={(e) => setNewGoal(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Progress</label>
              <Input 
                type="number"
                min="0"
                max="100"
                value={newGoal.progress}
                onChange={(e) => setNewGoal(prev => ({ ...prev, progress: parseInt(e.target.value, 10) }))}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={closeNewGoalModal}>
                Cancel
              </Button>
              <Button onClick={handleSubmitNewGoal} disabled={!newGoal.employee || !newGoal.goal || !newGoal.dueDate || newGoal.progress === 0}>
                Add Goal
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HRManagement;