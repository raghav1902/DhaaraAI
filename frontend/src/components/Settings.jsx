import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Languages, Moon, Sun, CheckCircle2, AlertCircle, User, Info } from 'lucide-react';
import './Settings.css';

export default function Settings({ language, onLanguageChange, theme, onThemeChange, user, onUserChange }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [nameInput, setNameInput] = useState(user?.name || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [profileMessage, setProfileMessage] = useState(null);

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState(null);

  const hasPin = localStorage.getItem('dhaara_vault_pin') !== null;

  const handleChangePin = () => {
    setPinMessage(null);

    if (!newPin || newPin.length < 4) {
      setPinMessage({
        type: 'error',
        text: isHindi ? 'नया पिन कम से कम 4 अंकों का होना चाहिए।' : 'New PIN must be at least 4 digits.'
      });
      return;
    }

    if (hasPin) {
      const storedPin = localStorage.getItem('dhaara_vault_pin');
      if (oldPin !== storedPin) {
        setPinMessage({
          type: 'error',
          text: isHindi ? 'पुराना पिन गलत है।' : 'Incorrect old PIN.'
        });
        return;
      }
    }

    localStorage.setItem('dhaara_vault_pin', newPin);
    setPinMessage({
      type: 'success',
      text: isHindi ? 'वॉल्ट पिन सफलतापूर्वक बदल दिया गया!' : 'Vault PIN successfully updated!'
    });
    setOldPin('');
    setNewPin('');

    setTimeout(() => setPinMessage(null), 3500);
  };

  const handleResetPin = () => {
    if (
      window.confirm(
        isHindi
          ? 'क्या आप वाकई अपना पिन भूल गए हैं और इसे रीसेट करना चाहते हैं? इससे वॉल्ट के ड्राफ्ट डिलीट नहीं होंगे।'
          : 'Are you sure you want to force reset your PIN? This will not delete your saved drafts.'
      )
    ) {
      localStorage.removeItem('dhaara_vault_pin');
      setOldPin('');
      setNewPin('');
      setPinMessage({
        type: 'success',
        text: isHindi ? 'पिन हटा दिया गया है। आप नया पिन बना सकते हैं।' : 'PIN has been removed. You can now set a new one.'
      });
    }
  };

  const handleUpdateProfile = () => {
    if (nameInput.trim().length === 0) {
      setProfileMessage({
        type: 'error',
        text: isHindi ? 'नाम खाली नहीं हो सकता।' : 'Name cannot be empty.'
      });
      return;
    }

    let updatedUser = { ...user, name: nameInput };
    if (passwordInput.trim().length > 0) {
      updatedUser.password = passwordInput;
    }

    if (onUserChange) onUserChange(updatedUser);

    setProfileMessage({
      type: 'success',
      text: isHindi ? 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!'
    });
    setPasswordInput('');
    setTimeout(() => setProfileMessage(null), 3500);
  };

  return (
    <div className="settings-hub animate-fade-in">
      {/* Top Header */}
      <div className="settings-hub__header">
        <div className="settings-hub__header-left">
          <div className="settings-hub__icon-badge">
            <SettingsIcon size={22} />
          </div>
          <div>
            <div className="settings-hub__title-row">
              <h2 className="settings-hub__title">
                {isHindi ? 'कार्यक्षेत्र सेटिंग्स' : 'Workspace Settings'}
              </h2>
              <span className="badge badge-neutral">
                Preferences
              </span>
            </div>
            <p className="settings-hub__subtitle">
              {isHindi
                ? 'अपनी प्रोफ़ाइल, भाषा, थीम और स्थानीय वॉल्ट सुरक्षा प्रबंधित करें'
                : 'Configure user profile, bilingual interface, appearance, and local device security'}
            </p>
          </div>
        </div>
      </div>

      <div className="settings-hub__grid">
        {/* Section 1: User Profile */}
        <div className="settings-hub__card">
          <div className="settings-hub__card-header">
            <div className="settings-hub__card-icon-wrap">
              <User size={18} />
            </div>
            <div>
              <h3 className="settings-hub__card-title">
                {isHindi ? 'उपयोगकर्ता प्रोफ़ाइल' : 'User Profile'}
              </h3>
              <p className="settings-hub__card-desc">
                {isHindi ? 'अपना प्रदर्शन नाम और लॉगिन क्रेडेंशियल बदलें' : 'Update your display name and login credentials'}
              </p>
            </div>
          </div>

          <div className="settings-hub__form-grid">
            <div className="form-group">
              <label className="form-label">
                {isHindi ? 'पूरा नाम' : 'Full Name'}
              </label>
              <input
                type="text"
                className="input-field"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={isHindi ? 'उदा. एडवोकेट राहुल वर्मा' : 'e.g. Adv. Rahul Verma'}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                {isHindi ? 'ईमेल एड्रेस (अपरिवर्तनीय)' : 'Email ID (Registered)'}
              </label>
              <input
                type="text"
                className="input-field"
                value={user?.email || 'user@dhaara.ai'}
                disabled
                style={{ opacity: 0.7 }}
              />
            </div>

            <div className="form-group full-width">
              <label className="form-label">
                {isHindi ? 'नया पासवर्ड' : 'Update Password'}
              </label>
              <input
                type="password"
                className="input-field"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder={isHindi ? 'खाली छोड़ें यदि नहीं बदलना है' : 'Leave blank to keep existing password'}
              />
            </div>
          </div>

          <div className="settings-hub__card-footer">
            <button
              onClick={handleUpdateProfile}
              className="btn-primary"
              type="button"
            >
              {isHindi ? 'प्रोफ़ाइल सहेजें' : 'Save Changes'}
            </button>

            {profileMessage && (
              <div className={`settings-hub__feedback settings-hub__feedback--${profileMessage.type}`}>
                {profileMessage.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
                <span>{profileMessage.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Preferences (Language & Theme) */}
        <div className="settings-hub__card">
          <div className="settings-hub__card-header">
            <div className="settings-hub__card-icon-wrap" style={{ background: 'var(--royal-100)', color: 'var(--royal-600)' }}>
              <Languages size={18} />
            </div>
            <div>
              <h3 className="settings-hub__card-title">
                {isHindi ? 'भाषा व स्वरूप (Language & Theme)' : 'Language & Appearance'}
              </h3>
              <p className="settings-hub__card-desc">
                {isHindi ? 'एप्लिकेशन इंटरफ़ेस की भाषा और डार्क मोड चुनें' : 'Choose bilingual interface language and visual theme'}
              </p>
            </div>
          </div>

          <div className="settings-hub__preference-list">
            {/* Language Segmented Control */}
            <div className="settings-hub__pref-item">
              <div>
                <span className="settings-hub__pref-label">
                  {isHindi ? 'कार्यक्षेत्र की भाषा' : 'Workspace Language'}
                </span>
                <p className="settings-hub__pref-sub">
                  {isHindi ? 'कानूनी शब्दावली और इंटरफ़ेस की मुख्य भाषा' : 'Select English or Hindi for legal queries and drafts'}
                </p>
              </div>

              <div className="settings-hub__segmented-control">
                <button
                  type="button"
                  onClick={() => onLanguageChange('English')}
                  className={`settings-hub__segment-btn ${language === 'English' ? 'is-active' : ''}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange('Hindi')}
                  className={`settings-hub__segment-btn ${language === 'Hindi' || language === 'हिंदी' ? 'is-active' : ''}`}
                >
                  हिंदी
                </button>
              </div>
            </div>

            <div className="settings-hub__divider"></div>

            {/* Theme Segmented Control */}
            <div className="settings-hub__pref-item">
              <div>
                <span className="settings-hub__pref-label">
                  {isHindi ? 'इंटरफ़ेस थीम' : 'Display Mode'}
                </span>
                <p className="settings-hub__pref-sub">
                  {isHindi ? 'उच्च-कंट्रास्ट लाइट अथवा प्रीमियम डार्क मोड' : 'Switch between High-Contrast Light and Deep Navy Dark'}
                </p>
              </div>

              <div className="settings-hub__segmented-control">
                <button
                  type="button"
                  onClick={() => onThemeChange('light')}
                  className={`settings-hub__segment-btn ${theme === 'light' ? 'is-active' : ''}`}
                >
                  <Sun size={14} />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => onThemeChange('dark')}
                  className={`settings-hub__segment-btn ${theme === 'dark' ? 'is-active' : ''}`}
                >
                  <Moon size={14} />
                  <span>Dark</span>
                </button>
              </div>
            </div>
          </div>
        </div>

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
      </div>
    </div>
  );
}
