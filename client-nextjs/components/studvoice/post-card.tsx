"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { ReactionRow } from "@/components/ui/reaction-button"
import { MessageSquare } from "lucide-react"

interface PostCardProps {
  post: {
    id: number
    title: string
    content: string
    status: "pending" | "under-review" | "accepted" | "completed" | "rejected"
    reactions: {
      like: number
      support: number
      great: number
      thinking: number
    }
    commentCount: number
  }
  onViewComments: (postId: number) => void
}

export function PostCard({ post, onViewComments }: PostCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-semibold leading-tight">{post.title}</h3>
          <StatusBadge status={post.status} />
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
        <ReactionRow reactions={post.reactions} className="mt-4" />
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" onClick={() => onViewComments(post.id)} className="gap-2">
          <MessageSquare className="h-4 w-4" />
          Виж коментарите ({post.commentCount})
        </Button>
      </CardFooter>
    </Card>
  )
}
