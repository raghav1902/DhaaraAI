import React from 'react';
import { Lock, Crown, Sparkles, ArrowRight } from 'lucide-react';

export default function ProFeatureLock({
  isHindi = false,
  title = null,
  description = null,
  badge = 'DhaaraAI Plus',
  onUpgradeClick = () => { },
  style = {}
}) {
  const defaultTitle = isHindi ? 'प्रीमियम फ़ीचर अनलॉक करें' : 'Unlock Premium Feature';
  const defaultDesc = isHindi
    ? 'इस उन्नत विधिक उपकरण का असीमित उपयोग करने के लिए DhaaraAI Plus में अपग्रेड करें।'
    : 'Upgrade to DhaaraAI Plus for full, unrestricted access to this legal intelligence tool.';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        borderRadius: 'inherit',
        boxSizing: 'border-box',
        ...style
      }}
    >
      <div
        style={{
          background: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--card-border, rgba(255, 255, 255, 0.15))',
          padding: '28px 24px',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.3)',
          textAlign: 'center',
          maxWidth: '360px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          animation: 'fadeIn 0.25s ease-out',
          boxSizing: 'border-box'
        }}
      >
        {/* Glow Badge */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 20px rgba(217, 119, 6, 0.35)'
            }}
          >
            <Lock size={26} strokeWidth={2.3} />
          </div>
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-6px',
              background: '#0f172a',
              color: '#fbbf24',
              borderRadius: '999px',
              padding: '2px 6px',
              fontSize: '10px',
              fontWeight: 800,
              border: '1px solid #fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}
          >
            <Crown size={10} /> PRO
          </span>
        </div>

        <div>
          <span
            style={{
              display: 'inline-block',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--amber-600, #d97706)',
              marginBottom: '4px'
            }}
          >
            {badge}
          </span>
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '800',
              color: 'var(--text-main, #0f172a)',
              letterSpacing: '-0.02em'
            }}
          >
            {title || defaultTitle}
          </h3>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: 'var(--text-muted, #64748b)',
            lineHeight: 1.5
          }}
        >
          {description || defaultDesc}
        </p>

        <button
          onClick={onUpgradeClick}
          type="button"
          style={{
            marginTop: '6px',
            background: 'linear-gradient(135deg, #2563eb, #1e3a8a)',
            color: '#fff',
            border: 'none',
            padding: '12px 22px',
            borderRadius: '10px',
            fontWeight: '700',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 6px 18px rgba(37, 99, 235, 0.35)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
            width: '100%'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Crown size={15} />
          <span>{isHindi ? 'प्लान अपग्रेड करें' : 'Upgrade to Plus'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
