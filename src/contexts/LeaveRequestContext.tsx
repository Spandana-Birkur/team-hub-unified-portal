import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { leaveManagementService, LeaveRequest as BackendLeaveRequest, LeaveBalance } from '@/services/leaveManagementService';

export interface LeaveRequest {
  id: number;
  employeeId: string;
  employeeName: string;
  type: 'Vacation' | 'Sick Leave' | 'Personal' | 'Other';
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  days: number;
  submittedAt: string;
  actionedAt?: string; // When the request was approved/rejected
}

interface LeaveRequestContextType {
  leaveRequests: LeaveRequest[];
  leaveBalances: Map<number, LeaveBalance>;
  loading: boolean;
  error: string | null;
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => Promise<void>;
  approveLeaveRequest: (requestId: number, approvedBy: number) => Promise<void>;
  rejectLeaveRequest: (requestId: number, approvedBy: number) => Promise<void>;
  getPendingRequests: () => LeaveRequest[];
  getRequestsByEmployee: (employeeId: string) => LeaveRequest[];
  getLeaveBalance: (employeeId: number) => Promise<LeaveBalance>;
  refreshLeaveRequests: () => Promise<void>;
}

const LeaveRequestContext = createContext<LeaveRequestContextType | undefined>(undefined);

export const useLeaveRequests = () => {
  const context = useContext(LeaveRequestContext);
  if (context === undefined) {
    throw new Error('useLeaveRequests must be used within a LeaveRequestProvider');
  }
  return context;
};

interface LeaveRequestProviderProps {
  children: ReactNode;
}

export const LeaveRequestProvider: React.FC<LeaveRequestProviderProps> = ({ children }) => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<Map<number, LeaveBalance>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load leave requests from backend on mount
  useEffect(() => {
    refreshLeaveRequests();
  }, []);

  // Helper function to convert backend format to frontend format
  const convertBackendToFrontend = (backendRequest: BackendLeaveRequest): LeaveRequest => {
    return {
      id: backendRequest.requestId,
      employeeId: `emp${backendRequest.employeeId.toString().padStart(3, '0')}`,
      employeeName: backendRequest.employeeName,
      type: backendRequest.leaveType as 'Vacation' | 'Sick Leave' | 'Personal' | 'Other',
      startDate: backendRequest.startDate,
      endDate: backendRequest.endDate,
      reason: backendRequest.reason,
      status: backendRequest.status,
      days: backendRequest.days,
      submittedAt: backendRequest.submittedDate,
      actionedAt: backendRequest.approvedDate
    };
  };

  // Helper function to convert frontend format to backend format
  const convertFrontendToBackend = (frontendRequest: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
    return {
      employeeId: parseInt(frontendRequest.employeeId.replace('emp', '')),
      leaveType: frontendRequest.type,
      startDate: frontendRequest.startDate,
      endDate: frontendRequest.endDate,
      days: frontendRequest.days,
      reason: frontendRequest.reason
    };
  };

  const refreshLeaveRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const backendRequests = await leaveManagementService.getAllLeaveRequests();
      const frontendRequests = backendRequests.map(convertBackendToFrontend);
      setLeaveRequests(frontendRequests);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leave requests');
      console.error('Error loading leave requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const submitLeaveRequest = async (request: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const backendRequest = convertFrontendToBackend(request);
      await leaveManagementService.createLeaveRequest(backendRequest);
      await refreshLeaveRequests(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit leave request');
      console.error('Error submitting leave request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveLeaveRequest = async (requestId: number, approvedBy: number) => {
    setLoading(true);
    setError(null);
    try {
      await leaveManagementService.approveLeaveRequest(requestId, approvedBy);
      await refreshLeaveRequests(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve leave request');
      console.error('Error approving leave request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectLeaveRequest = async (requestId: number, approvedBy: number) => {
    setLoading(true);
    setError(null);
    try {
      await leaveManagementService.rejectLeaveRequest(requestId, approvedBy);
      await refreshLeaveRequests(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject leave request');
      console.error('Error rejecting leave request:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLeaveBalance = async (employeeId: number): Promise<LeaveBalance> => {
    try {
      const balance = await leaveManagementService.getLeaveBalance(employeeId);
      setLeaveBalances(prev => new Map(prev).set(employeeId, balance));
      return balance;
    } catch (err) {
      console.error('Error fetching leave balance:', err);
      throw err;
    }
  };

  const getPendingRequests = () => {
    return leaveRequests.filter(request => request.status === 'pending');
  };

  const getRequestsByEmployee = (employeeId: string) => {
    return leaveRequests.filter(request => request.employeeId === employeeId);
  };

  const value: LeaveRequestContextType = {
    leaveRequests,
    leaveBalances,
    loading,
    error,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    getPendingRequests,
    getRequestsByEmployee,
    getLeaveBalance,
    refreshLeaveRequests
  };

  return (
    <LeaveRequestContext.Provider value={value}>
      {children}
    </LeaveRequestContext.Provider>
  );
}; 