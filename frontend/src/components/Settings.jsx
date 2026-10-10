import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Settings as SettingsIcon } from 'lucide-react';
import './Settings.css';
import { API_BASE } from '../config/apiConfig';
import { hashPin } from '../utils/cryptoUtils';
import SubscriptionCard from './Settings/SubscriptionCard';
import ProfileCard from './Settings/ProfileCard';
import PreferencesCard from './Settings/PreferencesCard';
import VaultSecurityCard from './Settings/VaultSecurityCard';

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
        <SubscriptionCard
          isHindi={isHindi}
          user={user}
          usageStats={usageStats}
          planMessage={planMessage}
          isUpgradingPlan={isUpgradingPlan}
          handleUpdatePlan={handleUpdatePlan}
          fetchUsage={fetchUsage}
        />

        <ProfileCard
          isHindi={isHindi}
          user={user}
          nameInput={nameInput}
          setNameInput={setNameInput}
          passwordInput={passwordInput}
          setPasswordInput={setPasswordInput}
          handleUpdateProfile={handleUpdateProfile}
          profileMessage={profileMessage}
        />

        <PreferencesCard
          isHindi={isHindi}
          language={language}
          onLanguageChange={onLanguageChange}
          theme={theme}
          onThemeChange={onThemeChange}
        />

        <VaultSecurityCard
          isHindi={isHindi}
          hasPin={hasPin}
          oldPin={oldPin}
          setOldPin={setOldPin}
          newPin={newPin}
          setNewPin={setNewPin}
          handleChangePin={handleChangePin}
          handleResetPin={handleResetPin}
          pinMessage={pinMessage}
        />
      </div>
    </div>
  );
}
