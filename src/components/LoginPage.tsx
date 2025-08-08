import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

interface LoginFormData {
  email: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUserRole, isLoggedIn } = useRole();
  const { setProfile } = useUserProfile();
  const [accesses, setAccesses] = useState<string[]>([]);

  const getDefaultRoute = (role: string) => {
    switch (role.toLowerCase()) {
      case 'employee':
        return '/employee';
      case 'hr':
        return '/employee'; // Changed to employee portal for HR users too
      case 'manager':
        return '/employee'; // Changed to employee portal for managers too
      case 'it':
        return '/employee'; // Changed to employee portal for IT users too
      default:
        return '/employee';
    }
  };

  // Restore user data from localStorage on mount
  React.useEffect(() => {
    const storedProfile = localStorage.getItem('userProfile');
    const storedRole = localStorage.getItem('userRole');
    const storedAccesses = localStorage.getItem('userAccesses');
    if (storedProfile && storedRole) {
      setProfile(JSON.parse(storedProfile));
      setUserRole(storedRole as any);
      if (storedAccesses) setAccesses(JSON.parse(storedAccesses));
    }
  }, [setProfile, setUserRole]);

  const [showLoginForm, setShowLoginForm] = useState(false);

  const form = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: ''
    }
  });



  const handleSubmit = async (data: LoginFormData) => {
    console.log("CLICK");
    var result;
    try {
      console.log("TRYING");
      
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to insert data');
      }
      result = await response.json();
      if (result && result.Role) {
        // Clear any existing session data first
        localStorage.removeItem('userProfile');
        localStorage.removeItem('userRole'); 
        localStorage.removeItem('isLoggedIn');
        
        // Set new profile data
        const profileData = {
          ID: result.EmployeeID,
          firstName: result.FirstName,
          lastName: result.LastName,
          email: result.Email,
          phone: result.PhoneNumber,
          department: result.Department,
          role: result.Role,
          bio: result.Bio,
          gender: result.Gender,
          salary: result.Salary, // Add salary from API response
        };
        
        // Update contexts and localStorage
        setProfile(profileData);
        setUserRole(result.Role.toLowerCase() as any);
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        localStorage.setItem('userRole', result.Role.toLowerCase());
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('justLoggedIn', 'true'); // Flag for auto-click
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.log('Error: ' + error);
      alert('Invalid email or password');
    }
  };

  const testApi = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/test`);
      const data = await response.json();
      alert(data.message);
    } catch (e) {
      console.error("Test failed:", e);
      alert("Test failed! Check browser and server console.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userProfile');
    localStorage.removeItem('userRole');
    setProfile(null);
    setUserRole(null);
    setShowLoginForm(false); // Optionally show landing page again
  };

  // Clean up URL and localStorage on mount
  // ...no cleanup needed...

  console.log('LoginPage render, showLoginForm:', showLoginForm);

  if (!isLoggedIn) {
    // Show AccessLanding first, then login form
    if (!showLoginForm) {
      return <AccessLanding onProceedToLogin={() => setShowLoginForm(true)} />;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 via-white to-gray-200">
        {/* Add this button temporarily for testing */}
      <button onClick={testApi} className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded">
        Test CORS
      </button>
      {/* Back button to return to landing */}
      <button 
        onClick={() => setShowLoginForm(false)} 
        className="absolute top-4 right-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Back to Landing
      </button>
        <Card className="w-full max-w-md shadow-2xl border-none bg-white rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-extrabold text-gray-900 mb-2">
              Access Portal
            </CardTitle>
            <CardDescription className="text-base text-gray-500">Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-3 text-lg font-semibold border-2 border-sky-600 text-sky-600 rounded-xl mt-2 hover:bg-sky-50 transition-all"
                  onClick={() => alert('Reset password functionality coming soon!')}
                >
                  Reset Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is logged in, let App.tsx handle navigation
  return null;
};

export default LoginPage;
