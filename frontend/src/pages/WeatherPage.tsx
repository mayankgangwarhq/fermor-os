import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { weatherApi } from '../services/api';
import { fetchWeatherForLocation } from '../services/weatherService';
import { DataBadge } from '../components/common/DataBadge';
import { INDIA_STATES_DATA, getDistrictCoordinates } from '../data/indiaLocations';
import type { WeatherData } from '../types';
import {
  Sun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  MapPin,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Clock,
  ShieldAlert,
  ChevronRight,
  Compass,
  Building2,
  Tractor,
} from 'lucide-react';
import { useFarmLocation } from '../contexts/FarmLocationContext';

/**
 * Safely format timestamp to: "09:20 AM, 14 Sep 2026"
 * Never returns "Invalid Date"
 */
export const formatWeatherTimestamp = (dateInput?: string | Date | null): string => {
  let d: Date;
  if (!dateInput) {
    d = new Date();
  } else if (typeof dateInput === 'string') {
    d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      d = new Date();
    }
  } else if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
    d = dateInput;
  } else {
    d = new Date();
  }

  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');

  const day = d.getDate().toString().padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();

  return `${displayHours}:${minutes} ${ampm}, ${day} ${month} ${year}`;
};

export const WeatherPage: React.FC = () => {
  const { weather: initialWeather, farms } = useData();
  const { location: farmLoc, openPicker } = useFarmLocation();
  const { t } = useLanguage();

  // 1. Initial State from user profile or default Rajasthan/Jaipur
  const defaultState = useMemo(() => {
    const found = INDIA_STATES_DATA.find(
      (s) => s.state.toLowerCase() === (farmLoc.state || '').toLowerCase()
    );
    return found ? found.state : 'Rajasthan';
  }, [farmLoc.state]);

  const defaultDistrict = useMemo(() => {
    const stateObj = INDIA_STATES_DATA.find((s) => s.state === defaultState);
    const found = stateObj?.districts.find(
      (d) => d.name.toLowerCase() === (farmLoc.district || '').toLowerCase()
    );
    return found ? found.name : stateObj?.districts[0]?.name || 'Jaipur';
  }, [defaultState, farmLoc.district]);

  const [selectedState, setSelectedState] = useState<string>(defaultState);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(defaultDistrict);
  const [selectedLocationName, setSelectedLocationName] = useState<string>(
    farmLoc.village || 'Jagatpura (VGU)'
  );
  const [selectedOptionKey, setSelectedOptionKey] = useState<string>('profile-farm');

  const [weatherData, setWeatherData] = useState<WeatherData>(initialWeather);
  const [loading, setLoading] = useState(false);

  // Available districts for the current selected state
  const availableDistricts = useMemo(() => {
    const s = INDIA_STATES_DATA.find((item) => item.state === selectedState);
    return s ? s.districts : [];
  }, [selectedState]);

  // Current district object with coordinates and popular locations
  const currentDistrictObj = useMemo(() => {
    return (
      availableDistricts.find((d) => d.name === selectedDistrict) ||
      availableDistricts[0] || {
        name: selectedDistrict,
        lat: 26.9124,
        lon: 75.7873,
        popularLocations: ['Central APMC Hub'],
      }
    );
  }, [availableDistricts, selectedDistrict]);

  // Available farm / location options for the current district
  const availableLocationOptions = useMemo(() => {
    const options: Array<{
      key: string;
      label: string;
      locationName: string;
      lat: number;
      lon: number;
      type: 'my-farm' | 'popular' | 'district-hub';
    }> = [];

    // A. Check user's active farm from FarmLocationContext (Priority)
    if (
      farmLoc.district?.toLowerCase() === selectedDistrict.toLowerCase() ||
      farmLoc.state?.toLowerCase() === selectedState.toLowerCase()
    ) {
      options.push({
        key: 'profile-farm',
        label: `🚜 Active Farm: ${farmLoc.village || 'My Farm Plot'} (${farmLoc.latitude.toFixed(4)}°, ${farmLoc.longitude.toFixed(4)}°)`,
        locationName: farmLoc.village || 'Jagatpura (VGU)',
        lat: farmLoc.latitude,
        lon: farmLoc.longitude,
        type: 'my-farm',
      });
    }

    // B. Check registered farms from DataContext
    if (farms && farms.length > 0) {
      farms.forEach((farm) => {
        const matchesDistrict =
          farm.location.toLowerCase().includes(selectedDistrict.toLowerCase()) ||
          selectedDistrict.toLowerCase().includes(farm.location.toLowerCase());

        if (matchesDistrict) {
          options.push({
            key: `farm-${farm.id}`,
            label: `🚜 My Farm: ${farm.name} — ${farm.location}`,
            locationName: farm.location,
            lat: currentDistrictObj.lat,
            lon: currentDistrictObj.lon,
            type: 'my-farm',
          });
        }
      });
    }

    // C. Popular agricultural hubs & mandis in this district
    if (currentDistrictObj.popularLocations && currentDistrictObj.popularLocations.length > 0) {
      currentDistrictObj.popularLocations.forEach((loc, idx) => {
        options.push({
          key: `pop-${idx}-${loc}`,
          label: `📍 ${loc}`,
          locationName: loc,
          lat: currentDistrictObj.lat,
          lon: currentDistrictObj.lon,
          type: 'popular',
        });
      });
    }

    // D. District Central Mandi / APMC Default
    options.push({
      key: 'district-center',
      label: `🏢 Central District Hub (${currentDistrictObj.name} APMC)`,
      locationName: `${currentDistrictObj.name} Central`,
      lat: currentDistrictObj.lat,
      lon: currentDistrictObj.lon,
      type: 'district-hub',
    });

    return options;
  }, [farmLoc, farms, selectedDistrict, selectedState, currentDistrictObj]);

  // Main weather fetch callback
  const fetchWeather = useCallback(
    async (params: { lat: number; lon: number; district: string; state: string; locationName: string }) => {
      setLoading(true);
      try {
        const fullLocationName = `${params.locationName}, ${params.district}, ${params.state}`;
        const res = await weatherApi.getWeather({
          lat: params.lat,
          lon: params.lon,
          district: params.district,
          state: params.state,
          locationName: fullLocationName,
        });

        if (res && res.sourceStatus !== 'UNAVAILABLE') {
          setWeatherData(res);
        } else if (res && res.sourceStatus === 'UNAVAILABLE') {
          setWeatherData(res);
        } else {
          const fallback = await fetchWeatherForLocation({
            ...farmLoc,
            latitude: params.lat,
            longitude: params.lon,
            district: params.district,
            state: params.state,
            formattedAddress: fullLocationName,
          });
          setWeatherData(fallback);
        }
      } catch {
        const fallback = await fetchWeatherForLocation({
          ...farmLoc,
          latitude: params.lat,
          longitude: params.lon,
          district: params.district,
          state: params.state,
          formattedAddress: `${params.locationName}, ${params.district}, ${params.state}`,
        });
        setWeatherData(fallback);
      } finally {
        setLoading(false);
      }
    },
    [farmLoc]
  );

  // Initial fetch on mount
  useEffect(() => {
    const coords = currentDistrictObj;
    const initialLat =
      farmLoc.district?.toLowerCase() === selectedDistrict.toLowerCase()
        ? farmLoc.latitude
        : coords.lat;
    const initialLon =
      farmLoc.district?.toLowerCase() === selectedDistrict.toLowerCase()
        ? farmLoc.longitude
        : coords.lon;

    fetchWeather({
      lat: initialLat,
      lon: initialLon,
      district: selectedDistrict,
      state: selectedState,
      locationName: selectedLocationName,
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle State Change
  const handleStateChange = async (newState: string) => {
    setSelectedState(newState);
    const stateObj = INDIA_STATES_DATA.find((s) => s.state === newState);
    const firstDistrict = stateObj?.districts[0] || {
      name: 'Central',
      lat: 26.9124,
      lon: 75.7873,
      popularLocations: ['District Center'],
    };

    setSelectedDistrict(firstDistrict.name);
    const firstLoc = firstDistrict.popularLocations?.[0] || `${firstDistrict.name} Center`;
    setSelectedLocationName(firstLoc);
    setSelectedOptionKey('pop-0');

    await fetchWeather({
      lat: firstDistrict.lat,
      lon: firstDistrict.lon,
      district: firstDistrict.name,
      state: newState,
      locationName: firstLoc,
    });
  };

  // Handle District Change
  const handleDistrictChange = async (newDistrict: string) => {
    setSelectedDistrict(newDistrict);
    const distObj = availableDistricts.find((d) => d.name === newDistrict) || {
      name: newDistrict,
      lat: 26.9124,
      lon: 75.7873,
      popularLocations: ['Central Hub'],
    };

    const firstLoc = distObj.popularLocations?.[0] || `${distObj.name} Center`;
    setSelectedLocationName(firstLoc);
    setSelectedOptionKey('pop-0');

    // Priority to farm coordinates if matching
    const isMatchingFarm =
      farmLoc.district?.toLowerCase() === newDistrict.toLowerCase() &&
      farmLoc.state?.toLowerCase() === selectedState.toLowerCase();

    const targetLat = isMatchingFarm ? farmLoc.latitude : distObj.lat;
    const targetLon = isMatchingFarm ? farmLoc.longitude : distObj.lon;

    await fetchWeather({
      lat: targetLat,
      lon: targetLon,
      district: distObj.name,
      state: selectedState,
      locationName: firstLoc,
    });
  };

  // Handle Location / Farm Option Change
  const handleLocationOptionChange = async (optionKey: string) => {
    setSelectedOptionKey(optionKey);
    const matched = availableLocationOptions.find((opt) => opt.key === optionKey);
    if (matched) {
      setSelectedLocationName(matched.locationName);
      await fetchWeather({
        lat: matched.lat,
        lon: matched.lon,
        district: selectedDistrict,
        state: selectedState,
        locationName: matched.locationName,
      });
    }
  };

  // Handle Quick Chip selection
  const handleQuickSelect = async (stateName: string, districtName: string, locName?: string) => {
    setSelectedState(stateName);
    setSelectedDistrict(districtName);

    const coords = getDistrictCoordinates(stateName, districtName) || {
      lat: 26.9124,
      lon: 75.7873,
      name: districtName,
    };

    const targetLoc = locName || `${districtName} APMC`;
    setSelectedLocationName(targetLoc);
    setSelectedOptionKey('pop-0');

    await fetchWeather({
      lat: coords.lat,
      lon: coords.lon,
      district: districtName,
      state: stateName,
      locationName: targetLoc,
    });
  };

  const isUnavailable = weatherData.sourceStatus === 'UNAVAILABLE';
  const expectedRainMm =
    typeof weatherData.forecast?.[0]?.precipitationSum === 'number'
      ? weatherData.forecast[0].precipitationSum
      : typeof weatherData.precipitation === 'number'
      ? weatherData.precipitation
      : 0;

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* 1. PAGE HEADER */}
      <div
        className="card"
        style={{
          padding: '24px',
          backgroundColor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          borderRadius: '18px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            AGRINEXT • {t('weather', 'WEATHER INTELLIGENCE')}
          </span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', margin: '2px 0 0 0' }}>
            {t('liveWeatherTitle', 'Live Weather Intelligence & Advisory')}
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '3px 0 0 0' }}>
            Weather data by Open-Meteo
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <DataBadge
            status={isUnavailable ? 'DEMO DATA' : 'CURRENT FORECAST DATA'}
            lastUpdated={formatWeatherTimestamp(weatherData.lastUpdated)}
          />
        </div>
      </div>

      {/* 2. SCALABLE INDIA LOCATION SELECTOR (State -> District -> Farm/Location) */}
      <div
        className="card"
        style={{
          padding: '22px',
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          border: '1.5px solid #e2e8f0',
          boxShadow: '0 4px 15px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Compass size={18} color="#0284c7" />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
              India Farm & Location Telemetry Selector
            </h3>
          </div>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0284c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>India</span>
            <ChevronRight size={14} />
            <span>{selectedState}</span>
            <ChevronRight size={14} />
            <span>{selectedDistrict}</span>
            <ChevronRight size={14} />
            <span style={{ color: '#0369a1', fontWeight: '800' }}>{selectedLocationName}</span>
          </div>
        </div>

        {/* 3-TIER DROPDOWNS GRID */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '14px',
          }}
        >
          {/* STEP 1: STATE SELECTOR */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
              1. State / UT
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {INDIA_STATES_DATA.map((s) => (
                  <option key={s.state} value={s.state}>
                    {s.state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* STEP 2: DISTRICT SELECTOR */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
              2. District ({availableDistricts.length} available)
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {availableDistricts.map((d) => (
                  <option key={d.name} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* STEP 3: FARM / LOCATION SELECTOR */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: '#475569', marginBottom: '5px', textTransform: 'uppercase' }}>
              3. Farm / Location Area
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedOptionKey}
                onChange={(e) => handleLocationOptionChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#f8fafc',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: '#0f172a',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {availableLocationOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* LOCATION BREADCRUMB & COORDINATE STATUS BAR */}
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: '#166534' }}>
              <strong>State:</strong> {selectedState}
            </span>
            <span style={{ color: '#166534' }}>
              <strong>District:</strong> {selectedDistrict}
            </span>
            <span style={{ color: '#15803d' }}>
              <strong>Location:</strong> {selectedLocationName}
            </span>
            <span style={{ color: '#047857', fontSize: '0.8rem' }}>
              <strong>Coordinates:</strong> {currentDistrictObj.lat.toFixed(4)}°N, {currentDistrictObj.lon.toFixed(4)}°E
            </span>
          </div>

          <button
            onClick={openPicker}
            className="btn btn-secondary"
            style={{
              padding: '4px 10px',
              fontSize: '0.78rem',
              fontWeight: '800',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#ffffff',
              border: '1px solid #86efac',
              color: '#15803d',
            }}
            title="Open Full Farm Location Picker"
          >
            <MapPin size={14} />
            <span>Farm GPS Profile</span>
          </button>
        </div>

        {/* SECONDARY QUICK SELECTION CHIPS */}
        <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b' }}>⚡ Quick Jump:</span>
          <button
            onClick={() => handleQuickSelect('Rajasthan', 'Jaipur', 'Jagatpura (VGU)')}
            style={{ padding: '4px 10px', borderRadius: '16px', border: '1px solid #cbd5e1', backgroundColor: selectedDistrict === 'Jaipur' ? '#e0f2fe' : '#f8fafc', color: '#0f172a', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Jaipur, RJ
          </button>
          <button
            onClick={() => handleQuickSelect('Madhya Pradesh', 'Indore', 'Choithram APMC')}
            style={{ padding: '4px 10px', borderRadius: '16px', border: '1px solid #cbd5e1', backgroundColor: selectedDistrict === 'Indore' ? '#e0f2fe' : '#f8fafc', color: '#0f172a', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Indore, MP
          </button>
          <button
            onClick={() => handleQuickSelect('Uttar Pradesh', 'Lucknow', 'Dubagga Mandi')}
            style={{ padding: '4px 10px', borderRadius: '16px', border: '1px solid #cbd5e1', backgroundColor: selectedDistrict === 'Lucknow' ? '#e0f2fe' : '#f8fafc', color: '#0f172a', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Lucknow, UP
          </button>
          <button
            onClick={() => handleQuickSelect('Haryana', 'Karnal', 'Karnal APMC')}
            style={{ padding: '4px 10px', borderRadius: '16px', border: '1px solid #cbd5e1', backgroundColor: selectedDistrict === 'Karnal' ? '#e0f2fe' : '#f8fafc', color: '#0f172a', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Karnal, HR
          </button>
          <button
            onClick={() => handleQuickSelect('Punjab', 'Ludhiana', 'Khanna APMC')}
            style={{ padding: '4px 10px', borderRadius: '16px', border: '1px solid #cbd5e1', backgroundColor: selectedDistrict === 'Ludhiana' ? '#e0f2fe' : '#f8fafc', color: '#0f172a', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Ludhiana, PB
          </button>
          <button
            onClick={() => handleQuickSelect('Maharashtra', 'Pune', 'Baramati Agro Hub')}
            style={{ padding: '4px 10px', borderRadius: '16px', border: '1px solid #cbd5e1', backgroundColor: selectedDistrict === 'Pune' ? '#e0f2fe' : '#f8fafc', color: '#0f172a', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Pune, MH
          </button>
          <button
            onClick={() => handleQuickSelect('Gujarat', 'Rajkot', 'Gondal APMC')}
            style={{ padding: '4px 10px', borderRadius: '16px', border: '1px solid #cbd5e1', backgroundColor: selectedDistrict === 'Rajkot' ? '#e0f2fe' : '#f8fafc', color: '#0f172a', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
          >
            Rajkot, GJ
          </button>
        </div>
      </div>

      {/* 3. ERROR / UNAVAILABLE STATE BANNER */}
      {isUnavailable ? (
        <div
          className="card"
          style={{
            padding: '36px 24px',
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '20px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'inline-flex', padding: '14px', backgroundColor: '#fef3c7', borderRadius: '50%', marginBottom: '14px' }}>
            <AlertTriangle size={32} color="#b45309" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#92400e', marginBottom: '8px' }}>
            Weather data temporarily unavailable
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#78350f', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
            The Open-Meteo meteorological feed is temporarily unreachable for {selectedLocationName}, {selectedDistrict}. No simulated or fake data is displayed.
          </p>
          <button
            onClick={() =>
              fetchWeather({
                lat: currentDistrictObj.lat,
                lon: currentDistrictObj.lon,
                district: selectedDistrict,
                state: selectedState,
                locationName: selectedLocationName,
              })
            }
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 22px', fontSize: '0.9rem', fontWeight: '800' }}
          >
            <RefreshCw size={16} />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : (
        <>
          {/* 4. CURRENT FORECAST DATA MAIN CARD */}
          <div
            className="card"
            style={{
              padding: '36px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 10px 30px rgba(2,132,199,0.25)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {loading && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: 'rgba(3, 105, 161, 0.85)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  zIndex: 10,
                }}
              >
                <RefreshCw size={22} className="spin-icon" />
                <span style={{ fontWeight: '800', fontSize: '1.05rem' }}>
                  Fetching Open-Meteo Weather for {selectedLocationName}, {selectedDistrict}...
                </span>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '0.92rem', color: '#bae6fd', fontWeight: '700', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>📍 {selectedLocationName}, {selectedDistrict}, {selectedState}</span>
                  <span>•</span>
                  <span>Weather data by Open-Meteo</span>
                </div>
                <div style={{ fontSize: '3.8rem', fontWeight: '900', lineHeight: 1.1, margin: '8px 0', letterSpacing: '-0.03em' }}>
                  {weatherData.temperature}°C
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f0f9ff' }}>
                  {t('temperature', 'Temperature')}: {weatherData.temperature}°C • {weatherData.condition}
                </div>
                {weatherData.isFallback && (
                  <div style={{ fontSize: '0.75rem', color: '#fef08a', marginTop: '6px', fontWeight: '700' }}>
                    ℹ️ Approximate location coordinates used for weather estimation
                  </div>
                )}
              </div>

              {/* 4-METRIC STATS GRID */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  backdropFilter: 'blur(10px)',
                  padding: '20px 16px',
                  borderRadius: '18px',
                  minWidth: '320px',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Droplets size={22} style={{ marginBottom: '4px', color: '#7dd3fc' }} />
                  <div style={{ fontSize: '0.72rem', color: '#e0f2fe', fontWeight: '600' }}>
                    {t('humidity', 'Humidity')}
                  </div>
                  <div style={{ fontWeight: '900', fontSize: '1.15rem' }}>{weatherData.humidity}%</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Wind size={22} style={{ marginBottom: '4px', color: '#7dd3fc' }} />
                  <div style={{ fontSize: '0.72rem', color: '#e0f2fe', fontWeight: '600' }}>
                    {t('windSpeed', 'Wind Speed')}
                  </div>
                  <div style={{ fontWeight: '900', fontSize: '1.15rem' }}>{weatherData.windSpeed} km/h</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <CloudRain size={22} style={{ marginBottom: '4px', color: '#7dd3fc' }} />
                  <div style={{ fontSize: '0.72rem', color: '#e0f2fe', fontWeight: '600' }}>
                    Rain Probability
                  </div>
                  <div style={{ fontWeight: '900', fontSize: '1.15rem' }}>{weatherData.rainProbability}%</div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Droplets size={22} style={{ marginBottom: '4px', color: '#93c5fd' }} />
                  <div style={{ fontSize: '0.72rem', color: '#e0f2fe', fontWeight: '600' }}>
                    Expected Rain
                  </div>
                  <div style={{ fontWeight: '900', fontSize: '1.15rem' }}>{expectedRainMm} mm</div>
                </div>
              </div>
            </div>

            {/* SPRAY WINDOW & DISEASE RISK SUMMARY BAR */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '16px',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Clock size={20} color="#38bdf8" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#bae6fd', fontWeight: '700', textTransform: 'uppercase' }}>
                    {t('sprayWindow', 'Spray Window Status')}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>
                    {weatherData.rainProbability < 30 && weatherData.windSpeed < 15
                      ? 'Optimal Spray Window • Calm morning wind'
                      : 'Sub-optimal • Monitor wind & precipitation'}
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <ShieldAlert size={20} color="#fde047" />
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#bae6fd', fontWeight: '700', textTransform: 'uppercase' }}>
                    {t('diseaseRisk', 'Disease & Microclimate Risk')}
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#fef08a' }}>
                    {weatherData.humidity > 70
                      ? 'ELEVATED FUNGAL RISK — High Relative Humidity'
                      : 'LOW / MODERATE RISK — Normal Field Microclimate'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. AGRICULTURAL ADVISORIES */}
          {weatherData.alerts && weatherData.alerts.length > 0 && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
                {t('agriAdvisories', 'Agricultural Weather Advisories (Derived from Forecast)')}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {weatherData.alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      padding: '18px 22px',
                      borderLeft: alert.severity === 'critical' ? '5px solid #dc2626' : alert.severity === 'warning' ? '5px solid #d97706' : '5px solid #0284c7',
                      backgroundColor: alert.severity === 'critical' ? '#fef2f2' : alert.severity === 'warning' ? '#fffbeb' : '#f0f9ff',
                      borderRadius: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <AlertTriangle size={20} color={alert.severity === 'critical' ? '#dc2626' : alert.severity === 'warning' ? '#d97706' : '#0284c7'} />
                      <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>{alert.title}</h4>
                    </div>
                    <p style={{ fontSize: '0.9rem', color: '#334155', margin: '0 0 10px 0', fontWeight: '500' }}>
                      {alert.description}
                    </p>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: alert.severity === 'critical' ? '#991b1b' : alert.severity === 'warning' ? '#b45309' : '#0369a1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>{t('actionableStep', 'Actionable Step')}: {alert.actionableStep || 'Verify field moisture before foliar spray'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. 7-DAY FORECAST */}
          {weatherData.forecast && weatherData.forecast.length > 0 && (
            <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} color="#0284c7" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                    {t('sevenDayForecast', '7-Day Agronomic Forecast')}
                  </h3>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#0284c7' }}>
                  Weather data by Open-Meteo • Daily Min / Max • Rain Probability • Precipitation
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(115px, 1fr))', gap: '12px' }}>
                {weatherData.forecast.map((f, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '16px 10px',
                      borderRadius: '14px',
                      backgroundColor: i === 0 ? '#e0f2fe' : '#f8fafc',
                      border: i === 0 ? '1px solid #bae6fd' : '1px solid #e2e8f0',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', fontWeight: '800', color: i === 0 ? '#0369a1' : '#475569' }}>
                      {f.day}
                    </span>
                    <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a' }}>{f.tempMax}°</div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Min: {f.tempMin}°</span>

                    <div style={{ fontSize: '0.72rem', fontWeight: '700', color: f.rainChance > 40 ? '#0284c7' : '#059669', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      <span>🌧️ Rain:</span>
                      <span>{f.rainChance}%</span>
                    </div>

                    <div style={{ fontSize: '0.7rem', color: '#0369a1', fontWeight: '700', backgroundColor: 'rgba(2, 132, 199, 0.08)', padding: '2px 6px', borderRadius: '6px' }}>
                      💧 {typeof f.precipitationSum === 'number' ? f.precipitationSum : 0} mm
                    </div>

                    <span style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.2, marginTop: '2px' }}>{f.condition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
