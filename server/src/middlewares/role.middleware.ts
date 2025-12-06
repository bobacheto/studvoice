import { Request, Response, NextFunction } from 'express';

/**
 * Role Middleware
 * Checks if user has one of the required roles
 * Must be used after authMiddleware
 */
export function roleMiddleware(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // 1. Check if user is authenticated
      if (!req.user) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
        return;
      }

      // 2. Check if user role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          error: 'Forbidden',
          message: `User role '${req.user.role}' is not allowed. Required roles: ${allowedRoles.join(', ')}`,
        });
        return;
      }

      // 3. Continue to next middleware
      next();
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Error checking user role',
      });
    }
  };
}
