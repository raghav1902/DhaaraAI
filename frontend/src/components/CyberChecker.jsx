import React, { useState } from 'react';
import axios from 'axios';
import { ShieldAlert, Mail, Search, AlertTriangle, ShieldCheck, Lock, Globe, Database, PhoneCall, ExternalLink } from 'lucide-react';
import './CyberChecker.css';

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
        // Breaches found in live database
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

        const formatted = breachList.map((name) => ({
          name: typeof name === 'string' ? name : name.name || 'Identified Breach Incident',
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
      console.warn('Live cyber scan connection error:', err);
      setErrorMessage(
        isHindi
          ? 'XposedOrNot डेटाबेस से कनेक्ट करने में अस्थायी समस्या आई। कृपया थोड़ी देर बाद पुनः प्रयास करें।'
          : 'Unable to reach the live XposedOrNot breach repository. Please verify your connection or try again shortly.'
      );
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="cyber-scanner animate-fade-in">
      {/* Header Banner */}
      <div className="cyber-scanner__header">
        <div className="cyber-scanner__header-left">
          <div className="cyber-scanner__icon-badge">
            <ShieldAlert size={22} />
          </div>
          <div>
            <div className="cyber-scanner__title-row">
              <h2 className="cyber-scanner__title">
                {isHindi ? 'साइबर फ्रॉड व लीक चेकर' : 'Cyber Exposure & Breach Scanner'}
              </h2>
              <span className="badge badge-purple">
                XposedOrNot API
              </span>
            </div>
            <p className="cyber-scanner__subtitle">
              {isHindi
                ? 'सार्वजनिक सुरक्षा रिकॉर्ड्स (XposedOrNot) के ज़रिए सत्यापित करें कि क्या आपका ईमेल किसी ज्ञात डेटा लीक में शामिल है।'
                : 'Query verified public breach datasets via XposedOrNot to detect credential and account exposure.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Scanner Workspace */}
      <div className="cyber-scanner__workspace">
        <div className="cyber-scanner__source-badge">
          <Database size={13} />
          <span>Verified Breach Index (XposedOrNot)</span>
        </div>

        <h3 className="cyber-scanner__prompt-title">
          {isHindi ? 'ईमेल ब्रीच सत्यापन' : 'Check Email for Known Security Breaches'}
        </h3>
        <p className="cyber-scanner__prompt-desc">
          {isHindi
            ? 'आपका ईमेल DhaaraAI के सर्वर पर सुरक्षित नहीं किया जाता। यह सीधे सार्वजनिक लीक रिकॉर्ड्स से मिलान करता है।'
            : 'Your address is checked against authenticated public incident databases. We never store or log your queries.'}
        </p>

        {/* Input Bar */}
        <div className="cyber-scanner__input-form">
          <div className="cyber-scanner__input-wrapper">
            <Mail size={18} className="cyber-scanner__input-icon" />
            <input
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
              <span>{isHindi ? 'स्कैनिंग जारी...' : 'Querying Database...'}</span>
            ) : (
              <>
                <Search size={16} />
                <span>{isHindi ? 'जांच करें' : 'Scan Records'}</span>
              </>
            )}
          </button>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="cyber-scanner__error-alert">
            <AlertTriangle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Results Presentation */}
        {result && (
          <div className="cyber-scanner__results animate-fade-in">
            {result.status === 'safe' ? (
              <div className="cyber-scanner__safe-card">
                <div className="cyber-scanner__safe-icon-wrap">
                  <ShieldCheck size={36} />
                </div>
                <h4 className="cyber-scanner__safe-title">
                  {isHindi ? 'कोई सार्वजनिक डेटा लीक नहीं मिला' : 'Zero Breaches Detected'}
                </h4>
                <p className="cyber-scanner__safe-desc">
                  {isHindi
                    ? `ईमेल (${result.email}) XposedOrNot के किसी भी ज्ञात सार्वजनिक डेटा ब्रीच में नहीं पाया गया।`
                    : `The queried address (${result.email}) does not appear in any indexed public security breaches.`}
                </p>
              </div>
            ) : (
              <div className="cyber-scanner__breach-card">
                <div className="cyber-scanner__breach-header">
                  <div className="cyber-scanner__breach-icon-wrap">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="cyber-scanner__breach-title">
                      {isHindi ? 'डेटा उल्लंघन रिकॉर्ड पाया गया' : 'Public Breach Exposure Detected'}
                    </h4>
                    <span className="cyber-scanner__breach-count">
                      {isHindi
                        ? `यह ईमेल ${result.count} सार्वजनिक सुरक्षा लीक्स में दर्ज है:`
                        : `Identified in ${result.count} verified public security incident(s):`}
                    </span>
                  </div>
                </div>

                <div className="cyber-scanner__breach-list">
                  {result.breaches.map((b, i) => (
                    <div key={i} className="cyber-scanner__breach-row">
                      <div>
                        <strong className="cyber-scanner__breach-name">{b.name}</strong>
                        <span className="cyber-scanner__breach-meta">
                          {isHindi ? 'संभावित संवेदनशील डेटा:' : 'Potentially Exposed Data:'} {b.data}
                        </span>
                      </div>
                      <span className="badge badge-danger">
                        Exposed
                      </span>
                    </div>
                  ))}
                </div>

                {/* Indian Statutory Remediation Guidance */}
                <div className="cyber-scanner__remediation-box">
                  <div className="cyber-scanner__remediation-title">
                    <Lock size={15} />
                    <span>{isHindi ? 'अनुशंसित सुरक्षा व कानूनी कदम:' : 'Recommended Remediation Protocol:'}</span>
                  </div>
                  <ul className="cyber-scanner__remediation-steps">
                    <li>
                      {isHindi
                        ? 'संबंधित सेवा के पासवर्ड को तुरंत बदलें और दो-चरणीय प्रमाणीकरण (2FA) सक्षम करें।'
                        : 'Change your passwords immediately on affected portals and enforce Two-Factor Authentication (2FA).'}
                    </li>
                    <li>
                      {isHindi
                        ? 'यदि वित्तीय धोखाधड़ी हुई है, तो तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें।'
                        : 'If unauthorized financial transactions occurred, call the National Cyber Crime Helpline at 1930 immediately.'}
                    </li>
                    <li>
                      {isHindi
                        ? 'आधिकारिक पोर्टल (cybercrime.gov.in) पर औपचारिक शिकायत दर्ज करें।'
                        : 'File an official report on the Government of India portal: cybercrime.gov.in'}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
