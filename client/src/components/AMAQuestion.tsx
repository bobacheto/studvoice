import { useState } from 'react';
import { AMAQuestion as AMAQuestionType, AMAStatus } from '../api/ama';

interface AMAQuestionProps {
  question: AMAQuestionType;
  currentUserRole?: string;
  onAnswer: (questionId: string, content: string) => Promise<void> | void;
  onReject: (questionId: string) => Promise<void> | void;
}

const statusStyles: Record<AMAStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  ANSWERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function AMAQuestion({ question, currentUserRole, onAnswer, onReject }: AMAQuestionProps) {
  const [showAnswerBox, setShowAnswerBox] = useState(false);
  const [answerText, setAnswerText] = useState('');

  const canModerate = ['TEACHER', 'STUDENT_COUNCIL', 'DIRECTOR', 'MODERATOR'].includes(
    currentUserRole || '',
  );

  const handleSubmitAnswer = async () => {
    if (!answerText.trim()) return;
    await onAnswer(question.id, answerText.trim());
    setAnswerText('');
    setShowAnswerBox(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{question.content}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Asked on {new Date(question.createdAt).toLocaleString()}
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[question.status]}`}>
          {question.status}
        </span>
      </div>

      {question.status === 'ANSWERED' && question.answer && (
        <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <p className="text-sm text-gray-900 dark:text-white">
            <span className="font-semibold text-blue-700 dark:text-blue-300">Answer:</span>{' '}
            {question.answer.content}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            By {question.answer.answeredBy.firstName} {question.answer.answeredBy.lastName}
          </p>
        </div>
      )}

      {canModerate && question.status === 'PENDING' && (
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setShowAnswerBox((prev) => !prev)}
            className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {showAnswerBox ? 'Cancel' : 'Answer'}
          </button>
          <button
            onClick={() => onReject(question.id)}
            className="px-3 py-1.5 text-sm rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-200"
          >
            Reject
          </button>
        </div>
      )}

      {showAnswerBox && (
        <div className="mt-3 space-y-2">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your answer"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSubmitAnswer}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={!answerText.trim()}
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
