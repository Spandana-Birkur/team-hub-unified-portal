
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'submitted a leave request',
      time: '2 hours ago',
      status: 'pending',
      avatar: 'SJ'
    },
    {
      id: 2,
      user: 'Mike Chen',
      action: 'completed Java Basics course',
      time: '4 hours ago',
      status: 'completed',
      avatar: 'MC'
    },
    {
      id: 3,
      user: 'Emily Davis',
      action: 'created IT ticket #1234',
      time: '6 hours ago',
      status: 'open',
      avatar: 'ED'
    },
    {
      id: 4,
      user: 'Tom Wilson',
      action: 'updated profile information',
      time: '1 day ago',
      status: 'completed',
      avatar: 'TW'
    },
    {
      id: 5,
      user: 'Lisa Brown',
      action: 'joined Security Training',
      time: '2 days ago',
      status: 'in-progress',
      avatar: 'LB'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Avatar className="w-10 h-10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                  {activity.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-900">{activity.user}</span>
                  <span className="text-gray-600"> {activity.action}</span>
                </p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
              <Badge className={getStatusColor(activity.status)}>
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
