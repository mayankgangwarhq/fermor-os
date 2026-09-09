import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DataBadge } from '../components/common/DataBadge';
import type { MarketplaceListing } from '../types';
import { ShoppingBag, Plus, Search, Filter, MapPin, Calendar, Phone, CheckCircle, Send, X } from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { marketplaceListings, addListing, addPurchaseRequest } = useData();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedListingForOffer, setSelectedListingForOffer] = useState<MarketplaceListing | null>(null);

  const [newListing, setNewListing] = useState({
    crop: 'Mustard',
    variety: 'Pusa Bold',
    quantity: 50,
    unit: 'Quintals' as MarketplaceListing['unit'],
    qualityGrade: 'A+' as MarketplaceListing['qualityGrade'],
    expectedPrice: 6300,
    harvestDate: '2026-03-10',
    description: 'Cleaned, sun-dried oilseeds direct from our farm.'
  });

  const [offerForm, setOfferForm] = useState({
    offeredPrice: 6200,
    quantity: 50,
    message: 'We will pick up directly from your farm. Instant payment upon weighing.'
  });

  const filteredListings = marketplaceListings.filter(item => {
    const matchesSearch = item.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.farmerLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.variety.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'All' || item.crop === selectedCrop;
    return matchesSearch && matchesCrop;
  });

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    addListing({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      farmerLocation: `${currentUser.village}, ${currentUser.district}`,
      district: currentUser.district,
      state: currentUser.state,
      crop: newListing.crop,
      variety: newListing.variety,
      quantity: Number(newListing.quantity),
      unit: newListing.unit,
      qualityGrade: newListing.qualityGrade,
      expectedPrice: Number(newListing.expectedPrice),
      harvestDate: newListing.harvestDate,
      status: 'active',
      images: ['https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80'],
      description: newListing.description
    });
    setShowAddModal(false);
  };

  const handleSendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingForOffer) return;

    addPurchaseRequest({
      listingId: selectedListingForOffer.id,
      cropName: `${selectedListingForOffer.crop} (${selectedListingForOffer.variety})`,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      offeredPrice: Number(offerForm.offeredPrice),
      quantity: Number(offerForm.quantity),
      unit: selectedListingForOffer.unit,
      message: offerForm.message
    });

    alert('Purchase offer submitted successfully to farmer!');
    setSelectedListingForOffer(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase' }}>AGRINEXT DIRECT CROP MARKETPLACE</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)' }}>Agricultural Marketplace</h1>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          <span>List Produce for Sale</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
          <input
            type="text"
            className="form-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search produce (e.g. Wheat, Mustard, Cumin) or location..."
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <div style={{ width: '180px' }}>
          <select className="form-select" value={selectedCrop} onChange={e => setSelectedCrop(e.target.value)}>
            <option value="All">All Crops</option>
            <option value="Mustard">Mustard</option>
            <option value="Wheat">Wheat</option>
            <option value="Cumin (Jeera)">Cumin (Jeera)</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px' }}>
        {filteredListings.map(item => (
          <div key={item.id} className="card card-interactive" style={{ overflow: 'hidden', backgroundColor: '#ffffff' }}>
            <div style={{ position: 'relative', height: '180px' }}>
              <img src={item.images[0]} alt={item.crop} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: 'var(--primary-600)', color: '#ffffff', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                Grade {item.qualityGrade}
              </span>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                  {item.crop} ({item.variety})
                </h3>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary-700)' }}>
                  ₹{item.expectedPrice} <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)', fontWeight: '600' }}>/{item.unit.slice(0, -1)}</span>
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} />
                <span>{item.farmerLocation}</span>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: '16px', lineHeight: 1.4 }}>
                {item.description}
              </p>

              <div style={{ padding: '10px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)', marginBottom: '16px' }}>
                <span>Available: <b>{item.quantity} {item.unit}</b></span>
                <span>Harvest: <b>{item.harvestDate}</b></span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}
                  onClick={() => { setSelectedListingForOffer(item); setOfferForm({ ...offerForm, quantity: item.quantity, offeredPrice: item.expectedPrice }); }}
                >
                  <Send size={14} />
                  <span>Send Offer</span>
                </button>

                <a
                  href={`tel:${item.farmerPhone}`}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  title="Call Farmer Directly"
                >
                  <Phone size={14} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', padding: '28px', backgroundColor: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>List Crop for Direct Sale</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setShowAddModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateListing}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Crop Name</label>
                  <input type="text" className="form-input" value={newListing.crop} onChange={e => setNewListing({ ...newListing, crop: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Variety</label>
                  <input type="text" className="form-input" value={newListing.variety} onChange={e => setNewListing({ ...newListing, variety: e.target.value })} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input type="number" className="form-input" value={newListing.quantity} onChange={e => setNewListing({ ...newListing, quantity: Number(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Unit</label>
                  <select className="form-select" value={newListing.unit} onChange={e => setNewListing({ ...newListing, unit: e.target.value as any })}>
                    <option value="Quintals">Quintals</option>
                    <option value="Kg">Kg</option>
                    <option value="Tons">Tons</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Quality</label>
                  <select className="form-select" value={newListing.qualityGrade} onChange={e => setNewListing({ ...newListing, qualityGrade: e.target.value as any })}>
                    <option value="A+">Grade A+</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Expected Price (₹ / unit)</label>
                  <input type="number" className="form-input" value={newListing.expectedPrice} onChange={e => setNewListing({ ...newListing, expectedPrice: Number(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Harvest Date</label>
                  <input type="date" className="form-input" value={newListing.harvestDate} onChange={e => setNewListing({ ...newListing, harvestDate: e.target.value })} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Storage Notes</label>
                <textarea className="form-textarea" rows={3} value={newListing.description} onChange={e => setNewListing({ ...newListing, description: e.target.value })} />
              </div>

              <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '12px' }}>
                <span>Publish Listing to AGRINEXT Marketplace</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedListingForOffer && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '28px', backgroundColor: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Submit Purchase Offer</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setSelectedListingForOffer(null)}><X size={20} /></button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginBottom: '16px' }}>
              Sending direct purchase offer for <b>{selectedListingForOffer.crop} ({selectedListingForOffer.variety})</b> listed by {selectedListingForOffer.farmerName}.
            </p>

            <form onSubmit={handleSendOffer}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Offered Price (₹/{selectedListingForOffer.unit})</label>
                  <input type="number" className="form-input" value={offerForm.offeredPrice} onChange={e => setOfferForm({ ...offerForm, offeredPrice: Number(e.target.value) })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity Required</label>
                  <input type="number" className="form-input" value={offerForm.quantity} onChange={e => setOfferForm({ ...offerForm, quantity: Number(e.target.value) })} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message / Logistics Terms</label>
                <textarea className="form-textarea" rows={3} value={offerForm.message} onChange={e => setOfferForm({ ...offerForm, message: e.target.value })} required />
              </div>

              <button className="btn btn-accent" type="submit" style={{ width: '100%', padding: '12px' }}>
                <span>Submit Purchase Request</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
