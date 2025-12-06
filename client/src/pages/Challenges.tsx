import React from 'react';
import { Layout } from '../components/Layout';

/**
 * Challenges Page
 * TODO: Display list of all challenges
 * TODO: Allow participating in challenges (anonymous)
 * TODO: Show challenge progress and leaderboard (anonymous)
 * TODO: Only STUDENT_COUNCIL can create challenges
 */
export const Challenges: React.FC = () => {
  // TODO: useState for challenges list
  // TODO: useQuery hook to fetch challenges from API
  // TODO: useMutation hook for participating in challenge
  // TODO: useAuth hook to check if user can create challenges

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Challenges</h1>
        {/* TODO: Create challenge button (only for STUDENT_COUNCIL) */}
        {/* TODO: Display challenges list */}
        {/* TODO: Add ChallengeCard component for each challenge */}
        {/* TODO: Show challenge details and participation form */}
      </div>
    </Layout>
  );
};

export default Challenges;
