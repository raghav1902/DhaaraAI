import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRightLeft, Search, Scale, ChevronLeft, Sparkles } from 'lucide-react';
import { FALLBACK_CONCORDANCE_DB, POPULAR_QUERIES } from '../data/concordanceData';
import BnsComparisonCard from './BnsConverter/BnsComparisonCard';
import './BnsConverter/BnsConverter.css';

export default function BnsConverter({ language = 'English', onAskAi = null }) {
  const isHindi = language === 'Hindi';
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState(FALLBACK_CONCORDANCE_DB);
  const [selectedItem, setSelectedItem] = useState(FALLBACK_CONCORDANCE_DB[0] || null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);

  useEffect(() => {
    fetchMappings('');
  }, []);

  const filterLocal = (q) => {
    if (!q || !q.trim()) return FALLBACK_CONCORDANCE_DB;
    const lower = q.trim().toLowerCase();
    return FALLBACK_CONCORDANCE_DB.filter(item =>
      item.bns_section?.toLowerCase().includes(lower) ||
      item.ipc_section?.toLowerCase().includes(lower) ||
      item.offense_en?.toLowerCase().includes(lower) ||
      item.offense_hi?.toLowerCase().includes(lower) ||
      item.bns_title?.toLowerCase().includes(lower) ||
      item.category?.toLowerCase().includes(lower)
    );
  };

  const fetchMappings = async (q = '') => {
    const localFiltered = filterLocal(q);
    setItems(localFiltered);
    if (localFiltered.length > 0 && !selectedItem) {
      setSelectedItem(localFiltered[0]);
    }

    try {
      const res = await axios.get(`http://localhost:8000/api/converter${q ? `?query=${encodeURIComponent(q)}` : ''}`);
      if (res.data && res.data.mappings && res.data.mappings.length > 0) {
        setItems(res.data.mappings);
        if (!selectedItem || !res.data.mappings.find(m => m.id === selectedItem.id)) {
          setSelectedItem(res.data.mappings[0]);
        }
      }
    } catch (err) {
      // Graceful fallback to local
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchMappings(val);
  };

  const selectQuery = (q) => {
    setSearchTerm(q);
    fetchMappings(q);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    setShowMobileDetail(true);
  };

  return (
    <div className="bns-concordance animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header Banner */}
      <div className="bns-concordance__header module-header-banner">
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '75%' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--emerald-600), #047857)',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
            flexShrink: 0
          }}>
            <ArrowRightLeft size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                {isHindi ? 'BNS 2023 ↔ IPC 1860 विधिक संदर्भ तालिका' : 'BNS 2023 ↔ IPC 1860 Statutory Concordance Explorer'}
              </h2>
              <span style={{ fontSize: '11px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent-border)', fontWeight: '700', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                Concordance Engine
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              {isHindi
                ? 'पुरानी आईपीसी अथवा नई BNS की धारा दर्ज करें और सजा, जमानत व BNSS प्रक्रियात्मक बदलाव तुरंत देखें।'
                : 'Cross-reference IPC 1860 and Bharatiya Nyaya Sanhita 2023. Compare sections, bail status, punishments, and trial procedure.'}
            </p>
          </div>
        </div>

        <div className="module-banner-visual" aria-hidden="true">
          <img
            src="/assets/legal/statutes/bns_statute_codes.webp"
            alt=""
            className="module-banner-image"
            loading="lazy"
          />
          <div className="module-banner-gradient" />
        </div>
      </div>

      {/* Quick Section Search Chips */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', padding: '0 2px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Sparkles size={13} color="var(--accent)" />
          {isHindi ? 'त्वरित खोज धाराएं:' : 'Popular Provisions:'}
        </span>
        {POPULAR_QUERIES.map((pq, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => selectQuery(pq.q)}
            className="btn-ghost"
            style={{
              background: searchTerm === pq.q ? 'var(--accent)' : 'var(--accent-light)',
              color: searchTerm === pq.q ? '#ffffff' : 'var(--accent)',
              borderColor: searchTerm === pq.q ? 'var(--accent)' : 'var(--accent-border)',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: '11.5px',
            }}
          >
            {pq.label}
          </button>
        ))}
      </div>

      {/* Concordance Master-Detail Split Workspace */}
      <div className="bns-workspace-grid">
        {/* Left Column: Search & Provision List */}
        <div className={`bns-list-pane ${showMobileDetail ? 'mobile-hidden' : ''}`}>
          <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder={isHindi
                  ? "आईपीसी धारा (जैसे 420, 302, 304A), BNS धारा या अपराध लिखें..."
                  : "Search IPC Sec (420, 302, 304A), BNS Sec (318, 103), or offense..."}
                className="input-field"
                style={{ paddingLeft: '34px', fontSize: '13px', height: '38px' }}
              />
            </div>

            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {items.length} {isHindi ? 'प्रमाणित धाराएं उपलब्ध' : 'Matching Provisions Found'}
            </div>

            <div className="bns-items-scroll">
              {items.map((item) => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSelectItem(item)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleSelectItem(item)}
                    className={`bns-item-row ${isSelected ? 'is-selected' : ''}`}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--accent)' }}>
                        BNS Sec {item.bns_section}
                      </span>
                      <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', background: 'var(--subtle-bg)', padding: '1px 6px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--card-border)' }}>
                        IPC {item.ipc_section}
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.4' }}>
                      {isHindi ? item.offense_hi : item.offense_en}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <span style={{ fontSize: '9.5px', padding: '1px 5px', borderRadius: '4px', background: item.nature === 'Cognizable' ? 'var(--danger-light)' : 'var(--accent-light)', color: item.nature === 'Cognizable' ? 'var(--danger)' : 'var(--accent)' }}>
                        {item.nature}
                      </span>
                      <span style={{ fontSize: '9.5px', padding: '1px 5px', borderRadius: '4px', background: item.bailable === 'Bailable' ? 'var(--accent-light)' : 'var(--danger-light)', color: item.bailable === 'Bailable' ? 'var(--accent)' : 'var(--danger)' }}>
                        {item.bailable}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Legal Dossier Card */}
        <div className={`bns-detail-pane ${!showMobileDetail ? 'mobile-hidden' : ''}`}>
          {showMobileDetail && (
            <button
              type="button"
              onClick={() => setShowMobileDetail(false)}
              className="btn-secondary bns-mobile-back-btn"
              style={{ marginBottom: '10px' }}
            >
              <ChevronLeft size={16} />
              <span>{isHindi ? 'सूची पर वापस जाएं' : 'Back to Sections List'}</span>
            </button>
          )}
          <BnsComparisonCard
            selectedItem={selectedItem}
            isHindi={isHindi}
            onAskAi={onAskAi}
          />
        </div>
      </div>
    </div>
  );
}
