// Comments Controller - HTTP request handlers for comments
// Validates input and calls service layer

import { Request, Response } from 'express';
import { commentsService } from '../services/comments.service';
import { CreateCommentSchema } from '../utils/validation';

export class CommentsController {
  /**
   * GET /posts/:postId/comments - Get all comments for a post
   */
  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;
      const schoolId = req.user!.schoolId;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

      const comments = await commentsService.getCommentsByPostId(postId, schoolId, limit, offset);

      res.status(200).json({ comments });
    } catch (error: any) {
      if (error.message === 'POST_NOT_FOUND') {
        res.status(404).json({
          status: 'error',
          message: 'Post not found',
        });
        return;
      }

      if (error.message === 'UNAUTHORIZED_ACCESS') {
        res.status(403).json({
          status: 'error',
          message: 'You cannot access comments from other schools',
        });
        return;
      }

      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to retrieve comments',
      });
    }
  }

  /**
   * POST /posts/:postId/comments - Create a comment on a post
   */
  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const { postId } = req.params;

      // Validate input
      const validation = CreateCommentSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.error.errors,
        });
        return;
      }

      const { content } = validation.data;
      const anonymousId = req.user!.anonymousId;
      const schoolId = req.user!.schoolId;

      const comment = await commentsService.createComment({
        postId,
        anonymousId,
        schoolId,
        content,
      });

      res.status(201).json({ comment });
    } catch (error: any) {
      if (error.message === 'POST_NOT_FOUND') {
        res.status(404).json({
          status: 'error',
          message: 'Post not found',
        });
        return;
      }

      if (error.message === 'UNAUTHORIZED_ACCESS') {
        res.status(403).json({
          status: 'error',
          message: 'You cannot comment on posts from other schools',
        });
        return;
      }

      if (error.message === 'USER_BANNED') {
        res.status(403).json({
          status: 'error',
          message: 'You are banned and cannot create comments',
        });
        return;
      }

      if (error.message === 'USER_MUTED') {
        res.status(403).json({
          status: 'error',
          message: 'You are muted and cannot create comments',
        });
        return;
      }

      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to create comment',
      });
    }
  }
}

export const commentsController = new CommentsController();
