"use client"

import { useEffect, useState } from "react"
import { postsAPI, type Post } from "@/lib/posts"
import { PostCard } from "./post-card"
import { CreatePostCard } from "./create-post-card"
import { PostCardSkeleton } from "./loading-skeleton"
import { EmptyState } from "./empty-state"
import { CommentsModal } from "./comments-modal"

export function Posts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const data = await postsAPI.getTrendingPosts()
      setPosts(data)
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handlePostCreated = () => {
    fetchPosts()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Публикации</h1>
        <p className="text-muted-foreground">
          Споделете вашите идеи, въпроси и предложения с училищната общност
        </p>
      </div>

      <CreatePostCard onCreated={handlePostCreated} />

      <div className="mt-8">
        {loading ? (
          <div className="space-y-4">
            <PostCardSkeleton />
            <PostCardSkeleton />
            <PostCardSkeleton />
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            title="Няма публикации"
            description="Бъдете първият, който споделя нещо!"
          />
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={{
                  id: parseInt(post.id) || 0,
                  title: post.title || "",
                  content: post.content,
                  status: post.status.toLowerCase().replace("_", "-") as any,
                  reactions: {
                    like: post.reactions.LIKE,
                    support: post.reactions.SUPPORT,
                    great: post.reactions.GREAT,
                    thinking: post.reactions.THINKING,
                  },
                  commentCount: post.commentCount,
                }}
                onViewComments={(id) => setSelectedPostId(post.id)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedPostId && (
        <CommentsModal
          open={true}
          onOpenChange={(open) => !open && setSelectedPostId(null)}
          postTitle="Comments"
          comments={[]}
        />
      )}
    </div>
  )
}
