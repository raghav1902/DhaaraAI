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

      {/* Input Dock Area */}
      <div className="ask-ai-composer-shell">
        <form onSubmit={handleSend} className="ask-ai-composer">
          <span className="ask-ai-composer-sparkle" aria-hidden="true">✦</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isHindi
              ? "अपनी कानूनी समस्या लिखें (जैसे: ऑनलाइन ठगी, किरायेदार विवाद, एक्सीडेंट)..."
              : "Describe legal issue (e.g. online fraud, tenant dispute, accident, FIR refusal)..."}
            disabled={isLoading}
            className="ask-ai-composer-input"
            aria-label={isHindi ? 'अपना कानूनी सवाल लिखें' : 'Type your legal question'}
          />

          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            disabled={isLoading}
            className={`ask-ai-mic-button ${isListening ? 'is-listening' : ''}`}
            aria-label={isListening ? (isHindi ? 'रिकॉर्डिंग बंद करें' : 'Stop listening') : (isHindi ? 'बोलकर सवाल पूछें' : 'Ask using microphone')}
            title={isListening ? (isHindi ? 'रिकॉर्डिंग बंद करें' : 'Stop listening') : (isHindi ? 'बोलकर सवाल पूछें (माइक्रोफ़ोन)' : 'Click to speak query')}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
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
