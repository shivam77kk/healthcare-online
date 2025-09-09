import { api } from './api';

// Appointment and Message endpoints
const APPOINTMENT_ENDPOINTS = {
  APPOINTMENTS: '/appointment',
  CREATE_APPOINTMENT: '/appointment/post',
  UPDATE_APPOINTMENT: '/appointment/update',
  DELETE_APPOINTMENT: '/appointment/delete',
  MESSAGES: '/message',
  SEND_MESSAGE: '/message/send',
};

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async () => {
    try {
      const response = await api.get(APPOINTMENT_ENDPOINTS.APPOINTMENTS);
      
      if (response.success) {
        return {
          success: true,
          appointments: response.appointments || response.data || [],
          message: response.message,
        };
      }
      
      throw new Error(response.message || 'Failed to fetch appointments');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch appointments',
        type: error.type || 'APPOINTMENTS_ERROR'
      };
    }
  },

  // Create a new appointment
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post(APPOINTMENT_ENDPOINTS.CREATE_APPOINTMENT, appointmentData);
      
      if (response.success) {
        return {
          success: true,
          appointment: response.appointment || response.data,
          message: response.message || 'Appointment created successfully',
        };
      }
      
      throw new Error(response.message || 'Failed to create appointment');
    } catch (error) {
      throw {
        message: error.message || 'Failed to create appointment',
        type: error.type || 'CREATE_APPOINTMENT_ERROR'
      };
    }
  },

  // Update appointment status (admin only)
  updateAppointmentStatus: async (appointmentId, status) => {
    try {
      const response = await api.put(
        `${APPOINTMENT_ENDPOINTS.UPDATE_APPOINTMENT}/${appointmentId}`,
        { status }
      );
      
      if (response.success) {
        return {
          success: true,
          appointment: response.appointment || response.data,
          message: response.message || 'Appointment updated successfully',
        };
      }
      
      throw new Error(response.message || 'Failed to update appointment');
    } catch (error) {
      throw {
        message: error.message || 'Failed to update appointment',
        type: error.type || 'UPDATE_APPOINTMENT_ERROR'
      };
    }
  },

  // Delete appointment (admin only)
  deleteAppointment: async (appointmentId) => {
    try {
      const response = await api.delete(`${APPOINTMENT_ENDPOINTS.DELETE_APPOINTMENT}/${appointmentId}`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Appointment deleted successfully',
        };
      }
      
      throw new Error(response.message || 'Failed to delete appointment');
    } catch (error) {
      throw {
        message: error.message || 'Failed to delete appointment',
        type: error.type || 'DELETE_APPOINTMENT_ERROR'
      };
    }
  },

  // Get patient's appointments
  getPatientAppointments: async (patientId = null) => {
    try {
      const endpoint = patientId 
        ? `${APPOINTMENT_ENDPOINTS.APPOINTMENTS}?patientId=${patientId}`
        : `${APPOINTMENT_ENDPOINTS.APPOINTMENTS}/patient`;
        
      const response = await api.get(endpoint);
      
      if (response.success) {
        return {
          success: true,
          appointments: response.appointments || response.data || [],
          message: response.message,
        };
      }
      
      throw new Error(response.message || 'Failed to fetch patient appointments');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch patient appointments',
        type: error.type || 'PATIENT_APPOINTMENTS_ERROR'
      };
    }
  },

  // Get doctor's appointments
  getDoctorAppointments: async (doctorId) => {
    try {
      const endpoint = `${APPOINTMENT_ENDPOINTS.APPOINTMENTS}?doctorId=${doctorId}`;
      const response = await api.get(endpoint);
      
      if (response.success) {
        return {
          success: true,
          appointments: response.appointments || response.data || [],
          message: response.message,
        };
      }
      
      throw new Error(response.message || 'Failed to fetch doctor appointments');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch doctor appointments',
        type: error.type || 'DOCTOR_APPOINTMENTS_ERROR'
      };
    }
  },
};

export const messageService = {
  // Get all messages (admin view)
  getAllMessages: async () => {
    try {
      const response = await api.get(APPOINTMENT_ENDPOINTS.MESSAGES);
      
      if (response.success) {
        return {
          success: true,
          messages: response.messages || response.data || [],
          message: response.message,
        };
      }
      
      throw new Error(response.message || 'Failed to fetch messages');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch messages',
        type: error.type || 'MESSAGES_ERROR'
      };
    }
  },

  // Send a message/contact form
  sendMessage: async (messageData) => {
    try {
      const response = await api.post(APPOINTMENT_ENDPOINTS.SEND_MESSAGE, messageData);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Message sent successfully',
          data: response.data,
        };
      }
      
      throw new Error(response.message || 'Failed to send message');
    } catch (error) {
      throw {
        message: error.message || 'Failed to send message',
        type: error.type || 'SEND_MESSAGE_ERROR'
      };
    }
  },

  // Get patient's messages
  getPatientMessages: async () => {
    try {
      const endpoint = `${APPOINTMENT_ENDPOINTS.MESSAGES}/patient`;
      const response = await api.get(endpoint);
      
      if (response.success) {
        return {
          success: true,
          messages: response.messages || response.data || [],
          message: response.message,
        };
      }
      
      throw new Error(response.message || 'Failed to fetch patient messages');
    } catch (error) {
      throw {
        message: error.message || 'Failed to fetch patient messages',
        type: error.type || 'PATIENT_MESSAGES_ERROR'
      };
    }
  },

  // Mark message as read (admin)
  markMessageAsRead: async (messageId) => {
    try {
      const response = await api.put(`${APPOINTMENT_ENDPOINTS.MESSAGES}/${messageId}/read`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Message marked as read',
        };
      }
      
      throw new Error(response.message || 'Failed to mark message as read');
    } catch (error) {
      throw {
        message: error.message || 'Failed to mark message as read',
        type: error.type || 'MARK_MESSAGE_READ_ERROR'
      };
    }
  },

  // Delete message (admin)
  deleteMessage: async (messageId) => {
    try {
      const response = await api.delete(`${APPOINTMENT_ENDPOINTS.MESSAGES}/${messageId}`);
      
      if (response.success) {
        return {
          success: true,
          message: response.message || 'Message deleted successfully',
        };
      }
      
      throw new Error(response.message || 'Failed to delete message');
    } catch (error) {
      throw {
        message: error.message || 'Failed to delete message',
        type: error.type || 'DELETE_MESSAGE_ERROR'
      };
    }
  },
};

// Combined export
export const communicationService = {
  ...appointmentService,
  ...messageService,
};

export default communicationService;
