import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ChallengeCard from '../components/ChallengeCard';
import {
  challengesAPI,
  Challenge,
  ChallengeSubmission,
  CreateChallengePayload,
} from '../api/challenges';
import { useAuth } from '../context/AuthContext';

const CREATOR_ROLES = ['STUDENT_COUNCIL', 'TEACHER', 'DIRECTOR', 'MODERATOR'];

export default function Challenges() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitChallengeId, setSubmitChallengeId] = useState<string | null>(null);
  const [viewSubmissionsId, setViewSubmissionsId] = useState<string | null>(null);

  const { data: challenges, isLoading } = useQuery<Challenge[]>({
    queryKey: ['challenges'],
    queryFn: () => challengesAPI.getChallenges(),
  });

  const submissionsQuery = useQuery<ChallengeSubmission[]>({
    queryKey: ['challenge-submissions', viewSubmissionsId],
    queryFn: () => challengesAPI.getChallengeSubmissions(viewSubmissionsId as string),
    enabled: Boolean(viewSubmissionsId),
  });

  const createMutation = useMutation({
    mutationFn: challengesAPI.createChallenge,
    onSuccess: () => {
      setShowCreateModal(false);
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });

  const submitMutation = useMutation({
    mutationFn: ({ challengeId, content }: { challengeId: string; content: string }) =>
      challengesAPI.submitChallenge(challengeId, { content }),
    onSuccess: () => {
      setSubmitChallengeId(null);
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      if (viewSubmissionsId) {
        queryClient.invalidateQueries({ queryKey: ['challenge-submissions', viewSubmissionsId] });
      }
    },
  });

  const canCreateChallenge = user && CREATOR_ROLES.includes(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🎯 Challenges</h1>
          {canCreateChallenge && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              + Create Challenge
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : challenges && challenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onSubmit={(id) => setSubmitChallengeId(id)}
                onViewSubmissions={(id) => setViewSubmissionsId(id)}
                currentRole={user?.role}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
            <p className="text-gray-500 dark:text-gray-400">No active challenges right now</p>
          </div>
        )}

        {showCreateModal && (
          <CreateChallengeModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={(payload) => createMutation.mutate(payload)}
            isSubmitting={createMutation.isPending}
            error={createMutation.error as any}
          />
        )}

        {submitChallengeId && (
          <SubmitEntryModal
            challengeId={submitChallengeId}
            onClose={() => setSubmitChallengeId(null)}
            onSubmit={(content) => submitMutation.mutate({ challengeId: submitChallengeId, content })}
            isSubmitting={submitMutation.isPending}
          />
        )}

        {viewSubmissionsId && (
          <SubmissionsModal
            onClose={() => setViewSubmissionsId(null)}
            submissions={submissionsQuery.data || []}
            isLoading={submissionsQuery.isLoading}
          />
        )}
      </div>
    </div>
  );
}

function CreateChallengeModal({
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  onClose: () => void;
  onSubmit: (payload: CreateChallengePayload) => void;
  isSubmitting: boolean;
  error: any;
}) {
  const [form, setForm] = useState<CreateChallengePayload>({
    title: '',
    description: '',
    type: 'CUSTOM',
    startAt: '',
    endAt: '',
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Title is required');
      return;
    }
    if (!form.startAt || !form.endAt) {
      setFormError('Start and end dates are required');
      return;
    }
    setFormError('');
    onSubmit({ ...form, title: form.title.trim(), description: form.description.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create Challenge</h2>
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
            {(error as any)?.response?.data?.error || 'Failed to create challenge'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="GRATITUDE">Gratitude</option>
              <option value="IDEA_SPRINT">Idea Sprint</option>
              <option value="PROBLEM_SOLVER">Problem Solver</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start At
              </label>
              <input
                type="datetime-local"
                value={form.startAt}
                onChange={(e) => setForm({ ...form, startAt: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End At
              </label>
              <input
                type="datetime-local"
                value={form.endAt}
                onChange={(e) => setForm({ ...form, endAt: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
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
              {isSubmitting ? 'Creating...' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SubmitEntryModal({
  challengeId,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  challengeId: string;
  onClose: () => void;
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
}) {
  const [content, setContent] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submit Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Entry
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your anonymous submission"
              required
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
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SubmissionsModal({
  submissions,
  isLoading,
  onClose,
}: {
  submissions: ChallengeSubmission[];
  isLoading: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Submissions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              ))}
            </div>
          ) : submissions.length > 0 ? (
            submissions.map((submission) => (
              <div key={submission.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    Anonymous {submission.anonymousId.slice(0, 6)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(submission.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">{submission.content}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No submissions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
