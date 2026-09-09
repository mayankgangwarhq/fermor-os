import React from 'react';
import { useData } from '../contexts/DataContext';
import { Wrench, Calendar, CheckCircle } from 'lucide-react';

export const ServiceProviderDashboard: React.FC = () => {
  const { equipmentBookings, equipmentListings } = useData();

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#ea580c', textTransform: 'uppercase' }}>AGRINEXT EQUIPMENT PROVIDER PORTAL</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)' }}>Machinery Rental Provider Dashboard</h1>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '16px' }}>
          Rental Bookings & Schedule ({equipmentBookings.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {equipmentBookings.map(bk => (
            <div key={bk.id} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--slate-200)', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ fontWeight: '800', fontSize: '1rem', color: 'var(--slate-900)' }}>{bk.equipmentTitle}</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  Farmer: <b>{bk.farmerName}</b> ({bk.farmerPhone}) | Dates: <b>{bk.startDate} to {bk.endDate}</b>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#ea580c', fontWeight: '700', marginTop: '4px' }}>
                  Total Rental Revenue: ₹{bk.totalCost.toLocaleString()}
                </div>
              </div>

              <span style={{ fontSize: '0.8rem', fontWeight: '800', padding: '4px 12px', borderRadius: '999px', backgroundColor: '#dcfce7', color: '#16a34a' }}>
                {bk.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
