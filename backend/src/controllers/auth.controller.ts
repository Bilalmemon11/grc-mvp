import { Request, Response } from 'express';
import { z } from 'zod';
import authService from '../services/auth.service';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = registerSchema.parse(req.body);

      // Register user
      const result = await authService.register(validatedData);

      res.status(201).json({
        success: true,
        data: result,
        message: 'User registered successfully',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors,
          },
        });
        return;
      }

      res.status(400).json({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: error.message || 'Failed to register user',
        },
      });
    }
  }

  /**
   * Login user
   * POST /api/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validatedData = loginSchema.parse(req.body);

      // Login user
      const result = await authService.login(validatedData);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Login successful',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors,
          },
        });
        return;
      }

      res.status(401).json({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: error.message || 'Invalid credentials',
        },
      });
    }
  }

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  async refresh(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const { refreshToken } = refreshSchema.parse(req.body);

      // Refresh token
      const result = await authService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
        message: 'Token refreshed successfully',
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors,
          },
        });
        return;
      }

      res.status(401).json({
        success: false,
        error: {
          code: 'REFRESH_FAILED',
          message: error.message || 'Failed to refresh token',
        },
      });
    }
  }

  /**
   * Get current user
   * GET /api/auth/me
   */
  async me(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        });
        return;
      }

      const user = await authService.getUserById(req.user.userId);

      if (!user) {
        res.status(404).json({
          success: false,
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: {
          user,
          roles: req.user.roles,
          permissions: req.user.permissions,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to get user info',
        },
      });
    }
  }

  /**
   * Logout user
   * POST /api/auth/logout
   */
  async logout(_req: Request, res: Response): Promise<void> {
    // For JWT, logout is handled client-side by removing the token
    // In a production app, you might want to implement token blacklisting

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  }
}

export default new AuthController();
