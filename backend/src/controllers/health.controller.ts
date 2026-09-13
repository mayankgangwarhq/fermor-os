import { Request, Response } from 'express';
import { sendSuccess } from '../utils/apiResponse';
import { getDbStatus } from '../config/db';

export class HealthController {
  public static getHealth(req: Request, res: Response) {
    const healthData = {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      service: 'AGRINEXT Agritech Core API',
      version: '1.0.0',
      database: getDbStatus(),
      environment: process.env.NODE_ENV || 'development',
    };

    return sendSuccess(res, healthData, 'AGRINEXT Agritech API is healthy and operational');
  }
}
