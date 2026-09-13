import { Request, Response, NextFunction } from 'express';
import { DiseaseDetectionService } from '../services/diseaseDetection.service';
import { CropDiseaseVisionService } from '../services/cropDiseaseVision.service';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class DiseaseController {
  public static async getDiseases(req: Request, res: Response, next: NextFunction) {
    try {
      const { crop } = req.query;
      const diseases = await DiseaseDetectionService.getAllDiseases(crop as string);
      return sendSuccess(res, diseases, 'Diseases catalog retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getDiseaseById(req: Request, res: Response, next: NextFunction) {
    try {
      const disease = await DiseaseDetectionService.getDiseaseById(req.params.id as string);
      return sendSuccess(res, disease, 'Disease details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async detectDisease(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = req.user?.id || req.body.farmerId;
      const farmId = req.body.farmId;
      const diagnosis = await CropDiseaseVisionService.analyzeImage(req.body, farmerId, farmId);
      return sendSuccess(res, diagnosis, 'Diagnostic analysis completed successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async createDisease(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await DiseaseDetectionService.createDisease(req.body);
      return sendCreated(res, created, 'Disease entry added successfully');
    } catch (error) {
      next(error);
    }
  }
}
