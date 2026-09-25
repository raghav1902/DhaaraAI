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

      {/* Input Area */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.7)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', position: 'relative', alignItems: 'center' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isHindi
              ? "सवाल लिखें या माइक दबाएं..."
              : "Type question or tap mic..."}
            className="input-field"
            disabled={isLoading}
            style={{ paddingRight: '88px', height: '46px', fontSize: '14px', width: '100%' }}
          />

          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            disabled={isLoading}
            style={{
              position: 'absolute',
              right: '48px',
              top: '5px',
              bottom: '5px',
              width: '36px',
              border: 'none',
              borderRadius: '8px',
              background: isListening ? '#ef4444' : 'rgba(59, 130, 246, 0.1)',
              color: isListening ? 'white' : 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isListening ? '0 0 10px rgba(239, 68, 68, 0.5)' : 'none'
            }}
            title={isListening ? (isHindi ? 'रिकॉर्डिंग बंद करें' : 'Stop listening') : (isHindi ? 'बोलकर सवाल पूछें (माइक्रोफ़ोन)' : 'Click to speak query')}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !input.trim()}
            style={{
              position: 'absolute',
              right: '5px',
              top: '5px',
              bottom: '5px',
              width: '38px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
}
