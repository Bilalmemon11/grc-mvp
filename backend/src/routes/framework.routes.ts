import { Router } from 'express';
import frameworkController from '../controllers/framework.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All framework routes require authentication
router.use(authenticate);

// Framework routes
router.get('/', frameworkController.getAll.bind(frameworkController));
router.get('/:id', frameworkController.getById.bind(frameworkController));
router.get('/:id/controls', frameworkController.getControls.bind(frameworkController));
router.get('/:frameworkId/controls/:controlId', frameworkController.getControl.bind(frameworkController));

export default router;
