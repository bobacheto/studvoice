import { Router } from 'express';
import { ModerationController } from '../controllers/moderation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();
const moderationController = new ModerationController();

/**
 * POST /moderation/mute
 * Mute a user (only MODERATOR can perform)
 */
router.post(
  '/mute',
  authMiddleware,
  roleMiddleware(['MODERATOR']),
  validationMiddleware,
  async (req, res) => {
    // TODO: Validate request body (userId, duration)
    // TODO: Call moderationController.muteUser
    res.json({ message: 'Mute user endpoint' });
  }
);

/**
 * POST /moderation/warn
 * Warn a user (only MODERATOR can perform)
 */
router.post(
  '/warn',
  authMiddleware,
  roleMiddleware(['MODERATOR']),
  validationMiddleware,
  async (req, res) => {
    // TODO: Validate request body (userId, reason)
    // TODO: Call moderationController.warnUser
    res.json({ message: 'Warn user endpoint' });
  }
);

/**
 * POST /moderation/ban
 * Ban a user (only MODERATOR can perform)
 */
router.post(
  '/ban',
  authMiddleware,
  roleMiddleware(['MODERATOR']),
  validationMiddleware,
  async (req, res) => {
    // TODO: Validate request body (userId, reason)
    // TODO: Call moderationController.banUser
    res.json({ message: 'Ban user endpoint' });
  }
);

/**
 * POST /moderation/review
 * Review reported content (only MODERATOR can perform)
 */
router.post(
  '/review',
  authMiddleware,
  roleMiddleware(['MODERATOR']),
  validationMiddleware,
  async (req, res) => {
    // TODO: Validate request body (reportId, action)
    // TODO: Call moderationController.reviewReport
    res.json({ message: 'Review report endpoint' });
  }
);

export default router;
