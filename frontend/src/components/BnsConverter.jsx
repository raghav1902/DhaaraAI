import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowRightLeft, 
  Search, 
  Scale, 
  Shield, 
  AlertCircle, 
  Gavel, 
  Clock, 
  BookOpen,
  CheckCircle2,
  Filter
} from 'lucide-react';

import { FALLBACK_CONCORDANCE_DB } from '../data/concordanceData';

const POPULAR_QUERIES = [
  { label: "IPC 420 (Cheating / 318 BNS)", q: "420" },
  { label: "IPC 302 (Murder / 103 BNS)", q: "302" },
  { label: "IPC 304A (Hit & Run / 106 BNS)", q: "304A" },
  { label: "IPC 498A (Cruelty / 85 BNS)", q: "498A" },
  { label: "IPC 506 (Threat / 351 BNS)", q: "506" },
  { label: "IPC 406 (Breach of Trust / 316 BNS)", q: "406" },
  { label: "Cyber & Online Fraud", q: "fraud" }
];

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
    // Instant local filter first
    const localFiltered = filterLocal(q);
    setItems(localFiltered);
    if (localFiltered.length > 0 && !selectedItem) {
      setSelectedItem(localFiltered[0]);
    }

    // Then background fetch from backend
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', borderLeft: '5px solid #059669' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'linear-gradient(135deg, #059669, #10b981)', padding: '12px', borderRadius: '14px', color: '#fff' }}>
            <ArrowRightLeft size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
              {isHindi ? 'BNS 2023 ↔ IPC 1860 धारा परिवर्तक (Live Concordance)' : 'BNS 2023 ↔ IPC 1860 Section Converter & Calculator'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              {isHindi 
                ? 'पुरानी आईपीसी (IPC) की धारा अथवा नई भारतीय न्याय संहिता (BNS) की धारा दर्ज करें और सजा, जमानत व कानूनी बदलाव तुरंत देखें।'
                : 'Instant cross-reference for the New Criminal Laws (effective 1 July 2024). Compare sections, bail status, sentences, and BNSS trial procedure.'}
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
              style={{
                background: searchTerm === pq.q ? '#059669' : 'rgba(5, 150, 105, 0.08)',
                color: searchTerm === pq.q ? '#fff' : '#047857',
                border: '1px solid rgba(5, 150, 105, 0.25)',
                borderRadius: '16px',
                padding: '4px 10px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.15s ease'
              }}
            >
              {pq.label}
            </button>
          ))}
        </div>
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
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              outline: 'none',
              background: '#fff',
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
            {loading && <span style={{ fontSize: '12px', color: '#059669' }}>Searching...</span>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {items.map((item, idx) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <div
                  key={item.id || idx}
                  onClick={() => setSelectedItem(item)}
                  style={{
                    background: isSelected ? 'rgba(5, 150, 105, 0.08)' : '#fff',
                    border: isSelected ? '1px solid #059669' : '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '800', color: '#059669', background: '#dcfce7', padding: '2px 6px', borderRadius: '4px' }}>
                        BNS {item.bns_section}
                      </span>
                      <ArrowRightLeft size={12} color="#94a3b8" />
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                        IPC {item.ipc_section}
                      </span>
                    </div>
                    <span style={{ 
                      fontSize: '10.5px', 
                      fontWeight: '700', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      background: item.bailable === 'Bailable' ? '#dcfce7' : '#fee2e2',
                      color: item.bailable === 'Bailable' ? '#166534' : '#991b1b'
                    }}>
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
        {selectedItem ? (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Title Header */}
            <div>
              <span style={{ fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', color: '#059669', letterSpacing: '0.04em' }}>
                {selectedItem.category}
              </span>
              <h3 style={{ margin: '4px 0', fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
                {isHindi ? selectedItem.offense_hi : selectedItem.offense_en}
              </h3>
            </div>

            {/* Split Comparison Boxes */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {/* Active Law: BNS */}
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#166534' }}>
                  {isHindi ? 'लागू नया कानून (1 जुलाई 2024 से)' : 'Current Active Law (Post July 1, 2024)'}
                </span>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', margin: '4px 0' }}>
                  BNS Section {selectedItem.bns_section}
                </div>
                <div style={{ fontSize: '12.5px', color: '#14532d', fontWeight: '600', lineHeight: '1.4' }}>
                  {selectedItem.bns_title}
                </div>
                <div style={{ fontSize: '11px', color: '#166534', marginTop: '4px' }}>
                  {selectedItem.bns_act}
                </div>
              </div>

              {/* Legacy Law: IPC */}
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px' }}>
                <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#475569' }}>
                  {isHindi ? 'पुराना निरस्त कानून (30 जून 2024 तक)' : 'Legacy Law (Pre July 1, 2024)'}
                </span>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#334155', margin: '4px 0' }}>
                  IPC Section {selectedItem.ipc_section}
                </div>
                <div style={{ fontSize: '12.5px', color: '#475569', fontWeight: '600', lineHeight: '1.4' }}>
                  {selectedItem.ipc_title}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  {selectedItem.ipc_act}
                </div>
              </div>
            </div>

            {/* Statutory Parameters Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                  {isHindi ? 'अपराध की प्रकृति' : 'Offense Nature'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: selectedItem.nature === 'Cognizable' ? '#dc2626' : '#166534' }}>
                  {selectedItem.nature}
                </span>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                  {isHindi ? 'जमानत की स्थिति' : 'Bail Status'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: selectedItem.bailable === 'Bailable' ? '#166534' : '#dc2626' }}>
                  {selectedItem.bailable}
                </span>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
                  {isHindi ? 'सुनवाई अदालत' : 'Triable By'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af' }}>
                  {selectedItem.triable_by}
                </span>
              </div>
            </div>

            {/* Punishment Details */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Gavel size={16} color="#d97706" />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                  {isHindi ? 'सजा व जुर्माना प्रावधान' : 'Punishment & Penalty Specification'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
                {selectedItem.punishment}
              </p>
            </div>

            {/* BNSS Procedure Note */}
            {selectedItem.bnss_procedure && (
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Shield size={16} color="#2563eb" />
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af' }}>
                    {isHindi ? 'BNSS प्रक्रिया व कानूनी सुरक्षा नियम' : 'BNSS 2023 Procedural Safeguard & Trial Note'}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#1e3a8a', lineHeight: '1.5' }}>
                  {selectedItem.bnss_procedure}
                </p>
              </div>
            )}

            {/* Victim vs Accused Guidance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedItem.victim_guidance && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534', display: 'block', marginBottom: '2px' }}>
                    🛡️ {isHindi ? 'पीड़ित / शिकायतकर्ता के अधिकार:' : 'Action Plan for Victim / Complainant:'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#14532d', lineHeight: '1.5' }}>
                    {selectedItem.victim_guidance}
                  </span>
                </div>
              )}
              {selectedItem.accused_guidance && (
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', display: 'block', marginBottom: '2px' }}>
                    ⚖️ {isHindi ? 'आरोपी पक्ष हेतु सुरक्षा प्रावधान:' : 'Safeguards for Accused / Signer:'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#78350f', lineHeight: '1.5' }}>
                    {selectedItem.accused_guidance}
                  </span>
                </div>
              )}
            </div>

            {/* Ask AI Action Button */}
            {onAskAi && (
              <button
                type="button"
                onClick={() => onAskAi(`Explain BNS Section ${selectedItem.bns_section} (${selectedItem.offense_en}) and how it compares to IPC ${selectedItem.ipc_section}. What are my legal rights?`)}
                style={{
                  background: 'linear-gradient(135deg, #059669, #047857)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: 'auto'
                }}
              >
                <Scale size={16} />
                {isHindi ? 'इस धारा पर AI से विस्तृत सलाह लें' : 'Consult AI on this BNS Section'}
              </button>
            )}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            {isHindi ? 'विस्तार देखने हेतु बाईं ओर से कोई धारा चुनें।' : 'Select a section from the list to view side-by-side details.'}
          </div>
        )}
      </div>
    </div>
  );
}
