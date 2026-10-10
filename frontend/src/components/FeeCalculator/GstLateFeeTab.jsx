import React, { useState } from 'react';
import { GST_RETURNS } from '../../data/feeCalculatorData';
import ProFeatureLock from '../ProFeatureLock';
import StatutoryReceipt, { formatCurrency } from './StatutoryReceipt';
import RupeeInputField from './RupeeInputField';
import { STATUTORY_CEILINGS, cleanBoundedInt } from './currencyValidation';

export default function GstLateFeeTab({ isHindi, isPro, onNavigateTab, onOpenUpgradeModal }) {
  const [gstReturnType, setGstReturnType] = useState('gstr3b');
  const [gstLateDays, setGstLateDays] = useState('');
  const [isNilReturn, setIsNilReturn] = useState(false);
  const [gstTurnover, setGstTurnover] = useState('below5cr');
  const [taxLiabilityAmount, setTaxLiabilityAmount] = useState('');

  const days = Math.max(0, Number(gstLateDays) || 0);
  const taxDue = Math.max(0, Number(taxLiabilityAmount) || 0);
  const returnInfo = GST_RETURNS.find(r => r.id === gstReturnType) || GST_RETURNS[0];

  const dailyRatePerHead = isNilReturn ? (returnInfo.nilDaily / 2) : (returnInfo.regDaily / 2);
  const totalDaily = isNilReturn ? returnInfo.nilDaily : returnInfo.regDaily;

  let maxCap = returnInfo.maxTurnoverAbove5Cr;
  if (isNilReturn) {
    maxCap = 500;
  } else if (gstTurnover === 'below5cr') {
    maxCap = returnInfo.maxTurnoverUnder5Cr;
  }

  const calculatedLateFee = totalDaily * days;
  const finalLateFee = Math.min(calculatedLateFee, maxCap);
  const cgstLateFee = finalLateFee / 2;
  const sgstLateFee = finalLateFee / 2;
  const isFeeCapped = calculatedLateFee >= maxCap;

  const interestSection50 = taxDue > 0 ? (taxDue * 0.18 * days) / 365 : 0;
  const totalStatutoryGstPayable = finalLateFee + interestSection50;

  const receiptText = `════ DHAARAAI GST LATE FILING & INTEREST AUDIT ════
Governing Statute: CENTRAL GOODS AND SERVICES TAX ACT 2017 (CGST & SGST)
Section 47 (Late Fee) & Section 50 (Interest on Delayed Payment)
Return Identifier: ${returnInfo.code} — ${returnInfo.name}
Turnover Bracket: ${gstTurnover === 'below5cr' ? 'Up to ₹5 Crore (Amnesty Relief Slab)' : 'Above ₹5 Crore'}
Nil Return Status: ${isNilReturn ? 'YES (Zero outward liability)' : 'NO (Taxable Supplies)'}
Days of Delay: ${days} days
Unpaid Tax Liability: ${formatCurrency(taxDue)}
--------------------------------------------------
1. CGST Late Fee (₹${dailyRatePerHead}/day): ${formatCurrency(cgstLateFee)}
2. SGST Late Fee (₹${dailyRatePerHead}/day): ${formatCurrency(sgstLateFee)}
Subtotal Late Fee (Sec 47): ${formatCurrency(finalLateFee)} ${isFeeCapped ? `[Capped at statutory max ₹${maxCap.toLocaleString()}]` : ''}
3. Mandatory Interest @ 18% p.a. (Sec 50): ${formatCurrency(interestSection50)}
TOTAL STATUTORY GST DEFICIT PAYABLE: ${formatCurrency(totalStatutoryGstPayable)}
*Auto-calculated into Electronic Liability Register in next GSTR-3B.`;

  return (
    <div className="fee-calculator__panel animate-fade-in" style={{ position: 'relative' }}>
      {!isPro && (
        <ProFeatureLock
          isHindi={isHindi}
          title={isHindi ? 'GST विलंब शुल्क एवं ब्याज स्टूडियो अनलॉक करें' : 'Unlock GST Late Fee & Interest Studio'}
          description={
            isHindi
              ? 'धारा 47 विलंब शुल्क, 18% वार्षिक ब्याज और इलेक्ट्रॉनिक देनदारी रजिस्टर DhaaraAI Plus में उपलब्ध हैं।'
              : 'Statutory Section 47 Late Fee capping and Section 50 18% p.a. interest computation require DhaaraAI Plus.'
          }
          onUpgradeClick={() => {
            if (onOpenUpgradeModal) onOpenUpgradeModal('GST Late Fee & Interest Studio');
            else if (onNavigateTab) onNavigateTab('settings');
          }}
        />
      )}
      <div className="fee-calculator__panel-form">
        <div className="fee-calc__header-group">
          <h3 className="fee-calculator__panel-title">
            {isHindi ? 'GST विलंब शुल्क एवं धारा 50 ब्याज कैलकुलेटर' : 'GST Late Fee (Sec 47) & Interest (Sec 50) Studio'}
          </h3>
          <p className="fee-calc__section-desc">
            {isHindi
              ? 'टर्नओवर सीमा, 18% वार्षिक ब्याज, NIL रिटर्न सीमा और धारा 47 शुल्क का सटीक हिसाब'
              : 'Turnover-linked statutory fee capping, Section 50 interest @ 18% p.a., and electronic liability register breakdown.'}
          </p>
        </div>

        <div className="fee-calculator__form-grid">
          <div className="form-group">
            <label className="form-label">{isHindi ? 'जीएसटी रिटर्न फॉर्म' : 'GST Return Form'}</label>
            <select className="input-field" value={gstReturnType} onChange={e => setGstReturnType(e.target.value)}>
              {GST_RETURNS.map(r => (
                <option key={r.id} value={r.id}>{r.code} — {r.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">{isHindi ? 'वार्षिक कारोबार (Turnover)' : 'Aggregate Annual Turnover'}</label>
            <select className="input-field" value={gstTurnover} onChange={e => setGstTurnover(e.target.value)}>
              <option value="below5cr">{isHindi ? '₹5 करोड़ तक (छूट प्राप्त कैप ₹2,000)' : 'Up to ₹5 Crore (Capped at ₹2,000)'}</option>
              <option value="above5cr">{isHindi ? '₹5 करोड़ से अधिक (मानक कैप ₹10,000)' : 'Above ₹5 Crore (Standard Cap ₹10,000)'}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gst-late-days">
              {isHindi ? 'विलंब के कुल दिन (अधिकतम 1,825)' : 'Total Days of Delay (Max 1,825)'}
            </label>
            <input
              id="gst-late-days"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="input-field"
              value={gstLateDays}
              onChange={e => {
                const { cleanStr } = cleanBoundedInt(e.target.value, 0, STATUTORY_CEILINGS.gstMaxDays);
                setGstLateDays(cleanStr);
              }}
              onKeyDown={e => {
                if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
              }}
              placeholder="e.g. 45"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="gst-tax-liability">
              {isHindi ? 'देय शुद्ध नकद कर (Tax Due) (₹)' : 'Net Unpaid Tax Liability (Cash Ledger) (₹)'}
            </label>
            <RupeeInputField
              id="gst-tax-liability"
              value={taxLiabilityAmount}
              onChange={setTaxLiabilityAmount}
              placeholder="e.g. 50000"
              max={STATUTORY_CEILINGS.gstLiability}
              disabled={isNilReturn}
              isHindi={isHindi}
            />
          </div>
        </div>

        <div className="fee-calc__check-row">
          <label className="fee-calc__checkbox-label">
            <input
              type="checkbox"
              checked={isNilReturn}
              onChange={e => setIsNilReturn(e.target.checked)}
            />
            <span>{isHindi ? 'NIL रिटर्न (शून्य कारोबार - शुल्क ₹20/दिन, अधिकतम कैप ₹500)' : 'Nil Return (Zero outward supplies - Fee reduced to ₹20/day, Max cap ₹500)'}</span>
          </label>
        </div>

        {days > 0 && (
          <div className="fee-calc__rate-chips">
            <span className="fee-calc__rate-chip">Rate: ₹{totalDaily}/day (₹{dailyRatePerHead} CGST + ₹{dailyRatePerHead} SGST)</span>
            {isFeeCapped && <span className="fee-calc__rate-chip is-warning">Section 47 Cap Reached (₹{maxCap.toLocaleString()})</span>}
            {taxDue > 0 && <span className="fee-calc__rate-chip is-danger">Sec 50 Interest: 18% p.a. Applied</span>}
          </div>
        )}
      </div>

      <StatutoryReceipt
        documentTitle={isHindi ? 'जीएसटी विधिक विलंब शुल्क व ब्याज' : 'GST STATUTORY LATE FEE & INTEREST AUDIT'}
        scheduleCode="CGST ACT 2017 — SECTIONS 47 & 50"
        subTitle={isHindi ? 'केंद्रीय वस्तु एवं सेवा कर देयता' : 'Central Board of Indirect Taxes and Customs (CBIC)'}
        jurisdictionLabel={isHindi ? 'रिटर्न श्रेणी' : 'Return Identifier'}
        jurisdictionVal={returnInfo.code}
        valuationLabel={isHindi ? 'विलंब अवधि' : 'Delay Duration'}
        valuationVal={`${days} Days`}
        lines={[
          { label: `CGST Late Fee (₹${dailyRatePerHead}/day × ${days})`, value: formatCurrency(cgstLateFee) },
          { label: `SGST Late Fee (₹${dailyRatePerHead}/day × ${days})`, value: formatCurrency(sgstLateFee) },
          { label: 'Statutory Fee Ceiling Status', value: isFeeCapped ? `Capped at ₹${maxCap.toLocaleString()}` : 'Under Maximum Cap', highlight: isFeeCapped },
          { label: 'Section 50 Interest @ 18% p.a. (on Tax Due)', value: formatCurrency(interestSection50), warn: interestSection50 > 0 }
        ]}
        totalVal={totalStatutoryGstPayable}
        isCalculated={days > 0}
        emptyPrompt={isHindi ? 'विलंब के दिन और रिटर्न प्रकार दर्ज करें।' : 'Enter days of delay and return form to calculate exact GST late fees and 18% interest.'}
        receiptText={receiptText}
        statutoryNote={isHindi
          ? '* CGST Act धारा 47 के अनुसार विलंब शुल्क एवं धारा 50 के तहत 18% वार्षिक ब्याज इलेक्ट्रॉनिक देयता रजिस्टर में स्वतः जुड़ता है।'
          : '* Governed by CGST Act 2017 Sections 47 & 50. Late fees and interest are auto-debited in the subsequent GSTR-3B tax settlement cycle.'}
        isHindi={isHindi}
      />
    </div>
  );
}
