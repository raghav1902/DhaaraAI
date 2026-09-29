import React from 'react';
import { Send, Mic, MicOff } from 'lucide-react';

export default function ChatInputArea({
  input,
  setInput,
  handleSend,
  isLoading,
  isListening,
  handleToggleVoiceInput,
  speechError,
  isHindi
}) {
  return (
    <>
      {/* Voice Recognition Live Banner */}
      {isListening && (
        <div style={{ background: '#fee2e2', borderTop: '1px solid #fca5a5', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#b91c1c', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="mic-recording-pulse" />
            <strong>{isHindi ? 'आवाज़ सुन रहा हूँ... कृपया बोलें' : 'Listening... Speak your query clearly'}</strong>
            <span style={{ fontSize: '11.5px', color: '#991b1b' }}>({isHindi ? 'हिंदी इनपुट' : 'English Input'})</span>
          </div>
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', padding: '2px 10px', fontSize: '11px', cursor: 'pointer' }}
          >
            {isHindi ? 'रोकें' : 'Stop'}
          </button>
        </div>
      )}

      {speechError && (
        <div style={{ background: '#fffbeb', borderTop: '1px solid #fef3c7', padding: '6px 20px', color: '#b45309', fontSize: '12px' }}>
          {speechError}
        </div>
      )}

      {/* Input Dock Area */}
      <div style={{
        padding: '8px 10px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        boxShadow: 'var(--card-shadow)',
        position: 'relative'
      }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', position: 'relative', alignItems: 'center' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isHindi
              ? "अपनी कानूनी समस्या लिखें (जैसे: ऑनलाइन ठगी, किरायेदार विवाद, एक्सीडेंट)..."
              : "Describe legal issue (e.g. online fraud, tenant dispute, accident, FIR refusal)..."}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 96px 14px 18px',
              fontSize: '14px',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              background: 'var(--subtle-bg)',
              color: 'var(--text-main)',
              outline: 'none',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit'
            }}
            onFocus={e => {
              e.currentTarget.style.background = 'var(--card-bg)';
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 0 0 3px var(--primary-light)';
            }}
            onBlur={e => {
              e.currentTarget.style.background = 'var(--subtle-bg)';
              e.currentTarget.style.borderColor = 'var(--card-border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />

          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            disabled={isLoading}
            style={{
              position: 'absolute',
              right: '50px',
              top: '7px',
              bottom: '7px',
              width: '38px',
              border: 'none',
              borderRadius: '10px',
              background: isListening ? 'var(--danger)' : 'var(--card-bg)',
              color: isListening ? 'white' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isListening ? '0 0 12px rgba(239, 68, 68, 0.6)' : 'none'
            }}
            onMouseEnter={e => {
              if (!isListening) e.currentTarget.style.background = 'var(--primary-light)';
            }}
            onMouseLeave={e => {
              if (!isListening) e.currentTarget.style.background = 'var(--card-bg)';
            }}
            title={isListening ? (isHindi ? 'रिकॉर्डिंग बंद करें' : 'Stop listening') : (isHindi ? 'बोलकर सवाल पूछें (माइक्रोफ़ोन)' : 'Click to speak query')}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              position: 'absolute',
              right: '6px',
              top: '6px',
              bottom: '6px',
              width: '40px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '10px',
              border: 'none',
              background: input.trim() ? 'var(--primary)' : 'var(--subtle-border)',
              color: input.trim() ? '#ffffff' : 'var(--text-muted)',
              cursor: input.trim() && !isLoading ? 'pointer' : 'default',
              boxShadow: input.trim() ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
}
