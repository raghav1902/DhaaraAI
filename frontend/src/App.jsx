import React, { useState, useEffect, useRef } from 'react';
import LegalChat from './components/LegalChat';
import LegalLibrary from './components/LegalLibrary';
import LegalDrafter from './components/LegalDrafter';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import CitizenRights from './components/CitizenRights';
import BnsConverter from './components/BnsConverter';
import CyberChecker from './components/CyberChecker';
import LegalVault from './components/LegalVault';
import SharedDocumentViewer from './components/SharedDocumentViewer';
import FeeCalculator from './components/FeeCalculator';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import UpgradeModal from './components/UpgradeModal';
import { API_BASE } from './config/apiConfig';
import './WorkspaceVisuals.css';
import './Sidebar.css';
import {
  Scale,
  BookOpen,
  Search,
  FileText,
  FileSearch,
  ShieldAlert,
  ArrowRightLeft,
  Moon,
  Sun,
  Lock,
  Calculator,
  Globe,
  Menu,
  X,
  PanelLeftClose,
  PanelLeft,
  Settings as SettingsIcon,
  LogOut,
  Smartphone,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Shield
} from 'lucide-react';

function App() {
  const [appView, setAppView] = useState(() => {
    try {
      const savedUser = localStorage.getItem('dhaara_active_user');
      return savedUser ? 'app' : 'landing';
    } catch {
      return 'landing';
    }
  });

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('dhaara_active_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [authMode, setAuthMode] = useState('login');

  const [sharedDocId, setSharedDocId] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        return params.get('shared') || params.get('vault_share') || null;
      }
    } catch { }
    return null;
  });

  // Global Upgrade Paywall Modal State
  const [upgradeModal, setUpgradeModal] = useState({
    isOpen: false,
    featureName: '',
    message: ''
  });

  const handleOpenUpgradeModal = (featureName, message) => {
    setUpgradeModal({
      isOpen: true,
      featureName: featureName || '',
      message: message || ''
    });
  };

  // Ref to prevent repeated failed token syncs (Fix #15 infinite loop protection)
  const tokenSyncAttemptedRef = useRef(false);

  // Ensure authenticated, valid backend session token exists for active user with up-to-date plan
  useEffect(() => {
    let isCancelled = false;
    const ensureToken = async () => {
      try {
        const stored = (() => {
          try {
            return JSON.parse(localStorage.getItem('dhaara_active_user') || 'null');
          } catch {
            return null;
          }
        })();
        const activeEmail = user?.email || stored?.email || 'advocate.user@dhaaraai.com';
        const activeToken = user?.token || stored?.token || undefined;

        const syncRes = await fetch(`${API_BASE}/api/auth/sync-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: activeEmail,
            token: activeToken
          })
        });

        if (syncRes.ok) {
          const data = await syncRes.json();
          if (!isCancelled) {
            const updated = {
              ...(stored || {}),
              ...(user || {}),
              user_id: data.user_id,
              email: data.email,
              name: data.name || user?.name || stored?.name || 'Advocate User',
              plan: data.plan || 'plus',
              token: data.token
            };
            setUser(updated);
            try {
              localStorage.setItem('dhaara_active_user', JSON.stringify(updated));
            } catch {}
          }
        }
      } catch (e) {
        console.error('Failed to sync session token:', e);
      }
    };
    ensureToken();
    return () => { isCancelled = true; };
  }, [user?.email]);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);
  const mainScrollRef = useRef(null);

  const [activeTab, setActiveTab] = useState('chat');

  // Reset scroll to top on tab change
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeTab]);

  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('dhaara_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  const applyThemeChange = (nextTheme) => {
    // Suppress all CSS transitions instantly during theme swap
    const el = document.documentElement;
    el.classList.add('no-transition');
    if (nextTheme === 'dark') {
      el.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
    } else {
      el.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
    }
    // Re-enable transitions after paint
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('no-transition')));
    setTheme(nextTheme);
    try { localStorage.setItem('dhaara_theme', nextTheme); } catch { }
  };

  const toggleTheme = () => applyThemeChange(theme === 'dark' ? 'light' : 'dark');

  const [injectedQuery, setInjectedQuery] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 868;
    }
    return true;
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Close profile menu on outside click or Escape
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 868) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isHindi = language === 'Hindi' || language === 'हिंदी';

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    if (appView === 'landing' || appView === 'auth') {
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark-theme');
      return;
    }
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      document.documentElement.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [theme, appView]);

  const handleAskAiFromExternal = (queryText) => {
    setInjectedQuery(queryText);
    setActiveTab('chat');
  };

  // Global Ctrl + B sidebar toggle shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navSections = [
    {
      title: isHindi ? 'विधिक कार्यक्षेत्र' : 'LEGAL WORKSPACES',
      items: [
        { id: 'chat', label: isHindi ? 'AI से पूछें' : 'Ask AI', shortLabel: isHindi ? 'AI पूछें' : 'Ask AI', icon: Sparkles },
        { id: 'drafting', label: isHindi ? 'विधिक ड्राफ्टिंग' : 'Legal Drafting', shortLabel: isHindi ? 'ड्राफ्टिंग' : 'Drafting', icon: FileText },
        { id: 'analyzer', label: isHindi ? 'अनुबंध समीक्षक' : 'Contract Audit', shortLabel: isHindi ? 'ऑडिट' : 'Analyzer', icon: FileSearch },
        { id: 'rights', label: isHindi ? 'नागरिक अधिकार & SOS' : 'Citizen Rights & SOS', shortLabel: isHindi ? 'अधिकार' : 'Rights', icon: Shield },
        { id: 'converter', label: isHindi ? 'BNS ↔ IPC' : 'BNS ↔ IPC', shortLabel: 'BNS/IPC', icon: ArrowRightLeft },
        { id: 'library', label: isHindi ? 'कानूनी लाइब्रेरी' : 'Legal Library', shortLabel: isHindi ? 'लाइब्रेरी' : 'Library', icon: BookOpen },
        { id: 'vault', label: isHindi ? 'सुरक्षित वॉल्ट' : 'Legal Vault', shortLabel: isHindi ? 'वॉल्ट' : 'Vault', icon: Lock },
      ]
    },
    {
      title: isHindi ? 'उपयोगिताएं और उपकरण' : 'UTILITIES & TOOLS',
      items: [
        { id: 'calculator', label: isHindi ? 'शुल्क कैलकुलेटर' : 'Fee Calculator', shortLabel: isHindi ? 'कैलकुलेटर' : 'Calculator', icon: Calculator },
        { id: 'cyber', label: isHindi ? 'साइबर स्कैनर' : 'Cyber Scanner', shortLabel: isHindi ? 'साइबर' : 'Cyber Scan', icon: Globe },
      ]
    },
    {
      title: isHindi ? 'सिस्टम' : 'SYSTEM',
      items: [
        { id: 'settings', label: isHindi ? 'सेटिंग्स' : 'Settings', shortLabel: isHindi ? 'सेटिंग्स' : 'Settings', icon: SettingsIcon },
      ]
    }
  ];


  const navItems = navSections.flatMap(sec => sec.items);

  if (sharedDocId) {
    return (
      <SharedDocumentViewer
        shareId={sharedDocId}
        onBack={() => {
          setSharedDocId(null);
          try {
            const url = new URL(window.location);
            url.searchParams.delete('shared');
            url.searchParams.delete('vault_share');
            window.history.replaceState({}, '', url.pathname || '/');
          } catch { }
        }}
      />
    );
  }

  if (appView === 'landing') {
    return (
      <LandingPage
        user={user}
        onExplore={(mode = 'signup') => {
          if (user) {
            setAppView('app');
          } else {
            setAuthMode(mode === 'login' ? 'login' : 'signup');
            setAppView('auth');
          }
        }}
        onLogin={() => {
          if (user) {
            setAppView('app');
          } else {
            setAuthMode('login');
            setAppView('auth');
          }
        }}
      />
    );
  }

  if (appView === 'auth') {
    return (
      <AuthPage
        initialMode={authMode}
        onLogin={(userData) => {
          setUser(userData);
          try {
            localStorage.setItem('dhaara_active_user', JSON.stringify(userData));
          } catch { }
          setAppView('app');
          setActiveTab('chat');
        }}
        onBack={() => setAppView('landing')}
      />
    );
  }

  const currentNav = navItems.find(n => n.id === activeTab) || navItems[0];

  return (
    <div className="app-container app-layout-root" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      background: 'var(--bg-color)',
      color: 'var(--text-main)',
      position: 'relative',
      fontFamily: "var(--font-sans)"
    }}>
      {/* 1. TOP NAVBAR (YouTube Style: Hamburger on the LEFT of Logo, Fixed & Never Changes Size!) */}
      <header className="yt-top-navbar no-print">
        {/* Left: Hamburger Button + Fixed Logo + Active Module Badge */}
        <div className="yt-navbar-left">
          {/* Hamburger button on the LEFT of the logo */}
          <button
            id="yt-hamburger-toggle"
            className="yt-hamburger-btn"
            onClick={() => setIsSidebarOpen(prev => !prev)}
            aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            title={isSidebarOpen ? (isHindi ? "साइडबार समेटें (Ctrl + B)" : "Collapse Sidebar (Ctrl + B)") : (isHindi ? "साइडबार खोलें (Ctrl + B)" : "Expand Sidebar (Ctrl + B)")}
          >
            <Menu size={20} strokeWidth={2.2} />
          </button>

          {/* DhaaraAI Brand Logo: Fixed size, Never changes when sidebar is opened or closed */}
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

          {/* Active Module Indicator Badge */}
          <div className="yt-active-badge">
            <span className="yt-pulse-dot" />
            <span>{currentNav.label}</span>
          </div>
        </div>

        {/* Right: Theme, Language, Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>

          {/* Theme Toggle */}
          <button
            id="theme-toggle-btn"
            onClick={toggleTheme}
            className="yt-theme-btn"
            title={theme === 'dark' ? (isHindi ? 'लाइट थीम में बदलें' : 'Switch to Light Theme') : (isHindi ? 'डार्क थीम में बदलें' : 'Switch to Dark Theme')}
          >
            {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#6366f1" />}
          </button>

          {/* Language Selector */}
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

          {/* Profile Menu Trigger */}
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
                  onClick={async () => {
                    const activeToken = user?.token;
                    try {
                      if (activeToken) {
                        fetch(`${API_BASE}/api/auth/logout`, {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${activeToken}` }
                        }).catch(() => {});
                      }
                      localStorage.removeItem('dhaara_active_user');
                    } catch { }
                    setUser(null);
                    setAppView('landing');
                    setShowProfileMenu(false);
                  }}
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

      {/* 2. BODY LAYOUT (Sidebar + Main Workspace) */}
      <div className="app-body-layout" style={{
        display: 'flex',
        flex: 1,
        height: 'calc(100vh - 56px)',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* Mobile Drawer Backdrop */}
        {isSidebarOpen && (
          <div
            className="mobile-backdrop"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Primary Sidebar Navigation */}
        <nav
          className={`no-print app-sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}
          aria-label="Main Navigation"
        >
          <div className="sidebar-scroll-body">
            {/* Grouped Nav Sections */}
            {navSections.map((section) => (
              <div key={section.title} className="sidebar-nav-section">
                {isSidebarOpen && (
                  <div className="sidebar-section-header">
                    {section.title}
                  </div>
                )}
                <div className="sidebar-nav-group">
                  {section.items.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          if (window.innerWidth <= 868) {
                            setIsSidebarOpen(false);
                          }
                        }}
                        title={tab.label}
                        aria-current={isActive ? 'page' : undefined}
                        className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item--active' : ''}`}
                      >
                        {isActive && <div className="sidebar-active-pill" />}
                        <div className="sidebar-nav-icon-box">
                          <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} />
                        </div>
                        <span className="sidebar-nav-label">
                          {isSidebarOpen ? tab.label : (tab.shortLabel || tab.label)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* PWA Install Button */}
            {isInstallable && isSidebarOpen && (
              <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
                <button
                  onClick={handleInstallApp}
                  title={isHindi ? "ऐप इंस्टॉल करें" : "Install App"}
                  className="sidebar-nav-item"
                >
                  <div className="sidebar-nav-icon-box" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                    <Smartphone size={16} />
                  </div>
                  <span className="sidebar-nav-label" style={{ color: 'var(--primary)' }}>
                    {isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}
                  </span>
                </button>
              </div>
            )}

            {/* Sidebar Bottom Footer Cards */}
            <div className="sidebar-footer">
              {/* User Profile Card */}
              <div
                className="sidebar-user-card"
                onClick={() => {
                  setActiveTab('settings');
                  if (window.innerWidth <= 868) setIsSidebarOpen(false);
                }}
                title="Advocate Account Settings"
              >
                <div className="sidebar-user-avatar">
                  {user?.name ? user.name[0].toUpperCase() : 'A'}
                </div>
                {isSidebarOpen && (
                  <div className="sidebar-user-meta">
                    <div className="sidebar-user-name">
                      {user?.name || 'Advocate.user'}
                    </div>
                    <div className="sidebar-user-plan">
                      {user?.plan || 'Advocate Plan'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

      {/* Main Workspace Stage */}
      <main ref={mainScrollRef} className="app-main" style={{
        flex: '1 1 0%',
        minWidth: 0,
        margin: 0,
        padding: '16px 20px',
        background: 'transparent',
        borderRadius: 0,
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '100%',
        height: '100%',
        overflowX: 'hidden',
        overflowY: activeTab === 'chat' ? 'hidden' : 'auto',
        scrollbarGutter: 'stable',
        color: 'var(--text-main)',
        transition: 'all 0.25s ease',
        zIndex: 1,
        position: 'relative',
        boxSizing: 'border-box'
      }}>


        {/* Dynamic Workspace Container */}
        <div
          className={activeTab === 'chat' ? 'workspace-content workspace-content-chat' : 'workspace-content'}
          style={{
            maxWidth: activeTab === 'chat' || activeTab === 'drafting' || activeTab === 'vault' ? 'none' : '1160px',
            margin: activeTab === 'chat' || activeTab === 'drafting' || activeTab === 'vault' ? '0' : '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            flex: 1,
            minHeight: 0,
            height: activeTab === 'chat' ? '100%' : 'auto'
          }}
        >
          {activeTab === 'chat' && (
            <LegalChat
              initialQuery={injectedQuery}
              onQueryConsumed={() => setInjectedQuery(null)}
              language={language}
              onLanguageChange={setLanguage}
              user={user}
              onNavigateTab={setActiveTab}
              onOpenUpgradeModal={handleOpenUpgradeModal}
            />
          )}
          {activeTab === 'drafting' && (
            <LegalDrafter
              language={language}
              onLanguageChange={setLanguage}
              user={user}
              onNavigateTab={setActiveTab}
              onOpenUpgradeModal={handleOpenUpgradeModal}
            />
          )}
          {activeTab === 'analyzer' && (
            <DocumentAnalyzer
              language={language}
              user={user}
              onNavigateTab={setActiveTab}
              onOpenUpgradeModal={handleOpenUpgradeModal}
            />
          )}
          {activeTab === 'rights' && (
            <CitizenRights
              language={language}
            />
          )}
          {activeTab === 'converter' && (
            <BnsConverter
              language={language}
              onAskAi={handleAskAiFromExternal}
              user={user}
              onNavigateTab={setActiveTab}
              onOpenUpgradeModal={handleOpenUpgradeModal}
            />
          )}
          {activeTab === 'library' && (
            <LegalLibrary
              onAskAi={handleAskAiFromExternal}
              language={language}
              user={user}
              onNavigateTab={setActiveTab}
              onOpenUpgradeModal={handleOpenUpgradeModal}
            />
          )}
          {activeTab === 'vault' && (
            <LegalVault
              language={language}
              onNavigateTab={setActiveTab}
              onOpenSharedDoc={(id) => setSharedDocId(id)}
            />
          )}
          {activeTab === 'calculator' && (
            <FeeCalculator
              language={language}
              user={user}
              onNavigateTab={setActiveTab}
              onOpenUpgradeModal={handleOpenUpgradeModal}
            />
          )}
          {activeTab === 'cyber' && (
            <CyberChecker
              language={language}
              user={user}
              onNavigateTab={setActiveTab}
              onOpenUpgradeModal={handleOpenUpgradeModal}
            />
          )}
          {activeTab === 'settings' && (
            <Settings
              language={language}
              onLanguageChange={setLanguage}
              theme={theme}
              onThemeChange={applyThemeChange}
              user={user}
              onUserChange={(updatedUser) => {
                setUser(updatedUser);
                try {
                  localStorage.setItem('dhaara_active_user', JSON.stringify(updatedUser));
                } catch { }
              }}
            />
          )}
        </div>
      </main>

      {/* Global Upgrade to Plus Paywall Modal */}
      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ isOpen: false, featureName: '', message: '' })}
        featureName={upgradeModal.featureName}
        message={upgradeModal.message}
        user={user}
        onUpgradeSuccess={(updatedUser) => {
          setUser(updatedUser);
          try {
            localStorage.setItem('dhaara_active_user', JSON.stringify(updatedUser));
          } catch (e) {}
        }}
        onNavigateTab={setActiveTab}
        language={language}
      />
    </div>
  </div>
);
}

export default App;
