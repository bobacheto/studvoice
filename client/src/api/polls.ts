import axiosInstance from './axios';

export interface PollOption {
  id: string;
  text: string;
  voteCount: number;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  createdByAnonymousId: string;
  createdAt: string;
  expiresAt?: string;
  options: PollOption[];
  /** Optional flag if the backend returns which option the current user voted for */
  votedOptionId?: string | null;
}

export interface CreatePollPayload {
  title: string;
  description?: string;
  options: string[];
  expiresAt?: string;
}

export interface VoteResult {
  pollId: string;
  results: Array<{
    optionId: string;
    text: string;
    voteCount: number;
  }>;
}

export const pollsAPI = {
  async getPolls(): Promise<Poll[]> {
    const { data } = await axiosInstance.get('/polls');
    return data.polls;
  },

  async createPoll(payload: CreatePollPayload): Promise<Poll> {
    const { data } = await axiosInstance.post('/polls', payload);
    return data.poll;
  },

  async votePoll(pollId: string, optionId: string): Promise<VoteResult> {
    const { data } = await axiosInstance.post(`/polls/${pollId}/vote`, { optionId });
    return data;
  },

  async deletePoll(pollId: string): Promise<void> {
    await axiosInstance.delete(`/polls/${pollId}`);
  },
};
