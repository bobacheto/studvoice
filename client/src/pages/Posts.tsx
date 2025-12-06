import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsAPI, Post, CreateCommentData, Comment } from '../api/posts';
import { useAuth } from '../hooks/useAuth';
import PostCard from '../components/PostCard';

export default function Posts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch posts
  const { data: postsData, isLoading } = useQuery<{ posts: Post[]}>({
    queryKey: ['posts', statusFilter],
    queryFn: () =>
      postsAPI.getPosts(statusFilter === 'ALL' ? {} : { status: statusFilter }),
  });

  // React to post
  const reactMutation = useMutation({
    mutationFn: ({ postId, type }: { postId: string; type: 'LIKE' | 'SUPPORT' | 'GREAT' | 'THINKING' }) =>
      postsAPI.reactToPost(postId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      if (selectedPost) {
        queryClient.invalidateQueries({ queryKey: ['post', selectedPost.id] });
      }
    },
  });

  const handleReact = (postId: string, type: 'LIKE' | 'SUPPORT' | 'GREAT' | 'THINKING') => {
    reactMutation.mutate({ postId, type });
  };

  const canCreatePost = user?.role !== 'STUDENT' && user?.role !== 'STUDENT_COUNCIL';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📝 Posts</h1>
          <div className="flex items-center gap-4">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>

            {/* Create Post Button (for privileged roles) */}
            {canCreatePost && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                + Create Post
              </button>
            )}
          </div>
        </div>

        {/* Posts List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : postsData && postsData.posts.length > 0 ? (
          <div className="space-y-4">
            {postsData.posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onReact={handleReact}
                onViewComments={() => setSelectedPost(post)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
            <p className="text-gray-500 dark:text-gray-400">No posts found</p>
          </div>
        )}

        {/* Create Post Modal */}
        {showCreateModal && (
          <CreatePostModal
            onClose={() => setShowCreateModal(false)}
            onSuccess={() => {
              setShowCreateModal(false);
              queryClient.invalidateQueries({ queryKey: ['posts'] });
            }}
          />
        )}

        {/* Comments Modal */}
        {selectedPost && (
          <CommentsModal post={selectedPost} onClose={() => setSelectedPost(null)} />
        )}
      </div>
    </div>
  );
}

// Create Post Modal Component
function CreatePostModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [error, setError] = useState('');

  const createMutation = useMutation({
    mutationFn: () => postsAPI.createPost(formData),
    onSuccess: () => {
      onSuccess();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Failed to create post');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.content.trim()) {
      setError('Content is required');
      return;
    }
    createMutation.mutate();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Post</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title (optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter title..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={5}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your thoughts..."
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Comments Modal Component
function CommentsModal({ post, onClose }: { post: Post; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  const { data: commentsData, isLoading } = useQuery<{ comments: Comment[] }>({
    queryKey: ['comments', post.id],
    queryFn: () => postsAPI.getComments(post.id),
  });

  const addCommentMutation = useMutation({
    mutationFn: (data: CreateCommentData) => postsAPI.addComment(post.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setCommentText('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addCommentMutation.mutate({ content: commentText });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">💬 Comments</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : commentsData && commentsData.comments.length > 0 ? (
            commentsData.comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Anonymous {comment.anonymousId?.slice(0, 6)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-800 dark:text-gray-200">{comment.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">No comments yet. Be the first!</p>
          )}
        </div>

        {/* Add Comment Form */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || addCommentMutation.isPending}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {addCommentMutation.isPending ? 'Posting...' : 'Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
