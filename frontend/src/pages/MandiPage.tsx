import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DataBadge } from '../components/common/DataBadge';
import { PublicCtaSection } from '../components/common/PublicCtaSection';
import { TrendingUp, Search, Filter, MapPin, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const MandiPage: React.FC = () => {
  const { mandiPrices } = useData();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  const filteredPrices = mandiPrices.filter(m => {
    const matchesSearch = m.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.mandi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === 'All' || m.state === selectedState;
    return matchesSearch && matchesState;
  });

  const chartData = [
    { date: 'Aug 12', wheat: 2480, mustard: 6050, paddy: 4520 },
    { date: 'Aug 13', wheat: 2500, mustard: 6100, paddy: 4550 },
    { date: 'Aug 14', wheat: 2510, mustard: 6120, paddy: 4580 },
    { date: 'Aug 15', wheat: 2525, mustard: 6180, paddy: 4600 },
    { date: 'Aug 16', wheat: 2530, mustard: 6140, paddy: 4600 },
    { date: 'Aug 17', wheat: 2535, mustard: 6150, paddy: 4610 },
    { date: 'Today', wheat: 2540, mustard: 6150, paddy: 4600 }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#16a34a', textTransform: 'uppercase' }}>
            AGRINEXT • {t('navMandi', 'MANDI MARKET INTELLIGENCE')}
          </span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)' }}>
            {t('mandiTitle', 'Mandi Prices & Trends')}
          </h1>
        </div>
        <DataBadge status="DEMO DATA" lastUpdated="Updated Today 08:30 AM" />
      </div>

      {/* Recharts Price Trend Visualization */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--slate-900)' }}>7-Day Modal Price Trends (₹ / Quintal)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>Wheat (Lucknow Mandi) vs Mustard (Jaipur Mandi)</p>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', fontWeight: '700' }}>
            <span style={{ color: 'var(--primary-600)' }}>● Wheat</span>
            <span style={{ color: '#d97706' }}>● Mustard</span>
          </div>
        </div>

        <div style={{ width: '100%', height: '240px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWheat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMustard" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
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

      {/* Search & State Filter Controls */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
          <input
            type="text"
            className="form-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search commodity (e.g. Wheat, Mustard, Tomato) or Mandi..."
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <div style={{ width: '200px' }}>
          <select className="form-select" value={selectedState} onChange={e => setSelectedState(e.target.value)}>
            <option value="All">All States</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Punjab">Punjab</option>
          </select>
        </div>
      </div>

      {/* Mandi Price Table Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {filteredPrices.map(item => (
          <div key={item.id} className="card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary-800)', backgroundColor: 'var(--primary-100)', padding: '2px 8px', borderRadius: '6px' }}>
                {item.commodity}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '800', color: item.trend === 'up' ? '#16a34a' : item.trend === 'down' ? '#dc2626' : 'var(--slate-600)' }}>
                {item.trend === 'up' && <ArrowUpRight size={16} />}
                {item.trend === 'down' && <ArrowDownRight size={16} />}
                {item.trend === 'stable' && <Minus size={16} />}
                <span>{item.changePercent > 0 ? `+${item.changePercent}%` : `${item.changePercent}%`}</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '4px' }}>
              {item.commodity} ({item.variety})
            </h3>

            <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} />
              <span>{item.mandi}, {item.district} ({item.state})</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', padding: '12px', backgroundColor: 'var(--slate-50)', borderRadius: '10px', textAlign: 'center' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Min Price</span>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>₹{item.minPrice}</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--slate-200)', borderRight: '1px solid var(--slate-200)' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--primary-700)', fontWeight: '700' }}>Modal Price</span>
                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--primary-800)' }}>₹{item.modalPrice}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>Max Price</span>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>₹{item.maxPrice}</div>
              </div>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              <span>Unit: {item.unit}</span>
              <DataBadge status={item.sourceStatus} size="sm" />
            </div>
          </div>
        ))}
      </div>

      {/* Public CTA Banner */}
      <PublicCtaSection />
    </div>
  );
};
