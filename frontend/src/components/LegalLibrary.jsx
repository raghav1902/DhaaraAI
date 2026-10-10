import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { BookOpen, Scale, Sparkles, Crown } from 'lucide-react';
import { FALLBACK_CONCORDANCE_DB } from '../data/concordanceData';
import { API_BASE } from '../config/apiConfig';
import './LegalLibrary.css';
import StatutesTab from './LegalLibrary/StatutesTab';
import GlossaryTab from './LegalLibrary/GlossaryTab';

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

  // Glossary State
  const [glossaryTerms, setGlossaryTerms] = useState([]);
  const [glossaryCategories, setGlossaryCategories] = useState(['All']);
  const [selectedGlossaryCategory, setSelectedGlossaryCategory] = useState('All');
  const [glossarySearch, setGlossarySearch] = useState('');
  const [expandedGlossaryId, setExpandedGlossaryId] = useState(null);

  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const applyFallbackFilter = useCallback(() => {
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
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(currentUser?.email ? { 'X-User-Email': currentUser.email } : {})
      };

      const params = new URLSearchParams();
      if (selectedStatuteCategory !== 'All') {
        params.append('category', selectedStatuteCategory);
      }
      params.append('limit', userIsPro ? '2500' : '15');

      const response = await axios.get(`${API_BASE}/api/library?${params.toString()}`, { headers, timeout: 7000 });
      if (response.data && response.data.items && response.data.items.length > 0) {
        setStatutes(response.data.items);
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
      const headers = {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(currentUser?.email ? { 'X-User-Email': currentUser.email } : {})
      };

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
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    fontSize: '10.5px',
                    fontWeight: 800,
                    letterSpacing: '0.03em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(245, 158, 11, 0.25)'
                  }}
                  title={isHindi ? 'DhaaraAI Plus में अपग्रेड करें' : 'Upgrade to DhaaraAI Plus'}
                >
                  <span>★</span>
                  <span>{isHindi ? 'अपग्रेड करें' : 'UPGRADE'}</span>
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

      {activeTab === 'statutes' ? (
        <StatutesTab
          isHindi={isHindi}
          isPro={isPro}
          statuteSearch={statuteSearch}
          setStatuteSearch={setStatuteSearch}
          statuteCategories={statuteCategories}
          selectedStatuteCategory={selectedStatuteCategory}
          setSelectedStatuteCategory={setSelectedStatuteCategory}
          filteredStatutes={filteredStatutes}
          expandedStatuteId={expandedStatuteId}
          setExpandedStatuteId={setExpandedStatuteId}
          handleAskSection={handleAskSection}
          onOpenUpgradeModal={onOpenUpgradeModal}
          onNavigateTab={onNavigateTab}
        />
      ) : (
        <GlossaryTab
          isHindi={isHindi}
          glossarySearch={glossarySearch}
          setGlossarySearch={setGlossarySearch}
          glossaryCategories={glossaryCategories}
          selectedGlossaryCategory={selectedGlossaryCategory}
          setSelectedGlossaryCategory={setSelectedGlossaryCategory}
          filteredGlossary={filteredGlossary}
          expandedGlossaryId={expandedGlossaryId}
          setExpandedGlossaryId={setExpandedGlossaryId}
          handleAskGlossary={handleAskGlossary}
        />
      )}
    </div>
  );
}
