import React, { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bot, Loader2 } from 'lucide-react';
import ChatMessageItem from './LegalChat/ChatMessageItem';
import ChatInputArea from './LegalChat/ChatInputArea';
import ChatHistorySidebar from './LegalChat/ChatHistorySidebar';
import ChatHeroBanner from './LegalChat/ChatHeroBanner';
import ChatSuggestedPrompts from './LegalChat/ChatSuggestedPrompts';
import { useSpeechService } from './LegalChat/useSpeechService';
import { API_BASE } from '../config/apiConfig';
import './LegalChat/LegalChat.css';

export default function LegalChat({
  initialQuery = null,
  onQueryConsumed = () => { },
  language = 'English',
  onLanguageChange = () => { },
  user = null,
  onNavigateTab = () => { },
  onOpenUpgradeModal = null
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

  const [messages, setMessages] = useState([getWelcomeMessage()]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Daily AI Chat Quota tracking
  const [dailyUsage, setDailyUsage] = useState(null);
  const isPro = user?.plan === 'plus' || user?.plan === 'pro' || user?.plan === 'enterprise';
  const chatLimit = 7;
  const chatUsed = dailyUsage?.features?.ai_chat?.used ?? 0;
  const chatRemaining = isPro ? 9999 : (dailyUsage?.features?.ai_chat?.remaining ?? Math.max(0, chatLimit - chatUsed));
  const isQuotaExhausted = !isPro && dailyUsage !== null && chatRemaining <= 0;

  // Speech integration hook
  const {
    isListening,
    speechError,
    speakingIndex,
    handleToggleVoiceInput,
    handleToggleSpeak,
    cancelSpeech
  } = useSpeechService(isHindi);

  const fetchUsage = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/user/usage`, {
        headers: getAuthHeaders()
      });
      if (res.data) {
        setDailyUsage(res.data);
      }
    } catch (err) {
      // Ignore background usage fetch error
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage, user?.plan]);

  // Fetch conversations list for authenticated user
  const fetchConversations = useCallback(async () => {
    if (!user || !user.token) return;
    setIsLoadingList(true);
    try {
      const res = await axios.get(`${API_BASE}/api/conversations`, {
        headers: getAuthHeaders()
      });
      if (res.data && res.data.conversations) {
        setConversations(res.data.conversations);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setIsLoadingList(false);
    }
  }, [user, getAuthHeaders]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load an existing conversation by ID
  const handleSelectConversation = async (convId) => {
    if (activeConversationId === convId) return;
    cancelSpeech();
    setActiveConversationId(convId);
    setIsLoading(true);

    try {
      const res = await axios.get(`${API_BASE}/api/conversations/${convId}`, {
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
    cancelSpeech();
    fetchConversations();
  };

  // Rename a conversation
  const handleRenameConversation = async (convId, newTitle) => {
    try {
      await axios.patch(`${API_BASE}/api/conversations/${convId}`, {
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
      await axios.delete(`${API_BASE}/api/conversations/${convId}`, {
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendWithText = useCallback(async (textToSend) => {
    if (!textToSend.trim() || isLoading) return;

    cancelSpeech();

    const userMessage = { id: `msg_u_${Date.now()}_${Math.random()}`, role: 'user', content: textToSend, language };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/api/query`, {
        question: userMessage.content,
        language: userMessage.language,
        user_role: 'general',
        top_k: 5,
        conversation_id: activeConversationId
      }, {
        headers: getAuthHeaders()
      });

      const returnedConvId = response.data.conversation_id;
      if (returnedConvId) {
        if (returnedConvId !== activeConversationId) {
          setActiveConversationId(returnedConvId);
        }
        fetchConversations();
      }

      setMessages(prev => [...prev, {
        id: `msg_a_${Date.now()}_${Math.random()}`,
        role: 'assistant',
        content: response.data.answer,
        sources: response.data.sources || [],
        language: response.data.language,
        concordance: response.data.concordance || null
      }]);
      fetchUsage();
    } catch (error) {
      console.error('Error fetching legal response:', error);
      if (error.response?.status === 403) {
        fetchUsage();
        const msg = error.response?.data?.detail?.message ||
          (isHindi
            ? 'निःशुल्क दैनिक सीमा (7 चैट्स/दिन) समाप्त हो गई है। असीमित AI विधिक परामर्श के लिए Plus में अपग्रेड करें।'
            : 'Daily free limit of 7 AI chats reached. Upgrade to DhaaraAI Plus for unlimited legal queries.');
        setMessages(prev => [...prev, {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: msg,
          isError: true
        }]);
        if (onOpenUpgradeModal) {
          onOpenUpgradeModal('AI Legal Chat (Ask AI)', msg);
        } else if (onNavigateTab) {
          onNavigateTab('settings');
        }
      } else {
        setMessages(prev => [...prev, {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: isHindi
            ? 'त्रुटि: लीगलजीपीटी बैकएंड सर्वर से कनेक्ट नहीं हो सका। कृपया जांचें कि सर्वर चल रहा है।'
            : 'Error: Cannot connect to LegalGPT backend. Make sure the FastAPI server is running.',
          isError: true
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, language, activeConversationId, getAuthHeaders, fetchConversations, fetchUsage, isHindi, onOpenUpgradeModal, onNavigateTab, cancelSpeech]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !isLoading) {
      handleSendWithText(initialQuery);
      onQueryConsumed();
    }
  }, [initialQuery]);

  const handleSend = (e) => {
    e.preventDefault();
    handleSendWithText(input);
  };

  return (
    <div className="ask-ai animate-fade-in">
      <div className="ask-ai-main-column">
        {/* Dynamic Header: Active Consultation Bar when chat active, or Full Studio Hero on empty state */}
        <ChatHeroBanner
          hasMessages={messages.length > 1}
          conversations={conversations}
          activeConversationId={activeConversationId}
          isHindi={isHindi}
          isPro={isPro}
          handleNewChat={handleNewChat}
          onOpenUpgradeModal={onOpenUpgradeModal}
          onNavigateTab={onNavigateTab}
        />

        {/* Chat Transcript Area */}
        <div className="ask-ai-transcript" aria-live="polite">
          {messages.map((msg, idx) => (
            <ChatMessageItem
              key={msg.id || `msg_${idx}`}
              msg={msg}
              idx={idx}
              speakingIndex={speakingIndex}
              handleToggleSpeak={handleToggleSpeak}
              isHindi={isHindi}
            />
          ))}

          {/* Prompt scenario exploration inside transcript when conversation starts */}
          {messages.length === 1 && !isLoading && (
            <ChatSuggestedPrompts
              isHindi={isHindi}
              isLoading={isLoading}
              onSelectPrompt={handleSendWithText}
            />
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
          handleToggleVoiceInput={() => handleToggleVoiceInput(setInput)}
          speechError={speechError}
          isHindi={isHindi}
          isQuotaExhausted={isQuotaExhausted}
          onOpenUpgrade={() => onOpenUpgradeModal ? onOpenUpgradeModal('AI Legal Chat (Ask AI)', 'Upgrade to DhaaraAI Plus for unlimited AI legal inquiries.') : onNavigateTab && onNavigateTab('settings')}
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
