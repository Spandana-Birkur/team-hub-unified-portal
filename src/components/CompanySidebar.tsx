
import React from 'react';
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
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';

const CompanySidebar = () => {
  const { userRole, logout, hasAccess } = useRole();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard', roles: ['employee', 'hr', 'manager', 'it'] },
    { to: '/employee', icon: Users, label: 'Employee Portal', roles: ['employee', 'hr', 'manager'] },
    { to: '/hr', icon: UserCheck, label: 'HR Management', roles: ['hr', 'manager'] },
    { to: '/helpdesk', icon: Headphones, label: 'IT Helpdesk', roles: ['employee', 'hr', 'manager', 'it'] },
    { to: '/training', icon: BookOpen, label: 'Training', roles: ['employee', 'hr', 'manager'] },
    { to: '/calendar', icon: Calendar, label: 'Calendar', roles: ['employee', 'hr', 'manager', 'it'] },
    { to: '/documents', icon: FileText, label: 'Documents', roles: ['employee', 'hr', 'manager', 'it'] },
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

  // Filter navigation items based on user role
  const visibleNavItems = navItems.filter(item => hasAccess(item.roles as any));
  const visibleBottomNavItems = bottomNavItems.filter(item => hasAccess(item.roles as any));

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">CP</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Company Portal</h2>
            <p className="text-gray-400 text-sm">Acme Corporation</p>
            {userRole && (
              <p className="text-blue-400 text-xs capitalize">{userRole} Access</p>
            )}
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {visibleNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
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
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
            <li>
              <Button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full justify-start bg-transparent border-none"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </Button>
            </li>
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
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default CompanySidebar;
