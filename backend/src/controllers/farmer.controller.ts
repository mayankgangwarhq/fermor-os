import { Request, Response, NextFunction } from 'express';
import { FarmerService } from '../services/farmer.service';
import { sendSuccess } from '../utils/apiResponse';

export class FarmerController {
  public static async getFarmers(req: Request, res: Response, next: NextFunction) {
    try {
      const farmers = await FarmerService.getFarmers();
      return sendSuccess(res, farmers, 'Farmers list fetched successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getFarmerById(req: Request, res: Response, next: NextFunction) {
    try {
      const farmer = await FarmerService.getFarmerById(req.params.id as string);
      return sendSuccess(res, farmer, 'Farmer profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async updateFarmer(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await FarmerService.updateFarmer(req.params.id as string, req.body);
      return sendSuccess(res, updated, 'Farmer profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getFarmerFarms(req: Request, res: Response, next: NextFunction) {
    try {
      const farms = await FarmerService.getFarmerFarms(req.params.id as string);
      return sendSuccess(res, farms, 'Farmer farms fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}
