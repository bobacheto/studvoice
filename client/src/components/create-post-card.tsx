"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PenSquare, Send, Loader2 } from "lucide-react"

interface CreatePostCardProps {
  onSubmit: (title: string, content: string) => Promise<void>
}

export function CreatePostCard({ onSubmit }: CreatePostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return

    setIsLoading(true)
    await onSubmit(title, content)
    setIsLoading(false)
    setTitle("")
    setContent("")
    setIsExpanded(false)
  }

  if (!isExpanded) {
    return (
      <Card
        className="cursor-pointer border-dashed transition-colors hover:border-primary/50 hover:bg-muted/50"
        onClick={() => setIsExpanded(true)}
      >
        <CardContent className="flex items-center gap-3 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <PenSquare className="h-5 w-5 text-primary" />
          </div>
          <span className="text-muted-foreground">Споделете вашата идея или предложение...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PenSquare className="h-5 w-5 text-primary" />
          Създаване на нова публикация
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="post-title">Заглавие</Label>
          <Input
            id="post-title"
            placeholder="Дайте заглавие на вашата идея"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="post-content">Описание</Label>
          <Textarea
            id="post-content"
            placeholder="Опишете подробно вашата идея или предложение..."
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => setIsExpanded(false)} disabled={isLoading}>
          Отказ
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading || !title.trim() || !content.trim()}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          Публикувай
        </Button>
      </CardFooter>
    </Card>
  )
}
