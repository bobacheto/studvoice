// AMA Routes - Define HTTP endpoints for Ask Me Anything sessions
// Wire controllers with authentication and authorization middleware

import { Router } from 'express';
import { AMAController } from '../controllers/ama.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();
const amaController = new AMAController();

// GET /ama - Get all active AMA sessions (all authenticated users)
router.get(
  '/',
  authMiddleware,
  (req, res) => amaController.getSessions(req, res)
);

// POST /ama - Create a new AMA session (TEACHER, STUDENT_COUNCIL, DIRECTOR)
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['TEACHER', 'STUDENT_COUNCIL', 'DIRECTOR', 'ADMIN']),
  (req, res) => amaController.createSession(req, res)
);

// GET /ama/:id/questions - Get questions for an AMA session (all authenticated users)
router.get(
  '/:id/questions',
  authMiddleware,
  (req, res) => amaController.getQuestions(req, res)
);

// POST /ama/:id/questions - Submit a question (STUDENT and above)
router.post(
  '/:id/questions',
  authMiddleware,
  (req, res) => amaController.submitQuestion(req, res)
);

// POST /ama/:id/questions/:questionId/answer - Answer a question (TEACHER, STUDENT_COUNCIL, DIRECTOR)
router.post(
  '/:id/questions/:questionId/answer',
  authMiddleware,
  roleMiddleware(['TEACHER', 'STUDENT_COUNCIL', 'DIRECTOR', 'ADMIN']),
  (req, res) => amaController.answerQuestion(req, res)
);

// PATCH /ama/:id/questions/:questionId/status - Update question status (TEACHER and above)
router.patch(
  '/:id/questions/:questionId/status',
  authMiddleware,
  roleMiddleware(['TEACHER', 'STUDENT_COUNCIL', 'DIRECTOR', 'ADMIN']),
  (req, res) => amaController.updateQuestionStatus(req, res)
);

export default router;
