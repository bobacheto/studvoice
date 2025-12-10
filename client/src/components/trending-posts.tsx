import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui/status-badge"
import { TrendingUp, MessageSquare } from "lucide-react"
import Link from "next/link"

const trendingPosts = [
  {
    id: 1,
    title: "Удължено работно време на библиотеката по време на изпити",
    excerpt: "Учениците се нуждаят от повече място за учене по време на сесията...",
    status: "under-review" as const,
    reactions: 156,
    comments: 23,
  },
  {
    id: 2,
    title: "Повече вегетариански опции в столовата",
    excerpt: "Сегашните опции са ограничени и повтарящи се...",
    status: "accepted" as const,
    reactions: 89,
    comments: 12,
  },
  {
    id: 3,
    title: "Подобрения на Wi-Fi в общежитията",
    excerpt: "Връзката често прекъсва вечер...",
    status: "pending" as const,
    reactions: 234,
    comments: 45,
  },
]

export function TrendingPosts() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Популярни публикации
        </CardTitle>
        <Link href="/posts" className="text-sm font-medium text-primary hover:underline">
          Виж всички
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {trendingPosts.map((post) => (
          <div key={post.id} className="rounded-lg border bg-card p-4 transition-colors hover:bg-muted/50">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium leading-tight">{post.title}</h4>
              <StatusBadge status={post.status} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
            <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5" />
                {post.reactions}
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-3.5 w-3.5" />
                {post.comments}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
