import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import type { Farm, CropCycle, FarmTask, CropStatus } from '../types';
import { Sprout, Plus, Calendar, CheckSquare, Layers, MapPin, Trash2, CheckCircle2, ChevronRight, X } from 'lucide-react';

export const FarmManagementPage: React.FC = () => {
  const { farms, addFarm, cropCycles, addCropCycle, updateCropStatus, tasks, addTask, toggleTask, deleteTask } = useData();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'farms' | 'crops' | 'tasks'>('crops');
  
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [showAddCropModal, setShowAddCropModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const [newFarm, setNewFarm] = useState({
    name: 'Ganga Yamuna Green Farm',
    location: 'Jagatpura (VGU), Jaipur',
    area: 4.5,
    unit: 'acres' as Farm['unit'],
    soilType: 'Alluvial' as Farm['soilType'],
    irrigation: 'Borewell' as Farm['irrigation'],
    farmingType: 'Conventional' as Farm['farmingType']
  });

  const [newCrop, setNewCrop] = useState({
    farmId: farms[0]?.id || 'farm-1',
    cropName: 'Wheat',
    variety: 'HD 2967',
    status: 'growing' as CropStatus,
    sowingDate: '2025-11-15',
    expectedHarvestDate: '2026-04-15',
    estimatedYieldKg: 4500
  });

  const [newTask, setNewTask] = useState({
    farmId: farms[0]?.id || 'farm-1',
    title: 'Foliar Spray of Propiconazole for Rust Prevention',
    category: 'inspection' as FarmTask['category'],
    dueDate: '2026-02-25',
    priority: 'high' as FarmTask['priority'],
    notes: 'Apply @ 1 ml/Liter water before forecasted showers.'
  });

  const handleCreateFarm = (e: React.FormEvent) => {
    e.preventDefault();
    addFarm({
      farmerId: currentUser.id,
      name: newFarm.name,
      location: newFarm.location,
      area: Number(newFarm.area),
      unit: newFarm.unit,
      soilType: newFarm.soilType,
      irrigation: newFarm.irrigation,
      farmingType: newFarm.farmingType,
      crops: [newCrop.cropName]
    });
    setShowAddFarmModal(false);
  };

  const handleCreateCrop = (e: React.FormEvent) => {
    e.preventDefault();
    const targetFarm = farms.find(f => f.id === newCrop.farmId) || farms[0];
    addCropCycle({
      farmId: newCrop.farmId,
      farmName: targetFarm ? targetFarm.name : 'Primary Farm',
      cropName: newCrop.cropName,
      variety: newCrop.variety,
      status: newCrop.status,
      sowingDate: newCrop.sowingDate,
      expectedHarvestDate: newCrop.expectedHarvestDate,
      estimatedYieldKg: Number(newCrop.estimatedYieldKg)
    });
    setShowAddCropModal(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      farmId: newTask.farmId,
      title: newTask.title,
      category: newTask.category,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      completed: false,
      notes: newTask.notes
    });
    setShowAddTaskModal(false);
  };

  const lifecycleStages: CropStatus[] = ['planned', 'sown', 'growing', 'harvest_ready', 'harvested', 'sold'];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase' }}>FARM OPERATIONS & LIFECYCLE MANAGEMENT</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)' }}>Farm & Crop Management</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => setShowAddFarmModal(true)}>
            <Plus size={16} />
            <span>Add Farm</span>
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddCropModal(true)}>
            <Sprout size={16} />
            <span>Add Crop Cycle</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--slate-200)' }}>
        <button
          className={`btn ${activeTab === 'crops' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('crops')}
          style={{ borderRadius: 0, padding: '12px 24px' }}
        >
          <Sprout size={18} />
          <span>Active Crop Cycles ({cropCycles.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('tasks')}
          style={{ borderRadius: 0, padding: '12px 24px' }}
        >
          <CheckSquare size={18} />
          <span>Task Scheduler ({tasks.length})</span>
        </button>

        <button
          className={`btn ${activeTab === 'farms' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('farms')}
          style={{ borderRadius: 0, padding: '12px 24px' }}
        >
          <Layers size={18} />
          <span>My Farms ({farms.length})</span>
        </button>
      </div>

      {activeTab === 'crops' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cropCycles.map(crop => (
            <div key={crop.id} className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-700)', fontWeight: '700' }}>{crop.farmName}</span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                    {crop.cropName} ({crop.variety})
                  </h3>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '600' }}>Update Stage:</span>
                  <select
                    className="form-select"
                    value={crop.status}
                    onChange={e => updateCropStatus(crop.id, e.target.value as CropStatus)}
                    style={{ width: '160px', padding: '6px 10px', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    <option value="planned">Planned</option>
                    <option value="sown">Sown</option>
                    <option value="growing">Growing</option>
                    <option value="harvest_ready">Harvest Ready</option>
                    <option value="harvested">Harvested</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Lifecycle Progress
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
                  {lifecycleStages.map((stg, idx) => {
                    const currentIndex = lifecycleStages.indexOf(crop.status);
                    const isPassed = idx <= currentIndex;
                    const isCurrent = idx === currentIndex;
                    return (
                      <React.Fragment key={stg}>
                        <div
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: isCurrent ? 'var(--primary-600)' : isPassed ? 'var(--primary-100)' : 'var(--slate-100)',
                            color: isCurrent ? '#ffffff' : isPassed ? 'var(--primary-900)' : 'var(--slate-500)',
                            fontWeight: isCurrent || isPassed ? '700' : '500',
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                            textTransform: 'capitalize'
                          }}
                        >
                          {stg.replace('_', ' ')}
                        </div>
                        {idx < lifecycleStages.length - 1 && (
                          <ChevronRight size={14} color="var(--slate-400)" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', padding: '14px', backgroundColor: 'var(--slate-50)', borderRadius: '12px', fontSize: '0.85rem' }}>
                <div>Sowing Date: <b>{crop.sowingDate}</b></div>
                <div>Est. Harvest: <b>{crop.expectedHarvestDate}</b></div>
                <div>Est. Yield: <b>{crop.estimatedYieldKg || 4000} Kg</b></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Farm Task Scheduler</h3>
            <button className="btn btn-primary" onClick={() => setShowAddTaskModal(true)} style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
              <Plus size={16} />
              <span>Add Task</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.map(t => (
              <div
                key={t.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid var(--slate-200)',
                  backgroundColor: t.completed ? 'var(--slate-50)' : '#ffffff',
                  opacity: t.completed ? 0.7 : 1
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTask(t.id)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary-600)', cursor: 'pointer' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: '700', textDecoration: t.completed ? 'line-through' : 'none', color: 'var(--slate-900)' }}>
                      {t.title}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', display: 'flex', gap: '12px', marginTop: '2px' }}>
                      <span>Due: <b>{t.dueDate}</b></span>
                      <span>Category: <b>{t.category}</b></span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', backgroundColor: t.priority === 'high' ? '#fee2e2' : '#fef3c7', color: t.priority === 'high' ? '#dc2626' : '#b45309' }}>
                    {t.priority.toUpperCase()}
                  </span>
                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--slate-400)' }} onClick={() => deleteTask(t.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'farms' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {farms.map(f => (
            <div key={f.id} className="card" style={{ padding: '24px', backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--slate-900)', marginBottom: '4px' }}>{f.name}</h3>
              <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                <MapPin size={14} />
                <span>{f.location}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem', backgroundColor: 'var(--slate-50)', padding: '12px', borderRadius: '10px' }}>
                <div>Area: <b>{f.area} {f.unit}</b></div>
                <div>Soil: <b>{f.soilType}</b></div>
                <div>Irrigation: <b>{f.irrigation}</b></div>
                <div>Type: <b>{f.farmingType}</b></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddCropModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '28px', backgroundColor: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Add Crop Cycle</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setShowAddCropModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateCrop}>
              <div className="form-group">
                <label className="form-label">Crop Name</label>
                <input type="text" className="form-input" value={newCrop.cropName} onChange={e => setNewCrop({ ...newCrop, cropName: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Variety</label>
                <input type="text" className="form-input" value={newCrop.variety} onChange={e => setNewCrop({ ...newCrop, variety: e.target.value })} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Sowing Date</label>
                  <input type="date" className="form-input" value={newCrop.sowingDate} onChange={e => setNewCrop({ ...newCrop, sowingDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Expected Harvest</label>
                  <input type="date" className="form-input" value={newCrop.expectedHarvestDate} onChange={e => setNewCrop({ ...newCrop, expectedHarvestDate: e.target.value })} required />
                </div>
              </div>
              <button className="btn btn-primary" type="submit" style={{ width: '100%', padding: '12px' }}>
                <span>Create Crop Cycle</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
