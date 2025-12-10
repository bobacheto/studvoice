import { useMemo, useState } from 'react';
import { Poll } from '../api/polls';

interface PollCardProps {
  poll: Poll;
  onVote: (pollId: string, optionId: string) => Promise<void> | void;
  isVoting?: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
}

export default function PollCard({ poll, onVote, isVoting, onDelete, isDeleting }: PollCardProps) {
  const [localVotedOptionId, setLocalVotedOptionId] = useState<string | null>(
    poll.votedOptionId || null,
  );

  const totalVotes = useMemo(
    () => poll.options.reduce((sum, option) => sum + option.voteCount, 0),
    [poll.options],
  );

  const hasVoted = Boolean(localVotedOptionId);

  const handleVote = async (optionId: string) => {
    if (hasVoted) return;
    setLocalVotedOptionId(optionId);
    await onVote(poll.id, optionId);
  };

  const percentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{poll.title}</h3>
          {poll.description && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{poll.description}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {poll.expiresAt && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Expires {new Date(poll.expiresAt).toLocaleDateString()}
            </span>
          )}
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

      <div className="space-y-2">
        {poll.options.map((option) => {
          const isChosen = localVotedOptionId === option.id;
          return (
            <div
              key={option.id}
              className={`rounded-lg border border-gray-200 dark:border-gray-700 p-3 ${
                isChosen ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400' : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{option.text}</p>
                  <div className="mt-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-2 bg-blue-500"
                      style={{ width: `${percentage(option.voteCount)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {option.voteCount}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {percentage(option.voteCount)}%
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => handleVote(option.id)}
                  disabled={hasVoted || isVoting}
                  className="px-3 py-1.5 text-sm rounded-lg font-medium border border-blue-500 text-blue-600 hover:bg-blue-50 dark:text-blue-300 dark:border-blue-400 dark:hover:bg-blue-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {hasVoted ? (isChosen ? 'Voted' : 'Vote') : 'Vote'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>Total votes: {totalVotes}</span>
        {hasVoted && <span className="text-green-600 dark:text-green-400 font-semibold">You voted</span>}
      </div>
    </div>
  );
}
