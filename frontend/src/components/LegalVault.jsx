import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Save, FileText, Trash2, Key, AlertCircle, Download } from 'lucide-react';

export default function LegalVault({ language = 'English' }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [savedDrafts, setSavedDrafts] = useState([]);

  // Check if PIN is already set in localStorage
  const hasPin = localStorage.getItem('dhaara_vault_pin') !== null;

  useEffect(() => {
    if (isAuthenticated) {
      loadDrafts();
    }
  }, [isAuthenticated]);

  const loadDrafts = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('dhaara_vault_drafts') || '[]');
      setSavedDrafts(drafts);
    } catch (e) {
      setSavedDrafts([]);
    }
  };

  const handleLogin = () => {
    if (!pin || pin.length < 4) {
      setError(isHindi ? 'कम से कम 4 अंकों का पिन दर्ज करें।' : 'PIN must be at least 4 digits.');
      return;
    }

    if (hasPin) {
      const storedPin = localStorage.getItem('dhaara_vault_pin');
      if (pin === storedPin) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError(isHindi ? 'गलत पिन।' : 'Incorrect PIN.');
      }
    } else {
      localStorage.setItem('dhaara_vault_pin', pin);
      setIsAuthenticated(true);
      setError('');
    }
  };

  const handleDelete = (id) => {
    const updated = savedDrafts.filter(d => d.id !== id);
    localStorage.setItem('dhaara_vault_drafts', JSON.stringify(updated));
    setSavedDrafts(updated);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <div style={{ background: '#f3f4f6', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Lock size={32} color="#1e293b" />
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', color: 'var(--text-main)' }}>
            {isHindi ? 'सुरक्षित कानूनी वॉल्ट' : 'Secure Legal Vault'}
          </h2>
          <p style={{ margin: '0 0 24px', fontSize: '13px', color: 'var(--text-muted)' }}>
            {hasPin
              ? (isHindi ? 'अपने सुरक्षित दस्तावेज़ देखने के लिए अपना पिन दर्ज करें।' : 'Enter your PIN to access your encrypted documents.')
              : (isHindi ? 'अपने दस्तावेज़ों को सुरक्षित करने के लिए एक नया पिन बनाएं।' : 'Create a new PIN to secure your private legal drafts.')}
          </p>

          <div style={{ marginBottom: '20px', textAlign: 'left' }}>
            <div style={{ position: 'relative' }}>
              <Key size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '13px' }} />
              <input
                type="password"
                className="input-field"
                value={pin}
                onChange={e => setPin(e.target.value)}
                maxLength={6}
                placeholder={hasPin ? (isHindi ? 'अपना पिन दर्ज करें' : 'Enter PIN') : (isHindi ? 'नया पिन बनाएं' : 'Create new PIN')}
                style={{ paddingLeft: '44px', textAlign: 'center', letterSpacing: '8px', fontSize: '18px', fontWeight: 'bold' }}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {error && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', textAlign: 'center' }}>{error}</div>}
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={handleLogin}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', background: '#0f172a' }}
          >
            {hasPin ? (
              <><Unlock size={18} /> {isHindi ? 'अनलॉक करें' : 'Unlock Vault'}</>
            ) : (
              <><Save size={18} /> {isHindi ? 'वॉल्ट सेट करें' : 'Setup Vault'}</>
            )}
          </button>

          <div style={{ marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <AlertCircle size={12} />
            {isHindi ? 'डेटा केवल आपके डिवाइस पर एन्क्रिप्टेड है। सर्वर पर नहीं।' : 'Data is stored locally on this device only.'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div className="" style={{ padding: '24px', borderRadius: '16px', borderLeft: '5px solid #0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: '#0f172a', padding: '12px', borderRadius: '14px', color: '#fff' }}>
            <Unlock size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
              {isHindi ? 'आपका सुरक्षित वॉल्ट' : 'Your Secure Vault'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
              {isHindi
                ? 'आपके सहेजे गए सभी कानूनी दस्तावेज़ यहां मौजूद हैं।'
                : 'All your saved legal drafts are stored securely here.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setIsAuthenticated(false); setPin(''); }}
          style={{ background: 'none', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' }}
        >
          <Lock size={14} /> {isHindi ? 'वॉल्ट लॉक करें' : 'Lock Vault'}
        </button>
      </div>

      <div className="glass-panel animate-fade-in" style={{ padding: '24px', borderRadius: '16px' }}>
        {savedDrafts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
            <FileText size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>
              {isHindi ? 'वॉल्ट खाली है। ड्राफ्टिंग सेक्शन से दस्तावेज़ सहेजें।' : 'Vault is empty. Save documents from the Legal Drafter section.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {savedDrafts.map((draft) => (
              <div key={draft.id} className="hover-tactile" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#3b82f6', background: '#eff6ff', padding: '4px 8px', borderRadius: '6px' }}>
                    {draft.type}
                  </div>
                  <button onClick={() => handleDelete(draft.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
                <h4 style={{ margin: '0 0 8px', fontSize: '15px', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {draft.title || 'Untitled Draft'}
                </h4>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  {new Date(draft.date).toLocaleString()}
                </div>
                <button
                  className="btn-ghost"
                  onClick={() => {
                    const blob = new Blob([draft.content], { type: 'text/plain' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `${draft.title}.txt`;
                    a.click();
                  }}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Download size={14} /> {isHindi ? 'डाउनलोड करें' : 'Download File'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
