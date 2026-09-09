import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { weatherApi } from '../services/api';
import { fetchWeatherForLocation } from '../services/weatherService';
import { DataBadge } from '../components/common/DataBadge';
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
  Search,
  RefreshCw,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { useFarmLocation } from '../contexts/FarmLocationContext';

export const WeatherPage: React.FC = () => {
  const { weather: initialWeather } = useData();
  const { location: farmLoc, openPicker } = useFarmLocation();
  const { t, language } = useLanguage();
  const [searchInput, setSearchInput] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData>(initialWeather);
  const [currentDistrict, setCurrentDistrict] = useState<string>('Indore');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await weatherApi.getWeather({
          lat: farmLoc.latitude,
          lon: farmLoc.longitude,
          district: farmLoc.district,
          state: farmLoc.state,
        });
        if (res) {
          setWeatherData(res);
          setCurrentDistrict(res.district || farmLoc.district || 'Indore');
        }
      } catch {
        const fallback = await fetchWeatherForLocation(farmLoc);
        setWeatherData(fallback);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [farmLoc]);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLoading(true);
      try {
        const res = await weatherApi.getWeather({ district: searchInput.trim() });
        if (res) {
          setWeatherData(res);
          setCurrentDistrict(searchInput.trim());
        }
      } catch {
        const fallback = await fetchWeatherForLocation(searchInput.trim());
        setWeatherData(fallback);
      } finally {
        setSearchInput('');
        setLoading(false);
      }
    }
  };

  const handleDistrictChange = async (dist: string) => {
    setCurrentDistrict(dist);
    setLoading(true);
    try {
      const res = await weatherApi.getWeather({ district: dist });
      if (res) setWeatherData(res);
    } catch {
      const fallback = await fetchWeatherForLocation(dist);
      setWeatherData(fallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* PAGE HEADER */}
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
            AGRINEXT • {t('weather', 'WEATHER')}
          </span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#0f172a', margin: '2px 0 0 0' }}>
            {t('liveWeatherTitle', 'Live Weather Intelligence & Advisory')}
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={openPicker}
            style={{
              padding: '6px 14px',
              fontSize: '0.85rem',
              fontWeight: '800',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              border: '1px solid #bae6fd',
            }}
            title="Change Active Farm Location"
          >
            <MapPin size={16} color="#0284c7" />
            <span>📍 {farmLoc.formattedAddress}</span>
          </button>

          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#f1f5f9',
              padding: '4px 10px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
            }}
          >
            <Search size={15} color="#0284c7" />
            <input
              type="text"
              placeholder={t('searchDistrict', 'Search district...')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', fontWeight: '600', width: '130px', color: '#0f172a' }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem', fontWeight: '700', borderRadius: '8px' }}>
              {t('search', 'Search')}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <MapPin size={16} color="#0284c7" />
            <select
              value={currentDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              style={{ border: 'none', background: 'transparent', padding: 0, fontWeight: '800', fontSize: '0.88rem', cursor: 'pointer', color: '#0f172a' }}
            >
              <option value="Indore">Indore, MP</option>
              <option value="Lucknow">Lucknow, UP</option>
              <option value="Karnal">Karnal, HR</option>
              <option value="Ludhiana">Ludhiana, PB</option>
              <option value="Jaipur">Jaipur, RJ</option>
              <option value="Bhopal">Bhopal, MP</option>
              <option value="Nagpur">Nagpur, MH</option>
            </select>
          </div>

          <DataBadge status={weatherData.sourceStatus} lastUpdated={new Date().toLocaleTimeString()} />
        </div>
      </div>

      {/* LIVE WEATHER MAIN CARD */}
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
            <span style={{ fontWeight: '800', fontSize: '1.05rem' }}>Fetching Live Weather for {currentDistrict}...</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#bae6fd', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              📍 {weatherData.district}, {weatherData.state} • AGRINEXT METEOROLOGY ENGINE
            </div>
            <div style={{ fontSize: '3.8rem', fontWeight: '900', lineHeight: 1.1, margin: '8px 0', letterSpacing: '-0.03em' }}>
              {weatherData.temperature}°C
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#f0f9ff' }}>
              {t('temperature', 'Temperature')}: {weatherData.temperature}°C • {weatherData.condition}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.16)',
              backdropFilter: 'blur(10px)',
              padding: '22px',
              borderRadius: '18px',
              minWidth: '290px',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <Droplets size={24} style={{ marginBottom: '4px', color: '#7dd3fc' }} />
              <div style={{ fontSize: '0.75rem', color: '#e0f2fe', fontWeight: '600' }}>
                {t('humidity', 'Humidity')}
              </div>
              <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>{weatherData.humidity}%</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <Wind size={24} style={{ marginBottom: '4px', color: '#7dd3fc' }} />
              <div style={{ fontSize: '0.75rem', color: '#e0f2fe', fontWeight: '600' }}>
                {t('windSpeed', 'Wind Speed')}
              </div>
              <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>{weatherData.windSpeed} km/h</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <CloudRain size={24} style={{ marginBottom: '4px', color: '#7dd3fc' }} />
              <div style={{ fontSize: '0.75rem', color: '#e0f2fe', fontWeight: '600' }}>
                {t('rainfall', 'Rainfall')}
              </div>
              <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>{weatherData.rainProbability}%</div>
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
                {t('sprayWindow', 'Spray Window')}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#ffffff' }}>
                {t('optimalSpray', 'Optimal Spray Window')} • {t('sprayWindowActive', 'Calm morning conditions active until 11:00 AM')}
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
                {t('diseaseRisk', 'Disease Risk')}
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#fef08a' }}>
                {t('moderateRisk', 'MODERATE RISK')} — {t('riskCausality', 'Microclimate Causality Reasoning')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AGRICULTURAL ALERTS & ADVISORIES */}
      <div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px' }}>
          {t('agriAdvisories', 'Agricultural Weather Advisories')}
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

      {/* 7-DAY FORECAST */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Calendar size={20} color="#0284c7" />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            {t('sevenDayForecast', '7-Day Agronomic Forecast')} ({t('forecast', 'Forecast')})
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '12px' }}>
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
                gap: '8px',
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: '800', color: i === 0 ? '#0369a1' : '#475569' }}>
                {f.day}
              </span>
              <div style={{ fontSize: '1.2rem', fontWeight: '900', color: '#0f172a' }}>{f.tempMax}°</div>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{f.tempMin}°</span>
              <span style={{ fontSize: '0.72rem', fontWeight: '700', color: f.rainChance > 40 ? '#0284c7' : '#059669' }}>
                🌧️ {f.rainChance}%
              </span>
              <span style={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.2 }}>{f.condition}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
