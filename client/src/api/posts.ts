import axiosInstance from './axios';

export interface Post {
  id: string;
  title?: string;
  content: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'ACCEPTED' | 'COMPLETED' | 'REJECTED';
  anonymousId: string;
  createdAt: string;
  reactions: {
    LIKE: number;
    SUPPORT: number;
    GREAT: number;
    THINKING: number;
  };
  commentCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  anonymousId: string;
  createdAt: string;
}

export interface CreatePostData {
  title?: string;
  content: string;
}

export interface CreateCommentData {
  content: string;
}

export const postsAPI = {
  getPosts: async (params?: { status?: string; limit?: number; offset?: number }): Promise<{ posts: Post[] }> => {
    const response = await axiosInstance.get('/posts', { params });
    return response.data;
  },

  getTrendingPosts: async (): Promise<{ posts: Post[] }> => {
    const response = await axiosInstance.get('/posts', {
      params: { limit: 10 }
    });
    return response.data;
  },

  getPostById: async (id: string): Promise<{ post: Post }> => {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data: CreatePostData): Promise<{ post: Post }> => {
    const response = await axiosInstance.post('/posts', data);
    return response.data;
  },

  reactToPost: async (postId: string, type: 'LIKE' | 'SUPPORT' | 'GREAT' | 'THINKING'): Promise<any> => {
    const response = await axiosInstance.post(`/posts/${postId}/reactions`, { type });
    return response.data;
  },

  getComments: async (postId: string): Promise<{ comments: Comment[] }> => {
    const response = await axiosInstance.get(`/posts/${postId}/comments`);
    return response.data;
  },

  addComment: async (postId: string, data: CreateCommentData): Promise<{ comment: Comment }> => {
    const response = await axiosInstance.post(`/posts/${postId}/comments`, data);
    return response.data;
  },

  updatePostStatus: async (postId: string, status: string): Promise<{ post: Post }> => {
    const response = await axiosInstance.patch(`/posts/${postId}/status`, { status });
    return response.data;
  },
};
