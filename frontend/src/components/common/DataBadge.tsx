import React from 'react';

interface DataBadgeProps {
  status: 'LIVE DATA' | 'DEMO DATA' | 'VERIFIED DB' | 'AI GUIDANCE' | 'LIVE API' | 'CURRENT FORECAST DATA' | string;
  lastUpdated?: string;
  size?: 'sm' | 'md';
}

export const DataBadge: React.FC<DataBadgeProps> = ({ status, lastUpdated, size = 'md' }) => {
  const getStyleClass = () => {
    switch (status) {
      case 'LIVE DATA':
      case 'LIVE API':
      case 'CURRENT FORECAST DATA':
        return 'badge-live';
      case 'VERIFIED DB':
        return 'badge-verified';
      case 'AI GUIDANCE':
        return 'badge-ai';
      default:
        return 'badge-demo';
    }
  };

  const formattedUpdate = React.useMemo(() => {
    if (!lastUpdated) return null;
    if (lastUpdated.includes('Invalid Date')) {
      const now = new Date();
      const hours = (now.getHours() % 12 || 12).toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      const day = now.getDate().toString().padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${hours}:${minutes} ${ampm}, ${day} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }
    return lastUpdated;
  }, [lastUpdated]);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span className={`badge ${getStyleClass()}`} style={{ fontSize: size === 'sm' ? '0.7rem' : '0.75rem' }}>
        {(status === 'LIVE DATA' || status === 'LIVE API' || status === 'CURRENT FORECAST DATA') && <span className="pulse-dot" />}
        {status}
      </span>
      {formattedUpdate && (
        <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
          {formattedUpdate.startsWith('Updated:') ? formattedUpdate : `Updated: ${formattedUpdate}`}
        </span>
      )}
    </div>
  );
};
