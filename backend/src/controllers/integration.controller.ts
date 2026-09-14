import { Request, Response, NextFunction } from 'express';
import { getSafeIntegrationsStatus, API_REGISTRY } from '../config/apiRegistry';
import { sendSuccess } from '../utils/apiResponse';

export class IntegrationController {
  /**
   * GET /api/integrations
   * Returns completely safe metadata and live connectivity status for all external APIs and data providers.
   * Zero secrets, keys, tokens, or passwords are ever exposed.
   */
  public static async getIntegrations(req: Request, res: Response, next: NextFunction) {
    try {
      const statusReport = getSafeIntegrationsStatus();
      return sendSuccess(res, statusReport, 'Integration metadata and connectivity status retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/integrations/registry
   * Returns the full formal API registry catalog with documentation links and endpoints.
   */
  public static async getRegistry(req: Request, res: Response, next: NextFunction) {
    try {
      return sendSuccess(res, API_REGISTRY, 'Formal API Integration Registry retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
