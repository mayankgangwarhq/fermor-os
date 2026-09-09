import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Sprout, Plus, MapPin, Droplets, Layers, Trash2, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Farm } from '../types';

export const FarmsPage: React.FC = () => {
  const { farms, addFarm } = useData();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('5.0');
  const [unit, setUnit] = useState<'acres' | 'bigha' | 'hectares'>('acres');
  const [soilType, setSoilType] = useState<'Alluvial' | 'Black' | 'Red' | 'Laterite' | 'Sandy'>('Black');
  const [irrigation, setIrrigation] = useState<'Canal' | 'Borewell' | 'Drip' | 'Rainfed' | 'Sprinkler'>('Drip');
  const [farmingType, setFarmingType] = useState<'Organic' | 'Conventional' | 'Mixed'>('Organic');
  const [cropsInput, setCropsInput] = useState('Wheat, Mustard');

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location) return;

    addFarm({
      farmerId: 'farmer-101',
      name,
      location,
      area: parseFloat(area) || 1,
      unit,
      soilType,
      irrigation,
      farmingType,
      crops: cropsInput.split(',').map((c) => c.trim()).filter(Boolean),
    });

    setName('');
    setLocation('');
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            {t('myFarmsTitle', 'My Farms & Land Parcels')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
            {t('myFarmsDesc', 'Manage agricultural land parcels, soil profiles, irrigation infrastructure, and plot assignments.')}
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}
        >
          <Plus size={18} />
          <span>{t('addNewFarm', 'Add New Farm')}</span>
        </button>
      </div>

      {/* Farms Grid */}
      {farms.length === 0 ? (
        <div
          className="card"
          style={{
            padding: '48px 24px',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px dashed #cbd5e1',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Sprout size={28} color="#059669" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            {t('noFarmsRegisteredYet', 'No Farms Registered Yet')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 20px auto' }}>
            {t('noFarmsRegisteredDesc', 'Register your agricultural plot, soil profile, and irrigation system to unlock precision telemetry.')}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px' }}
          >
            <Plus size={18} />
            <span>{t('registerNewFarmPlot', 'Register New Farm Plot')}</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="card card-interactive"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                borderRadius: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                      {farm.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#64748b' }}>
                      <MapPin size={14} color="#059669" />
                      <span>{farm.location}</span>
                    </div>
                  </div>
                  <span
                    style={{
                      backgroundColor: '#ecfdf5',
                      color: '#065f46',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      border: '1px solid #a7f3d0',
                    }}
                  >
                    {farm.area} {farm.unit}
                  </span>
                </div>

                {/* Attributes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '16px 0', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Soil Type</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>{farm.soilType}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Irrigation</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>{farm.irrigation}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Practice</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155' }}>{farm.farmingType}</div>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Status</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={14} /> Active
                    </div>
                  </div>
                </div>

                {/* Crops */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                    Assigned Crops:
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                    {farm.crops && farm.crops.length > 0 ? (
                      farm.crops.map((c, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            color: '#334155',
                            padding: '3px 9px',
                            borderRadius: '6px',
                          }}
                        >
                          🌾 {c}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No crops assigned</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-outline"
                onClick={() => navigate(`/farms/${farm.id}`)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '9px',
                  fontSize: '0.88rem',
                  borderRadius: '8px',
                }}
              >
                <span>View Farm Intelligence</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Farm Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sprout size={20} color="#059669" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {t('registerNewFarmPlot', 'Register New Farm Plot')}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateFarm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Farm Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kisan Greenfield Sector A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Location / Village *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sanwer Block, Indore, MP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Total Area *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Unit
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                  >
                    <option value="acres">Acres</option>
                    <option value="bigha">Bigha</option>
                    <option value="hectares">Hectares</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Soil Type
                  </label>
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                  >
                    <option value="Black">Black Soil (काली मिट्टी)</option>
                    <option value="Alluvial">Alluvial (जलोढ़ मिट्टी)</option>
                    <option value="Red">Red Soil (लाल मिट्टी)</option>
                    <option value="Laterite">Laterite Soil</option>
                    <option value="Sandy">Sandy Loam (बलुई दोमट)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Irrigation System
                  </label>
                  <select
                    value={irrigation}
                    onChange={(e) => setIrrigation(e.target.value as any)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                  >
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Borewell">Borewell</option>
                    <option value="Canal">Canal</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Rainfed">Rainfed</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Crops (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wheat (Sharbati), Mustard, Soybean"
                  value={cropsInput}
                  onChange={(e) => setCropsInput(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ padding: '9px 20px', borderRadius: '8px', fontWeight: 700 }}
                >
                  Save Farm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
