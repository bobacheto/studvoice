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
    const response = await fetch("/api/polls")
    const data = await response.json()
    return data.polls as Poll[]
  },

  async createPoll(payload: CreatePollPayload): Promise<Poll> {
    const response = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    return data.poll as Poll
  },
}
