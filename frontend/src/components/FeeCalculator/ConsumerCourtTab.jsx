import React, { useState } from 'react';
import StatutoryReceipt, { formatCurrency } from './StatutoryReceipt';
import RupeeInputField from './RupeeInputField';
import { STATUTORY_CEILINGS } from './currencyValidation';

export default function ConsumerCourtTab({ isHindi }) {
  const [consumerValue, setConsumerValue] = useState('');
  const [isSeniorCitizenClaimant, setIsSeniorCitizenClaimant] = useState(false);
  const [includesUnfairTradePractice, setIncludesUnfairTradePractice] = useState(false);

  const val = Number(consumerValue) || 0;

  let forumName = '';
  let forumCode = '';
  let fee = 0;
  let feeTier = '';

  if (val <= 500000) {
    forumName = 'District Consumer Disputes Redressal Commission (DCDRC)';
    forumCode = 'District Commission';
    fee = 0;
    feeTier = 'Zero Statutory Fee (Exempt up to ₹5 Lakhs)';
  } else if (val <= 1000000) {
    forumName = 'District Consumer Disputes Redressal Commission (DCDRC)';
    forumCode = 'District Commission';
    fee = 200;
    feeTier = '₹5 Lakhs to ₹10 Lakhs Slab';
  } else if (val <= 2000000) {
    forumName = 'District Consumer Disputes Redressal Commission (DCDRC)';
    forumCode = 'District Commission';
    fee = 400;
    feeTier = '₹10 Lakhs to ₹20 Lakhs Slab';
  } else if (val <= 5000000) {
    forumName = 'District Consumer Disputes Redressal Commission (DCDRC)';
    forumCode = 'District Commission';
    fee = 1000;
    feeTier = '₹20 Lakhs to ₹50 Lakhs Slab';
  } else if (val <= 10000000) {
    forumName = 'State Consumer Disputes Redressal Commission (SCDRC)';
    forumCode = 'State Commission';
    fee = 2000;
    feeTier = '₹50 Lakhs to ₹1 Crore Slab';
  } else if (val <= 20000000) {
    forumName = 'State Consumer Disputes Redressal Commission (SCDRC)';
    forumCode = 'State Commission';
    fee = 2500;
    feeTier = '₹1 Crore to ₹2 Crores Slab';
  } else if (val <= 40000000) {
    forumName = 'National Consumer Disputes Redressal Commission (NCDRC)';
    forumCode = 'National Commission';
    fee = 3000;
    feeTier = '₹2 Crores to ₹4 Crores Slab';
  } else if (val <= 60000000) {
    forumName = 'National Consumer Disputes Redressal Commission (NCDRC)';
    forumCode = 'National Commission';
    fee = 4000;
    feeTier = '₹4 Crores to ₹6 Crores Slab';
  } else if (val <= 80000000) {
    forumName = 'National Consumer Disputes Redressal Commission (NCDRC)';
    forumCode = 'National Commission';
    fee = 5000;
    feeTier = '₹6 Crores to ₹8 Crores Slab';
  } else if (val <= 100000000) {
    forumName = 'National Consumer Disputes Redressal Commission (NCDRC)';
    forumCode = 'National Commission';
    fee = 6000;
    feeTier = '₹8 Crores to ₹10 Crores Slab';
  } else {
    forumName = 'National Consumer Disputes Redressal Commission (NCDRC)';
    forumCode = 'National Commission';
    fee = 7500;
    feeTier = 'Exceeding ₹10 Crores Slab (Maximum Cap)';
  }

  const totalConsumerFee = fee;

  const receiptText = `════ DHAARAAI CONSUMER FORUM STATUTORY AUDIT ════
Governing Law: CONSUMER PROTECTION ACT 2019 (CPA 2019)
Procedure: Consumer Protection (Consumer Disputes Redressal Commission) Rules 2020
Total Claim Value (Goods/Services + Compensation Claimed): ${formatCurrency(val)}
Competent Pecuniary Forum: ${forumName}
Senior Citizen Fast-track Priority: ${isSeniorCitizenClaimant ? 'YES' : 'NO'}
Unfair Trade Practice Inclusion: ${includesUnfairTradePractice ? 'YES' : 'NO'}
--------------------------------------------------
Statutory Demand Draft / Bharatkosh Fee: ${fee === 0 ? 'NIL (₹0 Exempt)' : formatCurrency(fee)}
Filing Mode: National e-Daakhil Portal or Physical Registry
Statutory Fee Slab: ${feeTier}
TOTAL FILING FEE: ${formatCurrency(totalConsumerFee)}
*Limitation Period: 2 Years from cause of action under Section 69 of CPA 2019.`;

  return (
    <div className="fee-calculator__panel animate-fade-in">
      <div className="fee-calculator__panel-form">
        <div className="fee-calc__header-group">
          <h3 className="fee-calculator__panel-title">
            {isHindi ? 'उपभोक्ता संरक्षण आयोग विधिक स्टूडियो (CPA 2019)' : 'Consumer Commission Pecuniary & Fee Studio'}
          </h3>
          <p className="fee-calc__section-desc">
            {isHindi
              ? 'उपभोक्ता संरक्षण अधिनियम 2019 व ई-दाखिल नियमों के अनुसार फोरम अधिकार क्षेत्र व फीस'
              : 'Accurate pecuniary limits under CPA 2019 (2021 Notification), e-Daakhil filing fee slabs, and limitation alerts.'}
          </p>
        </div>

        <div className="fee-calculator__form-grid">
          <div className="form-group full-width">
            <label className="form-label" htmlFor="consumer-claim-val">
              {isHindi ? 'कुल दावा राशि (सेवा/वस्तु का मूल्य + दावा किया गया मुआवजा) (₹)' : 'Total Consideration + Compensation Demanded (₹)'}
            </label>
            <RupeeInputField
              id="consumer-claim-val"
              value={consumerValue}
              onChange={setConsumerValue}
              placeholder="e.g. 750000"
              max={STATUTORY_CEILINGS.consumerCourt}
              isHindi={isHindi}
            />
            <span className="fee-calc__field-helper">
              {isHindi
                ? 'अधिनियम 2019 के तहत अधिकार क्षेत्र भुगतान किए गए प्रतिफल के आधार पर निर्धारित होता है।'
                : 'Under CPA 2019, jurisdiction is decided by actual consideration paid plus damages.'}
            </span>
          </div>
        </div>

        <div className="fee-calc__check-stack">
          <label className="fee-calc__checkbox-label">
            <input
              type="checkbox"
              checked={isSeniorCitizenClaimant}
              onChange={(e) => setIsSeniorCitizenClaimant(e.target.checked)}
            />
            <span>{isHindi ? 'वरिष्ठ नागरिक शिकायतकर्ता (Senior Citizen Fast-track Consideration)' : 'Senior Citizen Claimant (Eligible for priority hearing schedule)'}</span>
          </label>
          <label className="fee-calc__checkbox-label">
            <input
              type="checkbox"
              checked={includesUnfairTradePractice}
              onChange={(e) => setIncludesUnfairTradePractice(e.target.checked)}
            />
            <span>{isHindi ? 'अनुचित व्यापार व्यवहार / भ्रामक विज्ञापन शामिल (Sec 21 CCPA Liability)' : 'Includes Misleading Advertisement / Unfair Trade Practice'}</span>
          </label>
        </div>

        {val > 0 && (
          <div className="fee-calc__rate-chips">
            <span className="fee-calc__rate-chip">{forumCode}</span>
            <span className="fee-calc__rate-chip is-blue">{feeTier}</span>
            {val <= 500000 && <span className="fee-calc__rate-chip is-green">Zero Fee Exemption Applied</span>}
            <span className="fee-calc__rate-chip">Sec 69: 2-Year Limitation Window</span>
          </div>
        )}
      </div>

      <StatutoryReceipt
        documentTitle={isHindi ? 'उपभोक्ता आयोग शुल्क रसीद' : 'CONSUMER REDRESSAL FILING RECEIPT'}
        scheduleCode="CONSUMER PROTECTION ACT 2019"
        subTitle={isHindi ? 'उपभोक्ता संरक्षण नियम 2020' : 'CP (Commission Procedure) Rules 2020'}
        jurisdictionLabel={isHindi ? 'सक्षम आयोग' : 'Competent Commission'}
        jurisdictionVal={forumName}
        valuationLabel={isHindi ? 'दावा राशि' : 'Aggregated Relief Claim'}
        valuationVal={val}
        lines={[
          { label: 'Forum Filing Fee (Demand Draft / e-Daakhil)', value: fee === 0 ? 'NIL (₹0 Exempt)' : formatCurrency(fee) },
          { label: 'Exemption Threshold (Claims ≤ ₹5 Lakhs)', value: val <= 500000 && val > 0 ? 'Fully Exempt' : 'Applicable Tier', highlight: val <= 500000 && val > 0 },
          { label: 'Forum Pecuniary Class', value: forumCode },
          { label: 'Limitation Benchmark (Section 69)', value: '24 Months from Action Date' }
        ]}
        totalVal={totalConsumerFee}
        isCalculated={val > 0}
        emptyPrompt={isHindi ? 'कुल दावा राशि दर्ज करें।' : 'Enter total goods/services value and claimed compensation to determine competent forum.'}
        receiptText={receiptText}
        statutoryNote={isHindi
          ? '* CPA 2019 के तहत ₹5 लाख तक की शिकायतों पर कोई कोर्ट फीस नहीं है। भुगतान डिमांड ड्राफ्ट या ई-दाखिल पोर्टल पर ऑनलाइन किया जाता है।'
          : '* Under CPA 2019, consumer complaints up to ₹5 Lakhs are entirely exempt from filing fees. Payment is submitted via Demand Draft or online via e-Daakhil portal.'}
        isHindi={isHindi}
      />
    </div>
  );
}
