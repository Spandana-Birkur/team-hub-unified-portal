
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
        return '/employee';
      default:
        return '/employee';
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
            <Route path="/employee" element={<EmployeePortal />} />
            <Route path="/pay" element={<Pay />} />
            <Route path="/hr" element={<HRManagement />} />
            <Route path="/training" element={<Training />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/ithelpdesk" element={<ITHelpdesk />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/safety" element={<EmployeeSafetyConduct />} />
            <Route path="/chatbot" element={<Chatbot />} />
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
