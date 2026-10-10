import React from 'react';
import {
  Scale,
  BookOpen,
  ScrollText,
  ShieldCheck,
  Plus
} from 'lucide-react';

export default function ChatHeroBanner({
  hasMessages,
  conversations,
  activeConversationId,
  isHindi,
  isPro,
  handleNewChat,
  onOpenUpgradeModal,
  onNavigateTab
}) {
  const triggerUpgrade = () => {
    if (onOpenUpgradeModal) {
      onOpenUpgradeModal('AI Legal Chat (Ask AI)', 'Upgrade to DhaaraAI Plus for unlimited AI legal inquiries.');
    } else if (onNavigateTab) {
      onNavigateTab('settings');
    }
  };

  if (hasMessages) {
    return (
      <div className="ask-ai-active-session-bar">
        <div className="ask-ai-session-left">
          <span className="ask-ai-pulse-dot" />
          <div className="ask-ai-session-info">
            <span className="ask-ai-session-title">
              {conversations.find(c => c.id === activeConversationId)?.title ||
                (isHindi ? 'सक्रिय विधिक परामर्श सत्र' : 'Active Legal Intelligence Consultation')}
            </span>
          </div>
        </div>
        <div className="ask-ai-session-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isPro && (
            <button
              type="button"
              onClick={triggerUpgrade}
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
          <button
            type="button"
            onClick={handleNewChat}
            className="ask-ai-new-session-btn"
            title={isHindi ? 'नया विधिक सत्र शुरू करें' : 'Start New Legal Consultation'}
          >
            <Plus size={14} />
            <span>{isHindi ? 'नया परामर्श' : 'New Consultation'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="ask-ai-hero" aria-labelledby="ask-ai-title">
      <div className="ask-ai-hero-copy">
        <div className="ask-ai-brand" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="ask-ai-brand-mark"><Scale size={16} /></span>
            <span>DhaaraAI LegalGPT Workspace</span>
          </div>
          {!isPro && (
            <button
              type="button"
              onClick={triggerUpgrade}
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

        <div className="ask-ai-heading-row">
          <div>
            <h2 id="ask-ai-title">
              {isHindi ? (
                <>भारतीय विधिक <em>इंटेलिजेंस वर्कस्पेस</em></>
              ) : (
                <>Indian Statutory & Case Law <em>Intelligence Studio</em></>
              )}
            </h2>
            <p className="ask-ai-description">
              {isHindi
                ? 'नवीनतम भारतीय न्याय संहिता (BNS), नागरिक सुरक्षा संहिता (BNSS) व सुप्रीम कोर्ट नज़ीरों पर आधारित सटीक समाधान।'
                : 'Statutory research, FIR guidance, bail procedures, and cross-statute concordance powered by Indian legal intelligence.'}
            </p>
          </div>
        </div>

        <div className="ask-ai-feature-row">
          <div className="ask-ai-feature-card feature-blue">
            <span><BookOpen size={15} /></span>
            <div>
              <b>{isHindi ? 'विधिक संहिता' : 'Statutory Codes'}</b>
              <small>{isHindi ? 'अपराधिक व दीवानी कानून' : 'Penal & Civil Laws'}</small>
            </div>
          </div>
          <div className="ask-ai-feature-card feature-purple">
            <span><Scale size={15} /></span>
            <div>
              <b>{isHindi ? 'केस लॉ व नज़ीरें' : 'Supreme Court Precedents'}</b>
              <small>{isHindi ? 'अदालती निर्णय' : 'Leading Judgments'}</small>
            </div>
          </div>
          <div className="ask-ai-feature-card feature-green">
            <span><ScrollText size={15} /></span>
            <div>
              <b>{isHindi ? 'प्रक्रियात्मक उपाय' : 'Statutory Remedies'}</b>
              <small>{isHindi ? 'चरण-दर-चरण विधिक कदम' : 'Step-by-step guidance'}</small>
            </div>
          </div>
          <div className="ask-ai-feature-card feature-orange">
            <span><ShieldCheck size={15} /></span>
            <div>
              <b>{isHindi ? 'नागरिक अधिकार' : 'Constitutional Rights'}</b>
              <small>{isHindi ? 'अनुच्छेद 21 व जमानत' : 'Art. 21 & Bail safeguards'}</small>
            </div>
          </div>
        </div>
      </div>
      <div className="ask-ai-hero-visual" aria-hidden="true">
        <img
          src="/assets/legal/hero/supreme_court_hero.webp"
          alt="Supreme Court of India"
          className="ask-ai-hero-image"
          loading="eager"
        />
        <div className="ask-ai-hero-gradient-overlay" />
      </div>
    </section>
  );
}
