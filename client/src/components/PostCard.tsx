import { useState } from 'react';
import { Post } from '../api/posts';

interface PostCardProps {
  post: Post;
  onReact: (postId: string, type: 'LIKE' | 'SUPPORT' | 'GREAT' | 'THINKING') => void;
  onViewComments: (post: Post) => void;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function PostCard({ post, onReact, onViewComments, onDelete, isDeleting }: PostCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'PENDING':
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 hover:shadow-lg transition-shadow">
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-3 gap-3">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
          {post.status.replace('_', ' ')}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatRelativeTime(post.createdAt)}
          </span>
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 border border-red-200 dark:border-red-700 rounded px-2 py-1"
            >
              {isDeleting ? 'Deleting...' : '🗑️ Delete'}
            </button>
          )}
        </div>
      </div>

      {/* Title & Content */}
      {post.title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {post.title}
        </h3>
      )}
      <p className="text-gray-700 dark:text-gray-300 text-sm line-clamp-3 mb-4">
        {post.content}
      </p>

      {/* Reaction Buttons */}
      <div className="flex items-center gap-2 mb-4">
        <ReactionButton
          emoji="👍"
          label="LIKE"
          count={post.reactions.LIKE}
          onClick={() => onReact(post.id, 'LIKE')}
        />
        <ReactionButton
          emoji="💪"
          label="SUPPORT"
          count={post.reactions.SUPPORT}
          onClick={() => onReact(post.id, 'SUPPORT')}
        />
        <ReactionButton
          emoji="🎉"
          label="GREAT"
          count={post.reactions.GREAT}
          onClick={() => onReact(post.id, 'GREAT')}
        />
        <ReactionButton
          emoji="🤔"
          label="THINKING"
          count={post.reactions.THINKING}
          onClick={() => onReact(post.id, 'THINKING')}
        />
      </div>

      {/* Comments Button */}
      <button
        onClick={() => onViewComments(post)}
        className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        💬 {post.commentCount} {post.commentCount === 1 ? 'Comment' : 'Comments'}
      </button>
    </div>
  );
}

// Reaction Button Component
function ReactionButton({
  emoji,
  label,
  count,
  onClick,
}: {
  emoji: string;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
      title={label}
    >
      <span>{emoji}</span>
      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{count}</span>
    </button>
  );
}
