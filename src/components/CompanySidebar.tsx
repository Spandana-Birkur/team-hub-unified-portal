import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';
import { 
  Home, 
  Users, 
  UserCheck, 
  Headphones, 
  BookOpen, 
  Calendar,
  FileText,
  Settings,
  LogOut,
  ShieldCheck,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  UserPlus,
  FileSpreadsheet,
  Award,
  Megaphone,
  FolderOpen,
  Clock,
  TrendingUp,
  Laptop,
  History,
  Shield,
  BarChart3,
  Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const CompanySidebar = () => {
  const { userRole, logout, hasAccess } = useRole();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { to: '/employee', icon: Home, label: 'Employee Portal', roles: ['employee'] },
    { to: '/pay', icon: DollarSign, label: 'Pay', roles: ['employee', 'manager'] },
    { to: '/hr/employees', icon: Users, label: 'Employee Directory', roles: ['hr'] },
    { to: '/hr/leave', icon: Clock, label: 'Leave Management', roles: ['hr'] },
    { to: '/hr/performance', icon: Award, label: 'Performance Management', roles: ['hr'] },
    { to: '/hr/feedback', icon: FileSpreadsheet, label: 'Feedback Reports', roles: ['hr'] },
    { to: '/hr/announcements', icon: Megaphone, label: 'Announcements', roles: ['hr'] },
    { to: '/hr/documents', icon: FolderOpen, label: 'HR Documents', roles: ['hr'] },
    { to: '/hr/analytics', icon: BarChart3, label: 'Analytics', roles: ['hr'] },
    { to: '/hr/job-postings', icon: Briefcase, label: 'Job Postings', roles: ['hr', 'manager'] },
    { to: '/manager/leave', icon: Clock, label: 'Leave Management', roles: ['manager'] },
    { to: '/hr/manager-tools', icon: UserPlus, label: 'Manager Tools', roles: ['manager'] },
    { to: '/hr/communication', icon: Megaphone, label: 'Communication', roles: ['manager', 'employee'] },
    { to: '/ithelpdesk/tickets', icon: Headphones, label: 'Support Tickets', roles: ['employee', 'it'] },
    { to: '/ithelpdesk/escalation', icon: TrendingUp, label: 'SLA & Escalation', roles: ['it'] },
    { to: '/ithelpdesk/assignment', icon: Users, label: 'Team Assignment', roles: ['it'] },
    { to: '/ithelpdesk/assets', icon: Laptop, label: 'Asset Management', roles: ['it'] },
    { to: '/ithelpdesk/lifecycle', icon: History, label: 'Asset Lifecycle', roles: ['it'] },
    { to: '/ithelpdesk/knowledge', icon: Shield, label: 'Knowledge Base', roles: ['it'] },
    { to: '/training', icon: BookOpen, label: 'Training', roles: ['employee'] },
    { to: '/calendar', icon: Calendar, label: 'Calendar', roles: ['employee'] },
    { to: '/documents', icon: FileText, label: 'Documents', roles: ['employee'] },
    { to: '/job-postings', icon: Briefcase, label: 'Job Postings', roles: ['employee'] },
    { to: '/safety', icon: ShieldCheck, label: 'Employee Safety', roles: ['employee'] },
    { to: '/chatbot', icon: MessageCircle, label: 'AI Chatbot', roles: ['employee'] },
  ];

  const bottomNavItems = [
    { to: '/settings', icon: Settings, label: 'Settings', roles: ['employee', 'hr', 'manager', 'it'] },
  ];

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };
  const confirmLogout = () => {
    logout();
    setLogoutDialogOpen(false);
  };
  const cancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Update CSS custom property for main content margin
  React.useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '64px' : '256px');
  }, [isCollapsed]);

  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter(item => hasAccess(item.roles as any));
  const visibleBottomNavItems = bottomNavItems.filter(item => hasAccess(item.roles as any));

  return (
    <div 
      className={`fixed top-0 left-0 h-screen text-white flex flex-col transition-all duration-300 ease-in-out z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        background: 'var(--sidebar-bg, #1f2937)',
        color: 'var(--sidebar-text, #ffffff)'
      }}
    >
      {/* Header with Access logo */}
      <div className="p-4">
        {isCollapsed ? (
          <div className="flex flex-col items-center">
            <img 
              src="/accesslogo.png" 
              alt="Access Logo" 
              className="w-8 h-8 object-contain mb-2"
            />
            {userRole && (
              <div className="w-2 h-2 bg-blue-400 rounded-full" title={`${userRole} Access`}></div>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <img 
              src="/accesslogo.png" 
              alt="Access Logo" 
              className="w-8 h-8 object-contain flex-shrink-0"
            />
            <div>
              <h2 className="font-bold text-lg">Access Company Portal</h2>
              {userRole && (
                <p className="text-blue-400 text-xs capitalize">{userRole} Access</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-2 overflow-y-auto">
        <ul className="space-y-2">
          {visibleNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive 
                    ? 'var(--sidebar-active, rgba(37, 99, 235, 1))' 
                    : 'transparent'
                })}
                title={isCollapsed ? item.label : undefined}
                onMouseEnter={(e) => {
                  const target = e.currentTarget;
                  const isActive = target.classList.contains('active') || 
                                 target.getAttribute('aria-current') === 'page';
                  if (!isActive) {
                    target.style.backgroundColor = 'var(--sidebar-hover, rgba(55, 65, 81, 1))';
                  }
                }}
                onMouseLeave={(e) => {
                  const target = e.currentTarget;
                  const isActive = target.classList.contains('active') || 
                                 target.getAttribute('aria-current') === 'page';
                  if (!isActive) {
                    target.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
        
        <div className="mt-8 pt-8 border-t border-gray-700">
          <ul className="space-y-2">
            {visibleBottomNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
            <li>
              <Button
                onClick={handleLogout}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full ${isCollapsed ? '' : 'justify-start'} bg-transparent border-none`}
                title={isCollapsed ? 'Logout' : undefined}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span>Logout</span>}
              </Button>
            </li>
          </ul>
        </div>
      </nav>
      
      {/* Toggle button at bottom right - absolute inside sidebar for guaranteed visibility */}
      <div className="absolute bottom-16 right-2">
        <Button
          onClick={toggleSidebar}
          className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors shadow-lg"
          size="sm"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to log out?</p>
          <DialogFooter>
            <Button onClick={cancelLogout} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Cancel</Button>
            <Button onClick={confirmLogout} className="bg-red-600 text-white hover:bg-red-700">Log out</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompanySidebar;
