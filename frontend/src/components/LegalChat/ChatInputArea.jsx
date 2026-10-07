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
  isHindi,
  isQuotaExhausted = false,
  onOpenUpgrade = null
}) {
  return (
    <>
      {/* Voice Recognition Live Banner */}
      {isListening && (
        <div className="ask-ai-speech-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="mic-recording-pulse" />
            <strong>{isHindi ? 'आवाज़ सुन रहा हूँ... कृपया बोलें' : 'Listening... Speak your query clearly'}</strong>
            <span style={{ fontSize: '11.5px', color: '#991b1b' }}>({isHindi ? 'हिंदी इनपुट' : 'English Input'})</span>
          </div>
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className="ask-ai-stop-listening"
          >
            {isHindi ? 'रोकें' : 'Stop'}
          </button>
        </div>
      )}

      {speechError && (
        <div className="ask-ai-speech-error" role="status">
          {speechError}
        </div>
      )}

      {/* Quota Exhausted Notice Banner */}
      {isQuotaExhausted && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          padding: '10px 16px',
          marginBottom: '8px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.08))',
          border: '1px solid rgba(239,68,68,0.3)',
          color: '#fca5a5',
          fontSize: '12.5px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '15px' }}>🔒</span>
            <span>
              {isHindi
                ? 'दैनिक 7 AI चैट सीमा पूरी हो चुकी है। नया सत्र शुरू करने पर भी यह कोटा रीसेट नहीं होता।'
                : 'Daily free limit of 7 AI chats reached. Starting a new chat does not reset your daily quota.'}
            </span>
          </div>
          <button
            type="button"
            onClick={onOpenUpgrade}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              fontWeight: 700,
              fontSize: '12px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(245,158,11,0.3)'
            }}
          >
            {isHindi ? 'Plus में अपग्रेड करें (असीमित)' : 'Upgrade to Plus (Unlimited)'}
          </button>
        </div>
      )}

      {/* Input Dock Area */}
      <div className="ask-ai-composer-shell">
        <form onSubmit={handleSend} className="ask-ai-composer">
          <span className="ask-ai-composer-sparkle" aria-hidden="true">✦</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isQuotaExhausted
                ? (isHindi ? 'दैनिक 7 चैट सीमा समाप्त — असीमित उपयोग हेतु अपग्रेड करें' : 'Daily 7 chat limit reached — Upgrade for unlimited chats')
                : (isHindi
                  ? "अपनी कानूनी समस्या लिखें (जैसे: ऑनलाइन ठगी, किरायेदार विवाद, एक्सीडेंट)..."
                  : "Describe legal issue (e.g. online fraud, tenant dispute, accident, FIR refusal)...")
            }
            disabled={isLoading || isQuotaExhausted}
            className="ask-ai-composer-input"
            aria-label={isHindi ? 'अपना कानूनी सवाल लिखें' : 'Type your legal question'}
          />

          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            disabled={isLoading || isQuotaExhausted}
            className={`ask-ai-mic-button ${isListening ? 'is-listening' : ''}`}
            aria-label={isListening ? (isHindi ? 'रिकॉर्डिंग बंद करें' : 'Stop listening') : (isHindi ? 'बोलकर सवाल पूछें' : 'Ask using microphone')}
            title={isListening ? (isHindi ? 'रिकॉर्डिंग बंद करें' : 'Stop listening') : (isHindi ? 'बोलकर सवाल पूछें (माइक्रोफ़ोन)' : 'Click to speak query')}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim() || isQuotaExhausted}
            className="ask-ai-send-button"
            aria-label={isHindi ? 'सवाल भेजें' : 'Send question'}
          >
            {isLoading ? <span className="ask-ai-send-loading" /> : <Send size={16} />}
          </button>
        </form>
        <div className="ask-ai-composer-hint">{isHindi ? 'Enter दबाकर भेजें' : 'Press Enter to send'} <span>·</span> {isHindi ? 'माइक्रोफ़ोन से बोलें' : 'Use the mic to dictate'}</div>
      </div>
    </>
  );
}
