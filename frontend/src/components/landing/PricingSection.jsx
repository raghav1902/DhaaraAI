import React, { useState } from 'react';
import { Tag, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

export default function PricingSection({ onExplore }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  const plans = [
    {
      name: 'Free Tier',
      tagline: 'Ideal for legal students and introductory research',
      monthlyPrice: '₹0',
      annualPrice: '₹0',
      period: 'forever',
      popular: false,
      btnLabel: 'Get Started Free',
      features: [
        '15 preview statutory concordance provisions',
        '7 AI legal consultations per day',
        '2 BNS ↔ IPC section lookups per day',
        'Citizen legal rights & SOS guide',
        'Standard response speed',
        'Zero credit card required'
      ]
    },
    {
      name: 'DhaaraAI Plus',
      tagline: 'Built for active litigators, advocates & legal teams',
      monthlyPrice: '₹499',
      annualPrice: '₹399',
      period: '/mo',
      popular: true,
      badge: 'Recommended • Active Tier',
      btnLabel: 'Upgrade to Plus',
      features: [
        'All 1,495+ statutory concordance provisions unlocked',
        'Truly unlimited AI statutory & case law consultations',
        'Unlimited BNS ↔ IPC concordance explorer lookups',
        'State-wise Court Fee & Stamp Duty Calculator (28 States & UTs)',
        'Cyber Exposure & Data Leak Threat Scanner',
        'Court-ready bilingual legal drafter (FIRs, Notices, NDAs)',
        'Zero-knowledge encrypted client vault with PIN protection',
        'Priority GPU inference queue with instant citations'
      ]
    },
    {
      name: 'Chambers & Corporate',
      tagline: 'For law chambers, senior counsels & corporate counsel',
      monthlyPrice: '₹1,499',
      annualPrice: '₹1,199',
      period: '/mo',
      popular: false,
      btnLabel: 'Contact Chambers Team',
      features: [
        'Everything in DhaaraAI Plus',
        'Multi-advocate shared vault & chamber collaboration',
        'Custom firm pleading templates & chamber letterheads',
        'Bulk contract risk audits & redlining exports',
        'Dedicated legal SLA & API data access',
        'Custom fine-tuned firm precedent search'
      ]
    }
  ];

  return (
    <section id="pricing" className="landing-section" style={{
      maxWidth: '1280px',
      margin: '4rem auto',
      padding: '0 1.5rem'
    }}>
      {/* Header and Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div className="eyebrow-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            background: '#eff6ff',
            color: '#1d4ed8',
            border: '1px solid #bfdbfe',
            padding: '0.3rem 0.85rem',
            borderRadius: '999px',
            fontSize: '0.76rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '0.75rem'
          }}>
            <Tag size={14} /> TRANSPARENT LEGAL PRICING
          </div>
          <h2 className="landing-section-title" style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontWeight: '600',
            color: '#0b1329',
            lineHeight: '1.25',
            margin: '0 0 0.5rem 0'
          }}>
            Simple, Transparent Plans for Every Practice
          </h2>
          <p className="landing-section-desc" style={{ margin: 0, textAlign: 'left', color: '#64748b', fontSize: '0.94rem' }}>
            Start with the free tier today. Upgrade seamlessly anytime to unlock all 1,495+ provisions and advanced drafting.
          </p>
        </div>

        {/* Billing Toggle */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          padding: '0.35rem',
          borderRadius: '999px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <button
            onClick={() => setBillingCycle('monthly')}
            style={{
              padding: '0.45rem 1.15rem',
              borderRadius: '999px',
              border: 'none',
              background: billingCycle === 'monthly' ? '#1d4ed8' : 'transparent',
              color: billingCycle === 'monthly' ? '#ffffff' : '#64748b',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            style={{
              padding: '0.45rem 1.15rem',
              borderRadius: '999px',
              border: 'none',
              background: billingCycle === 'annual' ? '#1d4ed8' : 'transparent',
              color: billingCycle === 'annual' ? '#ffffff' : '#64748b',
              fontWeight: '600',
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              transition: 'all 0.2s'
            }}
          >
            <span>Annual</span>
            <span style={{
              fontSize: '0.7rem',
              background: '#ecfdf5',
              color: '#059669',
              padding: '1px 7px',
              borderRadius: '999px',
              fontWeight: '700'
            }}>
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* 3 Pricing Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
        alignItems: 'stretch'
      }} className="pricing-cards-grid">
        {plans.map((plan, idx) => {
          const isPop = plan.popular;
          return (
            <div
              key={idx}
              className="premium-card"
              style={{
                position: 'relative',
                background: '#ffffff',
                border: isPop ? '2px solid #1d4ed8' : '1px solid #e7e3da',
                borderRadius: '22px',
                padding: '2.5rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: isPop ? '0 16px 45px rgba(29, 78, 216, 0.12)' : '0 4px 18px rgba(11, 19, 41, 0.03)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
            >
              {/* Popular Badge */}
              {isPop && (
                <div style={{
                  position: 'absolute',
                  top: '-13px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #1e40af, #2563eb)',
                  color: 'white',
                  fontSize: '0.74rem',
                  fontWeight: '700',
                  padding: '3px 16px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  boxShadow: '0 4px 12px rgba(29, 78, 216, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Sparkles size={12} /> {plan.badge}
                </div>
              )}

              <div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.35rem',
                  fontWeight: '700',
                  color: '#0b1329',
                  marginBottom: '0.3rem'
                }}>
                  {plan.name}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.35rem',
                  marginBottom: '0.35rem'
                }}>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '2.5rem',
                    fontWeight: '800',
                    color: isPop ? '#1d4ed8' : '#0b1329'
                  }}>
                    {billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.88rem' }}>
                    {plan.period}
                  </span>
                </div>

                <div style={{ color: '#64748b', fontSize: '0.84rem', lineHeight: '1.5', minHeight: '40px', marginBottom: '1.75rem' }}>
                  {plan.tagline}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onExplore}
                className={isPop ? "btn-primary-pill" : "btn-secondary-pill"}
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  marginBottom: '2rem',
                  padding: '0.8rem 1rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {plan.btnLabel}
              </button>

              {/* Features List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: 'auto' }}>
                {plan.features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={16} color={isPop ? "#1d4ed8" : "#059669"} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: '#334155', fontSize: '0.86rem', fontWeight: '500', lineHeight: '1.45' }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 960px) {
          .pricing-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
