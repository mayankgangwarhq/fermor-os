import type { WeatherData, FarmLocation } from '../types';
import { DEFAULT_FARM_LOCATION } from './locationService';
import { weatherApi } from './api';

/**
 * Fetches real-time weather through the AGRINEXT backend Open-Meteo integration.
 */
export const fetchWeatherForCoordinates = async (
  latitude: number = DEFAULT_FARM_LOCATION.latitude,
  longitude: number = DEFAULT_FARM_LOCATION.longitude,
  locationName: string = DEFAULT_FARM_LOCATION.village || 'Jagatpura (VGU)',
  districtName: string = DEFAULT_FARM_LOCATION.district || 'Jaipur',
  stateName: string = DEFAULT_FARM_LOCATION.state || 'Rajasthan'
): Promise<WeatherData> => {
  try {
    const data = await weatherApi.getWeather({
      lat: latitude,
      lon: longitude,
      district: districtName,
      state: stateName,
      locationName: locationName,
    });

    if (data && data.sourceStatus !== 'UNAVAILABLE') {
      return {
        ...data,
        location: locationName || data.location,
        district: districtName || data.district,
        state: stateName || data.state,
      };
    }

    if (data && data.sourceStatus === 'UNAVAILABLE') {
      return data;
    }

    throw new Error('No weather data received from backend');
  } catch (err: any) {
    console.warn('[WeatherService] Backend weather query error:', err.message);
    return {
      temperature: 0,
      condition: 'Weather data temporarily unavailable',
      weatherCode: -1,
      humidity: 0,
      windSpeed: 0,
      rainProbability: 0,
      precipitation: 0,
      location: locationName || `${districtName}, ${stateName}`,
      district: districtName,
      state: stateName,
      forecast: [],
      alerts: [
        {
          id: 'w-unavailable',
          type: 'disease',
          severity: 'warning',
          title: 'Weather Service Notice',
          description: 'Weather data temporarily unavailable from meteorology provider.',
          actionableStep: 'Please check connection or retry in a few moments.',
        },
      ],
      source: 'Open-Meteo Weather API',
      sourceStatus: 'UNAVAILABLE',
      lastUpdated: new Date().toISOString(),
      errorMessage: 'Weather data temporarily unavailable',
    };
  }
};

/**
 * Fetches weather for a FarmLocation object or place string name via backend service.
 */
export const fetchWeatherForLocation = async (
  locOrQuery: FarmLocation | string = DEFAULT_FARM_LOCATION
): Promise<WeatherData> => {
  if (typeof locOrQuery === 'object' && locOrQuery !== null) {
    return await fetchWeatherForCoordinates(
      locOrQuery.latitude || DEFAULT_FARM_LOCATION.latitude,
      locOrQuery.longitude || DEFAULT_FARM_LOCATION.longitude,
      locOrQuery.village || locOrQuery.city || locOrQuery.district || 'Jagatpura (VGU)',
      locOrQuery.district || 'Jaipur',
      locOrQuery.state || 'Rajasthan'
    );
  }

  // String lookup through backend
  return await fetchWeatherForCoordinates(
    DEFAULT_FARM_LOCATION.latitude,
    DEFAULT_FARM_LOCATION.longitude,
    locOrQuery,
    locOrQuery,
    'Rajasthan'
  );
};
