import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Wheat, Plus, Calendar, TrendingUp, CheckCircle, Clock, MapPin, Tag } from 'lucide-react';
import type { CropCycle, CropStatus } from '../types';

export const CropsPage: React.FC = () => {
  const { cropCycles, addCropCycle, updateCropStatus, farms } = useData();
  const { language, t } = useLanguage();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id || '');
  const [cropName, setCropName] = useState('');
  const [variety, setVariety] = useState('');
  const [sowingDate, setSowingDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [estimatedYieldKg, setEstimatedYieldKg] = useState('3500');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredCrops = filterStatus === 'all'
    ? cropCycles
    : cropCycles.filter((c) => c.status === filterStatus);

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !variety) return;

    const farmObj = farms.find((f) => f.id === selectedFarmId) || farms[0];
    addCropCycle({
      farmId: farmObj?.id || 'farm-1',
      farmName: farmObj?.name || 'Primary Farm',
      cropName,
      variety,
      status: 'growing',
      sowingDate,
      expectedHarvestDate: expectedHarvestDate || new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      estimatedYieldKg: parseFloat(estimatedYieldKg) || 0,
    });

    setCropName('');
    setVariety('');
    setShowAddModal(false);
  };

  const getStatusBadgeColor = (status: CropStatus) => {
    switch (status) {
      case 'growing':
        return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
      case 'harvest_ready':
        return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      case 'harvested':
        return { bg: '#e0e7ff', text: '#4338ca', border: '#c7d2fe' };
      case 'sold':
        return { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            {t('cropLifecycleTitle', 'Crop Lifecycle Management')}
          </h1>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
            {t('cropLifecycleDesc', 'Track crop varieties, sowing timelines, growth milestones, expected yields, and harvest schedules.')}
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setShowAddModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '10px' }}
        >
          <Plus size={18} />
          <span>{t('addNewCropCycle', 'Add New Crop Cycle')}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['all', 'growing', 'harvest_ready', 'harvested', 'sold', 'planned'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: filterStatus === st ? '#059669' : '#ffffff',
              color: filterStatus === st ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              textTransform: 'capitalize',
            }}
          >
            {st === 'all' ? 'All Crops' : st.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Crops Cards List */}
      {filteredCrops.length === 0 ? (
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
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}
          >
            <Wheat size={28} color="#d97706" />
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
            {t('noCropCyclesFound', 'No Crop Cycles Found')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', maxWidth: '420px', margin: '0 auto 20px auto' }}>
            {t('noCropCyclesDesc', 'There are no crop cycles matching this filter status. Log your current active sowing cycle.')}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px' }}
          >
            <Plus size={18} />
            <span>{t('logNewCropCycle', 'Log New Crop Cycle')}</span>
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {filteredCrops.map((crop) => {
            const badge = getStatusBadgeColor(crop.status);
            const farmName = crop.farmName || farms.find((f) => f.id === crop.farmId)?.name || 'Central Farm';

            return (
              <div
                key={crop.id}
                className="card card-interactive"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRadius: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wheat size={22} color="#d97706" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{crop.cropName}</h3>
                        <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{crop.variety}</span>
                      </div>
                    </div>

                    <span
                      style={{
                        backgroundColor: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {crop.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#059669', fontWeight: 600, marginBottom: '14px' }}>
                    <MapPin size={14} />
                    <span>{farmName}</span>
                  </div>

                  {/* Milestones / Dates */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Sowing Date</span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Calendar size={13} color="#059669" /> {crop.sowingDate}
                      </div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Target Harvest</span>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Clock size={13} color="#d97706" /> {crop.expectedHarvestDate}
                      </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Yield Projection</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <TrendingUp size={15} /> {crop.estimatedYieldKg ? `${crop.estimatedYieldKg} kg` : '3,800 kg estimated'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Action Toolbar */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                    Update Crop Status:
                  </label>
                  <select
                    value={crop.status}
                    onChange={(e) => updateCropStatus(crop.id, e.target.value as CropStatus)}
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', backgroundColor: '#ffffff', fontWeight: 600 }}
                  >
                    <option value="planned">Planned (योजना बनाई)</option>
                    <option value="sown">Sown (बुवाई पूर्ण)</option>
                    <option value="growing">Growing / Vegetative (विकास अवस्था)</option>
                    <option value="harvest_ready">Harvest Ready (कटाई योग्य)</option>
                    <option value="harvested">Harvested (कटाई पूर्ण)</option>
                    <option value="sold">Sold (बाज़ार में बिक्री)</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Crop Modal */}
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
              maxWidth: '500px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wheat size={20} color="#d97706" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {t('logNewCropCycle', 'Log New Crop Cycle')}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ border: 'none', background: 'transparent', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCrop} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Assign to Farm Plot *
                </label>
                <select
                  value={selectedFarmId}
                  onChange={(e) => setSelectedFarmId(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', backgroundColor: '#fff' }}
                >
                  {farms.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.area} {f.unit} - {f.location})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Crop Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wheat, Soybean, Mustard, Cotton"
                  value={cropName}
                  onChange={(e) => setCropName(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Seed Variety *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sharbati C-306, Pusa Bold, JS-335"
                  value={variety}
                  onChange={(e) => setVariety(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Sowing Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Harvest Date
                  </label>
                  <input
                    type="date"
                    value={expectedHarvestDate}
                    onChange={(e) => setExpectedHarvestDate(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Target Yield (Kg)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 4200"
                  value={estimatedYieldKg}
                  onChange={(e) => setEstimatedYieldKg(e.target.value)}
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
                  Save Crop Cycle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
