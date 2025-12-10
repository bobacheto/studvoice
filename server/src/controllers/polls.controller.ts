// Polls Controller - HTTP handlers for polls and voting
// Handles request/response, validation, error handling

import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { PollsService } from '../services/polls.service';
import { AppError } from '../utils/errors';
import { CreatePollSchema, VotePollSchema } from '../utils/validation';

const pollsService = new PollsService();

export class PollsController {
  /**
   * GET /polls - Get all active polls for user's school
   */
  async getPolls(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const polls = await pollsService.getPolls(schoolId);
      
      res.status(200).json({ polls });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * POST /polls - Create a new poll
   */
  async createPoll(req: Request, res: Response) {
    try {
      // Validate input
      const validatedData = CreatePollSchema.parse(req.body);
      const { title, description, options, expiresAt } = validatedData;
      const user = (req as any).user;

      const poll = await pollsService.createPoll({
        title,
        description,
        options,
        schoolId: user.schoolId,
        createdByAnonymousId: user.anonymousId,
        expiresAt
      });

      res.status(201).json({ poll });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error instanceof ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * DELETE /polls/:id - Delete a poll
   */
  async deletePoll(req: Request, res: Response) {
    try {
      const { id: pollId } = req.params;

      await pollsService.deletePoll(pollId);

      res.status(200).json({ success: true, message: 'Poll deleted successfully' });
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * POST /polls/:id/vote - Vote on a poll
   */
  async vote(req: Request, res: Response) {
    try {
      // Validate input
      const validatedData = VotePollSchema.parse(req.body);
      const { id: pollId } = req.params;
      const { optionId } = validatedData;
      const user = (req as any).user;

      const result = await pollsService.vote({
        pollId,
        optionId,
        anonymousId: user.anonymousId,
        schoolId: user.schoolId
      });

      res.status(200).json(result);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error instanceof ZodError) {
        res.status(400).json({ error: 'Validation failed', details: error.errors });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
