import { Request, Response, NextFunction } from 'express';
import { SchemeService } from '../services/scheme.service';
import { sendSuccess, sendCreated } from '../utils/apiResponse';

export class SchemeController {
  public static async getSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, sponsor } = req.query;
      const schemes = await SchemeService.getSchemes({
        category: category as string,
        sponsor: sponsor as string,
      });
      return sendSuccess(res, schemes, 'Government schemes retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getSchemeById(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await SchemeService.getSchemeById(req.params.id as string);
      return sendSuccess(res, scheme, 'Government scheme details retrieved');
    } catch (error) {
      next(error);
    }
  }

  public static async createScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await SchemeService.createScheme(req.body);
      return sendCreated(res, created, 'Government scheme registered successfully');
    } catch (error) {
      next(error);
    }
  }
}
