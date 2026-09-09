import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Data',
  message = 'There was a problem fetching this information. Please check your connection and try again.',
  onRetry
}) => (
  <div className="card" style={{ padding: '32px', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #fee2e2' }}>
    <AlertCircle size={36} color="#ef4444" style={{ marginBottom: '12px' }} />
    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '6px' }}>{title}</h3>
    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', maxWidth: '420px', margin: '0 auto 20px auto' }}>{message}</p>
    {onRetry && (
      <button className="btn btn-secondary" onClick={onRetry} style={{ padding: '8px 16px', fontSize: '0.85rem', borderRadius: '10px' }}>
        <RefreshCw size={14} style={{ marginRight: '6px' }} />
        <span>Retry Loading</span>
      </button>
    )}
  </div>
);
