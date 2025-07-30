
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider, useRole } from "@/contexts/RoleContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { UserProfileProvider } from "@/contexts/UserProfileContext";
import { LeaveRequestProvider } from "@/contexts/LeaveRequestContext";
import { EventsProvider } from "@/contexts/EventsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import CompanyHeader from "./components/CompanyHeader";
import CompanySidebar from "./components/CompanySidebar";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeePortal from "./pages/EmployeePortal";
import Pay from "./pages/Pay";
import HRManagement from "./pages/HRManagement";
import Training from "./pages/Training";
import Calendar from "./pages/Calendar";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import LoginPage from "./components/LoginPage";
import Documents from "./pages/Documents";
import EmployeeSafetyConduct from "./pages/EmployeeSafetyConduct";
import Chatbot from "./pages/Chatbot";
import ITHelpdesk from './pages/ITHelpdesk';


const queryClient = new QueryClient();

const AppContent = () => {
  const { userRole, isLoggedIn } = useRole();

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  const getDefaultRoute = () => {
    switch (userRole) {
      case 'employee':
        return '/employee';
      case 'hr':
        return '/hr';
      case 'manager':
        return '/hr';
      case 'it':
        return '/ithelpdesk';
      default:
        return '/employee';
    }
  };

  // Role-based route restrictions
  const getAccessibleRoutes = () => {
    switch (userRole) {
      case 'hr':
        return ['/hr'];
      case 'it':
        return ['/ithelpdesk'];
      case 'employee':
        return ['/employee', '/pay', '/training', '/calendar', '/documents', '/safety', '/chatbot', '/ithelpdesk'];
      case 'manager':
        return ['/employee', '/pay', '/hr', '/training', '/calendar', '/documents', '/safety', '/chatbot', '/ithelpdesk'];
      default:
        return ['/employee'];
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'hsl(var(--background))' }}>
      <CompanyHeader />
      <div className="flex">
        <CompanySidebar />
        <main className="flex-1 transition-all duration-300 ease-in-out" style={{ 
          marginLeft: 'var(--sidebar-width, 256px)',
          backgroundColor: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))'
        }}>
          <Routes>
            <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
            <Route path="/employee" element={
              <ProtectedRoute requiredRoles={['employee', 'manager']}>
                <EmployeePortal />
              </ProtectedRoute>
            } />
            <Route path="/pay" element={
              <ProtectedRoute requiredRoles={['employee', 'manager']}>
                <Pay />
              </ProtectedRoute>
            } />
            <Route path="/hr" element={
              <ProtectedRoute requiredRoles={['hr', 'manager']}>
                <HRManagement />
              </ProtectedRoute>
            } />
            <Route path="/training" element={
              <ProtectedRoute requiredRoles={['employee', 'manager']}>
                <Training />
              </ProtectedRoute>
            } />
            <Route path="/calendar" element={
              <ProtectedRoute requiredRoles={['employee', 'manager']}>
                <Calendar />
              </ProtectedRoute>
            } />
            <Route path="/ithelpdesk" element={
              <ProtectedRoute requiredRoles={['employee', 'it', 'manager']}>
                <ITHelpdesk />
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
              <ProtectedRoute requiredRoles={['employee', 'manager']}>
                <Documents />
              </ProtectedRoute>
            } />
            <Route path="/safety" element={
              <ProtectedRoute requiredRoles={['employee', 'manager']}>
                <EmployeeSafetyConduct />
              </ProtectedRoute>
            } />
            <Route path="/chatbot" element={
              <ProtectedRoute requiredRoles={['employee', 'manager']}>
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
          <RoleProvider>
            <UserProfileProvider>
              <NotificationProvider>
                <LeaveRequestProvider>
                  <EventsProvider>
                    <AppContent />
                  </EventsProvider>
                </LeaveRequestProvider>
              </NotificationProvider>
            </UserProfileProvider>
          </RoleProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
