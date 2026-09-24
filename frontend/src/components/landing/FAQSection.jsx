import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid #e2e8f0', padding: '1.25rem 0' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
          textAlign: 'left',
          color: '#0f172a',
          fontWeight: '600',
          fontSize: '1rem',
          fontFamily: 'inherit'
        }}
      >
        {question}
        <ChevronDown size={18} style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s ease', color: '#64748b' }} />
      </button>
      <div style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.25s ease'
      }}>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ paddingTop: '0.75rem', color: '#475569', lineHeight: '1.6', fontSize: '0.88rem', margin: 0 }}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const faqs = [
    {
      q: "What exactly is DhaaraAI?",
      a: "DhaaraAI is an intelligent legal assistant built specifically for Indian law. It assists advocates, legal teams, and citizens with statutory research, contract risk analysis, legal drafting (FIRs, NDAs, notices), and BNS ↔ IPC cross-referencing."
    },
    {
      q: "Is my private client legal data secure and confidential?",
      a: "Yes, completely. We use enterprise-grade AES-256 encryption. Your private client documents and confidential queries are never used to train public AI models, ensuring strict compliance with attorney-client confidentiality standards."
    },
    {
      q: "Does DhaaraAI support the new 2023 criminal laws (BNS, BNSS, BSA)?",
      a: "Yes! DhaaraAI has native support and pre-trained index mappings for Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA), alongside legacy IPC and CrPC codes."
    },
    {
      q: "Can I upload contracts in PDF or Scanned Images?",
      a: "Yes, our Smart Document Review tool supports native PDFs, Word documents, and high-resolution scanned contract images. The engine highlights clause risks, liabilities, and missing boilerplate terms."
    },
    {
      q: "Can DhaaraAI replace my practicing lawyer?",
      a: "No. DhaaraAI is designed as an ultra-high-efficiency research companion for legal professionals and an educational guide for citizens. It does not replace a licensed advocate for court appearances or formal representation."
    },
    {
      q: "How does the 3-day free trial work?",
      a: "You can activate any plan and test all features for 3 days with zero restrictions. You can cancel anytime from your settings before the trial ends without being charged."
    }
  ];

  return (
    <section id="faq" className="section-container" style={{ maxWidth: '820px', margin: '4rem auto' }}>
      <div className="section-header">
        <div className="feature-badge"><HelpCircle size={14} /> Common Questions</div>
        <h2 className="section-title">Frequently Asked Questions</h2>
        <p className="section-desc">Everything you need to know about DhaaraAI, compliance, and trials.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </section>
  );
}
