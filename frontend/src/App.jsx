import React, { useState } from 'react';
import LegalChat from './components/LegalChat';
import LegalLibrary from './components/LegalLibrary';
import LegalDrafter from './components/LegalDrafter';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import CitizenRights from './components/CitizenRights';
import BnsConverter from './components/BnsConverter';
import { 
  Scale, 
  BookOpen, 
  Search, 
  FileText, 
  FileSearch, 
  ShieldAlert, 
  ArrowRightLeft,
  Globe
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [language, setLanguage] = useState('English');
  const [injectedQuery, setInjectedQuery] = useState(null);

  const isHindi = language === 'Hindi' || language === 'हिंदी';

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
  ];

  return (
    <div className="app-container">
      <nav className="glass-panel no-print" style={{ margin: '16px 20px', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('chat')}>
          <div style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', padding: '8px', borderRadius: '12px', color: 'white' }}>
            <Scale size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.02em' }}>LegalGPT</h1>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0 }}>DhaaraAI • Indian Legal Intelligence & Rights</p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          {navItems.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{ 
                  background: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent', 
                  border: isActive ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent', 
                  color: isActive ? 'var(--primary)' : 'var(--text-muted)', 
                  fontWeight: isActive ? '700' : '500', 
                  fontSize: '13.5px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}

          {/* Global Language Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '8px', padding: '3px', marginLeft: '6px', border: '1px solid #e2e8f0' }}>
            <button
              type="button"
              onClick={() => setLanguage('English')}
              style={{
                border: 'none',
                background: language === 'English' ? '#fff' : 'transparent',
                color: language === 'English' ? 'var(--primary)' : '#64748b',
                fontWeight: language === 'English' ? '700' : '500',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: language === 'English' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('Hindi')}
              style={{
                border: 'none',
                background: language === 'Hindi' ? '#fff' : 'transparent',
                color: language === 'Hindi' ? 'var(--primary)' : '#64748b',
                fontWeight: language === 'Hindi' ? '700' : '500',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: language === 'Hindi' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              हिंदी
            </button>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1060px', margin: '0 auto', width: '100%', padding: '0 20px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
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
      </main>
    </div>
  );
}

export default App;
