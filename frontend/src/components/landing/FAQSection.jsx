import React, { useState } from 'react';
import { HelpCircle, Plus, Minus } from 'lucide-react';

function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div style={{
      borderBottom: '1px solid #e7e3da',
      padding: '1.4rem 0',
      transition: 'background-color 0.2s ease'
    }}>
      <button
        onClick={onToggle}
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
          color: '#0b1329',
          fontFamily: "'Outfit', sans-serif",
          fontWeight: '600',
          fontSize: '1.05rem',
          lineHeight: '1.4'
        }}
      >
        <span>{question}</span>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: isOpen ? '#eff6ff' : '#f8fafc',
          color: isOpen ? '#1d4ed8' : '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginLeft: '1rem',
          transition: 'all 0.2s ease'
        }}>
          {isOpen ? <Minus size={15} /> : <Plus size={15} />}
        </div>
      </button>

      <div style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{ overflow: 'hidden' }}>
          <p style={{
            paddingTop: '0.85rem',
            color: '#475569',
            lineHeight: '1.65',
            fontSize: '0.9rem',
            margin: 0,
            maxWidth: '92%'
          }}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0); // first item open by default

  const faqs = [
    {
      q: "What exactly is DhaaraAI?",
      a: "DhaaraAI is an intelligent legal assistant built specifically for Indian law. It assists advocates, legal teams, and citizens with statutory research, contract risk analysis, legal drafting (FIRs, NDAs, notices), and BNS ↔ IPC cross-referencing with verified authentic citations."
    },
    {
      q: "Is my private client legal data secure and confidential?",
      a: "Yes, completely. We use enterprise-grade AES-256 encryption at rest and TLS 1.3 in transit. Your private client documents and confidential queries are never used to train public AI models, ensuring strict compliance with attorney-client confidentiality and India’s DPDP Act."
    },
    {
      q: "Does DhaaraAI support the new 2023 criminal laws (BNS, BNSS, BSA)?",
      a: "Yes! DhaaraAI provides native support and pre-indexed mappings for the Bharatiya Nyaya Sanhita (BNS), Bharatiya Nagarik Suraksha Sanhita (BNSS), and Bharatiya Sakshya Adhiniyam (BSA), alongside legacy IPC, CrPC, and Indian Evidence Act concordances."
    },
    {
      q: "Can I upload contracts in PDF or scanned images?",
      a: "Yes, our Contract Audit and Document Review tool supports native PDFs, Word documents, and high-resolution scanned contract images. The engine automatically identifies high-risk clauses, non-compete liabilities under Section 27, and jurisdiction ambiguities."
    },
    {
      q: "Can DhaaraAI replace my practicing lawyer?",
      a: "No. DhaaraAI is engineered as an ultra-high-efficiency research companion for legal professionals and an educational guide for citizens. It does not replace a licensed advocate for court appearances, oral arguments, or formal legal representation."
    },
    {
      q: "How does the 3-day free trial work?",
      a: "You can activate any plan and test all features for 3 days with zero restrictions. You can cancel anytime from your settings before the trial ends without being charged."
    }
  ];

  return (
    <section id="faq" className="landing-section" style={{ maxWidth: '880px', margin: '4rem auto' }}>
      {/* Header */}
      <div className="landing-section-header">
        <div className="eyebrow-badge">
          <HelpCircle size={14} /> FREQUENTLY ASKED QUESTIONS
        </div>
        <h2 className="landing-section-title">
          Frequently Asked Questions
        </h2>
        <p className="landing-section-desc">
          Everything you need to know about DhaaraAI, compliance, trial access, and Indian statutory coverage.
        </p>
      </div>

      {/* Accordion List */}
      <div style={{
        background: '#ffffff',
        borderRadius: '22px',
        padding: '1rem 2.25rem',
        border: '1px solid #e7e3da',
        boxShadow: '0 4px 20px rgba(11, 19, 41, 0.03)'
      }}>
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            question={faq.q}
            answer={faq.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </section>
  );
}
