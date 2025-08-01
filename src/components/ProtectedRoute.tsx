import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '@/contexts/RoleContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ('employee' | 'hr' | 'manager' | 'it')[];
  fallbackRoute?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = ['employee', 'hr', 'manager', 'it'],
  fallbackRoute = '/employee'
}) => {
  const { userRole, hasAccess } = useRole();

  // If no role is set, redirect to login
  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  // Check if user has access to this route
  if (!hasAccess(requiredRoles)) {
    // Redirect to appropriate default route based on role
    let redirectRoute = fallbackRoute;
    
    switch (userRole) {
      case 'hr':
        redirectRoute = '/hr';
        break;
      case 'it':
        redirectRoute = '/ithelpdesk';
        break;
      case 'employee':
        redirectRoute = '/employee';
        break;
      case 'manager':
        redirectRoute = '/pay';
        break;
      default:
        redirectRoute = '/employee';
    }
    
    return <Navigate to={redirectRoute} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 