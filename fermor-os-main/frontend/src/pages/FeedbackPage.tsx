import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Star, Heart, MessageSquare, ThumbsUp, Send, CheckCircle2,
  Sparkles, Award, Image as ImageIcon, Check, RefreshCw
} from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { t } = useLanguage();
  const { isDark } = useTheme();
  const { currentUser, role } = useAuth();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState('ai-accuracy');
  const [npsScore, setNpsScore] = useState<number>(10);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ratingDescriptions: Record<number, { label: string; color: string }> = {
    1: { label: 'Needs Immediate Improvement 😞', color: '#ef4444' },
    2: { label: 'Fair / Could be Better 😐', color: '#f97316' },
    3: { label: 'Good & Helpful 🙂', color: '#eab308' },
    4: { label: 'Very Good Experience 😊', color: '#10b981' },
    5: { label: 'Outstanding AI Tool! 🚀🌟', color: '#059669' },
  };

  const categories = [
    { id: 'ai-accuracy', label: 'AI Disease & Pest Detection' },
    { id: 'weather-radar', label: 'Weather Forecast & Spray Radar' },
    { id: 'mandi-rates', label: 'Mandi Price Feeds & Transparency' },
    { id: 'ui-ux', label: 'Platform Design, Speed & Ease of Use' },
    { id: 'multilingual', label: 'Regional Language Accuracy' },
    { id: 'new-feature', label: 'New Feature or Module Request' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comments.trim()) {
      alert('Please provide a brief feedback note.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '860px', margin: '0 auto' }}>
      {/* Hero Banner */}
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
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 14px',
            borderRadius: '999px',
            backgroundColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#ffffff',
            color: isDark ? '#34d399' : '#047857',
            fontSize: '0.8rem',
            fontWeight: 800,
            marginBottom: '12px',
            border: isDark ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid #bbf7d0',
          }}
        >
          <Sparkles size={14} color="#eab308" />
          <span>Continuous AI Improvement Program</span>
        </div>

        <h1 style={{ fontSize: '2.1rem', fontWeight: 900, color: isDark ? '#f8fafc' : '#064e3b', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Your Feedback Powers Indian Agriculture AI
        </h1>
        <p style={{ fontSize: '0.96rem', color: isDark ? '#cbd5e1' : '#334155', marginTop: '10px', maxWidth: '640px', margin: '10px auto 0', lineHeight: 1.6 }}>
          Help us refine disease diagnostic neural networks, improve regional APMC price precision, and build tools tailored for every Indian farmer.
        </p>
      </div>

      {/* Main Form Card */}
      <div
        className="card"
        style={{
          padding: '32px 28px',
          backgroundColor: isDark ? '#172033' : '#ffffff',
          borderColor: isDark ? '#263449' : '#e2e8f0',
        }}
      >
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: isDark ? '#064e3b' : '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle2 size={42} />
            </div>

            <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: isDark ? '#f8fafc' : '#064e3b' }}>
              Thank You for Your Valuable Feedback!
            </h3>
            <p style={{ fontSize: '0.96rem', color: isDark ? '#cbd5e1' : '#475569', marginTop: '8px', maxWidth: '520px', margin: '8px auto 0', lineHeight: 1.6 }}>
              Your rating and comments have been delivered directly to the AGRINEXT AI Core Team & Agronomy Research Board.
            </p>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '12px',
                backgroundColor: isDark ? '#1e293b' : '#f8fafc',
                border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
                marginTop: '20px',
                color: '#10b981',
                fontWeight: 800,
                fontSize: '0.9rem',
              }}
            >
              <Award size={18} />
              <span>Contributed to Model Version v2.4 Calibration</span>
            </div>

            <div style={{ marginTop: '28px' }}>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setComments('');
                  setRating(5);
                }}
                className="btn btn-secondary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <RefreshCw size={15} />
                <span>Submit Another Review</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            {/* 1. Overall Experience Rating */}
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '1.05rem', fontWeight: 800, color: isDark ? '#f8fafc' : '#0f172a' }}>
                How would you rate your overall AGRINEXT experience?
              </label>

              {/* Star Rating Buttons */}
              <div style={{ display: 'flex', gap: '8px', margin: '8px 0' }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        transition: 'transform 0.15s ease',
                        transform: active ? 'scale(1.15)' : 'scale(1)',
                      }}
                      title={`${star} Stars`}
                    >
                      <Star
                        size={36}
                        color={active ? '#eab308' : (isDark ? '#334155' : '#cbd5e1')}
                        fill={active ? '#eab308' : 'transparent'}
                      />
                    </button>
                  );
                })}
              </div>

              <div
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 800,
                  color: ratingDescriptions[hoverRating || rating]?.color || '#10b981',
                }}
              >
                {ratingDescriptions[hoverRating || rating]?.label}
              </div>
            </div>

            {/* 2. Feedback Category Chips */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '10px' }}>
                Which feature or module are you reviewing?
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                {categories.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: isSelected
                          ? '2px solid #10b981'
                          : (isDark ? '1px solid #334155' : '1px solid #cbd5e1'),
                        backgroundColor: isSelected
                          ? (isDark ? '#064e3b' : '#ecfdf5')
                          : (isDark ? '#111827' : '#ffffff'),
                        color: isSelected
                          ? (isDark ? '#34d399' : '#065f46')
                          : (isDark ? '#f8fafc' : '#334155'),
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span>{cat.label}</span>
                      {isSelected && <Check size={16} color="#10b981" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Detailed Feedback */}
            <div>
              <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155', marginBottom: '8px' }}>
                What did you like most, or what should we improve? *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Share your thoughts on AI diagnosis speed, weather alerts, Mandi accuracy, or any issues you encountered..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isDark ? '1px solid #334155' : '1px solid #cbd5e1',
                  backgroundColor: isDark ? '#111827' : '#ffffff',
                  color: isDark ? '#f8fafc' : '#0f172a',
                  fontSize: '0.92rem',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>

            {/* 4. NPS Likelihood Slider (0 to 10) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontSize: '0.86rem', fontWeight: 800, color: isDark ? '#cbd5e1' : '#334155' }}>
                  How likely are you to recommend AGRINEXT to other farmers or colleagues?
                </label>
                <span
                  style={{
                    padding: '2px 10px',
                    borderRadius: '999px',
                    backgroundColor: npsScore >= 9 ? '#dcfce7' : npsScore >= 7 ? '#fef3c7' : '#fee2e2',
                    color: npsScore >= 9 ? '#15803d' : npsScore >= 7 ? '#b45309' : '#b91c1c',
                    fontWeight: 900,
                    fontSize: '0.85rem',
                  }}
                >
                  {npsScore} / 10
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={npsScore}
                onChange={(e) => setNpsScore(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#10b981',
                  cursor: 'pointer',
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: isDark ? '#94a3b8' : '#64748b', marginTop: '4px' }}>
                <span>0 - Not Likely</span>
                <span>5 - Neutral</span>
                <span>10 - Extremely Likely</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{
                padding: '14px 24px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '0.96rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px',
              }}
            >
              <Send size={18} />
              <span>Submit Feedback</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
