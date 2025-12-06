import { Request, Response } from 'express';
import { PollsService } from '../services/polls.service';

export class PollsController {
  private pollsService: PollsService;

  constructor() {
    this.pollsService = new PollsService();
  }

  /**
   * Get all polls
   * TODO: Extract pagination params, call pollsService.getPolls
   */
  async getPolls(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract page, limit from query params
      // TODO: Call this.pollsService.getPolls()
      // TODO: Return paginated polls
      res.json({ message: 'Polls retrieved successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to retrieve polls' });
    }
  }

  /**
   * Create a new poll
   * Only STUDENT_COUNCIL can create polls
   * TODO: Extract title, options, call pollsService.createPoll
   */
  async createPoll(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract userId from JWT token (to verify STUDENT_COUNCIL role)
      // TODO: Extract title, description (optional), options from request body
      // TODO: Call this.pollsService.createPoll()
      // TODO: Return created poll
      res.status(201).json({ message: 'Poll created successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to create poll' });
    }
  }

  /**
   * Vote on a poll option
   * TODO: Extract pollId, optionId, call pollsService.voteOnPoll
   */
  async voteOnPoll(req: Request, res: Response): Promise<void> {
    try {
      // TODO: Extract pollId from URL params
      // TODO: Extract anonymousId from JWT token
      // TODO: Extract optionId from request body
      // TODO: Call this.pollsService.voteOnPoll()
      // TODO: Return updated poll with vote count
      res.json({ message: 'Vote recorded successfully' });
    } catch (error) {
      // TODO: Handle error
      res.status(500).json({ error: 'Failed to record vote' });
    }
  }
}
