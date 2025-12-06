import { Router } from 'express';
import { PollsController } from '../controllers/polls.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();
const pollsController = new PollsController();

/**
 * GET /polls
 * Retrieve all polls
 */
router.get('/', authMiddleware, async (req, res) => {
  // TODO: Call pollsController.getPolls
  res.json({ message: 'Get polls endpoint' });
});

/**
 * POST /polls
 * Create a new poll (only STUDENT_COUNCIL can create)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['STUDENT_COUNCIL']),
  validationMiddleware,
  async (req, res) => {
    // TODO: Validate request body
    // TODO: Call pollsController.createPoll
    res.json({ message: 'Create poll endpoint' });
  }
);

/**
 * POST /polls/:id/vote
 * Vote on a poll option
 */
router.post('/:id/vote', authMiddleware, validationMiddleware, async (req, res) => {
  // TODO: Validate request body (optionId)
  // TODO: Call pollsController.voteOnPoll
  res.json({ message: 'Vote on poll endpoint' });
});

export default router;
