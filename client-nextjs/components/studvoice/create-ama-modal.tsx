"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface CreateAMAModalProps {
  onSubmit: (data: { topic: string; description: string }) => Promise<void>
  trigger?: React.ReactNode
}

export function CreateAMAModal({ onSubmit, trigger }: CreateAMAModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [topic, setTopic] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = async () => {
    if (!topic.trim() || !description.trim()) return

    setIsLoading(true)
    await onSubmit({ topic, description })
    setIsLoading(false)
    setTopic("")
    setDescription("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || <Button>Създай AMA</Button>}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Създаване на AMA сесия</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ama-topic">Тема</Label>
            <Input
              id="ama-topic"
              placeholder="Какво искате да обсъдите?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ama-description">Описание</Label>
            <Textarea
              id="ama-description"
              placeholder="Дайте повече детайли за вашата AMA сесия..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !topic.trim() || !description.trim()}
            className="w-full"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Започни AMA сесия
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
