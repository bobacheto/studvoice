import React from 'react';
import { Layout } from '../components/Layout';

/**
 * Polls Page
 * TODO: Display list of all polls
 * TODO: Allow voting on polls (anonymous)
 * TODO: Show vote results (only after voting or poll is closed)
 * TODO: Only STUDENT_COUNCIL can create polls
 */
export const Polls: React.FC = () => {
  // TODO: useState for polls list
  // TODO: useState for poll filter (active/closed)
  // TODO: useQuery hook to fetch polls from API
  // TODO: useMutation hook for voting on poll
  // TODO: useAuth hook to check if user can create polls

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Polls</h1>
        {/* TODO: Create poll button (only for STUDENT_COUNCIL) */}
        {/* TODO: Display polls list */}
        {/* TODO: Add PollCard component for each poll */}
        {/* TODO: Add vote form on each poll */}
      </div>
    </Layout>
  );
};

export default Polls;
