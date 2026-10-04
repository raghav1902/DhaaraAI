import React, { useState } from 'react';
import { Calculator, Building, Landmark, AlertCircle, FileText, IndianRupee, Car, ShoppingCart, Check, Copy } from 'lucide-react';
import { STAMP_DUTY_RATES, TRAFFIC_VIOLATIONS } from '../data/feeCalculatorData';
import './FeeCalculator.css';

export default function FeeCalculator({ language = 'English' }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [calcType, setCalcType] = useState('property');
  const [state, setState] = useState('Delhi');
  const [propertyValue, setPropertyValue] = useState('');
  const [buyerGender, setBuyerGender] = useState('male');

  const [suitValue, setSuitValue] = useState('');
  const [consumerValue, setConsumerValue] = useState('');
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const copyReceiptToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  /**
   * Premium Editorial Statutory Document / Digital Receipt Component
   * Resembles an official Indian Registry Stamp Paper & Revenue Assessment
   */
  const renderStatutoryReceipt = ({
    documentTitle,
    scheduleCode,
    subTitle,
    jurisdictionLabel,
    jurisdictionVal,
    valuationLabel,
    valuationVal,
    lines,
    totalVal,
    isCalculated,
    emptyPrompt,
    receiptText,
    statutoryNote
  }) => (
    <div className="fee-statutory-receipt animate-fade-in" aria-label="Statutory Fee Estimate Document">
      {/* Top Document Header Bar */}
      <div className="fee-statutory-receipt__top-bar">
        <div className="fee-statutory-receipt__badge">
          <FileText size={12} />
          <span>{scheduleCode}</span>
        </div>
        <span className="fee-statutory-receipt__series">FORM VIII • STATUTORY ASSESSMENT</span>
      </div>

      {/* Main Document Body */}
      <div className="fee-statutory-receipt__body">
        {/* Official Registry Paper Watermark / Header Motif */}
        <div className="fee-statutory-receipt__header-motif">
          <div className="fee-statutory-receipt__crest">
            <Landmark size={20} className="fee-statutory-receipt__crest-icon" />
          </div>
          <div className="fee-statutory-receipt__heading-wrap">
            <h4 className="fee-statutory-receipt__title">{documentTitle}</h4>
            <span className="fee-statutory-receipt__subtitle">{subTitle}</span>
          </div>
        </div>

        {/* Assessment Parameter Details */}
        <div className="fee-statutory-receipt__metadata">
          <div className="fee-statutory-receipt__meta-item">
            <span className="fee-statutory-receipt__meta-label">{jurisdictionLabel}</span>
            <span className="fee-statutory-receipt__meta-val">{jurisdictionVal}</span>
          </div>
          <div className="fee-statutory-receipt__meta-item">
            <span className="fee-statutory-receipt__meta-label">{valuationLabel}</span>
            <span className="fee-statutory-receipt__meta-val font-mono">
              {valuationVal > 0 ? formatCurrency(valuationVal) : '₹ —'}
            </span>
          </div>
        </div>

        <div className="fee-statutory-receipt__divider" />

        {/* Itemized Statutory Lines */}
        <div className="fee-statutory-receipt__lines">
          {lines.map((item, idx) => (
            <div key={idx} className="fee-statutory-receipt__line">
              <span className="fee-statutory-receipt__line-label">{item.label}</span>
              <div className="fee-statutory-receipt__dots" />
              <span className={`fee-statutory-receipt__line-val font-mono ${item.highlight ? 'is-highlight' : ''}`}>
                {isCalculated ? item.value : '₹ —'}
              </span>
            </div>
          ))}
        </div>

        <div className="fee-statutory-receipt__divider-heavy" />

        {/* Total Outlay Row */}
        <div className="fee-statutory-receipt__total-row">
          <div>
            <span className="fee-statutory-receipt__total-label">
              {isHindi ? 'कुल अनुमानित विधिक शुल्क' : 'ESTIMATED TOTAL'}
            </span>
            <span className="fee-statutory-receipt__total-sub">
              {isCalculated
                ? (isHindi ? 'देय सरकारी शुल्क' : 'Statutory Government Outlay')
                : (isHindi ? 'गणना लंबित' : 'Awaiting Calculation')}
            </span>
          </div>
          <span className={`fee-statutory-receipt__total-val font-mono ${isCalculated ? 'is-calculated' : 'is-empty'}`}>
            {isCalculated ? formatCurrency(totalVal) : '₹ —'}
          </span>
        </div>

        {/* Dynamic Action / Prompt Box */}
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
              {copiedReceipt ? <Check size={14} color="var(--emerald-600)" /> : <Copy size={14} />}
              <span>{copiedReceipt ? (isHindi ? 'कॉपी हो गया' : 'Copied to Clipboard') : (isHindi ? 'रसीद कॉपी करें' : 'Copy Official Breakdown')}</span>
            </button>
          </div>
        ) : (
          <div className="fee-statutory-receipt__prompt">
            <div className="fee-statutory-receipt__prompt-dot" />
            <span>{emptyPrompt}</span>
          </div>
        )}
      </div>

      {/* Perforated Security Footer Notch */}
      <div className="fee-statutory-receipt__security-edge">
        <span>SECURITY WATERMARK • DHAARAAI STATUTORY ENGINE • SCHEDULE VERIFIED</span>
      </div>
    </div>
  );

  const renderPropertyCalc = () => {
    const val = Number(propertyValue) || 0;
    const rates = STAMP_DUTY_RATES[state] || STAMP_DUTY_RATES['Delhi'];
    const stampRate = rates[buyerGender] || rates['male'];
    const regRate = rates.registry;

    const stampDuty = (val * stampRate) / 100;
    const regFee = (val * regRate) / 100;
    const total = stampDuty + regFee;

    const receiptText = `DHAARAAI STATUTORY FEE RECEIPT - PROPERTY REGISTRATION\nState: ${state}\nBuyer Category: ${buyerGender}\nDeclared Property Value: ${formatCurrency(val)}\nStamp Duty (${stampRate}%): ${formatCurrency(stampDuty)}\nRegistration Fee (${regRate}%): ${formatCurrency(regFee)}\nTOTAL ESTIMATED STATUTORY OUTLAY: ${formatCurrency(total)}\n*Subject to local municipal corporation surcharges.`;

    return (
      <div className="fee-calculator__panel animate-fade-in">
        <div className="fee-calculator__panel-form">
          <h3 className="fee-calculator__panel-title">
            {isHindi ? 'संपत्ति पंजीकरण और स्टाम्प ड्यूटी गणना' : 'Property Registration & Stamp Duty'}
          </h3>

          <div className="fee-calculator__form-grid">
            <div className="form-group">
              <label className="form-label">
                {isHindi ? 'राज्य चुनें' : 'Jurisdiction / State'}
              </label>
              <select className="input-field" value={state} onChange={(e) => setState(e.target.value)}>
                {Object.keys(STAMP_DUTY_RATES).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">
                {isHindi ? 'खरीदार का लिंग (छूट हेतु)' : 'Buyer Category (Concessions)'}
              </label>
              <select className="input-field" value={buyerGender} onChange={(e) => setBuyerGender(e.target.value)}>
                <option value="male">{isHindi ? 'पुरुष (General Male)' : 'Male (Standard)'}</option>
                <option value="female">{isHindi ? 'महिला (Female - Statutory Rebate)' : 'Female (Concession)'}</option>
                <option value="joint">{isHindi ? 'संयुक्त (Joint Ownership)' : 'Joint (Husband & Wife)'}</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                {isHindi ? 'संपत्ति का बाजार या सर्कल रेट मूल्य (₹)' : 'Property Market Value or Circle Rate (₹)'}
              </label>
              <div className="fee-calculator__input-wrap">
                <IndianRupee size={16} className="fee-calculator__currency-icon" />
                <input
                  type="number"
                  className="input-field"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                  placeholder="e.g. 5000000"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {renderStatutoryReceipt({
          documentTitle: isHindi ? 'स्टाम्प ड्यूटी एवं निबंधन शुल्क मूल्यांकन' : 'STATUTORY FEE ESTIMATE',
          scheduleCode: 'INDIAN STAMP ACT 1899',
          subTitle: isHindi ? 'उप-निबंधक कार्यालय विधिक अनुसूची' : 'Department of Revenue & Sub-Registrar Assessment',
          jurisdictionLabel: isHindi ? 'अधिसूचित राज्य / सर्कल' : 'Jurisdiction / State',
          jurisdictionVal: state,
          valuationLabel: isHindi ? 'घोषित संपत्ति मूल्यांकन' : 'Declared Market Valuation',
          valuationVal: val,
          lines: [
            { label: `${isHindi ? 'स्टाम्प ड्यूटी' : 'Stamp Duty'} (${stampRate}%)`, value: formatCurrency(stampDuty) },
            { label: `${isHindi ? 'पंजीकरण शुल्क' : 'Registration Fee'} (${regRate}%)`, value: formatCurrency(regFee) },
            {
              label: isHindi ? 'महिला/संयुक्त छूट' : 'Gender Concession / Rebate',
              value: buyerGender === 'female'
                ? (isHindi ? 'लागू (महिला छूट)' : 'Applied (Statutory Rebate)')
                : buyerGender === 'joint'
                ? (isHindi ? 'संयुक्त स्वामित्व' : 'Joint Ownership Rate')
                : (isHindi ? 'मानक दर (पुरुष)' : 'Standard Male Rate'),
              highlight: buyerGender === 'female'
            }
          ],
          totalVal: total,
          isCalculated: val > 0,
          emptyPrompt: isHindi
            ? 'बाईं ओर संपत्ति का मूल्य दर्ज करें। राज्य स्टाम्प ड्यूटी, पंजीकरण शुल्क और महिला छूट की मदवार रसीद यहां प्रदर्शित होगी।'
            : 'Enter property value on the left to calculate live statutory duty and registration charges.',
          receiptText,
          statutoryNote: isHindi
            ? '* अनुमानित आंकड़े संबंधित राज्य के स्टाम्प अधिनियम अनुसार हैं। नगर निगम या सेस शुल्क अतिरिक्त हो सकते हैं।'
            : '* Estimate based on State Stamp Duty Schedules. Additional municipal/cess surcharges may apply at sub-registrar.'
        })}
      </div>
    );
  };

  const renderCourtCalc = () => {
    const val = Number(suitValue) || 0;
    let courtFee = 0;
    if (val <= 100000) courtFee = val * 0.03;
    else if (val <= 500000) courtFee = 3000 + (val - 100000) * 0.02;
    else courtFee = 11000 + (val - 500000) * 0.01;

    if (courtFee > 300000) courtFee = 300000;

    const receiptText = `DHAARAAI STATUTORY FEE RECEIPT - CIVIL COURT SUIT\nSuit Disputed Value: ${formatCurrency(val)}\nAd-Valorem Estimation: ${formatCurrency(courtFee)}\n*Subject to Court Fees Act 1870 and specific High Court schedules.`;

    return (
      <div className="fee-calculator__panel animate-fade-in">
        <div className="fee-calculator__panel-form">
          <h3 className="fee-calculator__panel-title">
            {isHindi ? 'दीवानी मुकदमा न्यायालय शुल्क अनुमान' : 'Civil Suit Ad-Valorem Court Fee'}
          </h3>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">
              {isHindi ? 'दावा राशि / विवादित विषय-वस्तु का मूल्य (₹)' : 'Suit Claim Amount / Subject Matter Value (₹)'}
            </label>
            <div className="fee-calculator__input-wrap">
              <IndianRupee size={16} className="fee-calculator__currency-icon" />
              <input
                type="number"
                className="input-field"
                value={suitValue}
                onChange={(e) => setSuitValue(e.target.value)}
                placeholder="e.g. 1000000"
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>
        </div>

        {renderStatutoryReceipt({
          documentTitle: isHindi ? 'दीवानी मुकदमा न्यायालय शुल्क रसीद' : 'STATUTORY COURT FEE ESTIMATE',
          scheduleCode: 'COURT FEES ACT 1870',
          subTitle: isHindi ? 'अदालत शुल्क एवं वाद मूल्यांकन अनुसूची' : 'Ad-Valorem Plaint Valuation Schedule',
          jurisdictionLabel: isHindi ? 'दावे का विषय' : 'Suit Category',
          jurisdictionVal: isHindi ? 'दीवानी वाद (Plaint/Suit for Recovery)' : 'Plaint / Recovery / Declaration Suit',
          valuationLabel: isHindi ? 'विवादित दावा मूल्य' : 'Subject Valuation Claim',
          valuationVal: val,
          lines: [
            { label: isHindi ? 'दावा राशि' : 'Claimed Subject Matter', value: formatCurrency(val) },
            { label: isHindi ? 'एड-वैलोरेम स्लैब दर' : 'Ad-Valorem Slab Rate', value: val <= 100000 ? '3.00%' : val <= 500000 ? '2.00% + Base' : '1.00% + Base' },
            { label: isHindi ? 'अधिकतम सांविधिक सीमा' : 'Statutory Fee Ceiling', value: '₹ 3,00,000 (Max Cap)' }
          ],
          totalVal: courtFee,
          isCalculated: val > 0,
          emptyPrompt: isHindi
            ? 'दीवानी मुकदमे की दावा राशि दर्ज करें। कोर्ट फीस एक्ट 1870 के अनुसार स्लैबवार अनुमान यहां दिखेगा।'
            : 'Enter suit claim or disputed property valuation to calculate ad-valorem court fees.',
          receiptText,
          statutoryNote: isHindi
            ? '* यह कोर्ट फीस एक्ट 1870 के मानक स्लैब अनुसार अनुमान है। संबंधित उच्च न्यायालय नियमावली अनुसार मामूली अंतर संभव है।'
            : '* Standard ad-valorem estimate. Exact fees depend on State Court Fees Amendments and High Court Rules.'
        })}
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

    const forumLevel =
      val <= 5000000
        ? 'District Consumer Commission (DCDRC)'
        : val <= 20000000
        ? 'State Consumer Commission (SCDRC)'
        : 'National Consumer Commission (NCDRC)';

    const receiptText = `DHAARAAI STATUTORY FEE RECEIPT - CONSUMER PROTECTION ACT 2019\nClaim Amount: ${formatCurrency(val)}\nJurisdiction Forum: ${forumLevel}\nStatutory Filing Fee: ${fee === 0 ? 'NIL (Exempt up to 5 Lakhs)' : formatCurrency(fee)}`;

    return (
      <div className="fee-calculator__panel animate-fade-in">
        <div className="fee-calculator__panel-form">
          <h3 className="fee-calculator__panel-title">
            {isHindi ? 'उपभोक्ता आयोग शिकायत शुल्क (CPA 2019)' : 'Consumer Commission Filing Fee (CPA 2019)'}
          </h3>

          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label">
              {isHindi ? 'मुआवजे सहित कुल दावा राशि (₹)' : 'Total Value of Goods / Services + Compensation Claimed (₹)'}
            </label>
            <div className="fee-calculator__input-wrap">
              <IndianRupee size={16} className="fee-calculator__currency-icon" />
              <input
                type="number"
                className="input-field"
                value={consumerValue}
                onChange={(e) => setConsumerValue(e.target.value)}
                placeholder="e.g. 500000"
                style={{ paddingLeft: '38px' }}
              />
            </div>
          </div>
        </div>

        {renderStatutoryReceipt({
          documentTitle: isHindi ? 'उपभोक्ता आयोग शिकायत शुल्क रसीद' : 'CONSUMER FORUM FEE ESTIMATE',
          scheduleCode: 'CONSUMER PROTECTION ACT 2019',
          subTitle: isHindi ? 'उपभोक्ता संरक्षण (फोरम प्रक्रिया) नियमावली 2020' : 'Consumer Protection (Filing & Procedure) Rules 2020',
          jurisdictionLabel: isHindi ? 'सक्षम न्यायालय / फोरम' : 'Statutory Forum Jurisdiction',
          jurisdictionVal: forumLevel,
          valuationLabel: isHindi ? 'दावा व क्षतिपूर्ति राशि' : 'Total Goods/Services + Relief Claimed',
          valuationVal: val,
          lines: [
            { label: isHindi ? 'दावा मूल्यांकन' : 'Dispute Claim Valuation', value: formatCurrency(val) },
            { label: isHindi ? 'न्यायाधिकार फोरम' : 'Statutory Jurisdiction', value: forumLevel.split(' (')[0] },
            {
              label: isHindi ? '₹5 लाख तक छूट' : 'Exemption Status (Up to ₹5L)',
              value: val <= 500000 ? (isHindi ? 'निःशुल्क (Nil Fee)' : 'Statutory Exemption (Nil)') : (isHindi ? 'सशुल्क स्लैब' : 'Applicable Tier Fee'),
              highlight: val <= 500000 && val > 0
            }
          ],
          totalVal: fee,
          isCalculated: val > 0,
          emptyPrompt: isHindi
            ? 'वस्तु या सेवा का मूल्य दर्ज करें। जिला, राज्य या राष्ट्रीय आयोग का अधिकार क्षेत्र और फाइलिंग शुल्क यहां दिखेगा।'
            : 'Enter consumer claim value to determine statutory jurisdiction and filing fee.',
          receiptText,
          statutoryNote: isHindi
            ? '* उपभोक्ता संरक्षण नियम 2020 के अनुसार ₹5 लाख तक के उपभोक्ता दावों पर कोई शुल्क नहीं लगता है।'
            : '* Under Consumer Protection Rules 2020, consumer complaints up to ₹5,00,000 carry zero filing fee.'
        })}
      </div>
    );
  };

  const handleViolationChange = (id) => {
    if (selectedViolations.includes(id)) {
      setSelectedViolations(selectedViolations.filter((v) => v !== id));
    } else {
      setSelectedViolations([...selectedViolations, id]);
    }
  };

  const renderTrafficCalc = () => {
    const totalFine = selectedViolations.reduce((sum, id) => {
      const v = TRAFFIC_VIOLATIONS.find((x) => x.id === id);
      return sum + (v ? v.fine : 0);
    }, 0);

    const violationsList = selectedViolations
      .map((id) => {
        const v = TRAFFIC_VIOLATIONS.find((x) => x.id === id);
        return v ? `- ${v.labelEn}: ${formatCurrency(v.fine)}` : '';
      })
      .filter(Boolean)
      .join('\n');

    const receiptText = `DHAARAAI STATUTORY FEE RECEIPT - TRAFFIC CHALLAN (MV ACT 2019/2024)\n${violationsList}\nTOTAL ESTIMATED STATUTORY COMPOUNDING FINE: ${formatCurrency(totalFine)}`;

    return (
      <div className="fee-calculator__panel animate-fade-in">
        <div className="fee-calculator__panel-form">
          <h3 className="fee-calculator__panel-title">
            {isHindi ? 'यातायात चालान जुर्माना तालिका (मोटर वाहन अधिनियम)' : 'Traffic Challan Fine Assessment (Motor Vehicles Act)'}
          </h3>

          <div style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ marginBottom: '10px' }}>
              {isHindi ? 'उल्लंघन चुनें (एक से अधिक चुन सकते हैं)' : 'Select Recorded Violations (Multiple allowed)'}
            </label>

            <div className="fee-calculator__violations-list">
              {TRAFFIC_VIOLATIONS.map((v) => {
                const isChecked = selectedViolations.includes(v.id);
                return (
                  <label
                    key={v.id}
                    className={`fee-calculator__violation-item ${isChecked ? 'is-selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleViolationChange(v.id)}
                      className="fee-calculator__violation-checkbox"
                    />
                    <span className="fee-calculator__violation-name">
                      {isHindi ? v.labelHi : v.labelEn}
                    </span>
                    <span className="fee-calculator__violation-fine font-mono">
                      {formatCurrency(v.fine)}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {renderStatutoryReceipt({
          documentTitle: isHindi ? 'यातायात चालान कंपाउंडिंग जुर्माना रसीद' : 'TRAFFIC COMPOUNDING ASSESSMENT',
          scheduleCode: 'MOTOR VEHICLES ACT 1988/2019',
          subTitle: isHindi ? 'सांविधिक कंपाउंडिंग जुर्माना सारणी' : 'Statutory Compoundable Offence Schedule',
          jurisdictionLabel: isHindi ? 'अपराध विधान' : 'Statute Category',
          jurisdictionVal: 'Motor Vehicles (Amendment) Act',
          valuationLabel: isHindi ? 'चिह्नित अपराधों की संख्या' : 'Selected Recorded Violations',
          valuationVal: selectedViolations.length,
          lines: [
            { label: isHindi ? 'दर्ज उल्लंघन' : 'Recorded Infractions', value: `${selectedViolations.length} ${isHindi ? 'उल्लंघन' : 'Violations'}` },
            { label: isHindi ? 'प्रथम अपराध कंपाउंडिंग' : 'Compounding Status', value: selectedViolations.length > 0 ? (isHindi ? 'कंपाउंडेबल' : 'Compoundable at Challan Desk') : '₹ —' },
            { label: isHindi ? 'न्यायालय पेशी विकल्प' : 'Court Trial Option', value: 'Virtual Court / Traffic Lok Adalat' }
          ],
          totalVal: totalFine,
          isCalculated: totalFine > 0,
          emptyPrompt: isHindi
            ? 'बाईं सूची से यातायात उल्लंघन चुनें। मोटर वाहन अधिनियम के अनुसार कुल कंपाउंडिंग राशि यहां बनेगी।'
            : 'Select traffic violations from the schedule to assess statutory compounding fines.',
          receiptText,
          statutoryNote: isHindi
            ? '* जुर्माना राशि संबंधित राज्य पुलिस नियमों और प्रथम/दोबारा अपराध की स्थिति के अनुसार भिन्न हो सकती है।'
            : '* Compounding penalty under MV Amendment Act. Repeat offences may attract higher statutory penalty or impoundment.'
        })}
      </div>
    );
  };

  return (
    <div className="fee-calculator animate-fade-in">
      {/* Header Banner */}
      <div className="fee-calculator__header">
        <div className="fee-calculator__header-left">
          <div className="fee-calculator__icon-badge">
            <Calculator size={22} />
          </div>
          <div>
            <div className="fee-calculator__title-row">
              <h2 className="fee-calculator__title">
                {isHindi ? 'न्यायालय शुल्क और स्टाम्प ड्यूटी कैलकुलेटर' : 'Legal Fee & Stamp Duty Studio'}
              </h2>
            </div>
            <p className="fee-calculator__subtitle">
              {isHindi
                ? 'नवीनतम राज्यवार दरों के आधार पर अपनी संपत्ति, न्यायालय शुल्क अथवा उपभोक्ता आयोग के खर्चों की रसीद बनाएं।'
                : 'Accurate statutory calculation of Property Stamp Duty, Civil Court Fees, Consumer Court, and Traffic Compounding Fines.'}
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

      {/* Segmented Tab Controls */}
      <div className="fee-calculator__tabs-bar" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={calcType === 'property'}
          onClick={() => setCalcType('property')}
          className={`fee-calculator__tab-btn ${calcType === 'property' ? 'is-active' : ''}`}
        >
          <Building size={16} />
          <span>{isHindi ? 'संपत्ति स्टाम्प' : 'Property & Registry'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={calcType === 'court'}
          onClick={() => setCalcType('court')}
          className={`fee-calculator__tab-btn ${calcType === 'court' ? 'is-active' : ''}`}
        >
          <Landmark size={16} />
          <span>{isHindi ? 'दीवानी कोर्ट फीस' : 'Civil Court Fee'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={calcType === 'consumer'}
          onClick={() => setCalcType('consumer')}
          className={`fee-calculator__tab-btn ${calcType === 'consumer' ? 'is-active' : ''}`}
        >
          <ShoppingCart size={16} />
          <span>{isHindi ? 'उपभोक्ता आयोग' : 'Consumer Court'}</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={calcType === 'traffic'}
          onClick={() => setCalcType('traffic')}
          className={`fee-calculator__tab-btn ${calcType === 'traffic' ? 'is-active' : ''}`}
        >
          <Car size={16} />
          <span>{isHindi ? 'ट्रैफिक चालान' : 'Traffic Challan'}</span>
        </button>
      </div>

      {/* Calculator Body */}
      {calcType === 'property' && renderPropertyCalc()}
      {calcType === 'court' && renderCourtCalc()}
      {calcType === 'consumer' && renderConsumerCalc()}
      {calcType === 'traffic' && renderTrafficCalc()}
    </div>
  );
}
