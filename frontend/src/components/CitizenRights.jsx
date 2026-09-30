import React, { useState } from 'react';
import {
  Shield,
  PhoneCall,
  Copy,
  Check,
  Search,
  ChevronRight,
  Sparkles,
  Phone,
  AlertTriangle,
  CreditCard,
  Home,
  UserCheck,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { HELPLINES, RIGHTS_TOPICS } from '../data/citizenRightsData';
import './CitizenRights.css';

export default function CitizenRights({ language = 'English' }) {
  const isHindi = language === 'Hindi';
  const [selectedTopic, setSelectedTopic] = useState('police_arrest');
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStep, setActiveStep] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);

  const copyHelpline = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const currentTopic = RIGHTS_TOPICS.find(t => t.id === selectedTopic) || RIGHTS_TOPICS[0];

  const filteredRules = currentTopic.rules.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.heading.toLowerCase().includes(q) ||
      r.heading_hi.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.desc_hi.toLowerCase().includes(q)
    );
  });

  return (
    <div className="citizen-rights animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="citizen-rights__header module-header-banner">
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '75%' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--crimson-600), #991b1b)',
            padding: '10px',
            borderRadius: 'var(--radius-sm)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
            flexShrink: 0
          }}>
            <Shield size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                {isHindi ? 'नागरिक अधिकार और SOS निर्देशिका' : 'Citizen Statutory Rights & Emergency SOS'}
              </h2>
              <span style={{ fontSize: '11px', background: 'var(--danger-light)', color: 'var(--danger)', border: '1px solid var(--danger-border)', fontWeight: '700', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                BNSS 2023 & Art. 21
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              {isHindi
                ? 'पुलिस पूछताछ, गिरफ्तारी, महिलाओं की सुरक्षा, ट्रैफिक चालान व साइबर धोखाधड़ी में आपके अनिवार्य संवैधानिक व विधिक अधिकार।'
                : 'Statutory citizen safeguards under BNSS 2023, Constitution of India, and Supreme Court arrest guidelines.'}
            </p>
          </div>
        </div>

        <div className="module-banner-visual" aria-hidden="true">
          <img
            src="/assets/legal/civic/constitution_civic.webp"
            alt=""
            className="module-banner-image"
            loading="lazy"
          />
          <div className="module-banner-gradient" />
        </div>
      </div>

      {/* Emergency Helpline Grid */}
      <div className="glass-panel citizen-rights__helplines" style={{ padding: '22px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <PhoneCall size={20} color="var(--danger)" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
            {isHindi ? 'राष्ट्रीय आपातकालीन हेल्पलाइन केंद्र (One-Tap Helplines)' : 'National Emergency SOS Hub (Direct Dial & Free Legal Aid)'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '14px' }}>
          {HELPLINES.map((hl, idx) => (
            <div
              key={idx}
              className="hover-tactile"
              style={{
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '10px',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: hl.color, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={18} color={hl.color} /> {hl.number}
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: '700', padding: '2px 8px', borderRadius: 'var(--radius-full)', background: `${hl.color}15`, color: hl.color, border: `1px solid ${hl.color}30` }}>
                    {hl.badge}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                  {isHindi ? hl.title_hi : hl.title}
                </h4>
                <p style={{ margin: 0, fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                  {isHindi ? hl.desc_hi : hl.desc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <a
                  href={`tel:${hl.number}`}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: 'var(--primary)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-xs)',
                    padding: '8px 12px',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    minHeight: '40px',
                    boxShadow: '0 2px 6px var(--primary-glow)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Phone size={14} />
                  <span>{isHindi ? 'कॉल करें' : 'Dial Now'}</span>
                </a>
                <button
                  type="button"
                  onClick={() => copyHelpline(hl.number)}
                  style={{
                    background: 'var(--subtle-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 'var(--radius-xs)',
                    padding: '8px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    minHeight: '40px',
                    color: 'var(--text-secondary)',
                    fontWeight: '600'
                  }}
                  title={isHindi ? "नंबर कॉपी करें" : "Copy phone number"}
                >
                  {copiedNumber === hl.number ? <Check size={14} color="var(--accent)" /> : <Copy size={14} />}
                  <span>{copiedNumber === hl.number ? (isHindi ? 'कॉपी' : 'Copied') : (isHindi ? 'कॉपी' : 'Copy')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decision Wizard: What to do if... */}
      <div className="glass-panel citizen-rights__wizard" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Sparkles size={18} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--text-main)' }}>
            {isHindi ? 'त्वरित संकट विधिक मार्गदर्शिका (Instant Action Guidance)' : 'Instant Statutory Guidance: What To Do In Crisis'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '10px' }}>
          {[
            {
              icon: AlertTriangle,
              label: isHindi ? "पुलिस ने हिरासत में लिया?" : "Detained by Police?",
              advice: isHindi
                ? "मांगें: धारा 35(3) BNSS का नोटिस। अरेस्ट मेमो पर तारीख व समय लिखवाएं। धारा 36 BNSS के तहत अपने वकील या परिजन को फोन करने का अधिकार मांगें।"
                : "Ask for Section 35(3) BNSS Notice. Insist on immediate Arrest Memo with date/time. Exercise right to phone call under Sec 36 BNSS."
            },
            {
              icon: CreditCard,
              label: isHindi ? "बैंक / UPI से अवैध निकासी?" : "Online Fraud / UPI Debit?",
              advice: isHindi
                ? "तुरंत 1930 पर कॉल कर पावती संख्या लें। बैंक ऐप से कार्ड/यूपीआई ब्लॉक करें और 3 दिन के भीतर बैंक को लिखित ईमेल भेजकर शून्य देयता का दावा करें।"
                : "Dial 1930 within golden hour. Block UPI/card via banking app. Submit written dispute to bank within 3 days for RBI Zero Liability protection."
            },
            {
              icon: UserCheck,
              label: isHindi ? "ट्रैफिक पुलिस ने रोका?" : "Stopped by Traffic Cop?",
              advice: isHindi
                ? "डिजीलॉकर से डीएल व आरसी दिखाएं। चाबी निकालने का पुलिस को अधिकार नहीं है। केवल ASI या उच्च अधिकारी को ही मौके पर चालान वसूलने का अधिकार है।"
                : "Show DigiLocker/mParivahan. Cop cannot seize vehicle keys. Only Sub-Inspector (SI) or above can compound spot fines."
            },
            {
              icon: Home,
              label: isHindi ? "मकान मालिक जबरन बेदखल करे?" : "Landlord Threatening Eviction?",
              advice: isHindi
                ? "मकान मालिक बिना अदालत के आदेश बिजली/पानी नहीं काट सकता। पुलिस में अवैध बेदखली व आपराधिक अतिचार (Sec 329 BNS) की शिकायत दर्ज कराएं।"
                : "Landlord cannot disconnect electricity/water without court order. File complaint for illegal dispossession and criminal trespass (Sec 329 BNS)."
            }
          ].map((scenario, i) => {
            const Icon = scenario.icon;
            const isOpen = activeStep === i;
            return (
              <div
                key={i}
                className="hover-tactile"
                role="button"
                tabIndex={0}
                onClick={() => setActiveStep(isOpen ? null : i)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setActiveStep(isOpen ? null : i)}
                style={{
                  border: isOpen ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                  background: isOpen ? 'var(--primary-light)' : 'var(--card-bg)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 14px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={16} color="var(--primary)" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {scenario.label}
                    </span>
                  </div>
                  <ChevronRight size={16} color={isOpen ? 'var(--primary)' : 'var(--text-muted)'} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
                {isOpen && (
                  <p style={{ margin: '10px 0 0', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.55', background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '10px', borderRadius: 'var(--radius-xs)' }}>
                    {scenario.advice}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Rights Handbook */}
      <div className="glass-panel citizen-rights__handbook" style={{ padding: '22px', borderRadius: 'var(--radius-lg)' }}>
        {/* Topic Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px' }}>
          {RIGHTS_TOPICS.map((topic) => {
            const Icon = topic.icon;
            const isSelected = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic.id)}
                style={{
                  background: isSelected ? 'var(--primary)' : 'var(--subtle-bg)',
                  color: isSelected ? '#ffffff' : 'var(--text-main)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} />
                <span>{isHindi ? topic.title_hi : topic.title}</span>
              </button>
            );
          })}
        </div>

        {/* Search within Rights */}
        <div style={{ marginBottom: '16px', position: 'relative' }}>
          <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? "अधिकारों, नियमों व अनुच्छेदों में खोजें..." : "Search statutory rules, Supreme Court directives, and citizen rights..."}
            className="input-field"
            style={{ paddingLeft: '34px', height: '40px', fontSize: '13px' }}
          />
        </div>

        {/* Rules Accordion List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredRules.map((rule, idx) => {
            const isExpanded = expandedRule === idx;
            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => setExpandedRule(isExpanded ? null : idx)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setExpandedRule(isExpanded ? null : idx)}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderLeft: `3px solid ${currentTopic.color || 'var(--primary)'}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isExpanded ? 'var(--card-shadow)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '13.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {isHindi ? rule.heading_hi : rule.heading}
                  </h4>
                  <ChevronRight
                    size={16}
                    color="var(--text-muted)"
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </div>
                {isExpanded && (
                  <p style={{ margin: '10px 0 0', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.6', borderTop: '1px solid var(--card-border)', paddingTop: '10px' }}>
                    {isHindi ? rule.desc_hi : rule.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast Notification */}
      {copiedNumber && (
        <div className="toast-container">
          <div className="toast-message">
            <Check size={18} color="var(--accent)" />
            {isHindi ? 'हेल्पलाइन नंबर कॉपी किया गया!' : 'Helpline number copied to clipboard!'}
          </div>
        </div>
      )}
    </div>
  );
}
