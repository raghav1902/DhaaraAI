import React, { useState } from 'react';
import { Bot, Volume2, Square, ShieldCheck, Copy, Check, Scale } from 'lucide-react';
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

              {msg.sources && msg.sources.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                  <p className="ask-ai-citations-heading">
                    <ShieldCheck size={13} />
                    {isHindi ? 'वैधानिक संदर्भ एवं धाराएं (IndiaCode)' : 'VERIFIED STATUTORY PROVISIONS (IndiaCode)'}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
                    {msg.sources.slice(0, 3).map((src, i) => (
                      <div key={i} className="ask-ai-citation">
                        <strong>{src.section || 'Statute'}</strong> — {src.section_title || 'Legal Reference'}
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
