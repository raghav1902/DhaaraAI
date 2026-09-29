import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRightLeft, Search } from 'lucide-react';
import { FALLBACK_CONCORDANCE_DB, POPULAR_QUERIES } from '../data/concordanceData';
import BnsComparisonCard from './BnsConverter/BnsComparisonCard';

export default function BnsConverter({ language = 'English', onAskAi = null }) {
  const isHindi = language === 'Hindi';
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState(FALLBACK_CONCORDANCE_DB);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(FALLBACK_CONCORDANCE_DB[0] || null);

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div style={{
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #059669, #10b981)',
          padding: '10px',
          borderRadius: '12px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
        }}>
          <ArrowRightLeft size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              {isHindi ? 'BNS 2023 ↔ IPC 1860 धारा परिवर्तक' : 'BNS ↔ IPC Section Converter'}
            </h2>
            <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
              Concordance Engine
            </span>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            {isHindi
              ? 'पुरानी आईपीसी अथवा नई BNS की धारा दर्ज करें और सजा, जमानत व कानूनी बदलाव तुरंत देखें।'
              : 'Cross-reference IPC 1860 and BNS 2023. Compare sections, bail status, sentences, and BNSS trial procedure.'}
          </p>
        </div>
      </div>

        {/* Quick Click Chips */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
            {isHindi ? 'त्वरित खोज धाराएं:' : 'Quick Section Search:'}
          </span>
          {POPULAR_QUERIES.map((pq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectQuery(pq.q)}
              className="btn-ghost"
              style={{
                background: searchTerm === pq.q ? '#059669' : 'rgba(5, 150, 105, 0.08)',
                color: searchTerm === pq.q ? '#fff' : '#059669',
                borderColor: searchTerm === pq.q ? '#059669' : 'rgba(5, 150, 105, 0.25)',
                borderRadius: '16px',
                padding: '4px 10px',
                fontSize: '12px',
              }}
            >
              {pq.label}
            </button>
          ))}
        </div>

      {/* Search Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '14px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={isHindi
              ? "आईपीसी धारा (जैसे 420, 302, 304A), नई BNS धारा या अपराध का नाम लिखें..."
              : "Type any IPC Section (e.g. 420, 302, 304A), BNS Section (318, 103), or offense keyword..."}
            style={{
              width: '100%',
              padding: '11px 16px 11px 42px',
              borderRadius: '10px',
              border: '1px solid var(--card-border)',
              fontSize: '14px',
              outline: 'none',
              background: 'var(--subtle-bg)',
              color: 'var(--text-main)',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* Main Comparative View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Left: Search Results List */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', maxHeight: '580px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
              {isHindi ? `परिणाम (${items.length})` : `Matches (${items.length})`}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ border: '1px solid var(--card-border)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <div className="skeleton-box skeleton-text" style={{ width: '50px', height: '18px', borderRadius: '4px' }}></div>
                    <div className="skeleton-box skeleton-text" style={{ width: '50px', height: '18px', borderRadius: '4px' }}></div>
                  </div>
                  <div className="skeleton-box skeleton-title" style={{ width: '80%' }}></div>
                  <div className="skeleton-box skeleton-text" style={{ width: '40%' }}></div>
                </div>
              ))
            ) : items.map((item, idx) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id || idx}
                  onClick={() => setSelectedItem(item)}
                  className="hover-tactile"
                  style={{
                    background: isSelected ? 'rgba(5, 150, 105, 0.15)' : 'var(--card-bg)',
                    border: isSelected ? '1px solid #10b981' : '1px solid var(--card-border)',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge" style={{ background: '#dcfce7', color: '#059669' }}>
                        BNS {item.bns_section}
                      </span>
                      <ArrowRightLeft size={12} color="#94a3b8" />
                      <span className="badge" style={{ background: '#f1f5f9', color: '#64748b' }}>
                        IPC {item.ipc_section}
                      </span>
                    </div>
                    <span className={`badge ${item.bailable === 'Bailable' ? 'badge-success' : 'badge-danger'}`}>
                      {item.bailable}
                    </span>
                  </div>
                  <h4 style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', lineHeight: '1.4' }}>
                    {isHindi ? item.offense_hi : item.offense_en}
                  </h4>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                    Category: {item.category}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Side-by-Side Comparison Card */}
        <BnsComparisonCard
          selectedItem={selectedItem}
          isHindi={isHindi}
          onAskAi={onAskAi}
        />
      </div>
    </div>
  );
}
