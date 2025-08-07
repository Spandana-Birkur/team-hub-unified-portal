import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Clock, Award, FileSpreadsheet, Megaphone, FolderOpen, UserPlus, TrendingUp, Calendar, AlertCircle, CheckCircle, UserX, UserMinus } from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import EmployeeDirectory from './HR/EmployeeDirectory';
import LeaveManagement from './HR/LeaveManagement';
import PerformanceManagement from './HR/PerformanceManagement';
import FeedbackReports from './HR/FeedbackReports';
import HRAnnouncements from './HR/HRAnnouncements';
import HRDocuments from './HR/HRDocuments';
import ManagerTools from './HR/ManagerTools';

const HRManagement = () => {
  const { userRole } = useRole();
  const { profile } = useUserProfile();

  return (
    <div className="p-6">
      <Routes>
        <Route path="/employees" element={<EmployeeDirectory />} />
        <Route path="/leave" element={<LeaveManagement />} />
        <Route path="/performance" element={<PerformanceManagement />} />
        <Route path="/feedback" element={<FeedbackReports />} />
        <Route path="/announcements" element={<HRAnnouncements />} />
        <Route path="/documents" element={<HRDocuments />} />
        <Route path="/manager-tools" element={<ManagerTools />} />
        <Route path="*" element={<Navigate to="/hr/employees" replace />} />
      </Routes>
    </div>
  );
};

export default HRManagement;
