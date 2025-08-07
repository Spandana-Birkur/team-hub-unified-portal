// Leave Management Service
// Handles all API calls to the backend for leave management functionality

const API_BASE_URL = '/api';

export interface LeaveRequest {
  requestId: number;
  employeeId: number;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  approvedBy?: number;
  approvedDate?: string;
}

export interface LeaveBalance {
  employeeId: number;
  vacationDays: number;
  sickDays: number;
  personalDays: number;
  otherDays: number;
}

export interface CreateLeaveRequestData {
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
}

export interface ApproveLeaveRequestData {
  approvedBy: number;
}

class LeaveManagementService {
  // Get all leave requests
  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/leave-requests`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.leaveRequests || [];
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      throw error;
    }
  }

  // Get pending leave requests
  async getPendingLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/leave-requests/pending`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.leaveRequests || [];
    } catch (error) {
      console.error('Error fetching pending leave requests:', error);
      throw error;
    }
  }

  // Get leave requests for a specific employee
  async getEmployeeLeaveRequests(employeeId: number): Promise<LeaveRequest[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/leave-requests/employee/${employeeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.leaveRequests || [];
    } catch (error) {
      console.error('Error fetching employee leave requests:', error);
      throw error;
    }
  }

  // Get a specific leave request by ID
  async getLeaveRequestById(requestId: number): Promise<LeaveRequest> {
    try {
      const response = await fetch(`${API_BASE_URL}/leave-requests/${requestId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching leave request:', error);
      throw error;
    }
  }

  // Create a new leave request
  async createLeaveRequest(requestData: CreateLeaveRequestData): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/leave-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error creating leave request:', error);
      throw error;
    }
  }

  // Approve a leave request
  async approveLeaveRequest(requestId: number, approvedBy: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/leave-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvedBy }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error approving leave request:', error);
      throw error;
    }
  }

  // Reject a leave request
  async rejectLeaveRequest(requestId: number, approvedBy: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/leave-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ approvedBy }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error rejecting leave request:', error);
      throw error;
    }
  }

  // Get leave balance for an employee
  async getLeaveBalance(employeeId: number): Promise<LeaveBalance> {
    try {
      const response = await fetch(`${API_BASE_URL}/leave-balance/${employeeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      throw error;
    }
  }
}

export const leaveManagementService = new LeaveManagementService(); 