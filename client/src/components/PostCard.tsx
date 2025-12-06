import React from 'react';

interface PostCardProps {
  id: string;
  content: string;
  title?: string;
  createdAt: string;
  reactions?: { emoji: string; count: number }[];
  commentCount: number;
  status?: string;
}

/**
 * PostCard Component
 * TODO: Display individual post
 * TODO: Show content and title
 * TODO: Show creation date
 * TODO: Show reactions with counts
 * TODO: Show comment count
 * TODO: Allow adding reactions
 * TODO: Allow reporting post
 * TODO: Allow viewing/adding comments
 */
export const PostCard: React.FC<PostCardProps> = ({
  id,
  content,
  title,
  createdAt,
  reactions,
  commentCount,
  status,
}) => {
  // TODO: useState for showing comments
  // TODO: useState for reaction selection
  // TODO: useMutation for adding reaction
  // TODO: useMutation for reporting post

  const handleAddReaction = (emoji: string) => {
    // TODO: Call API to add reaction
  };

  const handleReportPost = () => {
    // TODO: Show report reason dialog
    // TODO: Call API to report post
  };

  const handleToggleComments = () => {
    // TODO: Toggle comments visibility
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow">
      {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
      <p className="text-gray-700 mb-4">{content}</p>
      <div className="text-sm text-gray-500 mb-3">
        Posted on {new Date(createdAt).toLocaleDateString()}
        {status && <span className="ml-2 font-semibold text-blue-600">{status}</span>}
      </div>

      {/* TODO: Display reactions */}
      {/* TODO: Display add reaction buttons/emoji picker */}
      {/* TODO: Display comment count and toggle */}
      {/* TODO: Display report button */}
    </div>
  );
};
