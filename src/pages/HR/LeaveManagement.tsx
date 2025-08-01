import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { employees } from '@/data/employees';
import { useLeaveRequests } from '@/contexts/LeaveRequestContext';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Eye, 
  AlertTriangle
} from 'lucide-react';

const LeaveManagement = () => {
  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useLeaveRequests();
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<any>(null);
  const [leaveRequestDetailModalOpen, setLeaveRequestDetailModalOpen] = useState(false);

  const pendingLeaveCount = leaveRequests.filter(request => request.status === 'pending').length;

  // Function to calculate remaining leave balance for an employee
  const calculateRemainingLeaveBalance = (employeeId: string, leaveType: string) => {
    const employee = employees.find(emp => emp.id.toString() === employeeId.replace('emp', ''));
    if (!employee) return 0;

    const approvedRequests = leaveRequests.filter(
      request => request.employeeId === employeeId && 
      request.status === 'approved' && 
      request.type.toLowerCase().includes(leaveType.toLowerCase())
    );

    const usedDays = approvedRequests.reduce((total, request) => total + request.days, 0);
    
    let initialBalance = 0;
    switch (leaveType.toLowerCase()) {
      case 'vacation':
        initialBalance = employee.leaveBalance.vacation;
        break;
      case 'sick':
        initialBalance = employee.leaveBalance.sickLeave;
        break;
      case 'personal':
        initialBalance = employee.leaveBalance.personal;
        break;
      case 'other':
        initialBalance = employee.leaveBalance.other;
        break;
      default:
        return 0;
    }

    return Math.max(0, initialBalance - usedDays);
  };

  // Function to get employee by ID
  const getEmployeeById = (employeeId: string) => {
    return employees.find(emp => emp.id.toString() === employeeId.replace('emp', ''));
  };

  // Leave management functions
  const handleApproveLeave = (requestId: number) => {
    approveLeaveRequest(requestId);
  };

  const handleRejectLeave = (requestId: number) => {
    rejectLeaveRequest(requestId);
  };

  const handleViewLeaveRequest = (request: any) => {
    setSelectedLeaveRequest(request);
    setLeaveRequestDetailModalOpen(true);
  };

  const closeLeaveRequestDetailModal = () => {
    setLeaveRequestDetailModalOpen(false);
    setSelectedLeaveRequest(null);
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Leave Management Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {leaveRequests.filter(r => r.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved This Month</p>
                  <p className="text-2xl font-bold text-green-600">
                    {leaveRequests.filter(r => r.status === 'approved' && 
                      new Date(r.submittedAt).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Low Balance Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {leaveRequests.filter(r => {
                      const balance = calculateRemainingLeaveBalance(r.employeeId, r.type.toLowerCase());
                      return r.status === 'pending' && (balance - r.days) < 0;
                    }).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Requests</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {leaveRequests.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Leave Requests List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Leave Requests</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
          <div className="space-y-4">
            {leaveRequests.map((request) => {
              const employee = getEmployeeById(request.employeeId);
              const remainingBalance = calculateRemainingLeaveBalance(request.employeeId, request.type.toLowerCase());
              const willExceed = request.status === 'pending' && (remainingBalance - request.days) < 0;
              
              return (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{request.employeeName}</h4>
                        <p className="text-sm text-gray-600">{request.type} • {request.days} days</p>
                        <p className="text-xs text-gray-500">{request.startDate} - {request.endDate}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {request.type} balance: {remainingBalance} days remaining
                          </span>
                          {willExceed && (
                            <Badge variant="destructive" className="text-xs">
                              Would exceed balance
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                      {request.status}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleViewLeaveRequest(request)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    {request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleRejectLeave(request.id)}>Reject</Button>
                        <Button size="sm" onClick={() => handleApproveLeave(request.id)}>Approve</Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* Leave Request Detail Modal */}
      <Dialog open={leaveRequestDetailModalOpen} onOpenChange={setLeaveRequestDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Leave Request Details</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedLeaveRequest && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-start justify-between border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedLeaveRequest.employeeName}</h2>
                  <p className="text-lg text-gray-600">{selectedLeaveRequest.type}</p>
                  <Badge variant={selectedLeaveRequest.status === 'approved' ? 'default' : selectedLeaveRequest.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {selectedLeaveRequest.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Request ID: {selectedLeaveRequest.id}</p>
                  <p className="text-sm text-gray-500">Submitted: {new Date(selectedLeaveRequest.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Request Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Type: {selectedLeaveRequest.type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Duration: {selectedLeaveRequest.days} days</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Status: {selectedLeaveRequest.status}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Date Range</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Start Date: {selectedLeaveRequest.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-green-500" />
                      <span className="text-sm">End Date: {selectedLeaveRequest.endDate}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Total Days: {selectedLeaveRequest.days}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Leave Balance Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employee Leave Balance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {calculateRemainingLeaveBalance(selectedLeaveRequest.employeeId, 'vacation')}
                      </div>
                      <div className="text-sm text-blue-600 font-medium">Vacation Days</div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {calculateRemainingLeaveBalance(selectedLeaveRequest.employeeId, 'sick')}
                      </div>
                      <div className="text-sm text-red-600 font-medium">Sick Leave</div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {calculateRemainingLeaveBalance(selectedLeaveRequest.employeeId, 'personal')}
                      </div>
                      <div className="text-sm text-green-600 font-medium">Personal Days</div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {calculateRemainingLeaveBalance(selectedLeaveRequest.employeeId, 'other')}
                      </div>
                      <div className="text-sm text-purple-600 font-medium">Other Leave</div>
                      <div className="text-xs text-gray-500">Remaining</div>
                    </div>
                  </div>
                  
                  {/* Request Impact */}
                  {selectedLeaveRequest.status === 'pending' && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Request Impact</span>
                      </div>
                      <p className="text-xs text-yellow-700 mt-1">
                        If approved, this request will use {selectedLeaveRequest.days} {selectedLeaveRequest.type.toLowerCase()} days.
                        {(() => {
                          const remaining = calculateRemainingLeaveBalance(selectedLeaveRequest.employeeId, selectedLeaveRequest.type.toLowerCase());
                          const afterApproval = remaining - selectedLeaveRequest.days;
                          return afterApproval >= 0 
                            ? ` After approval, ${selectedLeaveRequest.employeeName} will have ${afterApproval} days remaining.`
                            : ` Warning: This would exceed the available balance by ${Math.abs(afterApproval)} days.`;
                        })()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Reason */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Reason for Leave</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedLeaveRequest.reason || "No reason provided"}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons for Pending Requests */}
              {selectedLeaveRequest.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline" onClick={() => handleRejectLeave(selectedLeaveRequest.id)}>
                    Reject Request
                  </Button>
                  <Button onClick={() => handleApproveLeave(selectedLeaveRequest.id)}>
                    Approve Request
                  </Button>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={closeLeaveRequestDetailModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagement;
