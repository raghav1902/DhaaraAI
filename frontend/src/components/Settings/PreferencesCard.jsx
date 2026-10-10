import React from 'react';
import { Languages, Sun, Moon } from 'lucide-react';

export default function PreferencesCard({
  isHindi,
  language,
  onLanguageChange,
  theme,
  onThemeChange
}) {
  return (
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
  );
}
