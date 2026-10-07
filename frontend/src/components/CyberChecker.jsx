import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  ShieldAlert, Mail, Search, AlertTriangle, ShieldCheck, Lock, Database,
  AlertCircle, Copy, Check, ExternalLink, TrendingUp, Eye, KeyRound, Info, Crown
} from 'lucide-react';
import { API_BASE } from '../config/apiConfig';
import ProFeatureLock from './ProFeatureLock';
import './CyberChecker.css';

// Known breach categories → estimated data types
const BREACH_DATA_MAP = {
  linkedin: ['Email', 'Password Hash', 'Professional Profile', 'Phone'],
  adobe: ['Email', 'Password Hash', 'Username', 'Encrypted Password'],
  canva: ['Email', 'Username', 'Name', 'City'],
  collection1: ['Email', 'Plaintext Password'],
  facebook: ['Email', 'Phone', 'Name', 'Birthday', 'Location'],
  twitter: ['Email', 'Phone', 'Username'],
  dropbox: ['Email', 'Password Hash'],
  myspace: ['Email', 'Password Hash', 'Username'],
  yahoo: ['Email', 'Password', 'Security Questions', 'Date of Birth'],
  snapchat: ['Username', 'Phone'],
  quora: ['Email', 'Username', 'IP Address'],
  paytm: ['Email', 'Phone', 'Name'],
  zomato: ['Email', 'Password Hash'],
  bookmyshow: ['Email', 'Name', 'Phone'],
  juspay: ['Email', 'Phone', 'Masked Card', 'Name'],
  dominos: ['Email', 'Phone', 'Address', 'Name'],
  bigbasket: ['Email', 'Phone', 'Name', 'Address', 'Password Hash'],
  airtel: ['Email', 'Phone', 'Name', 'Address'],
  ola: ['Email', 'Phone', 'Name', 'Trip History'],
};

const HIGH_SEVERITY = ['yahoo', 'collection1', 'facebook', 'juspay', 'bigbasket', 'adobe', 'linkedin'];

function getBreachMeta(name) {
  const key = name.toLowerCase().replace(/[^a-z]/g, '');
  for (const k of Object.keys(BREACH_DATA_MAP)) {
    if (key.includes(k)) return { data: BREACH_DATA_MAP[k], severity: HIGH_SEVERITY.includes(k) ? 'critical' : 'high' };
  }
  return { data: ['Email', 'Password Hash', 'Account Credentials'], severity: 'medium' };
}

function getRiskScore(breachCount) {
  if (breachCount === 0) return { score: 100, label: 'Clean', color: 'safe', grade: 'A' };
  if (breachCount === 1) return { score: 72, label: 'At Risk', color: 'warning', grade: 'C' };
  if (breachCount <= 3) return { score: 45, label: 'High Risk', color: 'danger', grade: 'D' };
  return { score: 12, label: 'Critical', color: 'critical', grade: 'F' };
}

export default function CyberChecker({
  language = 'English',
  user,
  onNavigateTab,
  onOpenUpgradeModal
}) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';
  const isPro = user?.plan === 'plus' || user?.plan === 'pro' || user?.plan === 'enterprise';

  const [usageStats, setUsageStats] = useState(null);

  const fetchUsage = async () => {
    try {
      const token = user?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE}/api/user/usage`, { headers });
      setUsageStats(res.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [user]);

  const scansUsed = usageStats?.features?.cyber_check?.used ?? 0;
  const scanLimit = usageStats?.features?.cyber_check?.limit ?? 3;
  const scansRemaining = isPro ? 999 : Math.max(0, scanLimit - scansUsed);

  const [email, setEmail] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  const [savedToVault, setSavedToVault] = useState(false);

  const handleScan = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      inputRef.current?.focus();
      return;
    }

    if (!isPro && scansRemaining <= 0) {
      const msg = isHindi
        ? 'निःशुल्क 3 साइबर स्कैन की सीमा पूरी हो चुकी है। असीमित स्कैनिंग व पूर्ण ब्रीच रिपोर्ट के लिए DhaaraAI Plus में अपग्रेड करें।'
        : 'Free tier limit of 3 cyber scans reached. Upgrade to DhaaraAI Plus for unlimited breach analysis.';
      setErrorMessage(msg);
      if (onOpenUpgradeModal) onOpenUpgradeModal('Cyber Exposure & Breach Scanner', msg);
      else if (onNavigateTab) onNavigateTab('settings');
      return;
    }

    setIsScanning(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const token = user?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(`${API_BASE}/api/cyber-check?email=${encodeURIComponent(cleanEmail)}`, { headers });
      const resData = response.data;

      if (resData.status === 'safe') {
        setResult({ status: 'safe', count: 0, breaches: [], email: cleanEmail });
      } else if (resData.status === 'breached') {
        const breaches = (resData.breaches || []).map((b) => {
          const meta = getBreachMeta(b.name);
          return {
            name: b.name,
            data: b.is_locked ? ['•••••••••• (Plus Required)'] : meta.data,
            severity: meta.severity,
            is_locked: b.is_locked
          };
        });
        setResult({
          status: 'breached',
          count: resData.count || breaches.length,
          breaches,
          email: cleanEmail
        });
      } else {
        setResult({ status: 'safe', count: 0, breaches: [], email: cleanEmail });
      }
      fetchUsage();
    } catch (err) {
      if (err.response?.status === 403) {
        const msg = err.response?.data?.detail?.message ||
          (isHindi ? 'निःशुल्क 3 स्कैन सीमा पूरी हो गई है।' : 'Free tier limit of 3 cyber scans reached.');
        setErrorMessage(msg);
        if (onOpenUpgradeModal) onOpenUpgradeModal('Cyber Exposure & Breach Scanner', msg);
        else if (onNavigateTab) onNavigateTab('settings');
      } else {
        setErrorMessage(
          isHindi
            ? 'XposedOrNot डेटाबेस से कनेक्ट करने में समस्या। कृपया पुनः प्रयास करें।'
            : 'Unable to reach the breach database. Check your connection or try again shortly.'
        );
      }
    } finally {
      setIsScanning(false);
    }
  };

  const handleSaveToVault = () => {
    if (!result) return;
    try {
      const drafts = JSON.parse(localStorage.getItem('dhaara_vault_drafts') || '[]');
      const breachDetails = result.breaches.map((b, i) => `[${i + 1}] Incident: ${b.name} | Compromised: ${Array.isArray(b.data) ? b.data.join(', ') : b.data}`).join('\n');
      const reportText = `DHAARAAI CYBER INCIDENT & BREACH AUDIT REPORT
Target Identifier: ${result.email}
Scan Timestamp: ${new Date().toLocaleString()}
Exposure Status: ${result.status.toUpperCase()} (${result.count} breach incidents detected)

--- VERIFIED BREACH INCIDENTS ---
${breachDetails || 'No indexed public breaches found.'}

--- STATUTORY REMEDIATION PROTOCOL (CERT-In & IT Act 2000) ---
1. Immediate credential rotation on primary and affiliated accounts.
2. Mandatory enforcement of Multi-Factor Authentication (MFA / 2FA).
3. If unauthorized transactions or banking debits occurred, dial National Cyber Crime Helpline at 1930 immediately to freeze beneficiary bank accounts.
4. Formal reporting at cybercrime.gov.in (National Cyber Crime Reporting Portal).`;

      drafts.push({
        id: `cyber_${Date.now()}`,
        type: 'Cyber Breach Incident Audit',
        title: `Cyber Audit - ${result.email} (${result.count} Breaches)`,
        content: reportText,
        date: new Date().toISOString()
      });

      localStorage.setItem('dhaara_vault_drafts', JSON.stringify(drafts));
      setSavedToVault(true);
      setTimeout(() => setSavedToVault(false), 2500);
    } catch (e) {
      console.error('Error saving cyber report to vault:', e);
    }
  };

  const copyReport = () => {
    if (!result) return;
    const lines = result.status === 'safe'
      ? [`DHAARAAI CYBER SCAN REPORT\nEmail: ${result.email}\nStatus: CLEAN — No public breaches found.\nScan Date: ${new Date().toLocaleDateString('en-IN')}`]
      : [
          `DHAARAAI CYBER BREACH REPORT`,
          `Email: ${result.email}`,
          `Breaches Found: ${result.count}`,
          `Risk Level: ${getRiskScore(result.count).label}`,
          `\nAFFECTED PLATFORMS:`,
          ...result.breaches.map(b => `• ${b.name} — Data: ${Array.isArray(b.data) ? b.data.join(', ') : b.data} [${(b.severity || 'medium').toUpperCase()}]`),
          `\nREMEDIATION:`,
          `1. Change passwords on all affected platforms immediately`,
          `2. Enable 2FA on all accounts`,
          `3. If financial fraud: Call 1930 (National Cyber Helpline)`,
          `4. File complaint: cybercrime.gov.in`,
          `5. Legal remedy: IT Act 2000 Sec 66, 66C, 72A`,
          `\nScan Date: ${new Date().toLocaleDateString('en-IN')}`,
        ];
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const risk = result ? getRiskScore(result.count) : null;
  return (
    <div className="cyber-scanner animate-fade-in">
      {/* Header */}
      <div className="cyber-scanner__header">
        <div className="cyber-scanner__header-left">
          <div className="cyber-scanner__icon-badge"><ShieldAlert size={22} /></div>
          <div>
            <h2 className="cyber-scanner__title">
              {isHindi ? 'साइबर फ्रॉड व लीक चेकर' : 'Cyber Exposure & Breach Scanner'}
            </h2>
            <p className="cyber-scanner__subtitle">
              {isHindi
                ? 'XposedOrNot द्वारा सत्यापित सार्वजनिक डेटा लीक रिकॉर्ड्स जांचें। IT Act 2000 के तहत कानूनी सहायता।'
                : 'Query verified public breach datasets. Detect credential exposure. Get IT Act remediation steps.'}
            </p>
          </div>
        </div>

        {/* Live Quota Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', position: 'relative', zIndex: 2 }}>
          {isPro ? (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(217,119,6,0.08))',
              color: '#f59e0b', border: '1px solid rgba(245,158,11,0.35)',
              boxShadow: '0 2px 8px rgba(245,158,11,0.1)'
            }}>
              PLUS
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onOpenUpgradeModal ? onOpenUpgradeModal('Cyber Exposure & Breach Scanner', 'Upgrade to DhaaraAI Plus for unlimited scans and unmasked breach intelligence.') : onNavigateTab && onNavigateTab('settings')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 500,
                background: scansRemaining <= 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: scansRemaining <= 0 ? '#fca5a5' : 'var(--text-main, #e2e8f0)',
                border: scansRemaining <= 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                cursor: 'pointer', transition: 'all 0.2s ease',
                boxShadow: scansRemaining <= 0 ? '0 2px 10px rgba(239, 68, 68, 0.15)' : '0 2px 6px rgba(0, 0, 0, 0.2)'
              }}
              title={scansRemaining <= 0 ? "Quota exhausted. Click to upgrade." : "Live usage quota"}
            >
              <span style={{ color: scansRemaining <= 0 ? '#ef4444' : 'var(--text-muted, #94a3b8)', fontWeight: 600 }}>
                Scans: <span style={{ color: scansRemaining <= 0 ? '#ef4444' : '#6366f1' }}>{scansUsed}</span>/{scanLimit}
              </span>
              <span style={{ opacity: 0.4 }}>•</span>
              {scansRemaining <= 0 ? (
                <span style={{ color: '#ef4444', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block', boxShadow: '0 0 6px #ef4444' }} />
                  Limit Reached (Upgrade)
                </span>
              ) : (
                <span style={{ color: '#10b981', fontWeight: 600 }}>
                  {scansRemaining} left
                </span>
              )}
            </button>
          )}
        </div>

        <div className="module-banner-visual" aria-hidden="true">
          <img
            src="/assets/legal/cyber/cyber_network.webp"
            alt=""
            className="module-banner-image"
            loading="lazy"
          />
          <div className="module-banner-gradient" />
        </div>
      </div>

      {/* Workspace */}
      <div className="cyber-scanner__workspace">
        <div className="cyber-scanner__workspace-inner">


          <h3 className="cyber-scanner__prompt-title">
            {isHindi ? 'ईमेल ब्रीच सत्यापन' : 'Check Email for Known Security Breaches'}
          </h3>
          <p className="cyber-scanner__prompt-desc">
            {isHindi
              ? 'आपका ईमेल DhaaraAI के सर्वर पर सुरक्षित नहीं रखा जाता। सीधे सार्वजनिक लीक रिकॉर्ड्स से मिलान होता है।'
              : 'Your address is matched against public incident databases only. We never store or log your queries.'}
          </p>

          {/* Input */}
          <div className="cyber-scanner__input-form">
            <div className="cyber-scanner__input-wrapper">
              <Mail size={18} className="cyber-scanner__input-icon" />
              <input
                ref={inputRef}
                type="email"
                className="input-field cyber-scanner__input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isHindi ? 'उदा. advocate.sharma@example.com' : 'e.g. advocate.sharma@example.com'}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
                aria-label={isHindi ? 'ईमेल दर्ज करें' : 'Enter email to scan'}
              />
            </div>
            <button
              type="button"
              className="btn-primary cyber-scanner__submit-btn"
              onClick={handleScan}
              disabled={isScanning || !email}
            >
              {isScanning ? (
                <span className="cyber-scanner__scanning-text">
                  <span className="cyber-scanner__pulse-dot" />
                  {isHindi ? 'स्कैनिंग...' : 'Scanning…'}
                </span>
              ) : (
                <><Search size={16} /><span>{isHindi ? 'जांच करें' : 'Scan Now'}</span></>
              )}
            </button>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="cyber-scanner__error-alert">
              <AlertTriangle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="cyber-scanner__results animate-fade-in">
              {/* Risk Score Header */}
              <div className={`cyber-scanner__risk-header cyber-risk--${risk.color}`}>
                <div className="cyber-scanner__risk-score-wrap">
                  <div className={`cyber-scanner__risk-score`}>{risk.score}</div>
                  <div className="cyber-scanner__risk-grade">{risk.grade}</div>
                </div>
                <div className="cyber-scanner__risk-info">
                  <span className="cyber-scanner__risk-label">{risk.label}</span>
                  <span className="cyber-scanner__risk-email">{result.email}</span>
                  <span className="cyber-scanner__risk-count">
                    {result.count === 0
                      ? (isHindi ? 'कोई सार्वजनिक उल्लंघन नहीं मिला' : 'No public breaches found')
                      : (isHindi ? `${result.count} सार्वजनिक उल्लंघन दर्ज` : `Found in ${result.count} public breach(es)`)}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="cyber-scanner__copy-btn" onClick={copyReport} type="button">
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? (isHindi ? 'कॉपी हो गया' : 'Copied!') : (isHindi ? 'रिपोर्ट कॉपी' : 'Copy Report')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveToVault}
                    className="cyber-scanner__copy-btn"
                    title={isHindi ? 'वॉल्ट में सहेजें' : 'Save to Vault'}
                  >
                    {savedToVault ? <ShieldCheck size={14} color="var(--emerald-600)" /> : <ShieldCheck size={14} />}
                    <span>{savedToVault ? (isHindi ? 'सुरक्षित!' : 'Saved!') : (isHindi ? 'वॉल्ट में सहेजें' : 'Save to Vault')}</span>
                  </button>
                </div>
              </div>

              {result.status === 'safe' ? (
                <div className="cyber-scanner__safe-card">
                  <div className="cyber-scanner__safe-icon-wrap"><ShieldCheck size={36} /></div>
                  <h4 className="cyber-scanner__safe-title">{isHindi ? 'कोई सार्वजनिक डेटा लीक नहीं मिला' : 'Zero Public Breaches Detected'}</h4>
                  <p className="cyber-scanner__safe-desc">
                    {isHindi
                      ? `यह ईमेल किसी ज्ञात सार्वजनिक डेटा ब्रीच में नहीं पाया गया।`
                      : `This address does not appear in any indexed public security incident database.`}
                  </p>
                  <div className="cyber-scanner__safe-tips">
                    <div className="cyber-scanner__safe-tips-title">
                      <Eye size={13} /> {isHindi ? 'सर्वोत्तम सुरक्षा अभ्यास' : 'Best Practices to Stay Safe'}
                    </div>
                    <ul>
                      <li>{isHindi ? 'अलग-अलग साइट पर अलग पासवर्ड उपयोग करें' : 'Use unique passwords per site (use a password manager)'}</li>
                      <li>{isHindi ? '2FA सक्षम रखें' : 'Always enable Two-Factor Authentication (2FA)'}</li>
                      <li>{isHindi ? 'फ़िशिंग लिंक से सावधान रहें' : 'Beware of phishing emails and suspicious links'}</li>
                      <li>{isHindi ? 'नियमित रूप से पासवर्ड बदलें' : 'Rotate passwords every 90 days'}</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="cyber-scanner__breach-card">
                  {/* Breach List */}
                  <div className="cyber-scanner__breach-list-header">
                    <AlertTriangle size={16} />
                    <span>{isHindi ? 'उजागर हुए प्लेटफ़ॉर्म' : 'Affected Platforms & Exposed Data'}</span>
                  </div>
                  <div className="cyber-scanner__breach-list">
                    {result.breaches.map((b, i) => (
                      <div key={i} className={`cyber-scanner__breach-row severity--${b.severity}`}>
                        <div className="cyber-scanner__breach-row-left">
                          <strong className="cyber-scanner__breach-name">{b.name}</strong>
                          <div className="cyber-scanner__breach-data-types">
                            {b.data.map((d, di) => (
                              <span key={di} className="cyber-scanner__data-chip">{d}</span>
                            ))}
                          </div>
                        </div>
                        <span className={`cyber-scanner__severity-badge sev--${b.severity}`}>
                          {b.severity === 'critical' ? '⚠ Critical' : b.severity === 'high' ? '● High' : '○ Medium'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* IT Act Legal Panel */}
                  <div className="cyber-scanner__legal-panel">
                    <div className="cyber-scanner__legal-title">
                      <TrendingUp size={14} />
                      <span>{isHindi ? 'IT Act 2000/2008 — आपके कानूनी अधिकार' : 'IT Act 2000/2008 — Your Legal Rights & Remedies'}</span>
                    </div>
                    <div className="cyber-scanner__legal-grid">
                      <div className="cyber-scanner__legal-card">
                        <span className="cyber-scanner__legal-sec">Sec 66C</span>
                        <span>{isHindi ? 'पहचान की चोरी — 3 वर्ष कारावास' : 'Identity Theft — Up to 3 yrs imprisonment'}</span>
                      </div>
                      <div className="cyber-scanner__legal-card">
                        <span className="cyber-scanner__legal-sec">Sec 66</span>
                        <span>{isHindi ? 'कंप्यूटर से संबंधित अपराध' : 'Computer-related Offences'}</span>
                      </div>
                      <div className="cyber-scanner__legal-card">
                        <span className="cyber-scanner__legal-sec">Sec 72A</span>
                        <span>{isHindi ? 'व्यक्तिगत डेटा का अनधिकृत प्रकटीकरण' : 'Unauthorised Disclosure of Personal Data'}</span>
                      </div>
                      <div className="cyber-scanner__legal-card">
                        <span className="cyber-scanner__legal-sec">DPDP 2023</span>
                        <span>{isHindi ? 'व्यक्तिगत डेटा संरक्षण कानून' : 'Digital Personal Data Protection Act'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Remediation */}
                  <div className="cyber-scanner__remediation-box">
                    <div className="cyber-scanner__remediation-title">
                      <Lock size={15} />
                      <span>{isHindi ? 'तत्काल सुरक्षा एवं कानूनी कदम:' : 'Immediate Remediation Protocol:'}</span>
                    </div>
                    <ol className="cyber-scanner__remediation-steps">
                      <li>
                        <KeyRound size={13} className="step-icon" />
                        <span>{isHindi ? 'प्रभावित पोर्टल का पासवर्ड तुरंत बदलें और 2FA सक्षम करें।' : 'Change passwords on ALL affected platforms immediately and enable 2FA.'}</span>
                      </li>
                      <li>
                        <AlertCircle size={13} className="step-icon" />
                        <span>{isHindi ? 'वित्तीय धोखाधड़ी हुई हो तो राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें।' : 'If financial fraud occurred, call National Cyber Helpline: 1930 immediately.'}</span>
                      </li>
                      <li>
                        <ExternalLink size={13} className="step-icon" />
                        <span>
                          {isHindi ? 'आधिकारिक पोर्टल पर शिकायत दर्ज करें: ' : 'File an official complaint at: '}
                          <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="cyber-link">cybercrime.gov.in</a>
                        </span>
                      </li>
                      <li>
                        <Info size={13} className="step-icon" />
                        <span>{isHindi ? 'Have I Been Pwned (haveibeenpwned.com) पर भी जांच करें।' : 'Cross-verify at haveibeenpwned.com for additional breach context.'}</span>
                      </li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Action Buttons: Dial 1930, Portal link, Save to Vault */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '16px' }}>
                <a
                  href="tel:1930"
                  className="btn-primary"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700'
                  }}
                >
                  <PhoneCall size={15} />
                  <span>{isHindi ? '1930 साइबर हेल्पलाइन डायल करें' : 'Call 1930 Helpline'}</span>
                </a>

                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    textDecoration: 'none'
                  }}
                >
                  <ExternalLink size={15} />
                  <span>cybercrime.gov.in</span>
                </a>

                <button
                  type="button"
                  onClick={handleSaveToVault}
                  className="btn-secondary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '9px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}
                >
                  {savedToVault ? <ShieldCheck size={15} color="var(--emerald-600)" /> : <ShieldCheck size={15} />}
                  <span>{savedToVault ? (isHindi ? 'वॉल्ट में सहेजा गया!' : 'Saved to Vault!') : (isHindi ? 'घटना रिपोर्ट वॉल्ट में सहेजें' : 'Save Report to Vault')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
