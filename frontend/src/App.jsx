import React, { useState } from 'react';
import LegalChat from './components/LegalChat';
import LegalLibrary from './components/LegalLibrary';
import LegalDrafter from './components/LegalDrafter';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import CitizenRights from './components/CitizenRights';
import BnsConverter from './components/BnsConverter';
import CyberChecker from './components/CyberChecker';
import LegalVault from './components/LegalVault';
import FeeCalculator from './components/FeeCalculator';
import Settings from './components/Settings';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
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
  Settings as SettingsIcon,
  LogOut,
  User as UserIcon,
  Smartphone
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

  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [activeTab, setActiveTab] = useState('chat');
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('dhaara_theme') || 'light';
    } catch {
      return 'light';
    }
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('dhaara_theme', nextTheme);
    } catch {}
  };

  const [injectedQuery, setInjectedQuery] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 868;
    }
    return true;
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 868) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isHindi = language === 'Hindi' || language === 'हिंदी';

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  const handleAskAiFromExternal = (queryText) => {
    setInjectedQuery(queryText);
    setActiveTab('chat');
  };

  const navItems = [
    { id: 'chat', label: isHindi ? 'AI से पूछें' : 'Ask AI', icon: Search },
    { id: 'drafting', label: isHindi ? 'ड्राफ्टिंग (FIR/नोटिस)' : 'Drafting', icon: FileText },
    { id: 'analyzer', label: isHindi ? 'अनुबंध समीक्षक' : 'Contract Audit', icon: FileSearch },
    { id: 'rights', label: isHindi ? 'नागरिक अधिकार & SOS' : 'Citizen Rights & SOS', icon: ShieldAlert },
    { id: 'converter', label: isHindi ? 'BNS ↔ IPC' : 'BNS ↔ IPC', icon: ArrowRightLeft },
    { id: 'library', label: isHindi ? 'लाइब्रेरी' : 'Legal Library', icon: BookOpen },
    { id: 'vault', label: isHindi ? 'सुरक्षित वॉल्ट' : 'Legal Vault', icon: Lock },
    { id: 'calculator', label: isHindi ? 'शुल्क कैलकुलेटर' : 'Fee Calculator', icon: Calculator },
    { id: 'cyber', label: isHindi ? 'साइबर स्कैनर' : 'Cyber Scanner', icon: Globe },
    { id: 'settings', label: isHindi ? 'सेटिंग्स' : 'Settings', icon: SettingsIcon },
  ];

  if (appView === 'landing') {
    return <LandingPage onExplore={() => setAppView('auth')} />;
  }

  if (appView === 'auth') {
    return (
      <AuthPage
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
    <div className="app-container" style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-color)',
      color: 'var(--text-main)',
      position: 'relative',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      transition: 'background 0.2s ease, color 0.2s ease'
    }}>
      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Modern Responsive Sidebar */}
      <nav className={`no-print app-sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{
        width: isSidebarOpen ? '270px' : '78px',
        minWidth: isSidebarOpen ? '270px' : '78px',
        padding: '20px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        position: 'sticky',
        top: '0',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        zIndex: 50,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarOpen ? 'space-between' : 'center',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--card-border)',
          minHeight: '56px'
        }}>
          <div
            style={{
              display: isSidebarOpen ? 'flex' : 'none',
              alignItems: 'center',
              gap: '12px',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            onClick={() => {
              setActiveTab('chat');
              if (window.innerWidth <= 868) setIsSidebarOpen(false);
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              padding: '10px',
              borderRadius: '12px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '40px',
              minHeight: '40px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)'
            }}>
              <Scale size={20} />
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h1 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>LegalGPT</h1>
                <span style={{ fontSize: '10px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary-border)', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>AI</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>DhaaraAI Legal Suite</p>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: 'var(--subtle-bg)',
              border: '1px solid var(--card-border)',
              cursor: 'pointer',
              color: 'var(--text-main)',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              minWidth: '38px',
              minHeight: '38px',
              transition: 'all 0.2s ease'
            }}
            title={isSidebarOpen ? (isHindi ? "साइडबार बंद करें" : "Collapse Sidebar") : (isHindi ? "साइडबार खोलें" : "Expand Sidebar")}
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Section Label */}
        {isSidebarOpen && (
          <div style={{ padding: '0 8px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}>
            {isHindi ? 'विधिक मॉड्यूल' : 'Modules'}
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
          {navItems.map(tab => {
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
                style={{
                  background: isActive ? 'var(--primary-light)' : 'transparent',
                  border: isActive ? '1px solid var(--primary-border)' : '1px solid transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  gap: '12px',
                  padding: isSidebarOpen ? '10px 14px' : '10px 0',
                  borderRadius: '10px',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  width: '100%',
                  whiteSpace: 'nowrap',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--subtle-bg)';
                    e.currentTarget.style.color = 'var(--text-main)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--text-muted)';
                  }
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '20%',
                    bottom: '20%',
                    width: '3px',
                    borderRadius: '0 4px 4px 0',
                    background: '#2563eb'
                  }} />
                )}
                <Icon size={isSidebarOpen ? 18 : 20} style={{ minWidth: isSidebarOpen ? '18px' : '20px', color: isActive ? '#2563eb' : 'inherit' }} />
                {isSidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </div>

        {/* PWA Install Button */}
        {isInstallable && (
          <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <button
              onClick={handleInstallApp}
              title={isHindi ? "ऐप इंस्टॉल करें" : "Install App"}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: isSidebarOpen ? '9px 12px' : '9px 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                gap: '10px',
                fontSize: '12.5px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Smartphone size={17} style={{ minWidth: '17px' }} />
              {isSidebarOpen && <span>{isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>}
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="app-main" style={{
        flex: 1,
        margin: '12px 14px 12px 0',
        padding: '24px 32px',
        background: 'var(--card-bg)',
        borderRadius: '20px',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: isSidebarOpen ? 'calc(100% - 284px)' : 'calc(100% - 92px)',
        height: 'calc(100vh - 24px)',
        overflowY: 'auto',
        color: 'var(--text-main)',
        transition: 'all 0.3s ease',
        zIndex: 1,
        position: 'relative'
      }}>
        {/* Top Control Bar */}
        <div className="app-top-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '16px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--card-border)',
          position: 'relative'
        }}>
          {/* Mobile hamburger toggle & title */}
          <div className="mobile-header-bar" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', padding: '6px', borderRadius: '8px', color: 'white', display: 'flex' }}>
                <Scale size={16} />
              </div>
              <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-main)' }}>LegalGPT</span>
            </div>
          </div>

          {/* Active Tab Breadcrumb & Live Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'var(--subtle-bg)',
              border: '1px solid var(--card-border)',
              padding: '6px 14px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)' }} />
              {navItems.find(n => n.id === activeTab)?.label || 'Workspace'}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>•</span>
              <span>BNS 2023 / BNSS Verified</span>
            </div>
          </div>

          {/* User Profile Pill & Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', position: 'relative' }}>
            {/* Theme Toggle Button (Dark / Light) */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 10px',
                borderRadius: '10px',
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                gap: '6px',
                fontSize: '12.5px',
                fontWeight: '600'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-border)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={15} color="#f59e0b" />
                  <span style={{ display: 'inline-block' }}>Light</span>
                </>
              ) : (
                <>
                  <Moon size={15} color="#6366f1" />
                  <span style={{ display: 'inline-block' }}>Dark</span>
                </>
              )}
            </button>

            {/* Language Quick Switch */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--subtle-bg)', border: '1px solid var(--card-border)', padding: '4px 8px', borderRadius: '10px' }}>
              <Globe size={14} color="var(--text-muted)" />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="English" style={{ background: 'var(--card-bg)', color: 'var(--text-main)' }}>English</option>
                <option value="Hindi" style={{ background: 'var(--card-bg)', color: 'var(--text-main)' }}>हिंदी (Hindi)</option>
              </select>
            </div>

            {/* Profile Dropdown */}
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 10px 4px 5px',
                borderRadius: '24px',
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none'
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-border)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--card-border)'}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Citizen'}
              </span>
            </div>

            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '46px',
                right: '0',
                background: 'var(--card-bg)',
                padding: '16px',
                borderRadius: '16px',
                boxShadow: 'var(--card-shadow)',
                zIndex: 100,
                minWidth: '220px',
                border: '1px solid var(--card-border)',
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--card-border)' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'User'}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email || 'user@example.com'}</div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginBottom: '6px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--subtle-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <SettingsIcon size={15} color="var(--text-muted)" /> {isHindi ? 'प्रोफ़ाइल सेटिंग्स' : 'Account Settings'}
                </button>

                <button
                  onClick={() => {
                    setUser(null);
                    try {
                      localStorage.removeItem('dhaara_active_user');
                    } catch { }
                    setAppView('landing');
                    setShowProfileMenu(false);
                  }}
                  style={{
                    width: '100%',
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fee2e2',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                >
                  <LogOut size={15} /> {isHindi ? 'साइन आउट' : 'Sign Out'}
                </button>
              </div>
            )}
          </div>
        </div>


        <div style={{ maxWidth: '1040px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1, height: '100%' }}>
          {activeTab === 'chat' && (
            <LegalChat
              initialQuery={injectedQuery}
              onQueryConsumed={() => setInjectedQuery(null)}
              language={language}
              onLanguageChange={setLanguage}
            />
          )}
          {activeTab === 'drafting' && (
            <LegalDrafter
              language={language}
              onLanguageChange={setLanguage}
            />
          )}
          {activeTab === 'analyzer' && (
            <DocumentAnalyzer
              language={language}
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
            />
          )}
          {activeTab === 'library' && (
            <LegalLibrary
              onAskAi={handleAskAiFromExternal}
              language={language}
            />
          )}
          {activeTab === 'vault' && (
            <LegalVault language={language} />
          )}
          {activeTab === 'calculator' && (
            <FeeCalculator language={language} />
          )}
          {activeTab === 'cyber' && (
            <CyberChecker language={language} />
          )}
          {activeTab === 'settings' && (
            <Settings
              language={language}
              onLanguageChange={setLanguage}
              theme={theme}
              onThemeChange={(newTheme) => {
                setTheme(newTheme);
                try {
                  localStorage.setItem('dhaara_theme', newTheme);
                } catch { }
              }}
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
    </div>
  );
}

export default App;
