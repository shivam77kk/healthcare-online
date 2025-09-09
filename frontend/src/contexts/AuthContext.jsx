import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { getUser, getUserRole, isAuthenticated, isTokenExpired } from '../utils/storage';

// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsAuthenticating(true);
        
        // Check if user is stored locally and token is not expired
        const storedUser = getUser();
        const storedRole = getUserRole();
        const authenticated = isAuthenticated();
        const tokenExpired = isTokenExpired();

        if (authenticated && !tokenExpired && storedUser && storedRole) {
          // Verify with server
          const verification = await authService.verifyAuth(storedRole);
          
          if (verification.success && verification.isAuthenticated) {
            setUser(verification.user);
            setUserRole(verification.user.role);
            setIsLoggedIn(true);
          } else {
            // Server verification failed, clear local data
            await logout();
          }
        } else {
          // Token expired or no local data, clear everything
          await logout();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await logout();
      } finally {
        setIsAuthenticating(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setIsAuthenticating(true);
      const response = await authService.login(credentials);
      
      if (response.success) {
        setUser(response.user);
        setUserRole(response.role);
        setIsLoggedIn(true);
        
        return {
          success: true,
          user: response.user,
          role: response.role,
        };
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      setIsLoggedIn(false);
      setUser(null);
      setUserRole(null);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Register Patient function
  const registerPatient = async (patientData) => {
    try {
      const response = await authService.registerPatient(patientData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Register Admin function (requires admin role)
  const registerAdmin = async (adminData) => {
    try {
      const response = await authService.registerAdmin(adminData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Register Doctor function (requires admin role)
  const registerDoctor = async (doctorData) => {
    try {
      const response = await authService.registerDoctor(doctorData);
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authService.logout(userRole);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setUserRole(null);
      setIsLoggedIn(false);
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    try {
      if (userRole) {
        const response = userRole === 'Admin' 
          ? await authService.getAdminProfile()
          : await authService.getPatientProfile();
          
        if (response.success) {
          setUser(response.user);
          return response.user;
        }
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
      throw error;
    }
  };

  // Check if user has specific role
  const hasRole = (requiredRole) => {
    return userRole === requiredRole;
  };

  // Check if user is admin
  const isAdmin = () => {
    return userRole === 'Admin';
  };

  // Check if user is patient
  const isPatient = () => {
    return userRole === 'Patient';
  };

  // Context value
  const value = {
    // State
    user,
    userRole,
    isLoggedIn,
    isAuthenticating,
    
    // Actions
    login,
    logout,
    registerPatient,
    registerAdmin,
    registerDoctor,
    refreshUserData,
    
    // Utilities
    hasRole,
    isAdmin,
    isPatient,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext;
