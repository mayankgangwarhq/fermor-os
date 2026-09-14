import { IWeatherData } from '../types';
import { OpenMeteoWeatherService, mapWeatherCode } from './weather/openMeteo.service';

export { mapWeatherCode, OpenMeteoWeatherService };

/**
 * WeatherService delegates all live meteorological telemetry directly to OpenMeteoWeatherService.
 * Official Provider: Open-Meteo API (https://api.open-meteo.com/v1/forecast)
 * Authentication: NONE (Keyless Public API)
 */
export class WeatherService {
  public static async getWeatherData(params?: {
    latitude?: number;
    longitude?: number;
    district?: string;
    state?: string;
    locationName?: string;
  }): Promise<IWeatherData> {
    return OpenMeteoWeatherService.getWeatherData(params);
  }
}
