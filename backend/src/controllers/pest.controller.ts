import { Request, Response, NextFunction } from 'express';
import { PestService } from '../services/pest.service';
import { sendSuccess, sendCreated } from '../utils/apiResponse';

export class PestController {
  public static async getPests(req: Request, res: Response, next: NextFunction) {
    try {
      const { crop } = req.query;
      const pests = await PestService.getAllPests(crop as string);
      return sendSuccess(res, pests, 'Pest monitoring profiles retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getPestById(req: Request, res: Response, next: NextFunction) {
    try {
      const pest = await PestService.getPestById(req.params.id as string);
      return sendSuccess(res, pest, 'Pest profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async createPest(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await PestService.createPest(req.body);
      return sendCreated(res, created, 'Pest entry added successfully');
    } catch (error) {
      next(error);
    }
  }
}
