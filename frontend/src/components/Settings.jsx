import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Languages, Moon, Sun, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Settings({ language, onLanguageChange, theme, onThemeChange, user, onUserChange }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';
  
  const [nameInput, setNameInput] = useState(user?.name || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [profileMessage, setProfileMessage] = useState(null);

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const hasPin = localStorage.getItem('dhaara_vault_pin') !== null;

  const handleChangePin = () => {
    setPinMessage(null);

    if (!newPin || newPin.length < 4) {
      setPinMessage({ type: 'error', text: isHindi ? 'नया पिन कम से कम 4 अंकों का होना चाहिए।' : 'New PIN must be at least 4 digits.' });
      return;
    }

    if (hasPin) {
      const storedPin = localStorage.getItem('dhaara_vault_pin');
      if (oldPin !== storedPin) {
        setPinMessage({ type: 'error', text: isHindi ? 'पुराना पिन गलत है।' : 'Incorrect Old PIN.' });
        return;
      }
    }

    localStorage.setItem('dhaara_vault_pin', newPin);
    setPinMessage({ type: 'success', text: isHindi ? 'वॉल्ट पिन सफलतापूर्वक बदल दिया गया!' : 'Vault PIN successfully updated!' });
    setOldPin('');
    setNewPin('');
    
    // Clear success message after 3 seconds
    setTimeout(() => setPinMessage(null), 3000);
  };

  const handleResetPin = () => {
    if (window.confirm(isHindi ? 'क्या आप वाकई अपना पिन भूल गए हैं और इसे रीसेट करना चाहते हैं? इससे वॉल्ट का डेटा डिलीट नहीं होगा।' : 'Are you sure you want to force reset your PIN? This will not delete your saved drafts.')) {
      localStorage.removeItem('dhaara_vault_pin');
      setOldPin('');
      setNewPin('');
      setPinMessage({ type: 'success', text: isHindi ? 'पिन हटा दिया गया है। आप नया पिन बना सकते हैं।' : 'PIN has been removed. You can now set a new one.' });
    }
  };

  const handleUpdateProfile = () => {
    if (nameInput.trim().length === 0) {
      setProfileMessage({ type: 'error', text: isHindi ? 'नाम खाली नहीं हो सकता।' : 'Name cannot be empty.' });
      return;
    }
    
    // In a real app, this would be an API call to change the password
    let updatedUser = { ...user, name: nameInput };
    if (passwordInput.trim().length > 0) {
      updatedUser.password = passwordInput;
    }
    
    if (onUserChange) onUserChange(updatedUser);
    
    setProfileMessage({ type: 'success', text: isHindi ? 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!' });
    setPasswordInput('');
    setTimeout(() => setProfileMessage(null), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '0 0 40px', display: 'flex', flexDirection: 'column', gap: '32px', flex: 1, height: '100%', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
        <div style={{ background: 'linear-gradient(135deg, #475569, #1e293b)', color: 'white', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <SettingsIcon size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
            {isHindi ? 'सेटिंग्स (Settings)' : 'App Settings'}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0' }}>
            {isHindi ? 'अपनी भाषा, थीम और वॉल्ट सुरक्षा प्रबंधित करें' : 'Manage your language, theme, and vault security'}
          </p>
        </div>
      </div>

      {/* General Preferences */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
        <h3 style={{ margin: '0 0 20px', fontSize: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Languages size={18} color="var(--primary)" />
          {isHindi ? 'सामान्य प्राथमिकताएं (General Preferences)' : 'General Preferences'}
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Profile Setting */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{isHindi ? 'प्रोफ़ाइल अपडेट करें' : 'Update Profile'}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{isHindi ? 'अपना नाम या पासवर्ड बदलें' : 'Change your name or account password'}</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{isHindi ? 'नाम (Name)' : 'Name'}</label>
                <input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--subtle-bg)', color: 'var(--text-main)' }} placeholder={isHindi ? 'अपना नाम दर्ज करें' : 'Enter your name'} />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>{isHindi ? 'नया पासवर्ड (New Password)' : 'New Password'}</label>
                <input type="password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--subtle-bg)', color: 'var(--text-main)' }} placeholder={isHindi ? 'खाली छोड़ें यदि नहीं बदलना है' : 'Leave empty to keep current'} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <button onClick={handleUpdateProfile} className="btn-primary" style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '13px' }}>
                 {isHindi ? 'अपडेट करें' : 'Update Profile'}
               </button>
               {profileMessage && (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: profileMessage.type === 'error' ? '#ef4444' : '#10b981' }}>
                   {profileMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                   {profileMessage.text}
                 </div>
               )}
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--card-border)', width: '100%' }}></div>
          {/* Language Setting */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{isHindi ? 'भाषा (Language)' : 'Language'}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{isHindi ? 'संपूर्ण एप्लिकेशन की भाषा चुनें' : 'Select the language for the entire application'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--subtle-bg)', borderRadius: '10px', padding: '6px', border: '1px solid var(--card-border)' }}>
              <button
                type="button"
                onClick={() => onLanguageChange('English')}
                style={{
                  border: 'none', background: language === 'English' ? 'var(--card-bg)' : 'transparent',
                  color: language === 'English' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: language === 'English' ? '700' : '500',
                  padding: '8px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
                  boxShadow: language === 'English' ? 'var(--card-shadow)' : 'none', transition: 'all 0.2s ease'
                }}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onLanguageChange('Hindi')}
                style={{
                  border: 'none', background: language === 'Hindi' ? 'var(--card-bg)' : 'transparent',
                  color: language === 'Hindi' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: language === 'Hindi' ? '700' : '500',
                  padding: '8px 20px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer',
                  boxShadow: language === 'Hindi' ? 'var(--card-shadow)' : 'none', transition: 'all 0.2s ease'
                }}
              >
                हिंदी
              </button>
            </div>
          </div>

          <div style={{ height: '1px', background: 'var(--card-border)', width: '100%' }}></div>

          {/* Theme Setting */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>{isHindi ? 'थीम (Theme)' : 'Theme'}</div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{isHindi ? 'लाइट या डार्क मोड चुनें' : 'Choose between light or dark mode'}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: 'var(--subtle-bg)', borderRadius: '10px', padding: '6px', border: '1px solid var(--card-border)' }}>
              <button
                type="button"
                onClick={() => onThemeChange('light')}
                style={{
                  border: 'none', background: theme === 'light' ? 'var(--card-bg)' : 'transparent',
                  color: theme === 'light' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: theme === 'light' ? '700' : '500',
                  padding: '8px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: theme === 'light' ? 'var(--card-shadow)' : 'none', transition: 'all 0.2s ease'
                }}
              >
                <Sun size={16} /> {isHindi ? 'लाइट' : 'Light'}
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('dark')}
                style={{
                  border: 'none', background: theme === 'dark' ? 'var(--card-bg)' : 'transparent',
                  color: theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: theme === 'dark' ? '700' : '500',
                  padding: '8px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: theme === 'dark' ? 'var(--card-shadow)' : 'none', transition: 'all 0.2s ease'
                }}
              >
                <Moon size={16} /> {isHindi ? 'डार्क' : 'Dark'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Vault Settings */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="#f59e0b" />
            {isHindi ? 'सुरक्षा और वॉल्ट (Security & Vault)' : 'Security & Vault Settings'}
          </h3>
          {hasPin && (
            <button onClick={handleResetPin} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}>
              {isHindi ? 'पिन भूल गए? (रीसेट)' : 'Forgot PIN? (Force Reset)'}
            </button>
          )}
        </div>

        <div style={{ background: 'var(--subtle-bg)', padding: '20px', borderRadius: '12px', border: '1px dashed var(--card-border)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-muted)' }}>
            {hasPin 
              ? (isHindi ? 'नीचे अपना पुराना पिन और नया पिन दर्ज करके अपना लीगल वॉल्ट पासवर्ड बदलें।' : 'Change your Legal Vault PIN by entering your old and new PIN below.')
              : (isHindi ? 'आपने अभी तक लीगल वॉल्ट के लिए कोई पिन सेट नहीं किया है। अपना पहला पिन दर्ज करें।' : 'You have not set a PIN for the Legal Vault yet. Enter a new PIN to secure it.')}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            {hasPin && (
              <div style={{ flex: '1 1 200px' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>
                  {isHindi ? 'पुराना पिन' : 'Old PIN'}
                </label>
                <input
                  type="password"
                  className="input-field"
                  value={oldPin}
                  onChange={e => setOldPin(e.target.value)}
                  maxLength={6}
                  placeholder="••••"
                  style={{ height: '42px', fontSize: '16px', letterSpacing: '4px' }}
                />
              </div>
            )}
            
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#475569', marginBottom: '6px', display: 'block' }}>
                {isHindi ? 'नया पिन' : 'New PIN'}
              </label>
              <input
                type="password"
                className="input-field"
                value={newPin}
                onChange={e => setNewPin(e.target.value)}
                maxLength={6}
                placeholder={isHindi ? 'नया 4-6 अंकों का पिन' : 'New 4-6 digit PIN'}
                style={{ height: '42px', fontSize: '16px', letterSpacing: '2px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
            <button
              onClick={handleChangePin}
              className="btn-primary"
              style={{ padding: '10px 24px', borderRadius: '8px' }}
            >
              {hasPin ? (isHindi ? 'पिन बदलें' : 'Update PIN') : (isHindi ? 'पिन सेट करें' : 'Set PIN')}
            </button>
            
            {pinMessage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: pinMessage.type === 'error' ? '#ef4444' : '#10b981' }}>
                {pinMessage.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
                {pinMessage.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
