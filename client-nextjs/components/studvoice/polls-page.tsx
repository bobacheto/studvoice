"use client"

import { useEffect, useState } from "react"
import { pollsAPI, type Poll } from "@/lib/polls"
import { PollCard } from "./poll-card"
import { CreatePollModal } from "./create-poll-modal"
import { PollCardSkeleton } from "./loading-skeleton"
import { EmptyState } from "./empty-state"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function Polls() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchPolls = async () => {
    try {
      setLoading(true)
      const data = await pollsAPI.getPolls()
      setPolls(data)
    } catch {
      setPolls([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPolls()
  }, [])

  const handlePollCreated = () => {
    setShowCreateModal(false)
    fetchPolls()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Анкети</h1>
          <p className="text-muted-foreground">
            Гласувайте и създавайте анкети за важни теми
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Нова анкета
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <PollCardSkeleton />
          <PollCardSkeleton />
        </div>
      ) : polls.length === 0 ? (
        <EmptyState
          title="Няма активни анкети"
          description="Създайте първата анкета!"
          action={{
            label: "Създай анкета",
            onClick: () => setShowCreateModal(true),
          }}
        />
      ) : (
        <div className="space-y-6">
          {polls.map((poll) => {
            const totalVotes = poll.options.reduce((sum, opt) => sum + opt.voteCount, 0)
            return (
              <PollCard
                key={poll.id}
                poll={{
                  id: parseInt(poll.id.replace("poll_", "")) || 0,
                  question: poll.title,
                  options: poll.options.map((opt) => ({
                    id: parseInt(opt.id.replace("opt_", "").split("_")[1]) || 0,
                    text: opt.text,
                    votes: opt.voteCount,
                  })),
                  totalVotes,
                  hasVoted: !!poll.votedOptionId,
                  votedOptionId: poll.votedOptionId
                    ? parseInt(poll.votedOptionId.replace("opt_", "").split("_")[1]) || undefined
                    : undefined,
                }}
              />
            )
          })}
        </div>
      )}

      {showCreateModal && (
        <CreatePollModal
          onSubmit={async (question: string, options: string[]) => {
            console.log("Creating poll:", { question, options })
            handlePollCreated()
          }}
        />
      )}
    </div>
  )
}
