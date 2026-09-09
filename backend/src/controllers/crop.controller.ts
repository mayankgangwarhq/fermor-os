import { Request, Response, NextFunction } from 'express';
import { CropService } from '../services/crop.service';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { CropStatus } from '../types';

export class CropController {
  public static async getCrops(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { farmId, status } = req.query;
      const farmerId = (req.query.farmerId as string) || req.user?.id;
      const crops = await CropService.getAllCrops({
        farmId: farmId as string,
        farmerId,
        status: status as CropStatus,
      });
      return sendSuccess(res, crops, 'Crops retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getCropById(req: Request, res: Response, next: NextFunction) {
    try {
      const crop = await CropService.getCropById(req.params.id as string);
      return sendSuccess(res, crop, 'Crop cycle retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async createCrop(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = req.body.farmerId || req.user?.id || 'farmer-101';
      const crop = await CropService.createCrop({ ...req.body, farmerId });
      return sendCreated(res, crop, 'Crop cycle created successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async updateCrop(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await CropService.updateCrop(req.params.id as string, req.body);
      return sendSuccess(res, updated, 'Crop cycle updated successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async updateCropStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const updated = await CropService.updateCropStatus(req.params.id as string, status);
      return sendSuccess(res, updated, 'Crop status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async deleteCrop(req: Request, res: Response, next: NextFunction) {
    try {
      await CropService.deleteCrop(req.params.id as string);
      return sendSuccess(res, null, 'Crop cycle deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
