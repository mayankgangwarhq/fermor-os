import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingBag, Search, CheckCircle, Clock, TrendingUp, MapPin, Calendar, Send, Filter, ArrowUpRight, DollarSign, Package } from 'lucide-react';
import type { MarketplaceListing } from '../types';

export const BuyerDashboard: React.FC = () => {
  const { purchaseRequests, marketplaceListings, addPurchaseRequest } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'requests' | 'produce' | 'insights'>('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedListingForOffer, setSelectedListingForOffer] = useState<MarketplaceListing | null>(null);

  const [offerForm, setOfferForm] = useState({
    offeredPrice: 6200,
    quantity: 50,
    message: 'Direct pickup from farm gate. Instant digital payment upon weighing.',
  });

  const activeOrdersCount = purchaseRequests.filter((r) => r.status === 'accepted').length;
  const pendingOrdersCount = purchaseRequests.filter((r) => r.status === 'pending').length;

  const filteredListings = marketplaceListings.filter((item) => {
    const matchesSearch =
      item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'All' || item.crop === selectedCrop;
    return matchesSearch && matchesCrop;
  });

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForOffer) return;

    addPurchaseRequest({
      listingId: selectedListingForOffer.id,
      cropName: `${selectedListingForOffer.crop} (${selectedListingForOffer.variety})`,
      buyerId: currentUser?.id || 'buyer-1',
      buyerName: currentUser?.name || 'AgriProcure Pvt Ltd',
      buyerPhone: currentUser?.phone || '9876543210',
      offeredPrice: Number(offerForm.offeredPrice),
      quantity: Number(offerForm.quantity),
      unit: selectedListingForOffer.unit,
      message: offerForm.message,
    });

    alert('Purchase offer submitted directly to farmer!');
    setSelectedListingForOffer(null);
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Header Banner */}
      <div
        className="card"
        style={{
          padding: '24px 28px',
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.3)',
            }}
          >
            <ShoppingBag size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                AGRINEXT MARKET BUYER CONSOLE
              </span>
              <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '999px', backgroundColor: '#fffbeb', color: '#b45309', fontWeight: 800, border: '1px solid #fde68a' }}>
                VERIFIED TRADER
              </span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
              {currentUser?.name || 'Anil Gupta (AgriProcure)'}
            </h1>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right', padding: '6px 14px', backgroundColor: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>PROCUREMENT REGION</div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>Madhya Pradesh & UP</div>
          </div>
        </div>
      </div>

      {/* 2. Top Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>CONTRACT OFFERS</span>
            <Clock size={20} color="#d97706" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#d97706' }}>{purchaseRequests.length}</div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Submitted purchase requests</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>ACCEPTED DEALS</span>
            <CheckCircle size={20} color="#059669" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#059669' }}>{activeOrdersCount}</div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Confirmed farmer contracts</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>AVAILABLE LISTINGS</span>
            <Package size={20} color="#0284c7" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0284c7' }}>{marketplaceListings.length}</div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Direct farmer produce lots</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>PROCUREMENT VOLUME</span>
            <TrendingUp size={20} color="#16a34a" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#16a34a' }}>320 Quintals</div>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Active month contracts</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'requests' ? '#d97706' : '#ffffff',
            color: activeTab === 'requests' ? '#ffffff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'requests' ? '0 4px 12px rgba(217,119,6,0.25)' : 'none',
          }}
        >
          My Purchase Offers ({purchaseRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('produce')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: activeTab === 'produce' ? '#d97706' : '#ffffff',
            color: activeTab === 'produce' ? '#ffffff' : '#64748b',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            boxShadow: activeTab === 'produce' ? '0 4px 12px rgba(217,119,6,0.25)' : 'none',
          }}
        >
          Farmer Produce Marketplace ({marketplaceListings.length})
        </button>
      </div>

      {/* TAB 1: PURCHASE REQUESTS & ORDERS */}
      {activeTab === 'requests' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {purchaseRequests.map((req) => (
              <div
                key={req.id}
                className="card card-interactive"
                style={{
                  padding: '20px 24px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h4 style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', margin: 0 }}>{req.cropName}</h4>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        backgroundColor: req.status === 'accepted' ? '#dcfce7' : '#fef3c7',
                        color: req.status === 'accepted' ? '#15803d' : '#b45309',
                        border: `1px solid ${req.status === 'accepted' ? '#bbf7d0' : '#fde68a'}`,
                        textTransform: 'uppercase',
                      }}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600 }}>
                    Offered Price: <b style={{ color: '#059669' }}>₹{req.offeredPrice} / {req.unit}</b> for <b>{req.quantity} {req.unit}</b>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px' }}>
                    Submitted: {req.requestDate} | Note: "{req.message}"
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, padding: '6px 12px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#334155' }}>
                    Contract #{req.id.slice(-6)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCE MARKETPLACE FEED */}
      {activeTab === 'produce' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search produce (e.g. Wheat, Mustard, Cumin) or district location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '9px 12px 9px 40px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
              />
            </div>

            <div style={{ width: '160px' }}>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.88rem', backgroundColor: '#ffffff', fontWeight: 600 }}
              >
                <option value="All">All Crops</option>
                <option value="Mustard">Mustard</option>
                <option value="Wheat">Wheat</option>
                <option value="Cumin (Jeera)">Cumin (Jeera)</option>
              </select>
            </div>
          </div>

          {/* Produce Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
            {filteredListings.map((item) => (
              <div key={item.id} className="card card-interactive" style={{ padding: '24px', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.crop}</h3>
                      <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>{item.variety}</span>
                    </div>

                    <span style={{ fontSize: '0.75rem', fontWeight: 800, backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0', padding: '3px 8px', borderRadius: '6px' }}>
                      Grade {item.qualityGrade}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#059669', fontWeight: 600, marginBottom: '12px' }}>
                    <MapPin size={14} />
                    <span>{item.farmerLocation}</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Available Quantity</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>{item.quantity} {item.unit}</div>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Asking Price</span>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>₹{item.expectedPrice} / {item.unit}</div>
                    </div>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={() => setSelectedListingForOffer(item)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Send size={16} />
                  <span>Submit Purchase Offer</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OFFER SUBMISSION MODAL */}
      {selectedListingForOffer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Offer for {selectedListingForOffer.crop} ({selectedListingForOffer.variety})
              </h3>
              <button onClick={() => setSelectedListingForOffer(null)} style={{ border: 'none', background: 'transparent', fontSize: '1.4rem', cursor: 'pointer', color: '#94a3b8' }}>✕</button>
            </div>

            <form onSubmit={handleSendOffer} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Offered Price per {selectedListingForOffer.unit} (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={offerForm.offeredPrice}
                  onChange={(e) => setOfferForm({ ...offerForm, offeredPrice: Number(e.target.value) })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Required Quantity ({selectedListingForOffer.unit}) *
                </label>
                <input
                  type="number"
                  required
                  value={offerForm.quantity}
                  onChange={(e) => setOfferForm({ ...offerForm, quantity: Number(e.target.value) })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Contract Terms / Pickup Note
                </label>
                <textarea
                  rows={2}
                  value={offerForm.message}
                  onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '11px', borderRadius: '10px', fontWeight: 800 }}>
                Transmit Contract Offer to Farmer
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
