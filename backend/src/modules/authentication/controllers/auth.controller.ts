import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendCreated } from '../../../utils/apiResponse';
import { AuthRequest } from '../types';

export class AuthController {
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return sendCreated(res, result, 'Farmer OS account created successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, phone, emailOrPhone, password, role } = req.body;
      const identifier = emailOrPhone || email || phone;
      const result = await AuthService.login(identifier, password, role);
      return sendSuccess(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  public static async sendAadhaarOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { aadhaarNumber } = req.body;
      const result = await AuthService.sendAadhaarDemoOtp(aadhaarNumber);
      return sendSuccess(res, result, result.message);
    } catch (error) {
      next(error);
    }
  }

  public static async verifyAadhaarOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { aadhaarNumber, otp } = req.body;
      const result = await AuthService.verifyAadhaarDemoOtp(aadhaarNumber, otp);
      return sendSuccess(res, result, 'Aadhaar demo login successful');
    } catch (error) {
      next(error);
    }
  }

  public static async getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return sendSuccess(res, null, 'No active user session');
      }
      const user = await AuthService.getUserById(req.user.id);
      return sendSuccess(res, user, 'Current user profile fetched successfully');
    } catch (error) {
      next(error);
    }
  }
}

