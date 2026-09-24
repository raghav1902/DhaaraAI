// Helper to sanitize markdown for speech synthesis
export function sanitizeMarkdownForSpeech(mdText, isHindi) {
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

export const getPromptSuggestions = (isHindi) => {
  return isHindi ? [
    { label: 'बाइक एक्सीडेंट (Rash Driving 281)', query: 'मेरे बाइक का एक्सीडेंट हो गया दूसरी बाइक से, क्या कानून लगेगा और तुरंत क्या करें?' },
    { label: 'ऑनलाइन ठगी (Cheating 318(4))', query: 'ऑनलाइन यूपीआई या बैंक फ्रॉड हो गया, धारा 318(4) BNS के तहत पैसे कैसे रुकवाएं?' },
    { label: 'चेक बाउंस (NI Act 138)', query: 'चेक बाउंस होने पर 30 दिन का नोटिस कैसे भेजें और क्या सजा होगी?' },
    { label: 'पुलिस FIR न लिखे तो?', query: 'अगर पुलिस थाने में FIR दर्ज करने से मना करे तो Zero FIR और मजिस्ट्रेट के पास क्या अधिकार हैं?' }
  ] : [
    { label: 'Road Accident (BNS 281)', query: 'My bike had an accident with another bike. What case will be filed and what are the immediate steps?' },
    { label: 'Online Fraud (BNS 318(4))', query: 'Someone cheated me online through UPI. How to freeze accounts and file FIR under BNS?' },
    { label: 'Cheque Bounce (Sec 138)', query: 'What is the procedure for cheque bounce and statutory 30-day notice under NI Act?' },
    { label: 'Police Refusal for FIR', query: 'What remedies are available under BNSS if the police officer refuses to register an FIR?' }
  ];
};
