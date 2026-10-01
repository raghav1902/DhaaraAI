import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Bot,
  Loader2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Scale,
  FileSearch,
  Landmark,
  ChevronRight,
  Clock3,
  MessageSquare,
  Home,
  CarFront,
  FileQuestion,
  ScrollText,
  BookOpen,
  ChevronDown,
  ExternalLink,
  BookMarked
} from 'lucide-react';
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
        ? 'नमस्ते! लीगलजीपीटी (DhaaraAI) में आपका स्वागत है। मैं आपका AI विधिक सहायक हूँ। आप भारतीय कानूनों (BNS 2023, BNSS 2023, IPC, मोटर वाहन आदि) के बारे में कोई भी प्रश्न पूछ सकते हैं। मैं आपको प्रमाणित धाराओं और वैधानिक प्रक्रियाओं के साथ समाधान प्रदान करूँगा।'
        : 'Namaste! Welcome to LegalGPT (DhaaraAI). I am your AI Legal Intelligence Assistant. Ask any question regarding Indian criminal or civil laws (BNS 2023, BNSS, BSA, Contract Act, Motor Vehicles, etc.). I will provide clear statutory guidance with cited legal provisions.',
      language: language
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Speech-to-Text States
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);

  // Text-to-Speech States
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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
        sources: response.data.sources || [],
        statutory_sources: response.data.statutory_sources || [],
        case_law_sources: response.data.case_law_sources || [],
        language: response.data.language,
        concordance: response.data.concordance || null
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

  // Collect all verified sources across the conversation
  const activeSources = messages
    .filter(m => m.role === 'assistant' && m.sources && m.sources.length > 0)
    .flatMap(m => m.sources);

  const activeStatutes = activeSources
    .filter(s => s.source_type !== 'case_law')
    .slice(-4);

  const activeCaseLaws = activeSources
    .filter(s => s.source_type === 'case_law')
    .slice(-3);

  const promptSuggestions = getPromptSuggestions(isHindi);
  const suggestedQuestions = isHindi ? [
    { icon: CarFront, query: 'बीएनएस के तहत रोड रेज की सजा क्या है?', label: 'रोड रेज एवं मोटर वाहन धाराएं' },
    { icon: FileQuestion, query: 'पुलिस FIR दर्ज न करे तो FIR दर्ज कराने की प्रक्रिया क्या है?', label: 'पुलिस मना करे तो FIR की कानूनी प्रक्रिया' },
    { icon: Home, query: 'किरायेदार के रूप में मेरे क्या अधिकार हैं?', label: 'किरायेदार अधिकार व बेदखली सुरक्षा' },
    { icon: ScrollText, query: 'चेक बाउंस कानून कैसे काम करता है?', label: 'धारा 138 चेक बाउंस नोटिस प्रक्रिया' },
    { icon: ShieldCheck, query: 'पुलिस नोटिस का जवाब कैसे देना चाहिए?', label: 'धारा 35 BNSS नोटिस का जवाब' },
    { icon: Scale, query: 'चोरी के लिए IPC और BNS की तुलना दिखाएं।', label: 'BNS 303 ↔ IPC 379 चोरी तुलना' }
  ] : [
    { icon: CarFront, query: 'What is the punishment for road rage under BNS?', label: 'Road Rage & Rash Driving penalties under BNS' },
    { icon: FileQuestion, query: 'What is the procedure for filing an FIR if police refuse?', label: 'Remedies under Sec 173(3) BNSS if police refuse FIR' },
    { icon: Home, query: 'What are my rights as a tenant against unlawful eviction?', label: 'Tenant rights & eviction legal defense' },
    { icon: ScrollText, query: 'How does cheque bounce law work under Section 138 NI Act?', label: 'Cheque bounce statutory notice procedure' },
    { icon: ShieldCheck, query: 'How should I respond to a police notice under BNSS?', label: 'Procedure for responding to Sec 35 BNSS notice' },
    { icon: Scale, query: 'Show IPC to BNS comparison for theft.', label: 'IPC 379 vs BNS 303 theft concordance' }
  ];

  return (
    <div className="ask-ai animate-fade-in">
      <div className="ask-ai-main-column">
        {/* Authoritative Legal Intelligence Header */}
        <section className="ask-ai-hero" aria-labelledby="ask-ai-title">
          <div className="ask-ai-hero-copy">
            <div className="ask-ai-brand">
              <span className="ask-ai-brand-mark"><Scale size={16} /></span>
              <span>DhaaraAI LegalGPT Workspace</span>
              <span className="ask-ai-bns-badge">BNS 2023 • BNSS 2023 • BSA 2023 Verified</span>
            </div>

            <div className="ask-ai-heading-row">
              <div>
                <h2 id="ask-ai-title">
                  {isHindi ? (
                    <>भारतीय विधिक <em>इंटेलिजेंस वर्कस्पेस</em></>
                  ) : (
                    <>Indian Statutory & Case Law <em>Intelligence Studio</em></>
                  )}
                </h2>
                <p className="ask-ai-description">
                  {isHindi
                    ? 'नवीनतम भारतीय न्याय संहिता (BNS), नागरिक सुरक्षा संहिता (BNSS) व सुप्रीम कोर्ट नज़ीरों पर आधारित सटीक समाधान।'
                    : 'Statutory research, FIR guidance, bail procedures, and cross-statute concordance powered by Indian legal intelligence.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setMessages([{
                  role: 'assistant',
                  content: isHindi
                    ? 'नमस्ते! लीगलजीपीटी में आपका स्वागत है। आप भारतीय कानूनों के बारे में कोई भी प्रश्न पूछ सकते हैं।'
                    : 'Namaste! Welcome to LegalGPT. How can I assist you with Indian law or case procedures today?',
                  language
                }])}
                className="ask-ai-reset"
                title={isHindi ? "नया चैट शुरू करें" : "Reset Conversation"}
                aria-label={isHindi ? 'नई बातचीत शुरू करें' : 'Start a new conversation'}
              >
                <RefreshCw size={13} />
                <span>{isHindi ? 'नया संवाद' : 'New Session'}</span>
              </button>
            </div>

            <div className="ask-ai-feature-row">
              <div className="ask-ai-feature-card feature-blue">
                <span><BookOpen size={16} /></span>
                <div>
                  <b>BNS / BNSS 2023</b>
                  <small>{isHindi ? 'नई विधिक संहिता' : 'New Penal Codes'}</small>
                </div>
              </div>
              <div className="ask-ai-feature-card feature-purple">
                <span><Scale size={16} /></span>
                <div>
                  <b>{isHindi ? 'केस लॉ व मिसालें' : 'Supreme Court Precedents'}</b>
                  <small>{isHindi ? 'अदालती निर्णय' : 'Leading Judgments'}</small>
                </div>
              </div>
              <div className="ask-ai-feature-card feature-green">
                <span><ScrollText size={16} /></span>
                <div>
                  <b>{isHindi ? 'प्रक्रियात्मक उपाय' : 'Statutory Remedies'}</b>
                  <small>{isHindi ? 'चरण-दर-चरण विधिक कदम' : 'Step-by-step guidance'}</small>
                </div>
              </div>
              <div className="ask-ai-feature-card feature-orange">
                <span><ShieldCheck size={16} /></span>
                <div>
                  <b>{isHindi ? 'नागरिक अधिकार' : 'Constitutional Rights'}</b>
                  <small>{isHindi ? 'अनुच्छेद 21 व जमानत' : 'Art. 21 & Bail safeguards'}</small>
                </div>
              </div>
            </div>
          </div>
          <div className="ask-ai-hero-visual" aria-hidden="true">
            <img
              src="/assets/legal/hero/supreme_court_hero.webp"
              alt="Supreme Court of India"
              className="ask-ai-hero-image"
              loading="eager"
            />
            <div className="ask-ai-hero-gradient-overlay" />
          </div>
        </section>

        {/* Suggestion Chips */}
        <section className="ask-ai-prompts" aria-label={isHindi ? 'त्वरित सवाल' : 'Quick questions'}>
          <div className="ask-ai-section-heading">
            <span className="ask-ai-section-icon"><Sparkles size={14} /></span>
            <h3>{isHindi ? 'त्वरित विधिक प्रश्न:' : 'Recommended Queries:'}</h3>
          </div>
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
                  <span className="ask-ai-prompt-icon"><PromptIcon size={14} /></span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Chat Transcript Area */}
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
              <div className="ask-ai-avatar"><Bot size={18} /></div>
              <div className="ask-ai-loading-card">
                <Loader2 size={16} className="ask-ai-send-loading" />
                <span>{isHindi ? 'कानूनी धाराएं व नज़ीरें विश्लेषण कर रहा हूँ...' : 'Retrieving statutory provisions & formulating legal synthesis...'}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* First query suggestions */}
        {messages.length === 1 && !isLoading && (
          <section className="ask-ai-suggested">
            <div className="ask-ai-suggested-heading">
              <h3><span>💡</span> {isHindi ? 'प्रारंभिक उदाहरण विषय:' : 'Explore Legal Scenarios:'}</h3>
            </div>
            <div className="ask-ai-suggested-grid">
              {suggestedQuestions.map(({ icon: QuestionIcon, query, label }) => (
                <button
                  type="button"
                  key={query}
                  className="ask-ai-suggested-card"
                  onClick={() => handleSendWithText(query)}
                  disabled={isLoading}
                >
                  <span><QuestionIcon size={16} /></span>
                  <b>{label}</b>
                  <ChevronRight className="ask-ai-suggested-arrow" size={14} />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Chat Input Dock Area */}
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
        <p className="ask-ai-disclaimer">
          {isHindi
            ? 'सूचना: AI द्वारा तैयार कानूनी उत्तर विधिक मार्गदर्शन हेतु हैं। न्यायालय या पुलिस कार्रवाई से पूर्व अधिकृत अधिवक्ता से परामर्श लें।'
            : 'Statutory Disclaimer: AI legal responses are for informational guidance. Consult a practicing advocate before initiating formal legal proceedings.'}
        </p>
      </div>

      {/* Right Column: Context Rail & Citations Drawer */}
      <aside className="ask-ai-context-rail" aria-label={isHindi ? 'विधिक संदर्भ पैनल' : 'Legal Context Panel'}>
        {/* Verified Statutory Citations card */}
        <section className="ask-ai-rail-card">
          <h3>
            <span className="rail-icon rail-green"><BookMarked size={14} /></span>
            {isHindi ? 'वैधानिक संदर्भ (IndiaCode)' : 'Statutory Provisions'}
          </h3>
          {activeStatutes.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeStatutes.map((src, i) => (
                <div key={i} className="ask-ai-rail-citation">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ color: 'var(--primary)', fontSize: '11px' }}>{src.section || 'Statute'}</b>
                    <span style={{ fontSize: '9px', background: 'rgba(5, 150, 105, 0.1)', color: '#047857', padding: '1px 5px', borderRadius: '4px', fontWeight: '700' }}>STATUTORY</span>
                  </div>
                  <small style={{ color: 'var(--text-secondary)', fontSize: '10.5px', marginTop: '2px', display: 'block' }}>
                    {src.section_title || src.title || 'Official Provision'}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p className="ask-ai-rail-empty">
              {isHindi ? 'सवालों के साथ वैधानिक धाराएं यहाँ सूचीबद्ध होंगी।' : 'Statutory references will populate here during consultation.'}
            </p>
          )}
        </section>

        {/* Supreme Court Case Law Precedents card */}
        <section className="ask-ai-rail-card">
          <h3>
            <span className="rail-icon rail-blue"><Landmark size={14} /></span>
            {isHindi ? 'सर्वोच्च न्यायालय दृष्टांत (Case Law)' : 'Supreme Court Precedents'}
          </h3>
          {activeCaseLaws.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {activeCaseLaws.map((cl, i) => (
                <div key={i} className="ask-ai-rail-citation" style={{ borderLeft: '3px solid #2563eb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '4px' }}>
                    <a
                      href={cl.source_url || 'https://digiscr.sci.gov.in/'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#1d4ed8', fontSize: '11px', fontWeight: '700', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                    >
                      {cl.case_name || 'Supreme Court Case'}
                      <ExternalLink size={10} />
                    </a>
                    <span style={{ fontSize: '8.5px', background: 'rgba(37, 99, 235, 0.1)', color: '#1d4ed8', padding: '1px 4px', borderRadius: '3px', fontWeight: '700' }}>eSCR</span>
                  </div>
                  <small style={{ color: 'var(--text-secondary)', fontSize: '10px', marginTop: '2px', display: 'block' }}>
                    {cl.citation} {cl.judgment_date ? `(${cl.judgment_date})` : ''}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <p className="ask-ai-rail-empty">
              {isHindi ? 'सर्वोच्च न्यायालय के प्रासंगिक फैसले यहाँ दिखेंगे।' : 'Supreme Court judicial precedents will populate here.'}
            </p>
          )}
        </section>

        {/* Statutory Code Quick References */}
        <section className="ask-ai-rail-card">
          <h3>
            <span className="rail-icon rail-blue"><Scale size={14} /></span>
            {isHindi ? 'कानूनी कोड संदर्भ' : 'Statute Concordance'}
          </h3>
          <div className="ask-ai-code-pills">
            <div className="code-pill">
              <b>BNS 2023</b>
              <small>Replaces IPC 1860</small>
            </div>
            <div className="code-pill">
              <b>BNSS 2023</b>
              <small>Replaces CrPC 1973</small>
            </div>
            <div className="code-pill">
              <b>BSA 2023</b>
              <small>Replaces IEA 1872</small>
            </div>
          </div>
        </section>

        {/* Recent queries in session */}
        <section className="ask-ai-rail-card ask-ai-recent-card">
          <h3>
            <span className="rail-icon rail-purple"><Clock3 size={14} /></span>
            {isHindi ? 'संवाद प्रश्न' : 'In This Session'}
          </h3>
          {messages.filter(msg => msg.role === 'user').length ? (
            <div className="ask-ai-recent-list">
              {messages.filter(msg => msg.role === 'user').slice(-4).reverse().map((msg, index) => (
                <div key={`${index}-${msg.content.slice(0, 10)}`} className="ask-ai-recent-item">
                  <MessageSquare size={13} />
                  <span>{msg.content}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="ask-ai-rail-empty">
              {isHindi ? 'आपके सवाल यहाँ दर्ज होंगे।' : 'Your questions will appear here.'}
            </p>
          )}
        </section>
      </aside>
    </div>
  );
}
