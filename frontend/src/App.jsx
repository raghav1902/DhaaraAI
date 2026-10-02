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

  const [sharedDocId, setSharedDocId] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        return params.get('shared') || params.get('vault_share') || null;
      }
    } catch {}
    return null;
  });

  // Ensure authenticated backend session token exists for active user
  useEffect(() => {
    const ensureToken = async () => {
      if (user && !user.token && user.email) {
        try {
          const res = await fetch('http://localhost:8000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              password: user.password || 'session_sync_pwd_dhaara'
            })
          });
          if (res.ok) {
            const data = await res.json();
            const updated = { ...user, token: data.token, user_id: data.user_id };
            setUser(updated);
            localStorage.setItem('dhaara_active_user', JSON.stringify(updated));
          }
        } catch (e) {
          console.error('Failed to sync auth token:', e);
        }
      }
    };
    ensureToken();
  }, [user]);

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
  const sidebarSearchRef = useRef(null);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');

  // Global Ctrl + K search shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (sidebarSearchRef.current) {
          sidebarSearchRef.current.focus();
        } else if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
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

  const navSections = [
    {
      title: isHindi ? 'विधिक कार्यक्षेत्र' : 'LEGAL WORKSPACES',
      items: [
        { id: 'chat', label: isHindi ? 'AI से पूछें' : 'Ask AI', icon: Sparkles, badge: 'LegalGPT', badgeVariant: 'blue' },
        { id: 'drafting', label: isHindi ? 'विधिक ड्राफ्टिंग' : 'Legal Drafting', icon: FileText, badge: 'Sec 173', badgeVariant: 'blue' },
        { id: 'analyzer', label: isHindi ? 'अनुबंध समीक्षक' : 'Contract Audit', icon: FileSearch, badge: 'Risk', badgeVariant: 'amber' },
        { id: 'rights', label: isHindi ? 'नागरिक अधिकार & SOS' : 'Citizen Rights & SOS', icon: Shield, badge: 'Emergency', badgeVariant: 'danger' },
        { id: 'converter', label: isHindi ? 'BNS ↔ IPC' : 'BNS ↔ IPC', icon: ArrowRightLeft, badge: '2024', badgeVariant: 'blue' },
        { id: 'library', label: isHindi ? 'कानूनी लाइब्रेरी' : 'Legal Library', icon: BookOpen },
        { id: 'vault', label: isHindi ? 'सुरक्षित वॉल्ट' : 'Legal Vault', icon: Lock },
      ]
    },
    {
      title: isHindi ? 'उपयोगिताएं और उपकरण' : 'UTILITIES & TOOLS',
      items: [
        { id: 'calculator', label: isHindi ? 'शुल्क कैलकुलेटर' : 'Fee Calculator', icon: Calculator },
        { id: 'cyber', label: isHindi ? 'साइबर स्कैनर' : 'Cyber Scanner', icon: Globe },
      ]
    },
    {
      title: isHindi ? 'सिस्टम' : 'SYSTEM',
      items: [
        { id: 'settings', label: isHindi ? 'सेटिंग्स' : 'Settings', icon: SettingsIcon },
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
          } catch {}
        }}
      />
    );
  }

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
      >
        <div className="sidebar-scroll-body">
          {/* Brand Header */}
          <div className="sidebar-brand-row">
            <button
              className="sidebar-brand-btn"
              onClick={() => {
                if (!isSidebarOpen) {
                  setIsSidebarOpen(true);
                } else {
                  setActiveTab('chat');
                  if (window.innerWidth <= 868) setIsSidebarOpen(false);
                }
              }}
              title={isSidebarOpen ? "DhaaraAI Home Workspace" : (isHindi ? "साइडबार खोलें (Ctrl + B)" : "Expand Sidebar (Ctrl + B)")}
            >
              <div className="sidebar-logo-box">
                <Scale size={22} strokeWidth={2.2} />
              </div>
              <div className="sidebar-brand-info">
                <span className="sidebar-brand-title">DhaaraAI</span>
                <span className="sidebar-brand-subtitle">Indian Legal Intelligence</span>
              </div>
            </button>

            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
              title={isSidebarOpen ? (isHindi ? "साइडबार समेटें (Ctrl + B)" : "Collapse Sidebar (Ctrl + B)") : (isHindi ? "साइडबार खोलें (Ctrl + B)" : "Expand Sidebar (Ctrl + B)")}
            >
              {isSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
            </button>
          </div>

          {/* Search Workspace Input (Ctrl K) */}
          <div className="sidebar-search-wrap">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!sidebarSearchQuery.trim()) return;
                handleAskAiFromExternal(sidebarSearchQuery.trim());
                setSidebarSearchQuery('');
              }}
              className="sidebar-search-box"
            >
              <Search size={15} className="sidebar-search-icon" />
              <input
                ref={sidebarSearchRef}
                type="text"
                placeholder={isHindi ? "कार्यक्षेत्र खोजें..." : "Search workspace..."}
                value={sidebarSearchQuery}
                onChange={(e) => setSidebarSearchQuery(e.target.value)}
                className="sidebar-search-input"
              />
              <span className="sidebar-search-badge">Ctrl K</span>
            </form>
          </div>

          {/* Grouped Nav Sections */}
          {navSections.map((section) => {
            const visibleItems = sidebarSearchQuery.trim()
              ? section.items.filter(item =>
                  item.label.toLowerCase().includes(sidebarSearchQuery.toLowerCase()) ||
                  item.id.toLowerCase().includes(sidebarSearchQuery.toLowerCase()) ||
                  (item.badge && item.badge.toLowerCase().includes(sidebarSearchQuery.toLowerCase()))
                )
              : section.items;

            if (sidebarSearchQuery.trim() && visibleItems.length === 0) return null;

            return (
              <div key={section.title} className="sidebar-nav-section">
                <div className="sidebar-section-header">
                  {section.title}
                </div>
                <div className="sidebar-nav-group">
                  {visibleItems.map((tab) => {
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
                          <Icon size={17} strokeWidth={isActive ? 2.3 : 1.8} />
                        </div>
                        <span className="sidebar-nav-label">{tab.label}</span>
                        <div className="sidebar-badge-wrap">
                          {tab.badge && (
                            <span className={`sidebar-badge sidebar-badge--${tab.badgeVariant || 'blue'}`}>
                              {tab.badge}
                            </span>
                          )}
                          <ChevronRight size={15} className="sidebar-chevron" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* PWA Install Button */}
          {isInstallable && (
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(226, 232, 240, 0.6)' }}>
              <button
                onClick={handleInstallApp}
                title={isHindi ? "ऐप इंस्टॉल करें" : "Install App"}
                className="sidebar-nav-item"
              >
                <div className="sidebar-nav-icon-box" style={{ background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                  <Smartphone size={16} />
                </div>
                <span className="sidebar-nav-label" style={{ color: '#2563eb' }}>
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
              <div className="sidebar-user-meta">
                <div className="sidebar-user-name">
                  {user?.name || 'Advocate.user'}
                </div>
                <div className="sidebar-user-plan">
                  {user?.plan || 'Advocate Plan'}
                </div>
              </div>
              <ChevronRight size={16} className="sidebar-chevron" />
            </div>

            {/* Verified Legal Database Badge Card */}
            <div
              className="sidebar-verified-card"
              onClick={() => {
                setActiveTab('converter');
                if (window.innerWidth <= 868) setIsSidebarOpen(false);
              }}
              title="BNS 2023 & BNSS Verified - Updated legal database"
            >
              <div className="sidebar-verified-icon-box">
                <ShieldCheck size={18} strokeWidth={2.4} />
              </div>
              <div className="sidebar-verified-meta">
                <div className="sidebar-verified-title">
                  BNS 2023 / BNSS Verified
                </div>
                <div className="sidebar-verified-sub">
                  Updated legal database
                </div>
              </div>
              <ChevronRight size={15} className="sidebar-verified-chevron" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Workspace Stage */}
      <main ref={mainScrollRef} className="app-main" style={{
        flex: 1,
        margin: 0,
        padding: '14px 24px 20px',
        background: 'transparent',
        borderRadius: 0,
        border: 'none',
        boxShadow: 'none',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: isSidebarOpen ? 'calc(100% - 290px)' : 'calc(100% - 74px)',
        width: isSidebarOpen ? 'calc(100% - 290px)' : 'calc(100% - 74px)',
        height: '100vh',
        overflowY: activeTab === 'chat' ? 'hidden' : 'auto',
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
          padding: '10px 16px',
          marginBottom: '14px',
          background: 'var(--card-bg)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--card-border)',
          boxShadow: 'var(--card-shadow)',
          gap: '12px',
          flexWrap: 'wrap',
          flexShrink: 0,
          zIndex: 50
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

            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--subtle-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '5px 10px',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'all 0.15s ease'
                }}
                title={isHindi ? "साइडबार खोलें (Ctrl + B)" : "Expand Sidebar (Ctrl + B)"}
                aria-label="Expand Sidebar"
              >
                <PanelLeft size={16} />
                <span>{isHindi ? 'साइडबार' : 'Sidebar'}</span>
              </button>
            )}

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
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? (isHindi ? 'लाइट थीम में बदलें' : 'Switch to Light Theme') : (isHindi ? 'डार्क थीम में बदलें' : 'Switch to Dark Theme')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--subtle-bg)',
                border: '1px solid var(--card-border)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                gap: '6px',
                fontSize: '12px',
                fontWeight: '600',
                boxShadow: 'var(--shadow-xs)'
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
            <LegalVault
              language={language}
              onNavigateTab={setActiveTab}
              onOpenSharedDoc={(id) => setSharedDocId(id)}
            />
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
