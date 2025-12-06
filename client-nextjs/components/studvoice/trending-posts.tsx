"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { TrendingUp, MessageSquare } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { PostCardSkeleton } from "@/components/ui/loading-skeleton"
import { postsAPI, type Post } from "@/lib/posts"

type StatusBadgeType = "pending" | "under-review" | "accepted" | "completed" | "rejected" | "active" | "upcoming"

const mapStatus = (status: Post["status"]): StatusBadgeType => {
  switch (status) {
    case "PENDING":
      return "pending"
    case "UNDER_REVIEW":
      return "under-review"
    case "ACCEPTED":
      return "accepted"
    case "COMPLETED":
      return "completed"
    case "REJECTED":
      return "rejected"
    default:
      return "pending"
  }
}

export function TrendingPosts() {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const data = await postsAPI.getTrendingPosts()
        if (isMounted) setPosts(data)
      } catch {
        if (isMounted) setError("Неуспешно зареждане на публикациите.")
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Популярни публикации
        </CardTitle>
        <Link href="/posts" className="text-sm font-medium text-primary hover:underline">
          Виж всички
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <PostCardSkeleton />}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && posts?.length === 0 && (
          <p className="text-sm text-muted-foreground">Няма намерени публикации.</p>
        )}
        {!loading && !error &&
          posts?.map((post) => {
            const totalReactions = Object.values(post.reactions).reduce((sum, value) => sum + (value || 0), 0)
            return (
              <div key={post.id} className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium leading-tight line-clamp-2">{post.title || "Публикация"}</h4>
                  <StatusBadge status={mapStatus(post.status)} />
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{post.content}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {totalReactions}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {post.commentCount}
                  </span>
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
