import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Scale,
  Sun,
  Moon,
  Globe,
  Settings as SettingsIcon,
  LogOut
} from 'lucide-react';

export default function AppNavbar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  currentNav,
  theme,
  toggleTheme,
  language,
  setLanguage,
  isHindi,
  user,
  setUser,
  setAppView,
  apiBase
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignOut = async () => {
    const activeToken = user?.token;
    try {
      if (activeToken) {
        fetch(`${apiBase}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${activeToken}` }
        }).catch(() => {});
      }
      localStorage.removeItem('dhaara_active_user');
    } catch { }
    setUser(null);
    setAppView('landing');
    setShowProfileMenu(false);
  };

  return (
    <header className="yt-top-navbar no-print">
      {/* Left: Hamburger Button + Fixed Logo + Active Module Badge */}
      <div className="yt-navbar-left">
        <button
          id="yt-hamburger-toggle"
          className="yt-hamburger-btn"
          onClick={() => setIsSidebarOpen(prev => !prev)}
          aria-label={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          title={
            isSidebarOpen
              ? (isHindi ? 'साइडबार समेटें (Ctrl + B)' : 'Collapse Sidebar (Ctrl + B)')
              : (isHindi ? 'साइडबार खोलें (Ctrl + B)' : 'Expand Sidebar (Ctrl + B)')
          }
        >
          <Menu size={20} strokeWidth={2.2} />
        </button>

        <button
          className="yt-brand-btn"
          onClick={() => {
            setActiveTab('chat');
            if (window.innerWidth <= 868) setIsSidebarOpen(false);
          }}
          title="DhaaraAI Home Workspace"
        >
          <div className="yt-logo-box">
            <Scale size={20} strokeWidth={2.3} />
          </div>
          <div className="yt-brand-info">
            <span className="yt-brand-title">DhaaraAI</span>
            <span className="yt-country-badge">IN</span>
          </div>
        </button>

        <div className="yt-active-badge">
          <span className="yt-pulse-dot" />
          <span>{currentNav?.label || 'DhaaraAI'}</span>
        </div>
      </div>

      {/* Right: Theme, Language, Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="yt-theme-btn"
          title={
            theme === 'dark'
              ? (isHindi ? 'लाइट थीम में बदलें' : 'Switch to Light Theme')
              : (isHindi ? 'डार्क थीम में बदलें' : 'Switch to Dark Theme')
          }
        >
          {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
        </button>

        <div className="yt-lang-pill">
          <Globe size={13} color="var(--text-muted)" />
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="yt-lang-select"
          >
            <option value="English">EN</option>
            <option value="Hindi">हिन्दी</option>
          </select>
        </div>

        <div ref={profileMenuRef} style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="yt-profile-avatar"
            title="Account Menu"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>

          {showProfileMenu && (
            <div style={{
              position: 'absolute',
              top: '40px',
              right: '0',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: 'var(--radius-sm)',
              boxShadow: 'var(--card-shadow)',
              padding: '12px',
              minWidth: '210px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ borderBottom: '1px solid var(--card-border)', paddingBottom: '8px' }}>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-main)' }}>
                  {user?.name || 'Advocate.user'}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {user?.email || 'advocate@dhaara.ai'}
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--royal-600)', marginTop: '2px', fontWeight: '600' }}>
                  {user?.plan || 'Advocate Plan'}
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('settings');
                  setShowProfileMenu(false);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '6px 8px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '12.5px',
                  color: 'var(--text-main)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: 'var(--radius-xs)',
                  transition: 'all 0.15s ease'
                }}
              >
                <SettingsIcon size={14} /> {isHindi ? 'सेटिंग्स' : 'Settings'}
              </button>

              <button
                onClick={handleSignOut}
                style={{
                  width: '100%',
                  background: 'var(--danger-light)',
                  color: 'var(--danger)',
                  border: '1px solid var(--danger-border)',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.15s ease'
                }}
              >
                <LogOut size={14} /> {isHindi ? 'साइन आउट' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
