import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, BookOpen, Scale, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';

export default function LegalLibrary({ onAskAi, language = 'English' }) {
  const [statutes, setStatutes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isHindi = language === 'Hindi' || language === 'हिंदी';

  useEffect(() => {
    fetchLibraryData();
  }, [selectedCategory]);

  const fetchLibraryData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const catParam = selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : '';
      const response = await axios.get(`http://localhost:8000/api/library${catParam}`);
      setStatutes(response.data.items || []);
      if (response.data.categories && response.data.categories.length > 0) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Failed to load library:', err);
      setError(isHindi ? 'लाइब्रेरी डेटा लोड करने में असमर्थ। कृपया जांचें कि बैकएंड सर्वर चालू है।' : 'Failed to load library data. Please make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStatutes = statutes.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.bns_section && item.bns_section.toLowerCase().includes(q)) ||
      (item.ipc_section && item.ipc_section.toLowerCase().includes(q)) ||
      (item.offense_en && item.offense_en.toLowerCase().includes(q)) ||
      (item.offense_hi && item.offense_hi.toLowerCase().includes(q)) ||
      (item.bns_title && item.bns_title.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.punishment && item.punishment.toLowerCase().includes(q))
    );
  });

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const handleAskSection = (item) => {
    const q = isHindi
      ? `मुझे ${item.bns_section} (${item.offense_hi || item.offense_en}) के तहत कानूनी प्रक्रिया, जमानत और अधिकारों के बारे में पूरी जानकारी दें।`
      : `Explain legal procedure, bail rules, and remedies under ${item.bns_section} (${item.offense_en}).`;
    onAskAi(q);
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '18px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--text-main)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={24} color="var(--primary)" />
            {isHindi ? 'भारतीय कानून एवं धारा संग्रह (Legal Library)' : 'Indian Statutory Codes & Concordance Library'}
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0 }}>
            {isHindi 
              ? 'भारतीय न्याय संहिता (BNS 2023), IPC 1860, BNSS एवं मुख्य अधिनियमों की प्रमाणित धाराएं व प्रक्रिया'
              : 'Verified statutory directory of Bharatiya Nyaya Sanhita (BNS 2023), IPC 1860, and Landmark Safeguards'}
          </p>
        </div>

        {/* Stats Pill */}
        <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Scale size={16} />
          {filteredStatutes.length} {isHindi ? 'धाराएं उपलब्ध' : 'Sections Listed'}
        </div>
      </div>

      {/* Search Input */}
      <div style={{ position: 'relative' }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isHindi ? "धारा खोजें (जैसे: 281, 420, 318, एक्सीडेंट, चेक बाउंस, मारपीट, साइबर)..." : "Search section or offense (e.g. 281, 420, accident, cheating, theft, assault)..."}
          className="input-field"
          style={{ paddingLeft: '48px', height: '48px', fontSize: '15px' }}
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'thin' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid #e5e7eb',
              background: selectedCategory === cat ? 'var(--primary)' : 'rgba(255,255,255,0.8)',
              color: selectedCategory === cat ? 'white' : 'var(--text-main)',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-muted)' }}>
          <div className="animate-spin" style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #e5e7eb', borderTopColor: 'var(--primary)', borderRadius: '50%', marginBottom: '12px' }} />
          <p>{isHindi ? 'कानूनी धाराएं लोड हो रही हैं...' : 'Loading statutory provisions...'}</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '12px', color: 'var(--danger)' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 8px' }} />
          <p>{error}</p>
        </div>
      ) : filteredStatutes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {isHindi ? 'कोई धारा नहीं मिली। कृपया कोई दूसरा शब्द या धारा नंबर खोजें।' : 'No matching sections found. Try a different keyword or section number.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredStatutes.map((item) => {
            const isExpanded = expandedId === item.id;
            const isBailable = item.bailable && item.bailable.toLowerCase().includes('bailable') && !item.bailable.toLowerCase().startsWith('non');

            return (
              <div 
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  transition: 'box-shadow 0.2s ease, border-color 0.2s ease'
                }}
              >
                {/* Top Section Tags & Category */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: '#2563eb', color: 'white', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.3px' }}>
                      {item.bns_section}
                    </span>
                    {item.ipc_section && item.ipc_section !== 'Refer text' && (
                      <span style={{ background: '#f3f4f6', color: '#4b5563', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', border: '1px solid #e5e7eb' }}>
                        Legacy: IPC Sec {item.ipc_section}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 8px' }}>
                  {item.offense_en}
                </h3>
                {item.offense_hi && item.offense_hi !== item.offense_en && (
                  <p style={{ fontSize: '14px', color: '#4b5563', margin: '0 0 10px', fontStyle: 'italic' }}>
                    {item.offense_hi}
                  </p>
                )}

                {/* Quick Attributes Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {item.nature && (
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '3px 10px', 
                      borderRadius: '12px', 
                      background: item.nature.toLowerCase().includes('non-cognizable') ? '#f3f4f6' : '#fee2e2', 
                      color: item.nature.toLowerCase().includes('non-cognizable') ? '#4b5563' : '#b91c1c', 
                      fontWeight: '600' 
                    }}>
                      {item.nature}
                    </span>
                  )}
                  {item.bailable && (
                    <span style={{ 
                      fontSize: '12px', 
                      padding: '3px 10px', 
                      borderRadius: '12px', 
                      background: isBailable ? '#d1fae5' : '#fed7aa', 
                      color: isBailable ? '#065f46' : '#9a3412', 
                      fontWeight: '600' 
                    }}>
                      {item.bailable}
                    </span>
                  )}
                  {item.punishment && (
                    <span style={{ fontSize: '12px', padding: '3px 10px', borderRadius: '12px', background: '#f0f9ff', color: '#0369a1', fontWeight: '500' }}>
                      {item.punishment}
                    </span>
                  )}
                </div>

                {/* Expandable Details */}
                {isExpanded && (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#374151' }}>
                    {item.bnss_procedure && (
                      <div>
                        <strong style={{ color: '#111827' }}>{isHindi ? 'प्रक्रिया व अधिकार (BNSS): ' : 'Procedure & Safeguards (BNSS): '}</strong>
                        <span>{item.bnss_procedure}</span>
                      </div>
                    )}
                    {item.victim_guidance && (
                      <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                        <strong style={{ color: '#047857' }}>{isHindi ? 'पीड़ित / शिकायतकर्ता के लिए कदम: ' : 'Complainant Action: '}</strong>
                        <span>{item.victim_guidance}</span>
                      </div>
                    )}
                    {item.accused_guidance && (
                      <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #3b82f6' }}>
                        <strong style={{ color: '#1d4ed8' }}>{isHindi ? 'कानूनी सुरक्षा (Accused Rights): ' : 'Protective Safeguards: '}</strong>
                        <span>{item.accused_guidance}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #f9fafb' }}>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {isExpanded ? (
                      <>{isHindi ? 'कम देखें' : 'Show Less'} <ChevronUp size={16} /></>
                    ) : (
                      <>{isHindi ? 'पूरी जानकारी व अधिकार' : 'View Full Details'} <ChevronDown size={16} /></>
                    )}
                  </button>

                  <button
                    onClick={() => handleAskSection(item)}
                    style={{
                      background: 'rgba(59, 130, 246, 0.08)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: 'var(--primary)',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  >
                    <Sparkles size={15} />
                    {isHindi ? 'AI से पूछें' : 'Ask AI'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
