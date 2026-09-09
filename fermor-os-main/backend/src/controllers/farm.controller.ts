import { Request, Response, NextFunction } from 'express';
import { FarmService } from '../services/farm.service';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class FarmController {
  public static async getFarms(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = (req.query.farmerId as string) || req.user?.id;
      const farms = await FarmService.getAllFarms(farmerId);
      return sendSuccess(res, farms, 'Farms retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getFarmById(req: Request, res: Response, next: NextFunction) {
    try {
      const farm = await FarmService.getFarmById(req.params.id as string);
      return sendSuccess(res, farm, 'Farm retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async createFarm(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = req.body.farmerId || req.user?.id || 'farmer-101';
      const farm = await FarmService.createFarm({ ...req.body, farmerId });
      return sendCreated(res, farm, 'Farm registered successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async updateFarm(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await FarmService.updateFarm(req.params.id as string, req.body);
      return sendSuccess(res, updated, 'Farm updated successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async deleteFarm(req: Request, res: Response, next: NextFunction) {
    try {
      await FarmService.deleteFarm(req.params.id as string);
      return sendSuccess(res, null, 'Farm and associated cycles deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
