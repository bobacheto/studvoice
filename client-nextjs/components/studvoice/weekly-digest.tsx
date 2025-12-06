"use client"

import { useEffect, useState } from "react"
import { Sparkles, TrendingUp, CheckCircle, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { pollsAPI } from "@/lib/polls"
import { postsAPI } from "@/lib/posts"

export function WeeklyDigest() {
  const [newPosts, setNewPosts] = useState<number | null>(null)
  const [acceptedIdeas, setAcceptedIdeas] = useState<number | null>(null)
  const [totalVotes, setTotalVotes] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const [posts, polls] = await Promise.all([postsAPI.getTrendingPosts(), pollsAPI.getPolls()])
        if (!isMounted) return
        setNewPosts(posts.length)
        setAcceptedIdeas(posts.filter((p) => p.status === "ACCEPTED").length)
        const votes = polls.reduce((sum, poll) => sum + poll.options.reduce((s, o) => s + o.voteCount, 0), 0)
        setTotalVotes(votes)
      } catch {
        if (isMounted) setError("Неуспешно зареждане на обобщението.")
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const metric = (value: number | null) => (value === null ? "–" : value)

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Седмичен обзор
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Ето какво се случи тази седмица във вашето училище</p>
        {error && <p className="text-sm text-destructive mb-2">{error}</p>}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-background/80 p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">{metric(newPosts)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Нови публикации</p>
          </div>
          <div className="rounded-lg bg-background/80 p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-2xl font-bold">{metric(acceptedIdeas)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Приети идеи</p>
          </div>
          <div className="rounded-lg bg-background/80 p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-2xl font-bold">{metric(totalVotes)}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Общо гласове</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
