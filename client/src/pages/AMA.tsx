import React from 'react';
import { Layout } from '../components/Layout';

/**
 * AMA Page
 * TODO: Display list of all AMA sessions
 * TODO: Allow submitting questions to active AMA sessions (anonymous)
 * TODO: Show questions and answers
 * TODO: Only STUDENT_COUNCIL can create AMA sessions
 */
export const AMA: React.FC = () => {
  // TODO: useState for AMA sessions list
  // TODO: useState for selected AMA session
  // TODO: useQuery hook to fetch AMA sessions from API
  // TODO: useMutation hook for submitting question
  // TODO: useAuth hook to check if user can create AMA sessions

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Ask Me Anything (AMA)</h1>
        {/* TODO: Create AMA session button (only for STUDENT_COUNCIL) */}
        {/* TODO: Display AMA sessions list */}
        {/* TODO: Add question form for active AMA sessions */}
        {/* TODO: Display questions and answers */}
      </div>
    </Layout>
  );
};

export default AMA;
