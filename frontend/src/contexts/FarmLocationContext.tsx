import React, { createContext, useContext, useState, useEffect } from 'react';
import type { FarmLocation } from '../types';
import {
  getSavedFarmLocation,
  saveFarmLocationToStorage,
  getAddressFromCoordinates,
  searchLocations as apiSearchLocations,
  DEFAULT_FARM_LOCATION
} from '../services/locationService';

interface FarmLocationContextType {
  location: FarmLocation;
  isDetecting: boolean;
  isUpdatingWeather: boolean;
  error: string | null;
  setLocation: (newLoc: FarmLocation) => void;
  detectCurrentLocation: () => Promise<boolean>;
  searchLocations: (query: string) => Promise<FarmLocation[]>;
  saveManualLocation: (village: string, district: string, state: string, pincode?: string) => Promise<void>;
  isPickerOpen: boolean;
  openPicker: () => void;
  closePicker: () => void;
  clearError: () => void;
}

const FarmLocationContext = createContext<FarmLocationContextType | undefined>(undefined);

export const FarmLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<FarmLocation>(() => getSavedFarmLocation());
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isUpdatingWeather, setIsUpdatingWeather] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);

  // Sync state to storage
  const setLocation = (newLoc: FarmLocation) => {
    setLocationState(newLoc);
    saveFarmLocationToStorage(newLoc);
    setError(null);
  };

  const openPicker = () => setIsPickerOpen(true);
  const closePicker = () => setIsPickerOpen(false);
  const clearError = () => setError(null);

  /**
   * Option A: Detect GPS coordinates with high accuracy and reverse geocode address.
   */
  const detectCurrentLocation = async (): Promise<boolean> => {
    setIsDetecting(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Please search or enter location manually.');
      setIsDetecting(false);
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const geocodedLoc = await getAddressFromCoordinates(latitude, longitude, 'gps');
            setLocation(geocodedLoc);
            setIsDetecting(false);
            resolve(true);
          } catch (err: any) {
            console.error('Error during reverse geocoding:', err);
            setError('Failed to resolve address from GPS coordinates. Using GPS location.');
            setIsDetecting(false);
            resolve(false);
          }
        },
        (err) => {
          console.warn('Geolocation position error:', err);
          let userMsg = 'Could not retrieve your GPS location.';
          if (err.code === err.PERMISSION_DENIED) {
            userMsg = 'Location permission denied. Please grant location access or search your city manually.';
          } else if (err.code === err.TIMEOUT) {
            userMsg = 'GPS location request timed out. Please try again or search manually.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            userMsg = 'GPS position unavailable. Please check your device location settings.';
          }
          setError(userMsg);
          setIsDetecting(false);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  };

  /**
   * Option B: Search locations using Open-Meteo Geocoding API.
   */
  const searchLocations = async (query: string): Promise<FarmLocation[]> => {
    return await apiSearchLocations(query);
  };

  /**
   * Option C: Save location manually from form inputs.
   */
  const saveManualLocation = async (
    village: string,
    district: string,
    state: string,
    pincode?: string
  ): Promise<void> => {
    setIsDetecting(true);
    setError(null);
    const query = [village, district, state].filter(Boolean).join(', ');

    try {
      const results = await apiSearchLocations(query);
      if (results && results.length > 0) {
        const match = results[0];
        setLocation({
          ...match,
          village: village || match.village,
          district: district || match.district,
          state: state || match.state,
          pincode: pincode || match.pincode,
          source: 'manual'
        });
      } else {
        // Fallback manual construct if search returns 0 results
        setLocation({
          latitude: location.latitude || DEFAULT_FARM_LOCATION.latitude,
          longitude: location.longitude || DEFAULT_FARM_LOCATION.longitude,
          village,
          district,
          state,
          country: 'India',
          pincode,
          formattedAddress: [village, district, state].filter(Boolean).join(', '),
          source: 'manual',
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('Manual location geocode error:', err);
      setLocation({
        latitude: DEFAULT_FARM_LOCATION.latitude,
        longitude: DEFAULT_FARM_LOCATION.longitude,
        village,
        district,
        state,
        country: 'India',
        pincode,
        formattedAddress: [village, district, state].filter(Boolean).join(', '),
        source: 'manual',
        updatedAt: new Date().toISOString()
      });
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <FarmLocationContext.Provider
      value={{
        location,
        isDetecting,
        isUpdatingWeather,
        error,
        setLocation,
        detectCurrentLocation,
        searchLocations,
        saveManualLocation,
        isPickerOpen,
        openPicker,
        closePicker,
        clearError
      }}
    >
      {children}
    </FarmLocationContext.Provider>
  );
};

export const useFarmLocation = (): FarmLocationContextType => {
  const context = useContext(FarmLocationContext);
  if (!context) {
    throw new Error('useFarmLocation must be used within a FarmLocationProvider');
  }
  return context;
};
