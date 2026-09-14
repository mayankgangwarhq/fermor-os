import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weather.service';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export class WeatherController {
  public static async getWeather(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lon, latitude, longitude, district, state, locationName } = req.query;

      const rawLat = lat !== undefined ? lat : latitude;
      const rawLon = lon !== undefined ? lon : longitude;

      let parsedLat: number | undefined;
      let parsedLon: number | undefined;

      if (rawLat !== undefined && rawLat !== '') {
        parsedLat = parseFloat(rawLat as string);
        if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
          return sendError(
            res,
            'Invalid latitude parameter. Latitude must be a valid number between -90 and 90.',
            400
          );
        }
      }

      if (rawLon !== undefined && rawLon !== '') {
        parsedLon = parseFloat(rawLon as string);
        if (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180) {
          return sendError(
            res,
            'Invalid longitude parameter. Longitude must be a valid number between -180 and 180.',
            400
          );
        }
      }

      const weather = await WeatherService.getWeatherData({
        latitude: parsedLat,
        longitude: parsedLon,
        district: typeof district === 'string' ? district : undefined,
        state: typeof state === 'string' ? state : undefined,
        locationName: typeof locationName === 'string' ? locationName : undefined,
      });

      return sendSuccess(res, weather, 'Weather advisory retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getWeatherForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lon, latitude, longitude, district, state, locationName } = req.query;

      const rawLat = lat !== undefined ? lat : latitude;
      const rawLon = lon !== undefined ? lon : longitude;

      let parsedLat: number | undefined;
      let parsedLon: number | undefined;

      if (rawLat !== undefined && rawLat !== '') {
        parsedLat = parseFloat(rawLat as string);
        if (isNaN(parsedLat) || parsedLat < -90 || parsedLat > 90) {
          return sendError(
            res,
            'Invalid latitude parameter. Latitude must be a valid number between -90 and 90.',
            400
          );
        }
      }

      if (rawLon !== undefined && rawLon !== '') {
        parsedLon = parseFloat(rawLon as string);
        if (isNaN(parsedLon) || parsedLon < -180 || parsedLon > 180) {
          return sendError(
            res,
            'Invalid longitude parameter. Longitude must be a valid number between -180 and 180.',
            400
          );
        }
      }

      const weather = await WeatherService.getWeatherData({
        latitude: parsedLat,
        longitude: parsedLon,
        district: typeof district === 'string' ? district : undefined,
        state: typeof state === 'string' ? state : undefined,
        locationName: typeof locationName === 'string' ? locationName : undefined,
      });

      return sendSuccess(res, weather.forecast, 'Weather forecast retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
