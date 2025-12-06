import { axiosInstance } from "./axios"

export interface PollOption {
  id: string
  text: string
  voteCount: number
}

export interface Poll {
  id: string
  title: string
  description?: string
  createdByAnonymousId: string
  createdAt: string
  expiresAt?: string
  options: PollOption[]
  votedOptionId?: string | null
}

export interface CreatePollPayload {
  title: string
  description?: string
  options: string[]
  expiresAt?: string
}

export const pollsAPI = {
  async getPolls(): Promise<Poll[]> {
    const { data } = await axiosInstance.get("/polls")
    return data.polls as Poll[]
  },

  async createPoll(payload: CreatePollPayload): Promise<Poll> {
    const { data } = await axiosInstance.post("/polls", payload)
    return data.poll as Poll
  },
}
