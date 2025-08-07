
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUserProfile } from './UserProfileContext';

type UserRole = 'employee' | 'hr' | 'manager' | 'it' | null;

interface RoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
  isLoggedIn: boolean;
  logout: () => void;
  canAccessITStaff: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile } = useUserProfile();
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    const loginStatus = localStorage.getItem('isLoggedIn');
    
    if (savedRole && loginStatus === 'true') {
      setUserRoleState(savedRole);
      setIsLoggedIn(true);
    }
  }, []);

  // Save role to localStorage when it changes
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    setIsLoggedIn(true);
    if (role) {
      localStorage.setItem('userRole', role);
      localStorage.setItem('isLoggedIn', 'true');
    }
  };

  const logout = () => {
    setUserRoleState(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    localStorage.setItem('skipLanding', 'true');
    window.location.href = '/';
  };

  const hasAccess = (requiredRoles: UserRole[]) => {
    if (!userRole) return false;

    // Check if the currently selected role has access
    if (requiredRoles.includes(userRole)) {
      return true;
    }

    // Fallback to profile-based access if direct role check fails
    if (profile) {
      if (profile.role === 'Admin') {
        return true;
      }
      
      if (profile.role === 'Manager') {
        const managerRoles: UserRole[] = ['manager', 'employee'];
        if (profile.department === 'HR') managerRoles.push('hr');
        if (profile.department === 'IT') managerRoles.push('it');
        return requiredRoles.some(role => managerRoles.includes(role));
      }

      // Default employee access based on department
      const employeeRoles: UserRole[] = ['employee'];
      if (profile.department === 'HR') employeeRoles.push('hr');
      if (profile.department === 'IT') employeeRoles.push('it');
      return requiredRoles.some(role => employeeRoles.includes(role));
    }

    return false;
  };
  
  // Check if user can access IT staff interface
  const canAccessITStaff = userRole === 'it' || userRole === 'manager' || (profile && profile.role === 'Admin');

  return (
    <RoleContext.Provider value={{ 
      userRole, 
      setUserRole, 
      hasAccess, 
      isLoggedIn, 
      logout, 
      canAccessITStaff 
    }}>
      {children}
    </RoleContext.Provider>
  );
};
