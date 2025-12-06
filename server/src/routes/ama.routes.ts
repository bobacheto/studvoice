import { Router } from 'express';
import { AMAController } from '../controllers/ama.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();
const amaController = new AMAController();

/**
 * GET /ama
 * Retrieve all AMA sessions
 */
router.get('/', authMiddleware, async (req, res) => {
  // TODO: Call amaController.getAMASessions
  res.json({ message: 'Get AMA sessions endpoint' });
});

/**
 * POST /ama
 * Create a new AMA session (only STUDENT_COUNCIL can create)
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['STUDENT_COUNCIL']),
  validationMiddleware,
  async (req, res) => {
    // TODO: Validate request body
    // TODO: Call amaController.createAMASession
    res.json({ message: 'Create AMA session endpoint' });
  }
);

/**
 * POST /ama/:id/question
 * Submit a question to an AMA session
 */
router.post('/:id/question', authMiddleware, validationMiddleware, async (req, res) => {
  // TODO: Validate request body (question text)
  // TODO: Call amaController.submitQuestion
  res.json({ message: 'Submit AMA question endpoint' });
});

export default router;
