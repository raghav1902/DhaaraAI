import React, { useState, useEffect, useRef } from 'react';
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
import './WorkspaceVisuals.css';
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

  const [globalSearch, setGlobalSearch] = useState('');
  const searchInputRef = useRef(null);

  // Global Ctrl + K search shortcut
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleGlobalSearchSubmit = (e) => {
    e.preventDefault();
    if (!globalSearch.trim()) return;
    handleAskAiFromExternal(globalSearch.trim());
    setGlobalSearch('');
  };

  const navItems = [
    { id: 'chat', label: isHindi ? 'AI से पूछें' : 'Ask AI', icon: Search, badge: 'AI' },
    { id: 'drafting', label: isHindi ? 'ड्राफ्टिंग' : 'Drafting', icon: FileText, badge: 'Sec 173' },
    { id: 'analyzer', label: isHindi ? 'अनुबंध समीक्षक' : 'Contract Audit', icon: FileSearch, badge: 'Risk' },
    { id: 'rights', label: isHindi ? 'नागरिक अधिकार & SOS' : 'Citizen Rights & SOS', icon: ShieldAlert, badge: 'Emergency' },
    { id: 'converter', label: isHindi ? 'BNS ↔ IPC' : 'BNS ↔ IPC', icon: ArrowRightLeft, badge: '2024' },
    { id: 'library', label: isHindi ? 'कानूनी लाइब्रेरी' : 'Legal Library', icon: BookOpen },
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

      {/* Modern Refined Sidebar */}
      <nav className={`no-print app-sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{
        width: isSidebarOpen ? '255px' : '72px',
        minWidth: isSidebarOpen ? '255px' : '72px',
        padding: '18px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'sticky',
        top: '0',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        zIndex: 50,
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Brand Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarOpen ? 'space-between' : 'center',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--card-border)',
          minHeight: '52px'
        }}>
          <div
            style={{
              display: isSidebarOpen ? 'flex' : 'none',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            onClick={() => {
              setActiveTab('chat');
              if (window.innerWidth <= 868) setIsSidebarOpen(false);
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
              padding: '9px',
              borderRadius: '10px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '36px',
              minHeight: '36px',
              boxShadow: '0 3px 10px rgba(29, 78, 216, 0.3)'
            }}>
              <Scale size={18} />
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h1 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>DhaaraAI</h1>
                <span style={{ fontSize: '10px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary-border)', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>LegalGPT</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Indian Legal Intelligence</p>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: 'var(--subtle-bg)',
              border: '1px solid var(--card-border)',
              cursor: 'pointer',
              color: 'var(--text-main)',
              padding: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              minWidth: '34px',
              minHeight: '34px',
              transition: 'all 0.2s ease'
            }}
            title={isSidebarOpen ? (isHindi ? "साइडबार बंद करें" : "Collapse Sidebar") : (isHindi ? "साइडबार खोलें" : "Expand Sidebar")}
          >
            {isSidebarOpen ? <X size={16} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Section Label */}
        {isSidebarOpen && (
          <div style={{ padding: '0 8px', fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-dim)' }}>
            {isHindi ? 'विधिक मॉड्यूल' : 'Legal Modules'}
          </div>
        )}

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
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
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  gap: '10px',
                  padding: isSidebarOpen ? '9px 12px' : '9px 0',
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
                    top: '18%',
                    bottom: '18%',
                    width: '3.5px',
                    borderRadius: '0 4px 4px 0',
                    background: 'var(--primary)'
                  }} />
                )}
                <Icon size={isSidebarOpen ? 17 : 19} style={{ minWidth: isSidebarOpen ? '17px' : '19px', color: isActive ? 'var(--primary)' : 'inherit' }} />
                {isSidebarOpen && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span style={{
                        fontSize: '9.5px',
                        fontWeight: '700',
                        padding: '1px 6px',
                        borderRadius: '999px',
                        background: tab.id === 'rights' ? 'var(--danger-light)' : 'var(--primary-light)',
                        color: tab.id === 'rights' ? 'var(--danger)' : 'var(--primary)',
                        border: `1px solid ${tab.id === 'rights' ? 'var(--danger-border)' : 'var(--primary-border)'}`
                      }}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* PWA Install Button */}
        {isInstallable && (
          <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
            <button
              onClick={handleInstallApp}
              title={isHindi ? "ऐप इंस्टॉल करें" : "Install App"}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #059669, #047857)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: isSidebarOpen ? '8px 12px' : '8px 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                gap: '8px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)'
              }}
            >
              <Smartphone size={16} style={{ minWidth: '16px' }} />
              {isSidebarOpen && <span>{isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>}
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="app-main" style={{
        flex: 1,
        margin: '10px 12px 10px 0',
        padding: '20px 28px',
        background: 'var(--card-bg)',
        borderRadius: '16px',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: isSidebarOpen ? 'calc(100% - 267px)' : 'calc(100% - 84px)',
        height: 'calc(100vh - 20px)',
        overflowY: 'auto',
        color: 'var(--text-main)',
        transition: 'all 0.25s ease',
        zIndex: 1,
        position: 'relative'
      }}>
        {/* Top Header with Breadcrumbs, Global Search, and Quick Actions */}
        <header className="app-top-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '14px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--card-border)',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          {/* Left: Mobile Toggle & Active Module Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="mobile-header-bar"
              onClick={() => setIsSidebarOpen(true)}
              style={{
                display: 'none',
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '8px',
                padding: '7px',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-main)',
                cursor: 'pointer'
              }}
              aria-label="Open menu"
            >
              <Menu size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                padding: '5px 12px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontSize: '12.5px',
                fontWeight: '700',
                color: 'var(--text-main)'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)' }} />
                {navItems.find(n => n.id === activeTab)?.label || 'Workspace'}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>•</span>
                <span>BNS 2023 / BNSS Verified</span>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar with Ctrl+K shortcut */}
          <form onSubmit={handleGlobalSearchSubmit} style={{ flex: '1 1 280px', maxWidth: '440px', position: 'relative' }}>
            <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              ref={searchInputRef}
              type="text"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder={isHindi ? "धारा, केस या कानूनी प्रश्न खोजें..." : "Search sections, cases, or legal queries..."}
              className="input-field"
              style={{
                paddingLeft: '34px',
                paddingRight: '64px',
                paddingTop: '8px',
                paddingBottom: '8px',
                fontSize: '13px',
                height: '36px',
                borderRadius: '999px',
                background: 'var(--subtle-bg)'
              }}
            />
            <div style={{
              position: 'absolute',
              right: '8px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '10px',
              fontWeight: '700',
              color: 'var(--text-dim)',
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              padding: '2px 6px',
              borderRadius: '6px',
              pointerEvents: 'none',
              letterSpacing: '0.04em'
            }}>
              Ctrl K
            </div>
          </form>

          {/* Right: Language, Theme, Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 10px',
                borderRadius: '8px',
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600'
              }}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={14} color="#f59e0b" />
                  <span style={{ display: 'inline-block' }}>Light</span>
                </>
              ) : (
                <>
                  <Moon size={14} color="#6366f1" />
                  <span style={{ display: 'inline-block' }}>Dark</span>
                </>
              )}
            </button>

            {/* Language Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--subtle-bg)', border: '1px solid var(--card-border)', padding: '3px 8px', borderRadius: '8px' }}>
              <Globe size={13} color="var(--text-muted)" />
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="English">English</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
            </div>

            {/* Profile Menu Trigger */}
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '3px 9px 3px 4px',
                borderRadius: '999px',
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                userSelect: 'none'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '12px',
                boxShadow: '0 2px 6px rgba(29, 78, 216, 0.25)'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-main)', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name || 'Citizen'}
              </span>
            </div>

            {showProfileMenu && (
              <div style={{
                position: 'absolute',
                top: '42px',
                right: '0',
                background: 'var(--card-bg)',
                padding: '14px',
                borderRadius: '14px',
                boxShadow: 'var(--modal-shadow)',
                zIndex: 100,
                minWidth: '210px',
                border: '1px solid var(--card-border)',
                animation: 'fadeIn 0.2s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid var(--card-border)' }}>
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1d4ed8, #1e40af)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.name || 'User'}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email || 'user@example.com'}</div>
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
                    padding: '7px 10px',
                    borderRadius: '6px',
                    fontSize: '12.5px',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    marginBottom: '4px'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--subtle-bg)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <SettingsIcon size={14} color="var(--text-muted)" /> {isHindi ? 'प्रोफ़ाइल सेटिंग्स' : 'Account Settings'}
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
                    background: 'var(--danger-light)',
                    color: 'var(--danger)',
                    border: '1px solid var(--danger-border)',
                    padding: '7px 10px',
                    borderRadius: '6px',
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
        </header>

        <div className={activeTab === 'chat' ? 'workspace-content workspace-content-chat' : 'workspace-content'} style={{ maxWidth: activeTab === 'chat' ? 'none' : '1120px', margin: activeTab === 'chat' ? '0' : '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, minHeight: 0, height: '100%' }}>
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
