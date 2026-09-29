import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, BookOpen, Scale, ArrowRight, ShieldCheck, AlertCircle, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import './LegalLibrary.css';

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
    <div className="legal-library animate-fade-in" style={{ padding: '0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="legal-library__header" style={{
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            padding: '10px',
            borderRadius: '12px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                {isHindi ? 'कानूनी पुस्तकालय' : 'Legal Library'}
              </h2>
              <span style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary-border)', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                BNS & IPC
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              {isHindi
                ? 'भारतीय न्याय संहिता (BNS 2023), IPC 1860, BNSS एवं मुख्य अधिनियमों की प्रमाणित धाराएं'
                : 'Verified statutory directory of Bharatiya Nyaya Sanhita (BNS 2023), IPC 1860, and Special Acts'}
            </p>
          </div>
        </div>

        {/* Stats Pill */}
        <div style={{ background: 'var(--subtle-bg)', border: '1px solid var(--card-border)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Scale size={15} />
          {filteredStatutes.length} {isHindi ? 'धाराएं उपलब्ध' : 'Sections Listed'}
        </div>
      </div>

      {/* Search Input */}
      <div className="legal-library__search" style={{ position: 'relative' }}>
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
      <div className="legal-library__categories" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', scrollbarWidth: 'thin' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid var(--card-border)',
              background: selectedCategory === cat ? 'var(--primary)' : 'var(--subtle-bg)',
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

      {isLoading ? (
        <div className="legal-library__loading" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel" style={{ padding: '18px 20px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div className="skeleton-box skeleton-text" style={{ width: '60px', height: '22px', borderRadius: '6px' }}></div>
                <div className="skeleton-box skeleton-text" style={{ width: '100px', height: '22px', borderRadius: '6px' }}></div>
              </div>
              <div className="skeleton-box skeleton-title"></div>
              <div className="skeleton-box skeleton-text"></div>
              <div className="skeleton-box skeleton-text" style={{ width: '70%' }}></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '12px', color: 'var(--danger)' }}>
          <AlertCircle size={32} style={{ margin: '0 auto 8px' }} />
          <p>{error}</p>
        </div>
      ) : filteredStatutes.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '48px 24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            border: '1px solid var(--primary-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <BookOpen size={28} />
          </div>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'var(--text-main)' }}>
            {isHindi ? 'कोई धारा नहीं मिली' : 'No Matching Sections Found'}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13.5px', maxWidth: '440px', margin: 0, lineHeight: '1.5' }}>
            {isHindi
              ? 'कृपया धारा संख्या (जैसे: 302, 420, 103, 318) अथवा अपराध का प्रकार (चोरी, साइबर, मारपीट) खोज कर देखें।'
              : 'Try searching by exact section number (e.g. 420, 302, 103, 318) or general offense keyword (theft, cyber, accident).'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn-ghost"
              style={{ marginTop: '8px' }}
            >
              {isHindi ? 'खोज साफ़ करें' : 'Clear Search Query'}
            </button>
          )}
        </div>
      ) : (
        <div className="legal-library__results" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredStatutes.map((item) => {
            const isExpanded = expandedId === item.id;
            const isBailable = item.bailable && item.bailable.toLowerCase().includes('bailable') && !item.bailable.toLowerCase().startsWith('non');

            return (
              <div
                key={item.id}
                className="hover-tactile"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                {/* Top Section Tags & Category */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ background: 'var(--primary)', color: 'white', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.3px' }}>
                      {item.bns_section}
                    </span>
                    {item.ipc_section && item.ipc_section !== 'Refer text' && (
                      <span style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', border: '1px solid var(--card-border)' }}>
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
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: '0 0 10px', fontStyle: 'italic' }}>
                    {item.offense_hi}
                  </p>
                )}

                {/* Quick Attributes Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                  {item.nature && (
                    <span className={`badge ${item.nature.toLowerCase().includes('non-cognizable') ? 'badge-info' : 'badge-danger'}`}>
                      {item.nature}
                    </span>
                  )}
                  {item.bailable && (
                    <span className={`badge ${isBailable ? 'badge-success' : 'badge-warning'}`}>
                      {item.bailable}
                    </span>
                  )}
                  {item.punishment && (
                    <span className="badge badge-info" style={{ background: 'var(--subtle-bg)', color: 'var(--text-secondary)', border: '1px solid var(--card-border)' }}>
                      {item.punishment}
                    </span>
                  )}
                </div>

                {/* Expandable Details */}
                {isExpanded && (
                  <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                    {item.bnss_procedure && (
                      <div>
                        <strong style={{ color: 'var(--text-main)' }}>{isHindi ? 'प्रक्रिया व अधिकार (BNSS): ' : 'Procedure & Safeguards (BNSS): '}</strong>
                        <span>{item.bnss_procedure}</span>
                      </div>
                    )}
                    {item.victim_guidance && (
                      <div style={{ background: 'var(--subtle-bg)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                        <strong style={{ color: '#10b981' }}>{isHindi ? 'पीड़ित / शिकायतकर्ता के लिए कदम: ' : 'Complainant Action: '}</strong>
                        <span>{item.victim_guidance}</span>
                      </div>
                    )}
                    {item.accused_guidance && (
                      <div style={{ background: 'var(--subtle-bg)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid var(--primary)' }}>
                        <strong style={{ color: 'var(--primary)' }}>{isHindi ? 'कानूनी सुरक्षा (Accused Rights): ' : 'Protective Safeguards: '}</strong>
                        <span>{item.accused_guidance}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Actions Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--card-border)' }}>
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
                    className="btn-ghost"
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
