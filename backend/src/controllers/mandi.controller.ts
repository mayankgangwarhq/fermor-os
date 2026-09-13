import { Request, Response, NextFunction } from 'express';
import { MandiService } from '../services/mandi.service';
import { sendSuccess, sendCreated } from '../utils/apiResponse';

export class MandiController {
  public static async getPrices(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        commodity,
        state,
        district,
        market,
        variety,
        grade,
        search,
        limit,
        offset,
      } = req.query;

      const result = await MandiService.getMandiRates({
        commodity: commodity as string,
        state: state as string,
        district: district as string,
        market: market as string,
        variety: variety as string,
        grade: grade as string,
        search: search as string,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        offset: offset ? parseInt(offset as string, 10) : undefined,
      });

      return sendSuccess(res, result, 'Mandi market prices retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getFilterOptions(req: Request, res: Response, next: NextFunction) {
    try {
      const options = await MandiService.getFilterOptions();
      return sendSuccess(res, options, 'Mandi filter options retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getPriceById(req: Request, res: Response, next: NextFunction) {
    try {
      const price = await MandiService.getPriceById(req.params.id as string);
      return sendSuccess(res, price, 'Mandi commodity price record retrieved');
    } catch (error) {
      next(error);
    }
  }

  public static async createPrice(req: Request, res: Response, next: NextFunction) {
    try {
      const created = await MandiService.createPrice(req.body);
      return sendCreated(res, created, 'Mandi price benchmark logged successfully');
    } catch (error) {
      next(error);
    }
  }
}
