import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Mail, Search, AlertTriangle, ShieldCheck, Lock, Globe, Database, ExternalLink } from 'lucide-react';

export default function CyberChecker({ language = 'English' }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [email, setEmail] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleScan = async () => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) return;

    setIsScanning(true);
    setResult(null);
    setErrorMessage(null);

    try {
      // 1. First attempt via Vite proxy / XposedOrNot
      let resData = null;
      try {
        const response = await axios.get(`/api/xposed/check-email/${encodeURIComponent(cleanEmail)}`, {
          timeout: 7000
        });
        resData = response.data;
      } catch (proxyErr) {
        // Fallback directly to public CORS endpoint if available
        try {
          const directResp = await axios.get(`https://api.xposedornot.com/v1/check-email/${encodeURIComponent(cleanEmail)}`, {
            timeout: 6000
          });
          resData = directResp.data;
        } catch {
          throw proxyErr;
        }
      }

      if (resData && resData.Error === 'Not found') {
        // Safe: 0 breaches found
        setResult({
          status: 'safe',
          count: 0,
          breaches: [],
          email: cleanEmail
        });
      } else if (resData && resData.breaches) {
        // Breaches found in real live database
        const rawBreaches = resData.breaches;
        let breachList = [];
        if (Array.isArray(rawBreaches) && rawBreaches.length > 0) {
          const firstElem = rawBreaches[0];
          if (Array.isArray(firstElem)) {
            breachList = firstElem;
          } else {
            breachList = rawBreaches;
          }
        }

        const formatted = breachList.map(name => ({
          name: typeof name === 'string' ? name : (name.name || 'Identified Database'),
          data: 'Email, Passwords or Account Credentials'
        }));

        setResult({
          status: 'breached',
          count: formatted.length,
          breaches: formatted,
          email: cleanEmail
        });
      } else {
        setResult({
          status: 'safe',
          count: 0,
          breaches: [],
          email: cleanEmail
        });
      }
    } catch (err) {
      console.warn('Real cyber scan error:', err);
      setErrorMessage(
        isHindi
          ? 'डेटाबेस से कनेक्ट करने में अस्थायी समस्या आई। कृपया थोड़ी देर बाद पुनः प्रयास करें।'
          : 'Unable to reach the live breach database. Please verify your internet connection or try again shortly.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
          padding: '10px',
          borderRadius: '12px',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
        }}>
          <ShieldAlert size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              {isHindi ? 'साइबर क्राइम और डेटा लीक स्कैनर' : 'Cyber Crime & Data Breach Scanner'}
            </h2>
            <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
              Live Breach DB
            </span>
          </div>
          <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
            {isHindi
              ? 'XposedOrNot डेटाबेस के ज़रिए लाइव जांचें कि क्या आपका ईमेल डार्क वेब लीक्स में शामिल है।'
              : 'Live cross-reference against verified global data breaches using authentic open-source intelligence.'}
          </p>
        </div>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '32px', borderRadius: '16px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37, 99, 235, 0.08)', color: '#2563eb', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', marginBottom: '14px' }}>
          <Database size={13} /> Powered by Live Breach Intelligence
        </div>

        <h3 style={{ margin: '0 0 10px', fontSize: '18px', color: 'var(--text-main)' }}>
          {isHindi ? 'सुरक्षित लाइव ईमेल जांच' : 'Secure Live Breach Check'}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '440px', margin: '0 auto 24px', lineHeight: '1.5' }}>
          {isHindi
            ? 'हम आपका ईमेल किसी भी सर्वर पर स्टोर नहीं करते। यह सीधे आधिकारिक डार्क-वेब ब्रीच रिकॉर्ड्स से लाइव मैच होता है।'
            : 'Your email address is directly cross-referenced against authentic public data breaches. Search records are never logged.'}
        </p>

        <div style={{ display: 'flex', gap: '12px', maxWidth: '520px', margin: '0 auto' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '15px' }} />
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={isHindi ? "अपना ईमेल एड्रेस दर्ज करें (उदा. user@gmail.com)..." : "Enter email to check (e.g. user@gmail.com)..."}
              style={{ paddingLeft: '44px', height: '48px' }}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
            />
          </div>
          <button
            type="button"
            className="btn-primary"
            onClick={handleScan}
            disabled={isScanning || !email}
            style={{ height: '48px', padding: '0 24px', background: isScanning ? '#94a3b8' : '#dc2626' }}
          >
            {isScanning ? (
              isHindi ? 'लाइव स्कैन...' : 'Scanning...'
            ) : (
              <><Search size={18} /> {isHindi ? 'स्कैन करें' : 'Scan Live'}</>
            )}
          </button>
        </div>

        {errorMessage && (
          <div style={{ background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '12px', borderRadius: '10px', maxWidth: '520px', margin: '20px auto 0', fontSize: '13px' }}>
            {errorMessage}
          </div>
        )}

        {result && (
          <div className="animate-fade-in" style={{ marginTop: '32px', textAlign: 'left', maxWidth: '540px', margin: '32px auto 0' }}>
            {result.status === 'safe' ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                <ShieldCheck size={48} color="#16a34a" style={{ marginBottom: '12px' }} />
                <h4 style={{ margin: '0 0 8px', color: '#166534', fontSize: '18px' }}>
                  {isHindi ? 'सुरक्षित! कोई डेटा लीक नहीं मिला।' : 'Good News! No Breaches Found.'}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#15803d', lineHeight: '1.5' }}>
                  {isHindi
                    ? `ईमेल (${result.email}) किसी भी ज्ञात सार्वजनिक या डार्क-वेब डेटा ब्रीच में नहीं पाया गया है।`
                    : `The email (${result.email}) was not found in any monitored global data breaches.`}
                </p>
              </div>
            ) : (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#991b1b' }}>
                  <AlertTriangle size={32} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '18px' }}>
                      {isHindi ? 'चेतावनी! असली डेटा लीक पाया गया' : 'Warning! Data Breach Detected'}
                    </h4>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                      {isHindi ? `यह ईमेल ${result.count} आधिकारिक ब्रीचेस में पाया गया है:` : `Compromised in ${result.count} verified public breaches:`}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                  {result.breaches.map((b, i) => (
                    <div key={i} style={{ background: 'var(--card-bg)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--card-shadow)' }}>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#ef4444', display: 'block' }}>{b.name}</strong>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{isHindi ? 'लीक श्रेणी:' : 'Exposed Category:'} {b.data}</span>
                      </div>
                      <span style={{ fontSize: '11px', background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
                        Breached
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px', padding: '12px 14px', background: '#fee2e2', borderRadius: '8px', fontSize: '12.5px', color: '#7f1d1d', lineHeight: '1.5' }}>
                  <Lock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                  {isHindi
                    ? 'सलाह: इन संबंधित खातों का पासवर्ड तुरंत बदलें तथा 2-Factor Authentication (2FA) ऑन करें। किसी भी वित्तीय ठगी पर तुरंत 1930 हेल्पलाइन पर कॉल करें।'
                    : 'Security Advisory: Immediately reset passwords for these services and enable Two-Factor Authentication (2FA). For financial cyber fraud, report promptly at 1930.'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
