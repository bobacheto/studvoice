import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import PollCard from '../components/PollCard';
import { pollsAPI, Poll } from '../api/polls';
import { useAuth } from '../context/AuthContext';
import { CreateFloatingButton } from '../components/create-floating-button';

const CREATOR_ROLES = ['STUDENT_COUNCIL', 'MODERATOR', 'TEACHER', 'DIRECTOR'];

export default function Polls() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [votedMap, setVotedMap] = useState<Record<string, string>>({});

  const { data: pollsResponse, isLoading } = useQuery<{ polls: Poll[] }>({
    queryKey: ['polls'],
    queryFn: () => pollsAPI.getPolls().then(polls => ({ polls })),
  });

  const voteMutation = useMutation({
    mutationFn: ({ pollId, optionId }: { pollId: string; optionId: string }) =>
      pollsAPI.votePoll(pollId, optionId),
    onSuccess: (_, variables) => {
      setVotedMap((prev) => ({ ...prev, [variables.pollId]: variables.optionId }));
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });

  const createMutation = useMutation({
    mutationFn: pollsAPI.createPoll,
    onSuccess: () => {
      setShowCreateModal(false);
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (pollId: string) => pollsAPI.deletePoll(pollId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
  });

  const handleVote = async (pollId: string, optionId: string) => {
    await voteMutation.mutateAsync({ pollId, optionId });
  };

  const canCreatePoll = user && CREATOR_ROLES.includes(user.role);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 Анкети</h1>
          {canCreatePoll && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              + Нова анкета
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : pollsResponse && pollsResponse.polls && pollsResponse.polls.length > 0 ? (
          <div className="space-y-4">
            {pollsResponse.polls.map((poll) => (
              <PollCard
                key={poll.id}
                poll={{ ...poll, votedOptionId: votedMap[poll.id] }}
                onVote={handleVote}
                isVoting={voteMutation.isPending}
                onDelete={() => deleteMutation.mutate(poll.id)}
                isDeleting={deleteMutation.isPending}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow">
            <p className="text-gray-500 dark:text-gray-400">Няма анкети</p>
          </div>
        )}

        <CreateFloatingButton
          onClick={() => setShowCreateModal(true)}
          label="Нова анкета"
        />

        {showCreateModal && (
          <CreatePollModal
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

interface CreatePollForm {
  title: string;
  description: string;
  options: string[];
  expiresAt?: string;
}

function CreatePollModal({
  onClose,
  onSubmit,
  isSubmitting,
  error,
}: {
  onClose: () => void;
  onSubmit: (payload: Omit<CreatePollForm, 'options'> & { options: string[] }) => void;
  isSubmitting: boolean;
  error: any;
}) {
  const [form, setForm] = useState<CreatePollForm>({
    title: '',
    description: '',
    options: ['', ''],
    expiresAt: '',
  });
  const [formError, setFormError] = useState('');

  const handleOptionChange = (index: number, value: string) => {
    const next = [...form.options];
    next[index] = value;
    setForm({ ...form, options: next });
  };

  const addOption = () => {
    if (form.options.length >= 6) return;
    setForm({ ...form, options: [...form.options, ''] });
  };

  const removeOption = (index: number) => {
    if (form.options.length <= 2) return;
    setForm({ ...form, options: form.options.filter((_, i) => i !== index) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedOptions = form.options.map((opt) => opt.trim()).filter(Boolean);
    if (!form.title.trim()) {
      setFormError('Question is required');
      return;
    }
    if (cleanedOptions.length < 2) {
      setFormError('At least two options are required');
      return;
    }
    setFormError('');
    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      options: cleanedOptions,
      expiresAt: form.expiresAt || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Създай анкета</h2>
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
            {(error as any)?.response?.data?.error || 'Неуспешно създаване на анкета'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Въпрос
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Какъв е твоят въпрос?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Описание (опционално)
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Варианти</label>
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                + Добави вариант
              </button>
            </div>
            {form.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Вариант ${idx + 1}`}
                  required
                />
                {form.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(idx)}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Изтича в (опционално)
            </label>
            <input
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Отмяна
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Създаване...' : 'Създай анкета'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
