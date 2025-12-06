// Polls Routes - Define HTTP endpoints for polls and voting
// Wire controllers with authentication and authorization middleware

import { Router } from 'express';
import { PollsController } from '../controllers/polls.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();
const pollsController = new PollsController();

// GET /polls - Get all active polls (all authenticated users)
router.get(
  '/',
  authMiddleware,
  (req, res) => pollsController.getPolls(req, res)
);

// POST /polls - Create a new poll (STUDENT_COUNCIL, MODERATOR, TEACHER, DIRECTOR)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['STUDENT_COUNCIL', 'MODERATOR', 'TEACHER', 'DIRECTOR', 'ADMIN']),
  (req, res) => pollsController.createPoll(req, res)
);

// POST /polls/:id/vote - Vote on a poll (all authenticated users)
router.post(
  '/:id/vote',
  authMiddleware,
  (req, res) => pollsController.vote(req, res)
);

export default router;
