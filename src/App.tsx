
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CompanyHeader from "./components/CompanyHeader";
import CompanySidebar from "./components/CompanySidebar";
import Dashboard from "./pages/Dashboard";
import EmployeePortal from "./pages/EmployeePortal";
import HRManagement from "./pages/HRManagement";
import ITHelpdesk from "./pages/ITHelpdesk";
import Training from "./pages/Training";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <CompanyHeader />
          <div className="flex">
            <CompanySidebar />
            <main className="flex-1 overflow-x-hidden">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employee" element={<EmployeePortal />} />
                <Route path="/hr" element={<HRManagement />} />
                <Route path="/helpdesk" element={<ITHelpdesk />} />
                <Route path="/training" element={<Training />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
