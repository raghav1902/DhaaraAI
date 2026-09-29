import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, Copy, Lightbulb, Scale, Save, Check } from 'lucide-react';

export default function AnalysisResultsView({ analysis, isHindi, copyClause }) {
  const [savedToVault, setSavedToVault] = useState(false);

  if (!analysis) return null;

  const getRiskBadgeColor = (score) => {
    const s = String(score).toLowerCase();
    if (s.includes('critical')) return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
    if (s.includes('high')) return { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' };
    if (s.includes('medium')) return { bg: '#fef9c3', text: '#854d0e', border: '#fde047' };
    return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
  };

  const badge = getRiskBadgeColor(analysis.risk_score);

  const handleSaveAuditToVault = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('dhaara_vault_drafts') || '[]');
      const formattedAudit = [
        `CONTRACT RISK AUDIT REPORT`,
        `Overall Risk: ${analysis.risk_score} (${analysis.risk_percentage || 50}%)`,
        `Engine: ${analysis.source || 'Indian Legal Audit Engine'}`,
        `Date: ${new Date().toLocaleString()}`,
        `\n--- EXECUTIVE SUMMARY ---\n${analysis.summary || 'N/A'}`,
        `\n--- FLAGGED RED FLAGS (${analysis.red_flags?.length || 0}) ---`,
        ...(analysis.red_flags || []).map((rf, i) =>
          `\n[${i + 1}] Issue: ${rf.issue}\nStatute: ${rf.applicable_law}\nProblematic Clause:\n"${rf.problematic_clause}"\nReason:\n${rf.statutory_problem}\nBalanced Alternative:\n"${rf.fair_alternative}"`
        ),
        `\n--- MISSING CRUCIAL PROTECTIONS ---`,
        ...(analysis.missing_protections || []).map(p => `• ${p}`),
        `\n--- ACTIONABLE ADVICE ---`,
        ...(analysis.actionable_advice || []).map(a => `• ${a}`)
      ].join('\n');

      drafts.push({
        id: Date.now().toString(),
        type: 'Contract Audit Report',
        title: `Audit Report - ${analysis.risk_score} Risk (${new Date().toLocaleDateString()})`,
        content: formattedAudit,
        date: new Date().toISOString()
      });
      localStorage.setItem('dhaara_vault_drafts', JSON.stringify(drafts));
      setSavedToVault(true);
      setTimeout(() => setSavedToVault(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Scorecard */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              {isHindi ? 'समग्र विधिक जोखिम स्तर' : 'Overall Contract Risk Score'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
              <span style={{
                background: badge.bg,
                color: badge.text,
                border: `1px solid ${badge.border}`,
                padding: '6px 14px',
                borderRadius: '20px',
                fontWeight: '700',
                fontSize: '15px'
              }}>
                {analysis.risk_score} Risk ({analysis.risk_percentage || 50}%)
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                {analysis.red_flags?.length || 0} {isHindi ? 'आपत्तिजनक धाराएं पाई गईं' : 'problematic clauses flagged'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleSaveAuditToVault}
              className="btn-ghost"
              style={{
                fontSize: '13px',
                padding: '7px 14px',
                background: savedToVault ? '#f0fdf4' : 'rgba(59, 130, 246, 0.08)',
                color: savedToVault ? '#16a34a' : 'var(--primary)',
                borderColor: savedToVault ? '#86efac' : 'rgba(59, 130, 246, 0.2)'
              }}
            >
              {savedToVault ? <Check size={15} color="#16a34a" /> : <Save size={15} />}
              {savedToVault
                ? (isHindi ? 'वॉल्ट में सहेजा गया!' : 'Saved to Vault!')
                : (isHindi ? 'वॉल्ट में सहेजें' : 'Save to Vault')}
            </button>
            <div style={{ background: 'var(--subtle-bg)', padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>Engine: {analysis.source || 'Indian Legal Audit Engine'}</span>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div style={{ marginTop: '18px', padding: '14px 18px', background: 'var(--primary-light)', borderRadius: '10px', borderLeft: '4px solid var(--primary)' }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: '700', color: 'var(--primary)' }}>
            {isHindi ? 'दस्तावेज का सरल सारांश' : 'Plain Language Executive Summary'}
          </h4>
          <p style={{ margin: 0, fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-main)' }}>
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* Red Flags Breakdown */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <ShieldAlert size={22} color="#dc2626" />
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'var(--text-main)' }}>
            {isHindi ? 'चिन्हित आपत्तिजनक शर्तें (Red Flags & Legal Issues)' : 'Flagged Red Flags & Problematic Clauses'}
          </h3>
        </div>

        {analysis.red_flags && analysis.red_flags.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analysis.red_flags.map((flag, idx) => (
              <div
                key={idx}
                style={{
                  border: '1px solid var(--card-border)',
                  background: 'var(--card-bg)',
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: 'var(--card-shadow)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '700', fontSize: '14.5px', color: '#ef4444' }}>
                    Clause #{idx + 1}: {flag.clause}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    background: flag.severity === 'High' ? '#fee2e2' : '#fef9c3',
                    color: flag.severity === 'High' ? '#991b1b' : '#854d0e'
                  }}>
                    {flag.severity || 'Medium'} Severity
                  </span>
                </div>

                <p style={{ margin: '0 0 10px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  <strong>{isHindi ? 'कानूनी समस्या:' : 'Why it is problematic:'}</strong> {flag.issue}
                </p>

                {flag.statute && (
                  <div style={{ display: 'inline-block', background: 'var(--primary-light)', border: '1px solid var(--primary-border)', color: 'var(--primary)', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', marginBottom: '12px' }}>
                    <strong>{isHindi ? 'लागू भारतीय कानून:' : 'Indian Statute:'}</strong> {flag.statute}
                  </div>
                )}

                {flag.fair_alternative && (
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px', marginTop: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={14} /> {isHindi ? 'संतुलित वैकल्पिक शर्त (हस्ताक्षर हेतु सुझाई गई):' : 'Recommended Fair Alternative Clause:'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyClause(flag.fair_alternative, idx)}
                        style={{
                          background: 'var(--card-bg)',
                          border: '1px solid rgba(16, 185, 129, 0.4)',
                          color: '#10b981',
                          borderRadius: '6px',
                          padding: '3px 8px',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontWeight: '600'
                        }}
                      >
                        <Copy size={12} /> {isHindi ? 'कॉपी करें' : 'Copy'}
                      </button>
                    </div>
                    <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-main)', fontFamily: 'monospace', lineHeight: '1.5' }}>
                      "{flag.fair_alternative}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '16px', background: '#f0fdf4', color: '#166534', borderRadius: '8px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> {isHindi ? 'कोई गंभीर एकतरफा शर्त नहीं मिली।' : 'No egregious statutory red flags detected.'}
          </div>
        )}
      </div>

      {/* Missing Protections & Advice */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lightbulb size={18} color="#eab308" />
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
              {isHindi ? 'दस्तावेज में अनुपस्थित सुरक्षाएं' : 'Missing Crucial Protections'}
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.7' }}>
            {analysis.missing_protections?.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
            )) || <li>{isHindi ? 'दस्तावेज का ढांचा संतोषजनक है।' : 'Standard clauses present.'}</li>}
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Scale size={18} color="var(--primary)" />
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
              {isHindi ? 'हस्ताक्षर से पूर्व विधिक सलाह' : 'Actionable Negotiation Advice'}
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.7' }}>
            {analysis.actionable_advice?.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
            )) || <li>{isHindi ? 'वकील से परामर्श अवश्य लें।' : 'Verify terms with an advocate.'}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
