import React from 'react';
import {
  CarFront,
  FileQuestion,
  Home,
  ScrollText,
  ShieldCheck,
  Scale,
  ChevronRight
} from 'lucide-react';

export default function ChatSuggestedPrompts({ isHindi, isLoading, onSelectPrompt }) {
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
    <section className="ask-ai-suggested animate-fade-in">
      <div className="ask-ai-suggested-heading">
        <h3>
          <span>💡</span> {isHindi ? 'त्वरित विधिक परिदृश्य (अनुशंसित प्रश्न):' : 'Explore Legal Scenarios (Recommended Inquiries):'}
        </h3>
      </div>
      <div className="ask-ai-suggested-grid">
        {suggestedQuestions.map(({ icon: QuestionIcon, query, label }) => (
          <button
            type="button"
            key={query}
            className="ask-ai-suggested-card"
            onClick={() => onSelectPrompt(query)}
            disabled={isLoading}
          >
            <span className="ask-ai-suggested-icon"><QuestionIcon size={16} /></span>
            <b className="ask-ai-suggested-label">{label}</b>
            <ChevronRight className="ask-ai-suggested-arrow" size={14} />
          </button>
        ))}
      </div>
    </section>
  );
}
