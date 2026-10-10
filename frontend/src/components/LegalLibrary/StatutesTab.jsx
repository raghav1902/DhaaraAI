import React from 'react';
import { Search, BookOpen, Scale, ShieldCheck, ChevronDown, ChevronUp, Sparkles, Lock } from 'lucide-react';

export default function StatutesTab({
  isHindi,
  isPro,
  statuteSearch,
  setStatuteSearch,
  statuteCategories,
  selectedStatuteCategory,
  setSelectedStatuteCategory,
  filteredStatutes,
  expandedStatuteId,
  setExpandedStatuteId,
  handleAskSection,
  onOpenUpgradeModal,
  onNavigateTab
}) {
  return (
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
  );
}
