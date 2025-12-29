import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import authService from '../services/auth.service';

const prisma = new PrismaClient();

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        roles: string[];
        permissions: Array<{ resource: string; action: string }>;
      };
    }
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'No token provided',
        },
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = authService.verifyToken(token);

    // Get user with roles and permissions
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token or user inactive',
        },
      });
      return;
    }

    // Extract roles and permissions
    const roles = user.userRoles.map((ur) => ur.role.name);
    const permissions = user.userRoles.flatMap((ur) =>
      ur.role.rolePermissions.map((rp) => ({
        resource: rp.permission.resource,
        action: rp.permission.action,
      }))
    );

    // Attach user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      roles,
      permissions,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Invalid token',
      },
    });
  }
};

/**
 * Middleware to check if user has required role
 */
export const requireRole = (...requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

    const hasRole = requiredRoles.some((role) => req.user!.roles.includes(role));

    if (!hasRole) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Required role: ${requiredRoles.join(' or ')}`,
        },
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user has required permission
 */
export const requirePermission = (resource: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

    const hasPermission = req.user.permissions.some(
      (p) => p.resource === resource && p.action === action
    );

    if (!hasPermission) {
      res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: `Required permission: ${action} on ${resource}`,
        },
      });
      return;
    }

    next();
  };
};
