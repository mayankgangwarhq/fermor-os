import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2,
  Clock, Shield, Sparkles, HelpCircle, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'crop-disease',
    urgency: 'normal',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || (!formData.phone && !formData.email) || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }

    const generatedId = 'AGX-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(generatedId);
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How fast will AGRINEXT support respond to crop emergency cases?',
      a: 'Urgent crop pest and blight outbreak tickets are reviewed by our AI system instantly and dispatched to regional ICAR/KVK experts within 15 to 30 minutes.'
    },
    {
      q: 'Is the Kisan AI Advisory and Helpline free for all farmers?',
      a: 'Yes, 100% of core diagnostics, Mandi rate feeds, weather advisories, and the 24/7 Kisan Call Center integrations are completely free of charge.'
    },
    {
      q: 'Can I send crop photos over WhatsApp for AI diagnosis?',
      a: 'Yes! Connect with our verified WhatsApp AI bot at +91 98765 43210 and send leaf or fruit photos directly to receive immediate diagnosis and treatment steps.'
    },
    {
      q: 'How do I report incorrect Mandi prices or regional weather anomalies?',
      a: 'Use the inquiry form above selecting "Mandi / Weather Discrepancy" or submit feedback via our Feedback Portal. Our telemetry team will verify and calibrate APMC feeds immediately.'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1140px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #172033 0%, #1e293b 100%)'
            : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          padding: '36px 28px',
          borderRadius: '20px',
          border: isDark ? '1px solid #263449' : '1px solid #a7f3d0',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ maxWidth: '680px', position: 'relative', zIndex: 2 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ffffff',
              color: isDark ? '#34d399' : '#047857',
              fontSize: '0.78rem',
              fontWeight: 800,
              marginBottom: '12px',
              border: isDark ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #bbf7d0',
            }}
          >
            <Sparkles size={13} />
            <span>24/7 Farmer & Stakeholder Support</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: isDark ? '#f8fafc' : '#064e3b', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            We\'re Here to Assist Your Farm & Queries
          </h1>
          <p style={{ fontSize: '0.96rem', color: isDark ? '#cbd5e1' : '#334155', marginTop: '10px', lineHeight: 1.6 }}>
            Whether you need assistance with AI crop disease detection, live Mandi rates, government schemes, or system integration, our dedicated support team is ready to help.
          </p>
        </div>
      </div>

      {/* Grid: Contact Cards & Inquiry Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Direct Helplines & Office Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Toll Free Helpline */}
          <div
            className="card"
            style={{
              padding: '22px',
              backgroundColor: isDark ? '#172033' : '#ffffff',
              borderColor: isDark ? '#263449' : '#e2e8f0',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#064e3b' : '#ecfdf5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                flexShrink: 0,
              }}
            >
              <Phone size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Kisan Call Center Toll Free
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', marginTop: '2px' }}>
                1800-180-1551
              </div>
              <div style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                Available 24/7 in 22 regional Indian languages.
              </div>
            </div>
          </div>

          {/* WhatsApp AI Hotline */}
          <div
            className="card"
            style={{
              padding: '22px',
              backgroundColor: isDark ? '#172033' : '#ffffff',
              borderColor: isDark ? '#263449' : '#e2e8f0',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#14532d' : '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22c55e',
                flexShrink: 0,
              }}
            >
              <MessageSquare size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                WhatsApp AI Crop Bot
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: isDark ? '#f8fafc' : '#0f172a', marginTop: '2px' }}>
                +91 98765 43210
              </div>
              <div style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                Instant photo pathology & spray dosage recommendations.
              </div>
            </div>
          </div>

          {/* Email Support */}
          <div
            className="card"
            style={{
              padding: '22px',
              backgroundColor: isDark ? '#172033' : '#ffffff',
              borderColor: isDark ? '#263449' : '#e2e8f0',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#1e1b4b' : '#ede9fe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8b5cf6',
                flexShrink: 0,
              }}
            >
              <Mail size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Official Email Desk
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginTop: '2px' }}>
                support@agrinext.in
              </div>
              <div style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                Government & research desk: helpdesk@agrinext.gov.in
              </div>
            </div>
          </div>

          {/* Headquarters Location */}
          <div
            className="card"
            style={{
              padding: '22px',
              backgroundColor: isDark ? '#172033' : '#ffffff',
              borderColor: isDark ? '#263449' : '#e2e8f0',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#451a03' : '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
                flexShrink: 0,
              }}
            >
              <MapPin size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                National Agri-AI Command Center
              </div>
              <div style={{ fontSize: '0.94rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a', marginTop: '2px' }}>
                ICAR-IARI Complex, Pusa Campus
              </div>
              <div style={{ fontSize: '0.82rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                New Delhi, Delhi 110012, India
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry & Support Form */}
        <div
          className="card"
          style={{
            padding: '28px',
            backgroundColor: isDark ? '#172033' : '#ffffff',
            borderColor: isDark ? '#263449' : '#e2e8f0',
          }}
        >
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '36px 16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: isDark ? '#064e3b' : '#ecfdf5',
                  color: '#10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#064e3b' }}>
                Inquiry Submitted Successfully!
              </h3>
              <p style={{ fontSize: '0.92rem', color: isDark ? '#cbd5e1' : '#475569', marginTop: '8px' }}>
                Your ticket tracking number is:
              </p>
              <div
                style={{
                  display: 'inline-block',
                  padding: '8px 20px',
                  borderRadius: '10px',
                  backgroundColor: isDark ? '#1e293b' : '#f1f5f9',
                  color: '#10b981',
                  fontFamily: 'monospace',
                  fontSize: '1.2rem',
                  fontWeight: 900,
                  marginTop: '12px',
                  letterSpacing: '0.06em',
                }}
              >
                {ticketId}
              </div>
              <p style={{ fontSize: '0.84rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '14px' }}>
                An SMS and email confirmation has been dispatched. Our agricultural expert will reach out shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', phone: '', email: '', category: 'crop-disease', urgency: 'normal', message: '' });
                }}
                className="btn btn-secondary"
                style={{ marginTop: '24px' }}
              >
                Submit Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                  Send an Inquiry / Support Request
                </h3>
                <p style={{ fontSize: '0.84rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                  Fill out the form below and our agronomists will follow up with you.
                </p>
              </div>

              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Phone & Email */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#111827' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="farmer@agrinext.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#111827' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Category & Urgency */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#111827' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  >
                    <option value="crop-disease">Crop Disease & AI Diagnosis</option>
                    <option value="mandi-rates">Mandi Rates & Price Feeds</option>
                    <option value="weather-alert">Weather & Radar Alert</option>
                    <option value="govt-scheme">Government Scheme Assistance</option>
                    <option value="equipment-rental">Equipment Rental / Service</option>
                    <option value="technical">Technical / Login Issue</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                    Urgency
                  </label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                      backgroundColor: isDark ? '#111827' : '#ffffff',
                      color: isDark ? '#f8fafc' : '#0f172a',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  >
                    <option value="normal">Normal (within 24 hrs)</option>
                    <option value="urgent">Urgent Crop Outbreak</option>
                    <option value="critical">Critical Field Emergency</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '6px' }}>
                  Your Message or Question *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your crop condition, symptoms, or question in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px',
                }}
              >
                <Send size={16} />
                <span>Submit Support Ticket</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div
        className="card"
        style={{
          padding: '28px',
          backgroundColor: isDark ? '#172033' : '#ffffff',
          borderColor: isDark ? '#263449' : '#e2e8f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <HelpCircle size={22} color="#10b981" />
          <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
            Frequently Asked Questions
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                style={{
                  border: isDark ? '1px solid #263449' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: isDark ? (isOpen ? '#1e293b' : '#111827') : (isOpen ? '#f8fafc' : '#ffffff'),
                  transition: 'background-color 0.2s ease',
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: isDark ? '#f8fafc' : '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} color="#10b981" /> : <ChevronDown size={18} color="#94a3b8" />}
                </button>
                {isOpen && (
                  <div
                    style={{
                      padding: '0 18px 16px',
                      fontSize: '0.88rem',
                      color: isDark ? '#cbd5e1' : '#475569',
                      lineHeight: 1.6,
                    }}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
