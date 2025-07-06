
import React from 'react';
import { NavLink } from 'react-router-dom';
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

const CompanySidebar = () => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/employee', icon: Users, label: 'Employee Portal' },
    { to: '/hr', icon: UserCheck, label: 'HR Management' },
    { to: '/helpdesk', icon: Headphones, label: 'IT Helpdesk' },
    { to: '/training', icon: BookOpen, label: 'Training' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/documents', icon: FileText, label: 'Documents' },
  ];

  const bottomNavItems = [
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/logout', icon: LogOut, label: 'Logout' },
  ];

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
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
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
            {bottomNavItems.map((item) => (
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
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default CompanySidebar;
