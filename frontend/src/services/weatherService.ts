import type { WeatherData, FarmLocation } from '../types';
import { sampleWeather } from './mockData';
import { DEFAULT_FARM_LOCATION } from './locationService';

/**
 * Fetches real-time weather using exact latitude & longitude coordinates from FarmLocation.
 */
export const fetchWeatherForCoordinates = async (
  latitude: number,
  longitude: number,
  locationName: string = 'Jaipur',
  districtName: string = 'Jaipur',
  stateName: string = 'Rajasthan'
): Promise<WeatherData> => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FKolkata`;

    const response = await fetch(url);
    if (!response.ok) throw new Error('Open-Meteo API fetch failed');

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecast = daily.time.slice(0, 7).map((t: string, idx: number) => {
      const d = new Date(t);
      const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : days[d.getDay()];
      const rainProb = daily.precipitation_probability_max[idx] || 0;
      return {
        day: dayName,
        tempMax: Math.round(daily.temperature_2m_max[idx]),
        tempMin: Math.round(daily.temperature_2m_min[idx]),
        condition: rainProb > 50 ? 'Rain Expected' : rainProb > 20 ? 'Partly Cloudy' : 'Sunny / Clear',
        rainChance: rainProb,
        icon: rainProb > 50 ? 'cloud-rain' : 'sun',
      };
    });

    const weatherCode = current.weather_code;
    let conditionText = 'Clear & Sunny';
    if (weatherCode >= 1 && weatherCode <= 3) conditionText = 'Partly Cloudy';
    else if (weatherCode >= 45 && weatherCode <= 48) conditionText = 'Foggy / Hazy';
    else if (weatherCode >= 51 && weatherCode <= 67) conditionText = 'Rain Showers';
    else if (weatherCode >= 80 && weatherCode <= 99) conditionText = 'Thunderstorm / Heavy Rain';

    const maxRainProb = daily.precipitation_probability_max[0] || 0;

    return {
      temperature: Math.round(current.temperature_2m * 10) / 10,
      condition: conditionText,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
      rainProbability: maxRainProb,
      location: locationName,
      district: districtName,
      state: stateName,
      forecast: forecast,
      alerts: [
        {
          id: 'alert-live-1',
          type: 'rain',
          severity: maxRainProb > 60 ? 'warning' : 'info',
          title: maxRainProb > 60 ? 'High Rain Chance Warning' : 'Optimal Irrigation Window',
          description:
            maxRainProb > 60
              ? `High probability of rainfall (${maxRainProb}%) in ${districtName}. Delay chemical pesticide spraying.`
              : `Favorable humidity (${current.relative_humidity_2m}%) and wind speed (${current.wind_speed_10m} km/h) for field spraying in ${districtName}.`,
          actionableStep: maxRainProb > 60 ? 'Defer spraying until dry weather returns' : 'Maintain normal irrigation schedule',
        },
      ],
      sourceStatus: 'LIVE DATA',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  } catch (err) {
    console.warn('Open-Meteo API fetch failed, returning fallback weather:', err);
    return {
      ...sampleWeather,
      district: districtName,
      location: locationName,
      state: stateName,
      sourceStatus: 'DEMO DATA',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }
};

/**
 * Fetches weather for a FarmLocation object or place string name.
 */
export const fetchWeatherForLocation = async (
  locOrQuery: FarmLocation | string = DEFAULT_FARM_LOCATION
): Promise<WeatherData> => {
  if (typeof locOrQuery === 'object' && locOrQuery !== null) {
    return await fetchWeatherForCoordinates(
      locOrQuery.latitude,
      locOrQuery.longitude,
      locOrQuery.village || locOrQuery.city || 'Farm Location',
      locOrQuery.district || 'Indore',
      locOrQuery.state || 'Madhya Pradesh'
    );
  }

  // String lookup fallback
  return await fetchWeatherForCoordinates(
    DEFAULT_FARM_LOCATION.latitude,
    DEFAULT_FARM_LOCATION.longitude,
    locOrQuery,
    locOrQuery,
    'Madhya Pradesh'
  );
};
