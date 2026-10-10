import React, { useState } from 'react';
import { Scale, AlertCircle, ShieldCheck, Check, Copy } from 'lucide-react';
import { ADVOCATE_FEE_SCALES } from '../../data/feeCalculatorData';
import { formatCurrency } from './StatutoryReceipt';
import RupeeInputField from './RupeeInputField';
import { STATUTORY_CEILINGS, cleanBoundedInt } from './currencyValidation';

export default function AdvocateFeeTab({ isHindi }) {
  const [caseType, setCaseType] = useState('civil');
  const [advocateCourtLevel, setAdvocateCourtLevel] = useState('district');
  const [advocateSeniority, setAdvocateSeniority] = useState('junior');
  const [includeDrafting, setIncludeDrafting] = useState(true);
  const [includeLegalNotice, setIncludeLegalNotice] = useState(false);
  const [estimatedHearings, setEstimatedHearings] = useState(6);
  const [checkLegalAid, setCheckLegalAid] = useState(false);
  const [annualIncome, setAnnualIncome] = useState('');
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const copyReceiptToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  const caseInfo = ADVOCATE_FEE_SCALES.find(c => c.id === caseType) || ADVOCATE_FEE_SCALES[0];

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

  const draftingCost = includeDrafting ? caseInfo.draftingFee : 0;
  const noticeCost = includeLegalNotice ? caseInfo.noticeFee : 0;
  const clerkageAllowance = Math.round(baseMin * 0.10);

  const perHearingMin = Math.round(baseMin / Math.max(caseInfo.typicalHearings, 1));
  const perHearingMax = Math.round(baseMax / Math.max(caseInfo.typicalHearings, 1));

  const totalProjectedMin = baseMin + draftingCost + noticeCost + clerkageAllowance;
  const totalProjectedMax = baseMax + draftingCost + noticeCost + Math.round(baseMax * 0.10);

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
            <label className="form-label" htmlFor="adv-hearings-count">
              {isHindi ? 'अनुमानित सुनवाई संख्या (1-50)' : 'Projected Effective Hearings (1-50)'}
            </label>
            <input
              id="adv-hearings-count"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              className="input-field"
              value={estimatedHearings}
              onChange={e => {
                const { cleanStr } = cleanBoundedInt(e.target.value, 1, STATUTORY_CEILINGS.advocateMaxHearings);
                setEstimatedHearings(cleanStr);
              }}
              onKeyDown={e => {
                if (['e', 'E', '+', '-', '.'].includes(e.key)) e.preventDefault();
              }}
              min="1"
              max="50"
            />
          </div>
        </div>

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
            <label className="form-label" htmlFor="adv-annual-income">
              {isHindi ? 'आवेदक की वार्षिक आय (₹)' : 'Applicant Annual Household Income (₹)'}
            </label>
            <RupeeInputField
              id="adv-annual-income"
              value={annualIncome}
              onChange={setAnnualIncome}
              placeholder="e.g. 250000"
              max={STATUTORY_CEILINGS.advocateIncome}
              isHindi={isHindi}
            />
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
}
