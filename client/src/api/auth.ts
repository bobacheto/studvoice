import axiosInstance from './axios';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  schoolCode: string;
}

export interface LoginData {
  email: string;
  password: string;
  schoolCode: string;
}

export interface AuthResponse {
  user: {
    userId: string;
    anonymousId: string;
    email: string;
    role: string;
    schoolId: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await axiosInstance.post('/auth/refresh', { refreshToken });
    return response.data;
  },

  logout: async (): Promise<void> => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },
};
