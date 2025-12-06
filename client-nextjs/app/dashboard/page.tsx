import { ActiveAMAs } from "@/components/studvoice/active-amas"
import { ActivePolls } from "@/components/studvoice/active-polls"
import { CreatePostCard } from "@/components/studvoice/create-post-card"
import { TrendingPosts } from "@/components/studvoice/trending-posts"
import { WeeklyDigest } from "@/components/studvoice/weekly-digest"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Табло</h1>
        <p className="text-muted-foreground">Бърз преглед на случващото се във вашето училище.</p>
      </div>

      <CreatePostCard />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TrendingPosts />
          <ActivePolls />
        </div>
        <div className="space-y-6">
          <WeeklyDigest />
          <ActiveAMAs />
        </div>
      </div>
    </div>
  )
}
