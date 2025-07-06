
import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserCheck, Shield, Headphones } from 'lucide-react';

const RoleSelector = () => {
  const { setUserRole } = useRole();

  const roles = [
    {
      id: 'employee' as const,
      title: 'Employee',
      description: 'Access employee portal, training, and helpdesk',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: 'hr' as const,
      title: 'HR Manager',
      description: 'Manage employees, benefits, and HR processes',
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      id: 'manager' as const,
      title: 'Manager',
      description: 'Team management and employee oversight',
      icon: Shield,
      color: 'bg-purple-500'
    },
    {
      id: 'it' as const,
      title: 'IT Support',
      description: 'Manage helpdesk and technical support',
      icon: Headphones,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Company Portal</h1>
          <p className="text-gray-600">Please select your role to continue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${role.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-lg">{role.title}</CardTitle>
                <CardDescription className="text-sm">{role.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setUserRole(role.id)}
                  className="w-full"
                  variant="outline"
                >
                  Select Role
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelector;
