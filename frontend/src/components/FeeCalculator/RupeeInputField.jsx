import React, { useState } from 'react';
import { IndianRupee, X, AlertTriangle } from 'lucide-react';
import {
  cleanRupeeInput,
  formatIndianNumber,
  formatBilingualDenomination,
  STATUTORY_CEILINGS
} from './currencyValidation';

export default function RupeeInputField({
  id,
  value,
  onChange,
  placeholder = 'e.g. 5000000',
  max = STATUTORY_CEILINGS.property,
  isHindi = false,
  disabled = false,
  className = '',
  style = {}
}) {
  const [showCapAlert, setShowCapAlert] = useState(false);

  const numVal = Number(value) || 0;
  const hasValue = value !== undefined && value !== null && String(value).trim() !== '';

  const handleKeyDown = (e) => {
    // Prohibit exponent 'e'/'E', signs '+', '-', and decimal point '.'
    if (['e', 'E', '+', '-', '.'].includes(e.key)) {
      e.preventDefault();
      return;
    }

    // Permit navigation keys, control shortcuts, backspace, tab, delete
    if (
      e.key === 'Backspace' ||
      e.key === 'Delete' ||
      e.key === 'Tab' ||
      e.key === 'Enter' ||
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'Home' ||
      e.key === 'End' ||
      e.ctrlKey ||
      e.metaKey
    ) {
      return;
    }

    // Block any non-digit character
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    const { cleanStr, isCapped } = cleanRupeeInput(raw, max);

    if (isCapped) {
      setShowCapAlert(true);
      setTimeout(() => setShowCapAlert(false), 3000);
    } else {
      setShowCapAlert(false);
    }

    if (onChange) {
      onChange(cleanStr);
    }
  };

  const handleClear = () => {
    setShowCapAlert(false);
    if (onChange) {
      onChange('');
    }
  };

  const denominationText = numVal >= 1000 ? formatBilingualDenomination(numVal) : '';

  return (
    <div className={`fee-calc-rupee-container ${className}`} style={style}>
      <div className="fee-calculator__input-wrap">
        <IndianRupee size={16} className="fee-calculator__currency-icon" aria-hidden="true" />
        <input
          id={id}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          className="input-field fee-calc-rupee-input"
          value={value ?? ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            paddingLeft: '38px',
            paddingRight: hasValue && !disabled ? '36px' : '14px',
            opacity: disabled ? 0.5 : 1
          }}
          aria-label={placeholder}
        />
        {hasValue && !disabled && (
          <button
            type="button"
            className="fee-calc-clear-btn"
            onClick={handleClear}
            title={isHindi ? 'हटाएं' : 'Clear'}
            aria-label={isHindi ? 'मान साफ़ करें' : 'Clear amount'}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {(numVal > 0 || showCapAlert) && (
        <div className="fee-calc-denomination-row animate-fade-in">
          {numVal > 0 && (
            <span className="fee-calc-denomination-pill">
              <span className="fee-calc-denom-badge">₹ {formatIndianNumber(numVal)}</span>
              {denominationText && (
                <span className="fee-calc-denom-words">({denominationText})</span>
              )}
            </span>
          )}

          {showCapAlert && (
            <span className="fee-calc-ceiling-pill animate-fade-in">
              <AlertTriangle size={12} />
              <span>
                {isHindi
                  ? `अधिकतम सीमा: ₹${formatIndianNumber(max)}`
                  : `Max limit: ₹${formatIndianNumber(max)}`}
              </span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
