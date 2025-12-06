import axiosInstance from './axios';

export interface WeeklyDigest {
  totalPosts: number;
  totalComments: number;
  totalReactions: number;
  topPosts: Array<{
    id: string;
    title?: string;
    content: string;
    reactionCount: number;
  }>;
  mostActiveDay: string;
}

export const analyticsAPI = {
  getWeeklyDigest: async (): Promise<{ digest: WeeklyDigest }> => {
    const response = await axiosInstance.get('/analytics/weekly-digest');
    return response.data;
  },

  getDirectorAnalytics: async (): Promise<any> => {
    const response = await axiosInstance.get('/analytics/director');
    return response.data;
  },

  getSchoolAnalytics: async () => {
    const response = await axiosInstance.get('/analytics/school');
    return response.data;
  },
};

