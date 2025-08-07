import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, Globe, Monitor, HelpCircle, Users, Key, FileText, AlertCircle,
  CreditCard, MousePointer, MessageCircle, Check, Clock, History, 
  Building, Play, Lock, ChevronLeft, ChevronRight, Star, Award, Sparkles, Bot
} from "lucide-react"

interface AccessLandingProps {
  onProceedToLogin: () => void;
}

const AccessLanding = ({ onProceedToLogin }: AccessLandingProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const features = [
    {
      icon: CreditCard,
      title: "Access pay stubs anytime",
      description: "View and download your pay stubs 24/7"
    },
    {
      icon: MousePointer,
      title: "Submit leave requests in 2 clicks",
      description: "Quick and easy time-off requests"
    },
    {
      icon: MessageCircle,
      title: "Chat with HR or IT directly",
      description: "Get instant support when you need it"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [features.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 font-sfpro">
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
      <main className="container mx-auto px-6 py-12">
        {/* Hero Welcome Carousel */}
        <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 rounded-3xl p-12 border border-purple-200 shadow-lg mb-16">
          <div className="text-center">
            <img 
              src="/accesslogo.png" 
              alt="Access Logo" 
              className="w-24 h-24 object-contain mx-auto mb-6"
            />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Welcome to Access
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Access your payroll, benefits, documents, and internal tools all in one secure place. 
              Connect with your team and manage your employee experience seamlessly.
            </p>

            {/* Login Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={onProceedToLogin}
                className="w-full sm:w-auto px-8 py-3 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                <Users className="mr-2 h-5 w-5" />
                Login with SSO
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Highlights Carousel */}
        <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-8 border border-blue-100 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                What You Can Do
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide(currentSlide === 0 ? features.length - 1 : currentSlide - 1)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentSlide((currentSlide + 1) % features.length)}
                className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl bg-white p-6 border border-blue-100">
            <div className="flex items-center gap-4">
              {React.createElement(features[currentSlide].icon, {
                className: "w-12 h-12 text-blue-500 flex-shrink-0"
              })}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {features[currentSlide].title}
                </h4>
                <p className="text-gray-600">
                  {features[currentSlide].description}
                </p>
              </div>
            </div>
            
            {/* Slide indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {features.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* What's Inside? Preview Section */}
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">What's Inside?</h2>
            <p className="text-gray-600">Everything you need to manage your work life</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-100">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Time Tracking</h4>
                <p className="text-sm text-gray-600">Clock in/out, view schedules</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-100">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Payroll History</h4>
                <p className="text-sm text-gray-600">Pay stubs, tax documents</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-100">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Benefits Management</h4>
                <p className="text-sm text-gray-600">Health, dental, 401k</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-gray-100">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Company Directory</h4>
                <p className="text-sm text-gray-600">Find colleagues, contacts</p>
              </div>
            </div>
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

        {/* AI-Powered Project Chatbot Section */}
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8 border border-cyan-200 shadow-sm mb-16">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              💡 Access AI – Your Project Assistant
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our intelligent chatbot helps project teams and members quickly access project-related content, 
              documents, deadlines, and updates.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-cyan-100">
              <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Search project-specific information instantly</h4>
                <p className="text-sm text-gray-600">Get immediate access to project details, timelines, and resources</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-cyan-100">
              <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Reduce time spent checking in with teammates</h4>
                <p className="text-sm text-gray-600">Get quick updates without interrupting your team's workflow</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-cyan-100">
              <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-cyan-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Improve collaboration and workflow efficiency</h4>
                <p className="text-sm text-gray-600">Streamline communication and boost team productivity</p>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 border border-cyan-200 text-sm text-gray-600">
              <MessageCircle className="w-4 h-4 text-cyan-500" />
              Available after login - Ask me anything about your projects!
            </div>
          </div>
        </div>

        {/* New User Onboarding Guide */}
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 mb-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl">🔰</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">First time here?</h3>
                <p className="text-gray-600">Learn how to get the most out of Access Portal</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-amber-300 text-amber-700 hover:bg-amber-100 flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              How to use Access Portal
            </Button>
          </div>
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

        {/* Security Reminder */}
        <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 mb-12">
          <div className="flex items-center gap-3 text-gray-600">
            <div className="text-lg">🔒</div>
            <p className="text-sm">
              <strong>For your security:</strong> Always log out after using a shared computer
            </p>
          </div>
        </div>
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
