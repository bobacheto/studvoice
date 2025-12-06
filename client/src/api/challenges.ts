import axiosInstance from './axios';

export type ChallengeType = 'GRATITUDE' | 'IDEA_SPRINT' | 'PROBLEM_SOLVER' | 'CUSTOM';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  schoolId: string;
  startAt: string;
  endAt: string;
  isActive: boolean;
  createdAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  _count?: {
    submissions: number;
  };
}

export interface ChallengeSubmission {
  id: string;
  challengeId: string;
  content: string;
  anonymousId: string;
  createdAt: string;
}

export interface CreateChallengePayload {
  title: string;
  description: string;
  type: ChallengeType;
  startAt: string;
  endAt: string;
}

export interface SubmitChallengePayload {
  content: string;
}

export const challengesAPI = {
  async getChallenges(): Promise<Challenge[]> {
    const { data } = await axiosInstance.get('/challenges');
    return data.challenges;
  },

  async createChallenge(payload: CreateChallengePayload): Promise<Challenge> {
    const { data } = await axiosInstance.post('/challenges', payload);
    return data.challenge;
  },

  async submitChallenge(challengeId: string, payload: SubmitChallengePayload): Promise<ChallengeSubmission> {
    const { data } = await axiosInstance.post(`/challenges/${challengeId}/submit`, payload);
    return data.submission;
  },

  async getChallengeSubmissions(challengeId: string): Promise<ChallengeSubmission[]> {
    const { data } = await axiosInstance.get(`/challenges/${challengeId}/submissions`);
    return data.submissions;
  },
};
