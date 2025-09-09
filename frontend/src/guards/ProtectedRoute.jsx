import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  allowedRoles = [], 
  redirectTo = '/login',
  fallback = null 
}) => {
  const { isLoggedIn, isAuthenticating, userRole, hasRole } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (isAuthenticating) {
    return fallback || <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // Check role-based access
  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect based on user's actual role
    const dashboardPath = userRole === 'Admin' ? '/admin/dashboard' : '/patient/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  // Check multiple allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    const dashboardPath = userRole === 'Admin' ? '/admin/dashboard' : '/patient/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  // User is authenticated and has proper role
  return children;
};

// Admin Only Route
export const AdminRoute = ({ children, fallback = null }) => (
  <ProtectedRoute 
    requiredRole="Admin" 
    redirectTo="/admin/login"
    fallback={fallback}
  >
    {children}
  </ProtectedRoute>
);

// Patient Only Route
export const PatientRoute = ({ children, fallback = null }) => (
  <ProtectedRoute 
    requiredRole="Patient" 
    redirectTo="/login"
    fallback={fallback}
  >
    {children}
  </ProtectedRoute>
);

// Route accessible by both Admin and Patient
export const AuthenticatedRoute = ({ children, fallback = null }) => (
  <ProtectedRoute 
    allowedRoles={['Admin', 'Patient']}
    fallback={fallback}
  >
    {children}
  </ProtectedRoute>
);

// Public Route (redirects authenticated users to their dashboard)
export const PublicRoute = ({ children }) => {
  const { isLoggedIn, isAuthenticating, userRole } = useAuth();

  if (isAuthenticating) {
    return <LoadingSpinner />;
  }

  if (isLoggedIn) {
    const dashboardPath = userRole === 'Admin' ? '/admin/dashboard' : '/patient/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

// Role-based redirect component
export const RoleBasedRedirect = () => {
  const { isLoggedIn, isAuthenticating, userRole } = useAuth();

  if (isAuthenticating) {
    return <LoadingSpinner />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const dashboardPath = userRole === 'Admin' ? '/admin/dashboard' : '/patient/dashboard';
  return <Navigate to={dashboardPath} replace />;
};

export default ProtectedRoute;
