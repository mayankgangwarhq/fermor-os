import { AlertModel } from '../models/Alert';
import { ApiError } from '../utils/apiError';
import { IAlert, AlertSeverity, AlertType } from '../types';
import { isDbConnected } from '../config/db';
import { buildIdQuery } from '../utils/dbHelper';

const sampleAlertsFallback: IAlert[] = [
  {
    id: 'alt-1',
    title: 'High Pest Risk: Whitefly Infestation Detected',
    description: 'Elevated humidity in Sanwer block creates favorable microclimate for whiteflies in soybean/cotton fields.',
    severity: 'HIGH',
    type: 'PEST',
    farmId: 'farm-1',
    cropId: 'crop-2',
    farmerId: 'farmer-101',
    read: false,
    actionableStep: 'Install yellow sticky traps (15-20/acre) and check leaf undersides.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'alt-2',
    title: 'Irrigation Advisory: Critical Soil Moisture Level',
    description: 'Wheat crop has entered the grain filling stage. Ensure timely 3rd irrigation round within 48 hours.',
    severity: 'MEDIUM',
    type: 'IRRIGATION',
    farmId: 'farm-1',
    cropId: 'crop-1',
    farmerId: 'farmer-101',
    read: false,
    actionableStep: 'Activate drip irrigation for 3.5 hours during early morning.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'alt-3',
    title: 'Weather Warning: Unseasonal Rain Expected',
    description: '35% to 70% probability of light to moderate showers in the district over the next 36 hours.',
    severity: 'CRITICAL',
    type: 'WEATHER',
    farmerId: 'farmer-101',
    read: false,
    actionableStep: 'Postpone fertilizer top-dressing and clear field drainage ditches.',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'alt-4',
    title: 'Crop Risk: Yellow Rust Spore Inoculum in Region',
    description: 'Neighboring blocks report localized stripe rust on susceptible wheat cultivars.',
    severity: 'LOW',
    type: 'DISEASE',
    farmId: 'farm-2',
    cropId: 'crop-3',
    farmerId: 'farmer-101',
    read: true,
    actionableStep: 'Keep Propiconazole 25% EC on standby if powdery yellow stripes appear.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

let inMemoryAlerts = [...sampleAlertsFallback];

export class AlertService {
  public static async getAlerts(filter?: {
    farmerId?: string;
    farmId?: string;
    severity?: AlertSeverity;
    type?: AlertType;
    unreadOnly?: boolean;
  }) {
    if (!isDbConnected()) {
      let filtered = [...inMemoryAlerts];
      if (filter?.farmerId) filtered = filtered.filter((a) => a.farmerId === filter.farmerId);
      if (filter?.farmId) filtered = filtered.filter((a) => a.farmId === filter.farmId);
      if (filter?.severity) filtered = filtered.filter((a) => a.severity === filter.severity);
      if (filter?.type) filtered = filtered.filter((a) => a.type === filter.type);
      if (filter?.unreadOnly) filtered = filtered.filter((a) => !a.read);
      return filtered;
    }

    const query: any = {};
    if (filter?.farmerId) query.farmerId = filter.farmerId;
    if (filter?.farmId) query.farmId = filter.farmId;
    if (filter?.severity) query.severity = filter.severity;
    if (filter?.type) query.type = filter.type;
    if (filter?.unreadOnly) query.read = false;

    return AlertModel.find(query).sort({ createdAt: -1 });
  }

  public static async getAlertById(id: string) {
    if (!isDbConnected()) {
      const alert = inMemoryAlerts.find((a) => a.id === id || (a as any)._id === id);
      if (!alert) {
        throw ApiError.notFound(`Alert with ID ${id} not found`);
      }
      return alert;
    }

    const query = buildIdQuery(id);
    const alert = await AlertModel.findOne(query);
    if (!alert) {
      throw ApiError.notFound(`Alert with ID ${id} not found`);
    }
    return alert;
  }

  public static async createAlert(alertData: IAlert) {
    if (!isDbConnected()) {
      const newAlert: IAlert = {
        ...alertData,
        id: `alt-${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      };
      inMemoryAlerts.unshift(newAlert);
      return newAlert;
    }

    return AlertModel.create(alertData);
  }

  public static async markRead(id: string) {
    if (!isDbConnected()) {
      const idx = inMemoryAlerts.findIndex((a) => a.id === id || (a as any)._id === id);
      if (idx !== -1) {
        inMemoryAlerts[idx].read = true;
        return inMemoryAlerts[idx];
      }
      return null;
    }

    const query = buildIdQuery(id);
    return AlertModel.findOneAndUpdate(query, { read: true }, { new: true });
  }

  public static async markAllRead(farmerId?: string) {
    if (!isDbConnected()) {
      inMemoryAlerts.forEach((a) => {
        if (!farmerId || a.farmerId === farmerId) {
          a.read = true;
        }
      });
      return true;
    }

    const query = farmerId ? { farmerId } : {};
    await AlertModel.updateMany(query, { read: true });
    return true;
  }

  public static async deleteAlert(id: string) {
    if (!isDbConnected()) {
      inMemoryAlerts = inMemoryAlerts.filter((a) => a.id !== id && (a as any)._id !== id);
      return true;
    }

    const query = buildIdQuery(id);
    await AlertModel.findOneAndDelete(query);
    return true;
  }
}
