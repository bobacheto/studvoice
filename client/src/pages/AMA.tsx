import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  amaAPI,
  AMASession,
  AMAQuestion as AMAQuestionType,
} from '../api/ama';
import { useAuth } from '../context/AuthContext';
import AMAQuestion from '../components/AMAQuestion';

const CREATOR_ROLES = ['TEACHER', 'STUDENT_COUNCIL', 'DIRECTOR', 'MODERATOR'];

export default function AMA() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [questionText, setQuestionText] = useState('');

  const { data: sessions, isLoading: sessionsLoading } = useQuery<AMASession[]>({
    queryKey: ['ama-sessions'],
    queryFn: () => amaAPI.getActiveAMA(),
  });

  useEffect(() => {
    if (!selectedSessionId && sessions && sessions.length > 0) {
      setSelectedSessionId(sessions[0].id);
    }
  }, [sessions, selectedSessionId]);

  const { data: questions, isLoading: questionsLoading } = useQuery<AMAQuestionType[]>({
    queryKey: ['ama-questions', selectedSessionId],
    queryFn: () => amaAPI.getAMAQuestions(selectedSessionId as string),
    enabled: Boolean(selectedSessionId),
  });

  const createMutation = useMutation({
    mutationFn: amaAPI.createAMA,
    onSuccess: (session) => {
      setShowCreateModal(false);
      setSelectedSessionId(session.id);
      queryClient.invalidateQueries({ queryKey: ['ama-sessions'] });
    },
  });

  const askMutation = useMutation({
    mutationFn: (content: string) => amaAPI.askQuestion(selectedSessionId as string, { content }),
    onSuccess: () => {
      setQuestionText('');
      queryClient.invalidateQueries({ queryKey: ['ama-questions', selectedSessionId] });
    },
  });

  const answerMutation = useMutation({
    mutationFn: ({ questionId, content }: { questionId: string; content: string }) =>
      amaAPI.answerQuestion(selectedSessionId as string, questionId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ama-questions', selectedSessionId] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (questionId: string) =>
      amaAPI.updateQuestionStatus(selectedSessionId as string, questionId, 'REJECTED'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ama-questions', selectedSessionId] });
    },
  });

  const canCreateAMA = user && CREATOR_ROLES.includes(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">💬 AMA</h1>
          {canCreateAMA && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              + Create AMA
            </button>
          )}
        </div>

        {sessionsLoading ? (
          <SessionsSkeleton />
        ) : sessions && sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`rounded-xl border border-gray-200 dark:border-gray-700 p-4 cursor-pointer hover:shadow ${
                  selectedSessionId === session.id
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
                    : 'bg-white dark:bg-gray-800'
                }`}
                onClick={() => setSelectedSessionId(session.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{session.title}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </span>
                </div>
                {session.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{session.description}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Host: {session.createdBy.firstName} {session.createdBy.lastName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
            <p className="text-gray-500 dark:text-gray-400">No AMA sessions available</p>
          </div>
        )}

        {selectedSessionId && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Questions</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {questions?.length || 0} questions
              </span>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ask a question
              </label>
              <div className="flex items-start gap-3">
                <textarea
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  rows={2}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type your question (anonymous)"
                />
                <button
                  onClick={() => askMutation.mutate(questionText)}
                  disabled={!questionText.trim() || askMutation.isPending}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {askMutation.isPending ? 'Sending...' : 'Ask'}
                </button>
              </div>
            </div>

            {questionsLoading ? (
              <QuestionsSkeleton />
            ) : questions && questions.length > 0 ? (
              <div className="space-y-3">
                {questions.map((question) => (
                  <AMAQuestion
                    key={question.id}
                    question={question}
                    currentUserRole={user?.role}
                    onAnswer={(id, content) => answerMutation.mutate({ questionId: id, content })}
                    onReject={(id) => rejectMutation.mutate(id)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No questions yet</p>
            )}
          </div>
        )}

        {showCreateModal && (
          <CreateAMAModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={(payload) => createMutation.mutate(payload)}
            isSubmitting={createMutation.isPending}
            error={createMutation.error as any}
          />
        )}
      </div>
    </div>
  );
}

function SessionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 animate-pulse">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

function QuestionsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

function CreateAMAModal({
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  onClose: () => void;
  onSubmit: (payload: { title: string; description: string }) => void;
  isSubmitting: boolean;
  error: any;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Title is required');
      return;
    }
    setFormError('');
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create AMA</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {formError && (
          <div className="mb-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 px-4 py-2 rounded-lg text-sm">
            {formError}
          </div>
        )}

        {error && (
          <div className="mb-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 px-4 py-2 rounded-lg text-sm">
            {(error as any)?.response?.data?.error || 'Failed to create AMA'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ask Me Anything with..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create AMA'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
