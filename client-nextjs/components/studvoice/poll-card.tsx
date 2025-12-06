"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check, Users } from "lucide-react"

interface PollOption {
  id: number
  text: string
  votes: number
}

interface PollCardProps {
  poll: {
    id: number
    question: string
    options: PollOption[]
    totalVotes: number
    hasVoted?: boolean
    votedOptionId?: number
  }
}

export function PollCard({ poll }: PollCardProps) {
  const [hasVoted, setHasVoted] = useState(poll.hasVoted || false)
  const [votedOptionId, setVotedOptionId] = useState(poll.votedOptionId)
  const [options, setOptions] = useState(poll.options)
  const [totalVotes, setTotalVotes] = useState(poll.totalVotes)

  const handleVote = (optionId: number) => {
    if (hasVoted) return

    setOptions((prev) => prev.map((opt) => (opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)))
    setTotalVotes((prev) => prev + 1)
    setVotedOptionId(optionId)
    setHasVoted(true)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{poll.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {options.map((option) => {
          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
          const isSelected = votedOptionId === option.id

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
              className={cn(
                "relative w-full overflow-hidden rounded-lg border p-3 text-left transition-all",
                hasVoted ? "cursor-default" : "cursor-pointer hover:border-primary/50 hover:bg-muted/50",
                isSelected && "border-primary bg-primary/5",
              )}
            >
              <div className="relative z-10 flex items-center justify-between">
                <span className={cn("text-sm font-medium", isSelected && "text-primary")}>{option.text}</span>
                <div className="flex items-center gap-2">
                  {hasVoted && <span className="text-sm font-medium">{percentage}%</span>}
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </div>
              </div>
              {hasVoted && (
                <div
                  className={cn("absolute inset-0 transition-all", isSelected ? "bg-primary/10" : "bg-muted")}
                  style={{ width: `${percentage}%` }}
                />
              )}
            </button>
          )
        })}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {totalVotes} гласа
        </div>
      </CardFooter>
    </Card>
  )
}
