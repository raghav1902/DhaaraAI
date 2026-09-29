import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { sanitizeMarkdownForSpeech, getPromptSuggestions } from './LegalChat/speechUtils';
import ChatMessageItem from './LegalChat/ChatMessageItem';
import ChatInputArea from './LegalChat/ChatInputArea';

export default function LegalChat({
  initialQuery = null,
  onQueryConsumed = () => { },
  language = 'English',
  onLanguageChange = () => { }
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

  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !isLoading) {
      handleSendWithText(initialQuery);
      onQueryConsumed();
    }
  }, [initialQuery]);

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
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = isHindi ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) setInput(transcript);
      };
      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setSpeechError(isHindi ? `माइक्रोफ़ोन त्रुटि: ${event.error}` : `Microphone issue: ${event.error}`);
        }
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      console.error('Speech recognition initiation error:', err);
      setIsListening(false);
      setSpeechError(isHindi ? 'माइक्रोफ़ोन शुरू करने में समस्या आई।' : 'Could not access microphone.');
    }
  };

  const handleToggleSpeak = (index, content) => {
    if (!synthRef.current) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingIndex === index) {
      synthRef.current.cancel();
      setSpeakingIndex(null);
      return;
    }

    synthRef.current.cancel();
    setSpeakingIndex(index);

    const cleanText = sanitizeMarkdownForSpeech(content, isHindi);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHindi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

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

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    synthRef.current.speak(utterance);
  };

  const handleSendWithText = async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

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

  const promptSuggestions = getPromptSuggestions(isHindi);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '620px', flex: 1 }}>
      {/* Refined Header */}
      <div style={{
        padding: '16px 20px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '14px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: 'white',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
          }}>
            <Bot size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                {isHindi ? 'विधिक परामर्श सहायक' : 'AI Legal Assistant'}
              </h2>
              <span style={{ fontSize: '11px', background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid var(--primary-border)', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                BNS 2023 Verified
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              {isHindi ? 'प्राथमिक कानूनों, प्रक्रियाओं व केस लॉ पर त्वरित विधिक समाधान' : 'Instant statutory answers under Bharatiya Nyaya Sanhita & Indian Laws'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMessages([{
            role: 'assistant',
            content: isHindi
              ? 'नमस्ते! लीगलजीपीटी में आपका स्वागत है। आप भारतीय कानूनों के बारे में कोई भी सवाल पूछ सकते हैं।'
              : 'Namaste! Welcome to LegalGPT. How can I assist you with Indian law or case procedures today?',
            language
          }])}
          style={{
            background: 'var(--subtle-bg)',
            border: '1px solid var(--card-border)',
            padding: '7px 14px',
            borderRadius: '10px',
            fontSize: '12.5px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: '600',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--card-bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--subtle-bg)'}
          title={isHindi ? "नया चैट शुरू करें" : "Reset Conversation"}
        >
          <RefreshCw size={14} />
          {isHindi ? 'नया चैट' : 'New Chat'}
        </button>
      </div>

      {/* Suggestion Chips */}
      <div style={{ padding: '4px 0 12px', display: 'flex', gap: '8px', overflowX: 'auto', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--primary)', fontWeight: '600', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <Sparkles size={14} /> {isHindi ? 'त्वरित सवाल:' : 'Quick Questions:'}
        </span>
        {promptSuggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleSendWithText(item.query)}
            disabled={isLoading}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '20px',
              padding: '5px 14px',
              fontSize: '12px',
              fontWeight: '500',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.15s ease',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'var(--primary-light)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--card-bg)'; }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div style={{ flex: 1, padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {messages.map((msg, idx) => (
          <ChatMessageItem
            key={idx}
            msg={msg}
            idx={idx}
            speakingIndex={speakingIndex}
            handleToggleSpeak={handleToggleSpeak}
            isHindi={isHindi}
          />
        ))}

        {isLoading && (
          <div style={{ display: 'flex', gap: '14px', alignSelf: 'flex-start', maxWidth: '85%' }}>
            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '50%', height: '38px', width: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <RefreshCw size={18} className="animate-spin" />
            </div>
            <div style={{ background: 'var(--card-bg)', color: 'var(--text-main)', padding: '14px 18px', borderRadius: '16px', borderTopLeftRadius: 0, border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', fontSize: '14px', boxShadow: 'var(--card-shadow)' }}>
              <Loader2 size={16} className="animate-spin" style={{ marginRight: '8px', color: 'var(--primary)' }} />
              {isHindi ? 'कानूनी धाराएं और समाधान तैयार हो रहा है...' : 'Analyzing statutes & formulating quick response...'}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInputArea
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isLoading={isLoading}
        isListening={isListening}
        handleToggleVoiceInput={handleToggleVoiceInput}
        speechError={speechError}
        isHindi={isHindi}
      />
    </div>
  );
}
