
import React from 'react';
import { Plus, FileText, Calendar, MessageSquare, User, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const QuickActions = () => {
  const actions = [
    {
      title: 'Submit Leave Request',
      description: 'Request time off or vacation',
      icon: Calendar,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Create IT Ticket',
      description: 'Report technical issues',
      icon: Wrench,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Update Profile',
      description: 'Manage your information',
      icon: User,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'View Documents',
      description: 'Access company resources',
      icon: FileText,
      color: 'bg-orange-500 hover:bg-orange-600'
    },
    {
      title: 'Join Training',
      description: 'Enroll in courses',
      icon: Plus,
      color: 'bg-indigo-500 hover:bg-indigo-600'
    },
    {
      title: 'Send Feedback',
      description: 'Share your thoughts',
      icon: MessageSquare,
      color: 'bg-pink-500 hover:bg-pink-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
            >
              <div className={`p-3 rounded-lg ${action.color}`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center">
                <p className="font-medium text-sm">{action.title}</p>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
