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
  User as UserIcon
} from 'lucide-react';

function App() {
  const [appView, setAppView] = useState('landing');
  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [activeTab, setActiveTab] = useState('chat');
  const [language, setLanguage] = useState('English');
  const [theme, setTheme] = useState('light');
  const [injectedQuery, setInjectedQuery] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const isHindi = language === 'Hindi' || language === 'हिंदी';

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
    return <AuthPage onLogin={(userData) => { setUser(userData); setAppView('app'); setActiveTab('chat'); }} />;
  }

  return (
    <div className="app-container" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-color)', transition: 'all 0.3s ease' }}>
      {/* Sidebar Navigation */}
      <nav className="no-print" style={{
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
        transition: 'all 0.3s ease'
      }}>
        {/* Top Control - Toggle & Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'space-between' : 'center', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0', minHeight: '60px' }}>
          <div 
            style={{ 
              display: isSidebarOpen ? 'flex' : 'none', 
              alignItems: 'center', gap: '12px', cursor: 'pointer', overflow: 'hidden' 
            }} 
            onClick={() => setActiveTab('chat')}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, marginTop: isSidebarOpen ? '0' : '30px' }}>
          {navItems.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label} // Hover title
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
      </nav>

      {/* Main Content Area */}
      <main style={{
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
        {/* Top Bar for Profile */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', position: 'relative' }}>
          <div 
             onClick={() => setShowProfileMenu(!showProfileMenu)}
             style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', fontSize: '18px', userSelect: 'none', boxShadow: '0 2px 10px rgba(59,130,246,0.3)' }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          {showProfileMenu && (
            <div style={{ position: 'absolute', top: '50px', right: '0', background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', zIndex: 100, minWidth: '200px', border: '1px solid #e2e8f0' }}>
               <div style={{ fontWeight: '700', marginBottom: '4px', color: '#0f172a' }}>{user?.name || 'User'}</div>
               <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>{user?.email || 'user@example.com'}</div>
               <button onClick={() => { setUser(null); setAppView('landing'); setShowProfileMenu(false); }} style={{ width: '100%', background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                 <LogOut size={16} /> {isHindi ? 'साइन आउट' : 'Sign Out'}
               </button>
            </div>
          )}
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
              onUserChange={setUser}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
