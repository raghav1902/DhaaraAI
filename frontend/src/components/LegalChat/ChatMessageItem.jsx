import React, { useState } from 'react';
import { Bot, Volume2, Square, ShieldCheck, Copy, Check, Scale, Landmark, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessageItem({ msg, idx, speakingIndex, handleToggleSpeak, isHindi }) {
  const [copied, setCopied] = useState(false);
  const [savedToVault, setSavedToVault] = useState(false);
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

  const handleSaveToVault = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('dhaara_vault_drafts') || '[]');
      const firstLine = (msg.content || '').split('\n').find(l => l.trim().length > 0) || 'Legal Consultation';
      const cleanTitle = firstLine.replace(/^[#* \-_]+/, '').slice(0, 50);

      drafts.push({
        id: `chat_${Date.now()}`,
        type: 'Legal Consultation',
        title: cleanTitle ? `Consultation: ${cleanTitle}` : 'Legal Consultation Record',
        content: msg.content,
        date: new Date().toISOString()
      });

      localStorage.setItem('dhaara_vault_drafts', JSON.stringify(drafts));
      setSavedToVault(true);
      setTimeout(() => setSavedToVault(false), 2000);
    } catch (err) {
      console.warn('Failed saving message to vault:', err);
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
                  onClick={handleSaveToVault}
                  className="ask-ai-action-button"
                  title={isHindi ? 'वॉल्ट में सुरक्षित करें' : 'Save response to Vault'}
                  aria-label={isHindi ? 'वॉल्ट में सुरक्षित करें' : 'Save response to Vault'}
                >
                  {savedToVault ? <Check size={13} color="var(--emerald-600)" /> : <ShieldCheck size={13} />}
                  <span>{savedToVault ? (isHindi ? 'सहेजा गया!' : 'Saved!') : (isHindi ? 'वॉल्ट' : 'Vault')}</span>
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

              {/* Verified Statutory Sources (IndiaCode) */}
              {((msg.statutory_sources && msg.statutory_sources.length > 0) || (msg.sources && msg.sources.some(s => s.source_type !== 'case_law'))) && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                  <p className="ask-ai-citations-heading" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '700', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>
                    <ShieldCheck size={14} />
                    {isHindi ? 'वैधानिक संदर्भ एवं धाराएं (IndiaCode)' : 'VERIFIED STATUTORY PROVISIONS (IndiaCode)'}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                    {(msg.statutory_sources?.length > 0 ? msg.statutory_sources : (msg.sources || []).filter(s => s.source_type !== 'case_law')).slice(0, 3).map((src, i) => (
                      <div key={i} className="ask-ai-citation" style={{ background: 'rgba(5, 150, 105, 0.05)', border: '1px solid rgba(5, 150, 105, 0.2)', borderRadius: '8px', padding: '8px 10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: '#047857', fontSize: '12px' }}>{src.section || 'Statute'}</strong>
                          <span style={{ fontSize: '9px', background: '#ecfdf5', color: '#047857', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>STATUTORY</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {src.section_title || src.title || 'Official IndiaCode Provision'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supreme Court Case Law Precedents (eSCR) */}
              {((msg.case_law_sources && msg.case_law_sources.length > 0) || (msg.sources && msg.sources.some(s => s.source_type === 'case_law'))) && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                  <p className="ask-ai-citations-heading" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1d4ed8', fontWeight: '700', fontSize: '11.5px', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '8px' }}>
                    <Landmark size={14} />
                    {isHindi ? 'सर्वोच्च न्यायालय के न्यायिक दृष्टांत (Supreme Court Precedents)' : 'SUPREME COURT JUDICIAL PRECEDENTS (Case Law)'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(msg.case_law_sources?.length > 0 ? msg.case_law_sources : (msg.sources || []).filter(s => s.source_type === 'case_law')).slice(0, 3).map((cl, i) => (
                      <div
                        key={i}
                        style={{
                          background: 'rgba(37, 99, 235, 0.04)',
                          border: '1px solid rgba(37, 99, 235, 0.22)',
                          borderRadius: '8px',
                          padding: '10px 12px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <a
                              href={cl.source_url || 'https://digiscr.sci.gov.in/'}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: '#1d4ed8',
                                fontWeight: '700',
                                fontSize: '12.5px',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              {cl.case_name || 'Supreme Court Judgment'}
                              <ExternalLink size={11} />
                            </a>
                            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              <span>{cl.court || 'Supreme Court of India'}</span>
                              {cl.judgment_date && <span> • {cl.judgment_date}</span>}
                              {cl.citation && <span style={{ fontWeight: '600' }}> • {cl.citation}</span>}
                            </div>
                          </div>
                          <span style={{ fontSize: '9px', background: '#eff6ff', color: '#1d4ed8', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                            CASE-LAW
                          </span>
                        </div>

                        {cl.relevant_passage && (
                          <div style={{
                            marginTop: '6px',
                            fontSize: '11.5px',
                            color: 'var(--text-primary)',
                            background: 'rgba(255, 255, 255, 0.7)',
                            padding: '6px 8px',
                            borderRadius: '4px',
                            borderLeft: '2px solid #2563eb',
                            lineHeight: '1.4'
                          }}>
                            <strong>Ratio Decidendi:</strong> {cl.relevant_passage}
                          </div>
                        )}
                      </div>
                    ))}
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
