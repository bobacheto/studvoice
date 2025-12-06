import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterSchema, LoginSchema, RefreshTokenSchema } from '../utils/validation';
import { AppError } from '../utils/errors';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /auth/register
   * Register a new student
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      // 1. Validate input
      const validationResult = RegisterSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors,
        });
        return;
      }

      // 2. Call service
      const result = await this.authService.register(validationResult.data);

      // 3. Return success response
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      // 4. Handle errors
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  /**
   * POST /auth/login
   * Login a student
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // 1. Validate input
      const validationResult = LoginSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors,
        });
        return;
      }

      // 2. Call service
      const result = await this.authService.login(validationResult.data);

      // 3. Return success response
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      // 4. Handle errors
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      // 1. Validate input
      const validationResult = RefreshTokenSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors,
        });
        return;
      }

      // 2. Call service
      const result = await this.authService.refreshToken(validationResult.data.refreshToken);

      // 3. Return success response
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      // 4. Handle errors
      if (error instanceof AppError) {
        res.status(error.statusCode).json({
          error: error.name,
          message: error.message,
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }
}
