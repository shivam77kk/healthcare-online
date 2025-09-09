// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Authentication
export const AUTH_CONFIG = {
  TOKEN_KEY: 'healthcare_token',
  USER_KEY: 'healthcare_user',
  ROLE_KEY: 'healthcare_user_role',
  REFRESH_THRESHOLD: 5 * 60 * 1000, // Refresh token 5 minutes before expiry
};

// Routes
export const ROUTES = {
  // Public routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Patient routes
  PATIENT_DASHBOARD: '/patient/dashboard',
  PATIENT_PROFILE: '/patient/profile',
  PATIENT_APPOINTMENTS: '/patient/appointments',
  PATIENT_HEALTH_LOGS: '/patient/health-logs',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_DOCTORS: '/admin/doctors',
  ADMIN_PATIENTS: '/admin/patients',
  ADMIN_APPOINTMENTS: '/admin/appointments',
  ADMIN_MESSAGES: '/admin/messages',
};

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/user/login',
    PATIENT_REGISTER: '/user/patient/register',
    ADMIN_REGISTER: '/user/admin/addnew',
    DOCTOR_REGISTER: '/user/doctor/addnew',
    PATIENT_PROFILE: '/user/patient/me',
    ADMIN_PROFILE: '/user/admin/me',
    PATIENT_LOGOUT: '/user/patient/logout',
    ADMIN_LOGOUT: '/user/admin/logout',
    DOCTORS: '/user/doctors',
    REFRESH_TOKEN: '/auth/refresh',
  },
  
  // Appointments
  APPOINTMENTS: {
    BASE: '/appointment',
    CREATE: '/appointment/post',
    UPDATE: '/appointment/update',
    DELETE: '/appointment/delete',
  },
  
  // Messages
  MESSAGES: {
    BASE: '/message',
    SEND: '/message/send',
  },
  
  // Health Logs (if you plan to add these)
  HEALTH_LOGS: {
    BASE: '/healthlogs',
    CREATE: '/healthlogs/create',
    UPDATE: '/healthlogs/update',
    DELETE: '/healthlogs/delete',
    ANALYTICS: '/healthlogs/analytics',
  },
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

// Departments
export const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Pediatrics',
  'General Medicine',
  'Dermatology',
  'Gynecology',
  'Psychiatry',
  'Radiology',
  'Emergency Medicine',
];

// Gender Options
export const GENDER_OPTIONS = [
  'Male',
  'Female',
  'Other',
];

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
  NIC_REGEX: /^[0-9]{9}[vVxX]|[0-9]{12}$/,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'An error occurred on the server. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logged out successfully',
  REGISTRATION_SUCCESS: 'Registration successful',
  APPOINTMENT_CREATED: 'Appointment booked successfully',
  APPOINTMENT_UPDATED: 'Appointment updated successfully',
  APPOINTMENT_CANCELLED: 'Appointment cancelled successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  MESSAGE_SENT: 'Message sent successfully',
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: AUTH_CONFIG.TOKEN_KEY,
  USER: AUTH_CONFIG.USER_KEY,
  ROLE: AUTH_CONFIG.ROLE_KEY,
  THEME: 'healthcare_theme',
  LANGUAGE: 'healthcare_language',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy hh:mm a',
  TIME: 'hh:mm a',
};

// Environment
export const ENV = {
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
};

export default {
  API_CONFIG,
  AUTH_CONFIG,
  ROUTES,
  ENDPOINTS,
  USER_ROLES,
  APPOINTMENT_STATUS,
  DEPARTMENTS,
  GENDER_OPTIONS,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  PAGINATION,
  DATE_FORMATS,
  ENV,
};
