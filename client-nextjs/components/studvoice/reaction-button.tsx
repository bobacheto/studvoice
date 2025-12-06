"use client"

import { cn } from "@/lib/utils"
import { ThumbsUp, Heart, Sparkles, MessageCircle } from "lucide-react"
import { useState } from "react"

type ReactionType = "like" | "support" | "great" | "thinking"

const reactionConfig: Record<ReactionType, { icon: typeof ThumbsUp; label: string; activeColor: string }> = {
  like: {
    icon: ThumbsUp,
    label: "Like",
    activeColor: "text-primary bg-primary/10",
  },
  support: {
    icon: Heart,
    label: "Support",
    activeColor: "text-destructive bg-destructive/10",
  },
  great: {
    icon: Sparkles,
    label: "Great",
    activeColor: "text-warning bg-warning/10",
  },
  thinking: {
    icon: MessageCircle,
    label: "Thinking",
    activeColor: "text-accent bg-accent/10",
  },
}

interface ReactionButtonProps {
  type: ReactionType
  count: number
  active?: boolean
  onClick?: () => void
  className?: string
}

export function ReactionButton({ type, count, active = false, onClick, className }: ReactionButtonProps) {
  const config = reactionConfig[type]
  const Icon = config.icon

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
        "hover:bg-muted",
        active ? config.activeColor : "text-muted-foreground",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{count}</span>
    </button>
  )
}

interface ReactionRowProps {
  reactions: {
    like: number
    support: number
    great: number
    thinking: number
  }
  className?: string
}

export function ReactionRow({ reactions, className }: ReactionRowProps) {
  const [activeReactions, setActiveReactions] = useState<Set<ReactionType>>(new Set())
  const [counts, setCounts] = useState(reactions)

  const toggleReaction = (type: ReactionType) => {
    setActiveReactions((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
        setCounts((c) => ({ ...c, [type]: c[type] - 1 }))
      } else {
        next.add(type)
        setCounts((c) => ({ ...c, [type]: c[type] + 1 }))
      }
      return next
    })
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {(Object.keys(reactionConfig) as ReactionType[]).map((type) => (
        <ReactionButton
          key={type}
          type={type}
          count={counts[type]}
          active={activeReactions.has(type)}
          onClick={() => toggleReaction(type)}
        />
      ))}
    </div>
  )
}
