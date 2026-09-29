import React, { useState } from 'react';
import {
  Shield,
  PhoneCall,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  UserCheck,
  Car,
  Lock,
  HeartHandshake,
  Search,
  ChevronRight,
  Sparkles,
  Phone,
  AlertTriangle,
  CreditCard,
  Home
} from 'lucide-react';
import { HELPLINES, RIGHTS_TOPICS } from '../data/citizenRightsData';


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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          padding: '10px',
          borderRadius: '12px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
        }}>
          <Shield size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              {isHindi ? 'नागरिक कानूनी अधिकार व सुरक्षा गाइड' : 'Citizen Legal Rights & Emergency Guide'}
            </h2>
            <span style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary-border)', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
              BNSS 2023
            </span>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              {isHindi
                ? 'पुलिस पूछताछ, गिरफ्तारी, महिलाओं की सुरक्षा, ट्रैफिक चालान व साइबर धोखाधड़ी में आपके अनिवार्य संवैधानिक व विधिक अधिकार।'
                : 'Your statutory rights under BNSS 2023, Constitution of India, Supreme Court directives, and Motor Vehicles Act.'}
          </p>
        </div>
      </div>

      {/* Emergency Helpline Grid */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <PhoneCall size={20} color="#dc2626" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
            {isHindi ? 'राष्ट्रीय आपातकालीन हेल्पलाइन निर्देशिका (One-Tap Helplines)' : 'National Emergency Helplines (Direct Tap & Free Legal Aid)'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {HELPLINES.map((hl, idx) => (
            <div
              key={idx}
              className="hover-tactile"
              style={{
                border: '1px solid var(--card-border)',
                background: 'var(--card-bg)',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: hl.color, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={20} color={hl.color} /> {hl.number}
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', background: `${hl.color}15`, color: hl.color }}>
                    {hl.badge}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                  {isHindi ? hl.title_hi : hl.title}
                </h4>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {isHindi ? hl.desc_hi : hl.desc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <a
                  href={`tel:${hl.number}`}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: 'var(--primary-light)',
                    border: '1px solid var(--card-border)',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'var(--primary-light)'; e.currentTarget.style.color = 'var(--primary)'; }}
                >
                  {isHindi ? 'कॉल करें' : 'Dial Now'}
                </a>
                <button
                  type="button"
                  onClick={() => copyHelpline(hl.number)}
                  style={{
                    background: 'var(--subtle-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--text-main)'
                  }}
                >
                  {copiedNumber === hl.number ? <Check size={14} color="#166534" /> : <Copy size={14} />}
                  {copiedNumber === hl.number ? (isHindi ? 'कॉपी' : 'Copied') : (isHindi ? 'नंबर लें' : 'Copy')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Situation Navigator */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Sparkles size={18} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
            {isHindi ? 'आपात स्थिति में त्वरित निर्णय मार्गदर्शिका (Instant Action Wizard)' : 'Instant Decision Wizard: What To Do If...'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {[
            {
              icon: AlertTriangle,
              label: isHindi ? "पुलिस ने हिरासत में लिया?" : "Detained by Police?",
              advice: isHindi
                ? "मांगें: धारा 35(3) BNSS का नोटिस। अरेस्ट मेमो पर तारीख व समय लिखवाएं। अपने वकील या परिजन को फोन करने का अधिकार मांगें।"
                : "Ask for Section 35(3) BNSS Notice. Insist on immediate Arrest Memo with date/time. Exercise right to phone call under Sec 36 BNSS."
            },
            {
              icon: CreditCard,
              label: isHindi ? "बैंक / UPI से अवैध निकासी?" : "Online Fraud / UPI Debit?",
              advice: isHindi
                ? "पहले 1930 पर कॉल कर शिकायत संख्या लें। बैंक ऐप से कार्ड/यूपीआई ब्लॉक करें और 3 दिन के भीतर बैंक को लिखित ईमेल भेजें।"
                : "Dial 1930 within 2 hours. Block UPI/card via banking app. Submit written dispute to bank within 3 days for zero liability."
            },
            {
              icon: UserCheck,
              label: isHindi ? "ट्रैफिक पुलिस ने रोका?" : "Stopped by Traffic Cop?",
              advice: isHindi
                ? "डिजीलॉकर से डीएल व आरसी दिखाएं। चाबी निकालने का पुलिस को अधिकार नहीं है। केवल ASI या उच्च अधिकारी को ही मौके पर जुर्माना लेने का अधिकार है।"
                : "Show DigiLocker/mParivahan. Cop cannot pull your keys. Only Sub-Inspector (SI) or above can compound spot fines."
            },
            {
              icon: Home,
              label: isHindi ? "मकान मालिक जबरन बेदखल करे?" : "Landlord Threatening Eviction?",
              advice: isHindi
                ? "मकान मालिक बिना अदालत के आदेश बिजली/पानी नहीं काट सकता। पुलिस में अवैध बेदखली व आपराधिक अतिचार (Sec 329 BNS) की शिकायत करें।"
                : "Landlord cannot cut electricity/water without court order. File complaint for illegal dispossession and criminal trespass (Sec 329 BNS)."
            }
          ].map((scenario, i) => {
            const Icon = scenario.icon;
            return (
              <div
                key={i}
                className="hover-tactile"
                onClick={() => setActiveStep(activeStep === i ? null : i)}
                style={{
                  border: activeStep === i ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                  background: activeStep === i ? 'var(--primary-light)' : 'var(--card-bg)',
                  borderRadius: '10px',
                  padding: '12px',
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
                  <ChevronRight size={16} color={activeStep === i ? 'var(--primary)' : 'var(--text-muted)'} />
                </div>
                {activeStep === i && (
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.5', background: 'var(--subtle-bg)', border: '1px solid var(--card-border)', padding: '8px', borderRadius: '6px' }}>
                    {scenario.advice}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Rights Handbook Tabs */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        {/* Topic Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
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
                  color: isSelected ? '#fff' : 'var(--text-main)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                  borderRadius: '10px',
                  padding: '9px 16px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                {isHindi ? topic.title_hi : topic.title}
              </button>
            );
          })}
        </div>

        {/* Search within Rights */}
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? "अधिकारों व नियमों में खोजें..." : "Search statutory rules and citizen rights..."}
            style={{
              width: '100%',
              padding: '9px 14px 9px 36px',
              borderRadius: '8px',
              border: '1px solid var(--card-border)',
              fontSize: '13.5px',
              background: 'var(--subtle-bg)',
              color: 'var(--text-main)',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Rules List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredRules.map((rule, idx) => {
            const isExpanded = expandedRule === idx;
            return (
              <div
                key={idx}
                onClick={() => setExpandedRule(isExpanded ? null : idx)}
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  borderLeft: `3px solid ${currentTopic.color}`,
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isExpanded ? 'var(--card-shadow)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                    {isHindi ? rule.heading_hi : rule.heading}
                  </h4>
                  <ChevronRight
                    size={18}
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
            <Check size={18} color="#4ade80" />
            {isHindi ? 'हेल्पलाइन नंबर कॉपी किया गया!' : 'Helpline number copied to clipboard!'}
          </div>
        </div>
      )}
    </div>
  );
}
