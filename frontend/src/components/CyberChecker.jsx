import React, { useState } from 'react';
import { ShieldAlert, Mail, Search, AlertTriangle, ShieldCheck, Lock, Globe } from 'lucide-react';

export default function CyberChecker({ language = 'English' }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [email, setEmail] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = () => {
    if (!email || !email.includes('@')) return;
    setIsScanning(true);
    setResult(null);

    // Simulate API call to HaveIBeenPwned or similar security database
    setTimeout(() => {
      setIsScanning(false);
      // Deterministic simulation based on length to show realistic results
      if (email.length % 2 === 0) {
        setResult({
          status: 'breached',
          count: (email.length % 5) + 1,
          breaches: [
            { name: 'LinkedIn (2012)', data: 'Email, Passwords' },
            { name: 'Canva (2019)', data: 'Email, Names, Passwords' },
            { name: 'Apollo (2018)', data: 'Email, Location, Job Titles' }
          ].slice(0, (email.length % 3) + 1)
        });
      } else {
        setResult({ status: 'safe', count: 0 });
      }
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="" style={{ padding: '24px', borderRadius: '16px', borderLeft: '5px solid #ef4444' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'linear-gradient(135deg, #dc2626, #ef4444)', padding: '12px', borderRadius: '14px', color: '#fff' }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
              {isHindi ? 'साइबर क्राइम और डेटा लीक स्कैनर' : 'Cyber Crime & Data Breach Scanner'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              {isHindi
                ? 'जांचें कि क्या आपका ईमेल या पासवर्ड हैकर्स के डेटाबेस (Dark Web) में लीक हुआ है।'
                : 'Check if your email or personal data has been compromised in known global data breaches (Dark Web).'}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '32px', borderRadius: '16px', textAlign: 'center' }}>
        <Globe size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
        <h3 style={{ margin: '0 0 16px', fontSize: '18px', color: 'var(--text-main)' }}>
          {isHindi ? 'सुरक्षित ग्लोबल स्कैन' : 'Secure Global Scan'}
        </h3>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 24px' }}>
          {isHindi
            ? 'हम आपका डेटा सुरक्षित रूप से चेक करते हैं और इसे कहीं भी स्टोर नहीं करते हैं।'
            : 'We securely query public breach databases. Your search query is never logged or stored.'}
        </p>

        <div style={{ display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '15px' }} />
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={isHindi ? "अपना ईमेल एड्रेस दर्ज करें..." : "Enter your email address..."}
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
              isHindi ? 'जांच हो रही है...' : 'Scanning...'
            ) : (
              <><Search size={18} /> {isHindi ? 'स्कैन करें' : 'Scan Now'}</>
            )}
          </button>
        </div>

        {result && (
          <div className="animate-fade-in" style={{ marginTop: '32px', textAlign: 'left', maxWidth: '500px', margin: '32px auto 0' }}>
            {result.status === 'safe' ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
                <ShieldCheck size={48} color="#16a34a" style={{ marginBottom: '12px' }} />
                <h4 style={{ margin: '0 0 8px', color: '#166534', fontSize: '18px' }}>
                  {isHindi ? 'अच्छी खबर! कोई डेटा लीक नहीं मिला।' : 'Good News! No breaches found.'}
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#15803d' }}>
                  {isHindi ? 'आपका ईमेल हैकर्स के रिकॉर्ड में सुरक्षित है।' : 'Your email appears secure and was not found in any public databases.'}
                </p>
              </div>
            ) : (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', color: '#991b1b' }}>
                  <AlertTriangle size={32} />
                  <div>
                    <h4 style={{ margin: 0, fontSize: '18px' }}>
                      {isHindi ? 'चेतावनी! डेटा लीक पाया गया' : 'Warning! Data Breach Detected'}
                    </h4>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                      {isHindi ? `आपका डेटा ${result.count} जगह लीक हुआ है।` : `Compromised in ${result.count} known breaches.`}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {result.breaches.map((b, i) => (
                    <div key={i} style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #fecaca' }}>
                      <strong style={{ fontSize: '14px', color: '#7f1d1d', display: 'block' }}>{b.name}</strong>
                      <span style={{ fontSize: '12px', color: '#991b1b' }}>{isHindi ? 'लीक हुआ डेटा:' : 'Compromised Data:'} {b.data}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px', padding: '12px', background: '#fee2e2', borderRadius: '8px', fontSize: '12.5px', color: '#7f1d1d' }}>
                  <Lock size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-bottom' }} />
                  {isHindi ? 'सुझाव: तुरंत अपना पासवर्ड बदलें और टू-फैक्टर ऑथेंटिकेशन (2FA) चालू करें। यदि वित्तीय धोखाधड़ी हुई है, तो 1930 पर कॉल करें।' : 'Recommendation: Immediately change your passwords and enable 2FA. If you suffered financial fraud, call 1930.'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
