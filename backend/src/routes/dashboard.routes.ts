import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/farmer', optionalAuth, DashboardController.getFarmerStats);
router.get('/officer', optionalAuth, DashboardController.getOfficerStats);
router.get('/stats', optionalAuth, DashboardController.getFarmerStats);

export const dashboardRoutes = router;
