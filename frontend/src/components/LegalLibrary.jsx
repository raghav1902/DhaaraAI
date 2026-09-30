import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, BookOpen, Scale, ShieldCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { FALLBACK_CONCORDANCE_DB } from '../data/concordanceData';
import './LegalLibrary.css';

export default function LegalLibrary({ onAskAi, language = 'English' }) {
  const [statutes, setStatutes] = useState(FALLBACK_CONCORDANCE_DB || []);
  const [categories, setCategories] = useState(() => {
    const cats = new Set(['All']);
    (FALLBACK_CONCORDANCE_DB || []).forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  });
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const isHindi = language === 'Hindi' || language === 'हिंदी';

  useEffect(() => {
    fetchLibraryData();
  }, [selectedCategory]);

  const fetchLibraryData = async () => {
    try {
      const catParam = selectedCategory !== 'All' ? `?category=${encodeURIComponent(selectedCategory)}` : '';
      const response = await axios.get(`http://localhost:8000/api/library${catParam}`, { timeout: 3000 });
      if (response.data && response.data.items && response.data.items.length > 0) {
        setStatutes(response.data.items);
        setUsingFallback(false);
        if (response.data.categories && response.data.categories.length > 0) {
          setCategories(response.data.categories);
        }
      } else {
        applyFallbackFilter();
      }
    } catch {
      // Seamlessly use verified local concordance database
      applyFallbackFilter();
    }
  };

  const applyFallbackFilter = () => {
    setUsingFallback(true);
    let items = FALLBACK_CONCORDANCE_DB || [];
    if (selectedCategory !== 'All') {
      items = items.filter(i => i.category === selectedCategory);
    }
    setStatutes(items);

    const cats = new Set(['All']);
    (FALLBACK_CONCORDANCE_DB || []).forEach(item => {
      if (item.category) cats.add(item.category);
    });
    setCategories(Array.from(cats));
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
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleAskSection = (item) => {
    const q = isHindi
      ? `मुझे ${item.bns_section} (${item.offense_hi || item.offense_en}) के तहत कानूनी प्रक्रिया, जमानत और अधिकारों के बारे में पूरी जानकारी दें।`
      : `Explain legal procedure, bail rules, and remedies under ${item.bns_section} (${item.offense_en}).`;
    onAskAi(q);
  };

  return (
    <div className="legal-library animate-fade-in">
      {/* Header Banner */}
      <div className="legal-library__header">
        <div className="legal-library__header-left" style={{ position: 'relative', zIndex: 2, maxWidth: '75%' }}>
          <div className="legal-library__icon-badge">
            <BookOpen size={22} />
          </div>
          <div>
            <div className="legal-library__title-row">
              <h2 className="legal-library__title">
                {isHindi ? 'कानूनी पुस्तकालय' : 'Legal Statutory Library'}
              </h2>
              <span className="badge badge-primary">
                BNS 2023 &amp; IPC 1860
              </span>
              {usingFallback && (
                <span className="badge badge-neutral" style={{ fontSize: '10.5px' }}>
                  Statutory Cache
                </span>
              )}
            </div>
            <p className="legal-library__subtitle">
              {isHindi
                ? 'भारतीय न्याय संहिता (BNS 2023), IPC 1860, BNSS एवं मुख्य अधिनियमों की प्रमाणित धाराएं'
                : 'Verified statutory repository of Bharatiya Nyaya Sanhita, IPC Concordance, and Procedural Safeguards'}
            </p>
          </div>
        </div>

        {/* Stats Pill */}
        <div className="legal-library__stats-pill" style={{ position: 'relative', zIndex: 2 }}>
          <Scale size={16} />
          <span>
            {filteredStatutes.length} {isHindi ? 'धाराएं उपलब्ध' : 'Sections Indexed'}
          </span>
        </div>

        <div className="legal-library__banner-visual" aria-hidden="true">
          <img
            src="/assets/legal/library/law_library.webp"
            alt=""
            className="legal-library__banner-image"
            loading="lazy"
          />
          <div className="legal-library__banner-gradient" />
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="legal-library__search-wrapper">
        <Search size={18} className="legal-library__search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isHindi
              ? 'धारा संख्या या अपराध खोजें (जैसे: 281, 420, 318, एक्सीडेंट, चेक बाउंस, साइबर, मारपीट)...'
              : 'Search section, act, or offense (e.g. 281, 420, 318, cheating, assault, negligence, cyber)...'
          }
          className="input-field legal-library__search-input"
          aria-label={isHindi ? 'धारा खोजें' : 'Search sections'}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="legal-library__search-clear"
            type="button"
            aria-label="Clear search"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="legal-library__categories" role="tablist">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(cat)}
                className={`legal-library__category-chip ${isSelected ? 'is-active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content State */}
      {isLoading ? (
        <div className="legal-library__loading-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="legal-library__skeleton-card">
              <div className="legal-library__skeleton-row">
                <div className="skeleton-box skeleton-text" style={{ width: '80px', height: '24px', borderRadius: '6px' }}></div>
                <div className="skeleton-box skeleton-text" style={{ width: '120px', height: '24px', borderRadius: '6px' }}></div>
              </div>
              <div className="skeleton-box skeleton-title" style={{ marginTop: '12px' }}></div>
              <div className="skeleton-box skeleton-text" style={{ width: '85%', marginTop: '8px' }}></div>
              <div className="skeleton-box skeleton-text" style={{ width: '50%', marginTop: '8px' }}></div>
            </div>
          ))}
        </div>
      ) : filteredStatutes.length === 0 ? (
        <div className="legal-library__empty-state">
          <div className="legal-library__empty-icon">
            <BookOpen size={28} />
          </div>
          <h3 className="legal-library__empty-title">
            {isHindi ? 'कोई प्रासंगिक धारा नहीं मिली' : 'No Matching Sections Found'}
          </h3>
          <p className="legal-library__empty-desc">
            {isHindi
              ? 'कृपया धारा संख्या (जैसे: 302, 420, 103, 318) अथवा सामान्य कानूनी शब्द (चोरी, चेक बाउंस, साइबर) खोज कर देखें।'
              : 'Try searching by section number (e.g. 103, 318, 420, 281) or offence keyword (theft, fraud, cyber, accident).'}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="btn-ghost"
              type="button"
            >
              {isHindi ? 'खोज साफ़ करें' : 'Clear Search Query'}
            </button>
          )}
        </div>
      ) : (
        <div className="legal-library__results-grid">
          {filteredStatutes.map((item) => {
            const isExpanded = expandedId === item.id;
            const bailableStr = item.bailable ? item.bailable.toLowerCase() : '';
            const isNonBailable = bailableStr.includes('non');
            const isBailable = bailableStr.includes('bailable') && !isNonBailable;
            const isCognizable = item.nature && !item.nature.toLowerCase().includes('non-cognizable');

            return (
              <div key={item.id} className="legal-library__card">
                {/* Header Tag Bar */}
                <div className="legal-library__card-head">
                  <div className="legal-library__card-tags">
                    <span className="badge badge-primary font-mono font-bold">
                      {item.bns_section}
                    </span>
                    {item.ipc_section && item.ipc_section !== 'Refer text' && (
                      <span className="legal-library__legacy-tag">
                        IPC {item.ipc_section}
                      </span>
                    )}
                  </div>
                  <span className="legal-library__category-badge">
                    {item.category}
                  </span>
                </div>

                {/* Offense Title */}
                <h3 className="legal-library__offense-title">
                  {item.offense_en}
                </h3>
                {item.offense_hi && item.offense_hi !== item.offense_en && (
                  <p className="legal-library__offense-hindi">
                    {item.offense_hi}
                  </p>
                )}

                {/* Statutory Badges */}
                <div className="legal-library__badges-row">
                  {item.nature && (
                    <span className={`badge ${isCognizable ? 'badge-danger' : 'badge-neutral'}`}>
                      {item.nature}
                    </span>
                  )}
                  {item.bailable && (
                    <span className={`badge ${isBailable ? 'badge-success' : 'badge-warning'}`}>
                      {item.bailable}
                    </span>
                  )}
                  {item.punishment && (
                    <span className="badge badge-neutral" title="Statutory Punishment">
                      <Scale size={12} style={{ marginRight: '4px' }} />
                      {item.punishment}
                    </span>
                  )}
                </div>

                {/* Expandable BNSS Safeguards & Guidance */}
                {isExpanded && (
                  <div className="legal-library__card-expanded animate-fade-in">
                    {item.bnss_procedure && (
                      <div className="legal-library__info-box">
                        <span className="legal-library__info-title">
                          <ShieldCheck size={14} />
                          {isHindi ? 'BNSS 2023 प्रक्रिया व अधिकार' : 'BNSS 2023 Procedure & Safeguards'}
                        </span>
                        <p className="legal-library__info-text">{item.bnss_procedure}</p>
                      </div>
                    )}

                    {item.victim_guidance && (
                      <div className="legal-library__info-box legal-library__info-box--victim">
                        <span className="legal-library__info-title legal-library__info-title--victim">
                          {isHindi ? 'पीड़ित / शिकायतकर्ता के लिए कानूनी कदम' : 'Complainant Action Protocol'}
                        </span>
                        <p className="legal-library__info-text">{item.victim_guidance}</p>
                      </div>
                    )}

                    {item.accused_guidance && (
                      <div className="legal-library__info-box legal-library__info-box--accused">
                        <span className="legal-library__info-title legal-library__info-title--accused">
                          {isHindi ? 'अभियुक्त के कानूनी अधिकार व सुरक्षा' : 'Accused Legal Safeguards'}
                        </span>
                        <p className="legal-library__info-text">{item.accused_guidance}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Card Actions Footer */}
                <div className="legal-library__card-footer">
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="legal-library__expand-btn"
                    type="button"
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? (
                      <>
                        <span>{isHindi ? 'संक्षेप में देखें' : 'Show Less'}</span>
                        <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        <span>{isHindi ? 'विस्तृत अधिकार व प्रक्रिया' : 'View Full Details'}</span>
                        <ChevronDown size={16} />
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleAskSection(item)}
                    className="btn-ghost legal-library__ask-btn"
                    type="button"
                    title={isHindi ? 'AI से परामर्श करें' : 'Analyze in Ask AI'}
                  >
                    <Sparkles size={14} />
                    <span>{isHindi ? 'AI से पूछें' : 'Ask AI'}</span>
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
