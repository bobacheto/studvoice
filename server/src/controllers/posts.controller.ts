// Posts Controller - HTTP request handlers for posts and reactions
// Validates input and calls service layer

import { Request, Response } from 'express';
import { postsService } from '../services/posts.service';
import { CreatePostSchema, UpdatePostStatusSchema, CreateReactionSchema } from '../utils/validation';
import { IdeaStatus } from '@prisma/client';

export class PostsController {
  /**
   * GET /posts - Get all posts for user's school
   */
  async getPosts(req: Request, res: Response): Promise<void> {
    try {
      const schoolId = req.user!.schoolId;
      const status = req.query.status as IdeaStatus | undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;

      const posts = await postsService.getPosts(schoolId, { status, limit, offset });

      res.status(200).json({
        status: 'success',
        data: { posts },
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to retrieve posts',
      });
    }
  }

  /**
   * GET /posts/:id - Get a single post by ID
   */
  async getPostById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const post = await postsService.getPostById(id);

      res.status(200).json({
        status: 'success',
        data: { post },
      });
    } catch (error: any) {
      if (error.message === 'POST_NOT_FOUND') {
        res.status(404).json({
          status: 'error',
          message: 'Post not found',
        });
        return;
      }

      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to retrieve post',
      });
    }
  }

  /**
   * POST /posts - Create a new post
   */
  async createPost(req: Request, res: Response): Promise<void> {
    try {
      // Validate input
      const validation = CreatePostSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.error.errors,
        });
        return;
      }

      const { title, content } = validation.data;
      const anonymousId = req.user!.anonymousId;
      const schoolId = req.user!.schoolId;

      const post = await postsService.createPost({
        anonymousId,
        schoolId,
        title,
        content,
      });

      res.status(201).json({
        status: 'success',
        data: { post },
      });
    } catch (error: any) {
      if (error.message === 'USER_BANNED') {
        res.status(403).json({
          status: 'error',
          message: 'You are banned and cannot create posts',
        });
        return;
      }

      if (error.message === 'USER_MUTED') {
        res.status(403).json({
          status: 'error',
          message: 'You are muted and cannot create posts',
        });
        return;
      }

      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to create post',
      });
    }
  }

  /**
   * PATCH /posts/:id/status - Update post status (moderators only)
   */
  async updatePostStatus(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate input
      const validation = UpdatePostStatusSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.error.errors,
        });
        return;
      }

      const { status } = validation.data;

      const updatedPost = await postsService.updatePostStatus(id, status as IdeaStatus);

      res.status(200).json({
        status: 'success',
        data: { post: updatedPost },
      });
    } catch (error: any) {
      if (error.message === 'POST_NOT_FOUND') {
        res.status(404).json({
          status: 'error',
          message: 'Post not found',
        });
        return;
      }

      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to update post status',
      });
    }
  }

  /**
   * POST /posts/:id/reactions - Toggle reaction on a post
   */
  async toggleReaction(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Validate input
      const validation = CreateReactionSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.error.errors,
        });
        return;
      }

      const { type } = validation.data;
      const anonymousId = req.user!.anonymousId;

      const result = await postsService.toggleReaction({
        postId: id,
        anonymousId,
        type: type as any,
      });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error: any) {
      if (error.message === 'POST_NOT_FOUND') {
        res.status(404).json({
          status: 'error',
          message: 'Post not found',
        });
        return;
      }

      if (error.message === 'USER_BANNED' || error.message === 'USER_MUTED') {
        res.status(403).json({
          status: 'error',
          message: 'You cannot react to posts',
        });
        return;
      }

      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to toggle reaction',
      });
    }
  }
}

export const postsController = new PostsController();
