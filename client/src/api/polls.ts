import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Polls API
 * TODO: Implement all polls-related endpoints
 */
export const pollsAPI = {
  /**
   * Get all polls (paginated)
   * TODO: GET /polls with pagination params
   */
  getPolls: async (page: number = 1, limit: number = 10) => {
    try {
      // TODO: const response = axios.get(`${API_URL}/polls`, { params: { page, limit } })
      return { message: 'Get polls API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new poll
   * TODO: POST /polls with title, description, options
   * TODO: Only STUDENT_COUNCIL can create
   */
  createPoll: async (title: string, description: string | null, options: string[]) => {
    try {
      // TODO: Get JWT token from localStorage
      // TODO: const response = axios.post(`${API_URL}/polls`, { title, description, options }, { headers: { Authorization: `Bearer ${token}` } })
      return { message: 'Create poll API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Vote on a poll
   * TODO: POST /polls/:id/vote with optionId
   */
  voteOnPoll: async (pollId: string, optionId: string) => {
    try {
      // TODO: const response = axios.post(`${API_URL}/polls/${pollId}/vote`, { optionId })
      return { message: 'Vote on poll API' };
    } catch (error) {
      throw error;
    }
  },
};
