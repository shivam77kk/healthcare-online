import { api } from './api';
import { setToken, setUser, setUserRole, clearAuthData, getUserRole } from '../utils/storage';

// Authentication endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/user/login',
  PATIENT_REGISTER: '/user/patient/register',
  ADMIN_REGISTER: '/user/admin/addnew',
  DOCTOR_REGISTER: '/user/doctor/addnew',
  PATIENT_PROFILE: '/user/patient/me',
  ADMIN_PROFILE: '/user/admin/me',
  PATIENT_LOGOUT: '/user/patient/logout',
  ADMIN_LOGOUT: '/user/admin/logout',
  DOCTORS: '/user/doctors',
};

export const authService = {
  // User login (both admin and patient)
  login: async (credentials) => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.LOGIN, credentials);
      
      if (response.success && response.user) {
        // Store token if provided
        if (response.token) {
          setToken(response.token);
        }
        
        // Store user data and role
        setUser(response.user);
        setUserRole(response.user.role);
        
        return {
          success: true,
          user: response.user,
          token: response.token,
          role: response.user.role,
        };
      }
      
      throw new Error(response.message || 'Login failed');
    } catch (error) {
      throw {
        message: error.message || 'Login failed',
        type: error.type || 'LOGIN_ERROR'
      };
    }
  },

  // Patient registration
  registerPatient: async (patientData) => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.PATIENT_REGISTER, patientData);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Registration successful',
          user: response.user,
        };
      }
      
      throw new Error(response.message || 'Registration failed');
    } catch (error) {
      throw {
        message: error.message || 'Registration failed',
        type: error.type || 'REGISTRATION_ERROR'
      };
    }
  },

  // Admin registration (requires admin authentication)
  registerAdmin: async (adminData) => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.ADMIN_REGISTER, adminData);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Admin registered successfully',
          user: response.user,
        };
      }
      
      throw new Error(response.message || 'Admin registration failed');
    } catch (error) {
      throw {
        message: error.message || 'Admin registration failed',
        type: error.type || 'ADMIN_REGISTRATION_ERROR'
      };
    }
  },

  // Doctor registration (requires admin authentication)
  registerDoctor: async (doctorData) => {
    try {
      const response = await api.post(AUTH_ENDPOINTS.DOCTOR_REGISTER, doctorData);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Doctor registered successfully',
          doctor: response.doctor,
        };
      }
      
      throw new Error(response.message || 'Doctor registration failed');
    } catch (error) {
      throw {
        message: error.message || 'Doctor registration failed',
        type: error.type || 'DOCTOR_REGISTRATION_ERROR'
      };
    }
  },

  // Get current user profile (patient)
  getPatientProfile: async () => {
    try {
      const response = await api.get(AUTH_ENDPOINTS.PATIENT_PROFILE);
      
      if (response.success && response.user) {
        // Update stored user data
        setUser(response.user);
        return {
          success: true,
          user: response.user,
        };
      }
      
      throw new Error(response.message || 'Failed to fetch profile');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch profile',
        type: error.type || 'PROFILE_ERROR'
      };
    }
  },

  // Get current user profile (admin)
  getAdminProfile: async () => {
    try {
      const response = await api.get(AUTH_ENDPOINTS.ADMIN_PROFILE);
      
      if (response.success && response.user) {
        // Update stored user data
        setUser(response.user);
        return {
          success: true,
          user: response.user,
        };
      }
      
      throw new Error(response.message || 'Failed to fetch profile');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch profile',
        type: error.type || 'PROFILE_ERROR'
      };
    }
  },

  // Get all doctors
  getAllDoctors: async () => {
    try {
      const response = await api.get(AUTH_ENDPOINTS.DOCTORS);
      
      if (response.success) {
        return {
          success: true,
          doctors: response.doctors || [],
        };
      }
      
      throw new Error(response.message || 'Failed to fetch doctors');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch doctors',
        type: error.type || 'DOCTORS_ERROR'
      };
    }
  },

  // Patient logout
  logoutPatient: async () => {
    try {
      await api.get(AUTH_ENDPOINTS.PATIENT_LOGOUT);
      clearAuthData();
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      // Clear local data even if server logout fails
      clearAuthData();
      return { success: true, message: 'Logged out successfully' };
    }
  },

  // Admin logout
  logoutAdmin: async () => {
    try {
      await api.get(AUTH_ENDPOINTS.ADMIN_LOGOUT);
      clearAuthData();
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      // Clear local data even if server logout fails
      clearAuthData();
      return { success: true, message: 'Logged out successfully' };
    }
  },

  // Generic logout (detects role and calls appropriate logout)
  logout: async (userRole = null) => {
    const role = userRole || getUserRole();
    
    if (role === 'Admin') {
      return await authService.logoutAdmin();
    } else if (role === 'Patient') {
      return await authService.logoutPatient();
    }
    
    // Fallback: clear local data
    clearAuthData();
    return { success: true, message: 'Logged out successfully' };
  },

  // Verify current authentication status
  verifyAuth: async (userRole) => {
    try {
      const endpoint = userRole === 'Admin' 
        ? AUTH_ENDPOINTS.ADMIN_PROFILE 
        : AUTH_ENDPOINTS.PATIENT_PROFILE;
        
      const response = await api.get(endpoint);
      
      if (response.success && response.user) {
        setUser(response.user);
        setUserRole(response.user.role);
        return {
          success: true,
          user: response.user,
          isAuthenticated: true,
        };
      }
      
      return { success: false, isAuthenticated: false };
    } catch (error) {
      clearAuthData();
      return { success: false, isAuthenticated: false };
    }
  },
};

export default authService;
