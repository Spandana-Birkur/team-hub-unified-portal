import React, { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Users, UserCheck, Shield, Headphones } from 'lucide-react';
import AccessLanding from './AccessLanding';

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { setUserRole } = useRole();
  const { setProfile } = useUserProfile();
  const [selectedRole, setSelectedRole] = useState<'employee' | 'hr' | 'manager' | 'it'>('employee');
  
  // Show landing page first, unless logout sets skipLanding
  const [showLoginForm, setShowLoginForm] = useState(() => {
    if (typeof window !== 'undefined') {
      const skipLanding = localStorage.getItem('skipLanding') === 'true';
      if (skipLanding) {
        localStorage.removeItem('skipLanding');
        return true;
      }
    }
    return false;
  });

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
      if (data.email.toLowerCase() === 'jane.doe@company.com') {
        setProfile({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane.doe@company.com',
          phone: '+1 (555) 987-6543',
          department: 'HR',
          position: 'HR Specialist',
          bio: 'Passionate about employee well-being and workplace safety.',
          gender: 'female',
        });
      }
    }
  };

  // Clean up URL and localStorage on mount
  // ...no cleanup needed...

  console.log('LoginPage render, showLoginForm:', showLoginForm);

  // Show landing page first, then login form
  if (!showLoginForm) {
    return <AccessLanding onProceedToLogin={() => setShowLoginForm(true)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 via-white to-gray-200">
      <Card className="w-full max-w-md shadow-2xl border-none bg-white rounded-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-extrabold text-gray-900 mb-2">
            Access Portal
          </CardTitle>
          <CardDescription className="text-base text-gray-500">Sign in to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                rules={{ required: "Email is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-white text-gray-900 border-2 border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-400 rounded-xl px-4 py-3 shadow-md transition-all duration-300 outline-none hover:border-sky-400"
                        style={{
                          boxShadow: "0 2px 16px 0 rgba(14,165,233,0.08), 0 1.5px 8px 0 rgba(14,165,233,0.08)"
                        }}
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
                    <FormLabel className="text-gray-700">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="bg-white text-gray-900 border-2 border-gray-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-400 rounded-xl px-4 py-3 shadow-md transition-all duration-300 outline-none hover:border-sky-400"
                        style={{
                          boxShadow: "0 2px 16px 0 rgba(14,165,233,0.08), 0 1.5px 8px 0 rgba(14,165,233,0.08)"
                        }}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">Select your role:</Label>
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`p-4 rounded-xl text-center transition-all shadow-lg border-2 relative overflow-hidden group ${
                        selectedRole === role.id
                          ? 'border-sky-500 bg-sky-50 text-sky-900 scale-105'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-sky-400 hover:scale-105'
                      }`}
                      style={{
                        boxShadow: selectedRole === role.id
                          ? "0 0 16px 2px rgba(14,165,233,0.15)"
                          : "0 2px 8px 0 rgba(14,165,233,0.08)"
                      }}
                    >
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                        style={{
                          background: selectedRole === role.id
                            ? "linear-gradient(90deg, rgba(14,165,233,0.08) 0%, rgba(2,132,199,0.08) 100%)"
                            : "linear-gradient(90deg, rgba(14,165,233,0.04) 0%, rgba(2,132,199,0.04) 100%)"
                        }}
                      />
                      <role.icon className="w-7 h-7 mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
                      <div className="text-sm font-semibold">{role.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-lg font-bold bg-sky-600 text-white rounded-xl shadow-xl hover:bg-sky-700 transition-transform relative overflow-hidden"
                style={{
                  boxShadow: "0 4px 24px 0 rgba(14,165,233,0.18)"
                }}
              >
                <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: "linear-gradient(90deg, rgba(14,165,233,0.12) 0%, rgba(2,132,199,0.12) 100%)"
                  }}
                />
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
