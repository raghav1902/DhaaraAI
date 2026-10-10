import React from 'react';
import { User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ProfileCard({
  isHindi,
  user,
  nameInput,
  setNameInput,
  passwordInput,
  setPasswordInput,
  handleUpdateProfile,
  profileMessage
}) {
  return (
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
  );
}
