import { IWeatherData, IWeatherForecastDay, IWeatherAlert } from '../types';
import { config } from '../config/env';

export class WeatherService {
  /**
   * Fetches weather metrics for farm coordinates or district.
   * Keeps API keys completely private on the backend.
   */
  public static async getWeatherData(params?: {
    latitude?: number;
    longitude?: number;
    district?: string;
    state?: string;
  }): Promise<IWeatherData> {
    const lat = params?.latitude || 22.7196;
    const lon = params?.longitude || 75.8577;
    const district = params?.district || 'Indore';
    const state = params?.state || 'Madhya Pradesh';

    try {
      // Use public Open-Meteo API as reliable live backend provider (no client credentials exposed)
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`;
      const response = await fetch(url, { signal: AbortSignal.timeout(4000) });

      if (response.ok) {
        const data = await response.json();
        const current = data.current || {};
        const daily = data.daily || {};

        const weatherCodeToText = (code: number) => {
          if (code === 0) return 'Clear Sunny';
          if (code >= 1 && code <= 3) return 'Partly Cloudy';
          if (code >= 45 && code <= 48) return 'Foggy / Hazy';
          if (code >= 51 && code <= 67) return 'Light Rain / Drizzle';
          if (code >= 71 && code <= 77) return 'Light Hail / Snow';
          if (code >= 80 && code <= 82) return 'Rain Showers';
          if (code >= 95) return 'Thunderstorm';
          return 'Pleasant';
        };

        const forecast: IWeatherForecastDay[] = (daily.time || []).map((dateStr: string, idx: number) => {
          const d = new Date(dateStr);
          const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
          const code = daily.weather_code?.[idx] || 0;
          return {
            day: dayName,
            tempMax: Math.round(daily.temperature_2m_max?.[idx] ?? 31),
            tempMin: Math.round(daily.temperature_2m_min?.[idx] ?? 18),
            condition: weatherCodeToText(code),
            rainChance: daily.precipitation_probability_max?.[idx] ?? 10,
            icon: code > 50 ? 'CloudRain' : code > 0 ? 'CloudSun' : 'Sun',
          };
        });

        const rainProb = daily.precipitation_probability_max?.[0] ?? 15;
        const currentTemp = Math.round(current.temperature_2m ?? 28);

        const alerts: IWeatherAlert[] = [];
        if (rainProb > 40) {
          alerts.push({
            id: 'w-rain',
            type: 'rain',
            severity: 'warning',
            title: 'Precipitation Advisory',
            description: `${rainProb}% chance of rain forecast in ${district} in the next 24 hours.`,
            actionableStep: 'Postpone chemical spraying and prepare farm drainage outlets.',
          });
        }
        if (currentTemp > 38) {
          alerts.push({
            id: 'w-heat',
            type: 'heat',
            severity: 'critical',
            title: 'High Heat Wave Advisory',
            description: `Extreme temperatures up to ${currentTemp}°C may cause leaf scorched stress.`,
            actionableStep: 'Schedule light drip irrigation during early morning or dusk.',
          });
        }

        return {
          location: `${district}, ${state}`,
          district,
          state,
          temperature: currentTemp,
          condition: weatherCodeToText(current.weather_code ?? 0),
          humidity: Math.round(current.relative_humidity_2m ?? 48),
          windSpeed: Math.round(current.wind_speed_10m ?? 12),
          rainProbability: rainProb,
          forecast,
          alerts,
          sourceStatus: 'LIVE DATA',
          lastUpdated: new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('[WeatherService] Live weather fetch fallback triggered:', (err as Error).message);
    }

    // High quality fallback dataset
    return {
      location: `${district}, ${state}`,
      district,
      state,
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 52,
      windSpeed: 11,
      rainProbability: 20,
      forecast: [
        { day: 'Today', tempMax: 31, tempMin: 18, condition: 'Partly Cloudy', rainChance: 20, icon: 'CloudSun' },
        { day: 'Tomorrow', tempMax: 32, tempMin: 19, condition: 'Sunny', rainChance: 10, icon: 'Sun' },
        { day: 'Wed', tempMax: 29, tempMin: 17, condition: 'Light Rain', rainChance: 45, icon: 'CloudRain' },
        { day: 'Thu', tempMax: 30, tempMin: 18, condition: 'Clear', rainChance: 15, icon: 'Sun' },
        { day: 'Fri', tempMax: 32, tempMin: 20, condition: 'Clear', rainChance: 5, icon: 'Sun' },
      ],
      alerts: [
        {
          id: 'w-1',
          type: 'rain',
          severity: 'warning',
          title: 'Rain Forecast for Central India',
          description: 'Isolated light showers expected over the next 48 hours.',
          actionableStep: 'Avoid pesticide spraying until dry weather resumes.',
        },
      ],
      sourceStatus: 'DEMO DATA',
      lastUpdated: new Date().toISOString(),
    };
  }
}
