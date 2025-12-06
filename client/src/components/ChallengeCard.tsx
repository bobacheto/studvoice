import { Challenge, ChallengeSubmission } from '../api/challenges';

interface ChallengeCardProps {
  challenge: Challenge;
  onSubmit: (challengeId: string) => void;
  onViewSubmissions: (challengeId: string) => void;
  currentRole?: string;
}

export default function ChallengeCard({ challenge, onSubmit, onViewSubmissions, currentRole }: ChallengeCardProps) {
  const now = new Date();
  const startDate = new Date(challenge.startAt);
  const endDate = new Date(challenge.endAt);
  const isActive = challenge.isActive && startDate <= now && now <= endDate;

  const canViewSubmissions = ['STUDENT_COUNCIL', 'TEACHER', 'DIRECTOR', 'MODERATOR'].includes(
    currentRole || '',
  );

  const typeBadge = (type: Challenge['type']) => {
    switch (type) {
      case 'GRATITUDE':
        return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      case 'IDEA_SPRINT':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'PROBLEM_SOLVER':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    }
  };

  const statusBadge = isActive
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : now < startDate
    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${typeBadge(challenge.type)}`}>
          {challenge.type}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusBadge}`}>
          {isActive ? 'Active' : now < startDate ? 'Upcoming' : 'Ended'}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{challenge.title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{challenge.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
        <span>Start: {startDate.toLocaleDateString()}</span>
        <span>End: {endDate.toLocaleDateString()}</span>
        <span>Submissions: {challenge._count?.submissions || 0}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => onSubmit(challenge.id)}
          disabled={!isActive || currentRole !== 'STUDENT'}
          className="flex-1 px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Submit entry
        </button>

        {canViewSubmissions && (
          <button
            onClick={() => onViewSubmissions(challenge.id)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            View submissions
          </button>
        )}
      </div>
    </div>
  );
}
