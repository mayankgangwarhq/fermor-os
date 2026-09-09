import React from 'react';
import { RefreshCw, Sprout } from 'lucide-react';

export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading AGRINEXT Intelligence...' }) => (
  <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
    <div style={{ position: 'relative', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
      <RefreshCw size={48} color="#10b981" style={{ animation: 'spin 1.4s linear infinite', opacity: 0.3, position: 'absolute' }} />
      <Sprout size={24} color="#059669" />
    </div>
    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#475569' }}>{message}</span>
  </div>
);
