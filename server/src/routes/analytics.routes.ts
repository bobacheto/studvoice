import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

const router = Router();
const analyticsController = new AnalyticsController();

/**
 * GET /analytics/school
 * Retrieve school analytics (only DIRECTOR can view)
 * Returns: emotional index, top topics, trends, accepted ideas
 * Does NOT expose student identity information
 */
router.get(
  '/school',
  authMiddleware,
  roleMiddleware(['DIRECTOR']),
  async (req, res) => {
    // TODO: Call analyticsController.getSchoolAnalytics
    res.json({ message: 'Get school analytics endpoint' });
  }
);

export default router;
