import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../../../contexts/LanguageContext';
import { useData } from '../../../contexts/DataContext';
import type { Farm } from '../../../types';
import { ArrowRight, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OnboardingPageProps {
  onComplete?: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { currentUser, completeOnboarding } = useAuth();
  const { t, language, setLanguage, openLanguageModal, currentMeta } = useLanguage();
  const { addFarm, addCropCycle } = useData();

  const [step, setStep] = useState<number>(1);

  const [personal, setPersonal] = useState({
    name: currentUser.name || 'Rajesh Kumar Patel',
    phone: currentUser.phone || '+91 98765 43210',
    email: currentUser.email || 'rajesh.patel@agrinext.in',
    state: currentUser.state || 'Rajasthan',
    district: currentUser.district || 'Jaipur',
    village: currentUser.village || 'Jagatpura (VGU)',
  });

  const [farm, setFarm] = useState({
    name: 'Ganga Yamuna Green Farm',
    area: 4.5,
    unit: 'acres' as Farm['unit'],
    soilType: 'Alluvial' as Farm['soilType'],
    irrigation: 'Borewell' as Farm['irrigation'],
    farmingType: 'Conventional' as Farm['farmingType'],
  });

  const [crop, setCrop] = useState({
    currentCrop: 'Wheat',
    variety: 'HD 2967',
    previousCrop: 'Paddy',
    expectedHarvest: '2026-04-15',
  });

  const [prefs, setPrefs] = useState({
    language: language,
    weatherAlerts: true,
    mandiAlerts: true,
  });

  const handleFinish = () => {
    completeOnboarding({
      name: personal.name,
      phone: personal.phone,
      email: personal.email,
      state: personal.state,
      district: personal.district,
      village: personal.village,
      language: prefs.language,
    });

    const createdFarmId = `farm-onboard-${Date.now()}`;
    addFarm({
      farmerId: currentUser.id,
      name: farm.name,
      location: `${personal.village}, ${personal.district}`,
      area: Number(farm.area),
      unit: farm.unit,
      soilType: farm.soilType,
      irrigation: farm.irrigation,
      farmingType: farm.farmingType,
      crops: [crop.currentCrop],
    });

    addCropCycle({
      farmId: createdFarmId,
      farmName: farm.name,
      cropName: crop.currentCrop,
      variety: crop.variety,
      status: 'growing',
      sowingDate: new Date().toISOString().split('T')[0],
      expectedHarvestDate: crop.expectedHarvest,
    });

    if (onComplete) {
      onComplete();
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--slate-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div className="card" style={{ maxWidth: '680px', width: '100%', padding: '36px', backgroundColor: '#ffffff', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', borderBottom: '1px solid var(--slate-200)', paddingBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AGRINEXT ONBOARDING
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--slate-900)' }}>
              {step === 1 && t('onboardingStep1')}
              {step === 2 && t('onboardingStep2')}
              {step === 3 && t('onboardingStep3')}
              {step === 4 && t('onboardingStep4')}
            </h2>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '4px 12px', borderRadius: '999px' }}>
            Step {step} of 4
          </span>
        </div>

        {step === 1 && (
          <div>
            <div className="form-group">
              <label className="form-label">{t('fullName')}</label>
              <input type="text" className="form-input" value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{t('mobileNumber')}</label>
                <input type="text" className="form-input" value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('emailAddress')}</label>
                <input type="email" className="form-input" value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">{t('state')}</label>
                <select className="form-select" value={personal.state} onChange={(e) => setPersonal({ ...personal, state: e.target.value })}>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('district')}</label>
                <input type="text" className="form-input" value={personal.district} onChange={(e) => setPersonal({ ...personal, district: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('village')}</label>
                <input type="text" className="form-input" value={personal.village} onChange={(e) => setPersonal({ ...personal, village: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="form-group">
              <label className="form-label">{t('farmName')}</label>
              <input type="text" className="form-input" value={farm.name} onChange={(e) => setFarm({ ...farm, name: e.target.value })} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{t('farmArea')}</label>
                <input type="number" className="form-input" value={farm.area} onChange={(e) => setFarm({ ...farm, area: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label className="form-label">{t('unit')}</label>
                <select className="form-select" value={farm.unit} onChange={(e) => setFarm({ ...farm, unit: e.target.value as any })}>
                  <option value="acres">Acres</option>
                  <option value="bigha">Bigha</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{t('soilType')}</label>
                <select className="form-select" value={farm.soilType} onChange={(e) => setFarm({ ...farm, soilType: e.target.value as any })}>
                  <option value="Alluvial">Alluvial (जलोढ़)</option>
                  <option value="Black">Black Soil (काली मिट्टी)</option>
                  <option value="Red">Red Soil (लाल मिट्टी)</option>
                  <option value="Sandy">Sandy (रेतीली)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">{t('irrigationType')}</label>
                <select className="form-select" value={farm.irrigation} onChange={(e) => setFarm({ ...farm, irrigation: e.target.value as any })}>
                  <option value="Borewell">Tube-well / Borewell</option>
                  <option value="Canal">Canal (नहर)</option>
                  <option value="Drip">Drip Irrigation</option>
                  <option value="Rainfed">Rainfed (वर्षा आधारित)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{t('currentCrop')}</label>
                <select className="form-select" value={crop.currentCrop} onChange={(e) => setCrop({ ...crop, currentCrop: e.target.value })}>
                  <option value="Wheat">Wheat (गेहूं)</option>
                  <option value="Mustard">Mustard (सरसों)</option>
                  <option value="Paddy">Paddy (धान)</option>
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Potato">Potato (आलू)</option>
                  <option value="Cotton">Cotton (कपास)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Crop Variety (किस्म)</label>
                <input type="text" className="form-input" value={crop.variety} onChange={(e) => setCrop({ ...crop, variety: e.target.value })} placeholder="e.g. HD 2967" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">{t('previousCrop')}</label>
                <input type="text" className="form-input" value={crop.previousCrop} onChange={(e) => setCrop({ ...crop, previousCrop: e.target.value })} />
              </div>

              <div className="form-group">
                <label className="form-label">{t('expectedHarvest')}</label>
                <input type="date" className="form-input" value={crop.expectedHarvest} onChange={(e) => setCrop({ ...crop, expectedHarvest: e.target.value })} />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <div className="form-group">
              <label className="form-label">{t('chooseLanguage', 'Preferred Platform Language')}</label>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                    {currentMeta.nativeName} ({currentMeta.name})
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {currentMeta.region} • {currentMeta.dir === 'rtl' ? 'RTL' : 'LTR'}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={openLanguageModal}
                  style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                >
                  {t('changeLanguage', 'Change Language')}
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: '16px', backgroundColor: 'var(--primary-50)', borderColor: 'var(--primary-200, #a7f3d0)', margin: '20px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary-800)', fontWeight: '700' }}>
                <ShieldCheck size={20} />
                <span>Farmer Privacy Guarantee</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--slate-600)', marginTop: '4px' }}>
                Your farm coordinates and personal mobile details remain strictly private. Data is only used to compute hyper-local weather alerts and mandi insights.
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', borderTop: '1px solid var(--slate-200)', paddingTop: '20px' }}>
          {step > 1 ? (
            <button className="btn btn-secondary" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
              <span>Next Step</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button className="btn btn-accent" onClick={handleFinish} style={{ padding: '12px 28px' }}>
              <CheckCircle size={18} />
              <span>Enter AGRINEXT Platform</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
