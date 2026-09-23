import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, Loader2, RefreshCw, Sparkles, Mic, MicOff, Volume2, VolumeX, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Helper to sanitize markdown for text-to-speech
function sanitizeMarkdownForSpeech(mdText, isHindi) {
  if (!mdText) return '';
  let text = mdText;
  // Remove markdown headings
  text = text.replace(/###+/g, '');
  text = text.replace(/##+/g, '');
  text = text.replace(/#+/g, '');
  // Remove bold / italics
  text = text.replace(/\*\*(.*?)\*\*/g, '$1');
  text = text.replace(/\*(.*?)\*/g, '$1');
  text = text.replace(/__(.*?)__/g, '$1');
  text = text.replace(/_(.*?)_/g, '$1');
  // Remove bullet symbols & blockquotes
  text = text.replace(/^\s*[-*•]\s+/gm, '');
  text = text.replace(/^\s*>\s+/gm, '');
  // Remove horizontal dividers
  text = text.replace(/---/g, '');
  text = text.replace(/===/g, '');
  // Format Indian legal acronyms for smooth pronunciation
  if (isHindi) {
    text = text.replace(/\bBNS\b/g, 'बी एन एस');
    text = text.replace(/\bBNSS\b/g, 'बी एन एस एस');
    text = text.replace(/\bIPC\b/g, 'आई पी सी');
    text = text.replace(/\bFIR\b/g, 'एफ आई आर');
  } else {
    text = text.replace(/\bBNS\b/g, 'B N S');
    text = text.replace(/\bBNSS\b/g, 'B N S S');
    text = text.replace(/\bIPC\b/g, 'I P C');
    text = text.replace(/\bFIR\b/g, 'F I R');
  }
  return text.trim();
}

export default function LegalChat({ 
  initialQuery = null, 
  onQueryConsumed = () => {}, 
  language = 'English', 
  onLanguageChange = () => {} 
}) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: isHindi 
        ? 'नमस्ते! लीगलजीपीटी (DhaaraAI) में आपका स्वागत है। मैं आपका कानूनी सहायक हूँ। आप भारतीय कानूनों (BNS 2023, IPC, BNSS, मोटर वाहन आदि) के बारे में कोई भी सवाल पूछ सकते हैं। मैं आपको तुरंत, सीधा व पूरा समाधान प्रदान करूँगा।'
        : 'Namaste! Welcome to LegalGPT (DhaaraAI). I am your AI Legal Assistant. You can ask me questions about Indian laws, cases, or procedures in simple language. I will provide direct, quick, and complete statutory guidance.',
      language: language
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Speech-to-Text (Voice Input) States
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);

  // Text-to-Speech (Audio Reader) States
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Handle injected query from Legal Library
  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !isLoading) {
      handleSendWithText(initialQuery);
      onQueryConsumed();
    }
  }, [initialQuery]);

  // Voice Input (Speech-to-Text) handler
  const handleToggleVoiceInput = () => {
    setSpeechError(null);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError(isHindi 
        ? 'आपका ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता। कृपया Chrome या Edge का उपयोग करें।' 
        : 'Your browser does not support Web Speech Recognition. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isHindi ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(prev => {
            // If starting fresh or appending
            return transcript;
          });
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setSpeechError(isHindi 
            ? `माइक्रोफ़ोन त्रुटि: ${event.error}` 
            : `Microphone issue: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition initiation error:', err);
      setIsListening(false);
      setSpeechError(isHindi 
        ? 'माइक्रोफ़ोन शुरू करने में समस्या आई।' 
        : 'Could not access microphone.');
    }
  };

  // Text-to-Speech (Audio Reader) handler
  const handleToggleSpeak = (index, content) => {
    if (!synthRef.current) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    // If already speaking this message, stop it
    if (speakingIndex === index) {
      synthRef.current.cancel();
      setSpeakingIndex(null);
      return;
    }

    // Cancel any previous speech
    synthRef.current.cancel();
    setSpeakingIndex(index);

    const cleanText = sanitizeMarkdownForSpeech(content, isHindi);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick best matching voice if available
    const voices = synthRef.current.getVoices();
    if (voices && voices.length > 0) {
      if (isHindi) {
        const hindiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india'));
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const indianEngVoice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'));
        if (indianEngVoice) utterance.voice = indianEngVoice;
      }
    }

    utterance.onend = () => {
      setSpeakingIndex(null);
    };

    utterance.onerror = (e) => {
      console.warn('TTS error:', e);
      setSpeakingIndex(null);
    };

    synthRef.current.speak(utterance);
  };

  const handleSendWithText = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    // Stop speaking if playing
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeakingIndex(null);
    }

    const userMessage = { role: 'user', content: textToSend, language };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:8000/api/query', {
        question: userMessage.content,
        language: userMessage.language,
        user_role: 'general',
        top_k: 5
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources,
        language: response.data.language
      }]);
    } catch (error) {
      console.error('Error fetching legal response:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isHindi 
          ? 'त्रुटि: लीगलजीपीटी बैकएंड सर्वर से कनेक्ट नहीं हो सका। कृपया जांचें कि सर्वर चल रहा है।'
          : 'Error: Cannot connect to LegalGPT backend. Make sure the FastAPI server is running.',
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    handleSendWithText(input);
  };

  const promptSuggestions = isHindi ? [
    { label: '🏍️ बाइक एक्सीडेंट (Rash Driving 281)', query: 'मेरे बाइक का एक्सीडेंट हो गया दूसरी बाइक से, क्या कानून लगेगा और तुरंत क्या करें?' },
    { label: '💳 ऑनलाइन ठगी (Cheating 318(4))', query: 'ऑनलाइन यूपीआई या बैंक फ्रॉड हो गया, धारा 318(4) BNS के तहत पैसे कैसे रुकवाएं?' },
    { label: '📄 चेक बाउंस (NI Act 138)', query: 'चेक बाउंस होने पर 30 दिन का नोटिस कैसे भेजें और क्या सजा होगी?' },
    { label: '👮 पुलिस FIR न लिखे तो?', query: 'अगर पुलिस थाने में FIR दर्ज करने से मना करे तो Zero FIR और मजिस्ट्रेट के पास क्या अधिकार हैं?' }
  ] : [
    { label: '🏍️ Road Accident (BNS 281)', query: 'My bike had an accident with another bike. What case will be filed and what are the immediate steps?' },
    { label: '💳 Online Fraud (BNS 318(4))', query: 'Someone cheated me online through UPI. How to freeze accounts and file FIR under BNS?' },
    { label: '📄 Cheque Bounce (Sec 138)', query: 'What is the procedure for cheque bounce and statutory 30-day notice under NI Act?' },
    { label: '👮 Police Refusal for FIR', query: 'What remedies are available under BNSS if the police officer refuses to register an FIR?' }
  ];

  return (
    <div className="glass-panel animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '620px', flex: 1 }}>
      {/* Header controls */}
      <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '17px' }}>
          <Bot color="var(--primary)" size={20} /> 
          {isHindi ? 'लीगल असिस्टेंट (AI Legal Assistant)' : 'AI Legal Assistant'}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>भाषा / Lang:</span>
          <select 
            value={language} 
            onChange={(e) => onLanguageChange(e.target.value)}
            className="input-field"
            style={{ width: '135px', padding: '6px 10px', fontSize: '13px', height: '36px' }}
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
          </select>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div style={{ padding: '10px 20px', background: 'rgba(255, 255, 255, 0.4)', borderBottom: '1px solid rgba(0,0,0,0.03)', display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--primary)', fontWeight: '600', whiteSpace: 'nowrap' }}>
          <Sparkles size={14} /> {isHindi ? 'त्वरित सवाल:' : 'Quick Questions:'}
        </span>
        {promptSuggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendWithText(item.query)}
            disabled={isLoading}
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '4px 12px',
              fontSize: '12.5px',
              color: 'var(--text-main)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = 'var(--text-main)'; }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            display: 'flex', 
            gap: '14px', 
            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: msg.role === 'user' ? '80%' : '92%'
          }}>
            {msg.role === 'assistant' && (
              <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '50%', height: '38px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                <Bot size={20} />
              </div>
            )}
            
            <div style={{ 
              background: msg.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.95)', 
              color: msg.role === 'user' ? 'white' : 'var(--text-main)',
              padding: '16px 20px', 
              borderRadius: '16px',
              borderTopRightRadius: msg.role === 'user' ? 0 : '16px',
              borderTopLeftRadius: msg.role === 'assistant' ? 0 : '16px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              border: msg.role === 'user' ? 'none' : '1px solid var(--glass-border)',
              position: 'relative'
            }}>
              {msg.role === 'user' ? (
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
        ))}
        
        {isLoading && (
          <div style={{ display: 'flex', gap: '14px', alignSelf: 'flex-start', maxWidth: '85%' }}>
             <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '50%', height: '38px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                <RefreshCw size={18} className="animate-spin" />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.95)', padding: '14px 18px', borderRadius: '16px', borderTopLeftRadius: 0, border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', fontSize: '14px' }}>
                <Loader2 size={16} className="animate-spin" style={{ marginRight: '8px', color: 'var(--primary)' }} /> 
                {isHindi ? 'कानूनी धाराएं और समाधान तैयार हो रहा है...' : 'Analyzing statutes & formulating quick response...'}
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Voice Recognition Live Banner */}
      {isListening && (
        <div style={{ background: '#fee2e2', borderTop: '1px solid #fca5a5', padding: '8px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#b91c1c', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="mic-recording-pulse" />
            <strong>{isHindi ? '🎙️ आवाज़ सुन रहा हूँ... कृपया बोलें' : '🎙️ Listening... Speak your query clearly'}</strong>
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
          ⚠️ {speechError}
        </div>
      )}

      {/* Input Area */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.6)', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', position: 'relative' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isHindi 
              ? "सवाल लिखें या माइक दबाकर बोलें (उदा. ऑनलाइन ठगी हो गई, पैसे कैसे रुकवाएं?)" 
              : "Type or click mic to speak (e.g. Bike accident happened, what are the steps?)"}
            className="input-field"
            disabled={isLoading}
            style={{ paddingRight: '98px', height: '48px', fontSize: '14.5px' }}
          />

          {/* Voice Input Microphone Button */}
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            disabled={isLoading}
            style={{
              position: 'absolute',
              right: '54px',
              top: '6px',
              bottom: '6px',
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
              right: '6px', 
              top: '6px', 
              bottom: '6px', 
              padding: '0 14px', 
              opacity: (isLoading || !input.trim()) ? 0.6 : 1,
              borderRadius: '8px'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
