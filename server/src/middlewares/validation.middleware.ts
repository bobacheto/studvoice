import { Request, Response, NextFunction } from 'express';

/**
 * Validation Middleware
 * Generic middleware for request validation
 * Specific validation is done in controllers using Zod schemas
 */
export async function validationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Middleware for general validation setup
    // Specific validation happens in controllers with Zod
    // This middleware can be extended for other validation rules
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Validation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
