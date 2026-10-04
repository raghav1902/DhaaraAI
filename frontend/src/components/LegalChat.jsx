import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  BookMarked,
  Plus
} from 'lucide-react';
import { sanitizeMarkdownForSpeech, getPromptSuggestions } from './LegalChat/speechUtils';
import ChatMessageItem from './LegalChat/ChatMessageItem';
import ChatInputArea from './LegalChat/ChatInputArea';
import ChatHistorySidebar from './LegalChat/ChatHistorySidebar';
import './LegalChat/LegalChat.css';

export default function LegalChat({
  initialQuery = null,
  onQueryConsumed = () => { },
  language = 'English',
  onLanguageChange = () => { },
  user = null
}) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  // Helper for auth headers
  const getAuthHeaders = useCallback(() => {
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    }
    return {};
  }, [user]);

  // Initial welcome message
  const getWelcomeMessage = useCallback(() => ({
    role: 'assistant',
    content: isHindi
      ? 'नमस्ते! लीगलजीपीटी (DhaaraAI) में आपका स्वागत है। मैं आपका AI विधिक सहायक हूँ। आप भारतीय कानूनों (BNS 2023, BNSS 2023, IPC, मोटर वाहन आदि) के बारे में कोई भी प्रश्न पूछ सकते हैं। मैं आपको प्रमाणित धाराओं और वैधानिक प्रक्रियाओं के साथ समाधान प्रदान करूँगा।'
      : 'Namaste! Welcome to LegalGPT (DhaaraAI). I am your AI Legal Intelligence Assistant. Ask any question regarding Indian criminal or civil laws (BNS 2023, BNSS, BSA, Contract Act, Motor Vehicles, etc.). I will provide clear statutory guidance with cited legal provisions.',
    language: language
  }), [isHindi, language]);

  // Conversation states
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [messages, setMessages] = useState([getWelcomeMessage()]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch conversations list for authenticated user
  const fetchConversations = useCallback(async () => {
    if (!user || !user.token) return;
    setIsLoadingList(true);
    try {
      const res = await axios.get('http://localhost:8000/api/conversations', {
        headers: getAuthHeaders()
      });
      setConversations(res.data || []);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoadingList(false);
    }
  }, [user, getAuthHeaders]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle Search in conversations
  useEffect(() => {
    if (!user || !user.token) return;
    const timer = setTimeout(async () => {
      if (!searchQuery.trim()) {
        fetchConversations();
        return;
      }
      try {
        setIsLoadingList(true);
        const res = await axios.get(`http://localhost:8000/api/conversations/search?q=${encodeURIComponent(searchQuery)}`, {
          headers: getAuthHeaders()
        });
        setConversations(res.data || []);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsLoadingList(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, user, getAuthHeaders, fetchConversations]);

  // Select and load a conversation (Strict User Isolation)
  const handleSelectConversation = async (convId) => {
    if (convId === activeConversationId || isLoading) return;
    setActiveConversationId(convId);
    setIsLoading(true);

    try {
      const res = await axios.get(`http://localhost:8000/api/conversations/${convId}`, {
        headers: getAuthHeaders()
      });

      if (res.data && res.data.messages && res.data.messages.length > 0) {
        setMessages(res.data.messages.map(m => ({
          role: m.role,
          content: m.content,
          sources: m.sources || [],
          language: language,
          concordance: m.metadata?.concordance || null
        })));
      } else {
        setMessages([getWelcomeMessage()]);
      }
    } catch (err) {
      console.error('Error fetching conversation:', err);
      setMessages([
        getWelcomeMessage(),
        {
          role: 'assistant',
          content: isHindi
            ? 'त्रुटि: बातचीत लोड करने में असमर्थ। कृपया पुनः प्रयास करें।'
            : 'Error: Unable to load this conversation. Please try again.',
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a clean New Chat
  const handleNewChat = () => {
    setActiveConversationId(null);
    setMessages([getWelcomeMessage()]);
    setInput('');
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeakingIndex(null);
    }
    // Refresh conversation list to ensure previously saved chats are up to date
    fetchConversations();
  };

  // Rename a conversation
  const handleRenameConversation = async (convId, newTitle) => {
    try {
      await axios.patch(`http://localhost:8000/api/conversations/${convId}`, {
        title: newTitle
      }, {
        headers: getAuthHeaders()
      });
      setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: newTitle } : c));
    } catch (err) {
      console.error('Failed to rename conversation:', err);
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (convId) => {
    try {
      await axios.delete(`http://localhost:8000/api/conversations/${convId}`, {
        headers: getAuthHeaders()
      });
      setConversations(prev => prev.filter(c => c.id !== convId));
      if (activeConversationId === convId) {
        handleNewChat();
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

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
        top_k: 5,
        conversation_id: activeConversationId
      }, {
        headers: getAuthHeaders()
      });

      // Update activeConversationId if this query created a new one
      const returnedConvId = response.data.conversation_id;
      if (returnedConvId) {
        if (returnedConvId !== activeConversationId) {
          setActiveConversationId(returnedConvId);
        }
        // Always refresh conversation titles and timestamps in the sidebar
        fetchConversations();
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources || [],
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
    .flatMap(m => m.sources)
    .slice(-4);

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
        {/* Dynamic Header: Active Consultation Bar when chat active, or Full Studio Hero on empty state */}
        {messages.length > 1 ? (
          <div className="ask-ai-active-session-bar">
            <div className="ask-ai-session-left">
              <span className="ask-ai-pulse-dot" />
              <div className="ask-ai-session-info">
                <span className="ask-ai-session-title">
                  {conversations.find(c => c.id === activeConversationId)?.title || (isHindi ? 'सक्रिय विधिक परामर्श सत्र' : 'Active Legal Intelligence Consultation')}
                </span>
              </div>
            </div>
            <div className="ask-ai-session-actions">
              <button
                type="button"
                onClick={handleNewChat}
                className="ask-ai-new-session-btn"
                title={isHindi ? 'नया विधिक सत्र शुरू करें' : 'Start New Legal Consultation'}
              >
                <Plus size={14} />
                <span>{isHindi ? 'नया परामर्श' : 'New Consultation'}</span>
              </button>
            </div>
          </div>
        ) : (
          <section className="ask-ai-hero" aria-labelledby="ask-ai-title">
            <div className="ask-ai-hero-copy">
              <div className="ask-ai-brand">
                <span className="ask-ai-brand-mark"><Scale size={16} /></span>
                <span>DhaaraAI LegalGPT Workspace</span>
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
              </div>

              <div className="ask-ai-feature-row">
                <div className="ask-ai-feature-card feature-blue">
                  <span><BookOpen size={15} /></span>
                  <div>
                    <b>{isHindi ? 'विधिक संहिता' : 'Statutory Codes'}</b>
                    <small>{isHindi ? 'अपराधिक व दीवानी कानून' : 'Penal & Civil Laws'}</small>
                  </div>
                </div>
                <div className="ask-ai-feature-card feature-purple">
                  <span><Scale size={15} /></span>
                  <div>
                    <b>{isHindi ? 'केस लॉ व नज़ीरें' : 'Supreme Court Precedents'}</b>
                    <small>{isHindi ? 'अदालती निर्णय' : 'Leading Judgments'}</small>
                  </div>
                </div>
                <div className="ask-ai-feature-card feature-green">
                  <span><ScrollText size={15} /></span>
                  <div>
                    <b>{isHindi ? 'प्रक्रियात्मक उपाय' : 'Statutory Remedies'}</b>
                    <small>{isHindi ? 'चरण-दर-चरण विधिक कदम' : 'Step-by-step guidance'}</small>
                  </div>
                </div>
                <div className="ask-ai-feature-card feature-orange">
                  <span><ShieldCheck size={15} /></span>
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
        )}

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

          {/* Prompt scenario exploration inside transcript when conversation starts */}
          {messages.length === 1 && !isLoading && (
            <section className="ask-ai-suggested animate-fade-in">
              <div className="ask-ai-suggested-heading">
                <h3><span>💡</span> {isHindi ? 'त्वरित विधिक परिदृश्य (अनुशंसित प्रश्न):' : 'Explore Legal Scenarios (Recommended Inquiries):'}</h3>
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
                    <span className="ask-ai-suggested-icon"><QuestionIcon size={16} /></span>
                    <b className="ask-ai-suggested-label">{label}</b>
                    <ChevronRight className="ask-ai-suggested-arrow" size={14} />
                  </button>
                ))}
              </div>
            </section>
          )}

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

      {/* Right Column: Dedicated Permanent Chat History Panel (Strict User Isolated) */}
      <ChatHistorySidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isLoadingList={isLoadingList}
        isHindi={isHindi}
      />
    </div>
  );
}
