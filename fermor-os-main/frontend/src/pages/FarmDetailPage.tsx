import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Sprout,
  ArrowLeft,
  MapPin,
  Wheat,
  Droplets,
  Layers,
  Calendar,
  CheckCircle,
  Plus,
  Activity,
  AlertTriangle,
} from 'lucide-react';

export const FarmDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { farms, cropCycles, tasks, addTask } = useData();
  const { language } = useLanguage();

  const farm = farms.find((f) => f.id === id) || farms[0];
  const assignedCrops = cropCycles.filter((c) => c.farmId === id || c.farmName === farm?.name);
  const assignedTasks = tasks.filter((t) => t.farmId === id);

  const [newTaskTitle, setNewTaskTitle] = useState('');

  if (!farm) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Farm Not Found</h2>
        <button className="btn btn-primary" onClick={() => navigate('/farms')} style={{ marginTop: '16px' }}>
          Back to Farms
        </button>
      </div>
    );
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      farmId: farm.id,
      title: newTaskTitle,
      category: 'irrigation',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
      completed: false,
    });
    setNewTaskTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Back Button & Title */}
      <div>
        <button
          onClick={() => navigate('/farms')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            border: 'none',
            background: 'transparent',
            color: '#059669',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '12px',
            fontSize: '0.88rem',
          }}
        >
          <ArrowLeft size={16} /> Back to Farms List
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>{farm.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
              <MapPin size={16} color="#059669" />
              <span>{farm.location}</span>
              <span>•</span>
              <span style={{ fontWeight: 700, color: '#059669' }}>
                {farm.area} {farm.unit}
              </span>
            </div>
          </div>
          <span style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '6px 14px', borderRadius: '999px', fontWeight: 700, fontSize: '0.85rem' }}>
            ● Status: Operational
          </span>
        </div>
      </div>

      {/* Farm Overview Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Soil Classification</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{farm.soilType}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>High organic carbon & moisture retention</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Irrigation Grid</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{farm.irrigation}</div>
          <div style={{ fontSize: '0.78rem', color: '#059669', marginTop: '2px' }}>92% Water delivery efficiency</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Farming Technique</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{farm.farmingType}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Zero synthetic residue protocol</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Active Telemetry</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>Real-time GPS</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>Lat: 22.7196, Lon: 75.8577</div>
        </div>
      </div>

      {/* Assigned Crops on this Farm */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wheat size={20} color="#d97706" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              Crop Cycles Assigned to {farm.name}
            </h3>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/crops')} style={{ padding: '5px 12px', fontSize: '0.82rem' }}>
            + Manage All Crops
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {assignedCrops.length > 0 ? (
            assignedCrops.map((crop) => (
              <div key={crop.id} style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>{crop.cropName}</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', backgroundColor: '#dcfce7', color: '#15803d' }}>
                    {crop.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Variety: <strong>{crop.variety}</strong></div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Sown: {crop.sowingDate} | Expected Harvest: {crop.expectedHarvestDate}
                </div>
                {crop.estimatedYieldKg && (
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', marginTop: '6px' }}>
                    Est. Yield: {crop.estimatedYieldKg} kg
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', gridColumn: '1 / -1' }}>
              No crop cycles currently logged for this parcel. Click "Manage All Crops" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Field Operations & Maintenance Tasks */}
      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          Plot Field Operations & Tasks
        </h3>

        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Add new task (e.g. Schedule nitrogen top-dressing)..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '9px 18px', borderRadius: '8px', fontWeight: 700 }}>
            <Plus size={16} /> Add Task
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {assignedTasks.length > 0 ? (
            assignedTasks.map((t) => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#334155' }}>{t.title}</div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', backgroundColor: '#fef3c7', padding: '2px 8px', borderRadius: '999px' }}>
                  {t.priority.toUpperCase()}
                </span>
              </div>
            ))
          ) : (
            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>No specific tasks recorded for this plot.</div>
          )}
        </div>
      </div>
    </div>
  );
};
