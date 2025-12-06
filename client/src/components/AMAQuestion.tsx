import React from 'react';

interface AMAQuestionProps {
  id: string;
  question: string;
  answer?: string;
  createdAt: string;
  answeredAt?: string;
  likes?: number;
}

/**
 * AMAQuestion Component
 * TODO: Display individual AMA question
 * TODO: Show question text
 * TODO: Show answer if available
 * TODO: Show creation date
 * TODO: Allow liking questions
 * TODO: Show question status (answered/pending)
 */
export const AMAQuestion: React.FC<AMAQuestionProps> = ({
  id,
  question,
  answer,
  createdAt,
  answeredAt,
  likes,
}) => {
  // TODO: useState for likes
  // TODO: useMutation for liking question

  const handleLike = () => {
    // TODO: Call API to like question
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow">
      <div className="mb-3">
        <p className="text-gray-800 font-semibold mb-2">Q: {question}</p>
        <div className="text-sm text-gray-500">Asked on {new Date(createdAt).toLocaleDateString()}</div>
      </div>

      {answer ? (
        <div className="bg-blue-50 p-3 rounded mb-3">
          <p className="text-gray-800">
            <span className="font-semibold text-blue-700">A: </span>
            {answer}
          </p>
          {answeredAt && (
            <div className="text-sm text-gray-500 mt-2">
              Answered on {new Date(answeredAt).toLocaleDateString()}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 p-3 rounded mb-3">
          <p className="text-yellow-700 text-sm">⏳ Awaiting answer...</p>
        </div>
      )}

      {/* TODO: Display likes count */}
      {/* TODO: Add like button */}
    </div>
  );
};
