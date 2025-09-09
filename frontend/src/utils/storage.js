// Storage utilities for handling JWT tokens and user data
const TOKEN_KEY = 'healthcare_token';
const USER_KEY = 'healthcare_user';
const ROLE_KEY = 'healthcare_user_role';

// Token management
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error setting token:', error);
  }
};

export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// User data management
export const getUser = () => {
  try {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const setUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
  } catch (error) {
    console.error('Error setting user:', error);
  }
};

export const removeUser = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error('Error removing user:', error);
  }
};

// User role management
export const getUserRole = () => {
  try {
    return localStorage.getItem(ROLE_KEY);
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const setUserRole = (role) => {
  try {
    if (role) {
      localStorage.setItem(ROLE_KEY, role);
    }
  } catch (error) {
    console.error('Error setting user role:', error);
  }
};

export const removeUserRole = () => {
  try {
    localStorage.removeItem(ROLE_KEY);
  } catch (error) {
    console.error('Error removing user role:', error);
  }
};

// Clear all auth data
export const clearAuthData = () => {
  removeToken();
  removeUser();
  removeUserRole();
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  return !!(token && user);
};

// Check user role
export const hasRole = (requiredRole) => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

// Parse JWT token to get expiration
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};
