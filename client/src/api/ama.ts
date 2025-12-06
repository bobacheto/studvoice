import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * AMA API
 * TODO: Implement all AMA-related endpoints
 */
export const amaAPI = {
  /**
   * Get all AMA sessions (paginated)
   * TODO: GET /ama with pagination params
   */
  getAMASessions: async (page: number = 1, limit: number = 10) => {
    try {
      // TODO: const response = axios.get(`${API_URL}/ama`, { params: { page, limit } })
      return { message: 'Get AMA sessions API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new AMA session
   * TODO: POST /ama with title, description, startTime, endTime
   * TODO: Only STUDENT_COUNCIL can create
   */
  createAMASession: async (
    title: string,
    description: string | null,
    startTime: Date,
    endTime: Date
  ) => {
    try {
      // TODO: Get JWT token from localStorage
      // TODO: const response = axios.post(`${API_URL}/ama`, { title, description, startTime, endTime }, { headers: { Authorization: `Bearer ${token}` } })
      return { message: 'Create AMA session API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Submit a question to AMA
   * TODO: POST /ama/:id/question with question text
   */
  submitQuestion: async (amaId: string, question: string) => {
    try {
      // TODO: const response = axios.post(`${API_URL}/ama/${amaId}/question`, { question })
      return { message: 'Submit AMA question API' };
    } catch (error) {
      throw error;
    }
  },
};
