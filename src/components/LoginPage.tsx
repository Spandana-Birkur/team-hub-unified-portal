
import React, { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Users, UserCheck, Shield, Headphones } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { setUserRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<'employee' | 'hr' | 'manager' | 'it'>('employee');

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const roles = [
    {
      id: 'employee' as const,
      title: 'Employee',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      id: 'hr' as const,
      title: 'HR Manager',
      icon: UserCheck,
      color: 'bg-green-500'
    },
    {
      id: 'manager' as const,
      title: 'Manager',
      icon: Shield,
      color: 'bg-purple-500'
    },
    {
      id: 'it' as const,
      title: 'IT Support',
      icon: Headphones,
      color: 'bg-orange-500'
    }
  ];

  const onSubmit = (data: LoginFormData) => {
    // Simple validation - in a real app, this would authenticate with a backend
    if (data.email && data.password) {
      setUserRole(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Company Portal</CardTitle>
          <CardDescription>Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Label className="text-sm font-medium">Select your role:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        selectedRole === role.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <role.icon className="w-5 h-5 mx-auto mb-1" />
                      <div className="text-xs font-medium">{role.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
