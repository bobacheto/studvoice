import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Posts API
 * TODO: Implement all posts-related endpoints
 */
export const postsAPI = {
  /**
   * Get all posts (paginated)
   * TODO: GET /posts with pagination params
   */
  getPosts: async (page: number = 1, limit: number = 10) => {
    try {
      // TODO: const response = axios.get(`${API_URL}/posts`, { params: { page, limit } })
      return { message: 'Get posts API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new post
   * TODO: POST /posts with title, content
   * TODO: Attach JWT token for anonymousId
   */
  createPost: async (title: string | null, content: string) => {
    try {
      // TODO: Get JWT token from localStorage
      // TODO: const response = axios.post(`${API_URL}/posts`, { title, content }, { headers: { Authorization: `Bearer ${token}` } })
      return { message: 'Create post API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Add reaction to a post
   * TODO: POST /posts/:id/react with emoji
   */
  addReaction: async (postId: string, emoji: string) => {
    try {
      // TODO: const response = axios.post(`${API_URL}/posts/${postId}/react`, { emoji })
      return { message: 'Add reaction API' };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Report a post
   * TODO: POST /posts/:id/report with reason
   */
  reportPost: async (postId: string, reason: string) => {
    try {
      // TODO: const response = axios.post(`${API_URL}/posts/${postId}/report`, { reason })
      return { message: 'Report post API' };
    } catch (error) {
      throw error;
    }
  },
};
