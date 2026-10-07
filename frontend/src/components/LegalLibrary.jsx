import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, BookOpen, Scale, ShieldCheck, Sparkles, ChevronDown, ChevronUp, Award, Crown, Lock } from 'lucide-react';
import { FALLBACK_CONCORDANCE_DB } from '../data/concordanceData';
import { API_BASE } from '../config/apiConfig';
import ProFeatureLock from './ProFeatureLock';
import './LegalLibrary.css';

export default function LegalLibrary({
  onAskAi,
  language = 'English',
  user,
  onNavigateTab,
  onOpenUpgradeModal
}) {
  const activeUser = user || (() => {
    try {
      return JSON.parse(localStorage.getItem('dhaara_active_user') || 'null');
    } catch {
      return null;
    }
  })();
  const isPro = activeUser?.plan === 'plus' || activeUser?.plan === 'pro' || activeUser?.plan === 'enterprise';
  // Sub-tab: 'statutes' | 'glossary'
  const [activeTab, setActiveTab] = useState('statutes');

  // Statutes State
  const [statutes, setStatutes] = useState(FALLBACK_CONCORDANCE_DB || []);
  const [statuteCategories, setStatuteCategories] = useState(() => {
    const cats = new Set(['All']);
    (FALLBACK_CONCORDANCE_DB || []).forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  });
  const [selectedStatuteCategory, setSelectedStatuteCategory] = useState('All');
  const [statuteSearch, setStatuteSearch] = useState('');
  const [expandedStatuteId, setExpandedStatuteId] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Glossary State
  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [glossaryCategories, setGlossaryCategories] = useState(['All']);
  const [selectedGlossaryCategory, setSelectedGlossaryCategory] = useState('All');
  const [glossarySearch, setGlossarySearch] = useState('');
  const [expandedGlossaryId, setExpandedGlossaryId] = useState(null);

  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const applyFallbackFilter = useCallback(() => {
    setUsingFallback(true);
    let items = FALLBACK_CONCORDANCE_DB || [];
    if (selectedStatuteCategory !== 'All') {
      items = items.filter(i => i.category === selectedStatuteCategory);
    }
    setStatutes(items);

    const cats = new Set(['All']);
    (FALLBACK_CONCORDANCE_DB || []).forEach(item => {
      if (item.category) cats.add(item.category);
    });
    setStatuteCategories(Array.from(cats));
  }, [selectedStatuteCategory]);

  const fetchLibraryData = useCallback(async () => {
    try {
      const currentUser = user || (() => {
        try {
          return JSON.parse(localStorage.getItem('dhaara_active_user') || 'null');
        } catch {
          return null;
        }
      })();
      const userIsPro = currentUser?.plan === 'plus' || currentUser?.plan === 'pro' || currentUser?.plan === 'enterprise';
      const token = currentUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params = new URLSearchParams();
      if (selectedStatuteCategory !== 'All') {
        params.append('category', selectedStatuteCategory);
      }
      params.append('limit', userIsPro ? '2500' : '15');

      const response = await axios.get(`${API_BASE}/api/library?${params.toString()}`, { headers, timeout: 7000 });
      if (response.data && response.data.items && response.data.items.length > 0) {
        setStatutes(response.data.items);
        setUsingFallback(false);
        if (response.data.categories && response.data.categories.length > 0) {
          setStatuteCategories(response.data.categories);
        }
      } else {
        applyFallbackFilter();
      }
    } catch {
      applyFallbackFilter();
    }
  }, [selectedStatuteCategory, applyFallbackFilter, user, isPro]);

  // Load Statutes
  useEffect(() => {
    fetchLibraryData();
  }, [fetchLibraryData]);

  const fetchGlossaryData = useCallback(async () => {
    try {
      const currentUser = user || (() => {
        try {
          return JSON.parse(localStorage.getItem('dhaara_active_user') || 'null');
        } catch {
          return null;
        }
      })();
      const userIsPro = currentUser?.plan === 'plus' || currentUser?.plan === 'pro' || currentUser?.plan === 'enterprise';
      const token = currentUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const params = new URLSearchParams();
      if (selectedGlossaryCategory !== 'All') {
        params.append('category', selectedGlossaryCategory);
      }
      params.append('limit', userIsPro ? '200' : '15');

      const response = await axios.get(`${API_BASE}/api/glossary?${params.toString()}`, { headers, timeout: 5000 });
      if (response.data && response.data.terms) {
        setGlossaryTerms(response.data.terms);
        if (response.data.categories) {
          setGlossaryCategories(['All', ...response.data.categories]);
        }
      }
    } catch (err) {
      console.warn('Could not load glossary from backend API, using core terms.', err);
    }
  }, [selectedGlossaryCategory, user]);

  // Load Glossary
  useEffect(() => {
    fetchGlossaryData();
  }, [fetchGlossaryData]);

  // Filtered Statutes
  const filteredStatutes = statutes.filter((item) => {
    if (!statuteSearch.trim()) return true;
    const q = statuteSearch.toLowerCase();
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

  // Filtered Glossary Terms
  const filteredGlossary = glossaryTerms.filter((term) => {
    if (!glossarySearch.trim()) return true;
    const q = glossarySearch.toLowerCase();
    const termEn = (term.term || '').toLowerCase();
    const termHi = (term.hindi_term || '').toLowerCase();
    const aliases = (term.aliases_synonyms || []).join(' ').toLowerCase();
    const enExp = (term.simple_en_explanation || '').toLowerCase();
    const hiExp = (term.simple_hi_explanation || '').toLowerCase();
    const acts = (term.related_acts || []).join(' ').toLowerCase();
    const secs = (term.related_sections || []).join(' ').toLowerCase();

    return (
      termEn.includes(q) ||
      termHi.includes(q) ||
      aliases.includes(q) ||
      enExp.includes(q) ||
      hiExp.includes(q) ||
      acts.includes(q) ||
      secs.includes(q)
    );
  });

  const handleAskSection = (item) => {
    const q = isHindi
      ? `मुझे ${item.bns_section} (${item.offense_hi || item.offense_en}) के तहत कानूनी प्रक्रिया, जमानत और अधिकारों के बारे में पूरी जानकारी दें।`
      : `Explain legal procedure, bail rules, and remedies under ${item.bns_section} (${item.offense_en}).`;
    onAskAi(q);
  };

  const handleAskGlossary = (term) => {
    const q = isHindi
      ? `कानूनी शब्दावली के अनुसार '${term.hindi_term || term.term}' का क्या अर्थ है? इसकी कानूनी प्रक्रिया व भारतीय न्यायालयों में उपयोग समझाएं।`
      : `What does the legal term '${term.term}' mean under Indian law? Explain procedural context, relevant statutes, and remedies.`;
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
            <div className="legal-library__title-row" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 className="legal-library__title">
                {isHindi ? 'कानूनी पुस्तकालय एवं शब्दावली' : 'Legal Statutory Library & Glossary'}
              </h2>
              {isPro ? (
                <span
                  style={{
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#d97706',
                    border: '1px solid #f59e0b',
                    borderRadius: '999px',
                    padding: '2px 8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Crown size={12} /> {activeTab === 'statutes' ? 'PLUS' : 'PLUS'}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenUpgradeModal ? onOpenUpgradeModal('Legal Statutory Library') : onNavigateTab('settings')}
                  style={{
                    background: 'rgba(37, 99, 235, 0.1)',
                    color: '#2563eb',
                    border: '1px solid rgba(37, 99, 235, 0.3)',
                    borderRadius: '999px',
                    padding: '3px 9px',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <span>
                    {activeTab === 'statutes'
                      ? (isHindi ? 'निःशुल्क पूर्वावलोकन मोड (शीर्ष 15 धाराएं)' : 'Free 15-Section Preview')
                      : (isHindi ? 'निःशुल्क पूर्वावलोकन मोड (15 विधिक शब्द)' : 'Free 15-Term Preview')}
                  </span>
                  <span style={{ fontSize: '9.5px', fontWeight: 800, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff', borderRadius: '4px', padding: '1.5px 6px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                    ★ UPGRADE
                  </span>
                </button>
              )}
            </div>
            <p className="legal-library__subtitle">
              {isHindi
                ? 'भारतीय न्याय संहिता (BNS 2023), IPC 1860, BNSS एवं 150+ प्रमाणित विधिक शब्दों की सरल व्याख्या'
                : 'Verified statutory repository of BNS & IPC Concordance, Indian Legal Terms with plain explanations'}
            </p>
          </div>
        </div>

        {/* Stats Pill */}
        <div className="legal-library__stats-pill" style={{ position: 'relative', zIndex: 2 }}>
          <Scale size={16} />
          <span>
            {activeTab === 'statutes'
              ? `${filteredStatutes.length} ${isHindi ? 'धाराएं उपलब्ध' : 'Sections Indexed'}`
              : `${filteredGlossary.length} ${isHindi ? 'विधिक शब्द उपलब्ध' : 'Legal Terms'}`}
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

      {/* Sub-Tab Navigation Bar */}
      <div style={{ display: 'flex', gap: '10px', background: 'var(--card-bg)', padding: '6px', borderRadius: '12px', border: '1px solid var(--card-border)', width: 'fit-content' }}>
        <button
          type="button"
          onClick={() => setActiveTab('statutes')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'statutes' ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: activeTab === 'statutes' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'statutes' ? '#ffffff' : 'var(--text-secondary)'
          }}
        >
          <BookOpen size={16} />
          <span>{isHindi ? 'विधिक धाराएं एवं संकलन (BNS / IPC / Acts)' : 'Statutes & Concordance (BNS / IPC / Acts)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('glossary')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '13px',
            fontWeight: activeTab === 'glossary' ? '600' : '500',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: activeTab === 'glossary' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'glossary' ? '#ffffff' : 'var(--text-secondary)'
          }}
        >
          <Sparkles size={16} />
          <span>{isHindi ? 'कानूनी शब्दावली (Legal Glossary — 150+ शब्द)' : 'Legal Glossary (150+ Verified Terms)'}</span>
        </button>
      </div>

      {/* ========================================================
          TAB 1: STATUTES & CONCORDANCE
          ======================================================== */}
      {activeTab === 'statutes' && (
        <>
          {/* Search Input Bar */}
          <div className="legal-library__search-wrapper">
            <Search size={18} className="legal-library__search-icon" />
            <input
              type="text"
              className="legal-library__search-input"
              value={statuteSearch}
              onChange={(e) => setStatuteSearch(e.target.value)}
              placeholder={
                isHindi
                  ? 'BNS धारा, IPC धारा, अपराध का नाम (उदा: 302, 420, 103, 318, साइबर ठगी, चेक बाउंस)...'
                  : 'Search by BNS Section, IPC Section, crime title (e.g. 103, 318, 420, cyber theft, bail)...'
              }
            />
            {statuteSearch && (
              <button
                type="button"
                onClick={() => setStatuteSearch('')}
                className="legal-library__search-clear"
                title="Clear"
              >
                &times;
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="legal-library__categories">
            {statuteCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`legal-library__category-chip ${selectedStatuteCategory === cat ? 'is-active' : ''}`}
                onClick={() => setSelectedStatuteCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Grid */}
          {filteredStatutes.length === 0 ? (
            <div className="legal-library__empty-state">
              <div className="legal-library__empty-icon">
                <BookOpen size={28} />
              </div>
              <h3 className="legal-library__empty-title">
                {isHindi ? 'कोई प्रासंगिक धारा नहीं मिली' : 'No Matching Sections Found'}
              </h3>
              <p className="legal-library__empty-desc">
                {isHindi
                  ? 'कृपया धारा संख्या (जैसे: 302, 420, 103, 318) अथवा सामान्य कानूनी शब्द खोज कर देखें।'
                  : 'Try searching by section number (e.g. 103, 318, 420, 281) or offence keyword.'}
              </p>
            </div>
          ) : (
            <div className="legal-library__results-grid">
              {filteredStatutes.map((item) => {
                const isExpanded = expandedStatuteId === item.id;
                const bailableStr = item.bailable ? item.bailable.toLowerCase() : '';
                const isNonBailable = bailableStr.includes('non');
                const isBailable = bailableStr.includes('bailable') && !isNonBailable;
                const isCognizable = item.nature && !item.nature.toLowerCase().includes('non-cognizable');

                return (
                  <div key={item.id} className="legal-library__card">
                    <div className="legal-library__card-head">
                      <div className="legal-library__card-tags">
                        <span className="badge badge-primary font-mono font-bold">
                          {item.bns_section}
                        </span>
                        {item.ipc_section && item.ipc_section !== 'Refer text' && (
                          <span className="legal-library__legacy-tag">
                            {String(item.ipc_section).trim().startsWith('IPC') ? item.ipc_section : `IPC ${item.ipc_section}`}
                          </span>
                        )}
                      </div>
                      <span className="legal-library__category-badge">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="legal-library__offense-title">
                      {item.offense_en}
                    </h3>
                    {item.offense_hi && item.offense_hi !== item.offense_en && (
                      <p className="legal-library__offense-hindi">
                        {item.offense_hi}
                      </p>
                    )}

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

                    {item.is_locked && !isPro && (
                      <div
                        style={{
                          margin: '12px 0 6px',
                          padding: '10px 14px',
                          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08), rgba(37, 99, 235, 0.08))',
                          border: '1px dashed rgba(245, 158, 11, 0.5)',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                      >
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Lock size={13} color="#d97706" />
                          {isHindi ? 'पूर्ण BNSS प्रक्रिया व सुप्रीम कोर्ट निर्देश Plus में अनलॉक करें' : 'Unlock full BNSS procedural text & precedents'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onOpenUpgradeModal ? onOpenUpgradeModal('Comprehensive Legal Library') : onNavigateTab('settings')}
                          style={{
                            background: '#d97706',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {isHindi ? 'अनलॉक करें' : 'Unlock Pro'}
                        </button>
                      </div>
                    )}

                    <div className="legal-library__card-footer">
                      <button
                        onClick={() => setExpandedStatuteId(prev => prev === item.id ? null : item.id)}
                        className="legal-library__expand-btn"
                        type="button"
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
        </>
      )}

      {/* ========================================================
          TAB 2: LEGAL GLOSSARY (150+ TERMS)
          ======================================================== */}
      {activeTab === 'glossary' && (
        <>
          {/* Glossary Search Bar */}
          <div className="legal-library__search-wrapper">
            <Search size={18} className="legal-library__search-icon" />
            <input
              type="text"
              className="legal-library__search-input"
              value={glossarySearch}
              onChange={(e) => setGlossarySearch(e.target.value)}
              placeholder={
                isHindi
                  ? 'विधिक शब्द खोजें (उदा: जमानत, FIR, कॉग्निजेंस, कैविएट, पर्जरी, इनजंक्शन, रिमांड)...'
                  : 'Search legal term (e.g. bail, cognizance, caveat, perjury, remand, res judicata, injunction)...'
              }
            />
            {glossarySearch && (
              <button
                type="button"
                onClick={() => setGlossarySearch('')}
                className="legal-library__search-clear"
                title="Clear"
              >
                &times;
              </button>
            )}
          </div>

          {/* Glossary Category Pills */}
          <div className="legal-library__categories">
            {glossaryCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`legal-library__category-chip ${selectedGlossaryCategory === cat ? 'is-active' : ''}`}
                onClick={() => setSelectedGlossaryCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Glossary Cards Grid */}
          {filteredGlossary.length === 0 ? (
            <div className="legal-library__empty-state">
              <div className="legal-library__empty-icon">
                <Sparkles size={28} />
              </div>
              <h3 className="legal-library__empty-title">
                {isHindi ? 'कोई विधिक शब्द नहीं मिला' : 'No Matching Legal Terms Found'}
              </h3>
              <p className="legal-library__empty-desc">
                {isHindi
                  ? 'कृपया अन्य विधिक शब्द या श्रेणी चुनकर खोजें।'
                  : 'Try searching by term, synonym, or selecting another legal category.'}
              </p>
            </div>
          ) : (
            <div className="legal-library__results-grid">
              {filteredGlossary.map((term) => {
                const isExpanded = expandedGlossaryId === term.id;

                return (
                  <div key={term.id} className="legal-library__card" style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Head */}
                    <div className="legal-library__card-head">
                      <span className="badge badge-primary font-bold">
                        {term.term}
                      </span>
                      <span className="legal-library__category-badge" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}>
                        {term.category}
                      </span>
                    </div>

                    {/* Hindi Term Title */}
                    <h3 className="legal-library__offense-title" style={{ fontSize: '15.5px', marginTop: '4px' }}>
                      {term.hindi_term || term.term}
                    </h3>

                    {/* Plain Citizen Explanation */}
                    <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '6px 0', lineHeight: '1.5' }}>
                      {isHindi ? term.simple_hi_explanation : term.simple_en_explanation}
                    </p>

                    {/* Secondary Language Subtext */}
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 10px', fontStyle: 'italic', lineHeight: '1.4' }}>
                      {isHindi ? term.simple_en_explanation : term.simple_hi_explanation}
                    </p>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="legal-library__card-expanded animate-fade-in" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '10px' }}>
                        {/* Legal Context */}
                        <div className="legal-library__info-box" style={{ background: 'var(--subtle-bg)' }}>
                          <span className="legal-library__info-title">
                            <Scale size={14} />
                            {isHindi ? 'औपचारिक प्रक्रियात्मक संदर्भ' : 'Formal Procedural & Statutory Context'}
                          </span>
                          <p className="legal-library__info-text">{term.legal_context}</p>
                        </div>

                        {/* Related Acts & Sections */}
                        {((term.related_acts && term.related_acts.length > 0) || (term.related_sections && term.related_sections.length > 0)) && (
                          <div style={{ marginTop: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                              {isHindi ? 'संबंधित अधिनियम व धाराएं:' : 'Related Enactments & Sections:'}
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {(term.related_sections || []).map((sec, idx) => (
                                <span key={idx} className="badge badge-primary font-mono" style={{ fontSize: '11px' }}>
                                  {sec}
                                </span>
                              ))}
                              {(term.related_acts || []).map((act, idx) => (
                                <span key={idx} className="badge badge-neutral" style={{ fontSize: '11px' }}>
                                  {act}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Landmark Precedents */}
                        {term.related_case_law_ids && term.related_case_law_ids.length > 0 && (
                          <div style={{ marginTop: '10px' }}>
                            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                              <Award size={12} color="#f59e0b" />
                              {isHindi ? 'प्रमुख न्यायिक दृष्टांत:' : 'Landmark Case Law:'}
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                              {term.related_case_law_ids.map((c, idx) => (
                                <span key={idx} className="badge badge-warning" style={{ fontSize: '11px' }}>
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Aliases */}
                        {term.aliases_synonyms && term.aliases_synonyms.length > 0 && (
                          <div style={{ marginTop: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {isHindi ? 'अन्य नाम: ' : 'Aliases: '}
                              {term.aliases_synonyms.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="legal-library__card-footer" style={{ marginTop: 'auto', paddingTop: '10px' }}>
                      <button
                        onClick={() => setExpandedGlossaryId(prev => prev === term.id ? null : term.id)}
                        className="legal-library__expand-btn"
                        type="button"
                      >
                        {isExpanded ? (
                          <>
                            <span>{isHindi ? 'संक्षेप में' : 'Show Less'}</span>
                            <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            <span>{isHindi ? 'विधिक संदर्भ व धाराएं' : 'View Legal Context'}</span>
                            <ChevronDown size={16} />
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleAskGlossary(term)}
                        className="btn-ghost legal-library__ask-btn"
                        type="button"
                        title={isHindi ? 'AI से परामर्श करें' : 'Ask AI about this term'}
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
        </>
      )}
    </div>
  );
}
