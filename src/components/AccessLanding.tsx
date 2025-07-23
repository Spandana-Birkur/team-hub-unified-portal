import React from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Globe, Monitor, HelpCircle, Users, Key, FileText, AlertCircle } from "lucide-react"

interface AccessLandingProps {
  onProceedToLogin: () => void;
}

const AccessLanding = ({ onProceedToLogin }: AccessLandingProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="/accesslogo.png" 
                alt="Access Logo" 
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Access</h1>
                <p className="text-sm text-gray-600">Employee Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={onProceedToLogin}
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Login
              </Button>
              <Globe className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">EN</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <img 
              src="/accesslogo.png" 
              alt="Access Logo" 
              className="w-24 h-24 object-contain mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Access
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Access your payroll, benefits, documents, and internal tools all in one secure place. 
              Connect with your team and manage your employee experience seamlessly.
            </p>
          </div>

          {/* Login Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button 
              onClick={onProceedToLogin}
              className="w-full sm:w-auto px-8 py-3 text-lg font-bold bg-blue-600 text-white rounded-xl shadow-xl hover:bg-blue-700 transition-all"
            >
              <Users className="mr-2 h-5 w-5" />
              Login with SSO
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Documents & Payroll</h3>
              </div>
              <p className="text-gray-600">Access pay stubs, tax documents, and important company forms.</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Benefits & Health</h3>
              </div>
              <p className="text-gray-600">Manage your health insurance, retirement plans, and employee benefits.</p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Team Directory</h3>
              </div>
              <p className="text-gray-600">Connect with colleagues and access internal company resources.</p>
            </CardContent>
          </Card>
        </div>

        {/* Help & Support Section */}
        <Card className="shadow-lg border border-gray-200 mb-12">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <HelpCircle className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Need Help?</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <Button variant="ghost" className="w-full">
                  Reset Password
                </Button>
              </div>
              <div className="text-center">
                <Button variant="ghost" className="w-full">
                  Login Issues
                </Button>
              </div>
              <div className="text-center">
                <Button variant="ghost" className="w-full">
                  Contact IT Support
                </Button>
              </div>
              <div className="text-center">
                <Button variant="ghost" className="w-full">
                  FAQ
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Notice */}
        <Card className="border-l-4 border-l-blue-600 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">System Maintenance Notice</h3>
                <p className="text-gray-600">
                  Scheduled maintenance will occur on Sunday, July 28th from 2:00 AM - 4:00 AM EST. 
                  Some services may be temporarily unavailable during this time.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-6 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/accesslogo.png" 
                  alt="Access Logo" 
                  className="h-5 w-5 object-contain mr-2"
                />
                <h3 className="font-semibold text-gray-900">Security Notice</h3>
              </div>
              <p className="text-sm text-gray-600">
                For authorized employees only. Unauthorized access is prohibited. 
                This system is monitored and all activities are logged.
              </p>
            </div>
            <div className="flex flex-col md:items-end">
              <div className="flex flex-wrap gap-4 mb-4">
                <a href="#" className="text-sm text-blue-600 hover:underline">Privacy Policy</a>
                <a href="#" className="text-sm text-blue-600 hover:underline">Terms of Use</a>
                <a href="#" className="text-sm text-blue-600 hover:underline">Accessibility</a>
              </div>
              <p className="text-sm text-gray-600">
                © 2024 Access. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AccessLanding
