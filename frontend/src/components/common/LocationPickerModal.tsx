import React, { useState, useEffect } from 'react';
import { useFarmLocation } from '../../contexts/FarmLocationContext';
import { useLanguage } from '../../contexts/LanguageContext';
import type { FarmLocation } from '../../types';
import {
  MapPin,
  Navigation,
  Search,
  Edit3,
  X,
  Check,
  AlertTriangle,
  RefreshCw,
  Globe,
  CheckCircle2
} from 'lucide-react';

export const LocationPickerModal: React.FC = () => {
  const { language } = useLanguage();
  const {
    location,
    isDetecting,
    error,
    setLocation,
    detectCurrentLocation,
    searchLocations,
    saveManualLocation,
    isPickerOpen,
    closePicker,
    clearError
  } = useFarmLocation();

  const [activeTab, setActiveTab] = useState<'gps' | 'search' | 'manual'>('gps');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FarmLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Manual state
  const [manualVillage, setManualVillage] = useState(location.village || '');
  const [manualDistrict, setManualDistrict] = useState(location.district || '');
  const [manualState, setManualState] = useState(location.state || '');
  const [manualPincode, setManualPincode] = useState(location.pincode || '');

  useEffect(() => {
    if (isPickerOpen) {
      setManualVillage(location.village || '');
      setManualDistrict(location.district || '');
      setManualState(location.state || '');
      setManualPincode(location.pincode || '');
      clearError();
    }
  }, [isPickerOpen, location]);

  // Handle Search Input Change
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const res = await searchLocations(searchQuery);
      setSearchResults(res);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isPickerOpen) return null;

  const handleGpsClick = async () => {
    const success = await detectCurrentLocation();
    if (success) {
      closePicker();
    }
  };

  const handleSelectSearchResult = (selected: FarmLocation) => {
    setLocation(selected);
    closePicker();
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualDistrict || !manualState) return;
    await saveManualLocation(manualVillage, manualDistrict, manualState, manualPincode);
    closePicker();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={closePicker}
    >
      {/* Modal Container */}
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '0',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          border: '1px solid #e2e8f0',
          animation: 'modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          @keyframes modalSlideUp {
            0% { opacity: 0; transform: translateY(20px) scale(0.97); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MapPin size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                Change Farm Location
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '2px 0 0 0', fontWeight: '500' }}>
                Set your exact farm village, district & GPS coordinates.
              </p>
            </div>
          </div>

          <button
            onClick={closePicker}
            style={{
              border: 'none',
              backgroundColor: '#e2e8f0',
              color: '#475569',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* CURRENT ACTIVE LOCATION DISPLAY */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#f0fdf4',
            borderBottom: '1px solid #dcfce7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
            color: '#166534',
            fontWeight: '600'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} color="#10b981" />
            <span>Active: <strong>{location.formattedAddress}</strong></span>
          </div>
          <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', backgroundColor: '#dcfce7', color: '#065f46', padding: '2px 8px', borderRadius: '999px', fontWeight: '800' }}>
            {location.source}
          </span>
        </div>

        {/* ERROR BANNER */}
        {error && (
          <div
            style={{
              padding: '14px 24px',
              backgroundColor: '#fef2f2',
              borderBottom: '1px solid #fee2e2',
              fontSize: '0.82rem',
              color: '#991b1b',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
              <AlertTriangle size={16} color="#dc2626" />
              <span>Location Error</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#7f1d1d' }}>{error}</p>
          </div>
        )}

        {/* TAB SELECTION BAR */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
          <button
            onClick={() => setActiveTab('gps')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.85rem',
              fontWeight: '800',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'gps' ? '#059669' : '#64748b',
              borderBottom: activeTab === 'gps' ? '2.5px solid #059669' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Navigation size={15} />
            <span>GPS Auto</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.85rem',
              fontWeight: '800',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'search' ? '#059669' : '#64748b',
              borderBottom: activeTab === 'search' ? '2.5px solid #059669' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Search size={15} />
            <span>Search Place</span>
          </button>

          <button
            onClick={() => setActiveTab('manual')}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '0.85rem',
              fontWeight: '800',
              border: 'none',
              backgroundColor: 'transparent',
              color: activeTab === 'manual' ? '#059669' : '#64748b',
              borderBottom: activeTab === 'manual' ? '2.5px solid #059669' : 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Edit3 size={15} />
            <span>Manual Form</span>
          </button>
        </div>

        {/* TAB BODY CONTENT */}
        <div style={{ padding: '24px' }}>
          
          {/* OPTION A: GPS AUTO DETECT */}
          {activeTab === 'gps' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 20px rgba(5,150,105,0.15)'
                }}
              >
                <Navigation size={32} />
              </div>

              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                  Detect GPS Farm Coordinates
                </h4>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, maxWidth: '380px' }}>
                  Use your device location to automatically identify your farm's village, district & weather region.
                </p>
              </div>

              <button
                type="button"
                disabled={isDetecting}
                onClick={handleGpsClick}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.98rem',
                  fontWeight: '800',
                  borderRadius: '14px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  border: 'none',
                  boxShadow: '0 6px 18px rgba(5,150,105,0.28)',
                  cursor: isDetecting ? 'wait' : 'pointer'
                }}
              >
                {isDetecting ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    <span>📍 Detecting your location...</span>
                  </>
                ) : (
                  <>
                    <Navigation size={18} />
                    <span>Use My Current Location</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* OPTION B: SEARCH PLACE */}
          {activeTab === 'search' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={18} color="#059669" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search village, city, district or pincode..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.92rem',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                  autoFocus
                />
              </div>

              {isSearching && (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
                  Finding locations...
                </div>
              )}

              {!isSearching && searchResults.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
                  {searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSearchResult(item)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        backgroundColor: '#f8fafc',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'background-color 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MapPin size={16} color="#059669" />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>
                            {item.village || item.city}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '500' }}>
                            {item.formattedAddress}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: '700' }}>Select ➔</span>
                    </div>
                  ))}
                </div>
              )}

              {!isSearching && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
                <div style={{ padding: '16px', textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
                  No matching places found. Try entering location manually in the Manual Form tab.
                </div>
              )}
            </div>
          )}

          {/* OPTION C: MANUAL FORM */}
          {activeTab === 'manual' && (
            <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Village / Sub-Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jagatpura (VGU)"
                  value={manualVillage}
                  onChange={(e) => setManualVillage(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '600' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    District
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur"
                    value={manualDistrict}
                    onChange={(e) => setManualDistrict(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '600' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajasthan"
                    value={manualState}
                    onChange={(e) => setManualState(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '600' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Pincode (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 302017"
                  value={manualPincode}
                  onChange={(e) => setManualPincode(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: '600' }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.92rem',
                  fontWeight: '800',
                  borderRadius: '12px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  marginTop: '8px',
                  border: 'none'
                }}
              >
                Save Farm Location
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
