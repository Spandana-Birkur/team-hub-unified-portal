import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  Shield, 
  GraduationCap, 
  Calendar, 
  FileText, 
  MessageSquare,
  Download,
  Headphones
} from 'lucide-react';

const ManagerTools = () => {
  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Manager Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-sm text-gray-600">Direct Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">8</p>
                  <p className="text-sm text-gray-600">Pending Approvals</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">92%</p>
                  <p className="text-sm text-gray-600">Team Performance</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-gray-600">Active Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Manager Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Manager Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/helpdesk'}
              >
                <Headphones className="w-6 h-6" />
                <span>IT Helpdesk</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/training'}
              >
                <GraduationCap className="w-6 h-6" />
                <span>Training Management</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/calendar'}
              >
                <Calendar className="w-6 h-6" />
                <span>Calendar Management</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/documents'}
              >
                <FileText className="w-6 h-6" />
                <span>Document Center</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => window.location.href = '/safety'}
              >
                <Shield className="w-6 h-6" />
                <span>Safety & Compliance</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <MessageSquare className="w-6 h-6" />
                <span>Team Communication</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Team Performance Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-green-600">94%</p>
                  <p className="text-sm text-gray-600">On-time Delivery</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">4.3/5</p>
                  <p className="text-sm text-gray-600">Team Satisfaction</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">88%</p>
                  <p className="text-sm text-gray-600">Goal Achievement</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Recent Team Activities</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Team Meeting - Q1 Planning</p>
                      <p className="text-sm text-gray-600">Scheduled for tomorrow at 10 AM</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-800 rounded-full">Scheduled</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <p className="font-medium">Performance Reviews Due</p>
                      <p className="text-sm text-gray-600">5 reviews pending completion</p>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manager Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Manager Reports</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold">HR Reports</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Team Leave Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Performance Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Training Completion
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold">IT Reports</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    System Access Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Equipment Inventory
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Security Compliance
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerTools;
