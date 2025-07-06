
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'employee' | 'hr' | 'manager' | 'it' | null;

interface RoleContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  hasAccess: (requiredRoles: UserRole[]) => boolean;
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
  const [userRole, setUserRoleState] = useState<UserRole>(null);

  // Load role from localStorage on mount
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole') as UserRole;
    if (savedRole) {
      setUserRoleState(savedRole);
    }
  }, []);

  // Save role to localStorage when it changes
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  };

  const hasAccess = (requiredRoles: UserRole[]) => {
    return userRole ? requiredRoles.includes(userRole) : false;
  };

  return (
    <RoleContext.Provider value={{ userRole, setUserRole, hasAccess }}>
      {children}
    </RoleContext.Provider>
  );
};
