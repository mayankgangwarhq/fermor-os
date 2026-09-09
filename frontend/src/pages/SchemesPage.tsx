import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { DataBadge } from '../components/common/DataBadge';
import type { GovernmentScheme } from '../types';
import { ShieldCheck, CheckCircle2, ExternalLink, HelpCircle, Search, Filter, AlertCircle } from 'lucide-react';

export const SchemesPage: React.FC = () => {
  const { schemes } = useData();
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSchemeForChecker, setSelectedSchemeForChecker] = useState<GovernmentScheme | null>(null);

  const [landHolding, setLandHolding] = useState<number>(3.5);
  const [hasAadhaar, setHasAadhaar] = useState<boolean>(true);
  const [hasBankAcc, setHasBankAcc] = useState<boolean>(true);
  const [eligibilityResult, setEligibilityResult] = useState<boolean | null>(null);

  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.hindiName.includes(searchTerm) ||
                          s.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const checkEligibility = (scheme: GovernmentScheme) => {
    setSelectedSchemeForChecker(scheme);
    setEligibilityResult(null);
  };

  const handleRunCheck = () => {
    if (landHolding <= 5.0 && hasAadhaar && hasBankAcc) {
      setEligibilityResult(true);
    } else {
      setEligibilityResult(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div className="card" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary-600)', textTransform: 'uppercase' }}>AGRINEXT GOVT SCHEME FINDER</span>
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--slate-900)' }}>Government Schemes & Subsidies</h1>
        </div>
        <DataBadge status="VERIFIED DB" />
      </div>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={18} color="var(--slate-400)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
          <input
            type="text"
            className="form-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search scheme name (e.g. PM-KISAN, Fasal Bima, Solar Pump)..."
            style={{ paddingLeft: '40px' }}
          />
        </div>

        <div style={{ width: '200px' }}>
          <select className="form-select" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Farmer Welfare">Farmer Welfare</option>
            <option value="Crop Insurance">Crop Insurance</option>
            <option value="Solar">Solar & Irrigation</option>
            <option value="Equipment">Equipment Subsidies</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '24px' }}>
        {filteredSchemes.map(sch => (
          <div key={sch.id} className="card card-interactive" style={{ padding: '24px', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '4px 10px', borderRadius: '999px' }}>
                  {sch.category}
                </span>
                {sch.maxBenefitAmount && (
                  <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#16a34a' }}>
                    Benefit: {sch.maxBenefitAmount}
                  </span>
                )}
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--slate-900)' }}>
                {sch.name}
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)', fontWeight: '700', display: 'block', marginBottom: '12px' }}>
                {sch.hindiName}
              </span>

              <p style={{ fontSize: '0.85rem', color: 'var(--slate-700)', marginBottom: '16px', lineHeight: 1.4 }}>
                {sch.description}
              </p>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--slate-900)', marginBottom: '6px' }}>Key Eligibility:</div>
                <ul style={{ paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--slate-600)' }}>
                  {sch.eligibility.map((el, i) => <li key={i}>{el}</li>)}
                </ul>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--slate-200)', paddingTop: '16px' }}>
              <button className="btn btn-primary" onClick={() => checkEligibility(sch)} style={{ flex: 1, padding: '8px 12px', fontSize: '0.85rem' }}>
                <CheckCircle2 size={16} />
                <span>Check Eligibility</span>
              </button>

              <a href={sch.officialSource} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }} title="Official Govt Portal">
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {selectedSchemeForChecker && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '28px', backgroundColor: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Eligibility Checker: {selectedSchemeForChecker.name}</h3>
              <button style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={() => setSelectedSchemeForChecker(null)}>✕</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div className="form-group">
                <label className="form-label">Total Land Holding (Acres)</label>
                <input type="number" className="form-input" value={landHolding} onChange={e => setLandHolding(Number(e.target.value))} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Aadhaar Linked with Khatauni Land Record?</span>
                <input type="checkbox" checked={hasAadhaar} onChange={e => setHasAadhaar(e.target.checked)} style={{ accentColor: 'var(--primary-600)', width: '18px', height: '18px' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: 'var(--slate-50)', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Active DBTL Bank Account?</span>
                <input type="checkbox" checked={hasBankAcc} onChange={e => setHasBankAcc(e.target.checked)} style={{ accentColor: 'var(--primary-600)', width: '18px', height: '18px' }} />
              </div>
            </div>

            {eligibilityResult !== null && (
              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: eligibilityResult ? '#dcfce7' : '#fee2e2',
                  color: eligibilityResult ? '#166534' : '#991b1b',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <ShieldCheck size={24} />
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>
                    {eligibilityResult ? 'YOU ARE ELIGIBLE!' : 'ADDITIONAL VERIFICATION NEEDED'}
                  </div>
                  <div style={{ fontSize: '0.8rem', marginTop: '2px' }}>
                    {eligibilityResult 
                      ? `You fulfill criteria for ${selectedSchemeForChecker.name}. Required docs: ${selectedSchemeForChecker.requiredDocs.join(', ')}.`
                      : 'Please verify land records or Aadhaar linkage at your nearest CSC office.'}
                  </div>
                </div>
              </div>
            )}

            <button className="btn btn-primary" onClick={handleRunCheck} style={{ width: '100%', padding: '12px' }}>
              <span>Verify Eligibility Now</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
