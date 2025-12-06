import { PollRepository } from '../repositories/poll.repository';

export class PollsService {
  private pollRepository: PollRepository;

  constructor() {
    this.pollRepository = new PollRepository();
  }

  /**
   * Get all polls (paginated)
   * TODO: Call repository to fetch polls
   * TODO: Include poll options and vote counts
   * TODO: Return paginated polls
   */
  async getPolls(page: number, limit: number): Promise<any> {
    try {
      // TODO: Call this.pollRepository.findAll()
      // TODO: Apply pagination
      // TODO: Return polls
      return { message: 'Get polls service' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new poll
   * Only STUDENT_COUNCIL can create
   * TODO: Validate title and options
   * TODO: Create poll with options
   */
  async createPoll(title: string, description: string | null, options: string[]): Promise<any> {
    try {
      // TODO: Validate title and options
      // TODO: Call this.pollRepository.create()
      // TODO: Create poll options
      // TODO: Return created poll
      return { message: 'Create poll service' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Vote on a poll option
   * TODO: Register vote for anonymousId
   * TODO: Check if already voted
   */
  async voteOnPoll(pollId: string, optionId: string, anonymousId: string): Promise<any> {
    try {
      // TODO: Check if anonymousId already voted on this poll
      // TODO: Register vote
      // TODO: Call this.pollRepository.addVote()
      // TODO: Return updated poll with vote count
      return { message: 'Vote on poll service' };
    } catch (error) {
      throw error;
    }
  }
}
