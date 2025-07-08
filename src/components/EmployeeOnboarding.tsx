
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  Upload, 
  FileText, 
  Users, 
  GraduationCap,
  Building,
  Shield
} from 'lucide-react';

const EmployeeOnboarding = () => {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const onboardingSteps = [
    { id: 1, title: 'Welcome & Introduction', description: 'Complete welcome orientation', icon: Users, completed: true },
    { id: 2, title: 'Upload Documents', description: 'ID, Bank Info, Emergency Contacts', icon: Upload, completed: false },
    { id: 3, title: 'Review Employee Handbook', description: 'Read and acknowledge policies', icon: FileText, completed: false },
    { id: 4, title: 'IT Setup', description: 'Computer, email, and system access', icon: Shield, completed: false },
    { id: 5, title: 'Department Introduction', description: 'Meet your team and manager', icon: Building, completed: false },
    { id: 6, title: 'Training Modules', description: 'Complete required training courses', icon: GraduationCap, completed: false },
  ];

  const requiredDocuments = [
    { name: 'Government ID', status: 'pending', required: true },
    { name: 'Bank Account Details', status: 'pending', required: true },
    { name: 'Emergency Contact Form', status: 'pending', required: true },
    { name: 'Tax Forms (W-4)', status: 'pending', required: true },
    { name: 'Direct Deposit Form', status: 'pending', required: false },
  ];

  const trainingModules = [
    { name: 'Company Culture & Values', duration: '30 min', status: 'not_started', required: true },
    { name: 'Workplace Safety', duration: '45 min', status: 'not_started', required: true },
    { name: 'IT Security Training', duration: '25 min', status: 'not_started', required: true },
    { name: 'Ethics & Compliance', duration: '40 min', status: 'not_started', required: true },
  ];

  const completedSteps = onboardingSteps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / onboardingSteps.length) * 100;

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <Clock className="w-5 h-5 text-gray-400" />
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge variant="default">Completed</Badge>;
      case 'in_progress': return <Badge variant="secondary">In Progress</Badge>;
      case 'pending': return <Badge variant="outline">Pending</Badge>;
      case 'not_started': return <Badge variant="outline">Not Started</Badge>;
      default: return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Acme Corporation!</h1>
        <p className="text-gray-600 mb-4">Complete your onboarding process to get started.</p>
        
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Onboarding Progress</h3>
              <span className="text-sm text-gray-600">{completedSteps} of {onboardingSteps.length} completed</span>
            </div>
            <Progress value={progressPercentage} className="mb-2" />
            <p className="text-sm text-gray-500">{Math.round(progressPercentage)}% complete</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Onboarding Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Onboarding Checklist</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {onboardingSteps.map((step) => (
                <div key={step.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="mt-1">
                    {getStatusIcon(step.completed)}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${step.completed ? 'text-gray-900' : 'text-gray-700'}`}>
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                  <step.icon className={`w-5 h-5 ${step.completed ? 'text-green-500' : 'text-gray-400'}`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Required Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requiredDocuments.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    {doc.required && <span className="text-xs text-red-500">* Required</span>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(doc.status)}
                    <Button size="sm" variant="outline">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Training Modules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="w-5 h-5" />
              <span>Training Modules</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingModules.map((module, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{module.name}</h4>
                    <p className="text-sm text-gray-600">Duration: {module.duration}</p>
                    {module.required && <span className="text-xs text-red-500">* Required</span>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(module.status)}
                    <Button size="sm">Start</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links & Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Employee Handbook
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Company Directory
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Building className="w-4 h-4 mr-2" />
                Office Tour Schedule
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 mr-2" />
                IT Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeOnboarding;
