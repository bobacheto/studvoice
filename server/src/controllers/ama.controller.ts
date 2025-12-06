// AMA Controller - HTTP handlers for Ask Me Anything sessions
// Handles request/response, validation, error handling

import { Request, Response } from 'express';
import { AMAService } from '../services/ama.service';
import { AMAQuestionStatus } from '@prisma/client';
import { AppError } from '../utils/errors';
import {
  CreateAMASchema,
  CreateAMAQuestionSchema,
  CreateAMAAnswerSchema,
  UpdateAMAQuestionStatusSchema
} from '../utils/validation';

const amaService = new AMAService();

export class AMAController {
  /**
   * GET /ama - Get all active AMA sessions for user's school
   */
  async getSessions(req: Request, res: Response) {
    try {
      const schoolId = (req as any).user.schoolId;
      const sessions = await amaService.getActiveSessions(schoolId);
      
      res.status(200).json({ sessions });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * POST /ama - Create a new AMA session
   */
  async createSession(req: Request, res: Response) {
    try {
      const validatedData = CreateAMASchema.parse(req.body);
      const { title, description, isActive } = validatedData;
      const user = (req as any).user;

      const session = await amaService.createAMA({
        title,
        description,
        schoolId: user.schoolId,
        createdByUserId: user.userId,
        isActive: isActive !== undefined ? isActive : true
      });

      res.status(201).json({ session });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * POST /ama/:id/questions - Submit a question
   */
  async submitQuestion(req: Request, res: Response) {
    try {
      const validatedData = CreateAMAQuestionSchema.parse(req.body);
      const { id: amaId } = req.params;
      const { content } = validatedData;
      const user = (req as any).user;

      const question = await amaService.submitQuestion({
        amaId,
        anonymousId: user.anonymousId,
        content,
        schoolId: user.schoolId
      });

      res.status(201).json({ question });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * POST /ama/:id/questions/:questionId/answer - Answer a question
   */
  async answerQuestion(req: Request, res: Response) {
    try {
      const validatedData = CreateAMAAnswerSchema.parse(req.body);
      const { questionId } = req.params;
      const { content } = validatedData;
      const user = (req as any).user;

      const answer = await amaService.answerQuestion({
        questionId,
        answeredByUserId: user.userId,
        content,
        schoolId: user.schoolId
      });

      res.status(201).json({ answer });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * PATCH /ama/:id/questions/:questionId/status - Update question status
   */
  async updateQuestionStatus(req: Request, res: Response) {
    try {
      const validatedData = UpdateAMAQuestionStatusSchema.parse(req.body);
      const { questionId } = req.params;
      const { status } = validatedData;
      const user = (req as any).user;

      const question = await amaService.updateQuestionStatus({
        questionId,
        status: status as AMAQuestionStatus,
        schoolId: user.schoolId
      });

      res.status(200).json({ question });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  /**
   * GET /ama/:id/questions - Get all questions for an AMA session
   */
  async getQuestions(req: Request, res: Response) {
    try {
      const { id: amaId } = req.params;
      const user = (req as any).user;

      const questions = await amaService.listQuestions({
        amaId,
        schoolId: user.schoolId
      });

      res.status(200).json({ questions });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
