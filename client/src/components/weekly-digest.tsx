import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, CheckCircle, Users } from "lucide-react"

export function WeeklyDigest() {
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
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg bg-background/80 p-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-2xl font-bold">47</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Нови публикации</p>
          </div>
          <div className="rounded-lg bg-background/80 p-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-2xl font-bold">12</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Приети идеи</p>
          </div>
          <div className="rounded-lg bg-background/80 p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-2xl font-bold">892</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Общо гласове</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
