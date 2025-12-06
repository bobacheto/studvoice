import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';

const router = Router();
const authController = new AuthController();

/**
 * POST /auth/register
 * Register a new student with email, password, and schoolCode
 * Returns: { accessToken, refreshToken, user }
 */
router.post('/register', validationMiddleware, async (req: Request, res: Response) => {
  await authController.register(req, res);
});

/**
 * POST /auth/login
 * Login with email, password, and schoolCode
 * Returns: { accessToken, refreshToken, user }
 */
router.post('/login', validationMiddleware, async (req: Request, res: Response) => {
  await authController.login(req, res);
});

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 * Body: { refreshToken }
 * Returns: { accessToken, refreshToken, user }
 */
router.post('/refresh', validationMiddleware, async (req: Request, res: Response) => {
  await authController.refresh(req, res);
});

/**
 * GET /auth/me (Protected)
 * Get current authenticated user info
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    res.json({
      status: 'success',
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
