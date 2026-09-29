import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Save, FileText, Trash2, Key, AlertCircle, Download, Eye, Copy, Check, X } from 'lucide-react';

export default function LegalVault({ language = 'English' }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [previewDraft, setPreviewDraft] = useState(null);
  const [copied, setCopied] = useState(false);

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
          <div style={{ background: 'var(--subtle-bg)', border: '1px solid var(--card-border)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Lock size={32} color="var(--primary)" />
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
            style={{ width: '100%', justifyContent: 'center', padding: '12px', background: '#2563eb' }}
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{
        padding: '16px 20px',
        borderRadius: '16px',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: 'var(--card-shadow)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            padding: '10px',
            borderRadius: '12px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
          }}>
            <Unlock size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              {isHindi ? 'आपका सुरक्षित वॉल्ट' : 'Secure Legal Vault'}
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
              {isHindi
                ? 'आपके सहेजे गए सभी कानूनी दस्तावेज़ यहां एन्क्रिप्टेड रूप में सुरक्षित हैं।'
                : 'All your saved legal drafts and contracts are stored securely on-device.'}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setIsAuthenticated(false); setPin(''); }}
          style={{
            background: 'var(--subtle-bg)',
            border: '1px solid var(--card-border)',
            padding: '7px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12.5px',
            fontWeight: '600',
            color: 'var(--text-secondary)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--card-bg)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--subtle-bg)'}
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
              <div key={draft.id} className="hover-tactile" style={{ border: '1px solid var(--card-border)', borderRadius: '12px', padding: '16px', background: 'var(--card-bg)', boxShadow: 'var(--card-shadow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--primary)', background: 'var(--primary-light)', padding: '4px 8px', borderRadius: '6px' }}>
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
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-ghost"
                    onClick={() => setPreviewDraft(draft)}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Eye size={14} /> {isHindi ? 'देखें' : 'View'}
                  </button>
                  <button
                    className="btn-ghost"
                    onClick={() => {
                      const blob = new Blob([draft.content], { type: 'text/plain;charset=utf-8' });
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = `${(draft.title || 'draft').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')}.txt`;
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    <Download size={14} /> {isHindi ? 'डाउनलोड' : 'Download'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDraft && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            maxWidth: '750px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--card-shadow)',
            border: '1px solid var(--card-border)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--subtle-bg)'
            }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--primary)', background: 'var(--primary-light)', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {previewDraft.type}
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '16px', color: 'var(--text-main)', fontWeight: '700' }}>
                  {previewDraft.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDraft(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '6px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: 'var(--card-bg)' }}>
              <pre style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '13.5px',
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: 'var(--text-main)',
                margin: 0
              }}>
                {previewDraft.content}
              </pre>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid var(--card-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '12px',
              background: 'var(--subtle-bg)'
            }}>
              <button
                className="btn-ghost"
                onClick={() => {
                  navigator.clipboard.writeText(previewDraft.content);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
              >
                {copied ? <Check size={15} color="#16a34a" /> : <Copy size={15} />}
                {copied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'कॉपी करें' : 'Copy Text')}
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  const blob = new Blob([previewDraft.content], { type: 'text/plain;charset=utf-8' });
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `${(previewDraft.title || 'draft').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')}.txt`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                }}
              >
                <Download size={15} /> {isHindi ? 'टेक्स्ट डाउनलोड करें' : 'Download TXT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
