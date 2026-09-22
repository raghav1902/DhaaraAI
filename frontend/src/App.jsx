import React, { useState } from 'react';
import LegalChat from './components/LegalChat';
import LegalLibrary from './components/LegalLibrary';
import { Scale, BookOpen, Search } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [language, setLanguage] = useState('English');
  const [injectedQuery, setInjectedQuery] = useState(null);

  const handleAskAiFromLibrary = (queryText) => {
    setInjectedQuery(queryText);
    setActiveTab('chat');
  };

  return (
    <div className="app-container">
      <nav className="glass-panel" style={{ margin: '20px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px', color: 'white' }}>
            <Scale size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>LegalGPT</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>DhaaraAI - Simplifying Indian Law</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button 
            onClick={() => setActiveTab('chat')}
            style={{ 
              background: activeTab === 'chat' ? 'rgba(59, 130, 246, 0.12)' : 'none', 
              border: 'none', 
              color: activeTab === 'chat' ? 'var(--primary)' : 'var(--text-muted)', 
              fontWeight: '600', 
              fontSize: '15px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px'
            }}
          >
            <Search size={18} /> {language === 'Hindi' ? 'AI से पूछें' : 'Ask AI'}
          </button>
          <button 
            onClick={() => setActiveTab('library')}
            style={{ 
              background: activeTab === 'library' ? 'rgba(59, 130, 246, 0.12)' : 'none', 
              border: 'none', 
              color: activeTab === 'library' ? 'var(--primary)' : 'var(--text-muted)', 
              fontWeight: '600', 
              fontSize: '15px', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px'
            }}
          >
            <BookOpen size={18} /> {language === 'Hindi' ? 'कानूनी लाइब्रेरी' : 'Library'}
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '1020px', margin: '0 auto', width: '100%', padding: '0 20px 40px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'chat' ? (
          <LegalChat 
            initialQuery={injectedQuery} 
            onQueryConsumed={() => setInjectedQuery(null)}
            language={language}
            onLanguageChange={setLanguage}
          />
        ) : (
          <LegalLibrary 
            onAskAi={handleAskAiFromLibrary}
            language={language}
          />
        )}
      </main>
    </div>
  );
}

export default App;
