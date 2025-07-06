
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, FileText, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const HRManagement = () => {
  const leaveRequests = [
    { id: 1, employee: 'Sarah Johnson', type: 'Vacation', dates: 'Jan 15-19, 2024', status: 'pending', days: 5 },
    { id: 2, employee: 'Mike Chen', type: 'Sick Leave', dates: 'Jan 12, 2024', status: 'approved', days: 1 },
    { id: 3, employee: 'Emily Davis', type: 'Personal', dates: 'Jan 22-23, 2024', status: 'pending', days: 2 },
    { id: 4, employee: 'Tom Wilson', type: 'Vacation', dates: 'Feb 5-9, 2024', status: 'approved', days: 5 },
  ];

  const performanceMetrics = [
    { employee: 'John Doe', department: 'Engineering', rating: 4.8, reviews: 12, lastReview: '2024-01-10' },
    { employee: 'Sarah Johnson', department: 'Marketing', rating: 4.6, reviews: 8, lastReview: '2024-01-08' },
    { employee: 'Mike Chen', department: 'Design', rating: 4.9, reviews: 15, lastReview: '2024-01-12' },
    { employee: 'Emily Davis', department: 'Sales', rating: 4.7, reviews: 10, lastReview: '2024-01-05' },
  ];

  const employeeStats = [
    { title: 'Total Employees', value: '247', icon: Users, color: 'bg-blue-500' },
    { title: 'Pending Leave', value: '8', icon: Clock, color: 'bg-yellow-500' },
    { title: 'Performance Reviews', value: '23', icon: TrendingUp, color: 'bg-green-500' },
    { title: 'New Hires (Month)', value: '5', icon: CheckCircle, color: 'bg-purple-500' },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">HR Management</h1>
        <p className="text-gray-600">Manage employees, leave requests, and performance reviews.</p>
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

      <Tabs defaultValue="leave" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leave">Leave Management</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="employees">Employee Records</TabsTrigger>
        </TabsList>

        <TabsContent value="leave">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Leave Requests</span>
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

        <TabsContent value="performance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Performance Reviews</span>
              </CardTitle>
              <Button>Schedule Review</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{metric.employee}</h4>
                      <p className="text-sm text-gray-600">{metric.department}</p>
                      <p className="text-xs text-gray-500">Last review: {metric.lastReview}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-green-600">{metric.rating}</p>
                        <p className="text-xs text-gray-500">Rating</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-blue-600">{metric.reviews}</p>
                        <p className="text-xs text-gray-500">Reviews</p>
                      </div>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Employee Records</span>
              </CardTitle>
              <Button>Add Employee</Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Employee Database</h3>
                <p className="text-gray-600 mb-4">Comprehensive employee records and documentation system.</p>
                <Button>Import Employee Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRManagement;
