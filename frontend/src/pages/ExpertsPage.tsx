import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { DataBadge } from '../components/common/DataBadge';
import type { Expert } from '../types';
import { Award, Star, MapPin, Calendar, Clock, Send, MessageSquare, Phone, X } from 'lucide-react';

export const ExpertsPage: React.FC = () => {
  const { experts, consultations, addConsultation } = useData();
  const { currentUser } = useAuth();

  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [form, setForm] = useState({
    cropIssueTitle: 'Yellow Rust Pustules on Wheat Leaves',
    cropName: 'Wheat',
    description: 'Observed linear yellow powdery pustules across 2 acres. Need immediate chemical dosage prescription.'
  });

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpert) return;

    addConsultation({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      expertTitle: selectedExpert.title,
      cropIssueTitle: form.cropIssueTitle,
      cropName: form.cropName,
      description: form.description
    });

    alert(`Consultation request submitted to ${selectedExpert.name}! You will receive response within 2 hours.`);
    setSelectedExpert(null);
  };

  return (
    <div style={{ maxWidth: '950px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase' }}>AGRINEXT VERIFIED EXPERTS</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)' }}>Agronomist & Specialist Advisory</h1>
        </div>
        <DataBadge status="DEMO DATA" />
      </div>

      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '16px' }}>Available Agriculture Specialists</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {experts.map(exp => (
            <div key={exp.id} className="card card-interactive" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <img src={exp.avatar} alt={exp.name} style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-600)' }} />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--slate-900)' }}>{exp.name}</h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: '700' }}>{exp.title}</span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px' }}>{exp.qualification}</div>
                  </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: '16px', lineHeight: 1.4 }}>
                  {exp.bio}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {exp.specialization.map((sp, idx) => (
                    <span key={idx} style={{ fontSize: '0.7rem', fontWeight: '700', backgroundColor: 'var(--slate-100)', color: 'var(--slate-700)', padding: '3px 8px', borderRadius: '6px' }}>
                      {sp}
                    </span>
                  ))}
                </div>

                <div style={{ padding: '10px 12px', backgroundColor: 'var(--slate-50)', borderRadius: '10px', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', color: 'var(--slate-600)', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Star size={14} color="#d97706" fill="#d97706" />
                    <b>{exp.rating}</b> ({exp.reviewCount})
                  </div>
                  <span>Exp: <b>{exp.experienceYears} Years</b></span>
                  <span>Fee: <b style={{ color: 'var(--primary-700)' }}>₹{exp.consultationFee}</b></span>
                </div>
              </div>

              <button className="btn btn-primary" onClick={() => setSelectedExpert(exp)} style={{ width: '100%', padding: '10px' }}>
                <MessageSquare size={16} />
                <span>Book 1:1 Consultation</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '16px' }}>My Consultation History</h2>
        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          {consultations.length === 0 ? (
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-500)', textAlign: 'center', padding: '20px' }}>No active expert consultations yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {consultations.map(c => (
                <div key={c.id} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--slate-200)', backgroundColor: 'var(--slate-50)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--slate-900)' }}>{c.cropIssueTitle} ({c.cropName})</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', padding: '4px 10px', borderRadius: '999px', backgroundColor: c.status === 'answered' ? '#dcfce7' : '#fef3c7', color: c.status === 'answered' ? '#166534' : '#b45309' }}>
                      {c.status === 'answered' ? 'ANSWERED BY EXPERT' : 'PENDING REVIEW'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: '10px' }}>
                    <b>Consultant:</b> {c.expertName} ({c.expertTitle})
                  </p>

                  {c.answer && (
                    <div style={{ padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px', borderLeft: '4px solid var(--primary-600)', fontSize: '0.85rem', color: 'var(--slate-800)', marginTop: '8px' }}>
                      <div style={{ fontWeight: '700', color: 'var(--primary-800)', marginBottom: '4px' }}>Agronomist Prescription:</div>
                      {c.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedExpert && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px', backgroundColor: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Book Consultation with {selectedExpert.name}</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setSelectedExpert(null)}><X size={20} /></button>
            </div>

            <form onSubmit={handleBookConsultation}>
              <div className="form-group">
                <label className="form-label">Crop Name</label>
                <input type="text" className="form-input" value={form.cropName} onChange={e => setForm({ ...form, cropName: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Crop Issue Title</label>
                <input type="text" className="form-input" value={form.cropIssueTitle} onChange={e => setForm({ ...form, cropIssueTitle: e.target.value })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Symptoms & Description</label>
                <textarea className="form-textarea" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
              </div>

              <div style={{ padding: '12px', backgroundColor: 'var(--primary-50)', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--primary-900)', marginBottom: '20px' }}>
                Consultation Fee: <b>₹{selectedExpert.consultationFee}</b> (Included in AGRINEXT Startup MVP Plan)
              </div>

              <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '12px' }}>
                <Send size={16} />
                <span>Submit Query to Expert</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
