import { useQuery } from '@tanstack/react-query';
import { postsAPI, Post } from '../api/posts';
import { pollsAPI, Poll } from '../api/polls';
import { amaAPI, AMASession } from '../api/ama';
import { analyticsAPI } from '../api/analytics';

export default function Dashboard() {
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ['trending-posts'],
    queryFn: () => postsAPI.getTrendingPosts(),
  });

  const { data: pollsData, isLoading: pollsLoading } = useQuery<Poll[]>({
    queryKey: ['active-polls'],
    queryFn: () => pollsAPI.getPolls(),
  });

  const { data: amaData, isLoading: amaLoading } = useQuery<AMASession[]>({
    queryKey: ['active-ama'],
    queryFn: () => amaAPI.getActiveAMA(),
  });

  const { data: digestData, isLoading: digestLoading } = useQuery({
    queryKey: ['weekly-digest'],
    queryFn: () => analyticsAPI.getWeeklyDigest(),
  });

  const normalizedTrending = (postsData?.posts || []).map((post: Post & { reactionCounts?: Record<string, number>; commentCount?: number; createdAt?: string }) => {
    const reactions = (post as any).reactions || (post as any).reactionCounts || {
      LIKE: 0,
      SUPPORT: 0,
      GREAT: 0,
      THINKING: 0,
    };

    return {
      ...post,
      reactions,
      commentCount: post.commentCount ?? 0,
      createdAt: post.createdAt || new Date().toISOString(),
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Табло
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trending Posts */}
          <DashboardCard title="🔥 Популярни публикации" isLoading={postsLoading}>
            {normalizedTrending.length > 0 ? (
              <div className="space-y-3">
                {normalizedTrending.slice(0, 5).map((post) => (
                  <div key={post.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                      {post.title || post.content}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>👍 {post.reactions.LIKE + post.reactions.SUPPORT}</span>
                      <span>💬 {post.commentCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Все още няма публикации</p>
            )}
          </DashboardCard>

          {/* Active Polls */}
          <DashboardCard title="📊 Активни гласувания" isLoading={pollsLoading}>
            {pollsData && pollsData.length > 0 ? (
              <div className="space-y-3">
                {pollsData.slice(0, 3).map((poll) => (
                  <div key={poll.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {poll.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {poll.options.length} варианта
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Няма активни гласувания</p>
            )}
          </DashboardCard>

          {/* Active AMA Sessions */}
          <DashboardCard title="💬 Активни AMA сесии" isLoading={amaLoading}>
            {amaData && amaData.length > 0 ? (
              <div className="space-y-3">
                {amaData.slice(0, 3).map((session) => (
                  <div key={session.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {session.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      с {session.createdBy.firstName} {session.createdBy.lastName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Няма активни AMA сесии</p>
            )}
          </DashboardCard>

          {/* Weekly Digest */}
          <DashboardCard title="📈 Седмичен преглед" isLoading={digestLoading} className="md:col-span-2">
            {digestData?.digest ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {digestData.digest.totalPosts}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Публикации</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {digestData.digest.totalComments}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Коментари</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {digestData.digest.totalReactions}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Реакции</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Няма налични данни за преглед</p>
            )}
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}

// Reusable Dashboard Card Component
function DashboardCard({
  title,
  children,
  isLoading,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow p-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {isLoading ? (
        <div className="space-y-3">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
