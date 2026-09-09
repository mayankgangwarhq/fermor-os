import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DataBadge } from '../components/common/DataBadge';
import type { Equipment } from '../types';
import { Wrench, MapPin, Calendar, Star, Phone, CheckCircle, Send, X } from 'lucide-react';

export const EquipmentPage: React.FC = () => {
  const { equipmentListings, equipmentBookings, addEquipmentBooking } = useData();
  const { currentUser } = useAuth();
  const { t, language } = useLanguage();

  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);
  const [bookingForm, setBookingForm] = useState({
    startDate: '2026-03-01',
    endDate: '2026-03-03'
  });

  const handleBookEquipment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEq) return;

    const days = 3;
    const totalCost = days * selectedEq.dailyRate;

    addEquipmentBooking({
      equipmentId: selectedEq.id,
      equipmentTitle: selectedEq.title,
      ownerId: selectedEq.ownerId,
      ownerName: selectedEq.ownerName,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      startDate: bookingForm.startDate,
      endDate: bookingForm.endDate,
      totalCost
    });

    alert(`Equipment rental booking submitted to ${selectedEq.ownerName}!`);
    setSelectedEq(null);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase' }}>AGRINEXT RENTAL NETWORK</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)' }}>Machinery & Equipment Rental</h1>
        </div>
        <DataBadge status="VERIFIED DB" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {equipmentListings.map(eq => (
          <div key={eq.id} className="card card-interactive" style={{ overflow: 'hidden', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ position: 'relative', height: '180px' }}>
                <img src={eq.image} alt={eq.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: eq.available ? '#16a34a' : '#dc2626', color: '#ffffff', fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '999px' }}>
                  {eq.available ? 'AVAILABLE FOR RENT' : 'BOOKED'}
                </span>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    {eq.title}
                  </h3>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary-700)' }}>
                    ₹{eq.dailyRate}<span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>/day</span>
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} />
                  <span>{eq.location}</span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {eq.specifications.map((spec, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)', padding: '3px 8px', borderRadius: '6px' }}>
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding: '0 20px 20px 20px', display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" onClick={() => setSelectedEq(eq)} style={{ flex: 1, padding: '10px' }}>
                <Calendar size={16} />
                <span>Book Rental</span>
              </button>
              <a href={`tel:${eq.ownerPhone}`} className="btn btn-secondary" style={{ padding: '10px' }} title="Call Owner">
                <Phone size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedEq && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '480px', width: '100%', padding: '28px', backgroundColor: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Book {selectedEq.title}</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setSelectedEq(null)}><X size={20} /></button>
            </div>

            <form onSubmit={handleBookEquipment}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-input" value={bookingForm.startDate} onChange={e => setBookingForm({ ...bookingForm, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-input" value={bookingForm.endDate} onChange={e => setBookingForm({ ...bookingForm, endDate: e.target.value })} required />
                </div>
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--primary-50)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--primary-900)', marginBottom: '20px' }}>
                Daily Rate: <b>₹{selectedEq.dailyRate}</b> / day
              </div>

              <button className="btn btn-accent" type="submit" style={{ width: '100%', padding: '12px' }}>
                <span>Confirm Rental Booking Request</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
