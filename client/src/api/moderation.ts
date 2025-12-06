import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Moderation API
 * TODO: Implement all moderation-related endpoints
 * TODO: Only MODERATOR can access
 */
export const moderationAPI = {
  /**
   * Mute a user
   * TODO: POST /moderation/mute with userId, duration
   */
  muteUser: async (userId: string, duration: number) => {
    try {
      // TODO: Get JWT token from localStorage
      // TODO: const response = axios.post(`${API_URL}/moderation/mute`, { userId, duration }, { headers: { Authorization: `Bearer ${token}` } })
      return { message: 'Mute user API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Warn a user
   * TODO: POST /moderation/warn with userId, reason
   */
  warnUser: async (userId: string, reason: string) => {
    try {
      // TODO: const response = axios.post(`${API_URL}/moderation/warn`, { userId, reason })
      return { message: 'Warn user API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Ban a user
   * TODO: POST /moderation/ban with userId, reason
   */
  banUser: async (userId: string, reason: string) => {
    try {
      // TODO: const response = axios.post(`${API_URL}/moderation/ban`, { userId, reason })
      return { message: 'Ban user API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Review a report
   * TODO: POST /moderation/review with reportId, action
   */
  reviewReport: async (reportId: string, action: string) => {
    try {
      // TODO: const response = axios.post(`${API_URL}/moderation/review`, { reportId, action })
      return { message: 'Review report API' };
    } catch (error) {
      throw error;
    }
  },
};
