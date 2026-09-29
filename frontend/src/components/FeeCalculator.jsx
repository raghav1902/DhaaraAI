import React, { useState } from 'react';
import { Calculator, MapPin, Building, Landmark, AlertCircle, FileText, IndianRupee, Car, ShoppingCart } from 'lucide-react';

import { STAMP_DUTY_RATES, TRAFFIC_VIOLATIONS } from '../data/feeCalculatorData';
import './FeeCalculator.css';

export default function FeeCalculator({ language = 'English' }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [calcType, setCalcType] = useState('property'); // 'property', 'court', 'consumer', 'traffic'
  const [state, setState] = useState('Delhi');
  const [propertyValue, setPropertyValue] = useState('');
  const [buyerGender, setBuyerGender] = useState('male');

  const [suitValue, setSuitValue] = useState('');
  
  const [consumerValue, setConsumerValue] = useState('');
  const [selectedViolations, setSelectedViolations] = useState([]);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const renderPropertyCalc = () => {
    const val = Number(propertyValue) || 0;
    const rates = STAMP_DUTY_RATES[state] || STAMP_DUTY_RATES['Delhi'];
    const stampRate = rates[buyerGender] || rates['male'];
    const regRate = rates.registry;

    const stampDuty = (val * stampRate) / 100;
    const regFee = (val * regRate) / 100;
    const total = stampDuty + regFee;

    return (
      <div className="glass-panel fee-calculator__panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--text-main)' }}>
          {isHindi ? 'संपत्ति पंजीकरण और स्टाम्प ड्यूटी' : 'Property Registration & Stamp Duty'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              {isHindi ? 'राज्य चुनें' : 'Select State'}
            </label>
            <select className="input-field" value={state} onChange={e => setState(e.target.value)}>
              {Object.keys(STAMP_DUTY_RATES).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              {isHindi ? 'खरीदार का लिंग' : 'Buyer Gender (For Concessions)'}
            </label>
            <select className="input-field" value={buyerGender} onChange={e => setBuyerGender(e.target.value)}>
              <option value="male">{isHindi ? 'पुरुष' : 'Male'}</option>
              <option value="female">{isHindi ? 'महिला (छूट)' : 'Female (Concession)'}</option>
              <option value="joint">{isHindi ? 'संयुक्त (पति-पत्नी)' : 'Joint (Husband & Wife)'}</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
              {isHindi ? 'संपत्ति का बाजार मूल्य (₹)' : 'Property Market Value (₹)'}
            </label>
            <div style={{ position: 'relative' }}>
              <IndianRupee size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              <input
                type="number"
                className="input-field"
                value={propertyValue}
                onChange={e => setPropertyValue(e.target.value)}
                placeholder="e.g. 5000000"
                style={{ paddingLeft: '36px' }}
              />
            </div>
          </div>
        </div>

        {val > 0 && (
          <div style={{ background: 'var(--subtle-bg)', padding: '20px', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{isHindi ? 'स्टाम्प ड्यूटी' : 'Stamp Duty'} ({stampRate}%)</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{formatCurrency(stampDuty)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--card-border)' }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{isHindi ? 'पंजीकरण शुल्क' : 'Registration Fee'} ({regRate}%)</span>
              <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{formatCurrency(regFee)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#059669', fontSize: '15px', fontWeight: '700' }}>{isHindi ? 'कुल अनुमानित खर्च' : 'Total Estimated Cost'}</span>
              <span style={{ fontWeight: '800', color: '#059669', fontSize: '18px' }}>{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCourtCalc = () => {
    const val = Number(suitValue) || 0;
    // Simplified standard ad-valorem court fee calculation for civil suits (rough estimation for India)
    let courtFee = 0;
    if (val <= 100000) courtFee = val * 0.03;
    else if (val <= 500000) courtFee = 3000 + ((val - 100000) * 0.02);
    else courtFee = 11000 + ((val - 500000) * 0.01);

    // Cap at typical max
    if (courtFee > 300000) courtFee = 300000;

    return (
      <div className="glass-panel fee-calculator__panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--text-main)' }}>
          {isHindi ? 'दीवानी मुकदमा न्यायालय शुल्क' : 'Civil Suit Court Fee Estimation'}
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
            {isHindi ? 'दावा राशि / विवादित मूल्य (₹)' : 'Suit Claim Amount / Disputed Value (₹)'}
          </label>
          <div style={{ position: 'relative' }}>
            <IndianRupee size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input
              type="number"
              className="input-field"
              value={suitValue}
              onChange={e => setSuitValue(e.target.value)}
              placeholder="e.g. 1000000"
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        {val > 0 && (
          <div style={{ background: '#eff6ff', padding: '20px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#1e40af', fontSize: '15px', fontWeight: '700' }}>{isHindi ? 'अनुमानित न्यायालय शुल्क' : 'Estimated Ad-Valorem Court Fee'}</span>
              <span style={{ fontWeight: '800', color: '#1d4ed8', fontSize: '18px' }}>{formatCurrency(courtFee)}</span>
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '11px', color: '#3b82f6' }}>
              * {isHindi ? 'नोट: यह एक अनुमान है। वास्तविक शुल्क राज्य के न्याय अधिनियम के अनुसार भिन्न हो सकता है।' : 'Note: This is an estimation. Exact fees vary strictly by State Court Fee Acts.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  const renderConsumerCalc = () => {
    const val = Number(consumerValue) || 0;
    let fee = 0;
    
    if (val <= 500000) fee = 0;
    else if (val <= 1000000) fee = 200;
    else if (val <= 2000000) fee = 400;
    else if (val <= 5000000) fee = 1000;
    else if (val <= 10000000) fee = 2000;
    else if (val <= 20000000) fee = 2500;
    else if (val <= 40000000) fee = 3000;
    else if (val <= 60000000) fee = 4000;
    else if (val <= 80000000) fee = 5000;
    else if (val <= 100000000) fee = 6000;
    else fee = 7500;

    return (
      <div className="glass-panel fee-calculator__panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--text-main)' }}>
          {isHindi ? 'उपभोक्ता फोरम शिकायत शुल्क' : 'Consumer Court Filing Fee'}
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>
            {isHindi ? 'मुआवजे सहित कुल दावा राशि (₹)' : 'Total Claim Amount (₹)'}
          </label>
          <div style={{ position: 'relative' }}>
            <IndianRupee size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input
              type="number"
              className="input-field"
              value={consumerValue}
              onChange={e => setConsumerValue(e.target.value)}
              placeholder="e.g. 500000"
              style={{ paddingLeft: '36px' }}
            />
          </div>
        </div>

        {val > 0 && (
          <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#166534', fontSize: '15px', fontWeight: '700' }}>{isHindi ? 'फाइलिंग शुल्क' : 'Filing Fee'}</span>
              <span style={{ fontWeight: '800', color: '#15803d', fontSize: '18px' }}>
                {fee === 0 ? (isHindi ? 'निःशुल्क (Nil)' : 'Free (Nil)') : formatCurrency(fee)}
              </span>
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '11px', color: '#22c55e' }}>
              * {isHindi ? '2024 के नियमों के अनुसार ₹5 लाख तक के दावों पर कोई शुल्क नहीं है।' : 'As per 2024 rules, no fee is applicable for claims up to ₹5 Lakhs.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  const handleViolationChange = (id) => {
    if (selectedViolations.includes(id)) {
      setSelectedViolations(selectedViolations.filter(v => v !== id));
    } else {
      setSelectedViolations([...selectedViolations, id]);
    }
  };

  const renderTrafficCalc = () => {
    const totalFine = selectedViolations.reduce((sum, id) => {
      const v = TRAFFIC_VIOLATIONS.find(x => x.id === id);
      return sum + (v ? v.fine : 0);
    }, 0);

    return (
      <div className="glass-panel fee-calculator__panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: 'var(--text-main)' }}>
          {isHindi ? 'यातायात चालान जुर्माना' : 'Traffic Challan Fines (MV Act 2024)'}
        </h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)', marginBottom: '12px', display: 'block' }}>
            {isHindi ? 'उल्लंघन चुनें (एक से अधिक चुन सकते हैं)' : 'Select Violations (Multiple allowed)'}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {TRAFFIC_VIOLATIONS.map(v => (
              <label key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px', background: selectedViolations.includes(v.id) ? 'rgba(239, 68, 68, 0.12)' : 'var(--subtle-bg)', border: `1px solid ${selectedViolations.includes(v.id) ? 'rgba(239, 68, 68, 0.3)' : 'var(--card-border)'}`, borderRadius: '8px', transition: 'all 0.2s ease' }}>
                <input 
                  type="checkbox" 
                  checked={selectedViolations.includes(v.id)}
                  onChange={() => handleViolationChange(v.id)}
                  style={{ width: '16px', height: '16px', accentColor: '#ef4444' }}
                />
                <div style={{ flex: 1, fontSize: '14px', color: 'var(--text-main)' }}>
                  {isHindi ? v.labelHi : v.labelEn}
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#ef4444' }}>
                  {formatCurrency(v.fine)}
                </div>
              </label>
            ))}
          </div>
        </div>

        {totalFine > 0 && (
          <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '12px', border: '1px solid #fecaca' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#991b1b', fontSize: '15px', fontWeight: '700' }}>{isHindi ? 'कुल अनुमानित जुर्माना' : 'Total Estimated Fine'}</span>
              <span style={{ fontWeight: '800', color: '#b91c1c', fontSize: '18px' }}>{formatCurrency(totalFine)}</span>
            </div>
            <p style={{ margin: '10px 0 0', fontSize: '11px', color: '#ef4444' }}>
              * {isHindi ? 'जुर्माना राशि राज्य और अपराध की गंभीरता के अनुसार भिन्न हो सकती है।' : 'Fine amount may vary slightly by state or gravity of offence.'}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fee-calculator" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="fee-calculator__header" style={{
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #d97706, #b45309)',
          padding: '10px',
          borderRadius: '12px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.2)'
        }}>
          <Calculator size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              {isHindi ? 'न्यायालय शुल्क और स्टाम्प ड्यूटी कैलकुलेटर' : 'Court Fee & Stamp Duty Calculator'}
            </h2>
            <span style={{ fontSize: '11px', background: 'rgba(217, 119, 6, 0.15)', color: '#d97706', border: '1px solid rgba(217, 119, 6, 0.3)', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
              Statutory Schedule
            </span>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            {isHindi
              ? 'नवीनतम दरों के आधार पर अपनी संपत्ति, न्यायालय, या यातायात जुर्माने के खर्चों का अनुमान लगाएं।'
              : 'Estimate your legal costs, court fees, or traffic fines based on the latest statutory rates.'}
          </p>
        </div>
      </div>

      <div className="fee-calculator__types" style={{ marginTop: '4px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
          <button
            type="button"
            onClick={() => setCalcType('property')}
            style={{
              padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: calcType === 'property' ? '#eab308' : 'rgba(234, 179, 8, 0.1)',
              color: calcType === 'property' ? 'white' : '#ca8a04',
              border: calcType === 'property' ? 'none' : '1px solid rgba(234, 179, 8, 0.3)'
            }}
          >
            <Building size={16} /> {isHindi ? 'संपत्ति' : 'Property'}
          </button>
          <button
            type="button"
            onClick={() => setCalcType('court')}
            style={{
              padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: calcType === 'court' ? '#eab308' : 'rgba(234, 179, 8, 0.1)',
              color: calcType === 'court' ? 'white' : '#ca8a04',
              border: calcType === 'court' ? 'none' : '1px solid rgba(234, 179, 8, 0.3)'
            }}
          >
            <Landmark size={16} /> {isHindi ? 'दीवानी' : 'Civil Court'}
          </button>
          <button
            type="button"
            onClick={() => setCalcType('consumer')}
            style={{
              padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: calcType === 'consumer' ? '#eab308' : 'rgba(234, 179, 8, 0.1)',
              color: calcType === 'consumer' ? 'white' : '#ca8a04',
              border: calcType === 'consumer' ? 'none' : '1px solid rgba(234, 179, 8, 0.3)'
            }}
          >
            <ShoppingCart size={16} /> {isHindi ? 'उपभोक्ता' : 'Consumer'}
          </button>
          <button
            type="button"
            onClick={() => setCalcType('traffic')}
            style={{
              padding: '10px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              background: calcType === 'traffic' ? '#eab308' : 'rgba(234, 179, 8, 0.1)',
              color: calcType === 'traffic' ? 'white' : '#ca8a04',
              border: calcType === 'traffic' ? 'none' : '1px solid rgba(234, 179, 8, 0.3)'
            }}
          >
            <Car size={16} /> {isHindi ? 'चालान' : 'Traffic'}
          </button>
        </div>

      {calcType === 'property' && renderPropertyCalc()}
      {calcType === 'court' && renderCourtCalc()}
      {calcType === 'consumer' && renderConsumerCalc()}
      {calcType === 'traffic' && renderTrafficCalc()}
    </div>
  );
}
