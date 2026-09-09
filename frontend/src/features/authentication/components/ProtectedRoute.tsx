import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/role-selection" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect authenticated user to their own role-specific dashboard
    if (role === 'expert') {
      return <Navigate to="/expert/dashboard" replace />;
    }
    if (role === 'buyer') {
      return <Navigate to="/buyer/dashboard" replace />;
    }
    return <Navigate to="/farmer/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
