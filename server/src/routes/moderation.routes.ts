// Moderation Routes - Define HTTP endpoints for moderation actions

import { Router } from 'express';
import { moderationController } from '../controllers/moderation.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * POST /reports
 * Create a report for a post or comment
 * Body: { targetType: 'POST' | 'COMMENT', targetId, reason }
 */
router.post('/reports', moderationController.createReport.bind(moderationController));

/**
 * GET /reports
 * Get all reports for the school (moderators only)
 * Query params: status?
 */
router.get(
  '/reports',
  roleMiddleware(['MODERATOR', 'STUDENT_COUNCIL', 'DIRECTOR', 'ADMIN']),
  moderationController.getReports.bind(moderationController)
);

/**
 * PATCH /reports/:id/status
 * Update report status (moderators only)
 * Body: { status: 'OPEN' | 'REVIEWED' | 'RESOLVED' }
 */
router.patch(
  '/reports/:id/status',
  roleMiddleware(['MODERATOR', 'STUDENT_COUNCIL', 'DIRECTOR', 'ADMIN']),
  moderationController.updateReportStatus.bind(moderationController)
);

/**
 * POST /moderation/strikes
 * Issue a strike (moderators only)
 * Body: { anonymousId, type: 'MUTE' | 'WARNING' | 'BAN', durationHours?, reason? }
 */
router.post(
  '/moderation/strikes',
  roleMiddleware(['MODERATOR', 'DIRECTOR', 'ADMIN']),
  moderationController.issueStrike.bind(moderationController)
);

/**
 * GET /moderation/strikes/:anonymousId
 * Get strike history for a user (moderators only)
 */
router.get(
  '/moderation/strikes/:anonymousId',
  roleMiddleware(['MODERATOR', 'DIRECTOR', 'ADMIN']),
  moderationController.getStrikeHistory.bind(moderationController)
);

export default router;
