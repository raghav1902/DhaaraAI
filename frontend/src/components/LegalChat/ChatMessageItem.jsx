import React, { useState } from 'react';
import { Bot, Volume2, Square, ShieldCheck, Copy, Check, Scale } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessageItem({ msg, idx, speakingIndex, handleToggleSpeak, isHindi }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.warn('Could not copy response:', error);
    }
  };

  return (
    <div
      className={`ask-ai-message-row ${isUser ? 'is-user' : 'is-assistant'}`}
      style={{
        display: 'flex',
        gap: '12px',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: isUser ? '85%' : '94%'
      }}
    >
      {!isUser && (
        <div style={{
          background: 'linear-gradient(135deg, var(--royal-700), #1e3a8a)',
          padding: '8px',
          borderRadius: 'var(--radius-sm)',
          height: '36px',
          width: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(29, 78, 216, 0.25)'
        }}>
          <Scale size={18} />
        </div>
      )}

      <div
        className={`chat-msg-bubble ask-ai-message ${isUser ? 'is-user' : 'is-assistant'}`}
        style={{
          background: isUser ? 'var(--primary)' : 'var(--card-bg)',
          color: isUser ? '#ffffff' : 'var(--text-main)',
          padding: '16px 20px',
          borderRadius: 'var(--radius-md)',
          borderTopRightRadius: isUser ? 4 : 'var(--radius-md)',
          borderTopLeftRadius: !isUser ? 4 : 'var(--radius-md)',
          boxShadow: isUser ? '0 4px 12px var(--primary-glow)' : 'var(--card-shadow)',
          border: isUser ? 'none' : '1px solid var(--card-border)',
          position: 'relative',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          minWidth: 0
        }}
      >
        {isUser ? (
          <p style={{ margin: 0, fontSize: '14.5px', lineHeight: '1.55' }}>{msg.content}</p>
        ) : (
          <div>
            {/* Action Bar & Metadata */}
            <div className="ask-ai-message-toolbar">
              <span className="ask-ai-message-brand">
                <span className="ask-ai-message-mini-avatar"><Bot size={13} /></span>
                <span>LegalGPT Intelligence</span>
                {msg.sources?.length > 0 && (
                  <span className="ask-ai-source-badge">
                    <ShieldCheck size={11} />
                    {isHindi ? 'धाराएं सत्यापित' : 'IndiaCode Verified'}
                  </span>
                )}
              </span>

              <div className="ask-ai-message-actions">
                <button
                  type="button"
                  className="ask-ai-action-button"
                  onClick={handleCopy}
                  title={isHindi ? 'उत्तर कॉपी करें' : 'Copy response text'}
                  aria-label={isHindi ? 'उत्तर कॉपी करें' : 'Copy response text'}
                >
                  {copied ? <Check size={13} color="var(--accent)" /> : <Copy size={13} />}
                  <span>{copied ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी' : 'Copy')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleSpeak(idx, msg.content)}
                  className={`ask-ai-action-button ${speakingIndex === idx ? 'is-speaking' : ''}`}
                  title={speakingIndex === idx ? (isHindi ? 'आवाज़ बंद करें' : 'Stop voice') : (isHindi ? 'उत्तर सुनें' : 'Listen to response')}
                  aria-label={speakingIndex === idx ? 'Stop audio reading' : 'Listen to response'}
                >
                  {speakingIndex === idx ? (
                    <>
                      <Square size={12} />
                      <span>{isHindi ? 'रोकें' : 'Stop'}</span>
                      <span className="audio-wave-pulse" />
                    </>
                  ) : (
                    <>
                      <Volume2 size={13} />
                      <span>{isHindi ? 'सुनें (Audio)' : 'Listen (Audio)'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Markdown Body */}
            <div className="markdown-content" style={{ fontSize: '14px', color: msg.isError ? 'var(--danger)' : 'inherit' }}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>

              {msg.sources && msg.sources.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                  <p className="ask-ai-citations-heading" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '0 0 8px' }}>
                    <ShieldCheck size={13} color="var(--primary)" />
                    {isHindi ? 'सत्यापित विधिक संदर्भ एवं स्रोत (VERIFIED SOURCES)' : 'VERIFIED LEGAL SOURCES & CITATIONS'}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '8px' }}>
                    {msg.sources.slice(0, 4).map((src, i) => {
                      const st = src.source_type || 'Statutory Sources';
                      let badgeColor = 'var(--primary)';
                      let badgeBg = 'rgba(59, 130, 246, 0.1)';
                      let label = 'Statutory Source';

                      if (st === 'Draft Template') {
                        badgeColor = '#8b5cf6';
                        badgeBg = 'rgba(139, 92, 246, 0.12)';
                        label = isHindi ? 'विधिक प्रारूप (Draft Template)' : 'Legal Draft Template';
                      } else if (st === 'Legal Glossary') {
                        badgeColor = '#059669';
                        badgeBg = 'rgba(16, 185, 129, 0.12)';
                        label = isHindi ? 'कानूनी शब्दावली (Glossary)' : 'Legal Glossary Entry';
                      } else if (st === 'Case Law') {
                        badgeColor = '#d97706';
                        badgeBg = 'rgba(245, 158, 11, 0.12)';
                        label = isHindi ? 'सुप्रीम कोर्ट दृष्टांत (Case Law)' : 'Supreme Court Precedent';
                      } else {
                        label = isHindi ? 'वैधानिक प्रावधान (Statute)' : 'Statutory Provision';
                      }

                      return (
                        <div key={i} className="ask-ai-citation" style={{ borderLeft: `3px solid ${badgeColor}`, background: 'var(--subtle-bg)', padding: '8px 12px', borderRadius: '6px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '700', color: badgeColor, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                            {label}
                          </span>
                          <strong style={{ fontSize: '12px', display: 'block', color: 'var(--text-main)' }}>
                            {src.case_name || src.section || src.term || 'Reference'}
                          </strong>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', lineHeight: '1.3' }}>
                            {src.citation || src.section_title || src.source || src.title || ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
