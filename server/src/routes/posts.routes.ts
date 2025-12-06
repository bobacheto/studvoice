// Posts Routes - Define HTTP endpoints for posts and reactions

import { Router } from 'express';
import { postsController } from '../controllers/posts.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * GET /posts
 * Get all posts for user's school
 * Query params: status?, limit?, offset?
 */
router.get('/', postsController.getPosts.bind(postsController));

/**
 * GET /posts/:id
 * Get a single post by ID
 */
router.get('/:id', postsController.getPostById.bind(postsController));

/**
 * POST /posts
 * Create a new post
 * Body: { title?, content }
 */
router.post('/', postsController.createPost.bind(postsController));

/**
 * PATCH /posts/:id/status
 * Update post status (moderators/student council only)
 * Body: { status: IdeaStatus }
 */
router.patch(
  '/:id/status',
  roleMiddleware(['MODERATOR', 'STUDENT_COUNCIL', 'DIRECTOR', 'ADMIN']),
  postsController.updatePostStatus.bind(postsController)
);

/**
 * POST /posts/:id/reactions
 * Toggle reaction on a post
 * Body: { type: ReactionType }
 */
router.post('/:id/reactions', postsController.toggleReaction.bind(postsController));

export default router;
