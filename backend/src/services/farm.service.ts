import { FarmModel } from '../models/Farm';
import { CropModel } from '../models/Crop';
import { ApiError } from '../utils/apiError';
import { IFarm } from '../types';
import { isDbConnected } from '../config/db';

const sampleFarmsFallback: IFarm[] = [
  {
    id: 'farm-1',
    farmerId: 'farmer-101',
    name: 'Kisan Greenfield Farm #1',
    location: 'Sanwer Road, Indore',
    district: 'Indore',
    state: 'Madhya Pradesh',
    area: 8.5,
    unit: 'acres',
    soilType: 'Black',
    irrigation: 'Drip',
    farmingType: 'Organic',
    crops: ['Wheat (Sharbati)', 'Soybean (JS-335)'],
    coordinates: { latitude: 22.7196, longitude: 75.8577 },
    status: 'active',
  },
  {
    id: 'farm-2',
    farmerId: 'farmer-101',
    name: 'Malwa Organic Orchard',
    location: 'Ujjain Bypass, Dewas',
    district: 'Dewas',
    state: 'Madhya Pradesh',
    area: 6.0,
    unit: 'acres',
    soilType: 'Alluvial',
    irrigation: 'Borewell',
    farmingType: 'Mixed',
    crops: ['Mustard (Pusa Bold)', 'Chana (Kabuli)'],
    coordinates: { latitude: 22.9676, longitude: 76.0534 },
    status: 'active',
  },
];

let inMemoryFarms = [...sampleFarmsFallback];

export class FarmService {
  public static async getAllFarms(farmerId?: string) {
    if (!isDbConnected()) {
      if (farmerId) {
        return inMemoryFarms.filter((f) => f.farmerId === farmerId);
      }
      return inMemoryFarms;
    }

    const query = farmerId ? { farmerId } : {};
    return FarmModel.find(query).sort({ createdAt: -1 });
  }

  public static async getFarmById(id: string) {
    if (!isDbConnected()) {
      const found = inMemoryFarms.find((f) => f.id === id);
      if (!found) {
        throw ApiError.notFound(`Farm with ID ${id} not found`);
      }
      return found;
    }

    const farm = await FarmModel.findById(id);
    if (!farm) {
      throw ApiError.notFound(`Farm with ID ${id} not found`);
    }
    return farm;
  }

  public static async createFarm(farmData: IFarm) {
    if (!isDbConnected()) {
      const created: IFarm = {
        ...farmData,
        id: `farm-${Date.now()}`,
        status: 'active',
      };
      inMemoryFarms.push(created);
      return created;
    }

    return FarmModel.create(farmData);
  }

  public static async updateFarm(id: string, updateData: Partial<IFarm>) {
    if (!isDbConnected()) {
      const idx = inMemoryFarms.findIndex((f) => f.id === id);
      if (idx === -1) {
        throw ApiError.notFound(`Farm with ID ${id} not found`);
      }
      inMemoryFarms[idx] = { ...inMemoryFarms[idx], ...updateData };
      return inMemoryFarms[idx];
    }

    const farm = await FarmModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!farm) {
      throw ApiError.notFound(`Farm with ID ${id} not found`);
    }
    return farm;
  }

  public static async deleteFarm(id: string) {
    if (!isDbConnected()) {
      inMemoryFarms = inMemoryFarms.filter((f) => f.id !== id);
      return true;
    }

    const farm = await FarmModel.findByIdAndDelete(id);
    if (!farm) {
      throw ApiError.notFound(`Farm with ID ${id} not found`);
    }
    await CropModel.deleteMany({ farmId: id });
    return true;
  }
}
