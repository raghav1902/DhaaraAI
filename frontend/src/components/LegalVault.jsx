import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Save, FileText, Trash2, Key, AlertCircle, Download, Eye, Copy, Check, X, Shield, Clock } from 'lucide-react';
import './LegalVault.css';

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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && previewDraft) {
        setPreviewDraft(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewDraft]);

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
        setError(isHindi ? 'गलत पिन।' : 'Incorrect PIN. Please try again.');
      }
    } else {
      localStorage.setItem('dhaara_vault_pin', pin);
      setIsAuthenticated(true);
      setError('');
    }
  };

  const handleDelete = (id) => {
    const confirmMsg = isHindi
      ? 'क्या आप वाकई इस सहेजे गए ड्राफ्ट को हटाना चाहते हैं?'
      : 'Are you sure you want to delete this draft from local storage?';
    if (!window.confirm(confirmMsg)) return;

    const updated = savedDrafts.filter((d) => d.id !== id);
    localStorage.setItem('dhaara_vault_drafts', JSON.stringify(updated));
    setSavedDrafts(updated);
  };

  if (!isAuthenticated) {
    return (
      <div className="legal-vault legal-vault--locked">
        <div className="legal-vault__unlock-card animate-fade-in">
          <div className="legal-vault__lock-icon-wrap">
            <Lock size={32} />
          </div>

          <h2 className="legal-vault__unlock-title">
            {isHindi ? 'सुरक्षित कानूनी वॉल्ट' : 'Secure Legal Vault'}
          </h2>

          <p className="legal-vault__unlock-subtitle">
            {hasPin
              ? (isHindi
                  ? 'अपने सहेजे गए दस्तावेज़ देखने के लिए अपना सुरक्षा पिन दर्ज करें।'
                  : 'Enter your 4-6 digit security PIN to access your saved legal documents.')
              : (isHindi
                  ? 'अपने दस्तावेज़ों को सुरक्षित रखने के लिए एक नया सुरक्षा पिन बनाएं।'
                  : 'Set a 4-6 digit security PIN to protect your private legal drafts on this device.')}
          </p>

          <div className="legal-vault__pin-form">
            <div className="legal-vault__pin-input-wrap">
              <Key size={18} className="legal-vault__key-icon" />
              <input
                type="password"
                className="input-field legal-vault__pin-input"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                maxLength={6}
                placeholder={hasPin ? '••••' : '••••'}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                autoFocus
                aria-label={isHindi ? 'पिन दर्ज करें' : 'Enter PIN'}
              />
            </div>

            {error && (
              <div className="legal-vault__error-text">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              className="btn-primary legal-vault__submit-btn"
              onClick={handleLogin}
            >
              {hasPin ? (
                <>
                  <Unlock size={18} />
                  <span>{isHindi ? 'वॉल्ट अनलॉक करें' : 'Unlock Vault'}</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>{isHindi ? 'पिन सेट करें व खोलें' : 'Set PIN & Open Vault'}</span>
                </>
              )}
            </button>
          </div>

          <div className="legal-vault__disclaimer">
            <Shield size={14} />
            <span>
              {isHindi
                ? 'पिन-संरक्षित स्थानीय डिवाइस स्टोरेज • कोई डेटा क्लाउड पर नहीं भेजा जाता'
                : 'PIN-Protected Local Device Storage • All drafts remain strictly on this browser'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="legal-vault animate-fade-in">
      {/* Vault Header */}
      <div className="legal-vault__header">
        <div className="legal-vault__header-left">
          <div className="legal-vault__icon-badge">
            <Unlock size={22} />
          </div>
          <div>
            <div className="legal-vault__title-row">
              <h2 className="legal-vault__title">
                {isHindi ? 'कानूनी वॉल्ट' : 'Legal Document Vault'}
              </h2>
              <span className="badge badge-success">
                {isHindi ? 'अनलॉक' : 'Active Session'}
              </span>
            </div>
            <p className="legal-vault__subtitle">
              {isHindi
                ? 'पिन-संरक्षित स्थानीय डिवाइस स्टोरेज — आपके ड्राफ्ट और अनुबंध सुरक्षित हैं'
                : 'PIN-Protected Local Device Storage — Confidential drafts stored on this browser'}
            </p>
          </div>
        </div>

        <div className="legal-vault__header-actions">
          <div className="legal-vault__count-pill">
            <FileText size={15} />
            <span>{savedDrafts.length} {isHindi ? 'ड्राफ्ट' : 'Drafts'}</span>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPin('');
            }}
            className="btn-secondary legal-vault__lock-btn"
            type="button"
          >
            <Lock size={14} />
            <span>{isHindi ? 'वॉल्ट लॉक करें' : 'Lock Vault'}</span>
          </button>
        </div>
      </div>

      {/* Vault Workspace Area */}
      <div className="legal-vault__workspace">
        {savedDrafts.length === 0 ? (
          <div className="legal-vault__empty">
            <div className="legal-vault__empty-icon">
              <FileText size={40} />
            </div>
            <h3 className="legal-vault__empty-title">
              {isHindi ? 'वॉल्ट अभी खाली है' : 'Vault is Empty'}
            </h3>
            <p className="legal-vault__empty-desc">
              {isHindi
                ? 'ड्राफ्टिंग स्टूडियो या अनुबंध विश्लेषण से दस्तावेज़ तैयार करके "Save to Vault" पर क्लिक करें।'
                : 'Generate petitions, notices, or contracts in the Drafting Studio and click "Save to Vault" to store them here.'}
            </p>
          </div>
        ) : (
          <div className="legal-vault__grid">
            {savedDrafts.map((draft) => (
              <div key={draft.id} className="legal-vault__card">
                <div className="legal-vault__card-header">
                  <span className="badge badge-primary font-mono text-xs">
                    {draft.type || 'LEGAL DRAFT'}
                  </span>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="legal-vault__delete-btn"
                    title={isHindi ? 'हटाएं' : 'Delete Draft'}
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h4 className="legal-vault__card-title">
                  {draft.title || 'Untitled Legal Document'}
                </h4>

                <div className="legal-vault__card-meta">
                  <Clock size={13} />
                  <span>{new Date(draft.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div className="legal-vault__card-actions">
                  <button
                    className="btn-secondary legal-vault__action-btn"
                    onClick={() => setPreviewDraft(draft)}
                    type="button"
                  >
                    <Eye size={14} />
                    <span>{isHindi ? 'देखें' : 'View'}</span>
                  </button>
                  <button
                    className="btn-secondary legal-vault__action-btn"
                    onClick={() => {
                      const blob = new Blob([draft.content], { type: 'text/plain;charset=utf-8' });
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = `${(draft.title || 'legal_draft').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')}.txt`;
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }}
                    type="button"
                  >
                    <Download size={14} />
                    <span>{isHindi ? 'डाउनलोड' : 'Download'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      {previewDraft && (
        <div
          className="legal-vault__modal-overlay"
          onClick={() => setPreviewDraft(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="legal-vault__modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="legal-vault__modal-header">
              <div>
                <span className="badge badge-primary font-mono text-xs">
                  {previewDraft.type || 'DOCUMENT'}
                </span>
                <h3 className="legal-vault__modal-title">
                  {previewDraft.title || 'Untitled Draft'}
                </h3>
              </div>
              <button
                onClick={() => setPreviewDraft(null)}
                className="legal-vault__modal-close"
                type="button"
                aria-label="Close Preview"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="legal-vault__modal-body">
              <pre className="legal-vault__document-text">
                {previewDraft.content}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="legal-vault__modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  navigator.clipboard.writeText(previewDraft.content);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                type="button"
              >
                {copied ? <Check size={15} color="var(--emerald-600)" /> : <Copy size={15} />}
                <span>{copied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'टेक्स्ट कॉपी करें' : 'Copy Text')}</span>
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  const blob = new Blob([previewDraft.content], { type: 'text/plain;charset=utf-8' });
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `${(previewDraft.title || 'legal_draft').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')}.txt`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                }}
                type="button"
              >
                <Download size={15} />
                <span>{isHindi ? 'टेक्स्ट फाइल डाउनलोड करें' : 'Download TXT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
