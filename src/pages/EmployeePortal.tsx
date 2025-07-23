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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useLeaveRequests } from '@/contexts/LeaveRequestContext';

const EmployeePortal = () => {
  const { userRole } = useRole();
  const { notifications } = useNotifications();
  const { profile, updateProfile } = useUserProfile();
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [requestLeaveOpen, setRequestLeaveOpen] = useState(false);
  const navigate = useNavigate();
  const { submitLeaveRequest } = useLeaveRequests();

  // Zod schema for profile
  const profileSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(1, 'Phone is required'),
    department: z.string().min(1, 'Department is required'),
    position: z.string().min(1, 'Position is required'),
    bio: z.string().optional(),
    gender: z.string().min(1, 'Gender is required'),
  });

  type ProfileFormValues = z.infer<typeof profileSchema>;

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset: resetProfileForm,
  } = useForm<ProfileFormValues>({
    defaultValues: profile,
  });

  // Keep form in sync with profile when modal opens
  useEffect(() => {
    if (editProfileOpen) {
      resetProfileForm(profile);
    }
  }, [editProfileOpen, profile, resetProfileForm]);

  const onSubmitProfile = (data: ProfileFormValues) => {
    updateProfile(data);
    setEditProfileOpen(false);
  };

  // Handle URL parameters to open specific tabs
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'support') {
      setSelectedTab('support');
    }
  }, [searchParams]);

  // Handler for Join Training quick action
  const handleJoinTraining = () => {
    // If already on EmployeePortal, switch tab; otherwise, navigate
    setSelectedTab('training');
  };

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

  // Zod schema for leave request
  const leaveSchema = z.object({
    type: z.enum(['Vacation', 'Sick Leave', 'Personal', 'Other'], { required_error: 'Type is required' }),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    reason: z.string().min(1, 'Reason is required'),
  });
  type LeaveFormValues = z.infer<typeof leaveSchema>;

  const {
    register: registerLeave,
    handleSubmit: handleLeaveSubmit,
    formState: { errors: leaveErrors },
    reset: resetLeaveForm,
  } = useForm<LeaveFormValues>({
    defaultValues: {
      type: 'Vacation',
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  useEffect(() => {
    if (requestLeaveOpen) {
      resetLeaveForm({ type: 'Vacation', startDate: '', endDate: '', reason: '' });
    }
  }, [requestLeaveOpen, resetLeaveForm]);

  const onSubmitLeave = (data: LeaveFormValues) => {
    // Calculate days between startDate and endDate (inclusive)
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    submitLeaveRequest({
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      employeeId: profile.email, // using email as unique id
      employeeName: profile.firstName + ' ' + profile.lastName,
      days,
    });
    setRequestLeaveOpen(false);
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
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <QuickActions
              onRequestLeave={() => setRequestLeaveOpen(true)}
              onEditProfile={() => setEditProfileOpen(true)}
              onJoinTraining={handleJoinTraining}
            />

            {/* Recent Activity */}
            <RecentActivity />
          </div>

          {/* Company Announcements */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Company Announcements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {announcements.map((announcement, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                          <Badge className={getPriorityColor(announcement.priority)}>
                            {announcement.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{announcement.content}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{announcement.date}</span>
                          <span>{announcement.category}</span>
                        </div>
                      </div>
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
                <Button onClick={() => setEditProfileOpen(true)}>Edit Profile</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Time Off Management</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Request Time Off</h3>
                <p className="text-gray-600 mb-4">Submit leave requests, view your balance, and track approval status.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button onClick={() => setRequestLeaveOpen(true)}>Request Leave</Button>
                  <Button variant="outline">View History</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Training & Development</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Learning Modules</h3>
                <p className="text-gray-600 mb-4">Access training materials, track your progress, and earn certifications.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Button onClick={() => navigate('/training')}>Browse Courses</Button>
                  <Button variant="outline">My Progress</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <EmployeeITSupport />
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

      {/* Edit Profile Modal */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleProfileSubmit(onSubmitProfile)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input {...registerProfile('firstName')} />
                {profileErrors.firstName && <p className="text-red-500 text-xs mt-1">{profileErrors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input {...registerProfile('lastName')} />
                {profileErrors.lastName && <p className="text-red-500 text-xs mt-1">{profileErrors.lastName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input type="email" {...registerProfile('email')} />
                {profileErrors.email && <p className="text-red-500 text-xs mt-1">{profileErrors.email.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input {...registerProfile('phone')} />
                {profileErrors.phone && <p className="text-red-500 text-xs mt-1">{profileErrors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Department</label>
                <Input {...registerProfile('department')} />
                {profileErrors.department && <p className="text-red-500 text-xs mt-1">{profileErrors.department.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <Input {...registerProfile('position')} />
                {profileErrors.position && <p className="text-red-500 text-xs mt-1">{profileErrors.position.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea {...registerProfile('bio')} rows={3} />
                {profileErrors.bio && <p className="text-red-500 text-xs mt-1">{profileErrors.bio.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Gender</label>
                <Input {...registerProfile('gender')} />
                {profileErrors.gender && <p className="text-red-500 text-xs mt-1">{profileErrors.gender.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditProfileOpen(false)}>Cancel</Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Request Leave Modal */}
      <Dialog open={requestLeaveOpen} onOpenChange={setRequestLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Time Off</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLeaveSubmit(onSubmitLeave)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select {...registerLeave('type')} className="w-full border rounded px-3 py-2">
                  <option value="Vacation">Vacation</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal">Personal</option>
                  <option value="Other">Other</option>
                </select>
                {leaveErrors.type && <p className="text-red-500 text-xs mt-1">{leaveErrors.type.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <Input type="date" {...registerLeave('startDate')} />
                {leaveErrors.startDate && <p className="text-red-500 text-xs mt-1">{leaveErrors.startDate.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <Input type="date" {...registerLeave('endDate')} />
                {leaveErrors.endDate && <p className="text-red-500 text-xs mt-1">{leaveErrors.endDate.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Reason</label>
                <Textarea {...registerLeave('reason')} rows={3} />
                {leaveErrors.reason && <p className="text-red-500 text-xs mt-1">{leaveErrors.reason.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRequestLeaveOpen(false)}>Cancel</Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeePortal;
