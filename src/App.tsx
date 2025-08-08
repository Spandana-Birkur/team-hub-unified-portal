
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { RoleProvider, useRole } from "@/contexts/RoleContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { LeaveRequestProvider } from "@/contexts/LeaveRequestContext";
import { EventsProvider } from "@/contexts/EventsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProfileRefreshProvider } from "@/contexts/ProfileRefreshProvider";
import CompanyHeader from "./components/CompanyHeader";
import CompanySidebar from "./components/CompanySidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeePortal from "./pages/EmployeePortal";
import Pay from "./pages/Pay";
import Training from "./pages/Training";
import Calendar from "./pages/Calendar";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/LoginPage";
import Documents from "./pages/Documents";
import EmployeeSafetyConduct from "./pages/EmployeeSafetyConduct";
import Chatbot from "./pages/Chatbot";
import JobPostings from "./pages/JobPostings";

// HR Pages
import EmployeeDirectory from "./pages/HR/EmployeeDirectory";
import LeaveManagement from "./pages/HR/LeaveManagement";
import PerformanceManagement from "./pages/HR/PerformanceManagement";
import FeedbackReports from "./pages/HR/FeedbackReports";
import HRAnnouncements from "./pages/HR/HRAnnouncements";
import HRDocuments from "./pages/HR/HRDocuments";
import HRAnalytics from "./pages/HR/HRAnalytics";
import ManagerTools from "./pages/HR/ManagerTools";
import JobPostingManagement from "./pages/HR/JobPostingManagement";
import ManagerCommunication from "./components/ManagerCommunication";

// IT Pages
import SupportTickets from "./pages/IT/SupportTickets";
import SLAEscalation from "./pages/IT/SLAEscalation";
import TeamAssignment from "./pages/IT/TeamAssignment";
import AssetManagement from "./pages/IT/AssetManagement";
import KnowledgeBase from "./pages/IT/KnowledgeBase";
import AssetLifecyclePage from "./pages/IT/AssetLifecycle";

const queryClient = new QueryClient();

const AppContent = () => {
  const { userRole, isLoggedIn } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  // Force navigation to employee portal when user logs in
  React.useEffect(() => {
    if (isLoggedIn && location.pathname === '/') {
      navigate('/employee', { replace: true });
    }
  }, [isLoggedIn, location.pathname, navigate]);

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const getDefaultRoute = () => {
    // Always return employee portal regardless of role
    return '/employee';
  };

  return (
    <div className="min-h-screen bg-background">
      <CompanyHeader />
      <div className="flex">
        <CompanySidebar />
        <main className="flex-1 transition-all duration-300 ease-in-out bg-background text-foreground" style={{ 
          marginLeft: 'var(--sidebar-width, 256px)'
        }}>
          <Routes>
            <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
            <Route path="/employee" element={
              <ProtectedRoute requiredRoles={['employee', 'manager', 'hr', 'it']}>
                <EmployeePortal />
              </ProtectedRoute>
            } />
            <Route path="/pay" element={
              <ProtectedRoute requiredRoles={['employee', 'manager']}>
                <Pay />
              </ProtectedRoute>
            } />
            
            {/* HR Routes */}
            <Route path="/hr/employees" element={
              <ProtectedRoute requiredRoles={['hr']}>
                <EmployeeDirectory />
              </ProtectedRoute>
            } />
            <Route path="/hr/leave" element={
              <ProtectedRoute requiredRoles={['hr']}>
                <LeaveManagement />
              </ProtectedRoute>
            } />
            <Route path="/manager/leave" element={
              <ProtectedRoute requiredRoles={['manager']}>
                <LeaveManagement />
              </ProtectedRoute>
            } />
            <Route path="/hr/performance" element={
              <ProtectedRoute requiredRoles={['hr']}>
                <PerformanceManagement />
              </ProtectedRoute>
            } />
            <Route path="/hr/feedback" element={
              <ProtectedRoute requiredRoles={['hr']}>
                <FeedbackReports />
              </ProtectedRoute>
            } />
            <Route path="/hr/announcements" element={
              <ProtectedRoute requiredRoles={['hr']}>
                <HRAnnouncements />
              </ProtectedRoute>
            } />
            <Route path="/hr/documents" element={
              <ProtectedRoute requiredRoles={['hr']}>
                <HRDocuments />
              </ProtectedRoute>
            } />
            <Route path="/hr/analytics" element={
              <ProtectedRoute requiredRoles={['hr']}>
                <HRAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/hr/manager-tools" element={
              <ProtectedRoute requiredRoles={['manager']}>
                <ManagerTools />
              </ProtectedRoute>
            } />
            <Route path="/hr/job-postings" element={
              <ProtectedRoute requiredRoles={['hr', 'manager']}>
                <JobPostingManagement />
              </ProtectedRoute>
            } />
            <Route path="/hr/communication" element={
              <ProtectedRoute requiredRoles={['manager', 'employee']}>
                <ManagerCommunication />
              </ProtectedRoute>
            } />
            
            {/* IT Routes */}
            <Route path="/ithelpdesk/tickets" element={
              <ProtectedRoute requiredRoles={['employee', 'it']}>
                <SupportTickets />
              </ProtectedRoute>
            } />
            <Route path="/ithelpdesk/escalation" element={
              <ProtectedRoute requiredRoles={['it']}>
                <SLAEscalation />
              </ProtectedRoute>
            } />
            <Route path="/ithelpdesk/assignment" element={
              <ProtectedRoute requiredRoles={['it']}>
                <TeamAssignment />
              </ProtectedRoute>
            } />
            <Route path="/ithelpdesk/assets" element={
              <ProtectedRoute requiredRoles={['it']}>
                <AssetManagement />
              </ProtectedRoute>
            } />
            <Route path="/ithelpdesk/lifecycle" element={
              <ProtectedRoute requiredRoles={['it']}>
                <AssetLifecyclePage />
              </ProtectedRoute>
            } />
            <Route path="/ithelpdesk/knowledge" element={
              <ProtectedRoute requiredRoles={['it']}>
                <KnowledgeBase />
              </ProtectedRoute>
            } />
            
            <Route path="/training" element={
              <ProtectedRoute requiredRoles={['employee']}>
                <Training />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute requiredRoles={['employee']}>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute requiredRoles={['employee', 'hr', 'manager', 'it']}>
                <Notifications />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute requiredRoles={['employee', 'hr', 'manager', 'it']}>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/documents" element={
              <ProtectedRoute requiredRoles={['employee']}>
                <Documents />
              </ProtectedRoute>
            } />
            <Route path="/job-postings" element={
              <ProtectedRoute requiredRoles={['employee']}>
                <JobPostings />
              </ProtectedRoute>
            } />
            <Route path="/safety" element={
              <ProtectedRoute requiredRoles={['employee']}>
                <EmployeeSafetyConduct />
              </ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute requiredRoles={['employee']}>
                <Chatbot />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider>
          <UserProfileProvider>
            <RoleProvider>
              <NotificationProvider>
                <LeaveRequestProvider>
                  <EventsProvider>
                    <ProfileRefreshProvider>
                      <AppContent />
                    </ProfileRefreshProvider>
                  </EventsProvider>
                </LeaveRequestProvider>
              </NotificationProvider>
            </RoleProvider>
          </UserProfileProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
