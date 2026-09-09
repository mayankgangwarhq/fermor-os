import type { FarmLocation } from '../types';

export const LOCAL_STORAGE_LOCATION_KEY = 'agrinext_farm_location';

export const DEFAULT_FARM_LOCATION: FarmLocation = {
  latitude: 26.9124,
  longitude: 75.7873,
  village: 'Jagatpura (VGU)',
  city: 'Jaipur',
  district: 'Jaipur',
  state: 'Rajasthan',
  country: 'India',
  pincode: '302017',
  formattedAddress: 'Jagatpura (VGU), Jaipur, Rajasthan, India',
  source: 'manual',
  updatedAt: new Date().toISOString()
};

/**
 * Loads the saved farm location from localStorage or returns DEFAULT_FARM_LOCATION.
 */
export const getSavedFarmLocation = (): FarmLocation => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LOCATION_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.latitude === 'number' && typeof parsed.longitude === 'number') {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse saved farm location, using default:', err);
  }
  return DEFAULT_FARM_LOCATION;
};

/**
 * Saves farm location to localStorage.
 */
export const saveFarmLocationToStorage = (loc: FarmLocation): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_LOCATION_KEY, JSON.stringify(loc));
  } catch (err) {
    console.warn('Failed to save farm location to localStorage:', err);
  }
};

/**
 * Performs Reverse Geocoding for lat/lon coordinates using OpenStreetMap Nominatim with Open-Meteo fallback.
 */
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number,
  source: 'gps' | 'search' | 'manual' = 'gps'
): Promise<FarmLocation> => {
  try {
    // Attempt Nominatim reverse geocoding
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'AGRINEXT-AgriTech-Platform/1.0'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      
      const village = addr.village || addr.suburb || addr.neighbourhood || addr.hamlet || addr.town || '';
      const city = addr.city || addr.town || addr.municipality || addr.county || 'Jaipur';
      const district = addr.state_district || addr.county || addr.city || city;
      const state = addr.state || 'Rajasthan';
      const country = addr.country || 'India';
      const pincode = addr.postcode || '';

      const locationParts = [village, city, district, state].filter(Boolean);
      const formattedAddress = locationParts.length > 0 ? locationParts.join(', ') : `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;

      return {
        latitude,
        longitude,
        village: village || city,
        city: city || district,
        district,
        state,
        country,
        pincode,
        formattedAddress,
        source,
        updatedAt: new Date().toISOString()
      };
    }
  } catch (err) {
    console.warn('Nominatim Reverse Geocoding failed, attempting Open-Meteo fallback:', err);
  }

  // Fallback for coordinates format
  return {
    latitude,
    longitude,
    village: 'Current Farm Plot',
    city: 'Local Region',
    district: 'Local District',
    state: 'State Region',
    country: 'India',
    formattedAddress: `${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E`,
    source,
    updatedAt: new Date().toISOString()
  };
};

/**
 * Searches locations using Open-Meteo Geocoding API.
 */
export const searchLocations = async (query: string): Promise<FarmLocation[]> => {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Search failed');
    
    const data = await res.json();
    if (!data.results || data.results.length === 0) return [];

    return data.results.map((r: any) => {
      const city = r.name || '';
      const district = r.admin2 || r.admin1 || city;
      const state = r.admin1 || r.country || '';
      const country = r.country || 'India';

      const parts = [city, district !== city ? district : null, state].filter(Boolean);
      const formattedAddress = parts.join(', ');

      return {
        latitude: r.latitude,
        longitude: r.longitude,
        village: city,
        city: city,
        district: district,
        state: state,
        country: country,
        formattedAddress: formattedAddress,
        source: 'search' as const,
        updatedAt: new Date().toISOString()
      };
    });
  } catch (err) {
    console.warn('Geocoding search API error:', err);
    return [];
  }
};
