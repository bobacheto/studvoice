// Challenges Routes - Define HTTP endpoints for gamification challenges
// Wire controllers with authentication and authorization middleware

import { Router } from 'express';
import { ChallengesController } from '../controllers/challenges.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();
const challengesController = new ChallengesController();

// GET /challenges - Get active challenges (all authenticated users)
router.get(
  '/',
  authMiddleware,
  (req, res) => challengesController.getChallenges(req, res)
);

// POST /challenges - Create a new challenge (STUDENT_COUNCIL, TEACHER, DIRECTOR)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['STUDENT_COUNCIL', 'TEACHER', 'DIRECTOR', 'ADMIN']),
  (req, res) => challengesController.createChallenge(req, res)
);

// POST /challenges/:id/submit - Submit to a challenge (all authenticated users)
router.post(
  '/:id/submit',
  authMiddleware,
  (req, res) => challengesController.submit(req, res)
);

// GET /challenges/:id/submissions - Get submissions (STUDENT_COUNCIL, TEACHER, DIRECTOR)
router.get(
  '/:id/submissions',
  authMiddleware,
  roleMiddleware(['STUDENT_COUNCIL', 'TEACHER', 'DIRECTOR', 'ADMIN']),
  (req, res) => challengesController.getSubmissions(req, res)
);

export default router;
