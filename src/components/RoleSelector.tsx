
import React, { useState } from 'react';
import { ChevronDown, Users, UserCheck, Shield, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useRole } from '@/contexts/RoleContext';
import { useNavigate } from 'react-router-dom';

const RoleSelector = () => {
  const { userRole, setUserRole } = useRole();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const roles = [
    {
      id: 'employee' as const,
      title: 'Employee Access',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'hr' as const,
      title: 'HR Access',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 'manager' as const,
      title: 'Manager Access',
      icon: Shield,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'it' as const,
      title: 'IT Access',
      icon: Headphones,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const currentRole = roles.find(role => role.id === userRole) || roles[0];

  const getDefaultRoute = (role: 'employee' | 'hr' | 'manager' | 'it') => {
    switch (role) {
      case 'employee':
        return '/employee';
      case 'hr':
        return '/hr/employees';
      case 'manager':
        return '/hr/employees';
      case 'it':
        return '/ithelpdesk/tickets';
      default:
        return '/employee';
    }
  };

  const handleRoleChange = (roleId: 'employee' | 'hr' | 'manager' | 'it') => {
    setUserRole(roleId);
    localStorage.setItem('userRole', roleId);
    setIsOpen(false);
    
    // Navigate to the default route for the new role
    const defaultRoute = getDefaultRoute(roleId);
    navigate(defaultRoute);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
        >
          <div className={`p-1 rounded ${currentRole.bgColor}`}>
            <currentRole.icon className={`w-4 h-4 ${currentRole.color}`} />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {currentRole.title}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.id}
            onClick={() => handleRoleChange(role.id)}
            className={`flex items-center space-x-3 px-3 py-2 cursor-pointer ${
              userRole === role.id ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}
          >
            <div className={`p-1 rounded ${role.bgColor}`}>
              <role.icon className={`w-4 h-4 ${role.color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {role.title}
              </span>
              <span className="text-xs text-gray-500">
                {role.id === 'hr' && 'HR Portal only'}
                {role.id === 'it' && 'IT Helpdesk only'}
                {role.id === 'employee' && 'Employee features + Ticketing'}
                {role.id === 'manager' && 'Full access'}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSelector;
