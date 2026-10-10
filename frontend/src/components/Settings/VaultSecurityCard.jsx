import React from 'react';
import { Key, Info, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VaultSecurityCard({
  isHindi,
  hasPin,
  oldPin,
  setOldPin,
  newPin,
  setNewPin,
  handleChangePin,
  handleResetPin,
  pinMessage
}) {
  return (
    <>
      {/* Section 3: Vault Security */}
      <div className="settings-hub__card">
        <div className="settings-hub__card-header">
          <div className="settings-hub__card-icon-wrap" style={{ background: 'var(--amber-100)', color: 'var(--amber-600)' }}>
            <Key size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <h3 className="settings-hub__card-title">
                {isHindi ? 'लीगल वॉल्ट पिन सुरक्षा' : 'Legal Vault Security'}
              </h3>
            </div>
            <p className="settings-hub__card-desc">
              {isHindi
                ? 'पिन-संरक्षित स्थानीय डिवाइस स्टोरेज प्रबंधित करें'
                : 'Manage your PIN-Protected Local Device Storage access key'}
            </p>
          </div>
        </div>

        <div className="settings-hub__vault-box">
          <p className="settings-hub__vault-notice">
            {hasPin
              ? (isHindi
                  ? 'नीचे अपना पुराना पिन और नया पिन दर्ज करके वॉल्ट सुरक्षा कुंजी बदलें।'
                  : 'Enter your current PIN along with a new 4-6 digit PIN to update your vault access.')
              : (isHindi
                  ? 'आपने अभी तक वॉल्ट के लिए पिन सेट नहीं किया है। सुरक्षित करने के लिए पिन बनाएं।'
                  : 'No PIN is currently configured. Create a 4-6 digit PIN to secure your local drafts.')}
          </p>

          <div className="settings-hub__form-grid">
            {hasPin && (
              <div className="form-group">
                <label className="form-label">
                  {isHindi ? 'वर्तमान पिन' : 'Current PIN'}
                </label>
                <input
                  type="password"
                  className="input-field"
                  value={oldPin}
                  onChange={(e) => setOldPin(e.target.value)}
                  maxLength={6}
                  placeholder="••••"
                  style={{ letterSpacing: '4px', textAlign: 'center' }}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                {isHindi ? 'नया सुरक्षा पिन' : 'New Security PIN'}
              </label>
              <input
                type="password"
                className="input-field"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                maxLength={6}
                placeholder="••••"
                style={{ letterSpacing: '4px', textAlign: 'center' }}
              />
            </div>
          </div>

          <div className="settings-hub__vault-actions">
            <button
              onClick={handleChangePin}
              className="btn-primary"
              type="button"
            >
              {hasPin ? (isHindi ? 'पिन अपडेट करें' : 'Update Vault PIN') : (isHindi ? 'पिन सेट करें' : 'Set Vault PIN')}
            </button>

            {hasPin && (
              <button
                onClick={handleResetPin}
                className="btn-ghost"
                type="button"
                style={{ color: 'var(--crimson-600)' }}
              >
                {isHindi ? 'पिन रीसेट करें' : 'Force Reset PIN'}
              </button>
            )}

            {pinMessage && (
              <div className={`settings-hub__feedback settings-hub__feedback--${pinMessage.type}`}>
                {pinMessage.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
                <span>{pinMessage.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 4: System Information */}
      <div className="settings-hub__card">
        <div className="settings-hub__card-header">
          <div className="settings-hub__card-icon-wrap" style={{ background: 'var(--purple-light)', color: 'var(--purple-600)' }}>
            <Info size={18} />
          </div>
          <div>
            <h3 className="settings-hub__card-title">
              {isHindi ? 'सिस्टम व वैधानिक जानकारी' : 'System & Statutory Compliance'}
            </h3>
            <p className="settings-hub__card-desc">
              {isHindi ? 'DhaaraAI प्लेटफ़ॉर्म आर्किटेक्चर एवं कानूनी डेटाबेस संदर्भ' : 'Platform architecture, concordance sources, and storage model'}
            </p>
          </div>
        </div>

        <div className="settings-hub__system-info-list">
          <div className="settings-hub__system-item">
            <span className="settings-hub__system-key">
              {isHindi ? 'वैधानिक आपराधिक कोड' : 'Statutory Criminal Concordance'}
            </span>
            <span className="badge badge-primary font-mono">
              BNS 2023 • BNSS 2023 • BSA 2023
            </span>
          </div>

          <div className="settings-hub__system-item">
            <span className="settings-hub__system-key">
              {isHindi ? 'पारंपरिक संदर्भ संहिता' : 'Legacy Penal Code'}
            </span>
            <span className="badge badge-neutral font-mono">
              IPC 1860 • CrPC 1973
            </span>
          </div>

          <div className="settings-hub__system-item">
            <span className="settings-hub__system-key">
              {isHindi ? 'डेटा संप्रभुता व संग्रहण' : 'Client Storage Model'}
            </span>
            <span className="settings-hub__system-val">
              PIN-Protected Local Device Storage (Client Sandbox)
            </span>
          </div>

          <div className="settings-hub__system-item">
            <span className="settings-hub__system-key">
              {isHindi ? 'साइबर ब्रीच डेटा स्रोत' : 'Breach Record Intelligence'}
            </span>
            <span className="settings-hub__system-val">
              XposedOrNot Public Security Index
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
