import React from 'react';
import { useData } from '../contexts/DataContext';
import { DataBadge } from '../components/common/DataBadge';
import { Shield, Users, ShoppingBag, Award, Wrench, TrendingUp, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const { marketplaceListings, consultations, equipmentBookings, farms } = useData();

  const userGrowthData = [
    { month: 'Jan', farmers: 2100, buyers: 120 },
    { month: 'Feb', farmers: 4300, buyers: 280 },
    { month: 'Mar', farmers: 6800, buyers: 490 },
    { month: 'Apr', farmers: 9500, buyers: 720 },
    { month: 'May', farmers: 12400, buyers: 980 },
    { month: 'Jun', farmers: 14250, buyers: 1250 }
  ];

  const regionalData = [
    { region: 'Uttar Pradesh', farmers: 5400 },
    { region: 'Madhya Pradesh', farmers: 3200 },
    { region: 'Punjab', farmers: 2600 },
    { region: 'Haryana', farmers: 1800 },
    { region: 'Rajasthan', farmers: 1250 }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase' }}>AGRINEXT PLATFORM SUPER ADMIN CONSOLE</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)' }}>System Overview & Analytics</h1>
        </div>
        <DataBadge status="DEMO DATA" lastUpdated="Real-time System Monitor" />
      </div>

      {/* Core Platform Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
            <Users size={18} color="var(--primary-600)" />
            <span>Total Farmers</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '4px' }}>
            14,250
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '700' }}>+15% this month</div>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
            <ShoppingBag size={18} color="#16a34a" />
            <span>Active Listings</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '4px' }}>
            {marketplaceListings.length + 380}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Direct produce lots</div>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
            <Award size={18} color="#db2777" />
            <span>Consultations</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '4px' }}>
            {consultations.length + 1420}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>AI & Agronomist resolved</div>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--slate-500)', fontSize: '0.85rem' }}>
            <Wrench size={18} color="#ea580c" />
            <span>Equipment Rental</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--slate-900)', marginTop: '4px' }}>
            {equipmentBookings.length + 650}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Tractor & harvester days</div>
        </div>
      </div>

      {/* Visual Recharts Graphs Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* User Growth Line Chart */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '16px' }}>
            Farmer Adoption Trajectory (2026)
          </h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="farmers" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Regional Distribution Bar Chart */}
        <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '16px' }}>
            Regional Farmer Distribution (North India)
          </h3>
          <div style={{ width: '100%', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="region" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="farmers" fill="#0284c7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
