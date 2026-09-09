import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { FarmExpense, FarmRevenue } from '../types';
import { IndianRupee, TrendingUp, TrendingDown, Plus, PieChart, DollarSign, Calendar, Filter, X } from 'lucide-react';
import { PieChart as RePieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export const FarmEconomicsPage: React.FC = () => {
  const { expenses, revenues, addExpense, addRevenue } = useData();
  const { t, language } = useLanguage();

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);

  const [newExp, setNewExp] = useState({
    category: 'fertilizer' as FarmExpense['category'],
    amount: 3200,
    date: '2026-02-18',
    notes: 'Complex NPK + Zinc foliar application'
  });

  const [newRev, setNewRev] = useState({
    cropName: 'Mustard',
    quantity: 25,
    unit: 'Quintals',
    amount: 153750,
    buyerName: 'Anil Gupta (AgriProcure Pvt Ltd)',
    date: '2026-02-10'
  });

  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRevenue = revenues.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = totalRevenue - totalExpense;
  const roi = totalExpense > 0 ? ((netProfit / totalExpense) * 100).toFixed(1) : '0';

  const categoryTotals: { [key: string]: number } = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const pieData = Object.keys(categoryTotals).map(cat => ({
    name: cat.toUpperCase(),
    value: categoryTotals[cat]
  }));

  const COLORS = ['#059669', '#d97706', '#0284c7', '#7c3aed', '#ec4899', '#64748b'];

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      farmId: 'farm-1',
      category: newExp.category,
      amount: Number(newExp.amount),
      date: newExp.date,
      notes: newExp.notes
    });
    setShowExpenseModal(false);
  };

  const handleAddRevenue = (e: React.FormEvent) => {
    e.preventDefault();
    addRevenue({
      farmId: 'farm-1',
      cropName: newRev.cropName,
      quantity: Number(newRev.quantity),
      unit: newRev.unit,
      amount: Number(newRev.amount),
      buyerName: newRev.buyerName,
      date: newRev.date
    });
    setShowRevenueModal(false);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase' }}>AGRINEXT ROI & FINANCIAL INTELLIGENCE</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)' }}>Farm Economics & Accounting</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setShowExpenseModal(true)}>
            <Plus size={16} />
            <span>Log Expense</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowRevenueModal(true)}>
            <Plus size={16} />
            <span>Log Sales Revenue</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: '700' }}>TOTAL REVENUE</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#16a34a', margin: '6px 0' }}>₹{totalRevenue.toLocaleString()}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>All crop sales log</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: '#ffffff' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)', fontWeight: '700' }}>TOTAL EXPENSES</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#dc2626', margin: '6px 0' }}>₹{totalExpense.toLocaleString()}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>Seeds, fertilizer, labour</span>
        </div>

        <div className="card" style={{ padding: '20px', backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-200, #a7f3d0)' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--primary-800)', fontWeight: '700' }}>NET FARM PROFIT</span>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--primary-900)', margin: '6px 0' }}>₹{netProfit.toLocaleString()}</div>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-700)', fontWeight: '700' }}>Return on Investment: {roi}%</span>
        </div>
      </div>

      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '16px' }}>Expense Breakdown by Category</h3>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <RePieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => `₹${val.toLocaleString()}`} />
              <Legend />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showExpenseModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '460px', width: '100%', padding: '28px', backgroundColor: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Log Expense</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setShowExpenseModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleAddExpense}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={newExp.category} onChange={e => setNewExp({ ...newExp, category: e.target.value as any })}>
                  <option value="seeds">Seeds (बीज)</option>
                  <option value="fertilizer">Fertilizer (खाद)</option>
                  <option value="labour">Labour (मजदूरी)</option>
                  <option value="irrigation">Irrigation (सिंचाई)</option>
                  <option value="equipment">Equipment Rental</option>
                  <option value="transport">Transport</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" className="form-input" value={newExp.amount} onChange={e => setNewExp({ ...newExp, amount: Number(e.target.value) })} required />
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <input type="text" className="form-input" value={newExp.notes} onChange={e => setNewExp({ ...newExp, notes: e.target.value })} required />
              </div>

              <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '12px' }}>
                <span>Save Expense Record</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
