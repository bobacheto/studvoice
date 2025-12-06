"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { HelpCircle, MessageCircle } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AMACardSkeleton } from "@/components/ui/loading-skeleton"
import { amaAPI, type AMASession } from "@/lib/ama"

export function ActiveAMAs() {
  const [sessions, setSessions] = useState<AMASession[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const load = async () => {
      try {
        const data = await amaAPI.getActiveAMA()
        if (isMounted) setSessions(data)
      } catch {
        if (isMounted) setError("Неуспешно зареждане на AMA сесиите.")
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
          <HelpCircle className="h-5 w-5 text-primary" />
          Активни AMA сесии
        </CardTitle>
        <Link href="/ama" className="text-sm font-medium text-primary hover:underline">
          Виж всички
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading && <AMACardSkeleton />}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!loading && !error && sessions?.length === 0 && (
          <p className="text-sm text-muted-foreground">Няма активни AMA сесии.</p>
        )}
        {!loading && !error &&
          sessions?.map((ama) => {
            const initials = `${ama.createdBy.firstName?.[0] ?? ""}${ama.createdBy.lastName?.[0] ?? ""}` || "SV"
            return (
              <div key={ama.id} className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{`${ama.createdBy.firstName} ${ama.createdBy.lastName}`}</h4>
                    <p className="text-sm text-muted-foreground">{ama.createdBy.role}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium line-clamp-2">{ama.title}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{ama.description}</p>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {ama._count?.questions ?? 0} въпроса
                  </span>
                  <span className="text-xs uppercase tracking-wide text-primary">{ama.isActive ? "Активна" : "Неактивна"}</span>
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}
