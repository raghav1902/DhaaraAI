import React from 'react';
import { Bot, Volume2, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ChatMessageItem({ msg, idx, speakingIndex, handleToggleSpeak, isHindi }) {
  const isUser = msg.role === 'user';

  return (
    <div style={{
      display: 'flex',
      gap: '14px',
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      maxWidth: isUser ? '80%' : '92%'
    }}>
      {!isUser && (
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '50%', height: '38px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
          <Bot size={20} />
        </div>
      )}

      <div style={{
        background: isUser ? 'var(--primary)' : 'rgba(255,255,255,0.95)',
        color: isUser ? 'white' : 'var(--text-main)',
        padding: '16px 20px',
        borderRadius: '16px',
        borderTopRightRadius: isUser ? 0 : '16px',
        borderTopLeftRadius: !isUser ? 0 : '16px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
        border: isUser ? 'none' : '1px solid var(--glass-border)',
        position: 'relative'
      }}>
        {isUser ? (
          <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5' }}>{msg.content}</p>
        ) : (
          <div>
            {/* Audio Reader Control Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--primary)' }}>
                LegalGPT AI
              </span>

              <button
                type="button"
                onClick={() => handleToggleSpeak(idx, msg.content)}
                style={{
                  background: speakingIndex === idx ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.08)',
                  color: speakingIndex === idx ? '#dc2626' : 'var(--primary)',
                  border: speakingIndex === idx ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(59, 130, 246, 0.2)',
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
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '6px', letterSpacing: '0.5px' }}>
                    {isHindi ? 'वैधानिक स्रोत (IndiaCode Verified Sources)' : 'VERIFIED STATUTORY SOURCES (IndiaCode)'}
                  </p>
                  {msg.sources.slice(0, 2).map((src, i) => (
                    <div key={i} style={{ fontSize: '12px', background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', marginBottom: '5px', color: '#4b5563', border: '1px solid #f1f5f9' }}>
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
