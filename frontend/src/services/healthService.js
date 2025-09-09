import { api } from './api';

// Health-related endpoints (you'll need to add these to your backend)
const HEALTH_ENDPOINTS = {
  HEALTH_LOGS: '/healthlogs',
  PATIENT_HEALTH_LOGS: '/patient/healthlogs',
  CREATE_HEALTH_LOG: '/healthlogs/create',
  UPDATE_HEALTH_LOG: '/healthlogs/update',
  DELETE_HEALTH_LOG: '/healthlogs/delete',
};

export const healthService = {
  // Get all health logs for current patient
  getPatientHealthLogs: async (patientId = null) => {
    try {
      const endpoint = patientId 
        ? `${HEALTH_ENDPOINTS.HEALTH_LOGS}?patientId=${patientId}`
        : HEALTH_ENDPOINTS.PATIENT_HEALTH_LOGS;
        
      const response = await api.get(endpoint);
      
      if (response.success) {
        return {
          success: true,
          healthLogs: response.healthLogs || response.data || [],
          message: response.message,
        };
      }
      
      throw new Error(response.message || 'Failed to fetch health logs');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch health logs',
        type: error.type || 'HEALTH_LOGS_ERROR'
      };
    }
  },

  // Get all health logs (admin view)
  getAllHealthLogs: async () => {
    try {
      const response = await api.get(HEALTH_ENDPOINTS.HEALTH_LOGS);
      
      if (response.success) {
        return {
          success: true,
          healthLogs: response.healthLogs || response.data || [],
          message: response.message,
        };
      }
      
      throw new Error(response.message || 'Failed to fetch health logs');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch health logs',
        type: error.type || 'HEALTH_LOGS_ERROR'
      };
    }
  },

  // Create a new health log entry
  createHealthLog: async (healthLogData) => {
    try {
      const response = await api.post(HEALTH_ENDPOINTS.CREATE_HEALTH_LOG, healthLogData);
      
      if (response.success) {
        return {
          success: true,
          healthLog: response.healthLog || response.data,
          message: response.message || 'Health log created successfully',
        };
      }
      
      throw new Error(response.message || 'Failed to create health log');
    } catch (error) {
      throw {
        message: error.message || 'Failed to create health log',
        type: error.type || 'CREATE_HEALTH_LOG_ERROR'
      };
    }
  },

  // Update an existing health log entry
  updateHealthLog: async (healthLogId, updateData) => {
    try {
      const response = await api.put(
        `${HEALTH_ENDPOINTS.UPDATE_HEALTH_LOG}/${healthLogId}`,
        updateData
      );
      
      if (response.success) {
        return {
          success: true,
          healthLog: response.healthLog || response.data,
          message: response.message || 'Health log updated successfully',
        };
      }
      
      throw new Error(response.message || 'Failed to update health log');
    } catch (error) {
      throw {
        message: error.message || 'Failed to update health log',
        type: error.type || 'UPDATE_HEALTH_LOG_ERROR'
      };
    }
  },

  // Delete a health log entry
  deleteHealthLog: async (healthLogId) => {
    try {
      const response = await api.delete(`${HEALTH_ENDPOINTS.DELETE_HEALTH_LOG}/${healthLogId}`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Health log deleted successfully',
        };
      }
      
      throw new Error(response.message || 'Failed to delete health log');
    } catch (error) {
      throw {
        message: error.message || 'Failed to delete health log',
        type: error.type || 'DELETE_HEALTH_LOG_ERROR'
      };
    }
  },

  // Get health analytics/summary for a patient
  getHealthAnalytics: async (patientId = null, timeRange = '30days') => {
    try {
      const params = new URLSearchParams();
      if (patientId) params.append('patientId', patientId);
      params.append('timeRange', timeRange);
      
      const endpoint = `/healthlogs/analytics?${params.toString()}`;
      const response = await api.get(endpoint);
      
      if (response.success) {
        return {
          success: true,
          analytics: response.analytics || response.data,
          message: response.message,
        };
      }
      
      throw new Error(response.message || 'Failed to fetch health analytics');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch health analytics',
        type: error.type || 'HEALTH_ANALYTICS_ERROR'
      };
    }
  },

  // Search health logs with filters
  searchHealthLogs: async (searchParams = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const endpoint = `${HEALTH_ENDPOINTS.HEALTH_LOGS}/search?${params.toString()}`;
      const response = await api.get(endpoint);
      
      if (response.success) {
        return {
          success: true,
          healthLogs: response.healthLogs || response.data || [],
          totalCount: response.totalCount || 0,
          message: response.message,
        };
      }
      
      throw new Error(response.message || 'Failed to search health logs');
    } catch (error) {
      throw {
        message: error.message || 'Failed to search health logs',
        type: error.type || 'SEARCH_HEALTH_LOGS_ERROR'
      };
    }
  },
};

export default healthService;
