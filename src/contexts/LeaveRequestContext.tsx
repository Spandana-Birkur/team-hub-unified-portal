import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  submitLeaveRequest: (request: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => void;
  approveLeaveRequest: (requestId: number) => void;
  rejectLeaveRequest: (requestId: number) => void;
  getPendingRequests: () => LeaveRequest[];
  getRequestsByEmployee: (employeeId: string) => LeaveRequest[];
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
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      employeeId: 'emp001',
      employeeName: 'Sarah Johnson',
      type: 'Vacation',
      startDate: '2024-01-15',
      endDate: '2024-01-19',
      reason: 'Annual family vacation',
      status: 'pending',
      days: 5,
      submittedAt: '2024-01-10T10:00:00Z'
    },
    {
      id: 2,
      employeeId: 'emp002',
      employeeName: 'Mike Chen',
      type: 'Sick Leave',
      startDate: '2024-01-12',
      endDate: '2024-01-12',
      reason: 'Not feeling well',
      status: 'approved',
      days: 1,
      submittedAt: '2024-01-11T08:30:00Z'
    },
    {
      id: 3,
      employeeId: 'emp003',
      employeeName: 'Emily Davis',
      type: 'Personal',
      startDate: '2024-01-22',
      endDate: '2024-01-23',
      reason: 'Personal appointment',
      status: 'pending',
      days: 2,
      submittedAt: '2024-01-15T14:20:00Z'
    },
    {
      id: 4,
      employeeId: 'emp004',
      employeeName: 'Tom Wilson',
      type: 'Vacation',
      startDate: '2024-02-05',
      endDate: '2024-02-09',
      reason: 'Ski trip with family',
      status: 'approved',
      days: 5,
      submittedAt: '2024-01-20T09:15:00Z'
    },
    {
      id: 5,
      employeeId: 'emp005',
      employeeName: 'Alex Rodriguez',
      type: 'Personal',
      startDate: '2025-08-15',
      endDate: '2025-08-16',
      reason: 'Moving to new apartment',
      status: 'pending',
      days: 2,
      submittedAt: '2025-07-30T11:30:00Z'
    },
    {
      id: 6,
      employeeId: 'emp006',
      employeeName: 'Jessica Kim',
      type: 'Sick Leave',
      startDate: '2025-08-05',
      endDate: '2025-08-07',
      reason: 'Flu symptoms and recovery',
      status: 'pending',
      days: 3,
      submittedAt: '2025-07-29T07:45:00Z'
    },
    {
      id: 7,
      employeeId: 'emp008',
      employeeName: 'Rachel Green',
      type: 'Vacation',
      startDate: '2025-09-02',
      endDate: '2025-09-06',
      reason: 'Long weekend getaway with family',
      status: 'pending',
      days: 5,
      submittedAt: '2025-07-28T16:20:00Z'
    }
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedRequests = localStorage.getItem('leaveRequests');
    if (savedRequests) {
      try {
        setLeaveRequests(JSON.parse(savedRequests));
      } catch (error) {
        console.error('Error loading leave requests from localStorage:', error);
      }
    }
  }, []);

  // Save to localStorage whenever requests change
  useEffect(() => {
    localStorage.setItem('leaveRequests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const submitLeaveRequest = (request: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newRequest: LeaveRequest = {
      ...request,
      id: Math.max(...leaveRequests.map(r => r.id), 0) + 1,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    
    setLeaveRequests(prev => [newRequest, ...prev]);
  };

  const approveLeaveRequest = (requestId: number) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'approved', actionedAt: new Date().toISOString() }
          : request
      )
    );
  };

  const rejectLeaveRequest = (requestId: number) => {
    setLeaveRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected', actionedAt: new Date().toISOString() }
          : request
      )
    );
  };

  const getPendingRequests = () => {
    return leaveRequests.filter(request => request.status === 'pending');
  };

  const getRequestsByEmployee = (employeeId: string) => {
    return leaveRequests.filter(request => request.employeeId === employeeId);
  };

  const value: LeaveRequestContextType = {
    leaveRequests,
    submitLeaveRequest,
    approveLeaveRequest,
    rejectLeaveRequest,
    getPendingRequests,
    getRequestsByEmployee
  };

  return (
    <LeaveRequestContext.Provider value={value}>
      {children}
    </LeaveRequestContext.Provider>
  );
}; 