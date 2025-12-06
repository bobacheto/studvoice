import React from 'react';

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participantCount: number;
  isParticipating?: boolean;
  reward?: string;
}

/**
 * ChallengeCard Component
 * TODO: Display individual challenge
 * TODO: Show challenge title and description
 * TODO: Show start and end dates
 * TODO: Show participant count
 * TODO: Allow joining/participating
 * TODO: Show status (active/completed)
 */
export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  id,
  title,
  description,
  startDate,
  endDate,
  participantCount,
  isParticipating,
  reward,
}) => {
  // TODO: useState for participating
  // TODO: useMutation for joining challenge

  const handleJoinChallenge = () => {
    // TODO: Call API to join challenge
  };

  const isActive = new Date(startDate) <= new Date() && new Date() <= new Date(endDate);

  return (
    <div className="border rounded-lg p-4 mb-4 shadow">
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{description}</p>

      <div className="mb-4">
        <p className="text-sm text-gray-600">
          📅 {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600">👥 {participantCount} participants</p>
        {reward && <p className="text-sm text-green-600 font-semibold">🎁 {reward}</p>}
      </div>

      {isActive && !isParticipating && (
        <button
          onClick={handleJoinChallenge}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Join Challenge
        </button>
      )}
      {isParticipating && <div className="text-green-600 font-semibold">✓ Participating</div>}
      {!isActive && <div className="text-gray-500">Challenge ended</div>}

      {/* TODO: Show progress if user is participating */}
    </div>
  );
};
