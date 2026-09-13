import { CropModel } from '../models/Crop';
import { ApiError } from '../utils/apiError';
import { ICrop, CropStatus } from '../types';
import { isDbConnected } from '../config/db';
import { buildIdQuery } from '../utils/dbHelper';

const sampleCropsFallback: ICrop[] = [
  {
    id: 'crop-1',
    farmId: 'farm-1',
    farmerId: 'farmer-101',
    cropName: 'Wheat',
    variety: 'Sharbati Gold C-306',
    sowingDate: '2025-11-15',
    expectedHarvestDate: '2026-03-25',
    growthStage: 'Grain Filling Stage (Day 95)',
    status: 'growing',
    estimatedYieldKg: 4200,
    areaAllocated: 5.0,
    notes: 'Requires 3rd irrigation round in 5 days',
  },
  {
    id: 'crop-2',
    farmId: 'farm-1',
    farmerId: 'farmer-101',
    cropName: 'Soybean',
    variety: 'JS 335',
    sowingDate: '2025-07-02',
    expectedHarvestDate: '2025-10-18',
    growthStage: 'Harvest Completed',
    status: 'sold',
    estimatedYieldKg: 2800,
    actualYieldKg: 2950,
    areaAllocated: 3.5,
  },
  {
    id: 'crop-3',
    farmId: 'farm-2',
    farmerId: 'farmer-101',
    cropName: 'Mustard',
    variety: 'Pusa Bold Mustard',
    sowingDate: '2025-10-25',
    expectedHarvestDate: '2026-02-28',
    growthStage: 'Pod Maturation (Harvest Ready)',
    status: 'harvest_ready',
    estimatedYieldKg: 1900,
    areaAllocated: 6.0,
  },
];

let inMemoryCrops = [...sampleCropsFallback];

export class CropService {
  public static async getAllCrops(filter?: { farmId?: string; farmerId?: string; status?: CropStatus }) {
    if (!isDbConnected()) {
      let filtered = [...inMemoryCrops];
      if (filter?.farmId) filtered = filtered.filter((c) => c.farmId === filter.farmId);
      if (filter?.farmerId) filtered = filtered.filter((c) => c.farmerId === filter.farmerId);
      if (filter?.status) filtered = filtered.filter((c) => c.status === filter.status);
      return filtered;
    }

    const query: any = {};
    if (filter?.farmId) query.farmId = filter.farmId;
    if (filter?.farmerId) query.farmerId = filter.farmerId;
    if (filter?.status) query.status = filter.status;

    return CropModel.find(query).sort({ createdAt: -1 });
  }

  public static async getCropById(id: string) {
    if (!isDbConnected()) {
      const crop = inMemoryCrops.find((c) => c.id === id || (c as any)._id === id);
      if (!crop) {
        throw ApiError.notFound(`Crop with ID ${id} not found`);
      }
      return crop;
    }

    const query = buildIdQuery(id);
    const crop = await CropModel.findOne(query);
    if (!crop) {
      throw ApiError.notFound(`Crop with ID ${id} not found`);
    }
    return crop;
  }

  public static async createCrop(cropData: ICrop) {
    if (!isDbConnected()) {
      const newCrop: ICrop = {
        ...cropData,
        id: `crop-${Date.now()}`,
        status: cropData.status || 'planned',
      };
      inMemoryCrops.push(newCrop);
      return newCrop;
    }

    return CropModel.create(cropData);
  }

  public static async updateCrop(id: string, updateData: Partial<ICrop>) {
    if (!isDbConnected()) {
      const idx = inMemoryCrops.findIndex((c) => c.id === id || (c as any)._id === id);
      if (idx === -1) {
        throw ApiError.notFound(`Crop with ID ${id} not found`);
      }
      inMemoryCrops[idx] = { ...inMemoryCrops[idx], ...updateData };
      return inMemoryCrops[idx];
    }

    const query = buildIdQuery(id);
    const crop = await CropModel.findOneAndUpdate(query, updateData, { new: true, runValidators: true });
    if (!crop) {
      throw ApiError.notFound(`Crop with ID ${id} not found`);
    }
    return crop;
  }

  public static async updateCropStatus(id: string, status: CropStatus) {
    return this.updateCrop(id, { status });
  }

  public static async deleteCrop(id: string) {
    if (!isDbConnected()) {
      inMemoryCrops = inMemoryCrops.filter((c) => c.id !== id && (c as any)._id !== id);
      return true;
    }

    const query = buildIdQuery(id);
    const crop = await CropModel.findOneAndDelete(query);
    if (!crop) {
      throw ApiError.notFound(`Crop with ID ${id} not found`);
    }
    return true;
  }
}
