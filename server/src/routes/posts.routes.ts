import { Router } from 'express';
import { PostsController } from '../controllers/posts.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();
const postsController = new PostsController();

/**
 * GET /posts
 * Retrieve all posts (paginated)
 */
router.get('/', authMiddleware, async (req, res) => {
  // TODO: Call postsController.getPosts
  res.json({ message: 'Get posts endpoint' });
});

/**
 * POST /posts
 * Create a new anonymous post
 * Anonymous posts are linked to anonymousId, not userId
 */
router.post('/', authMiddleware, validationMiddleware, async (req, res) => {
  // TODO: Validate request body
  // TODO: Call postsController.createPost
  res.json({ message: 'Create post endpoint' });
});

/**
 * POST /posts/:id/react
 * Add a reaction (emoji) to a post
 */
router.post('/:id/react', authMiddleware, validationMiddleware, async (req, res) => {
  // TODO: Validate request body
  // TODO: Call postsController.addReaction
  res.json({ message: 'Add reaction endpoint' });
});

/**
 * POST /posts/:id/report
 * Report a post for moderation
 */
router.post('/:id/report', authMiddleware, validationMiddleware, async (req, res) => {
  // TODO: Validate request body
  // TODO: Call postsController.reportPost
  res.json({ message: 'Report post endpoint' });
});

export default router;
