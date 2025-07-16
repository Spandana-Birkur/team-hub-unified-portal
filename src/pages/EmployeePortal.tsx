import React, { useState } from 'react';
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
  const [selectedTab, setSelectedTab] = useState('overview');

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
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <QuickActions />

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
                <Button>Edit Profile</Button>
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
                  <Button>Request Leave</Button>
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
                  <Button>Browse Courses</Button>
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
    </div>
  );
};

export default EmployeePortal;
