import { Request, Response, NextFunction } from 'express';
import { WeatherService } from '../services/weather.service';
import { sendSuccess } from '../utils/apiResponse';

export class WeatherController {
  public static async getWeather(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lon, latitude, longitude, district, state, locationName } = req.query;
      const weather = await WeatherService.getWeatherData({
        latitude: lat ? parseFloat(lat as string) : latitude ? parseFloat(latitude as string) : undefined,
        longitude: lon ? parseFloat(lon as string) : longitude ? parseFloat(longitude as string) : undefined,
        district: district as string,
        state: state as string,
        locationName: locationName as string,
      });
      return sendSuccess(res, weather, 'Weather advisory retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  public static async getWeatherForecast(req: Request, res: Response, next: NextFunction) {
    try {
      const { lat, lon, district } = req.query;
      const weather = await WeatherService.getWeatherData({
        latitude: lat ? parseFloat(lat as string) : undefined,
        longitude: lon ? parseFloat(lon as string) : undefined,
        district: district as string,
      });
      return sendSuccess(res, weather.forecast, 'Weather forecast retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}
