import { Bot, Volume2, Square, ShieldCheck, Copy, Check } from 'lucide-react';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessageItem({ msg, idx, speakingIndex, handleToggleSpeak, isHindi }) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.warn('Could not copy response:', error);
    }
  };

  return (
    <div
      className="chat-msg-row"
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
          background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          padding: '8px',
          borderRadius: '12px',
          height: '36px',
          width: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
        }}>
          <Bot size={20} />
        </div>
      )}

      <div
        className={`chat-msg-bubble ask-ai-message ${isUser ? 'is-user' : 'is-assistant'}`}
        style={{
          background: isUser ? 'var(--primary)' : 'var(--card-bg)',
          color: isUser ? '#ffffff' : 'var(--text-main)',
          padding: '16px 20px',
          borderRadius: '16px',
          borderTopRightRadius: isUser ? 4 : '16px',
          borderTopLeftRadius: !isUser ? 4 : '16px',
          boxShadow: isUser ? '0 4px 12px rgba(37, 99, 235, 0.25)' : 'var(--card-shadow)',
          border: isUser ? 'none' : '1px solid var(--card-border)',
          position: 'relative',
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          minWidth: 0
        }}
      >
        {isUser ? (
          <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5' }}>{msg.content}</p>
        ) : (
          <div>
            {/* Audio Reader Control Bar */}
            <div className="ask-ai-message-toolbar">
              <span className="ask-ai-message-brand"><span className="ask-ai-message-mini-avatar"><Bot size={14} /></span><span>LegalGPT AI</span>{msg.sources?.length > 0 && <span className="ask-ai-source-badge"><ShieldCheck size={12} />{isHindi ? 'स्रोत शामिल' : 'Sources included'}</span>}</span>
              <div className="ask-ai-message-actions">
                <button type="button" className="ask-ai-action-button" onClick={handleCopy} title={isHindi ? 'उत्तर कॉपी करें' : 'Copy response'} aria-label={isHindi ? 'उत्तर कॉपी करें' : 'Copy response'}>
                  {copied ? <Check size={14} /> : <Copy size={14} />}<span>{copied ? (isHindi ? 'कॉपी हुआ' : 'Copied') : (isHindi ? 'कॉपी' : 'Copy')}</span>
                </button>
                <button
                type="button"
                onClick={() => handleToggleSpeak(idx, msg.content)}
                className={`ask-ai-action-button ${speakingIndex === idx ? 'is-speaking' : ''}`}
                title={speakingIndex === idx ? (isHindi ? 'आवाज़ बंद करें' : 'Stop voice') : (isHindi ? 'उत्तर सुनें' : 'Listen to response')}
              >
                {speakingIndex === idx ? (
                  <>
                    <Square size={13} />
                    <span>{isHindi ? 'रोकें' : 'Stop'}</span>
                    <span className="audio-wave-pulse" />
                  </>
                ) : (
                  <>
                    <Volume2 size={14} />
                    <span>{isHindi ? 'सुनें (Audio)' : 'Listen (Audio)'}</span>
                  </>
                )}
                </button>
              </div>
            </div>

            <div className="markdown-content" style={{ fontSize: '14.5px', color: msg.isError ? 'var(--danger)' : 'inherit' }}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>

              {msg.sources && msg.sources.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                  <p className="ask-ai-citations-heading">
                    <ShieldCheck size={13} />
                    {isHindi ? 'वैधानिक स्रोत (IndiaCode Verified Sources)' : 'VERIFIED STATUTORY SOURCES (IndiaCode)'}
                  </p>
                  {msg.sources.slice(0, 2).map((src, i) => (
                    <div key={i} className="ask-ai-citation">
                      <strong>{src.section || 'Statute'}</strong> — {src.section_title || 'Reference Provision'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
