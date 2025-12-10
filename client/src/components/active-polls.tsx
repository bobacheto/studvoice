import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Users } from "lucide-react"
import Link from "next/link"

const activePolls = [
  {
    id: 1,
    question: "Какво събитие да организираме следващия месец?",
    totalVotes: 342,
    topOption: "Филмова вечер",
    topPercentage: 45,
  },
  {
    id: 2,
    question: "Предпочитан формат за изпитния график?",
    totalVotes: 567,
    topOption: "Разпределени в две седмици",
    topPercentage: 62,
  },
]

export function ActivePolls() {
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
        {activePolls.map((poll) => (
          <div key={poll.id} className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
            <h4 className="font-medium leading-tight">{poll.question}</h4>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Водещ: {poll.topOption}</span>
                <span className="font-medium">{poll.topPercentage}%</span>
              </div>
              <Progress value={poll.topPercentage} className="mt-2 h-2" />
            </div>
            <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              {poll.totalVotes} гласа
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
