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
    const response = await fetch("/api/posts?limit=10")
    const data = await response.json()
    return data.posts as Post[]
  },

  async createPost(payload: CreatePostData): Promise<Post> {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
    const data = await response.json()
    return data.post as Post
  },
}
