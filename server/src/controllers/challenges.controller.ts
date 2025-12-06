// Challenges Controller - HTTP handlers for gamification challenges
// Handles request/response, validation, error handling

import { Request, Response } from 'express';
import { ChallengesService } from '../services/challenges.service';
import { ChallengeType } from '@prisma/client';
import { AppError } from '../utils/errors';
import { CreateChallengeSchema, CreateChallengeSubmissionSchema } from '../utils/validation';

const challengesService = new ChallengesService();

export class ChallengesController {
  /**
   * GET /challenges - Get active challenges for user's school
   */
  async getChallenges(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const challenges = await challengesService.getActiveChallenges(schoolId);
      
      res.status(200).json({ challenges });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * POST /challenges - Create a new challenge
   */
  async createChallenge(req: Request, res: Response) {
    try {
      const validatedData = CreateChallengeSchema.parse(req.body);
      const { title, description, type, startAt, endAt, isActive } = validatedData;
      const user = (req as any).user;

      const challenge = await challengesService.createChallenge({
        title,
        description,
        type: type as ChallengeType,
        schoolId: user.schoolId,
        createdByUserId: user.userId,
        startAt,
        endAt,
        isActive: isActive !== undefined ? isActive : true
      });

      res.status(201).json({ challenge });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * POST /challenges/:id/submit - Submit to a challenge
   */
  async submit(req: Request, res: Response) {
    try {
      const validatedData = CreateChallengeSubmissionSchema.parse(req.body);
      const { id: challengeId } = req.params;
      const { content } = validatedData;
      const user = (req as any).user;

      const submission = await challengesService.submitToChallenge({
        challengeId,
        anonymousId: user.anonymousId,
        content,
        schoolId: user.schoolId
      });

      res.status(201).json({ submission });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * GET /challenges/:id/submissions - Get all submissions (moderators only)
   */
  async getSubmissions(req: Request, res: Response) {
    try {
      const { id: challengeId } = req.params;
      const user = (req as any).user;

      const submissions = await challengesService.getSubmissions({
        challengeId,
        schoolId: user.schoolId
      });

      res.status(200).json({ submissions });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
