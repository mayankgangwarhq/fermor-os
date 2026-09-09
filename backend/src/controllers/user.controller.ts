import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess } from '../utils/apiResponse';

export class UserController {
  public static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await UserService.getAllUsers();
      return sendSuccess(res, users, 'Users retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getUserById(req.params.id as string);
      return sendSuccess(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UserService.updateUser(req.params.id as string, req.body);
      return sendSuccess(res, updated, 'User profile updated successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      await UserService.deleteUser(req.params.id as string);
      return sendSuccess(res, null, 'User deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
