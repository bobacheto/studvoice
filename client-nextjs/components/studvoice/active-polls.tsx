"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart3, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PollCardSkeleton } from "@/components/ui/loading-skeleton"
import { pollsAPI, type Poll } from "@/lib/polls"

const getTopOption = (poll: Poll) => {
  if (!poll.options.length) return { option: "", percentage: 0, totalVotes: 0 }
  const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0)
  const top = [...poll.options].sort((a, b) => b.voteCount - a.voteCount)[0]
  const percentage = totalVotes === 0 ? 0 : Math.round((top.voteCount / totalVotes) * 100)
  return { option: top.text, percentage, totalVotes }
}

export function ActivePolls() {
  const [polls, setPolls] = useState<Poll[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const data = await pollsAPI.getPolls()
        if (isMounted) setPolls(data)
      } catch {
        if (isMounted) setError("Неуспешно зареждане на анкетите.")
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
          <BarChart3 className="h-5 w-5 text-primary" />
          Активни анкети
        </CardTitle>
        <Link href="/polls" className="text-sm font-medium text-primary hover:underline">
          Виж всички
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <PollCardSkeleton />}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && polls?.length === 0 && (
          <p className="text-sm text-muted-foreground">Няма активни анкети.</p>
        )}
        {!loading && !error &&
          polls?.map((poll) => {
            const { option, percentage, totalVotes } = getTopOption(poll)
            return (
              <div key={poll.id} className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
                <h4 className="font-medium leading-tight line-clamp-2">{poll.title}</h4>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Водещ: {option || "Без гласове"}</span>
                    <span className="font-medium">{percentage}%</span>
                  </div>
                  <Progress value={percentage} className="mt-2 h-2" />
                </div>
                <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  {totalVotes} гласа
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
