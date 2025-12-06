// Comments Routes - Define HTTP endpoints for comments

import { Router } from 'express';
import { commentsController } from '../controllers/comments.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /posts/:postId/comments
 * Get all comments for a post
 * Query params: limit?, offset?
 */
router.get('/posts/:postId/comments', commentsController.getComments.bind(commentsController));

/**
 * POST /posts/:postId/comments
 * Create a comment on a post
 * Body: { content }
 */
router.post('/posts/:postId/comments', commentsController.createComment.bind(commentsController));

export default router;
