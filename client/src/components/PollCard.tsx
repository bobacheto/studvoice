import React from 'react';

interface PollCardProps {
  id: string;
  title: string;
  description?: string;
  options: { id: string; text: string; voteCount: number }[];
  totalVotes: number;
  hasVoted?: boolean;
  createdAt: string;
}

/**
 * PollCard Component
 * TODO: Display individual poll
 * TODO: Show poll title and description
 * TODO: Show poll options with vote counts
 * TODO: Show total votes
 * TODO: Allow voting (one vote per anonymousId)
 * TODO: Show results (percentage or counts)
 */
export const PollCard: React.FC<PollCardProps> = ({
  id,
  title,
  description,
  options,
  totalVotes,
  hasVoted,
  createdAt,
}) => {
  // TODO: useState for selected option
  // TODO: useMutation for voting on poll

  const handleVote = (optionId: string) => {
    // TODO: Call API to vote on poll
  };

  const calculatePercentage = (votes: number): number => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-4">{description}</p>}

      <div className="space-y-3">
        {/* TODO: Display poll options */}
        {/* TODO: Show progress bars with percentages */}
        {/* TODO: Show vote counts */}
        {/* TODO: Add vote buttons or radio buttons */}
      </div>

      <div className="text-sm text-gray-500 mt-4">
        Total votes: {totalVotes} | Created: {new Date(createdAt).toLocaleDateString()}
        {hasVoted && <span className="ml-2 font-semibold text-green-600">✓ Voted</span>}
      </div>
    </div>
  );
};
