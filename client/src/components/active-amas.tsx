import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { HelpCircle, MessageCircle } from "lucide-react"
import Link from "next/link"

const activeAMAs = [
  {
    id: 1,
    host: "Директор Иванов",
    role: "Директор на училището",
    topic: "Планиране на учебната година",
    questions: 23,
    answers: 18,
  },
  {
    id: 2,
    host: "Треньор Петров",
    role: "Спортен директор",
    topic: "Обновяване на спортните съоръжения",
    questions: 15,
    answers: 12,
  },
]

export function ActiveAMAs() {
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
        {activeAMAs.map((ama) => (
          <div key={ama.id} className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {ama.host
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{ama.host}</h4>
                <p className="text-sm text-muted-foreground">{ama.role}</p>
              </div>
            </div>
            <p className="mt-3 text-sm font-medium">{ama.topic}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3.5 w-3.5" />
                {ama.questions} въпроса
              </span>
              <span>{ama.answers} отговорени</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
