import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DataBadge } from '../components/common/DataBadge';
import { PublicCtaSection } from '../components/common/PublicCtaSection';
import { mandiApi } from '../services/api';
import type { MandiPrice, MandiFilterOptions } from '../types';
import {
  Search,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Calendar,
  Layers,
  Building2,
  Tag,
  Info,
  ShieldCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const MandiPage: React.FC = () => {
  const { mandiPrices: fallbackMandiPrices } = useData();
  const { t } = useLanguage();

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedMarket, setSelectedMarket] = useState('All');
  const [selectedCommodity, setSelectedCommodity] = useState('All');
  const [selectedVariety, setSelectedVariety] = useState('All');
  const [selectedGrade, setSelectedGrade] = useState('All');

  // API response state
  const [prices, setPrices] = useState<MandiPrice[]>(fallbackMandiPrices);
  const [filterOptions, setFilterOptions] = useState<MandiFilterOptions | null>(null);
  const [providerName, setProviderName] = useState('DATA_GOV_IN');
  const [govApiConnected, setGovApiConnected] = useState(true);
  const [disclaimer, setDisclaimer] = useState('Official daily government mandi market data (Agmarknet via Data.gov.in)');
  const [loading, setLoading] = useState(false);

  // Fetch dynamic filter options once on mount
  useEffect(() => {
    const loadFilterOptions = async () => {
      const opts = await mandiApi.getFilterOptions();
      if (opts) {
        setFilterOptions(opts);
      }
    };
    loadFilterOptions();
  }, []);

  // Fetch filtered prices whenever filters change
  useEffect(() => {
    let isCancelled = false;
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const res = await mandiApi.getPrices({
          state: selectedState,
          district: selectedDistrict,
          market: selectedMarket,
          commodity: selectedCommodity,
          variety: selectedVariety,
          grade: selectedGrade,
          search: searchTerm,
          limit: 60,
        });

        if (!isCancelled) {
          if (res.records && res.records.length > 0) {
            setPrices(res.records);
          } else if (
            selectedState === 'All' &&
            selectedDistrict === 'All' &&
            selectedMarket === 'All' &&
            selectedCommodity === 'All' &&
            selectedVariety === 'All' &&
            selectedGrade === 'All' &&
            !searchTerm
          ) {
            setPrices(res.records.length > 0 ? res.records : fallbackMandiPrices);
          } else {
            setPrices([]);
          }
          setProviderName(res.provider || 'DATA_GOV_IN');
          setGovApiConnected(res.governmentApiConnected || false);
          setDisclaimer(res.disclaimer || 'Official daily government mandi market data (Agmarknet via Data.gov.in)');
        }
      } catch {
        if (!isCancelled) {
          // Client-side fallback filter
          let filtered = [...fallbackMandiPrices];
          if (selectedState !== 'All') {
            filtered = filtered.filter((p) => p.state.toLowerCase() === selectedState.toLowerCase());
          }
          if (selectedDistrict !== 'All') {
            filtered = filtered.filter((p) => p.district.toLowerCase() === selectedDistrict.toLowerCase());
          }
          if (selectedMarket !== 'All') {
            filtered = filtered.filter((p) => (p.market || p.mandi).toLowerCase() === selectedMarket.toLowerCase());
          }
          if (selectedCommodity !== 'All') {
            filtered = filtered.filter((p) => p.commodity.toLowerCase() === selectedCommodity.toLowerCase());
          }
          if (selectedVariety !== 'All') {
            filtered = filtered.filter((p) => p.variety.toLowerCase() === selectedVariety.toLowerCase());
          }
          if (selectedGrade !== 'All') {
            filtered = filtered.filter((p) => (p.grade || 'FAQ').toLowerCase() === selectedGrade.toLowerCase());
          }
          if (searchTerm.trim()) {
            const q = searchTerm.toLowerCase();
            filtered = filtered.filter(
              (p) =>
                p.commodity.toLowerCase().includes(q) ||
                (p.market || p.mandi).toLowerCase().includes(q) ||
                p.district.toLowerCase().includes(q) ||
                p.variety.toLowerCase().includes(q) ||
                p.state.toLowerCase().includes(q)
            );
          }
          setPrices(filtered);
          setGovApiConnected(false);
          setDisclaimer('Demo Data — Government API not connected');
        }
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchPrices();
    return () => {
      isCancelled = true;
    };
  }, [
    selectedState,
    selectedDistrict,
    selectedMarket,
    selectedCommodity,
    selectedVariety,
    selectedGrade,
    searchTerm,
    fallbackMandiPrices,
  ]);

  // Comprehensive state list including all major agricultural states
  const availableStates = useMemo(() => {
    const defaultStates = [
      'Andhra Pradesh',
      'Assam',
      'Bihar',
      'Chhattisgarh',
      'Gujarat',
      'Haryana',
      'Himachal Pradesh',
      'Karnataka',
      'Keralam',
      'Kerala',
      'Madhya Pradesh',
      'Maharashtra',
      'Odisha',
      'Punjab',
      'Rajasthan',
      'Tamil Nadu',
      'Telangana',
      'Uttar Pradesh',
      'Uttarakhand',
      'West Bengal',
    ];
    if (filterOptions?.states && filterOptions.states.length > 0) {
      return Array.from(new Set([...defaultStates, ...filterOptions.states])).sort();
    }
    return defaultStates.sort();
  }, [filterOptions]);

  const availableDistricts = useMemo(() => {
    if (selectedState !== 'All' && filterOptions?.districts?.[selectedState]) {
      return filterOptions.districts[selectedState];
    }
    const source = selectedState === 'All' ? prices : prices.filter((p) => p.state.toLowerCase() === selectedState.toLowerCase());
    return Array.from(new Set(source.map((p) => p.district))).filter(Boolean).sort();
  }, [selectedState, filterOptions, prices]);

  const availableMarkets = useMemo(() => {
    if (selectedDistrict !== 'All' && filterOptions?.markets?.[selectedDistrict]) {
      return filterOptions.markets[selectedDistrict];
    }
    const source = selectedDistrict === 'All'
      ? selectedState === 'All'
        ? prices
        : prices.filter((p) => p.state.toLowerCase() === selectedState.toLowerCase())
      : prices.filter((p) => p.district.toLowerCase() === selectedDistrict.toLowerCase());
    return Array.from(new Set(source.map((p) => p.market || p.mandi))).filter(Boolean).sort();
  }, [selectedDistrict, selectedState, filterOptions, prices]);

  const availableCommodities = useMemo(() => {
    const defaultCommodities = [
      'Wheat',
      'Paddy',
      'Mustard',
      'Soybean',
      'Cotton',
      'Tomato',
      'Potato',
      'Onion',
      'Gram',
      'Maize',
      'Bitter gourd',
      'Cabbage',
      'Banana - Green',
      'Apple',
      'Brinjal',
      'Cauliflower',
      'Garlic',
      'Ginger',
      'Turmeric',
    ];
    if (filterOptions?.commodities && filterOptions.commodities.length > 0) {
      return Array.from(new Set([...defaultCommodities, ...filterOptions.commodities])).sort();
    }
    return defaultCommodities.sort();
  }, [filterOptions]);

  const availableVarieties = useMemo(() => {
    if (selectedCommodity !== 'All' && filterOptions?.varieties?.[selectedCommodity]) {
      return filterOptions.varieties[selectedCommodity];
    }
    const source = selectedCommodity === 'All' ? prices : prices.filter((p) => p.commodity.toLowerCase() === selectedCommodity.toLowerCase());
    return Array.from(new Set(source.map((p) => p.variety))).filter(Boolean).sort();
  }, [selectedCommodity, filterOptions, prices]);

  const availableGrades = useMemo(() => {
    return ['FAQ', 'Grade A', 'Medium', 'Super', 'Other'];
  }, []);

  const isFilterActive =
    selectedState !== 'All' ||
    selectedDistrict !== 'All' ||
    selectedMarket !== 'All' ||
    selectedCommodity !== 'All' ||
    selectedVariety !== 'All' ||
    selectedGrade !== 'All' ||
    searchTerm.trim().length > 0;

  const resetAllFilters = () => {
    setSelectedState('All');
    setSelectedDistrict('All');
    setSelectedMarket('All');
    setSelectedCommodity('All');
    setSelectedVariety('All');
    setSelectedGrade('All');
    setSearchTerm('');
  };

  const chartData = [
    { date: 'Aug 12', wheat: 2480, mustard: 6050, paddy: 4520 },
    { date: 'Aug 13', wheat: 2500, mustard: 6100, paddy: 4550 },
    { date: 'Aug 14', wheat: 2510, mustard: 6120, paddy: 4580 },
    { date: 'Aug 15', wheat: 2525, mustard: 6180, paddy: 4600 },
    { date: 'Aug 16', wheat: 2530, mustard: 6140, paddy: 4600 },
    { date: 'Aug 17', wheat: 2535, mustard: 6150, paddy: 4610 },
    { date: 'Latest', wheat: 2550, mustard: 6150, paddy: 4600 },
  ];

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Official Government Data Connection Status Banner */}
      {govApiConnected ? (
        <div
          style={{
            backgroundColor: '#ecfdf5',
            border: '1.5px solid #a7f3d0',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ padding: '6px', backgroundColor: '#d1fae5', borderRadius: '8px', color: '#059669', flexShrink: 0 }}>
            <ShieldCheck size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '900',
                  color: '#065f46',
                  letterSpacing: '0.02em',
                }}
              >
                Official Government Data — Data.gov.in
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  backgroundColor: '#d1fae5',
                  color: '#047857',
                  border: '1px solid #6ee7b7',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                }}
              >
                Provider: {providerName}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                Govt API: CONNECTED
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#047857', margin: 0, lineHeight: 1.45 }}>
              Displaying official daily government mandi arrival prices sourced directly from <strong>Data.gov.in (Agmarknet)</strong> via the backend REST service.
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div style={{ padding: '6px', backgroundColor: '#fef3c7', borderRadius: '8px', color: '#b45309', flexShrink: 0 }}>
            <AlertTriangle size={22} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '0.95rem',
                  fontWeight: '900',
                  color: '#92400e',
                  letterSpacing: '0.02em',
                }}
              >
                Demo Data — Government API not connected
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  border: '1px solid #fcd34d',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                }}
              >
                Provider: {providerName}
              </span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: '800',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  padding: '2px 8px',
                  borderRadius: '6px',
                }}
              >
                Govt API: NOT CONNECTED
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#78350f', margin: 0, lineHeight: 1.45 }}>
              AGRINEXT is currently using fallback sample data. Configure <code style={{ backgroundColor: '#fef3c7', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>DATA_GOV_API_KEY</code> in <code style={{ backgroundColor: '#fef3c7', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>backend/.env</code> to connect live government mandi prices.
            </p>
          </div>
        </div>
      )}

      {/* 2. Title Header */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase' }}>
            AGRINEXT • {t('navMandi', 'MANDI MARKET INTELLIGENCE')}
          </span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '4px' }}>
            {t('mandiTitle', 'Mandi Prices & Trends')}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '4px', margin: 0 }}>
            {disclaimer}
          </p>
        </div>
        <DataBadge status={govApiConnected ? 'LIVE DATA' : 'DEMO DATA'} lastUpdated={govApiConnected ? 'Daily Government Data' : 'Sample Dataset'} />
      </div>

      {/* 3. Recharts Price Trend Visualization */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--slate-900)' }}>
              Benchmark Modal Price Trends (₹ / Quintal)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              Historical benchmark trends: Wheat (Lucknow/Sidhi Mandi) vs Mustard (Jaipur Mandi)
            </p>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--primary-600)' }}>● Wheat</span>
            <span style={{ color: '#d97706' }}>● Mustard</span>
          </div>
        </div>

        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMustard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="wheat" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorWheat)" />
              <Area type="monotone" dataKey="mustard" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#colorMustard)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Interactive 6-Dimension Filter Control Center */}
      <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={18} color="var(--primary-600)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--slate-900)', margin: 0 }}>
              Mandi Filter Parameters ({govApiConnected ? 'Data.gov.in Live Query' : 'Local Filters'})
            </h3>
          </div>
          {isFilterActive && (
            <button
              onClick={resetAllFilters}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.8rem',
                fontWeight: '700',
                color: '#dc2626',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={14} />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
          <input
            type="text"
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search commodity (e.g. Wheat, Mustard, Tomato), Mandi, District, or State..."
            style={{ paddingLeft: '40px', width: '100%' }}
          />
        </div>

        {/* 6 Dimension Filters Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
          }}
        >
          {/* 1. State Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--slate-600)', marginBottom: '4px' }}>
              1. State
            </label>
            <select
              className="form-select"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('All');
                setSelectedMarket('All');
              }}
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <option value="All">All States</option>
              {availableStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* 2. District Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--slate-600)', marginBottom: '4px' }}>
              2. District
            </label>
            <select
              className="form-select"
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                setSelectedMarket('All');
              }}
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <option value="All">All Districts</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* 3. Market / Mandi Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--slate-600)', marginBottom: '4px' }}>
              3. Market / Mandi
            </label>
            <select
              className="form-select"
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <option value="All">All Markets</option>
              {availableMarkets.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* 4. Commodity Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--slate-600)', marginBottom: '4px' }}>
              4. Commodity
            </label>
            <select
              className="form-select"
              value={selectedCommodity}
              onChange={(e) => {
                setSelectedCommodity(e.target.value);
                setSelectedVariety('All');
              }}
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <option value="All">All Commodities</option>
              {availableCommodities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* 5. Variety Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--slate-600)', marginBottom: '4px' }}>
              5. Variety
            </label>
            <select
              className="form-select"
              value={selectedVariety}
              onChange={(e) => setSelectedVariety(e.target.value)}
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <option value="All">All Varieties</option>
              {availableVarieties.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* 6. Grade Filter */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: '700', color: 'var(--slate-600)', marginBottom: '4px' }}>
              6. Grade
            </label>
            <select
              className="form-select"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              style={{ width: '100%', fontSize: '0.85rem' }}
            >
              <option value="All">All Grades</option>
              {availableGrades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary Bar */}
        <div
          style={{
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid var(--slate-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--slate-500)',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <span>
            Showing <strong style={{ color: 'var(--slate-900)' }}>{prices.length}</strong> {govApiConnected ? 'official daily government mandi records' : 'sample benchmark records'} {isFilterActive && '(Filtered)'}
          </span>
          <span style={{ fontSize: '0.75rem', color: govApiConnected ? '#059669' : '#d97706', fontWeight: '700' }}>
            ● {govApiConnected ? 'Official Daily Government Mandi Data Active' : 'Sample development dataset active'}
          </span>
        </div>
      </div>

      {/* 5. Mandi Price Cards Grid — Displaying all official government fields */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-500)' }}>
          <p>Querying official mandi rates from backend API...</p>
        </div>
      ) : prices.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'inline-flex', padding: '12px', backgroundColor: 'var(--slate-100)', borderRadius: '50%', marginBottom: '12px' }}>
            <Info size={24} color="var(--slate-500)" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '6px' }}>
            No Mandi Records Found
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', maxWidth: '420px', margin: '0 auto 16px auto' }}>
            No government mandi arrival records matched your selected combination of State, District, Market, Commodity, Variety, and Grade.
          </p>
          <button
            onClick={resetAllFilters}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem', padding: '8px 18px' }}
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {prices.map((item) => (
            <div
              key={item.id}
              className="card"
              style={{
                padding: '20px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--slate-100)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header: Commodity Tag + Trend + Source Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: '800',
                        color: 'var(--primary-800)',
                        backgroundColor: 'var(--primary-100)',
                        padding: '3px 9px',
                        borderRadius: '6px',
                      }}
                    >
                      {/* FIELD 1: Commodity */}
                      {item.commodity}
                    </span>
                    {item.grade && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: '800',
                          color: '#b45309',
                          backgroundColor: '#fef3c7',
                          padding: '3px 7px',
                          borderRadius: '6px',
                        }}
                      >
                        Grade: {item.grade}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.8rem',
                      fontWeight: '800',
                      color:
                        item.trend === 'up'
                          ? '#16a34a'
                          : item.trend === 'down'
                          ? '#dc2626'
                          : 'var(--slate-600)',
                    }}
                  >
                    {item.trend === 'up' && <ArrowUpRight size={16} />}
                    {item.trend === 'down' && <ArrowDownRight size={16} />}
                    {item.trend === 'stable' && <Minus size={16} />}
                    <span>
                      {(item.changePercent ?? item.priceChangePercent ?? 0) > 0
                        ? `+${item.changePercent ?? item.priceChangePercent}%`
                        : `${item.changePercent ?? item.priceChangePercent ?? 0}%`}
                    </span>
                  </div>
                </div>

                {/* FIELD 1 & FIELD 2: Commodity & Variety */}
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: '800',
                    color: 'var(--slate-900)',
                    marginBottom: '4px',
                  }}
                >
                  {item.commodity} <span style={{ fontWeight: 600, color: 'var(--slate-600)', fontSize: '1rem' }}>({item.variety})</span>
                </h3>

                {/* FIELD 3, 4, 5: Market, District, State */}
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--slate-600)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '6px',
                  }}
                >
                  <MapPin size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--slate-400)' }} />
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{item.market || item.mandi}</span>
                    <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                      District: {item.district} • State: {item.state}
                    </div>
                  </div>
                </div>

                {/* FIELD 6, 7, 8: Min Price, Modal Price, Max Price */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr 1fr',
                    gap: '6px',
                    padding: '12px',
                    backgroundColor: 'var(--slate-50)',
                    borderRadius: '10px',
                    textAlign: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: '700' }}>
                      Min Price
                    </span>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                      ₹{item.minPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div style={{ borderLeft: '1px solid var(--slate-200)', borderRight: '1px solid var(--slate-200)' }}>
                    <span style={{ fontSize: '0.68rem', color: 'var(--primary-700)', fontWeight: '800', textTransform: 'uppercase' }}>
                      Modal Price
                    </span>
                    <div style={{ fontWeight: '900', fontSize: '1.1rem', color: 'var(--primary-800)' }}>
                      ₹{item.modalPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--slate-500)', textTransform: 'uppercase', fontWeight: '700' }}>
                      Max Price
                    </span>
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--slate-700)' }}>
                      ₹{item.maxPrice.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              </div>

              {/* FIELD 9: Arrival Date & Unit & Official Notice */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: 'var(--slate-500)',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--slate-100)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    <span>Arrival Date: {item.date}</span>
                  </div>
                  <span>Unit: {item.unit || item.priceUnit || '₹/quintal'}</span>
                </div>

                <div
                  style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.7rem',
                    color: govApiConnected ? '#065f46' : '#92400e',
                    backgroundColor: govApiConnected ? '#ecfdf5' : '#fffbeb',
                    padding: '4px 8px',
                    borderRadius: '6px',
                  }}
                >
                  <span style={{ fontWeight: '700' }}>
                    {govApiConnected ? 'OFFICIAL GOVT RECORD' : 'SAMPLE RECORD'}
                  </span>
                  <DataBadge status={govApiConnected ? 'LIVE DATA' : 'DEMO DATA'} size="sm" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 6. Public CTA Banner */}
      <PublicCtaSection />
    </div>
  );
};
