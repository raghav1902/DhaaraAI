import React from 'react';
import { Bot, Volume2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessageItem({ msg, idx, speakingIndex, handleToggleSpeak, isHindi }) {
  const isUser = msg.role === 'user';

  return (
    <div
      className="chat-msg-row"
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
        className="chat-msg-bubble"
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--card-border)', paddingBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>
                LegalGPT AI
              </span>

              <button
                type="button"
                onClick={() => handleToggleSpeak(idx, msg.content)}
                style={{
                  background: speakingIndex === idx ? 'rgba(239, 68, 68, 0.15)' : 'var(--primary-light)',
                  color: speakingIndex === idx ? 'var(--danger)' : 'var(--primary)',
                  border: speakingIndex === idx ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--primary-border)',
                  borderRadius: '14px',
                  padding: '3px 10px',
                  fontSize: '11.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
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

            <div className="markdown-content" style={{ fontSize: '14.5px', color: msg.isError ? 'var(--danger)' : 'inherit' }}>
              <ReactMarkdown>{msg.content}</ReactMarkdown>

              {msg.sources && msg.sources.length > 0 && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    {isHindi ? 'वैधानिक स्रोत (IndiaCode Verified Sources)' : 'VERIFIED STATUTORY SOURCES (IndiaCode)'}
                  </p>
                  {msg.sources.slice(0, 2).map((src, i) => (
                    <div key={i} style={{ fontSize: '12px', background: 'var(--subtle-bg)', padding: '6px 10px', borderRadius: '6px', marginBottom: '5px', color: 'var(--text-secondary)', border: '1px solid var(--subtle-border)' }}>
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
