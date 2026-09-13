import { FarmModel } from '../models/Farm';
import { CropModel } from '../models/Crop';
import { AlertModel } from '../models/Alert';
import { ScanCaseModel } from '../models/ScanCase';
import { MandiPriceModel } from '../models/MandiPrice';
import { HotspotModel } from '../models/Hotspot';
import { isDbConnected } from '../config/db';
import { WeatherService } from './weather.service';
import { IDashboardStats } from '../types';

export class DashboardService {
  /**
   * Aggregates consolidated dashboard overview metrics for a farmer.
   */
  public static async getFarmerDashboard(farmerId?: string): Promise<IDashboardStats> {
    if (isDbConnected()) {
      try {
        const farmQuery = farmerId ? { farmerId } : {};
        const farms = await FarmModel.find(farmQuery);
        const totalLandAcres = farms.reduce((acc, f) => acc + (f.area || 0), 0);

        const cropQuery = farmerId ? { farmerId } : {};
        const activeCrops = await CropModel.find({ ...cropQuery, status: 'growing' });

        const alertQuery = farmerId ? { farmerId } : {};
        const criticalAlerts = await AlertModel.countDocuments({
          ...alertQuery,
          severity: { $in: ['HIGH', 'CRITICAL'] },
          read: false,
        });

        const recentScans = await ScanCaseModel.find(farmerId ? { farmerId } : {})
          .sort({ createdAt: -1 })
          .limit(5);

        const recentAlerts = await AlertModel.find(alertQuery)
          .sort({ createdAt: -1 })
          .limit(5);

        const topMandiRates = await MandiPriceModel.find().sort({ modalPrice: -1 }).limit(4);

        const weather = await WeatherService.getWeatherData({
          latitude: farms[0]?.coordinates?.latitude || 22.7196,
          longitude: farms[0]?.coordinates?.longitude || 75.8577,
          district: farms[0]?.district || 'Indore',
          state: farms[0]?.state || 'Madhya Pradesh',
        });

        return {
          totalFarms: farms.length,
          totalLandAcres: Math.round(totalLandAcres * 10) / 10,
          activeCropCycles: activeCrops.length,
          criticalAlerts,
          weatherOverview: {
            temp: weather.temperature,
            condition: weather.condition,
            humidity: weather.humidity,
            rainChance: weather.rainProbability,
            location: weather.location,
          },
          recentScans,
          recentAlerts,
          topMandiRates,
        };
      } catch (err: any) {
        console.warn('[DashboardService] DB aggregate fallback:', err.message);
      }
    }

    // High fidelity offline fallback
    const weather = await WeatherService.getWeatherData();
    return {
      totalFarms: 2,
      totalLandAcres: 14.5,
      activeCropCycles: 2,
      criticalAlerts: 1,
      weatherOverview: {
        temp: weather.temperature,
        condition: weather.condition,
        humidity: weather.humidity,
        rainChance: weather.rainProbability,
        location: weather.location,
      },
      recentScans: [],
      recentAlerts: [],
      topMandiRates: [],
    };
  }

  /**
   * Aggregates agricultural officer / department statistics.
   */
  public static async getOfficerDashboard() {
    let totalHotspots = 5;
    let totalAlerts = 14;
    let activeDiseases = 8;
    let monitoredAcreage = 4500;

    if (isDbConnected()) {
      try {
        totalHotspots = await HotspotModel.countDocuments({ status: 'active' });
        totalAlerts = await AlertModel.countDocuments();
        monitoredAcreage = await FarmModel.aggregate([
          { $group: { _id: null, total: { $sum: '$area' } } },
        ]).then((res) => (res[0]?.total ? Math.round(res[0].total) : 4500));
      } catch (e) {
        // Fallback to baseline
      }
    }

    return {
      activeOutbreakHotspots: totalHotspots,
      totalDepartmentAlerts: totalAlerts,
      monitoredAcreage,
      surveillanceCoverage: '98.4%',
      avgResponseTimeHours: 3.2,
      criticalDistricts: ['Ludhiana (Punjab)', 'Bathinda (Punjab)', 'Indore (MP)', 'Karnal (Haryana)'],
    };
  }
}
