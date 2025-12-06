import { Request, Response, NextFunction } from 'express';
import { JWTUtil, JWTPayload } from '../utils/jwt';

/**
 * Extend Express Request type to include user
 */
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

/**
 * Auth Middleware
 * Validates JWT access token from Authorization header
 * Attaches decoded payload to req.user
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // 1. Get Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No authorization header provided',
      });
      return;
    }

    // 2. Extract Bearer token
    const token = JWTUtil.extractToken(authHeader);
    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid authorization header format',
      });
      return;
    }

    // 3. Verify token
    const payload = JWTUtil.verifyAccessToken(token);
    if (!payload) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
      return;
    }

    // 4. Attach payload to request
    req.user = payload;

    // 5. Continue to next middleware
    next();
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: 'Error validating token',
    });
  }
}

/**
 * Optional Auth Middleware
 * Same as authMiddleware but continues even if token is invalid
 * Useful for endpoints that work for both authenticated and unauthenticated users
 */
export async function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next();
    }

    const token = JWTUtil.extractToken(authHeader);
    if (!token) {
      return next();
    }

    const payload = JWTUtil.verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }

    next();
  } catch (error) {
    // Silently continue without user
    next();
  }
}
