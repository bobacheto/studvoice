"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Loader2 } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Comment {
  id: number
  author: string
  content: string
  timestamp: string
}

interface CommentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postTitle: string
  comments: Comment[]
}

export function CommentsModal({ open, onOpenChange, postTitle, comments }: CommentsModalProps) {
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [localComments, setLocalComments] = useState(comments)

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setLocalComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "Вие",
        content: newComment,
        timestamp: "Току-що",
      },
    ])
    setNewComment("")
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-8 line-clamp-1">{postTitle}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <ScrollArea className="h-[300px] pr-4">
            {localComments.length === 0 ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Все още няма коментари. Бъдете първият, който ще коментира!
              </div>
            ) : (
              <div className="space-y-4">
                {localComments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {comment.author.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          <div className="flex gap-2">
            <Textarea
              placeholder="Напишете коментар..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isLoading}
              className="min-h-[80px]"
            />
          </div>
          <Button onClick={handleSubmitComment} disabled={isLoading || !newComment.trim()} className="w-full">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Публикувай коментар
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
