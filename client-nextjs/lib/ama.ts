import { axiosInstance } from "./axios"

export type AMAStatus = "PENDING" | "ANSWERED" | "REJECTED"

export interface AMASession {
  id: string
  title: string
  description?: string
  schoolId: string
  isActive: boolean
  createdAt: string
  createdBy: {
    id: string
    firstName: string
    lastName: string
    role: string
  }
  _count?: {
    questions: number
  }
}

export const amaAPI = {
  async getActiveAMA(): Promise<AMASession[]> {
    const { data } = await axiosInstance.get("/ama")
    return data.sessions as AMASession[]
  },
}
