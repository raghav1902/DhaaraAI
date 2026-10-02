import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Scale, 
  FileSpreadsheet, 
  AlertTriangle, 
  FileText, 
  BookOpen, 
  Scroll, 
  ArrowRight,
  Search,
  CheckCircle2
} from 'lucide-react';
import { LEGAL_TEMPLATES, CATEGORIES } from './DrafterConstants';

const ICON_MAP = {
  ShieldCheck,
  Scale,
  FileSpreadsheet,
  AlertTriangle,
  FileText,
  BookOpen,
  Scroll
};

export default function DrafterStep1({
  documentType,
  setDocumentType,
  incidentCategory,
  setIncidentCategory,
  setStep,
  isHindi
}) {
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');

  const groups = [
    { id: 'All', en: 'All 12 Templates', hi: 'सभी 12 प्रारूप' },
    { id: 'Police', en: 'Police & FIR', hi: 'पुलिस व प्राथमिकी' },
    { id: 'Bail', en: 'Bail & Liberty', hi: 'जमानत व सुरक्षा' },
    { id: 'Notices', en: 'Legal Notices & Demands', hi: 'विधिक मांग व नोटिस' },
    { id: 'Civil', en: 'Consumer, Family & RTI', hi: 'उपभोक्ता, परिवार व आरटीआई' }
  ];

  const filteredTemplates = LEGAL_TEMPLATES.filter(tmpl => {
    // Search match
    const q = templateSearch.toLowerCase().trim();
    const matchesSearch = !q || (
      tmpl.title_en.toLowerCase().includes(q) ||
      tmpl.title_hi.toLowerCase().includes(q) ||
      tmpl.desc_en.toLowerCase().includes(q) ||
      tmpl.desc_hi.toLowerCase().includes(q) ||
      tmpl.relevant_sections.toLowerCase().includes(q) ||
      tmpl.relevant_act.toLowerCase().includes(q)
    );

    if (!matchesSearch) return false;

    // Group filter
    if (selectedGroup === 'Police') {
      return tmpl.id === 'fir_application';
    } else if (selectedGroup === 'Bail') {
      return tmpl.id === 'bail_application' || tmpl.id === 'anticipatory_bail_application';
    } else if (selectedGroup === 'Notices') {
      return tmpl.id === 'legal_demand_notice' || tmpl.id === 'cheque_bounce_notice' || tmpl.id === 'reply_legal_notice' || tmpl.id === 'rent_lease_notice';
    } else if (selectedGroup === 'Civil') {
      return tmpl.id === 'consumer_complaint' || tmpl.id === 'maintenance_application' || tmpl.id === 'rti_application' || tmpl.id === 'general_affidavit' || tmpl.id === 'general_petition';
    }
    return true;
  });

  const handleSelectTemplate = (tmpl) => {
    setDocumentType(tmpl.documentType);
    if (tmpl.defaultCategory) {
      setIncidentCategory(tmpl.defaultCategory);
    }
  };

  return (
    <div className="drafter-step-content drafter-step-template animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '22px', flex: 1 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
          <label style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--text-main)', margin: 0, display: 'block' }}>
            {isHindi ? '1. आप कौन सा कानूनी दस्तावेज़ तैयार करना चाहते हैं? (12 उच्च-उपयोगी विधिक प्रारूप)' : '1. Which legal document do you want to generate? (12 Court-Standard Templates)'}
          </label>
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              value={templateSearch}
              onChange={e => setTemplateSearch(e.target.value)}
              placeholder={isHindi ? 'प्रारूप या धारा खोजें...' : 'Search template or section...'}
              style={{ paddingLeft: '30px', height: '34px', fontSize: '12.5px', borderRadius: '8px' }}
            />
          </div>
        </div>

        {/* Group Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {groups.map(grp => (
            <button
              key={grp.id}
              type="button"
              onClick={() => setSelectedGroup(grp.id)}
              style={{
                background: selectedGroup === grp.id ? 'var(--primary)' : 'var(--card-bg)',
                color: selectedGroup === grp.id ? '#ffffff' : 'var(--text-secondary)',
                border: selectedGroup === grp.id ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                borderRadius: '16px',
                padding: '4px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: selectedGroup === grp.id ? '600' : '400',
                transition: 'all 0.15s ease'
              }}
            >
              {isHindi ? grp.hi : grp.en}
            </button>
          ))}
        </div>

        {/* 12 Templates Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
          {filteredTemplates.map(tmpl => {
            const isSelected = documentType === tmpl.documentType || documentType === tmpl.title_en;
            const IconComponent = ICON_MAP[tmpl.iconType] || FileText;

            return (
              <button
                type="button"
                key={tmpl.id}
                className={`drafter-template-card ${isSelected ? 'is-selected' : ''}`}
                onClick={() => handleSelectTemplate(tmpl)}
                style={{
                  border: isSelected ? '2px solid var(--primary)' : '1px solid var(--card-border)',
                  background: isSelected ? 'var(--primary-light)' : 'var(--card-bg)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                {isSelected && (
                  <span style={{ position: 'absolute', top: '12px', right: '12px', color: 'var(--primary)' }}>
                    <CheckCircle2 size={18} />
                  </span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isSelected ? 'var(--primary)' : 'rgba(59, 130, 246, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? '#ffffff' : 'var(--primary)',
                    flexShrink: 0
                  }}>
                    <IconComponent size={18} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '13.5px', color: 'var(--text-main)', display: 'block', lineHeight: '1.3' }}>
                      {isHindi ? tmpl.title_hi : tmpl.title_en}
                    </strong>
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '600' }}>
                      {tmpl.relevant_sections}
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>
                  {isHindi ? tmpl.desc_hi : tmpl.desc_en}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
          {isHindi ? '2. अपराध / मामले की मुख्य श्रेणी (Incident Category):' : '2. Select the main incident / case category:'}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
          {CATEGORIES.map(cat => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setIncidentCategory(cat.id)}
              style={{
                background: incidentCategory === cat.id ? 'var(--primary)' : 'var(--card-bg)',
                color: incidentCategory === cat.id ? 'white' : 'var(--text-main)',
                border: incidentCategory === cat.id ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                borderRadius: '10px',
                padding: '9px 12px',
                fontSize: '12.5px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontWeight: incidentCategory === cat.id ? '600' : '400'
              }}
            >
              {isHindi ? cat.hi : cat.en}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setStep(2)}
          style={{ padding: '10px 22px', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isHindi ? 'आगे बढ़ें (पक्षकारों का विवरण)' : 'Next (Parties Details)'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
