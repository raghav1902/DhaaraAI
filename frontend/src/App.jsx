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
import AppNavbar from './components/App/AppNavbar';
import AppSidebar from './components/App/AppSidebar';
import { getNavSections } from './components/App/navConfig';
import { API_BASE } from './config/apiConfig';
import './WorkspaceVisuals.css';
import './Sidebar.css';

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

  // Ref to prevent repeated failed token syncs (infinite loop protection)
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
    const el = document.documentElement;
    el.classList.add('no-transition');
    if (nextTheme === 'dark') {
      el.classList.add('dark-theme');
      document.body.classList.add('dark-theme');
    } else {
      el.classList.remove('dark-theme');
      document.body.classList.remove('dark-theme');
    }
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

  const navSections = getNavSections(isHindi);
  const navItems = navSections.flatMap(sec => sec.items);
  const currentNav = navItems.find(n => n.id === activeTab) || navItems[0];

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
      fontFamily: 'var(--font-sans)'
    }}>
      {/* 1. TOP NAVBAR */}
      <AppNavbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentNav={currentNav}
        theme={theme}
        toggleTheme={toggleTheme}
        language={language}
        setLanguage={setLanguage}
        isHindi={isHindi}
        user={user}
        setUser={setUser}
        setAppView={setAppView}
        apiBase={API_BASE}
      />

      {/* 2. BODY LAYOUT (Sidebar + Main Workspace) */}
      <div className="app-body-layout" style={{
        display: 'flex',
        flex: 1,
        height: 'calc(100vh - 56px)',
        width: '100%',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <AppSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          navSections={navSections}
          isInstallable={isInstallable}
          handleInstallApp={handleInstallApp}
          user={user}
          isHindi={isHindi}
        />

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
