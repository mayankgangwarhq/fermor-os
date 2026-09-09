import { Request, Response, NextFunction } from 'express';
import { AlertService } from '../services/alert.service';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';
import { AlertSeverity, AlertType } from '../types';

export class AlertController {
  public static async getAlerts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { severity, type, unreadOnly, farmId } = req.query;
      const farmerId = (req.query.farmerId as string) || req.user?.id;

      const alerts = await AlertService.getAlerts({
        farmerId,
        farmId: farmId as string,
        severity: severity as AlertSeverity,
        type: type as AlertType,
        unreadOnly: unreadOnly === 'true',
      });

      return sendSuccess(res, alerts, 'Alerts retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getAlertById(req: Request, res: Response, next: NextFunction) {
    try {
      const alert = await AlertService.getAlertById(req.params.id as string);
      return sendSuccess(res, alert, 'Alert retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async createAlert(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = req.body.farmerId || req.user?.id || 'farmer-101';
      const created = await AlertService.createAlert({ ...req.body, farmerId });
      return sendCreated(res, created, 'Alert created successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await AlertService.markRead(req.params.id as string);
      return sendSuccess(res, updated, 'Alert marked as read');
    } catch (error) {
      next(error);
    }
  }

  public static async markAllRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = (req.query.farmerId as string) || req.user?.id;
      await AlertService.markAllRead(farmerId);
      return sendSuccess(res, null, 'All alerts marked as read');
    } catch (error) {
      next(error);
    }
  }

  public static async deleteAlert(req: Request, res: Response, next: NextFunction) {
    try {
      await AlertService.deleteAlert(req.params.id as string);
      return sendSuccess(res, null, 'Alert deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
