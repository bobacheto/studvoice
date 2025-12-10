"use client"

import { useEffect, useState } from "react"
import { amaAPI, type AMASession } from "@/lib/ama"
import { AMACard } from "./ama-card"
import { CreateAMAModal } from "./create-ama-modal"
import { AMACardSkeleton } from "./loading-skeleton"
import { EmptyState } from "./empty-state"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function AMA() {
  const [sessions, setSessions] = useState<AMASession[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const data = await amaAPI.getActiveAMA()
      setSessions(data)
    } catch {
      setSessions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [])

  const handleSessionCreated = () => {
    setShowCreateModal(false)
    fetchSessions()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Попитай ме</h1>
          <p className="text-muted-foreground">
            Задайте въпроси на учители, директори и администрация
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Нова сесия
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <AMACardSkeleton />
          <AMACardSkeleton />
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          title="Няма активни AMA сесии"
          description="Създайте нова сесия за въпроси и отговори"
          action={{
            label: "Създай сесия",
            onClick: () => setShowCreateModal(true),
          }}
        />
      ) : (
        <div className="space-y-6">
          {sessions.map((session) => (
            <AMACard
              key={session.id}
              ama={{
                id: parseInt(session.id.replace("ama_", "")) || 0,
                host: `${session.createdBy.firstName} ${session.createdBy.lastName}`,
                role: session.createdBy.role,
                topic: session.title,
                description: session.description || "",
                questionsCount: session._count?.questions || 0,
                answeredCount: 0,
                isLive: session.isActive,
              }}
            />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateAMAModal
          onSubmit={async (data) => {
            console.log("Creating AMA:", data)
            handleSessionCreated()
          }}
        />
      )}
    </div>
  )
}
