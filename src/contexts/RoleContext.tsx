
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
    return requiredRoles.includes(userRole);
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
