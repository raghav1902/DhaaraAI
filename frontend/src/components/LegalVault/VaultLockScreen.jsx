import React from 'react';
import { Lock, Unlock, Save, AlertCircle, ShieldCheck } from 'lucide-react';

export default function VaultLockScreen({
  isHindi,
  hasPin,
  pinDigits,
  digitRefs,
  handleDigitChange,
  handleDigitKeyDown,
  handleDigitPaste,
  verifyPin,
  error
}) {
  return (
    <div className="legal-vault legal-vault--locked animate-fade-in">
      <div className="legal-vault__unlock-card">
        <div className="legal-vault__lock-icon-wrap">
          <Lock size={22} strokeWidth={2.2} />
        </div>

        <h2 className="legal-vault__unlock-title">
          {isHindi ? 'कानूनी दस्तावेज़ वॉल्ट' : 'Legal Document Vault'}
        </h2>

        <p className="legal-vault__unlock-subtitle">
          {hasPin
            ? (isHindi
                ? 'सहेजे गए निजी दस्तावेज़ देखने के लिए 4 अंकों का सुरक्षा पिन दर्ज करें।'
                : 'Enter your 4-digit security PIN to unlock private drafts and case records.')
            : (isHindi
                ? 'दस्तावेज़ों को सुरक्षित रखने के लिए एक नया 4 अंकों का सुरक्षा पिन बनाएं।'
                : 'Create a 4-digit security PIN to protect private legal drafts on this device.')}
        </p>

        <div className="legal-vault__pin-form">
          <div className="legal-vault__pin-boxes">
            {pinDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={digitRefs[idx]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                className="legal-vault__digit-box"
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                onPaste={handleDigitPaste}
                autoFocus={idx === 0}
                aria-label={`Digit ${idx + 1}`}
              />
            ))}
          </div>

          {error && (
            <div className="legal-vault__error-text">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            className="legal-vault__submit-btn"
            onClick={() => verifyPin(pinDigits.join(''))}
          >
            {hasPin ? (
              <>
                <Unlock size={16} />
                <span>{isHindi ? 'वॉल्ट अनलॉक करें' : 'Unlock Vault'}</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>{isHindi ? 'पिन सेट करें व खोलें' : 'Set PIN & Open Vault'}</span>
              </>
            )}
          </button>
        </div>

        <div className="legal-vault__trust-row">
          <ShieldCheck size={14} color="var(--emerald-600)" />
          <span>{isHindi ? 'क्लाइंट-साइड एन्क्रिप्टेड • स्थानीय डिवाइस स्टोरेज' : 'Client-side encrypted • Stored locally on this device'}</span>
        </div>
      </div>
    </div>
  );
}
