import React, { useState } from 'react';
import { Tag, CheckCircle2 } from 'lucide-react';

export default function PricingSection({ onExplore }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'annual'

  const plans = [
    {
      name: 'Basic Plan',
      tagline: 'Ideal for solo advocates',
      monthlyPrice: '₹130.99',
      annualPrice: '₹1250.50',
      period: '/mo',
      popular: false,
      btnLabel: 'Get Started',
      features: [
        'Advanced AI model access',
        'Unlimited statutory queries',
        'Up-to-date BNS 2023 data',
        'Standard email support'
      ]
    },
    {
      name: 'Plus Plan',
      tagline: 'For active law firms',
      monthlyPrice: '₹340.99',
      annualPrice: '₹3273.50',
      period: '/mo',
      popular: true,
      badge: 'Most Popular',
      btnLabel: 'Start 3-Day Free Trial',
      features: [
        'Everything in Basic',
        'Document uploads (PDF & Word)',
        'Contract risk audits (100/mo)',
        'Court-ready notice drafting',
        'Priority AI inference queue'
      ]
    },
    {
      name: 'Enterprise',
      tagline: 'For corporate legal teams',
      monthlyPrice: '₹690.99',
      annualPrice: '₹6633.50',
      period: '/mo',
      popular: false,
      btnLabel: 'Get Started',
      features: [
        'Unlimited document audits',
        'Deep precedent research mode',
        'Multi-user team vault',
        'Custom law firm templates',
        'Dedicated account manager'
      ]
    }
  ];

  return (
    <section id="pricing" className="landing-section">
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
          <div className="eyebrow-badge">
            <Tag size={14} /> TRANSPARENT PLANS
          </div>
          <h2 className="landing-section-title" style={{ margin: '0 0 0.5rem 0' }}>
            Choose the plan that fits you
          </h2>
          <p className="landing-section-desc" style={{ margin: 0, textAlign: 'left' }}>
            Every plan includes an instant 3-day free trial. Cancel anytime.
          </p>
        </div>

        {/* Billing Toggle */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          padding: '0.3rem',
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
              padding: '1px 6px',
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
                boxShadow: isPop ? '0 16px 45px rgba(29, 78, 216, 0.12)' : '0 4px 18px rgba(11, 19, 41, 0.03)'
              }}
            >
              {/* Popular Badge */}
              {isPop && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#1d4ed8',
                  color: 'white',
                  fontSize: '0.72rem',
                  fontWeight: '700',
                  padding: '3px 14px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  boxShadow: '0 2px 8px rgba(29, 78, 216, 0.35)'
                }}>
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#0b1329',
                  marginBottom: '0.3rem'
                }}>
                  {plan.name}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '0.3rem',
                  marginBottom: '0.35rem'
                }}>
                  <span style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: '2.4rem',
                    fontWeight: '800',
                    color: '#0b1329'
                  }}>
                    {billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.88rem' }}>
                    {plan.period}
                  </span>
                </div>

                <div style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.75rem' }}>
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
                  padding: '0.75rem 1rem'
                }}
              >
                {plan.btnLabel}
              </button>

              {/* Features List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: 'auto' }}>
                {plan.features.map((feat, fIdx) => (
                  <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <CheckCircle2 size={16} color={isPop ? "#1d4ed8" : "#059669"} style={{ flexShrink: 0 }} />
                    <span style={{ color: '#334155', fontSize: '0.86rem', fontWeight: '500' }}>
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
