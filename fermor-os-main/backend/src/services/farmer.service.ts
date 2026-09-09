import { FarmerModel } from '../models/Farmer';
import { FarmModel } from '../models/Farm';
import { ApiError } from '../utils/apiError';
import { IFarmer } from '../types';
import { isDbConnected } from '../config/db';

export class FarmerService {
  public static async getFarmers() {
    if (!isDbConnected()) {
      return [
        {
          id: 'farmer-101',
          farmerId: 'FARMER-IND-2026',
          userId: 'user-101',
          experienceYears: 12,
          totalLandAcres: 14.5,
          primaryCrops: ['Wheat', 'Soybean', 'Mustard'],
          kycStatus: 'verified',
        },
      ];
    }
    return FarmerModel.find().sort({ createdAt: -1 });
  }

  public static async getFarmerById(id: string) {
    if (!isDbConnected()) {
      return {
        id,
        farmerId: `FARMER-${id}`,
        userId: id,
        experienceYears: 12,
        totalLandAcres: 14.5,
        primaryCrops: ['Wheat', 'Soybean', 'Mustard'],
        kycStatus: 'verified',
      };
    }
    const farmer = await FarmerModel.findOne({ $or: [{ _id: id }, { farmerId: id }, { userId: id }] });
    if (!farmer) {
      throw ApiError.notFound(`Farmer record for ${id} not found`);
    }
    return farmer;
  }

  public static async updateFarmer(id: string, updateData: Partial<IFarmer>) {
    if (!isDbConnected()) {
      return { id, ...updateData };
    }
    const farmer = await FarmerModel.findOneAndUpdate(
      { $or: [{ _id: id }, { farmerId: id }, { userId: id }] },
      updateData,
      { new: true, runValidators: true }
    );
    if (!farmer) {
      throw ApiError.notFound(`Farmer record not found`);
    }
    return farmer;
  }

  public static async getFarmerFarms(farmerId: string) {
    if (!isDbConnected()) {
      return [];
    }
    return FarmModel.find({ farmerId });
  }
}
