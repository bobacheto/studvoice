import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface AMACardProps {
  ama: {
    id: number
    host: string
    role: string
    topic: string
    description: string
    questionsCount: number
    answeredCount: number
    isLive: boolean
  }
}

export function AMACard({ ama }: AMACardProps) {
  return (
    <Link href={`/ama/${ama.id}`}>
      <Card className="transition-all hover:shadow-md hover:border-primary/50">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {ama.host
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{ama.host}</h3>
                <p className="text-sm text-muted-foreground">{ama.role}</p>
              </div>
            </div>
            {ama.isLive && <Badge className="bg-success text-success-foreground">На живо</Badge>}
          </div>
        </CardHeader>
        <CardContent>
          <h4 className="font-medium">{ama.topic}</h4>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{ama.description}</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {ama.questionsCount} въпроса
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              {ama.answeredCount} отговорени
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
