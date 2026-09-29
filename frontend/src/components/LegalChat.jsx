import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Bot, Loader2, RefreshCw, Sparkles, ShieldCheck, Scale, FileSearch, Landmark, MessageCircleQuestion, ChevronRight, Clock3, MessageSquare, Home, CarFront, FileQuestion, ScrollText, BookOpen, ChevronDown } from 'lucide-react';
import { sanitizeMarkdownForSpeech, getPromptSuggestions } from './LegalChat/speechUtils';
import ChatMessageItem from './LegalChat/ChatMessageItem';
import ChatInputArea from './LegalChat/ChatInputArea';
import './LegalChat/LegalChat.css';

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
  const suggestedQuestions = isHindi ? [
    { icon: CarFront, query: 'बीएनएस के तहत रोड रेज की सजा क्या है?', label: 'बीएनएस के तहत रोड रेज की सजा क्या है?' },
    { icon: FileQuestion, query: 'पुलिस FIR दर्ज न करे तो FIR दर्ज कराने की प्रक्रिया क्या है?', label: 'पुलिस मना करे तो FIR दर्ज कराने की प्रक्रिया?' },
    { icon: Home, query: 'किरायेदार के रूप में मेरे क्या अधिकार हैं?', label: 'किरायेदार के रूप में मेरे क्या अधिकार हैं?' },
    { icon: ScrollText, query: 'चेक बाउंस कानून कैसे काम करता है?', label: 'चेक बाउंस कानून कैसे काम करता है?' },
    { icon: ShieldCheck, query: 'पुलिस नोटिस का जवाब कैसे देना चाहिए?', label: 'पुलिस नोटिस का जवाब कैसे दें?' },
    { icon: Scale, query: 'चोरी के लिए IPC और BNS की तुलना दिखाएं।', label: 'चोरी के लिए IPC और BNS की तुलना दिखाएं' }
  ] : [
    { icon: CarFront, query: 'What is the punishment for road rage under BNS?', label: 'What is the punishment for road rage under BNS?' },
    { icon: FileQuestion, query: 'What is the procedure for filing an FIR if police refuse?', label: 'Procedure for filing an FIR if police refuse?' },
    { icon: Home, query: 'What are my rights as a tenant?', label: 'What are my rights as a tenant?' },
    { icon: ScrollText, query: 'How does cheque bounce law work under Section 138?', label: 'How does cheque bounce law work?' },
    { icon: ShieldCheck, query: 'How should I respond to a police notice?', label: 'How should I respond to a police notice?' },
    { icon: Scale, query: 'Show IPC to BNS comparison for theft.', label: 'Show IPC to BNS comparison for theft' }
  ];

  return (
    <div className="ask-ai animate-fade-in">
      <div className="ask-ai-main-column">
      {/* Refined Header */}
      <section className="ask-ai-hero" aria-labelledby="ask-ai-title">
        <div className="ask-ai-hero-copy">
          <div className="ask-ai-brand"><span className="ask-ai-brand-mark"><Scale size={17} /></span><span>LegalGPT AI</span><span className="ask-ai-bns-badge">BNS 2023 Verified</span></div>
          <div className="ask-ai-heading-row">
            <div>
              <h2 id="ask-ai-title">{isHindi ? <>आपका AI विधिक सहायक<br />एक <em>जागरूक भारत</em> के लिए</> : <>Your AI Legal Assistant<br />for a More <em>Informed India</em></>}</h2>
              <p className="ask-ai-description">{isHindi ? 'भारतीय कानूनों और प्रक्रियाओं पर सरल भाषा में स्पष्ट उत्तर पाएं।' : 'Get clear, cited answers from Indian laws, cases, and legal procedures.'}</p>
            </div>
            <div className="ask-ai-hero-scene" aria-hidden="true"><span className="ask-ai-scene-sun" /><span className="ask-ai-scene-dome"><Scale size={24} /></span><span className="ask-ai-scene-pill" /><span className="ask-ai-scene-ground" /></div>
          </div>
          <div className="ask-ai-feature-row">
            <div className="ask-ai-feature-card feature-green"><span><BookOpen size={18} /></span><div><b>BNS / BNSS</b><small>{isHindi ? 'नवीनतम अपडेट' : 'Latest updates'}</small></div></div>
            <div className="ask-ai-feature-card feature-blue"><span><Scale size={18} /></span><div><b>{isHindi ? 'केस लॉ' : 'Case Law'}</b><small>{isHindi ? 'निर्णय और मिसालें' : 'Judgments & precedents'}</small></div></div>
            <div className="ask-ai-feature-card feature-purple"><span><ScrollText size={18} /></span><div><b>{isHindi ? 'प्रक्रियाएं' : 'Procedures'}</b><small>{isHindi ? 'चरण-दर-चरण मार्गदर्शन' : 'Step-by-step guidance'}</small></div></div>
            <div className="ask-ai-feature-card feature-orange"><span><ShieldCheck size={18} /></span><div><b>{isHindi ? 'आपके अधिकार' : 'Your Rights'}</b><small>{isHindi ? 'सरल नागरिक उत्तर' : 'Citizen-friendly answers'}</small></div></div>
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
          className="ask-ai-reset"
          title={isHindi ? "नया चैट शुरू करें" : "Reset Conversation"}
          aria-label={isHindi ? 'नई बातचीत शुरू करें' : 'Start a new conversation'}
        >
          <RefreshCw size={14} />
          {isHindi ? 'नया चैट' : 'New Chat'}
        </button>
      </section>

      {/* Suggestion Chips */}
      <section className="ask-ai-prompts" aria-label={isHindi ? 'त्वरित सवाल' : 'Quick questions'}>
        <div className="ask-ai-section-heading"><span className="ask-ai-section-icon"><Sparkles size={16} /></span><h3>{isHindi ? 'त्वरित सवाल:' : 'Quick Questions:'}</h3></div>
        <div className="ask-ai-prompt-list">
        {promptSuggestions.map((item, idx) => {
          const PromptIcon = [Landmark, ShieldCheck, FileSearch, Scale][idx % 4];
          return (
          <button
            className="ask-ai-prompt-chip"
            key={idx}
            onClick={() => handleSendWithText(item.query)}
            disabled={isLoading}
          >
            <span className="ask-ai-prompt-icon"><PromptIcon size={15} /></span>
            {item.label}
          </button>
          );
        })}
        <button className="ask-ai-scroll-next" type="button" aria-label={isHindi ? 'और सवाल' : 'More questions'}><ChevronRight size={17} /></button>
        </div>
      </section>

      {/* Chat Area */}
      <div className="ask-ai-transcript" aria-live="polite">
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
          <div className="ask-ai-loading-row">
            <div className="ask-ai-avatar"><Bot size={19} /></div>
            <div className="ask-ai-loading-card">
              <Loader2 size={16} />
              {isHindi ? 'कानूनी धाराएं और समाधान तैयार हो रहा है...' : 'Analyzing statutes & formulating quick response...'}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length === 1 && !isLoading && <section className="ask-ai-suggested"><div className="ask-ai-suggested-heading"><h3><span>💡</span> {isHindi ? 'ऐसे सवाल पूछकर देखें:' : 'Try asking something like:'}</h3><span className="ask-ai-view-prompts">{isHindi ? 'सुझाव' : 'Suggestions'} <ChevronRight size={14} /></span></div><div className="ask-ai-suggested-grid">{suggestedQuestions.map(({ icon: QuestionIcon, query, label }) => <button type="button" key={query} className="ask-ai-suggested-card" onClick={() => handleSendWithText(query)} disabled={isLoading}><span><QuestionIcon size={17} /></span><b>{label}</b><ChevronRight className="ask-ai-suggested-arrow" size={16} /></button>)}</div></section>}

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
      {messages.length === 1 && !isLoading && <p className="ask-ai-disclaimer">{isHindi ? 'AI द्वारा तैयार उत्तरों को महत्वपूर्ण निर्णयों से पहले मूल स्रोतों से सत्यापित करें।' : 'Verify AI-generated answers against primary sources before making important decisions.'}</p>}
      </div>
      <aside className="ask-ai-context-rail" aria-label={isHindi ? 'सहायक पैनल' : 'Ask AI contextual panel'}>
        <section className="ask-ai-rail-card ask-ai-settings-card"><h3><span className="rail-icon rail-blue"><Sparkles size={16} /></span>{isHindi ? 'उत्तर प्राथमिकताएं' : 'Response preferences'}</h3><div className="ask-ai-setting-item"><div><b>{isHindi ? 'स्रोत दिखाएं' : 'Show law citations'}</b><small>{isHindi ? 'स्रोत सर्वर से प्राप्त होने पर दिखेंगे' : 'Citations appear when returned by the server'}</small></div><span className="ask-ai-static-switch" aria-label={isHindi ? 'स्रोत दिखाए जाते हैं' : 'Citations are displayed'}><i /></span></div><div className="ask-ai-setting-item"><div><b>{isHindi ? 'उत्तर भाषा' : 'Answer language'}</b><small>{isHindi ? 'शीर्ष बार से भाषा बदलें' : 'Change language from the top bar'}</small></div><span className="ask-ai-current-language">{isHindi ? 'हिंदी' : 'English'} <ChevronDown size={14} /></span></div><div className="ask-ai-setting-item"><div><b>{isHindi ? 'उत्तर शैली' : 'Response style'}</b><small>{isHindi ? 'सरल भाषा में स्पष्ट उत्तर' : 'Clear answers in plain language'}</small></div></div><div className="ask-ai-style-pills"><span className="selected">{isHindi ? 'सरल' : 'Simple'}</span><span>{isHindi ? 'विस्तृत' : 'Detailed'}</span><span>{isHindi ? 'उदाहरण' : 'Examples'}</span></div></section>
        <section className="ask-ai-rail-card ask-ai-recent-card"><h3><span className="rail-icon rail-blue"><Clock3 size={16} /></span>{isHindi ? 'इस चैट में सवाल' : 'In this conversation'}</h3>{messages.filter(msg => msg.role === 'user').length ? <div className="ask-ai-recent-list">{messages.filter(msg => msg.role === 'user').slice(-5).reverse().map((msg, index) => <div key={`${index}-${msg.content}`} className="ask-ai-recent-item"><MessageSquare size={14} /><span>{msg.content}</span></div>)}</div> : <p className="ask-ai-rail-empty">{isHindi ? 'आपके सवाल यहां दिखाई देंगे।' : 'Your questions will appear here as you chat.'}</p>}</section>
        <section className="ask-ai-rail-card ask-ai-tips-card"><h3><span className="rail-icon rail-warm">💡</span>{isHindi ? 'सहायता और सुझाव' : 'Help & tips'}</h3><div className="ask-ai-tip"><span className="rail-icon rail-blue"><MessageCircleQuestion size={15} /></span><div><b>{isHindi ? 'सरल भाषा में पूछें' : 'Ask in simple language'}</b><small>{isHindi ? 'अपने शब्दों में सवाल लिखें' : 'Use your own words, no legal jargon needed'}</small></div></div><div className="ask-ai-tip"><span className="rail-icon rail-green"><ScrollText size={15} /></span><div><b>{isHindi ? 'चरण-दर-चरण मार्गदर्शन' : 'Get step-by-step guidance'}</b><small>{isHindi ? 'प्रक्रियाओं के बारे में पूछें' : 'Ask about legal procedures'}</small></div></div><div className="ask-ai-tip"><span className="rail-icon rail-purple"><Scale size={15} /></span><div><b>{isHindi ? 'स्रोतों सहित उत्तर' : 'Answers with sources'}</b><small>{isHindi ? 'प्राप्त वैधानिक संदर्भ देखें' : 'Review statutory references when provided'}</small></div></div></section>
      </aside>
    </div>
  );
}
