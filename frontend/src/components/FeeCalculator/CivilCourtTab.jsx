import React, { useState } from 'react';
import { CIVIL_SUIT_TYPES } from '../../data/feeCalculatorData';
import StatutoryReceipt, { formatCurrency } from './StatutoryReceipt';
import RupeeInputField from './RupeeInputField';
import { STATUTORY_CEILINGS } from './currencyValidation';

export default function CivilCourtTab({ isHindi }) {
  const [suitType, setSuitType] = useState('money_recovery');
  const [suitValue, setSuitValue] = useState('');
  const [courtHierarchy, setCourtHierarchy] = useState('district');
  const [isIndigentApplicant, setIsIndigentApplicant] = useState(false);

  const val = Number(suitValue) || 0;
  const selectedSuit = CIVIL_SUIT_TYPES.find(s => s.id === suitType) || CIVIL_SUIT_TYPES[0];

  let courtFee = 0;
  let calculationFormula = '';

  if (isIndigentApplicant) {
    courtFee = 0;
    calculationFormula = 'Exempted under Order 33 CPC (Indigent / Pauper Person)';
  } else if (selectedSuit.type === 'fixed') {
    courtFee = selectedSuit.fixedFee;
    calculationFormula = `Fixed Statutory Fee under Schedule II: ₹${selectedSuit.fixedFee}`;
  } else if (selectedSuit.type === 'fixed_partition') {
    courtFee = selectedSuit.fixedInJoint;
    calculationFormula = 'Fixed Article 17(vi) Fee for Constructive Joint Possession';
  } else if (selectedSuit.type === 'fixed_with_claim') {
    courtFee = selectedSuit.fixedFee + (val > 0 ? Math.min(val * 0.01, 15000) : 0);
    calculationFormula = `Fixed ₹${selectedSuit.fixedFee} + Injunction relief scaling`;
  } else {
    if (val <= 100000) {
      courtFee = val * 0.035;
      calculationFormula = '3.50% on valuation up to ₹1,00,000';
    } else if (val <= 500000) {
      courtFee = 3500 + (val - 100000) * 0.025;
      calculationFormula = '₹3,500 + 2.50% between ₹1L and ₹5L';
    } else if (val <= 2000000) {
      courtFee = 13500 + (val - 500000) * 0.015;
      calculationFormula = '₹13,500 + 1.50% between ₹5L and ₹20L';
    } else {
      courtFee = 36000 + (val - 2000000) * 0.01;
      calculationFormula = '₹36,000 + 1.00% on claim exceeding ₹20L';
    }
    const statutoryCap = courtHierarchy === 'highcourt' ? 500000 : 300000;
    if (courtFee > statutoryCap) {
      courtFee = statutoryCap;
      calculationFormula += ` (Capped at ₹${statutoryCap.toLocaleString()})`;
    }
  }

  const vakalatnamaStamp = 50;
  const legalBenefitFund = 100;
  const processFeePerDefendant = 150;
  const miscellaneousStatutory = isIndigentApplicant ? 0 : (vakalatnamaStamp + legalBenefitFund + processFeePerDefendant);
  const totalOutlay = courtFee + miscellaneousStatutory;

  const receiptText = `════ DHAARAAI CIVIL COURT FEE STATUTORY AUDIT ════
Governing Statute: COURT FEES ACT 1870 & SUITS VALUATION ACT 1887
Suit Category: ${selectedSuit.labelEn}
Court Hierarchy: ${courtHierarchy === 'highcourt' ? 'High Court (Original Jurisdiction)' : 'District Court (Civil Judge / District Judge)'}
Declared Subject Valuation: ${formatCurrency(val)}
Order 33 CPC Indigent Exemption: ${isIndigentApplicant ? 'YES' : 'NO'}
--------------------------------------------------
1. Ad-Valorem / Fixed Plaint Fee: ${formatCurrency(courtFee)}
2. Vakalatnama Judicial Stamp: ${formatCurrency(isIndigentApplicant ? 0 : vakalatnamaStamp)}
3. Advocates Welfare Fund Stamp: ${formatCurrency(isIndigentApplicant ? 0 : legalBenefitFund)}
4. Initial Process / Summons Fee (2 sets): ${formatCurrency(isIndigentApplicant ? 0 : processFeePerDefendant)}
TOTAL STATUTORY COURT FILING OUTFLOW: ${formatCurrency(totalOutlay)}
Formula Basis: ${calculationFormula}
*Note: Excludes advocate professional fees and commissioner expenses.`;

  return (
    <div className="fee-calculator__panel animate-fade-in">
      <div className="fee-calculator__panel-form">
        <div className="fee-calc__header-group">
          <h3 className="fee-calculator__panel-title">
            {isHindi ? 'दीवानी मुकदमा कोर्ट फीस (Court Fees Act 1870)' : 'Civil Court Fee & Suits Valuation Studio'}
          </h3>
          <p className="fee-calc__section-desc">
            {isHindi
              ? 'मुकदमा प्रकार, एड-वैलोरेम स्लैब, वकालतनामा स्टाम्प और ऑर्डर 33 CPC निर्धन व्यक्ति छूट'
              : 'Complete ad-valorem, fixed relief, Vakalatnama welfare stamp, and Order 33 CPC indigent exemption.'}
          </p>
        </div>

        <div className="fee-calculator__form-grid">
          <div className="form-group full-width">
            <label className="form-label">{isHindi ? 'वाद की प्रकृति (Suit Category)' : 'Nature & Class of Suit'}</label>
            <select className="input-field" value={suitType} onChange={(e) => setSuitType(e.target.value)}>
              {CIVIL_SUIT_TYPES.map((s) => (
                <option key={s.id} value={s.id}>{isHindi ? s.labelHi : s.labelEn}</option>
              ))}
            </select>
            <span className="fee-calc__field-helper">{selectedSuit.desc}</span>
          </div>

          <div className="form-group">
            <label className="form-label">{isHindi ? 'न्यायालय स्तर (Court Hierarchy)' : 'Forum / Court Jurisdiction'}</label>
            <select className="input-field" value={courtHierarchy} onChange={(e) => setCourtHierarchy(e.target.value)}>
              <option value="district">{isHindi ? 'जिला न्यायालय (District Court - Cap ₹3L)' : 'District Court / Civil Judge (Max Cap ₹3 Lakhs)'}</option>
              <option value="highcourt">{isHindi ? 'उच्च न्यायालय (High Court Original Side - Cap ₹5L)' : 'High Court Original Side (Max Cap ₹5 Lakhs)'}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="civil-suit-val">
              {isHindi ? 'दावा राशि / संपत्ति मूल्यांकन (₹)' : 'Suit Valuation / Relief Value (₹)'}
            </label>
            <RupeeInputField
              id="civil-suit-val"
              value={suitValue}
              onChange={setSuitValue}
              placeholder="e.g. 1500000"
              max={STATUTORY_CEILINGS.civilCourt}
              isHindi={isHindi}
            />
          </div>
        </div>

        <div className="fee-calc__check-row">
          <label className="fee-calc__checkbox-label">
            <input
              type="checkbox"
              checked={isIndigentApplicant}
              onChange={(e) => setIsIndigentApplicant(e.target.checked)}
            />
            <span>{isHindi ? 'ऑर्डर 33 CPC निर्धन व्यक्ति आवेदन (Pauper / Indigent Person Exemption)' : 'Apply under Order 33 CPC (Indigent person waiver for destitute litigants)'}</span>
          </label>
        </div>

        {val > 0 && !isIndigentApplicant && (
          <div className="fee-calc__rate-chips">
            <span className="fee-calc__rate-chip">Base Calculation: {calculationFormula}</span>
            <span className="fee-calc__rate-chip is-blue">Vakalatnama & Welfare: ₹150</span>
            <span className="fee-calc__rate-chip">Summons Process: ₹150</span>
          </div>
        )}
      </div>

      <StatutoryReceipt
        documentTitle={isHindi ? 'न्यायालय शुल्क मूल्यांकन पत्र' : 'STATUTORY COURT FEE ASSESSMENT'}
        scheduleCode="COURT FEES ACT 1870 & SUITS VALUATION ACT 1887"
        subTitle={isHindi ? 'दीवानी प्रक्रिया संहिता 1908 अनुसूची' : 'Ad-Valorem & Fixed Schedule Audit'}
        jurisdictionLabel={isHindi ? 'फोरम / स्तर' : 'Judicial Forum'}
        jurisdictionVal={courtHierarchy === 'highcourt' ? 'High Court (Original Side)' : 'District Civil Court'}
        valuationLabel={isHindi ? 'वाद मूल्यांकन' : 'Subject Valuation'}
        valuationVal={val}
        lines={[
          { label: 'Ad-Valorem / Schedule Plaint Fee', value: formatCurrency(courtFee) },
          { label: 'Vakalatnama Stamp (Judicial)', value: isIndigentApplicant ? 'Waived' : '₹50' },
          { label: 'Advocate Welfare Fund Stamp', value: isIndigentApplicant ? 'Waived' : '₹100' },
          { label: 'Civil Summons Process Fee (2 sets)', value: isIndigentApplicant ? 'Waived' : '₹150' },
          { label: 'Statutory Exemption Status', value: isIndigentApplicant ? 'Order 33 CPC Active' : 'Regular Plaint Fee', highlight: isIndigentApplicant }
        ]}
        totalVal={totalOutlay}
        isCalculated={val > 0 || selectedSuit.type === 'fixed' || isIndigentApplicant}
        emptyPrompt={isHindi ? 'दावा राशि दर्ज करें अथवा वाद श्रेणी चुनें।' : 'Enter claimed relief value to evaluate exact ad-valorem court fees and filing surcharges.'}
        receiptText={receiptText}
        statutoryNote={isHindi
          ? '* कोर्ट फीस एक्ट 1870 और राज्य संशोधनों के अनुसार। आदेश 33 सीपीसी के तहत निर्धन व्यक्तियों को प्रारंभिक शुल्क छूट प्राप्त है।'
          : '* Governed by Court Fees Act 1870 and respective State Amendments. If the suit is decreed in favour of an indigent applicant, fees are recoverable from the decree amount.'}
        isHindi={isHindi}
      />
    </div>
  );
}
