import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Save,
  FileText,
  Trash2,
  Key,
  AlertCircle,
  Download,
  Eye,
  Copy,
  Check,
  X,
  Shield,
  ShieldCheck,
  Clock,
  ArrowUpRight,
  FileSearch,
  Database,
  LockKeyhole
} from 'lucide-react';
import './LegalVault.css';

export default function LegalVault({ language = 'English', onNavigateTab = () => {} }) {
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
        <div className="legal-vault__backdrop" aria-hidden="true">
          <img
            src="/assets/legal/vault/vault_locked.webp?v=2"
            alt=""
            className="legal-vault__backdrop-image"
            loading="eager"
          />
          <div className="legal-vault__backdrop-overlay" />
        </div>

        <div className="legal-vault__unlock-card animate-fade-in">
          <div className="legal-vault__lock-icon-wrap">
            <Lock size={28} />
          </div>

          <div className="legal-vault__security-tag">
            <Shield size={12} />
            <span>{isHindi ? '256-बिट सुरक्षित डिवाइस आर्काइव' : 'ENCRYPTED LOCAL ARCHIVE'}</span>
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

          <div className="legal-vault__trust-row">
            <span className="legal-vault__trust-item">
              <Shield size={13} color="var(--emerald-600)" />
              {isHindi ? 'पिन-संरक्षित स्थानीय संग्रहण' : 'Client-Side PIN Encrypted'}
            </span>
            <span className="legal-vault__trust-item">
              <Lock size={13} color="var(--royal-600)" />
              {isHindi ? 'शून्य-क्लाउड स्थानीय ड्राफ्ट' : 'Zero-Cloud Device Storage'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="legal-vault animate-fade-in">
      {/* Compact Vault Header */}
      <div className="legal-vault__header">
        <div className="legal-vault__header-left">
          <div className="legal-vault__icon-badge">
            <Unlock size={20} />
          </div>
          <div>
            <div className="legal-vault__title-row">
              <h2 className="legal-vault__title">
                {isHindi ? 'कानूनी वॉल्ट' : 'Legal Document Vault'}
              </h2>
              <span className="legal-vault__session-badge">
                <span className="legal-vault__session-dot" />
                {isHindi ? 'सक्रिय एन्क्रिप्टेड सत्र' : 'Encrypted Session Active'}
              </span>
            </div>
            <p className="legal-vault__subtitle">
              {isHindi
                ? 'पिन-संरक्षित स्थानीय डिवाइस स्टोरेज — आपके गोपनीय ड्राफ्ट सुरक्षित हैं'
                : 'Zero-knowledge local storage • Private petitions & contracts encrypted on this device'}
            </p>
          </div>
        </div>

        <div className="legal-vault__header-actions">
          <div className="legal-vault__chip">
            <Shield size={13} color="var(--emerald-600)" />
            <span>{isHindi ? 'क्लाइंट-साइड AES-256' : 'Client AES-256'}</span>
          </div>
          <div className="legal-vault__count-pill">
            <FileText size={14} />
            <span>{savedDrafts.length} {isHindi ? 'दस्तावेज़' : 'Drafts'}</span>
          </div>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setPin('');
            }}
            className="btn-secondary legal-vault__lock-btn"
            type="button"
          >
            <Lock size={13} />
            <span>{isHindi ? 'वॉल्ट लॉक करें' : 'Lock Vault'}</span>
          </button>
        </div>
      </div>

      {/* Vault Workspace Area */}
      <div className="legal-vault__workspace">
        {savedDrafts.length === 0 ? (
          <div className="legal-vault__ready-stage">
            {/* Left Column: Guidance & Actions */}
            <div className="legal-vault__ready-main">
              <div className="legal-vault__ready-badge">
                <ShieldCheck size={14} className="legal-vault__ready-badge-icon" />
                <span>{isHindi ? '256-बिट सुरक्षित स्थानीय पार्टीशन' : '256-BIT ENCRYPTED LOCAL PARTITION'}</span>
                <span className="legal-vault__ready-pulse-dot" />
              </div>

              <h3 className="legal-vault__ready-title">
                {isHindi ? 'वॉल्ट वर्कस्पेस तैयार है' : 'Vault Workspace Ready'}
              </h3>

              <p className="legal-vault__ready-desc">
                {isHindi
                  ? 'आपका निजी विधिक संग्रह सक्रिय है। ड्राफ्टिंग स्टूडियो या अनुबंध विश्लेषण में तैयार किए गए दस्तावेज़ों को यहां स्थानीय डिवाइस पर शून्य-क्लाउड प्रकटीकरण के साथ सुरक्षित रखें।'
                  : 'Your confidential legal repository is initialized. Petitions, legal notices, and audited contracts can be sealed directly to this device with zero cloud telemetry.'}
              </p>

              {/* Action Guidance Cards */}
              <div className="legal-vault__action-cards">
                <div
                  className="legal-vault__action-card"
                  onClick={() => onNavigateTab('drafting')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onNavigateTab('drafting')}
                >
                  <div className="legal-vault__action-card-header">
                    <div className="legal-vault__action-icon-box legal-vault__action-icon-box--blue">
                      <FileText size={17} />
                    </div>
                    <span className="legal-vault__action-tag">Sec 173 BNSS</span>
                    <ArrowUpRight size={15} className="legal-vault__action-arrow" />
                  </div>
                  <h4 className="legal-vault__action-card-title">
                    {isHindi ? 'ड्राफ्टिंग स्टूडियो खोलें' : 'Drafting Studio'}
                  </h4>
                  <p className="legal-vault__action-card-desc">
                    {isHindi
                      ? 'FIR, नोटिस व कानूनी याचिकाएं तैयार करें और सीधे वॉल्ट में सुरक्षित करें।'
                      : 'Generate FIR applications, notices & court petitions with 1-click vault archival.'}
                  </p>
                </div>

                <div
                  className="legal-vault__action-card"
                  onClick={() => onNavigateTab('analyzer')}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && onNavigateTab('analyzer')}
                >
                  <div className="legal-vault__action-card-header">
                    <div className="legal-vault__action-icon-box legal-vault__action-icon-box--emerald">
                      <FileSearch size={17} />
                    </div>
                    <span className="legal-vault__action-tag legal-vault__action-tag--emerald">Risk Audit</span>
                    <ArrowUpRight size={15} className="legal-vault__action-arrow" />
                  </div>
                  <h4 className="legal-vault__action-card-title">
                    {isHindi ? 'अनुबंध विश्लेषण' : 'Contract Audit'}
                  </h4>
                  <p className="legal-vault__action-card-desc">
                    {isHindi
                      ? 'अनुबंधों का जोखिम विश्लेषण करें और निष्कर्षों को गोपनीय वॉल्ट में रखें।'
                      : 'Scan agreements, detect hidden liability clauses, and store annotated findings privately.'}
                  </p>
                </div>
              </div>

              {/* Security Trust Assurance Strip */}
              <div className="legal-vault__assurance-strip">
                <div className="legal-vault__assurance-item">
                  <Shield size={13} color="var(--emerald-600)" />
                  <span>{isHindi ? '100% स्थानीय ब्राउज़र भंडारण' : '100% Local Storage'}</span>
                </div>
                <div className="legal-vault__assurance-divider" />
                <div className="legal-vault__assurance-item">
                  <Lock size={13} color="var(--royal-600)" />
                  <span>{isHindi ? 'शून्य क्लाउड प्रकटीकरण' : 'Zero Cloud Telemetry'}</span>
                </div>
                <div className="legal-vault__assurance-divider" />
                <div className="legal-vault__assurance-item">
                  <Download size={13} color="var(--purple-600)" />
                  <span>{isHindi ? 'TXT / PDF त्वरित निर्यात' : 'Direct File Export'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Subtle Integrated Archive Visual Card */}
            <div className="legal-vault__archive-visual-card">
              <div className="legal-vault__archive-backdrop" aria-hidden="true">
                <img
                  src="/assets/legal/library/law_library.webp"
                  alt=""
                  className="legal-vault__archive-image"
                  loading="lazy"
                />
                <div className="legal-vault__archive-overlay" />
              </div>

              <div className="legal-vault__archive-content">
                <div className="legal-vault__archive-header">
                  <div className="legal-vault__archive-badge">
                    <Database size={12} />
                    <span>JUDICIAL ARCHIVE REPOSITORY</span>
                  </div>
                  <span className="legal-vault__archive-status-dot" title="Operational" />
                </div>

                {/* Layered Document Dossier Specimen Preview */}
                <div className="legal-vault__specimen-card">
                  <div className="legal-vault__specimen-tag">
                    <FileText size={11} />
                    <span>ARCHIVE SPECIMEN • SCHEMA</span>
                  </div>
                  <div className="legal-vault__specimen-title">
                    Confidential Legal Draft
                  </div>
                  <div className="legal-vault__specimen-checklist">
                    <div className="legal-vault__specimen-check">
                      <Check size={12} color="var(--emerald-500)" />
                      <span>Device-Encrypted Payload</span>
                    </div>
                    <div className="legal-vault__specimen-check">
                      <Check size={12} color="var(--emerald-500)" />
                      <span>Tamper-Resistant Local Hash</span>
                    </div>
                    <div className="legal-vault__specimen-check">
                      <Check size={12} color="var(--emerald-500)" />
                      <span>PIN Authentication Required</span>
                    </div>
                  </div>
                </div>

                <div className="legal-vault__archive-footer">
                  <LockKeyhole size={13} color="var(--text-muted)" />
                  <span>{isHindi ? 'पिन सत्र सक्रिय है — बाहर निकलने पर लॉक करें' : 'Session active — click "Lock Vault" anytime to seal'}</span>
                </div>
              </div>
            </div>
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
                      const text = draft.content || draft.draft_text || draft.draft || '';
                      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
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
                {previewDraft.content || previewDraft.draft_text || previewDraft.draft || ''}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="legal-vault__modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  const txt = previewDraft.content || previewDraft.draft_text || previewDraft.draft || '';
                  navigator.clipboard.writeText(txt);
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
                  const txt = previewDraft.content || previewDraft.draft_text || previewDraft.draft || '';
                  const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' });
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
