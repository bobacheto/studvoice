import { axiosInstance } from "./axios"

export type ReactionType = "LIKE" | "SUPPORT" | "GREAT" | "THINKING"

export interface Post {
  id: string
  title?: string
  content: string
  status: "PENDING" | "UNDER_REVIEW" | "ACCEPTED" | "COMPLETED" | "REJECTED"
  anonymousId: string
  createdAt: string
  reactions: Record<ReactionType, number>
  commentCount: number
}

export interface CreatePostData {
  title?: string
  content: string
}

export const postsAPI = {
  async getTrendingPosts(): Promise<Post[]> {
    const { data } = await axiosInstance.get("/posts", { params: { limit: 10 } })
    return data.posts as Post[]
  },

  async createPost(payload: CreatePostData): Promise<Post> {
    const { data } = await axiosInstance.post("/posts", payload)
    return data.post as Post
  },
}
