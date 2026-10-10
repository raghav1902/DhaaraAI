import { useState, useRef, useEffect } from 'react';
import { sanitizeMarkdownForSpeech } from './speechUtils';

export function useSpeechService(isHindi) {
  // Speech-to-Text States
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState(null);
  const recognitionRef = useRef(null);

  // Text-to-Speech States
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);

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

  const handleToggleVoiceInput = (onResultText) => {
    setSpeechError(null);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError(
        isHindi
          ? 'आपका ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता। कृपया Chrome या Edge का उपयोग करें।'
          : 'Your browser does not support Web Speech Recognition. Please use Chrome or Edge.'
      );
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
        if (transcript && onResultText) {
          onResultText(transcript);
        }
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
        const hindiVoice = voices.find(
          v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi') || v.name.toLowerCase().includes('india')
        );
        if (hindiVoice) utterance.voice = hindiVoice;
      } else {
        const indianEngVoice = voices.find(
          v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india')
        );
        if (indianEngVoice) utterance.voice = indianEngVoice;
      }
    }

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    synthRef.current.speak(utterance);
  };

  const cancelSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setSpeakingIndex(null);
    }
  };

  return {
    isListening,
    speechError,
    speakingIndex,
    handleToggleVoiceInput,
    handleToggleSpeak,
    cancelSpeech
  };
}
