import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class FrameworkController {
  /**
   * Get all frameworks
   * GET /api/frameworks
   */
  async getAll(_req: Request, res: Response): Promise<void> {
    try {
      const frameworks = await prisma.framework.findMany({
        include: {
          _count: {
            select: { controls: true },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200).json({
        success: true,
        data: frameworks,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch frameworks',
        },
      });
    }
  }

  /**
   * Get framework by ID
   * GET /api/frameworks/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const framework = await prisma.framework.findUnique({
        where: { id },
        include: {
          _count: {
            select: { controls: true },
          },
        },
      });

      if (!framework) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Framework not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: framework,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch framework',
        },
      });
    }
  }

  /**
   * Get framework controls
   * GET /api/frameworks/:id/controls
   */
  async getControls(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { page = '1', limit = '20' } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const [controls, total] = await Promise.all([
        prisma.control.findMany({
          where: { frameworkId: id },
          skip,
          take: limitNum,
          orderBy: {
            controlId: 'asc',
          },
        }),
        prisma.control.count({
          where: { frameworkId: id },
        }),
      ]);

      res.status(200).json({
        success: true,
        data: controls,
        meta: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch controls',
        },
      });
    }
  }

  /**
   * Get control by ID
   * GET /api/frameworks/:frameworkId/controls/:controlId
   */
  async getControl(req: Request, res: Response): Promise<void> {
    try {
      const { frameworkId, controlId } = req.params;

      const control = await prisma.control.findFirst({
        where: {
          frameworkId,
          controlId,
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          policies: true,
        },
      });

      if (!control) {
        res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Control not found',
          },
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: control,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch control',
        },
      });
    }
  }
}

export default new FrameworkController();
