import React, { useState } from 'react';
import { STAMP_DUTY_RATES } from '../../data/feeCalculatorData';
import ProFeatureLock from '../ProFeatureLock';
import StatutoryReceipt, { formatCurrency } from './StatutoryReceipt';
import RupeeInputField from './RupeeInputField';
import { STATUTORY_CEILINGS } from './currencyValidation';

export default function PropertyTab({ isHindi, isPro, onNavigateTab, onOpenUpgradeModal }) {
  const [state, setState] = useState('Delhi');
  const [declaredValuation, setDeclaredValuation] = useState('');
  const [circleRateValuation, setCircleRateValuation] = useState('');
  const [buyerGender, setBuyerGender] = useState('male');
  const [propertyAreaType, setPropertyAreaType] = useState('urban');
  const [propertyStatus, setPropertyStatus] = useState('resale');
  const [isAffordableHousing, setIsAffordableHousing] = useState(false);

  const declared = Number(declaredValuation) || 0;
  const circle = Number(circleRateValuation) || 0;
  const taxableVal = Math.max(declared, circle);
  const rates = STAMP_DUTY_RATES[state] || STAMP_DUTY_RATES['Delhi'];

  const baseStampRate = rates[buyerGender] || rates['male'];
  const regRate = rates.registry;

  const stampDuty = (taxableVal * baseStampRate) / 100;
  const metroCessRate = propertyAreaType === 'urban' ? rates.metroCess : 0;
  const metroCessAmount = (taxableVal * metroCessRate) / 100;

  let registrationFee = (taxableVal * regRate) / 100;
  if (rates.ceilingReg && registrationFee > rates.ceilingReg) {
    registrationFee = rates.ceilingReg;
  }

  const tdsApplicable = taxableVal >= 5000000;
  const tdsAmount = tdsApplicable ? (taxableVal * 0.01) : 0;

  let gstRate = 0;
  if (propertyStatus === 'under_construction') {
    gstRate = isAffordableHousing ? 1 : 5;
  }
  const gstAmount = (taxableVal * gstRate) / 100;

  const totalGovtOutflow = stampDuty + metroCessAmount + registrationFee + gstAmount;
  const grandTotalWithTDS = totalGovtOutflow + tdsAmount;

  const receiptText = `════ DHAARAAI PROPERTY REGISTRATION ASSESSMENT ════
Jurisdiction: ${state} (${propertyAreaType.toUpperCase()})
Property Type: ${propertyStatus.replace('_', ' ').toUpperCase()}
Buyer Category: ${buyerGender.toUpperCase()}
Declared Consideration: ${formatCurrency(declared)}
Circle Rate Valuation: ${formatCurrency(circle)}
Effective Taxable Base (Sec 50C): ${formatCurrency(taxableVal)}
--------------------------------------------------
1. Stamp Duty (${baseStampRate}%): ${formatCurrency(stampDuty)}
2. Metro/ULB Cess (${metroCessRate}%): ${formatCurrency(metroCessAmount)}
3. Registration Fee (${regRate}%${rates.ceilingReg ? ' capped' : ''}): ${formatCurrency(registrationFee)}
4. GST (${gstRate}% on under-construction): ${formatCurrency(gstAmount)}
TOTAL STATUTORY GOVT OUTFLOW: ${formatCurrency(totalGovtOutflow)}
5. Sec 194-IA TDS Deductible (1% if ≥ ₹50L): ${formatCurrency(tdsAmount)}
GRAND ACQUISITION DEDUCTION: ${formatCurrency(grandTotalWithTDS)}
*Evaluated under Indian Stamp Act 1899 & State Registration Rules.`;

  return (
    <div className="fee-calculator__panel animate-fade-in" style={{ position: 'relative' }}>
      {!isPro && (
        <ProFeatureLock
          isHindi={isHindi}
          title={isHindi ? 'संपत्ति पंजीकरण व स्टाम्प स्टूडियो अनलॉक करें' : 'Unlock Property & Conveyance Studio'}
          description={
            isHindi
              ? 'सर्कल रेट vs बाजार मूल्य, धारा 50C, धारा 194-IA TDS और GST की जटिल गणनाएं DhaaraAI Plus में उपलब्ध हैं।'
              : 'Advanced Section 50C Circle Rate assessment, Section 194-IA TDS, and GST calculations require DhaaraAI Plus.'
          }
          onUpgradeClick={() => {
            if (onOpenUpgradeModal) onOpenUpgradeModal('Property & Conveyance Calculator');
            else if (onNavigateTab) onNavigateTab('settings');
          }}
        />
      )}
      <div className="fee-calculator__panel-form">
        <div className="fee-calc__header-group">
          <h3 className="fee-calculator__panel-title">
            {isHindi ? 'संपत्ति पंजीकरण, स्टाम्प ड्यूटी एवं टैक्स विश्लेषण' : 'Advanced Property & Conveyance Studio'}
          </h3>
          <p className="fee-calc__section-desc">
            {isHindi
              ? 'सर्कल दर vs बाजार मूल्य तुलना, धारा 50C, धारा 194-IA TDS और GST सहित पूर्ण विश्लेषण'
              : 'Full statutory assessment with Circle Rate vs Market consideration (Sec 50C), TDS (Sec 194-IA), and GST.'}
          </p>
        </div>

        <div className="fee-calculator__form-grid">
          <div className="form-group">
            <label className="form-label">{isHindi ? 'राज्य / क्षेत्राधिकार' : 'State / Registration Jurisdiction'}</label>
            <select className="input-field" value={state} onChange={(e) => setState(e.target.value)}>
              {Object.keys(STAMP_DUTY_RATES).map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{isHindi ? 'खरीदार वर्ग' : 'Buyer Ownership Category'}</label>
            <select className="input-field" value={buyerGender} onChange={(e) => setBuyerGender(e.target.value)}>
              <option value="male">{isHindi ? 'पुरुष (General Rate)' : 'Male (Standard Rate)'}</option>
              <option value="female">{isHindi ? 'महिला (Female Rebate)' : 'Female (Concession Rate)'}</option>
              <option value="joint">{isHindi ? 'संयुक्त (Joint Male+Female)' : 'Joint (Male + Female)'}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prop-declared-val">
              {isHindi ? 'घोषित सौदा मूल्य (₹)' : 'Agreed Transaction Value (₹)'}
            </label>
            <RupeeInputField
              id="prop-declared-val"
              value={declaredValuation}
              onChange={setDeclaredValuation}
              placeholder="e.g. 6000000"
              max={STATUTORY_CEILINGS.property}
              isHindi={isHindi}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="prop-circle-val">
              {isHindi ? 'सर्कल रेट न्यूनतम मूल्यांकन (₹)' : 'Govt Circle Rate Valuation (₹)'}
            </label>
            <RupeeInputField
              id="prop-circle-val"
              value={circleRateValuation}
              onChange={setCircleRateValuation}
              placeholder="e.g. 5500000"
              max={STATUTORY_CEILINGS.property}
              isHindi={isHindi}
            />
          </div>

          <div className="form-group">
            <label className="form-label">{isHindi ? 'संपत्ति का प्रकार' : 'Property Construction Stage'}</label>
            <select className="input-field" value={propertyStatus} onChange={(e) => setPropertyStatus(e.target.value)}>
              <option value="resale">{isHindi ? 'तैयार / पुनर्विक्रय (Ready / Resale - 0% GST)' : 'Ready to Move / Resale (No GST)'}</option>
              <option value="under_construction">{isHindi ? 'निर्माणाधीन (Under Construction - GST Applicable)' : 'Under Construction (GST Payable)'}</option>
              <option value="plot">{isHindi ? 'खाली भूखंड (Residential / Commercial Plot)' : 'Plot / Land Only'}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{isHindi ? 'क्षेत्र का वर्गीकरण' : 'Area Classification'}</label>
            <select className="input-field" value={propertyAreaType} onChange={(e) => setPropertyAreaType(e.target.value)}>
              <option value="urban">{isHindi ? 'शहरी / नगर निगम (Metro / Urban)' : 'Urban / Municipal Corporation'}</option>
              <option value="rural">{isHindi ? 'ग्रामीण / ग्राम पंचायत (Rural / Gram Panchayat)' : 'Rural / Gram Panchayat (No Metro Cess)'}</option>
            </select>
          </div>
        </div>

        {propertyStatus === 'under_construction' && (
          <div className="fee-calc__check-row animate-fade-in">
            <label className="fee-calc__checkbox-label">
              <input
                type="checkbox"
                checked={isAffordableHousing}
                onChange={(e) => setIsAffordableHousing(e.target.checked)}
              />
              <span>{isHindi ? 'किफायती आवास योजना (Affordable Housing - 1% GST vs 5% GST)' : 'Affordable Housing Scheme (Reduces GST from 5% to 1%)'}</span>
            </label>
          </div>
        )}

        {taxableVal > 0 && (
          <div className="fee-calc__rate-chips">
            <span className="fee-calc__rate-chip">Stamp Duty: {baseStampRate}%</span>
            {metroCessRate > 0 && <span className="fee-calc__rate-chip">Metro Cess: {metroCessRate}%</span>}
            <span className="fee-calc__rate-chip">Registry: {regRate}%{rates.ceilingReg ? ` (Cap ₹${rates.ceilingReg.toLocaleString()})` : ''}</span>
            {buyerGender === 'female' && <span className="fee-calc__rate-chip is-green">Female Concession Active</span>}
            {tdsApplicable && <span className="fee-calc__rate-chip is-warning">Sec 194-IA (1% TDS Mandatory)</span>}
            {circle > declared && declared > 0 && (
              <span className="fee-calc__rate-chip is-danger">Sec 50C: Circle Rate applied (Deficit ₹{formatCurrency(circle - declared)})</span>
            )}
          </div>
        )}
      </div>

      <StatutoryReceipt
        documentTitle={isHindi ? 'स्टाम्प ड्यूटी एवं विधिक पंजीयन मूल्यांकन' : 'STATUTORY CONVEYANCE & STAMP ASSESSMENT'}
        scheduleCode="INDIAN STAMP ACT 1899 & REGISTRATION ACT 1908"
        subTitle={isHindi ? 'उप-निबंधक कार्यालय विधिक रिपोर्ट' : 'Department of Revenue & Sub-Registrar Audit'}
        jurisdictionLabel={isHindi ? 'राज्य / क्षेत्र' : 'Jurisdiction & Zone'}
        jurisdictionVal={`${state} (${propertyAreaType.toUpperCase()})`}
        valuationLabel={isHindi ? 'मूल्यांकन आधार (Sec 50C)' : 'Statutory Assessment Base'}
        valuationVal={taxableVal}
        lines={[
          { label: `Stamp Duty (${baseStampRate}%)`, value: formatCurrency(stampDuty) },
          { label: `Urban Development / Metro Cess (${metroCessRate}%)`, value: formatCurrency(metroCessAmount) },
          { label: `Registration Fee (${regRate}%)${rates.ceilingReg ? ' (State Capped)' : ''}`, value: formatCurrency(registrationFee) },
          { label: `GST (${gstRate}% - ${propertyStatus === 'under_construction' ? (isAffordableHousing ? 'Affordable' : 'Standard') : 'Exempt'})`, value: formatCurrency(gstAmount) },
          { label: `Section 194-IA TDS Deductible (1% on ≥ ₹50L)`, value: tdsApplicable ? formatCurrency(tdsAmount) : 'Not Applicable (< ₹50L)', highlight: tdsApplicable, warn: tdsApplicable }
        ]}
        totalVal={grandTotalWithTDS}
        isCalculated={taxableVal > 0}
        emptyPrompt={isHindi ? 'संपत्ति का मूल्य या सर्कल रेट दर्ज करें।' : 'Enter agreed transaction value or circle rate to calculate complete conveyance costs.'}
        receiptText={receiptText}
        statutoryNote={isHindi
          ? '* धारा 50C के तहत सर्कल दर और विक्रय मूल्य में से जो अधिक हो, उसी पर स्टाम्प शुल्क देय होता है।'
          : '* Calculated under Sec 50C of Income Tax Act and State Stamp Schedules. Includes mandatory Sec 194-IA TDS if consideration exceeds ₹50 Lakhs.'}
        isHindi={isHindi}
      />
    </div>
  );
}
