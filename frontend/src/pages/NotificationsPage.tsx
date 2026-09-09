import React from 'react';
import { useData } from '../contexts/DataContext';
import { Bell, CheckCheck, Sun, ShoppingBag, TrendingUp, CheckSquare, Landmark, Users } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useData();

  const getIcon = (type: string) => {
    switch (type) {
      case 'weather': return <Sun size={20} color="#0284c7" />;
      case 'marketplace': return <ShoppingBag size={20} color="var(--primary-600)" />;
      case 'mandi': return <TrendingUp size={20} color="#16a34a" />;
      case 'task': return <CheckSquare size={20} color="#d97706" />;
      default: return <Bell size={20} color="#7c3aed" />;
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div className="card" style={{ padding: '20px 24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bell size={24} color="var(--primary-600)" />
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--slate-900)' }}>Notification Center</h1>
        </div>

        <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={markAllNotificationsRead}>
          <CheckCheck size={16} />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notifications.map(notif => (
          <div
            key={notif.id}
            onClick={() => markNotificationRead(notif.id)}
            className="card"
            style={{
              padding: '16px 20px',
              backgroundColor: notif.read ? '#ffffff' : 'var(--primary-50)',
              borderLeft: notif.read ? '1px solid var(--slate-200)' : '4px solid var(--primary-600)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
              cursor: 'pointer'
            }}
          >
            <div style={{ marginTop: '2px' }}>
              {getIcon(notif.type)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <h4 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--slate-900)' }}>{notif.title}</h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{notif.timestamp}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', lineHeight: 1.4 }}>{notif.message}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
