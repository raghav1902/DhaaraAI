import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon, Key, Languages, Moon, Sun, CheckCircle2, AlertCircle, User, Info, CreditCard, Crown, Sparkles, RefreshCw } from 'lucide-react';
import './Settings.css';
import { API_BASE } from '../config/apiConfig';
import { hashPin } from '../utils/cryptoUtils';

export default function Settings({ language, onLanguageChange, theme, onThemeChange, user, onUserChange }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [nameInput, setNameInput] = useState(user?.name || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [profileMessage, setProfileMessage] = useState(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Plan management & live quota metrics
  const [usageStats, setUsageStats] = useState(null);
  const [isUpgradingPlan, setIsUpgradingPlan] = useState(false);
  const [planMessage, setPlanMessage] = useState(null);

  const fetchUsage = async () => {
    try {
      const token = user?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE}/api/user/usage`, { headers });
      setUsageStats(res.data);
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [user]);

  const handleUpdatePlan = async (targetPlan) => {
    setIsUpgradingPlan(true);
    setPlanMessage(null);
    try {
      const token = user?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_BASE}/api/user/upgrade`, {
        plan: targetPlan,
        email: user?.email
      }, { headers });
      if (res.data.status === 'success') {
        const updated = {
          ...user,
          plan: res.data.plan,
          token: res.data.token || user?.token
        };
        if (onUserChange) onUserChange(updated);
        try {
          localStorage.setItem('dhaara_active_user', JSON.stringify(updated));
        } catch (e) {}
        setPlanMessage({
          type: 'success',
          text: isHindi
            ? `योजना सफलतापूर्वक ${targetPlan === 'plus' ? 'Plus' : 'Free'} में बदल दी गई!`
            : `Plan successfully set to ${targetPlan === 'plus' ? 'DhaaraAI Plus' : 'Free Tier'}!`
        });
        fetchUsage();
      }
    } catch (err) {
      setPlanMessage({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update plan. Please retry.'
      });
    } finally {
      setIsUpgradingPlan(false);
    }
  };

  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState(null);

  const hasPin = localStorage.getItem('dhaara_vault_pin') !== null;

  const handleChangePin = async () => {
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
      const hashedOld = await hashPin(oldPin);
      // Support legacy unhashed comparison if stored value is 4 digits
      const matches = storedPin === hashedOld || storedPin === oldPin;
      if (!matches) {
        setPinMessage({
          type: 'error',
          text: isHindi ? 'पुराना पिन गलत है।' : 'Incorrect old PIN.'
        });
        return;
      }
    }

    const hashedNew = await hashPin(newPin);
    localStorage.setItem('dhaara_vault_pin', hashedNew);
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

  const handleUpdateProfile = async () => {
    if (nameInput.trim().length === 0) {
      setProfileMessage({
        type: 'error',
        text: isHindi ? 'नाम खाली नहीं हो सकता।' : 'Name cannot be empty.'
      });
      return;
    }

    setIsUpdatingProfile(true);
    setProfileMessage(null);

    try {
      // Send PATCH to backend server if user has token
      if (user?.token) {
        const payload = { name: nameInput.trim() };
        if (passwordInput.trim().length > 0) {
          payload.password = passwordInput.trim();
        }

        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'Failed to update profile on server.');
        }
      }

      let updatedUser = { ...user, name: nameInput.trim() };
      // Never persist raw password in user state or localStorage
      delete updatedUser.password;

      if (onUserChange) onUserChange(updatedUser);

      setProfileMessage({
        type: 'success',
        text: isHindi ? 'प्रोफाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!'
      });
      setPasswordInput('');
    } catch (err) {
      setProfileMessage({
        type: 'error',
        text: err.message || (isHindi ? 'प्रोफाइल अपडेट करने में त्रुटि।' : 'Failed to update profile.')
      });
    } finally {
      setIsUpdatingProfile(false);
      setTimeout(() => setProfileMessage(null), 4000);
    }
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
        {/* Section 0: Subscription & Billing (Full Width) */}
        <div className="settings-hub__card" style={{ gridColumn: '1 / -1' }}>
          <div className="settings-hub__card-header" style={{ marginBottom: '16px' }}>
            <div className="settings-hub__card-icon-wrap" style={{ background: 'linear-gradient(135deg, var(--gold-500, #fbbf24), #d97706)', color: '#fff' }}>
              <Crown size={20} />
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 className="settings-hub__card-title">
                  {isHindi ? 'सदस्यता और उपयोग कोटा (Subscription & Quotas)' : 'Subscription & Live Feature Quotas'}
                </h3>
                <p className="settings-hub__card-desc">
                  {isHindi ? 'अपनी वर्तमान योजना और रीयल-टाइम उपयोग सीमाएं प्रबंधित करें' : 'Track your live usage limits and manage subscription tiers'}
                </p>
              </div>
              <div style={{ padding: '6px 14px', background: user?.plan === 'plus' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)', borderRadius: 'var(--radius-full)', border: user?.plan === 'plus' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: user?.plan === 'plus' ? 'var(--success)' : '#eab308' }}></span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: user?.plan === 'plus' ? 'var(--success)' : '#eab308' }}>
                  {user?.plan === 'plus' ? 'DHAARAAI PLUS ACTIVE' : 'FREE TIER (QUOTA LIMITED)'}
                </span>
              </div>
            </div>
          </div>

          {planMessage && (
            <div style={{
              marginBottom: '16px',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: planMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: planMessage.type === 'success' ? '#10b981' : '#ef4444',
              border: planMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
            }}>
              {planMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{planMessage.text}</span>
            </div>
          )}

          {/* Live Feature Quota Meters */}
          {usageStats && (
            <div style={{ marginBottom: '16px', padding: '14px', background: 'var(--bg-secondary, rgba(255,255,255,0.03))', borderRadius: '10px', border: '1px solid var(--border-light, rgba(255,255,255,0.08))' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  {isHindi ? 'रीयल-टाइम उपयोग मीटर (Live Usage Tracking)' : 'Live Quota Meters & Consumption'}
                </span>
                <button
                  type="button"
                  onClick={fetchUsage}
                  title="Refresh Quotas"
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
                >
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                {[
                  { key: 'ai_chat', label: 'AI Legal Chat (Daily)', max: 7 },
                  { key: 'bns_lookup', label: 'BNS ↔ IPC Explorer', max: 2 },
                  { key: 'legal_library', label: 'Statutory Library', max: 15 },
                  { key: 'draft', label: 'Legal Drafter', max: 3 },
                  { key: 'contract_audit', label: 'Contract Risk Audit', max: 3 },
                  { key: 'cyber_check', label: 'Cyber Breach Scanner', max: 3 }
                ].map((feat) => {
                  const stat = usageStats.features?.[feat.key] || { used: 0, limit: feat.max, remaining: feat.max };
                  const usedCount = stat.used ?? stat.count ?? 0;
                  const limitCount = stat.limit > 0 ? stat.limit : feat.max;
                  const isUnlimited = stat.limit === -1 || stat.is_unlimited || user?.plan === 'plus';
                  const remainingCount = isUnlimited ? -1 : (stat.remaining ?? Math.max(0, limitCount - usedCount));
                  const percent = isUnlimited ? 0 : Math.min(100, Math.round((usedCount / limitCount) * 100));
                  const isExceeded = !isUnlimited && remainingCount <= 0;

                  return (
                    <div key={feat.key} style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-primary, rgba(0,0,0,0.15))', border: isExceeded ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-light, rgba(255,255,255,0.06))' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                        <span style={{ color: 'var(--text-main)' }}>{feat.label}</span>
                        <span style={{ color: isUnlimited ? '#f59e0b' : isExceeded ? '#ef4444' : 'var(--text-muted)' }}>
                          {isUnlimited ? '∞ Unlimited' : `${usedCount} / ${limitCount}`}
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '5px', background: 'var(--bg-tertiary, #333)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                          width: isUnlimited ? '100%' : `${percent}%`,
                          height: '100%',
                          background: isUnlimited ? 'linear-gradient(90deg, #10b981, #059669)' : isExceeded ? '#ef4444' : percent > 66 ? '#f59e0b' : '#6366f1',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      <div style={{ fontSize: '10px', marginTop: '4px', color: isExceeded ? '#ef4444' : 'var(--text-muted)' }}>
                        {isUnlimited ? 'Plus Tier Unlocked' : isExceeded ? '🔒 Limit Reached — Upgrade' : `${remainingCount} remaining`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', background: 'var(--subtle-bg)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
                  {isHindi ? 'फ्री टियर (Free Tier)' : 'Free Tier'}
                </h4>
                {user?.plan !== 'plus' && (
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)' }}>CURRENT</span>
                )}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> 7 AI Legal Chats / Day</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> 2 BNS ↔ IPC Lookups (15 Preview Provisions)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> Legal Library 15 Sections & 15 Terms Preview</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> Max 3 Legal Drafts</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> Max 3 Contract Risk Audits</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> Max 3 Cyber Breach Scans (Masked)</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="var(--success)" /> Citizen Rights & Emergency SOS</li>
              </ul>

              {user?.plan === 'plus' && (
                <button
                  type="button"
                  onClick={() => handleUpdatePlan('free')}
                  disabled={isUpgradingPlan}
                  style={{
                    marginTop: 'auto',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    border: '1px dashed var(--border-light, #444)',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '600',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {isUpgradingPlan ? 'Updating...' : 'Switch to Free Tier (To Test Free Limits)'}
                </button>
              )}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '1px solid var(--border-light)', paddingLeft: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Crown size={16} /> {isHindi ? 'DhaaraAI प्लस (₹999/माह)' : 'DhaaraAI Plus (₹999/month)'}
                </h4>
                {user?.plan === 'plus' && (
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)' }}>ACTIVE</span>
                )}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crown size={14} color="#f59e0b" /> Unlimited Legal Drafting & BNS Concordance</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crown size={14} color="#f59e0b" /> Unlimited Contract Audits & Risk Scoring</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crown size={14} color="#f59e0b" /> Sec 50C Stamp Duty & GST Late Fee Calculators Unlocked</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crown size={14} color="#f59e0b" /> Full Cyber Breach Details & IT Act Legal Protocols</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crown size={14} color="#f59e0b" /> Complete 2,016+ Statutory Library Access</li>
              </ul>
              
              {user?.plan !== 'plus' ? (
                <button 
                  onClick={() => handleUpdatePlan('plus')}
                  disabled={isUpgradingPlan}
                  style={{
                    marginTop: 'auto',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#fff',
                    border: 'none',
                    padding: '10px 16px',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '700',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
                  }}
                >
                  <Sparkles size={16} /> {isUpgradingPlan ? 'Upgrading...' : isHindi ? 'अभी DhaaraAI Plus में अपग्रेड करें' : 'Upgrade to DhaaraAI Plus (Instant Access)'}
                </button>
              ) : (
                <div style={{ marginTop: 'auto', padding: '8px 12px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>
                  ✓ You are enjoying all Premium DhaaraAI Plus capabilities
                </div>
              )}
            </div>
          </div>
        </div>

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
