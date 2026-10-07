import React from 'react';
import { Crown, Check, X, Sparkles, Shield, Zap, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { API_BASE } from '../config/apiConfig';

export default function UpgradeModal({
  isOpen,
  onClose,
  featureName = 'This feature',
  message = null,
  user,
  onUserUpdate,
  onUpgradeSuccess,
  onNavigateTab,
  isHindi = false
}) {
  if (!isOpen) return null;

  const isPro = user?.plan === 'plus' || user?.plan === 'pro' || user?.plan === 'enterprise';
  const notifyUpdate = onUpgradeSuccess || onUserUpdate;

  const handleInstantUpgrade = async () => {
    try {
      const token = user?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${API_BASE}/api/user/upgrade`, {
        plan: 'plus',
        days: 30,
        email: user?.email
      }, { headers });

      if (res.data?.user || res.data?.status === 'success') {
        const updated = {
          ...(user || {}),
          ...(res.data.user || {}),
          plan: 'plus',
          token: res.data.token || res.data.user?.token || token
        };
        if (notifyUpdate) notifyUpdate(updated);
        try {
          localStorage.setItem('dhaara_active_user', JSON.stringify(updated));
        } catch (e) {}
      }
      onClose();
    } catch (err) {
      // Fallback local update if offline or anonymous
      const updated = { ...(user || {}), plan: 'plus' };
      if (notifyUpdate) notifyUpdate(updated);
      try {
        localStorage.setItem('dhaara_active_user', JSON.stringify(updated));
      } catch (e) {}
      onClose();
    }
  };

  const PLUS_PERKS = [
    {
      title: isHindi ? 'असीमित AI विधिक परामर्श (Ask AI)' : 'Unlimited AI Legal Intelligence Chat',
      desc: isHindi ? 'दैनिक 7 चैट्स की सीमा समाप्त — असीमित विधिक पूछताछ और विश्लेषण' : 'Bypass the daily 7-chat limit with truly unlimited statutory answers & guidance'
    },
    {
      title: isHindi ? 'संपूर्ण 1,495+ धाराएं एवं 155+ शब्दावली' : 'All 1,495+ Sections & 155+ Terms Unlocked',
      desc: isHindi ? '15 पूर्वावलोकन धाराओं की सीमा हटाएं — पूरी विधिक लाइब्रेरी व लीगल शब्दावली' : 'Upgrade past the 15-item preview to full access across all central statutes & glossary'
    },
    {
      title: isHindi ? 'असीमित BNS ↔ IPC अन्वेषक' : 'Unlimited BNS ↔ IPC Concordance',
      desc: isHindi ? 'बिना किसी 2 खोज सीमा के सभी 1,484+ विधिक प्रावधानों की तुलना' : 'Full access to all 1,484+ statutory provisions without 2-lookup limits'
    },
    {
      title: isHindi ? 'असीमित विधिक ड्राफ्टिंग व अनुबंध ऑडिट' : 'Unlimited Drafting & Contract Audits',
      desc: isHindi ? 'FIR, नोटिस, वकालतनामा और संपूर्ण अनुबंध जोखिम ऑडिट' : 'Generate unlimited FIRs, bail petitions, statutory notices and contract audits'
    },
    {
      title: isHindi ? 'एडवांस्ड संपत्ति/GST कैलकुलेटर व साइबर इंटेलिजेंस' : 'Fee Studios & Cyber Breach Intelligence',
      desc: isHindi ? 'धारा 50C स्टाम्प ड्यूटी, GST ब्याज और अनमास्क्ड डेटा ब्रीच विश्लेषण' : 'Conveyance studio, Section 50 GST, and full unmasked breach exposure reports'
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--card-bg, #ffffff)',
          border: '1px solid var(--card-border, #e2e8f0)',
          borderRadius: '20px',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          position: 'relative',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e3a8a, #0f172a)',
            padding: '24px 24px 20px',
            color: '#ffffff',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            type="button"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(245, 158, 11, 0.2)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              color: '#fbbf24',
              marginBottom: '10px'
            }}
          >
            <Crown size={12} />
            {isHindi ? 'सीमा समाप्त • DhaaraAI Plus' : 'QUOTA REACHED • DHAARAAI PLUS'}
          </div>

          <h3 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 800 }}>
            {isHindi ? 'निःशुल्क सीमा समाप्त हो गई है' : 'Free Tier Limit Reached'}
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#cbd5e1', lineHeight: 1.4 }}>
            {message ||
              (isHindi
                ? `${featureName} की निःशुल्क सीमा पूरी हो गई है। असीमित उपयोग जारी रखने के लिए DhaaraAI Plus में अपग्रेड करें।`
                : `You have reached the free limit for ${featureName}. Upgrade to DhaaraAI Plus for unlimited professional access.`)}
          </p>
        </div>

        {/* Plan Benefits Body */}
        <div style={{ padding: '20px 24px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              color: 'var(--text-muted, #64748b)',
              marginBottom: '12px',
              letterSpacing: '0.04em'
            }}
          >
            {isHindi ? 'DhaaraAI Plus के साथ आपको मिलेगा:' : 'Unlocked with DhaaraAI Plus:'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PLUS_PERKS.map((perk, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '8px 10px',
                  background: 'var(--subtle-bg, #f8fafc)',
                  borderRadius: '10px',
                  border: '1px solid var(--card-border, #f1f5f9)'
                }}
              >
                <div
                  style={{
                    background: '#10b981',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main, #0f172a)' }}>
                    {perk.title}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted, #64748b)' }}>
                    {perk.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Highlight */}
          <div
            style={{
              marginTop: '16px',
              padding: '12px 16px',
              background: 'linear-gradient(135deg, rgba(37,99,235,0.06), rgba(245,158,11,0.06))',
              border: '1px solid rgba(37,99,235,0.15)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb' }}>
                {isHindi ? 'विशेष एडवोकेट प्रो प्लान' : 'SPECIAL ADVOCATE PRO PLAN'}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-main, #0f172a)' }}>
                ₹999 <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>/ month</span>
              </div>
            </div>
            <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
              ✓ 100% Unlimited Usage
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
            <button
              onClick={handleInstantUpgrade}
              type="button"
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                border: 'none',
                padding: '12px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              <Crown size={16} />
              <span>{isHindi ? 'तुरंत Plus एक्टिवेट करें' : 'Activate Plus Now'}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onNavigateTab) onNavigateTab('settings');
              }}
              type="button"
              style={{
                background: 'transparent',
                border: '1px solid var(--card-border, #cbd5e1)',
                color: 'var(--text-main, #0f172a)',
                padding: '12px 16px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {isHindi ? 'सेटिंग्स देखें' : 'View Plans'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
