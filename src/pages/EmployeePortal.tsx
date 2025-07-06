
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin, Calendar, Users, Bell } from 'lucide-react';

const EmployeePortal = () => {
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

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Employee Portal</h1>
        <p className="text-gray-600">Manage your profile and stay connected with your team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg font-bold">JD</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">John Doe</h3>
                <p className="text-gray-600">Senior Software Engineer</p>
                <Badge className="mt-1">Engineering</Badge>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>john.doe@company.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>+1 (555) 123-4567</span>
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
            
            <Button className="w-full mt-4">Edit Profile</Button>
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
                <div key={announcement.id} className="border-l-4 border-blue-500 pl-4 py-2">
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

      {/* Team Directory */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Team Directory</span>
          </CardTitle>
          <Button variant="outline" size="sm">View All Employees</Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:shadow-md transition-shadow">
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
    </div>
  );
};

export default EmployeePortal;
