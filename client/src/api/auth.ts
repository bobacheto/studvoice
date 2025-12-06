import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Auth API
 * TODO: Implement register and login endpoints
 */
export const authAPI = {
  /**
   * Register a new student
   * TODO: POST /auth/register with email, password, schoolCode
   */
  register: async (email: string, password: string, schoolCode: string) => {
    try {
      // TODO: const response = axios.post(`${API_URL}/auth/register`, { email, password, schoolCode })
      // TODO: Handle JWT token storage
      return { message: 'Register API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login a student
   * TODO: POST /auth/login with email, password, schoolCode
   * TODO: Return JWT token
   */
  login: async (email: string, password: string, schoolCode: string) => {
    try {
      // TODO: const response = axios.post(`${API_URL}/auth/login`, { email, password, schoolCode })
      // TODO: Store JWT token in localStorage
      // TODO: Return user data from response
      return { message: 'Login API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Logout
   * TODO: Clear JWT token from localStorage
   */
  logout: async () => {
    try {
      // TODO: Remove JWT from localStorage
      // TODO: Clear auth state
      return { message: 'Logout API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get current user
   * TODO: GET current user from JWT payload or verify token
   */
  getCurrentUser: async () => {
    try {
      // TODO: Extract user info from stored JWT token
      return { message: 'Get current user API' };
    } catch (error) {
      throw error;
    }
  },
};
