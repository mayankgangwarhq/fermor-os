import { Request, Response, NextFunction } from 'express';
import { DiagnosticCaseService } from '../services/diagnosticCase.service';
import { sendSuccess, sendCreated } from '../utils/apiResponse';
import { AuthRequest } from '../middleware/auth.middleware';

export class DiagnosticCaseController {
  public static async createCase(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const farmerId = req.user?.id || req.body.farmerId;
      const farmerName = req.user?.name || req.body.farmerName;
      const farmerPhone = req.body.farmerPhone || '';

      const created = await DiagnosticCaseService.createCase({
        ...req.body,
        farmerId,
        farmerName,
        farmerPhone,
      });

      return sendCreated(res, created, 'Diagnostic case created and analyzed successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getCases(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { farmerId, status, riskLevel, cropName, expertStatus } = req.query;

      // If farmer role, restrict to own cases unless explicitly querying all
      const targetFarmerId =
        req.user?.role === 'farmer' && !farmerId ? req.user.id : (farmerId as string);

      const cases = await DiagnosticCaseService.getCases({
        farmerId: targetFarmerId,
        decisionStatus: status as string,
        riskLevel: riskLevel as string,
        cropName: cropName as string,
        expertStatus: expertStatus as string,
      });

      return sendSuccess(res, cases, 'Diagnostic cases retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getCaseById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const targetCase = await DiagnosticCaseService.getCaseById(id);
      if (!targetCase) {
        return res.status(404).json({ success: false, message: 'Diagnostic case not found' });
      }
      return sendSuccess(res, targetCase, 'Diagnostic case details retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async submitClarification(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { answers } = req.body;
      const updated = await DiagnosticCaseService.submitClarification(
        id,
        answers || {},
        req.user
      );
      return sendSuccess(res, updated, 'Clarification answers submitted and confidence refined');
    } catch (error) {
      next(error);
    }
  }

  public static async requestExpert(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { notes } = req.body;
      const updated = await DiagnosticCaseService.requestExpertReview(
        id,
        notes,
        req.user
      );
      return sendSuccess(res, updated, 'Case successfully escalated to Agriculture Expert queue');
    } catch (error) {
      next(error);
    }
  }

  public static async submitExpertReview(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const reviewPayload = req.body;
      const updated = await DiagnosticCaseService.submitExpertReview(
        id,
        reviewPayload,
        req.user
      );
      return sendSuccess(res, updated, 'Expert clinical validation submitted successfully');
    } catch (error) {
      next(error);
    }
  }
}
