import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { sendSuccess } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class DashboardController {
  public static async getFarmerStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = (req.query.farmerId as string) || req.user?.id;
      const stats = await DashboardService.getFarmerDashboard(farmerId);
      return sendSuccess(res, stats, 'Farmer dashboard statistics retrieved');
    } catch (error) {
      next(error);
    }
  }

  public static async getOfficerStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await DashboardService.getOfficerDashboard();
      return sendSuccess(res, stats, 'Agriculture officer department telemetry retrieved');
    } catch (error) {
      next(error);
    }
  }
}
