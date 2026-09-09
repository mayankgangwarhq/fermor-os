import React from 'react';

interface DataBadgeProps {
  status: 'LIVE DATA' | 'DEMO DATA' | 'VERIFIED DB' | 'AI GUIDANCE' | 'LIVE API';
  lastUpdated?: string;
  size?: 'sm' | 'md';
}

export const DataBadge: React.FC<DataBadgeProps> = ({ status, lastUpdated, size = 'md' }) => {
  const getStyleClass = () => {
    switch (status) {
      case 'LIVE DATA':
      case 'LIVE API':
        return 'badge-live';
      case 'VERIFIED DB':
        return 'badge-verified';
      case 'AI GUIDANCE':
        return 'badge-ai';
      default:
        return 'badge-demo';
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span className={`badge ${getStyleClass()}`} style={{ fontSize: size === 'sm' ? '0.7rem' : '0.75rem' }}>
        {(status === 'LIVE DATA' || status === 'LIVE API') && <span className="pulse-dot" />}
        {status}
      </span>
      {lastUpdated && (
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
          Updated: {lastUpdated}
        </span>
      )}
    </div>
  );
};
