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
  const [theme, setTheme] = useState('light');
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
          } catch {}
          setAppView('app'); 
          setActiveTab('chat'); 
        }} 
        onBack={() => setAppView('landing')} 
      />
    );
  }

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', transition: 'all 0.3s ease', position: 'relative' }}>
      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          className="mobile-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <nav className={`no-print app-sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`} style={{
        width: isSidebarOpen ? '260px' : '80px',
        minWidth: isSidebarOpen ? '260px' : '80px',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        position: 'sticky',
        top: '0',
        height: '100vh',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Top Control - Toggle & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', minHeight: '60px' }}>
          <div 
            style={{ 
              display: isSidebarOpen ? 'flex' : 'none', 
              alignItems: 'center', gap: '12px', cursor: 'pointer', overflow: 'hidden' 
            }} 
            onClick={() => {
              setActiveTab('chat');
              if (window.innerWidth <= 868) setIsSidebarOpen(false);
            }}
          >
            <div style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', padding: '10px', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '40px', minHeight: '40px' }}>
              <Scale size={20} />
            </div>
            <div style={{ whiteSpace: 'nowrap' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>LegalGPT</h1>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.2 }}>DhaaraAI • Legal</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ 
              background: isSidebarOpen ? 'transparent' : '#f1f5f9', 
              border: isSidebarOpen ? 'none' : '1px solid #e2e8f0', 
              cursor: 'pointer', 
              color: 'var(--text-main)', 
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              minWidth: '40px',
              minHeight: '40px'
            }}
            title={isSidebarOpen ? (isHindi ? "साइडबार बंद करें" : "Close Sidebar") : (isHindi ? "साइडबार खोलें" : "Open Sidebar")}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginTop: isSidebarOpen ? '0' : '30px', overflowY: 'auto' }}>
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
                  background: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: isActive ? '700' : '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  gap: '12px',
                  padding: isSidebarOpen ? '12px 16px' : '12px 0',
                  borderRadius: '10px',
                  transition: 'all 0.15s ease',
                  textAlign: 'left',
                  width: '100%',
                  whiteSpace: 'nowrap'
                }}
              >
                <Icon size={isSidebarOpen ? 18 : 22} style={{ minWidth: isSidebarOpen ? '18px' : '22px' }} /> 
                {isSidebarOpen && <span>{tab.label}</span>}
              </button>
            );
          })}
        </div>

        {/* PWA Install Button */}
        {isInstallable && (
          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
            <button
              onClick={handleInstallApp}
              title={isHindi ? "ऐप इंस्टॉल करें" : "Install App"}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: isSidebarOpen ? '10px 14px' : '10px 0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                gap: '10px',
                fontSize: '13px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
              }}
            >
              <Smartphone size={18} style={{ minWidth: '18px' }} />
              {isSidebarOpen && <span>{isHindi ? 'ऐप इंस्टॉल करें' : 'Install App'}</span>}
            </button>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="app-main" style={{
        flex: 1,
        margin: '16px 16px 16px 0',
        padding: '32px 40px',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: isSidebarOpen ? 'calc(100% - 276px)' : 'calc(100% - 96px)',
        height: 'calc(100vh - 32px)',
        overflowY: 'auto',
        transition: 'all 0.3s ease'
      }}>
        {/* Top Bar for Mobile & Profile */}
        <div className="app-top-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative' }}>
          {/* Mobile hamburger toggle & title */}
          <div className="mobile-header-bar" style={{ display: 'none', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
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
              <div style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', padding: '6px', borderRadius: '8px', color: 'white', display: 'flex' }}>
                <Scale size={16} />
              </div>
              <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-main)' }}>LegalGPT</span>
            </div>
          </div>

          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <div 
               onClick={() => setShowProfileMenu(!showProfileMenu)}
               style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px', userSelect: 'none', boxShadow: '0 2px 10px rgba(59,130,246,0.3)' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {showProfileMenu && (
              <div style={{ position: 'absolute', top: '50px', right: '0', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '200px', border: '1px solid #e2e8f0' }}>
                 <div style={{ fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>{user?.name || 'User'}</div>
                 <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{user?.email || 'user@example.com'}</div>
                  <button onClick={() => { 
                    setUser(null); 
                    try {
                      localStorage.removeItem('dhaara_active_user');
                    } catch {}
                    setAppView('landing'); 
                    setShowProfileMenu(false); 
                  }} style={{ width: '100%', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <LogOut size={16} /> {isHindi ? 'साइन आउट' : 'Sign Out'}
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
              onThemeChange={setTheme}
              user={user}
              onUserChange={(updatedUser) => {
                setUser(updatedUser);
                try {
                  localStorage.setItem('dhaara_active_user', JSON.stringify(updatedUser));
                } catch {}
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
