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
  Smartphone,
  ShieldCheck
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
  const profileMenuRef = useRef(null);

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
  useEffect(() => {
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
    { id: 'chat', label: isHindi ? 'AI से पूछें' : 'Ask AI', icon: Search, badge: 'LegalGPT' },
    { id: 'drafting', label: isHindi ? 'ड्राफ्टिंग' : 'Legal Drafting', icon: FileText, badge: 'Sec 173' },
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

  const currentNav = navItems.find(n => n.id === activeTab) || navItems[0];

  return (
    <div className="app-container" style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-color)',
      color: 'var(--text-main)',
      position: 'relative',
      fontFamily: "var(--font-sans)",
      transition: 'background 0.2s ease, color 0.2s ease'
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
        style={{
          width: isSidebarOpen ? '260px' : '74px',
          minWidth: isSidebarOpen ? '260px' : '74px',
          padding: '16px 12px',
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
          transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
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
            title="DhaaraAI Home Workspace"
          >
            <div style={{
              background: 'linear-gradient(135deg, var(--royal-700), #1e3a8a)',
              padding: '8px',
              borderRadius: 'var(--radius-sm)',
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
                <span style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>DhaaraAI</span>
                <span style={{ fontSize: '10px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary-border)', padding: '1px 6px', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>LegalGPT</span>
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
              borderRadius: 'var(--radius-xs)',
              minWidth: '34px',
              minHeight: '34px',
              transition: 'all 0.2s ease'
            }}
            aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            title={isSidebarOpen ? (isHindi ? "साइडबार बंद करें" : "Collapse Sidebar") : (isHindi ? "साइडबार खोलें" : "Expand Sidebar")}
          >
            {isSidebarOpen ? <X size={16} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Section Label */}
        {isSidebarOpen && (
          <div style={{ padding: '0 8px', fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-dim)' }}>
            {isHindi ? 'विधिक मॉड्यूल' : 'Legal Workspaces'}
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
                aria-current={isActive ? 'page' : undefined}
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
                  borderRadius: 'var(--radius-sm)',
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
                        borderRadius: 'var(--radius-full)',
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
                background: 'linear-gradient(135deg, var(--emerald-600), var(--emerald-700))',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
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

      {/* Main Workspace Stage */}
      <main className="app-main" style={{
        flex: 1,
        margin: '10px 14px 10px 0',
        padding: '20px 24px',
        background: 'var(--card-bg)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--card-border)',
        boxShadow: 'var(--card-shadow)',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: isSidebarOpen ? 'calc(100% - 274px)' : 'calc(100% - 88px)',
        height: 'calc(100vh - 20px)',
        overflowY: 'auto',
        color: 'var(--text-main)',
        transition: 'all 0.25s ease',
        zIndex: 1,
        position: 'relative'
      }}>
        {/* Top Header: Breadcrumb, Verified Status, Global Search, Theme, Language, Profile */}
        <header className="app-top-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '14px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--card-border)',
          gap: '14px',
          flexWrap: 'wrap'
        }}>
          {/* Left: Mobile Toggle & Active Workspace Badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '220px' }}>
            <button
              className="mobile-header-bar"
              onClick={() => setIsSidebarOpen(true)}
              style={{
                display: 'none',
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 'var(--radius-xs)',
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <div style={{
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                padding: '5px 12px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                fontSize: '12.5px',
                fontWeight: '700',
                color: 'var(--text-main)'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--emerald-500)', display: 'inline-block', boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)' }} />
                {currentNav.label}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={13} color="var(--emerald-600)" />
                <span>BNS 2023 / BNSS Verified</span>
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar with Ctrl+K shortcut */}
          <form onSubmit={handleGlobalSearchSubmit} style={{ flex: '1 1 240px', maxWidth: '420px', minWidth: '180px', position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            <input
              ref={searchInputRef}
              type="text"
              value={globalSearch}
              onChange={e => setGlobalSearch(e.target.value)}
              placeholder={isHindi ? "धारा, केस या कानूनी प्रश्न खोजें..." : "Search sections, cases, or legal queries..."}
              className="input-field"
              style={{
                paddingLeft: '32px',
                paddingRight: '60px',
                paddingTop: '7px',
                paddingBottom: '7px',
                fontSize: '12.5px',
                height: '34px',
                borderRadius: 'var(--radius-full)',
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
              padding: '1px 5px',
              borderRadius: 'var(--radius-xs)',
              pointerEvents: 'none'
            }}>
              Ctrl K
            </div>
          </form>

          {/* Right: Language, Theme, Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 10px',
                borderRadius: 'var(--radius-xs)',
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                gap: '5px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--subtle-bg)', border: '1px solid var(--card-border)', padding: '3px 8px', borderRadius: 'var(--radius-xs)' }}>
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
                <option value="Hindi">हिंदी</option>
              </select>
            </div>

            {/* Profile Menu Trigger */}
            <div ref={profileMenuRef} style={{ position: 'relative' }}>
              <div
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '3px 9px 3px 4px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--subtle-bg)',
                  border: '1px solid var(--card-border)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  userSelect: 'none'
                }}
                title="Account Menu"
              >
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--royal-700), #1e3a8a)',
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
                  top: '40px',
                  right: '0',
                  background: 'var(--card-bg)',
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
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
                      background: 'linear-gradient(135deg, var(--royal-700), #1e3a8a)',
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
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.email || 'user@dhaara.ai'}</div>
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
                      borderRadius: 'var(--radius-xs)',
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

        {/* Dynamic Workspace Container */}
        <div
          className={activeTab === 'chat' ? 'workspace-content workspace-content-chat' : 'workspace-content'}
          style={{
            maxWidth: activeTab === 'chat' || activeTab === 'drafting' ? 'none' : '1160px',
            margin: activeTab === 'chat' || activeTab === 'drafting' ? '0' : '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            flex: 1,
            minHeight: 0,
            height: '100%'
          }}
        >
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
