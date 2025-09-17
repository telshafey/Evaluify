import React from 'react';
// Fix: Corrected react-router-dom import syntax.
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext.tsx';
// Fix: Added import for UserRole.
import { UserRole } from '../../types.ts';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (!isAuthenticated) {
    // If not authenticated, redirect to the landing page
    return <Navigate to="/" replace />;
  }

  const isAuthorized = userRole && allowedRoles.includes(userRole);

  if (!isAuthorized) {
    // If authenticated but not authorized for this route,
    // redirect to their default page. The root path '/'
    // will handle redirecting to their specific dashboard.
    return <Navigate to="/" replace />;
  }
  
  // If authenticated and authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;