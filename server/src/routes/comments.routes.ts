import { Router } from 'express';
import { CommentsController } from '../controllers/comments.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();
const commentsController = new CommentsController();

/**
 * POST /comments
 * Add a comment to a post (anonymous)
 */
router.post('/', authMiddleware, validationMiddleware, async (req, res) => {
  // TODO: Validate request body (postId, content)
  // TODO: Call commentsController.createComment
  res.json({ message: 'Create comment endpoint' });
});

export default router;
