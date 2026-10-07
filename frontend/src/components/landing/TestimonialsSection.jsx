import React from 'react';
import { Star, MessageSquareQuote, ArrowRight } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Rajesh Malhotra',
      role: 'Senior Advocate, Delhi High Court',
      avatar: '/assets/legal/testimonials/rajesh_malhotra.jpg',
      quote: '“DhaaraAI cut my case research time from hours to minutes. Being able to find pinpoint Supreme Court citations and verify BNS provisions right from the bench is game-changing.”'
    },
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO, TechScale Logistics',
      avatar: '/assets/legal/testimonials/priya_sharma.jpg',
      quote: '“As a startup founder, legal retainers were draining our runway. DhaaraAI audits vendor agreements in 60 seconds and flags risky clauses accurately.”'
    },
    {
      name: 'Vikramaditya Sen',
      role: 'Managing Partner, Sen & Associates Law',
      avatar: '/assets/legal/testimonials/vikramaditya_sen.jpg',
      quote: '“The BNS to IPC converter and automated citation engine saved our junior associates hundreds of late-night hours during criminal trial preparations. Brilliant execution.”'
    }
  ];

  return (
    <section className="landing-section" style={{
      background: '#ffffff',
      borderRadius: '28px',
      margin: '4rem auto',
      border: '1px solid #e7e3da',
      boxShadow: '0 8px 30px rgba(11, 19, 41, 0.03)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '2.75rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div className="eyebrow-badge">
            <MessageSquareQuote size={14} /> LOVED BY ADVOCATES & LEGAL COUNSEL
          </div>
          <h2 className="landing-section-title" style={{ margin: 0 }}>
            What Legal Professionals Say
          </h2>
        </div>

        <a
          href="#pricing"
          style={{
            color: '#1d4ed8',
            fontSize: '0.9rem',
            fontWeight: '600',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            marginBottom: '0.5rem'
          }}
        >
          <span>Read more reviews</span>
          <ArrowRight size={15} />
        </a>
      </div>

      {/* 3 Testimonial Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.75rem'
      }} className="testimonials-row">
        {testimonials.map((item, idx) => (
          <div
            key={idx}
            className="premium-card"
            style={{
              background: '#faf8f5',
              border: '1px solid #e7e3da',
              borderRadius: '20px',
              padding: '2rem 1.75rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              {/* Quote text */}
              <p style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontSize: '0.94rem',
                color: '#1e293b',
                lineHeight: '1.65',
                fontStyle: 'italic',
                marginBottom: '1.5rem',
                margin: '0 0 1.5rem 0'
              }}>
                {item.quote}
              </p>
            </div>

            {/* Advocate profile info & stars */}
            <div style={{
              borderTop: '1px solid #e7e3da',
              paddingTop: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <img
                  src={item.avatar}
                  alt={item.name}
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                />
                <div>
                  <div style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: '700',
                    fontSize: '0.94rem',
                    color: '#0b1329',
                    lineHeight: 1.2
                  }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '2px' }}>
                    {item.role}
                  </div>
                </div>
              </div>

              {/* 5 Gold Stars */}
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonials-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
