import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Copy,
  Lightbulb,
  Scale,
  Save,
  Check,
  AlertTriangle,
  FileCheck2,
  BookOpen
} from 'lucide-react';

export default function AnalysisResultsView({ analysis, isHindi, copyClause }) {
  const [savedToVault, setSavedToVault] = useState(false);

  if (!analysis) return null;

  const getRiskMeta = (score) => {
    const s = String(score).toLowerCase();
    if (s.includes('critical')) {
      return {
        bg: 'var(--danger-light)',
        text: 'var(--danger)',
        border: 'var(--danger-border)',
        label: isHindi ? 'अत्यधिक जोखिम (Critical Risk)' : 'Critical Risk',
        accentColor: '#dc2626'
      };
    }
    if (s.includes('high')) {
      return {
        bg: 'rgba(234, 88, 12, 0.12)',
        text: '#c2410c',
        border: 'rgba(234, 88, 12, 0.3)',
        label: isHindi ? 'उच्च जोखिम (High Risk)' : 'High Risk',
        accentColor: '#ea580c'
      };
    }
    if (s.includes('medium')) {
      return {
        bg: 'var(--warning-light)',
        text: 'var(--warning)',
        border: 'var(--warning-border)',
        label: isHindi ? 'मध्यम जोखिम (Medium Risk)' : 'Medium Risk',
        accentColor: '#d97706'
      };
    }
    return {
      bg: 'var(--accent-light)',
      text: 'var(--accent)',
      border: 'var(--accent-border)',
      label: isHindi ? 'संतोषजनक / कम जोखिम (Low Risk)' : 'Low Risk / Standard',
      accentColor: '#059669'
    };
  };

  const riskMeta = getRiskMeta(analysis.risk_score);
  const redFlagsCount = analysis.red_flags?.length || 0;
  const missingCount = analysis.missing_protections?.length || 0;

  const handleSaveAuditToVault = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('dhaara_vault_drafts') || '[]');
      const formattedAudit = [
        `CONTRACT RISK AUDIT REPORT`,
        `Overall Risk: ${analysis.risk_score}${analysis.risk_percentage != null ? ` (${analysis.risk_percentage}%)` : ''}`,
        `Engine: ${analysis.source || 'Indian Legal Audit Engine (Contract Act 1872)'}`,
        `Date: ${new Date().toLocaleString()}`,
        `\n--- EXECUTIVE SUMMARY ---\n${analysis.summary || 'N/A'}`,
        `\n--- FLAGGED RED FLAGS (${redFlagsCount}) ---`,
        ...(analysis.red_flags || []).map((rf, i) =>
          `\n[${i + 1}] Issue: ${rf.issue || rf.clause}\nStatute: ${rf.statute || rf.applicable_law || 'Indian Law'}\nProblematic Clause:\n"${rf.problematic_clause || rf.clause}"\nReason:\n${rf.statutory_problem || rf.issue}\nBalanced Alternative:\n"${rf.fair_alternative}"`
        ),
        `\n--- MISSING CRUCIAL PROTECTIONS (${missingCount}) ---`,
        ...(analysis.missing_protections || []).map(p => `• ${p}`),
        `\n--- ACTIONABLE NEGOTIATION ADVICE ---`,
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
      console.error('Vault save error:', e);
    }
  };

  return (
    <div className="contract-audit__results" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* 1. Executive Risk Summary Banner */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
              {isHindi ? 'कार्यकारी विधिक जोखिम रिपोर्ट' : 'EXECUTIVE RISK ASSESSMENT'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
              <span style={{
                background: riskMeta.bg,
                color: riskMeta.text,
                border: `1px solid ${riskMeta.border}`,
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '800',
                fontSize: '15px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldAlert size={18} />
                {riskMeta.label}{analysis.risk_percentage != null ? ` (${analysis.risk_percentage}%)` : ''}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span>• <strong>{redFlagsCount}</strong> {isHindi ? 'आपत्तिजनक धाराएं' : 'Red Flags'}</span>
                <span>• <strong>{missingCount}</strong> {isHindi ? 'अनुपस्थित सुरक्षाएं' : 'Missing Safeguards'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleSaveAuditToVault}
              className="btn-ghost"
              style={{
                fontSize: '12.5px',
                padding: '7px 14px',
                background: savedToVault ? 'var(--accent-light)' : 'var(--primary-light)',
                color: savedToVault ? 'var(--accent)' : 'var(--primary)',
                borderColor: savedToVault ? 'var(--accent-border)' : 'var(--primary-border)'
              }}
            >
              {savedToVault ? <Check size={14} color="var(--accent)" /> : <Save size={14} />}
              <span>
                {savedToVault
                  ? (isHindi ? 'वॉल्ट में सहेजा गया!' : 'Saved to Vault!')
                  : (isHindi ? 'वॉल्ट में सहेजें' : 'Save Report to Vault')}
              </span>
            </button>
            <div style={{ background: 'var(--subtle-bg)', padding: '6px 12px', borderRadius: 'var(--radius-xs)', border: '1px solid var(--card-border)', fontSize: '11px', color: 'var(--text-muted)' }}>
              <span>Indian Contract Act 1872 Audited</span>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div style={{ marginTop: '18px', padding: '14px 18px', background: 'var(--subtle-bg)', borderRadius: 'var(--radius-sm)', borderLeft: `4px solid ${riskMeta.accentColor}` }}>
          <h4 style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: '750', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FileCheck2 size={16} color={riskMeta.accentColor} />
            {isHindi ? 'दस्तावेज़ का विधिक सारांश (Executive Summary)' : 'Legal Summary & Assessment'}
          </h4>
          <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
            {analysis.summary}
          </p>
        </div>
      </div>

      {/* 2. Flagged Red Flags & Clauses Breakdown */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <AlertTriangle size={20} color="var(--danger)" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--text-main)' }}>
            {isHindi ? 'चिन्हित आपत्तिजनक शर्तें (Flagged Red Flags)' : 'Problematic Clauses & Unfair Conditions'}
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
                  borderRadius: 'var(--radius-md)',
                  padding: '18px',
                  boxShadow: 'var(--card-shadow)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: '800', fontSize: '14px', color: 'var(--danger)' }}>
                      #{idx + 1}. {flag.clause || `Clause ${idx + 1}`}
                    </span>
                    {flag.statute && (
                      <span style={{
                        background: 'var(--primary-light)',
                        border: '1px solid var(--primary-border)',
                        color: 'var(--primary)',
                        padding: '1px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '11px',
                        fontWeight: '700'
                      }}>
                        {flag.statute}
                      </span>
                    )}
                  </div>

                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: flag.severity === 'High' || flag.severity === 'Critical' ? 'var(--danger-light)' : 'var(--warning-light)',
                    color: flag.severity === 'High' || flag.severity === 'Critical' ? 'var(--danger)' : 'var(--warning)',
                    border: `1px solid ${flag.severity === 'High' || flag.severity === 'Critical' ? 'var(--danger-border)' : 'var(--warning-border)'}`
                  }}>
                    {flag.severity || 'Medium'} Severity
                  </span>
                </div>

                {/* Problem statement */}
                <div style={{ margin: '0 0 12px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  <strong style={{ color: 'var(--text-main)' }}>{isHindi ? 'विधिक आपत्ति: ' : 'Statutory Conflict: '}</strong>
                  {flag.issue || flag.statutory_problem}
                </div>

                {/* Fair alternative clause */}
                {flag.fair_alternative && (
                  <div style={{
                    background: 'var(--accent-light)',
                    border: '1px solid var(--accent-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '14px',
                    marginTop: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle2 size={15} />
                        {isHindi ? 'संतुलित वैकल्पिक शर्त (हस्ताक्षर हेतु सुझाई गई):' : 'Recommended Fair Alternative Clause:'}
                      </span>
                      <button
                        type="button"
                        onClick={() => copyClause(flag.fair_alternative, idx)}
                        style={{
                          background: 'var(--card-bg)',
                          border: '1px solid var(--accent-border)',
                          color: 'var(--accent)',
                          borderRadius: 'var(--radius-xs)',
                          padding: '4px 10px',
                          fontSize: '11.5px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontWeight: '600'
                        }}
                      >
                        <Copy size={12} />
                        <span>{isHindi ? 'कॉपी करें' : 'Copy Clause'}</span>
                      </button>
                    </div>
                    <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.55' }}>
                      "{flag.fair_alternative}"
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '16px', background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-sm)', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>{isHindi ? 'कोई गंभीर एकतरफा शर्त नहीं पाई गई।' : 'No statutory red flags detected. Clauses conform with standard commercial norms.'}</span>
          </div>
        )}
      </div>

      {/* 3. Missing Protections & Strategic Advice */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Lightbulb size={18} color="var(--warning)" />
            <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: '750', color: 'var(--text-main)' }}>
              {isHindi ? 'दस्तावेज में अनुपस्थित आवश्यक सुरक्षाएं' : 'Missing Essential Protections'}
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            {analysis.missing_protections?.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
            )) || <li>{isHindi ? 'दस्तावेज का ढांचा संतोषजनक है।' : 'Standard contractual protections present.'}</li>}
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Scale size={18} color="var(--primary)" />
            <h4 style={{ margin: 0, fontSize: '14.5px', fontWeight: '750', color: 'var(--text-main)' }}>
              {isHindi ? 'हस्ताक्षर से पूर्व विधिक वार्ता सलाह' : 'Actionable Negotiation Strategy'}
            </h4>
          </div>
          <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
            {analysis.actionable_advice?.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '6px' }}>{item}</li>
            )) || <li>{isHindi ? 'वकील से परामर्श अवश्य लें।' : 'Negotiate clauses directly or review with an advocate.'}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
