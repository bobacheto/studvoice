import axiosInstance from './axios';

export type AMAStatus = 'PENDING' | 'ANSWERED' | 'REJECTED';

export interface AMASession {
  id: string;
  title: string;
  description?: string;
  schoolId: string;
  isActive: boolean;
  createdAt: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  _count?: {
    questions: number;
  };
}

export interface AMAAnswer {
  id: string;
  questionId: string;
  content: string;
  createdAt: string;
  answeredBy: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export interface AMAQuestion {
  id: string;
  amaId: string;
  content: string;
  anonymousId: string;
  status: AMAStatus;
  createdAt: string;
  answer?: AMAAnswer;
}

export interface CreateAMAPayload {
  title: string;
  description?: string;
}

export interface AskQuestionPayload {
  content: string;
}

export interface AnswerQuestionPayload {
  content: string;
}

export const amaAPI = {
  async getActiveAMA(): Promise<AMASession[]> {
    const { data } = await axiosInstance.get('/ama');
    return data.sessions;
  },

  async createAMA(payload: CreateAMAPayload): Promise<AMASession> {
    const { data } = await axiosInstance.post('/ama', payload);
    return data.session;
  },

  async getAMAQuestions(amaId: string): Promise<AMAQuestion[]> {
    const { data } = await axiosInstance.get(`/ama/${amaId}/questions`);
    return data.questions;
  },

  async askQuestion(amaId: string, payload: AskQuestionPayload): Promise<AMAQuestion> {
    const { data } = await axiosInstance.post(`/ama/${amaId}/questions`, payload);
    return data.question;
  },

  async answerQuestion(
    amaId: string,
    questionId: string,
    payload: AnswerQuestionPayload,
  ): Promise<AMAAnswer> {
    const { data } = await axiosInstance.post(`/ama/${amaId}/questions/${questionId}/answer`, payload);
    return data.answer;
  },

  async updateQuestionStatus(
    amaId: string,
    questionId: string,
    status: AMAStatus,
  ): Promise<AMAQuestion> {
    const { data } = await axiosInstance.patch(`/ama/${amaId}/questions/${questionId}/status`, { status });
    return data.question;
  },
};
