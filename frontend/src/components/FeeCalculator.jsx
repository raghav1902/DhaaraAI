import React, { useState } from 'react';
import {
  Calculator, Building, Landmark, AlertCircle, FileText, IndianRupee,
  Car, ShoppingCart, Check, Copy, Receipt, Scale, Info, ShieldCheck,
  Percent, ArrowRight, Clock, HelpCircle, BadgeCheck, AlertTriangle
} from 'lucide-react';
import {
  STAMP_DUTY_RATES,
  CIVIL_SUIT_TYPES,
  TRAFFIC_VIOLATIONS,
  GST_RETURNS,
  ADVOCATE_FEE_SCALES
} from '../data/feeCalculatorData';
import ProFeatureLock from './ProFeatureLock';
import './FeeCalculator.css';

export default function FeeCalculator({ language = 'English', user, onNavigateTab, onOpenUpgradeModal }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';
  const isPro = user?.plan === 'plus' || user?.plan === 'pro' || user?.plan === 'enterprise';

  // Active Tab: Keeping the exact 6 original modules
  const [calcType, setCalcType] = useState('property');
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  // 1. Property & Registry State
  const [state, setState] = useState('Delhi');
  const [declaredValuation, setDeclaredValuation] = useState('');
  const [circleRateValuation, setCircleRateValuation] = useState('');
  const [buyerGender, setBuyerGender] = useState('male');
  const [propertyAreaType, setPropertyAreaType] = useState('urban'); // urban | rural
  const [propertyStatus, setPropertyStatus] = useState('resale'); // resale | under_construction | plot
  const [isAffordableHousing, setIsAffordableHousing] = useState(false);

  // 2. Civil Court Fee State
  const [suitType, setSuitType] = useState('money_recovery');
  const [suitValue, setSuitValue] = useState('');
  const [courtHierarchy, setCourtHierarchy] = useState('district'); // district | highcourt
  const [isIndigentApplicant, setIsIndigentApplicant] = useState(false); // Order 33 CPC

  // 3. Consumer Commission State
  const [consumerValue, setConsumerValue] = useState('');
  const [isSeniorCitizenClaimant, setIsSeniorCitizenClaimant] = useState(false);
  const [includesUnfairTradePractice, setIncludesUnfairTradePractice] = useState(false);

  // 4. Traffic Challan State
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [repeatOffenceMap, setRepeatOffenceMap] = useState({}); // { violationId: boolean }
  const [commercialVehicle, setCommercialVehicle] = useState(false);

  // 5. GST Late Fee State
  const [gstReturnType, setGstReturnType] = useState('gstr3b');
  const [gstLateDays, setGstLateDays] = useState('');
  const [isNilReturn, setIsNilReturn] = useState(false);
  const [gstTurnover, setGstTurnover] = useState('below5cr'); // below5cr | above5cr
  const [taxLiabilityAmount, setTaxLiabilityAmount] = useState(''); // for 18% p.a. sec 50 interest

  // 6. Advocate Fee State
  const [caseType, setCaseType] = useState('civil');
  const [advocateCourtLevel, setAdvocateCourtLevel] = useState('district'); // district | highcourt | supremecourt
  const [advocateSeniority, setAdvocateSeniority] = useState('junior'); // junior | senior
  const [includeDrafting, setIncludeDrafting] = useState(true);
  const [includeLegalNotice, setIncludeLegalNotice] = useState(false);
  const [estimatedHearings, setEstimatedHearings] = useState(6);
  const [checkLegalAid, setCheckLegalAid] = useState(false);
  const [annualIncome, setAnnualIncome] = useState('');

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Math.round(val || 0));

  const copyReceiptToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  // Reusable Statutory Receipt Layout with verified visual structure
  const renderStatutoryReceipt = ({
    documentTitle, scheduleCode, subTitle, jurisdictionLabel, jurisdictionVal,
    valuationLabel, valuationVal, lines, totalVal, isCalculated,
    emptyPrompt, receiptText, statutoryNote, badgeTag = 'FORM VIII • STATUTORY ASSESSMENT'
  }) => (
    <div className="fee-statutory-receipt animate-fade-in" aria-label="Statutory Fee Breakdown">
      <div className="fee-statutory-receipt__top-bar">
        <div className="fee-statutory-receipt__badge">
          <FileText size={12} />
          <span>{scheduleCode}</span>
        </div>
        <span className="fee-statutory-receipt__series">{badgeTag}</span>
      </div>

      <div className="fee-statutory-receipt__body">
        <div className="fee-statutory-receipt__header-motif">
          <div className="fee-statutory-receipt__crest">
            <Landmark size={20} className="fee-statutory-receipt__crest-icon" />
          </div>
          <div className="fee-statutory-receipt__heading-wrap">
            <h4 className="fee-statutory-receipt__title">{documentTitle}</h4>
            <span className="fee-statutory-receipt__subtitle">{subTitle}</span>
          </div>
        </div>

        <div className="fee-statutory-receipt__metadata">
          <div className="fee-statutory-receipt__meta-item">
            <span className="fee-statutory-receipt__meta-label">{jurisdictionLabel}</span>
            <span className="fee-statutory-receipt__meta-val">{jurisdictionVal}</span>
          </div>
          <div className="fee-statutory-receipt__meta-item">
            <span className="fee-statutory-receipt__meta-label">{valuationLabel}</span>
            <span className="fee-statutory-receipt__meta-val font-mono">
              {typeof valuationVal === 'number' ? (valuationVal > 0 ? formatCurrency(valuationVal) : '₹ —') : valuationVal}
            </span>
          </div>
        </div>

        <div className="fee-statutory-receipt__divider" />

        <div className="fee-statutory-receipt__lines">
          {lines.map((item, idx) => (
            <div key={idx} className="fee-statutory-receipt__line">
              <span className="fee-statutory-receipt__line-label">{item.label}</span>
              <div className="fee-statutory-receipt__dots" />
              <span className={`fee-statutory-receipt__line-val font-mono ${item.highlight ? 'is-highlight' : ''} ${item.warn ? 'is-warn' : ''}`}>
                {isCalculated ? item.value : '₹ —'}
              </span>
            </div>
          ))}
        </div>

        <div className="fee-statutory-receipt__divider-heavy" />

        <div className="fee-statutory-receipt__total-row">
          <div>
            <span className="fee-statutory-receipt__total-label">
              {isHindi ? 'कुल अनुमानित विधिक देयता' : 'TOTAL STATUTORY OUTFLOW'}
            </span>
            <span className="fee-statutory-receipt__total-sub">
              {isCalculated
                ? (isHindi ? 'देय सरकारी व विधिक शुल्क' : 'Official Government & Legal Obligation')
                : (isHindi ? 'गणना लंबित' : 'Awaiting Parameter Inputs')}
            </span>
          </div>
          <span className={`fee-statutory-receipt__total-val font-mono ${isCalculated ? 'is-calculated' : 'is-empty'}`}>
            {isCalculated ? formatCurrency(totalVal) : '₹ —'}
          </span>
        </div>

        {isCalculated ? (
          <div className="fee-statutory-receipt__calculated-footer">
            <div className="fee-statutory-receipt__note">
              <AlertCircle size={13} className="fee-statutory-receipt__note-icon" />
              <span>{statutoryNote}</span>
            </div>
            <button
              className="fee-statutory-receipt__copy-btn"
              onClick={() => copyReceiptToClipboard(receiptText)}
              type="button"
            >
              {copiedReceipt ? <Check size={14} color="var(--accent)" /> : <Copy size={14} />}
              <span>{copiedReceipt ? (isHindi ? 'कॉपी हो गया' : 'Copied!') : (isHindi ? 'रसीद कॉपी करें' : 'Copy Full Audit')}</span>
            </button>
          </div>
        ) : (
          <div className="fee-statutory-receipt__prompt">
            <div className="fee-statutory-receipt__prompt-dot" />
            <span>{emptyPrompt}</span>
          </div>
        )}
      </div>

      <div className="fee-statutory-receipt__security-edge">
        <span>SECURITY AUDIT • DHAARAAI STATUTORY ENGINE • LAW COMMISSION & BCI COMPLIANT</span>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 1: ADVANCED PROPERTY REGISTRATION & STAMP DUTY
  // ═══════════════════════════════════════════════════════════════════════════
  const renderPropertyCalc = () => {
    const declared = Number(declaredValuation) || 0;
    const circle = Number(circleRateValuation) || 0;
    // Section 50C Income Tax Act / Stamp Act: Duty is assessed on HIGHER of declared value vs circle rate
    const taxableVal = Math.max(declared, circle);
    const rates = STAMP_DUTY_RATES[state] || STAMP_DUTY_RATES['Delhi'];

    const baseStampRate = rates[buyerGender] || rates['male'];
    const regRate = rates.registry;

    // Stamp Duty
    const stampDuty = (taxableVal * baseStampRate) / 100;

    // Metro / Urban Local Body Cess
    const metroCessRate = propertyAreaType === 'urban' ? rates.metroCess : 0;
    const metroCessAmount = (taxableVal * metroCessRate) / 100;

    // Registration fee calculation (handling state-wise ceilings)
    let registrationFee = (taxableVal * regRate) / 100;
    if (rates.ceilingReg && registrationFee > rates.ceilingReg) {
      registrationFee = rates.ceilingReg;
    }

    // TDS under Section 194-IA (1% on total consideration if valuation >= 50,00,000)
    const tdsApplicable = taxableVal >= 5000000;
    const tdsAmount = tdsApplicable ? (taxableVal * 0.01) : 0;

    // GST on under-construction property (5% for regular, 1% for affordable housing, 0% for resale/ready)
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
              <label className="form-label">{isHindi ? 'घोषित सौदा मूल्य (₹)' : 'Agreed Transaction Value (₹)'}</label>
              <div className="fee-calculator__input-wrap">
                <IndianRupee size={16} className="fee-calculator__currency-icon" />
                <input
                  type="number"
                  className="input-field"
                  value={declaredValuation}
                  onChange={(e) => setDeclaredValuation(e.target.value)}
                  placeholder="e.g. 6000000"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{isHindi ? 'सर्कल रेट न्यूनतम मूल्यांकन (₹)' : 'Govt Circle Rate Valuation (₹)'}</label>
              <div className="fee-calculator__input-wrap">
                <IndianRupee size={16} className="fee-calculator__currency-icon" />
                <input
                  type="number"
                  className="input-field"
                  value={circleRateValuation}
                  onChange={(e) => setCircleRateValuation(e.target.value)}
                  placeholder="e.g. 5500000"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
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

          {/* Under construction extra checkbox */}
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

          {/* Statutory Insight Badges */}
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

        {renderStatutoryReceipt({
          documentTitle: isHindi ? 'स्टाम्प ड्यूटी एवं विधिक पंजीयन मूल्यांकन' : 'STATUTORY CONVEYANCE & STAMP ASSESSMENT',
          scheduleCode: 'INDIAN STAMP ACT 1899 & REGISTRATION ACT 1908',
          subTitle: isHindi ? 'उप-निबंधक कार्यालय विधिक रिपोर्ट' : 'Department of Revenue & Sub-Registrar Audit',
          jurisdictionLabel: isHindi ? 'राज्य / क्षेत्र' : 'Jurisdiction & Zone',
          jurisdictionVal: `${state} (${propertyAreaType.toUpperCase()})`,
          valuationLabel: isHindi ? 'मूल्यांकन आधार (Sec 50C)' : 'Statutory Assessment Base',
          valuationVal: taxableVal,
          lines: [
            { label: `Stamp Duty (${baseStampRate}%)`, value: formatCurrency(stampDuty) },
            { label: `Urban Development / Metro Cess (${metroCessRate}%)`, value: formatCurrency(metroCessAmount) },
            { label: `Registration Fee (${regRate}%)${rates.ceilingReg ? ' (State Capped)' : ''}`, value: formatCurrency(registrationFee) },
            { label: `GST (${gstRate}% - ${propertyStatus === 'under_construction' ? (isAffordableHousing ? 'Affordable' : 'Standard') : 'Exempt'})`, value: formatCurrency(gstAmount) },
            { label: `Section 194-IA TDS Deductible (1% on ≥ ₹50L)`, value: tdsApplicable ? formatCurrency(tdsAmount) : 'Not Applicable (< ₹50L)', highlight: tdsApplicable, warn: tdsApplicable }
          ],
          totalVal: grandTotalWithTDS,
          isCalculated: taxableVal > 0,
          emptyPrompt: isHindi ? 'संपत्ति का मूल्य या सर्कल रेट दर्ज करें।' : 'Enter agreed transaction value or circle rate to calculate complete conveyance costs.',
          receiptText,
          statutoryNote: isHindi
            ? '* धारा 50C के तहत सर्कल दर और विक्रय मूल्य में से जो अधिक हो, उसी पर स्टाम्प शुल्क देय होता है।'
            : '* Calculated under Sec 50C of Income Tax Act and State Stamp Schedules. Includes mandatory Sec 194-IA TDS if consideration exceeds ₹50 Lakhs.'
        })}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 2: ADVANCED CIVIL COURT FEE
  // ═══════════════════════════════════════════════════════════════════════════
  const renderCourtCalc = () => {
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
      // In partition suit where plaintiff claims joint possession, fixed fee applies; if ousted, ad-valorem on plaintiff share
      courtFee = selectedSuit.fixedInJoint;
      calculationFormula = 'Fixed Article 17(vi) Fee for Constructive Joint Possession';
    } else if (selectedSuit.type === 'fixed_with_claim') {
      // Permanent injunction: fixed nominal stamp plus valuation fee
      courtFee = selectedSuit.fixedFee + (val > 0 ? Math.min(val * 0.01, 15000) : 0);
      calculationFormula = `Fixed ₹${selectedSuit.fixedFee} + Injunction relief scaling`;
    } else {
      // Full Ad-valorem standard Indian Court Fees Act 1870 slab
      if (val <= 100000) {
        courtFee = val * 0.035; // 3.5% for claims up to 1L
        calculationFormula = '3.50% on valuation up to ₹1,00,000';
      } else if (val <= 500000) {
        courtFee = 3500 + (val - 100000) * 0.025; // 2.5% for next 4L
        calculationFormula = '₹3,500 + 2.50% between ₹1L and ₹5L';
      } else if (val <= 2000000) {
        courtFee = 13500 + (val - 500000) * 0.015; // 1.5% for 5L to 20L
        calculationFormula = '₹13,500 + 1.50% between ₹5L and ₹20L';
      } else {
        courtFee = 36000 + (val - 2000000) * 0.01; // 1% above 20L
        calculationFormula = '₹36,000 + 1.00% on claim exceeding ₹20L';
      }
      // High Court original jurisdiction vs District court fee cap
      const statutoryCap = courtHierarchy === 'highcourt' ? 500000 : 300000;
      if (courtFee > statutoryCap) {
        courtFee = statutoryCap;
        calculationFormula += ` (Capped at ₹${statutoryCap.toLocaleString()})`;
      }
    }

    // Process fee + Vakalatnama stamp + Legal Benefit Fund
    const vakalatnamaStamp = 50;
    const legalBenefitFund = 100;
    const processFeePerDefendant = 150; // assumed 2 summons
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
              <label className="form-label">{isHindi ? 'दावा राशि / संपत्ति मूल्यांकन (₹)' : 'Suit Valuation / Relief Value (₹)'}</label>
              <div className="fee-calculator__input-wrap">
                <IndianRupee size={16} className="fee-calculator__currency-icon" />
                <input
                  type="number"
                  className="input-field"
                  value={suitValue}
                  onChange={(e) => setSuitValue(e.target.value)}
                  placeholder="e.g. 1500000"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          </div>

          {/* Indigent Person Option */}
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

        {renderStatutoryReceipt({
          documentTitle: isHindi ? 'न्यायालय शुल्क मूल्यांकन पत्र' : 'STATUTORY COURT FEE ASSESSMENT',
          scheduleCode: 'COURT FEES ACT 1870 & SUITS VALUATION ACT 1887',
          subTitle: isHindi ? 'दीवानी प्रक्रिया संहिता 1908 अनुसूची' : 'Ad-Valorem & Fixed Schedule Audit',
          jurisdictionLabel: isHindi ? 'फोरम / स्तर' : 'Judicial Forum',
          jurisdictionVal: courtHierarchy === 'highcourt' ? 'High Court (Original Side)' : 'District Civil Court',
          valuationLabel: isHindi ? 'वाद मूल्यांकन' : 'Subject Valuation',
          valuationVal: val,
          lines: [
            { label: 'Ad-Valorem / Schedule Plaint Fee', value: formatCurrency(courtFee) },
            { label: 'Vakalatnama Stamp (Judicial)', value: isIndigentApplicant ? 'Waived' : '₹50' },
            { label: 'Advocate Welfare Fund Stamp', value: isIndigentApplicant ? 'Waived' : '₹100' },
            { label: 'Civil Summons Process Fee (2 sets)', value: isIndigentApplicant ? 'Waived' : '₹150' },
            { label: 'Statutory Exemption Status', value: isIndigentApplicant ? 'Order 33 CPC Active' : 'Regular Plaint Fee', highlight: isIndigentApplicant }
          ],
          totalVal: totalOutlay,
          isCalculated: val > 0 || selectedSuit.type === 'fixed' || isIndigentApplicant,
          emptyPrompt: isHindi ? 'दावा राशि दर्ज करें अथवा वाद श्रेणी चुनें।' : 'Enter claimed relief value to evaluate exact ad-valorem court fees and filing surcharges.',
          receiptText,
          statutoryNote: isHindi
            ? '* कोर्ट फीस एक्ट 1870 और राज्य संशोधनों के अनुसार। आदेश 33 सीपीसी के तहत निर्धन व्यक्तियों को प्रारंभिक शुल्क छूट प्राप्त है।'
            : '* Governed by Court Fees Act 1870 and respective State Amendments. If the suit is decreed in favour of an indigent applicant, fees are recoverable from the decree amount.'
        })}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 3: ADVANCED CONSUMER COMMISSION (CPA 2019)
  // ═══════════════════════════════════════════════════════════════════════════
  const renderConsumerCalc = () => {
    const val = Number(consumerValue) || 0;

    // CPA 2019 Pecuniary Jurisdictions (Amended 2021 Notification)
    // District Commission (DCDRC): Up to ₹50 Lakhs
    // State Commission (SCDRC): Exceeding ₹50 Lakhs up to ₹2 Crores
    // National Commission (NCDRC): Exceeding ₹2 Crores
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

    const edaakhilPortalFee = fee > 0 ? 0 : 0; // e-Daakhil doesn't charge extra surcharge
    const totalConsumerFee = fee + edaakhilPortalFee;

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
              <label className="form-label">
                {isHindi ? 'कुल दावा राशि (सेवा/वस्तु का मूल्य + दावा किया गया मुआवजा) (₹)' : 'Total Consideration + Compensation Demanded (₹)'}
              </label>
              <div className="fee-calculator__input-wrap">
                <IndianRupee size={16} className="fee-calculator__currency-icon" />
                <input
                  type="number"
                  className="input-field"
                  value={consumerValue}
                  onChange={(e) => setConsumerValue(e.target.value)}
                  placeholder="e.g. 750000"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
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

        {renderStatutoryReceipt({
          documentTitle: isHindi ? 'उपभोक्ता आयोग शुल्क रसीद' : 'CONSUMER REDRESSAL FILING RECEIPT',
          scheduleCode: 'CONSUMER PROTECTION ACT 2019',
          subTitle: isHindi ? 'उपभोक्ता संरक्षण नियम 2020' : 'CP (Commission Procedure) Rules 2020',
          jurisdictionLabel: isHindi ? 'सक्षम आयोग' : 'Competent Commission',
          jurisdictionVal: forumName,
          valuationLabel: isHindi ? 'दावा राशि' : 'Aggregated Relief Claim',
          valuationVal: val,
          lines: [
            { label: 'Forum Filing Fee (Demand Draft / e-Daakhil)', value: fee === 0 ? 'NIL (₹0 Exempt)' : formatCurrency(fee) },
            { label: 'Exemption Threshold (Claims ≤ ₹5 Lakhs)', value: val <= 500000 && val > 0 ? 'Fully Exempt' : 'Applicable Tier', highlight: val <= 500000 && val > 0 },
            { label: 'Forum Pecuniary Class', value: forumCode },
            { label: 'Limitation Benchmark (Section 69)', value: '24 Months from Action Date' }
          ],
          totalVal: totalConsumerFee,
          isCalculated: val > 0,
          emptyPrompt: isHindi ? 'कुल दावा राशि दर्ज करें।' : 'Enter total goods/services value and claimed compensation to determine competent forum.',
          receiptText,
          statutoryNote: isHindi
            ? '* CPA 2019 के तहत ₹5 लाख तक की शिकायतों पर कोई कोर्ट फीस नहीं है। भुगतान डिमांड ड्राफ्ट या ई-दाखिल पोर्टल पर ऑनलाइन किया जाता है।'
            : '* Under CPA 2019, consumer complaints up to ₹5 Lakhs are entirely exempt from filing fees. Payment is submitted via Demand Draft or online via e-Daakhil portal.'
        })}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 4: ADVANCED TRAFFIC CHALLAN & MOTOR VEHICLES ACT
  // ═══════════════════════════════════════════════════════════════════════════
  const handleViolationToggle = (id) => {
    setSelectedViolations(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRepeatToggle = (id) => {
    setRepeatOffenceMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderTrafficCalc = () => {
    let totalFine = 0;
    let courtMandatoryCount = 0;
    const itemized = [];

    selectedViolations.forEach(id => {
      const v = TRAFFIC_VIOLATIONS.find(x => x.id === id);
      if (!v) return;

      const isRepeat = !!repeatOffenceMap[id];
      let fine = isRepeat ? v.repeatOffence : v.firstOffence;

      // Commercial vehicle 20% surcharge on overloading/heavy speed
      if (commercialVehicle && (id === 'speed_heavy' || id === 'norc')) {
        fine = Math.round(fine * 1.25);
      }

      totalFine += fine;
      if (v.courtMandatory) courtMandatoryCount++;

      itemized.push({
        id: v.id,
        label: `${v.labelEn} (${v.section})${isRepeat ? ' [Repeat Offence]' : ''}`,
        fine,
        section: v.section,
        courtMandatory: v.courtMandatory,
        extra: v.extra
      });
    });

    const receiptText = `════ DHAARAAI TRAFFIC COMPOUNDING ASSESSMENT ════
Governing Act: MOTOR VEHICLES (AMENDMENT) ACT 2019
Vehicle Category: ${commercialVehicle ? 'COMMERCIAL / TRANSPORT VEHICLE' : 'PRIVATE / NON-COMMERCIAL'}
Total Infractions Recorded: ${selectedViolations.length}
Court Appearance Compulsory: ${courtMandatoryCount > 0 ? `YES (${courtMandatoryCount} Non-Compoundable Offences)` : 'NO (100% Compoundable at Traffic Virtual Court)'}
--------------------------------------------------
${itemized.map(item => `• ${item.label}: ${formatCurrency(item.fine)}`).join('\n')}
--------------------------------------------------
TOTAL COMPOUNDABLE STATUTORY PENALTY: ${formatCurrency(totalFine)}
*Virtual Court disposal available at vcourts.gov.in`;

    return (
      <div className="fee-calculator__panel animate-fade-in">
        <div className="fee-calculator__panel-form">
          <div className="fee-calc__header-group">
            <h3 className="fee-calculator__panel-title">
              {isHindi ? 'यातायात चालान व मोटर वाहन अधिनियम 2019' : 'Motor Vehicles Act 2019 Penalty Studio'}
            </h3>
            <p className="fee-calc__section-desc">
              {isHindi
                ? 'प्रथम बनाम द्वितीय अपराध जुर्माना, गैर-शमनीय अपराध एवं वर्चुअल कोर्ट चालान विश्लेषण'
                : 'First vs Repeat offence fine structures, non-compoundable court summons identification, and Virtual Court assessment.'}
            </p>
          </div>

          <div className="fee-calc__vehicle-toggle-row">
            <label className="fee-calc__checkbox-label">
              <input
                type="checkbox"
                checked={commercialVehicle}
                onChange={(e) => setCommercialVehicle(e.target.checked)}
              />
              <span>{isHindi ? 'व्यावसायिक / भारी वाहन (Commercial Transport Vehicle - Applicable Surcharges)' : 'Commercial / Transport Vehicle Classification'}</span>
            </label>
          </div>

          <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
            {isHindi ? 'उल्लंघन सूची (उल्लंघन और प्रथम/पुनः अपराध चुनें):' : 'Recorded Traffic Infractions (Select Violation & Offence Tier):'}
          </label>

          <div className="fee-calculator__violations-list">
            {TRAFFIC_VIOLATIONS.map((v) => {
              const isChecked = selectedViolations.includes(v.id);
              const isRepeat = !!repeatOffenceMap[v.id];
              const effectiveFine = isRepeat ? v.repeatOffence : v.firstOffence;

              return (
                <div key={v.id} className={`fee-calculator__violation-card ${isChecked ? 'is-selected' : ''}`}>
                  <div className="fee-calculator__violation-main" onClick={() => handleViolationToggle(v.id)}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => { }} // handled by wrapper click
                      className="fee-calculator__violation-checkbox"
                    />
                    <div className="fee-calculator__violation-details">
                      <div className="fee-calculator__violation-header">
                        <span className="fee-calculator__violation-name">{isHindi ? v.labelHi : v.labelEn}</span>
                        <span className="fee-calculator__violation-section">{v.section}</span>
                      </div>
                      {v.extra && <span className="fee-calculator__violation-extra">{v.extra}</span>}
                      {v.courtMandatory && (
                        <span className="fee-calculator__court-badge">
                          <AlertTriangle size={11} /> Court Mandatory (Non-Compoundable)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="fee-calculator__violation-right">
                    <div className="fee-calculator__violation-fine font-mono">
                      {formatCurrency(effectiveFine)}
                    </div>

                    {isChecked && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRepeatToggle(v.id);
                        }}
                        className={`fee-calc__repeat-btn ${isRepeat ? 'is-active' : ''}`}
                      >
                        {isRepeat ? (isHindi ? 'पुनः अपराध (2nd+)' : 'Repeat Offence') : (isHindi ? 'प्रथम अपराध (1st)' : '1st Offence')}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {renderStatutoryReceipt({
          documentTitle: isHindi ? 'ट्रैफिक चालान एवं शमन मूल्यांकन' : 'TRAFFIC COMPOUNDING AUDIT',
          scheduleCode: 'MOTOR VEHICLES (AMENDMENT) ACT 2019',
          subTitle: isHindi ? 'राज्य पुलिस व वर्चुअल कोर्ट चालान अनुसूची' : 'Ministry of Road Transport & Highways (MoRTH)',
          jurisdictionLabel: isHindi ? 'वाहन वर्ग' : 'Vehicle Type',
          jurisdictionVal: commercialVehicle ? 'Commercial Transport' : 'Private / Non-Transport',
          valuationLabel: isHindi ? 'चिह्नित धाराएं' : 'Recorded Infractions',
          valuationVal: `${selectedViolations.length} Violations`,
          lines: [
            { label: 'Aggregated Compounding Fine', value: formatCurrency(totalFine) },
            { label: 'Court Mandate Status', value: courtMandatoryCount > 0 ? `${courtMandatoryCount} Court Appearances Req.` : '100% Settleable Online', warn: courtMandatoryCount > 0 },
            { label: 'Payment Gateway (Virtual Court)', value: 'vcourts.gov.in / Parivahan' },
            { label: 'License Suspension Risk', value: selectedViolations.includes('helmet') || selectedViolations.includes('drunk') ? 'High Risk (Section 206)' : 'Standard Points', warn: selectedViolations.includes('helmet') || selectedViolations.includes('drunk') }
          ],
          totalVal: totalFine,
          isCalculated: totalFine > 0,
          emptyPrompt: isHindi ? 'ऊपर दिए गए सूची में से उल्लंघन का चयन करें।' : 'Select traffic violations from the list to assess compounding penalties and virtual court requirements.',
          receiptText,
          statutoryNote: isHindi
            ? '* मोटर वाहन संशोधन अधिनियम 2019 के अनुसार। शराब पीकर गाड़ी चलाने या नाबालिग द्वारा ड्राइविंग जैसे मामलों में कोर्ट में पेशी अनिवार्य है।'
            : '* Offence compounding regulated under Sec 200 of MV Act. Offences marked "Court Mandatory" cannot be settled on the spot and require Virtual/Regular Court hearing.'
        })}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 5: ADVANCED GST LATE FEE & INTEREST
  // ═══════════════════════════════════════════════════════════════════════════
  const renderGstCalc = () => {
    const days = Math.max(0, Number(gstLateDays) || 0);
    const taxDue = Math.max(0, Number(taxLiabilityAmount) || 0);
    const returnInfo = GST_RETURNS.find(r => r.id === gstReturnType) || GST_RETURNS[0];

    // Daily statutory late fee (Split equally into CGST & SGST)
    const dailyRatePerHead = isNilReturn ? (returnInfo.nilDaily / 2) : (returnInfo.regDaily / 2);
    const totalDaily = isNilReturn ? returnInfo.nilDaily : returnInfo.regDaily;

    // Statutory caps per CGST notification:
    // If turnover <= 5 Cr: max ₹2,000 (₹1,000 CGST + ₹1,000 SGST) or ₹500 for NIL return
    // If turnover > 5 Cr: max ₹10,000 (₹5,000 CGST + ₹5,000 SGST)
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

    // Section 50 Interest: 18% per annum on unpaid tax liability
    // Formula: (Tax Due * 18% * Days of Delay) / 365
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
              <label className="form-label">{isHindi ? 'विलंब के कुल दिन' : 'Total Days of Delay'}</label>
              <input
                type="number"
                className="input-field"
                value={gstLateDays}
                onChange={e => setGstLateDays(e.target.value)}
                placeholder="e.g. 45"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">{isHindi ? 'देय शुद्ध नकद कर (Tax Due) (₹)' : 'Net Unpaid Tax Liability (Cash Ledger) (₹)'}</label>
              <div className="fee-calculator__input-wrap">
                <IndianRupee size={16} className="fee-calculator__currency-icon" />
                <input
                  type="number"
                  className="input-field"
                  value={taxLiabilityAmount}
                  onChange={e => setTaxLiabilityAmount(e.target.value)}
                  placeholder="e.g. 50000"
                  disabled={isNilReturn}
                  style={{ paddingLeft: '38px', opacity: isNilReturn ? 0.5 : 1 }}
                />
              </div>
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

        {renderStatutoryReceipt({
          documentTitle: isHindi ? 'जीएसटी विधिक विलंब शुल्क व ब्याज' : 'GST STATUTORY LATE FEE & INTEREST AUDIT',
          scheduleCode: 'CGST ACT 2017 — SECTIONS 47 & 50',
          subTitle: isHindi ? 'केंद्रीय वस्तु एवं सेवा कर देयता' : 'Central Board of Indirect Taxes and Customs (CBIC)',
          jurisdictionLabel: isHindi ? 'रिटर्न श्रेणी' : 'Return Identifier',
          jurisdictionVal: returnInfo.code,
          valuationLabel: isHindi ? 'विलंब अवधि' : 'Delay Duration',
          valuationVal: `${days} Days`,
          lines: [
            { label: `CGST Late Fee (₹${dailyRatePerHead}/day × ${days})`, value: formatCurrency(cgstLateFee) },
            { label: `SGST Late Fee (₹${dailyRatePerHead}/day × ${days})`, value: formatCurrency(sgstLateFee) },
            { label: 'Statutory Fee Ceiling Status', value: isFeeCapped ? `Capped at ₹${maxCap.toLocaleString()}` : 'Under Maximum Cap', highlight: isFeeCapped },
            { label: 'Section 50 Interest @ 18% p.a. (on Tax Due)', value: formatCurrency(interestSection50), warn: interestSection50 > 0 }
          ],
          totalVal: totalStatutoryGstPayable,
          isCalculated: days > 0,
          emptyPrompt: isHindi ? 'विलंब के दिन और रिटर्न प्रकार दर्ज करें।' : 'Enter days of delay and return form to calculate exact GST late fees and 18% interest.',
          receiptText,
          statutoryNote: isHindi
            ? '* CGST Act धारा 47 के अनुसार विलंब शुल्क एवं धारा 50 के तहत 18% वार्षिक ब्याज इलेक्ट्रॉनिक देयता रजिस्टर में स्वतः जुड़ता है।'
            : '* Governed by CGST Act 2017 Sections 47 & 50. Late fees and interest are auto-debited in the subsequent GSTR-3B tax settlement cycle.'
        })}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MODULE 6: ADVANCED ADVOCATE FEE & LEGAL AID ASSESSOR
  // ═══════════════════════════════════════════════════════════════════════════
  const renderAdvocateCalc = () => {
    const caseInfo = ADVOCATE_FEE_SCALES.find(c => c.id === caseType) || ADVOCATE_FEE_SCALES[0];

    // Determine baseline fee range based on forum level and advocate seniority
    let baseMin = 0;
    let baseMax = 0;

    if (advocateCourtLevel === 'district') {
      baseMin = advocateSeniority === 'senior' ? caseInfo.seniorMin : caseInfo.juniorMin;
      baseMax = advocateSeniority === 'senior' ? caseInfo.seniorMax : caseInfo.juniorMax;
    } else if (advocateCourtLevel === 'highcourt') {
      baseMin = advocateSeniority === 'senior' ? caseInfo.hcSeniorMin : caseInfo.hcJuniorMin;
      baseMax = advocateSeniority === 'senior' ? caseInfo.hcSeniorMax : caseInfo.hcJuniorMax;
    } else {
      baseMin = advocateSeniority === 'senior' ? caseInfo.scSeniorMin : caseInfo.scJuniorMin;
      baseMax = advocateSeniority === 'senior' ? caseInfo.scSeniorMax : caseInfo.scJuniorMax;
    }

    // Additional legal services
    const draftingCost = includeDrafting ? caseInfo.draftingFee : 0;
    const noticeCost = includeLegalNotice ? caseInfo.noticeFee : 0;
    const clerkageAllowance = Math.round(baseMin * 0.10); // standard 10% clerkage

    // Hearing appearance projection (per effective appearance)
    const perHearingMin = Math.round(baseMin / Math.max(caseInfo.typicalHearings, 1));
    const perHearingMax = Math.round(baseMax / Math.max(caseInfo.typicalHearings, 1));
    const estimatedHearingCostMin = perHearingMin * Number(estimatedHearings || 1);
    const estimatedHearingCostMax = perHearingMax * Number(estimatedHearings || 1);

    const totalProjectedMin = baseMin + draftingCost + noticeCost + clerkageAllowance;
    const totalProjectedMax = baseMax + draftingCost + noticeCost + Math.round(baseMax * 0.10);

    // Legal Aid eligibility check under Legal Services Authorities Act 1987 (NALSA / SLSA)
    // Eligible: Women, Children, SC/ST, Industrial Workmen, Disabled, or Annual Income < ₹3,00,000 (varies by state)
    const incomeNum = Number(annualIncome) || 0;
    const isFreeLegalAidEligible = checkLegalAid && (incomeNum > 0 && incomeNum <= 300000);

    const courtTitle = advocateCourtLevel === 'district'
      ? 'District & Sessions Court'
      : advocateCourtLevel === 'highcourt'
        ? 'High Court'
        : 'Supreme Court of India';

    const receiptText = `════ DHAARAAI ADVOCATE PROFESSIONAL FEE AUDIT ════
Standards: BAR COUNCIL OF INDIA RULES & HIGH COURT RULES
Case Category: ${caseInfo.labelEn}
Court Hierarchy: ${courtTitle}
Seniority: ${advocateSeniority === 'senior' ? 'Senior Advocate / Designated Counsel' : 'Junior Advocate / Associate Counsel'}
Estimated Hearings: ${estimatedHearings}
--------------------------------------------------
1. Base Professional Retainer / Brief: ${formatCurrency(baseMin)} — ${formatCurrency(baseMax)}
2. Drafting & Pleadings Fee: ${formatCurrency(draftingCost)}
3. Legal Notice / Pre-litigation: ${formatCurrency(noticeCost)}
4. Clerkage & Sundry Expenses (10%): ${formatCurrency(clerkageAllowance)}
TOTAL PROJECTED EXPENDITURE: ${formatCurrency(totalProjectedMin)} — ${formatCurrency(totalProjectedMax)}
NALSA / Free Legal Aid Status: ${isFreeLegalAidEligible ? 'QUALIFIES FOR FREE LEGAL AID (NALSA/DLSA)' : 'Standard Private Retainer'}
*Indicative estimate based on Bar Council of India benchmarks.`;

    return (
      <div className="fee-calculator__panel animate-fade-in">
        <div className="fee-calculator__panel-form">
          <div className="fee-calc__header-group">
            <h3 className="fee-calculator__panel-title">
              {isHindi ? 'अधिवक्ता शुल्क एवं NALSA विधिक सहायता स्टूडियो' : 'Advocate Fee Benchmark & Free Legal Aid Studio'}
            </h3>
            <p className="fee-calc__section-desc">
              {isHindi
                ? 'बार काउंसिल नियम, सुनवाई लागत, ड्राफ्टिंग शुल्क एवं NALSA मुफ्त विधिक सेवा पात्रता'
                : 'Comprehensive Bar Council norms, hearing-based expenditure, drafting fees, and NALSA free legal aid eligibility.'}
            </p>
          </div>

          <div className="fee-calculator__form-grid">
            <div className="form-group full-width">
              <label className="form-label">{isHindi ? 'मामले की प्रकृति' : 'Case Matter & Subject'}</label>
              <select className="input-field" value={caseType} onChange={e => setCaseType(e.target.value)}>
                {ADVOCATE_FEE_SCALES.map(c => (
                  <option key={c.id} value={c.id}>{isHindi ? c.labelHi : c.labelEn}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{isHindi ? 'न्यायालय स्तर' : 'Judicial Forum / Court Level'}</label>
              <select className="input-field" value={advocateCourtLevel} onChange={e => setAdvocateCourtLevel(e.target.value)}>
                <option value="district">{isHindi ? 'जिला व सत्र न्यायालय' : 'District & Sessions Court'}</option>
                <option value="highcourt">{isHindi ? 'उच्च न्यायालय (High Court)' : 'High Court'}</option>
                <option value="supremecourt">{isHindi ? 'सर्वोच्च न्यायालय (Supreme Court)' : 'Supreme Court of India'}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{isHindi ? 'अधिवक्ता का अनुभव' : 'Counsel Seniority Tier'}</label>
              <select className="input-field" value={advocateSeniority} onChange={e => setAdvocateSeniority(e.target.value)}>
                <option value="junior">{isHindi ? 'जूनियर / मध्यवर्ती अधिवक्ता (1-7 Years)' : 'Junior / Mid-level Advocate (1-7 Years)'}</option>
                <option value="senior">{isHindi ? 'वरिष्ठ अधिवक्ता / विशेषज्ञ (10+ Years)' : 'Senior Advocate / Specialized Counsel (10+ Years)'}</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">{isHindi ? 'अनुमानित सुनवाई संख्या' : 'Projected Effective Hearings'}</label>
              <input
                type="number"
                className="input-field"
                value={estimatedHearings}
                onChange={e => setEstimatedHearings(e.target.value)}
                min="1"
                max="50"
              />
            </div>
          </div>

          {/* Add-on services */}
          <div className="fee-calc__check-stack">
            <label className="fee-calc__checkbox-label">
              <input
                type="checkbox"
                checked={includeDrafting}
                onChange={e => setIncludeDrafting(e.target.checked)}
              />
              <span>{isHindi ? `ड्राफ्टिंग व याचिका निर्माण शामिल (+₹${caseInfo.draftingFee.toLocaleString()})` : `Include Petition & Pleadings Drafting (+₹${caseInfo.draftingFee.toLocaleString()})`}</span>
            </label>
            <label className="fee-calc__checkbox-label">
              <input
                type="checkbox"
                checked={includeLegalNotice}
                onChange={e => setIncludeLegalNotice(e.target.checked)}
              />
              <span>{isHindi ? `विधिक नोटिस जारी करना (+₹${caseInfo.noticeFee.toLocaleString()})` : `Include Statutory Legal Notice (+₹${caseInfo.noticeFee.toLocaleString()})`}</span>
            </label>
            <label className="fee-calc__checkbox-label">
              <input
                type="checkbox"
                checked={checkLegalAid}
                onChange={e => setCheckLegalAid(e.target.checked)}
              />
              <span>{isHindi ? 'NALSA मुफ्त कानूनी सहायता पात्रता जांचें (Free Legal Aid Check)' : 'Check NALSA Free Legal Aid Eligibility (Legal Services Authorities Act)'}</span>
            </label>
          </div>

          {checkLegalAid && (
            <div className="form-group full-width animate-fade-in" style={{ marginTop: '12px' }}>
              <label className="form-label">{isHindi ? 'आवेदक की वार्षिक आय (₹)' : 'Applicant Annual Household Income (₹)'}</label>
              <div className="fee-calculator__input-wrap">
                <IndianRupee size={16} className="fee-calculator__currency-icon" />
                <input
                  type="number"
                  className="input-field"
                  value={annualIncome}
                  onChange={e => setAnnualIncome(e.target.value)}
                  placeholder="e.g. 250000"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
              {isFreeLegalAidEligible && (
                <div className="fee-calc__legal-aid-banner">
                  <ShieldCheck size={16} color="var(--accent)" />
                  <span>
                    {isHindi
                      ? 'बधाई! आपकी आय ₹3,00,000 से कम होने के कारण आप NALSA / DLSA के तहत 100% मुफ्त सरकारी वकील के पात्र हैं।'
                      : 'Eligible for 100% Free Government Legal Representation under NALSA / District Legal Services Authority (DLSA).'}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Range Display for Advocate Fees */}
        <div className="fee-statutory-receipt animate-fade-in">
          <div className="fee-statutory-receipt__top-bar">
            <div className="fee-statutory-receipt__badge">
              <Scale size={12} />
              <span>BAR COUNCIL OF INDIA NORMS</span>
            </div>
            <span className="fee-statutory-receipt__series">SCHEDULE IV • ADVOCATE ESTIMATE</span>
          </div>

          <div className="fee-statutory-receipt__body">
            <div className="fee-statutory-receipt__header-motif">
              <div className="fee-statutory-receipt__crest">
                <Scale size={20} className="fee-statutory-receipt__crest-icon" />
              </div>
              <div className="fee-statutory-receipt__heading-wrap">
                <h4 className="fee-statutory-receipt__title">{isHindi ? 'अधिवक्ता शुल्क अनुमान' : 'ADVOCATE PROFESSIONAL EXPENDITURE'}</h4>
                <span className="fee-statutory-receipt__subtitle">{courtTitle}</span>
              </div>
            </div>

            <div className="fee-statutory-receipt__metadata">
              <div className="fee-statutory-receipt__meta-item">
                <span className="fee-statutory-receipt__meta-label">{isHindi ? 'मामला' : 'Case Matter'}</span>
                <span className="fee-statutory-receipt__meta-val">{isHindi ? caseInfo.labelHi : caseInfo.labelEn}</span>
              </div>
              <div className="fee-statutory-receipt__meta-item">
                <span className="fee-statutory-receipt__meta-label">{isHindi ? 'वरिष्ठता स्तर' : 'Counsel Tier'}</span>
                <span className="fee-statutory-receipt__meta-val">{advocateSeniority === 'senior' ? 'Senior Counsel' : 'Junior Counsel'}</span>
              </div>
            </div>

            <div className="fee-statutory-receipt__divider" />

            <div className="fee-statutory-receipt__lines">
              <div className="fee-statutory-receipt__line">
                <span className="fee-statutory-receipt__line-label">Base Brief / Retainer Fee</span>
                <div className="fee-statutory-receipt__dots" />
                <span className="fee-statutory-receipt__line-val font-mono">
                  {formatCurrency(baseMin)} – {formatCurrency(baseMax)}
                </span>
              </div>
              <div className="fee-statutory-receipt__line">
                <span className="fee-statutory-receipt__line-label">Pleadings Drafting (Petitions/Affidavits)</span>
                <div className="fee-statutory-receipt__dots" />
                <span className="fee-statutory-receipt__line-val font-mono">{formatCurrency(draftingCost)}</span>
              </div>
              <div className="fee-statutory-receipt__line">
                <span className="fee-statutory-receipt__line-label">Statutory Legal Notice</span>
                <div className="fee-statutory-receipt__dots" />
                <span className="fee-statutory-receipt__line-val font-mono">{formatCurrency(noticeCost)}</span>
              </div>
              <div className="fee-statutory-receipt__line">
                <span className="fee-statutory-receipt__line-label">Clerkage & Court Sundries (10%)</span>
                <div className="fee-statutory-receipt__dots" />
                <span className="fee-statutory-receipt__line-val font-mono">~{formatCurrency(clerkageAllowance)}</span>
              </div>
              <div className="fee-statutory-receipt__line">
                <span className="fee-statutory-receipt__line-label">Per Hearing Range ({estimatedHearings} hearings)</span>
                <div className="fee-statutory-receipt__dots" />
                <span className="fee-statutory-receipt__line-val font-mono">
                  {formatCurrency(perHearingMin)} – {formatCurrency(perHearingMax)} / session
                </span>
              </div>
            </div>

            <div className="fee-statutory-receipt__divider-heavy" />

            <div className="fee-calc__advocate-range">
              <div className="fee-calc__range-label">{isHindi ? 'अनुमानित न्यूनतम' : 'Projected Minimum'}</div>
              <div className="fee-calc__range-val font-mono">{formatCurrency(totalProjectedMin)}</div>
              <div className="fee-calc__range-sep">–</div>
              <div className="fee-calc__range-label">{isHindi ? 'अनुमानित अधिकतम' : 'Projected Maximum'}</div>
              <div className="fee-calc__range-val font-mono is-max">{formatCurrency(totalProjectedMax)}</div>
            </div>

            <div className="fee-statutory-receipt__calculated-footer">
              <div className="fee-statutory-receipt__note">
                <AlertCircle size={13} className="fee-statutory-receipt__note-icon" />
                <span>
                  {isFreeLegalAidEligible
                    ? 'Qualified for 100% Free Legal Aid via DLSA.'
                    : '* Indicative Bar Council range. Actual remuneration is subject to mutual Advocate-Client fee agreement.'}
                </span>
              </div>
              <button
                className="fee-statutory-receipt__copy-btn"
                onClick={() => copyReceiptToClipboard(receiptText)}
                type="button"
              >
                {copiedReceipt ? <Check size={14} color="var(--accent)" /> : <Copy size={14} />}
                <span>{copiedReceipt ? 'Copied!' : (isHindi ? 'रसीद कॉपी करें' : 'Copy Full Retainer Audit')}</span>
              </button>
            </div>
          </div>

          <div className="fee-statutory-receipt__security-edge">
            <span>SECURITY AUDIT • DHAARAAI STATUTORY ENGINE • BCI STANDARDS SCHEDULE</span>
          </div>
        </div>
      </div>
    );
  };

  // 6 EXACT ORIGINAL MODULES AS TABS
  const TABS = [
    { id: 'property', icon: Building, labelEn: 'Property & Registry', labelHi: 'संपत्ति पंजीकरण', isPro: true },
    { id: 'court', icon: Landmark, labelEn: 'Civil Court Fee', labelHi: 'दीवानी कोर्ट फीस' },
    { id: 'consumer', icon: ShoppingCart, labelEn: 'Consumer Commission', labelHi: 'उपभोक्ता आयोग' },
    { id: 'traffic', icon: Car, labelEn: 'Traffic Challan', labelHi: 'ट्रैफिक चालान' },
    { id: 'gst', icon: Receipt, labelEn: 'GST Late Fee', labelHi: 'GST विलंब शुल्क', isPro: true },
    { id: 'advocate', icon: Scale, labelEn: 'Advocate Fee Studio', labelHi: 'वकील शुल्क' },
  ];

  return (
    <div className="fee-calculator animate-fade-in">
      <div className="fee-calculator__header">
        <div className="fee-calculator__header-left">
          <div className="fee-calculator__icon-badge">
            <Calculator size={22} />
          </div>
          <div>
            <div className="fee-calculator__title-row">
              <h2 className="fee-calculator__title">
                {isHindi ? 'न्यायालय शुल्क और स्टाम्प ड्यूटी स्टूडियो' : 'Legal Fee & Stamp Duty Studio'}
              </h2>
              {/* <span className="fee-calc__version-badge">Advanced Statutory v2.4</span> */}
            </div>
            <p className="fee-calculator__subtitle">
              {isHindi
                ? '6 प्रमुख विधिक मॉड्यूल: संपत्ति स्टाम्प, दीवानी कोर्ट, उपभोक्ता, ट्रैफिक, GST एवं अधिवक्ता शुल्क'
                : '6 Dedicated Statutory Modules'}
            </p>
          </div>
        </div>

        <div className="module-banner-visual" aria-hidden="true">
          <img
            src="/assets/legal/fees/property_registry.webp"
            alt=""
            className="module-banner-image"
            loading="lazy"
          />
          <div className="module-banner-gradient" />
        </div>
      </div>

      <div className="fee-calculator__tabs-bar" role="tablist">
        {TABS.map(({ id, icon: Icon, labelEn, labelHi, isPro: tabIsPro }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={calcType === id}
            onClick={() => setCalcType(id)}
            className={`fee-calculator__tab-btn ${calcType === id ? 'is-active' : ''}`}
            style={{ position: 'relative' }}
          >
            <Icon size={16} />
            <span>{isHindi ? labelHi : labelEn}</span>
            {tabIsPro && !isPro && (
              <span
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '999px',
                  marginLeft: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                🔒 PRO
              </span>
            )}
          </button>
        ))}
      </div>

      {calcType === 'property' && renderPropertyCalc()}
      {calcType === 'court' && renderCourtCalc()}
      {calcType === 'consumer' && renderConsumerCalc()}
      {calcType === 'traffic' && renderTrafficCalc()}
      {calcType === 'gst' && renderGstCalc()}
      {calcType === 'advocate' && renderAdvocateCalc()}
    </div>
  );
}
