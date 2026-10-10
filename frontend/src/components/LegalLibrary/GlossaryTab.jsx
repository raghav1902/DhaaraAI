import React from 'react';
import { Search, Sparkles, Scale, Award, ChevronDown, ChevronUp } from 'lucide-react';

export default function GlossaryTab({
  isHindi,
  glossarySearch,
  setGlossarySearch,
  glossaryCategories,
  selectedGlossaryCategory,
  setSelectedGlossaryCategory,
  filteredGlossary,
  expandedGlossaryId,
  setExpandedGlossaryId,
  handleAskGlossary
}) {
  return (
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
  );
}
