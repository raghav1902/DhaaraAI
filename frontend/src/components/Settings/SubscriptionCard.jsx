import React from 'react';
import { Crown, Sparkles, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function SubscriptionCard({
  isHindi,
  user,
  usageStats,
  planMessage,
  isUpgradingPlan,
  handleUpdatePlan,
  fetchUsage
}) {
  return (
    <div className="settings-hub__card" style={{ gridColumn: '1 / -1' }}>
      <div className="settings-hub__card-header" style={{ marginBottom: '16px' }}>
        <div className="settings-hub__card-icon-wrap" style={{ background: 'linear-gradient(135deg, var(--gold-500, #fbbf24), #d97706)', color: '#fff' }}>
          <Crown size={20} />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 className="settings-hub__card-title">
              {isHindi ? 'सदस्यता और उपयोग कोटा (Subscription & Quotas)' : 'Subscription & Live Feature Quotas'}
            </h3>
            <p className="settings-hub__card-desc">
              {isHindi ? 'अपनी वर्तमान योजना और रीयल-टाइम उपयोग सीमाएं प्रबंधित करें' : 'Track your live usage limits and manage subscription tiers'}
            </p>
          </div>
          <div style={{ padding: '6px 14px', background: user?.plan === 'plus' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(234, 179, 8, 0.12)', borderRadius: 'var(--radius-full)', border: user?.plan === 'plus' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: user?.plan === 'plus' ? 'var(--success)' : '#eab308' }}></span>
            <span style={{ fontSize: '13px', fontWeight: '800', color: user?.plan === 'plus' ? 'var(--success)' : '#eab308' }}>
              {user?.plan === 'plus' ? 'DHAARAAI PLUS ACTIVE' : 'FREE TIER (QUOTA LIMITED)'}
            </span>
          </div>
        </div>
      </div>

      {planMessage && (
        <div style={{
          marginBottom: '16px',
          padding: '10px 14px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: planMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: planMessage.type === 'success' ? '#10b981' : '#ef4444',
          border: planMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(239, 68, 68, 0.3)'
        }}>
          {planMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{planMessage.text}</span>
        </div>
      )}

      {/* Live Feature Quota Meters */}
      {usageStats && (
        <div style={{ marginBottom: '16px', padding: '14px', background: 'var(--bg-secondary, rgba(255,255,255,0.03))', borderRadius: '10px', border: '1px solid var(--border-light, rgba(255,255,255,0.08))' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              {isHindi ? 'रीयल-टाइम उपयोग मीटर (Live Usage Tracking)' : 'Live Quota Meters & Consumption'}
            </span>
            <button
              type="button"
              onClick={fetchUsage}
              title="Refresh Quotas"
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px' }}
            >
              <RefreshCw size={12} /> Refresh
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            {[
              { key: 'ai_chat', label: 'AI Legal Chat (Daily)', max: 7 },
              { key: 'bns_lookup', label: 'BNS ↔ IPC Explorer', max: 2 },
              { key: 'legal_library', label: 'Statutory Library', max: 15 },
              { key: 'draft', label: 'Legal Drafter', max: 3 },
              { key: 'contract_audit', label: 'Contract Risk Audit', max: 3 },
              { key: 'cyber_check', label: 'Cyber Breach Scanner', max: 3 }
            ].map((feat) => {
              const stat = usageStats.features?.[feat.key] || { used: 0, limit: feat.max, remaining: feat.max };
              const usedCount = stat.used ?? stat.count ?? 0;
              const limitCount = stat.limit > 0 ? stat.limit : feat.max;
              const isUnlimited = stat.limit === -1 || stat.is_unlimited || user?.plan === 'plus';
              const remainingCount = isUnlimited ? -1 : (stat.remaining ?? Math.max(0, limitCount - usedCount));
              const percent = isUnlimited ? 0 : Math.min(100, Math.round((usedCount / limitCount) * 100));
              const isExceeded = !isUnlimited && remainingCount <= 0;

              return (
                <div key={feat.key} style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--bg-primary, rgba(0,0,0,0.15))', border: isExceeded ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-light, rgba(255,255,255,0.06))' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-main)' }}>{feat.label}</span>
                    <span style={{ color: isUnlimited ? '#f59e0b' : isExceeded ? '#ef4444' : 'var(--text-muted)' }}>
                      {isUnlimited ? '∞ Unlimited' : `${usedCount} / ${limitCount}`}
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '5px', background: 'var(--bg-tertiary, #333)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: isUnlimited ? '100%' : `${percent}%`,
                      height: '100%',
                      background: isUnlimited ? 'linear-gradient(90deg, #10b981, #059669)' : isExceeded ? '#ef4444' : percent > 66 ? '#f59e0b' : '#6366f1',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: '10px', marginTop: '4px', color: isExceeded ? '#ef4444' : 'var(--text-muted)' }}>
                    {isUnlimited ? 'Plus Tier Unlocked' : isExceeded ? '🔒 Limit Reached — Upgrade' : `${remainingCount} remaining`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', background: 'var(--subtle-bg)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>
              {isHindi ? 'फ्री टियर (Free Tier)' : 'Free Tier'}
            </h4>
            {user?.plan !== 'plus' && (
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--primary)', padding: '2px 8px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)' }}>CURRENT</span>
            )}
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> 7 AI Legal Chats / Day</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> 2 BNS ↔ IPC Lookups (15 Preview Provisions)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> Legal Library 15 Sections & 15 Terms Preview</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> Max 3 Legal Drafts</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> Max 3 Contract Risk Audits</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><AlertCircle size={14} color="var(--amber-500)" /> Max 3 Cyber Breach Scans (Masked)</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle2 size={14} color="var(--success)" /> Citizen Rights & Emergency SOS</li>
          </ul>

          {user?.plan === 'plus' && (
            <button
              type="button"
              onClick={() => handleUpdatePlan('free')}
              disabled={isUpgradingPlan}
              style={{
                marginTop: 'auto',
                background: 'transparent',
                color: 'var(--text-muted)',
                border: '1px dashed var(--border-light, #444)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {isUpgradingPlan ? 'Updating...' : 'Switch to Free Tier (To Test Free Limits)'}
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '1px solid var(--border-light)', paddingLeft: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Crown size={16} /> {isHindi ? 'DhaaraAI प्लस (₹999/माह)' : 'DhaaraAI Plus (₹999/month)'}
            </h4>
            {user?.plan === 'plus' && (
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)' }}>ACTIVE</span>
            )}
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crown size={14} color="#f59e0b" /> Unlimited Legal Drafting & BNS Concordance</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crown size={14} color="#f59e0b" /> Unlimited Contract Audits & Risk Scoring</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crown size={14} color="#f59e0b" /> Sec 50C Stamp Duty & GST Late Fee Calculators Unlocked</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crown size={14} color="#f59e0b" /> Full Cyber Breach Details & IT Act Legal Protocols</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Crown size={14} color="#f59e0b" /> Complete 2,016+ Statutory Library Access</li>
          </ul>

          {user?.plan !== 'plus' ? (
            <button
              onClick={() => handleUpdatePlan('plus')}
              disabled={isUpgradingPlan}
              style={{
                marginTop: 'auto',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#fff',
                border: 'none',
                padding: '10px 16px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)'
              }}
            >
              <Sparkles size={16} /> {isUpgradingPlan ? 'Upgrading...' : isHindi ? 'अभी DhaaraAI Plus में अपग्रेड करें' : 'Upgrade to DhaaraAI Plus (Instant Access)'}
            </button>
          ) : (
            <div style={{ marginTop: 'auto', padding: '8px 12px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '12px', fontWeight: 600, textAlign: 'center' }}>
              ✓ You are enjoying all Premium DhaaraAI Plus capabilities
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
