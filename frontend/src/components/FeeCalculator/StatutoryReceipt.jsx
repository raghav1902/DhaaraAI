import React, { useState } from 'react';
import { Landmark, AlertCircle, FileText, Check, Copy } from 'lucide-react';

export const formatCurrency = (val) => {
  const num = Number(val);
  if (!Number.isFinite(num) || isNaN(num) || num < 0) {
    return '₹0';
  }
  const safeNum = Math.min(Math.round(num), 1000000000000);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(safeNum);
};

export default function StatutoryReceipt({
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
  statutoryNote,
  badgeTag = 'FORM VIII • STATUTORY ASSESSMENT',
  isHindi = false
}) {
  const [copiedReceipt, setCopiedReceipt] = useState(false);

  const copyReceiptToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2000);
  };

  return (
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
}
