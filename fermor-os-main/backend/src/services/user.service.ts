import { UserModel } from '../models/User';
import { ApiError } from '../utils/apiError';
import { IUser } from '../types';
import { isDbConnected } from '../config/db';

export class UserService {
  public static async getAllUsers() {
    if (!isDbConnected()) {
      return [];
    }
    return UserModel.find().sort({ createdAt: -1 });
  }

  public static async getUserById(id: string) {
    if (!isDbConnected()) {
      return { id, name: 'Demo Farmer', email: 'farmer@farmer-os.agri', role: 'farmer' };
    }
    const user = await UserModel.findById(id);
    if (!user) {
      throw ApiError.notFound(`User with ID ${id} not found`);
    }
    return user;
  }

  public static async updateUser(id: string, updateData: Partial<IUser>) {
    if (!isDbConnected()) {
      return { id, ...updateData };
    }
    const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!user) {
      throw ApiError.notFound(`User with ID ${id} not found`);
    }
    return user;
  }

  public static async deleteUser(id: string) {
    if (!isDbConnected()) {
      return true;
    }
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      throw ApiError.notFound(`User with ID ${id} not found`);
    }
    return true;
  }
}
