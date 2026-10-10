import React, { useState } from 'react';
import {
  Share2,
  X,
  Key,
  RefreshCw,
  Clock,
  Flame,
  AlertCircle,
  ShieldCheck,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function VaultShareModal({
  shareDraft,
  setShareDraft,
  isHindi,
  sharePasscode,
  setSharePasscode,
  generateRandomPasscode,
  shareExpiresHours,
  setShareExpiresHours,
  shareOneTimeView,
  setShareOneTimeView,
  shareError,
  isGeneratingShare,
  shareResult,
  handleCreateShareLink,
  onOpenSharedDoc
}) {
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [sharePassCopied, setSharePassCopied] = useState(false);

  if (!shareDraft) return null;

  return (
    <div
      className="legal-vault__modal-overlay"
      onClick={() => setShareDraft(null)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="legal-vault__modal-dialog legal-vault__modal-dialog--share animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="legal-vault__modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="legal-vault__share-icon-wrap">
              <Share2 size={18} />
            </div>
            <div>
              <h3 className="legal-vault__modal-title">
                {isHindi ? 'सुरक्षित लिंक साझा करें (सेल्फ-डिस्ट्रक्टिंग)' : 'Secure "Share via Link" (Self-Destructing)'}
              </h3>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                End-to-end passcode protected • Ephemeral lawyer-client privilege
              </div>
            </div>
          </div>
          <button
            onClick={() => setShareDraft(null)}
            className="legal-vault__modal-close"
            type="button"
            aria-label="Close Share Modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="legal-vault__modal-body legal-vault__share-body">
          <div className="legal-vault__share-doc-info">
            <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px' }}>
              {shareDraft.title}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
              {shareDraft.type || 'Draft'} • {shareDraft.folder || 'Legal Document'}
            </div>
          </div>

          {!shareResult ? (
            <div className="legal-vault__share-form">
              <div className="legal-vault__share-field">
                <label className="legal-vault__share-label">
                  <Key size={14} />
                  <span>{isHindi ? 'सुरक्षा पासकोड (पासवर्ड):' : 'Decryption Passcode (Password):'}</span>
                </label>
                <div className="legal-vault__passcode-wrap">
                  <input
                    type="text"
                    className="input-field legal-vault__passcode-input"
                    value={sharePasscode}
                    onChange={(e) => setSharePasscode(e.target.value)}
                    placeholder="e.g. LAW-824"
                    required
                  />
                  <button
                    type="button"
                    className="btn-secondary legal-vault__gen-pass-btn"
                    onClick={() => setSharePasscode(generateRandomPasscode())}
                    title="Generate random strong code"
                  >
                    <RefreshCw size={13} />
                    <span>{isHindi ? 'नया कोड' : 'Regen'}</span>
                  </button>
                </div>
                <span className="legal-vault__field-hint">
                  {isHindi
                    ? 'प्राप्तकर्ता को दस्तावेज़ अनलॉक करने के लिए यह पासकोड दर्ज करना होगा।'
                    : 'Recipient must enter this passcode to decrypt the document.'}
                </span>
              </div>

              <div className="legal-vault__share-field">
                <label className="legal-vault__share-label">
                  <Clock size={14} />
                  <span>{isHindi ? 'लिंक समाप्ति समय (TTL):' : 'Link Expiration (TTL):'}</span>
                </label>
                <div className="legal-vault__expiry-pills">
                  {[
                    { hours: 1, label: '1 Hour' },
                    { hours: 12, label: '12 Hours' },
                    { hours: 24, label: '24 Hours (Default)' },
                    { hours: 48, label: '48 Hours' },
                    { hours: 168, label: '7 Days' }
                  ].map((exp) => (
                    <button
                      key={exp.hours}
                      type="button"
                      className={`legal-vault__expiry-pill ${
                        shareExpiresHours === exp.hours ? 'legal-vault__expiry-pill--active' : ''
                      }`}
                      onClick={() => setShareExpiresHours(exp.hours)}
                    >
                      {exp.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="legal-vault__burn-toggle-card">
                <div className="legal-vault__burn-toggle-left">
                  <div className="legal-vault__burn-icon-box">
                    <Flame size={18} />
                  </div>
                  <div>
                    <div className="legal-vault__burn-toggle-title">
                      {isHindi ? '1 बार देखने के बाद नष्ट करें (Burn After Reading)' : 'Burn After Reading (Single-View Self-Destruct)'}
                    </div>
                    <div className="legal-vault__burn-toggle-desc">
                      {isHindi
                        ? 'जैसे ही प्राप्तकर्ता एक बार दस्तावेज़ पढ़ लेगा, सर्वर से डेटा पूरी तरह मिट जाएगा।'
                        : 'Purges the document from server memory immediately after the recipient opens it once.'}
                    </div>
                  </div>
                </div>
                <label className="legal-vault__switch">
                  <input
                    type="checkbox"
                    checked={shareOneTimeView}
                    onChange={(e) => setShareOneTimeView(e.target.checked)}
                  />
                  <span className="legal-vault__slider" />
                </label>
              </div>

              {shareError && (
                <div className="legal-vault__error-text" style={{ marginTop: '8px' }}>
                  <AlertCircle size={14} />
                  <span>{shareError}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="legal-vault__share-success animate-fade-in">
              <div className="legal-vault__share-success-banner">
                <ShieldCheck size={20} color="var(--emerald-600)" />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                    {isHindi ? 'सुरक्षित लिंक सक्रिय है!' : 'Secure Self-Destructing Link Active!'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Expires {new Date(shareResult.expires_at * 1000).toLocaleString()}{' '}
                    {shareResult.one_time_view && '• Automatically burns after 1 view'}
                  </div>
                </div>
              </div>

              <div className="legal-vault__result-box">
                <div className="legal-vault__result-label">
                  <span>{isHindi ? 'साझा करने योग्य लिंक:' : 'Shareable Document Link:'}</span>
                </div>
                <div className="legal-vault__result-row">
                  <input
                    type="text"
                    readOnly
                    className="input-field legal-vault__result-input"
                    value={shareResult.url}
                  />
                  <button
                    type="button"
                    className="btn-primary legal-vault__copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(shareResult.url);
                      setShareLinkCopied(true);
                      setTimeout(() => setShareLinkCopied(false), 2000);
                    }}
                  >
                    {shareLinkCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{shareLinkCopied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              <div className="legal-vault__result-box">
                <div className="legal-vault__result-label">
                  <span>{isHindi ? 'गोपनीय पासकोड (क्लाइंट को अलग से भेजें):' : 'Secret Passcode (Send via WhatsApp/Email):'}</span>
                </div>
                <div className="legal-vault__result-row">
                  <div className="legal-vault__passcode-badge">
                    <Key size={14} />
                    <span className="font-mono">{shareResult.password}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-secondary legal-vault__copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(shareResult.password);
                      setSharePassCopied(true);
                      setTimeout(() => setSharePassCopied(false), 2000);
                    }}
                  >
                    {sharePassCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{sharePassCopied ? 'Copied' : 'Copy Passcode'}</span>
                  </button>
                </div>
              </div>

              <div className="legal-vault__test-link-strip">
                <button
                  type="button"
                  className="btn-secondary legal-vault__test-btn"
                  onClick={() => {
                    if (onOpenSharedDoc) {
                      setShareDraft(null);
                      onOpenSharedDoc(shareResult.share_id);
                    } else {
                      window.open(shareResult.url, '_blank');
                    }
                  }}
                >
                  <ExternalLink size={14} />
                  <span>{isHindi ? 'प्राप्तकर्ता दृश्य का परीक्षण करें' : 'Test Recipient Decryption View'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="legal-vault__modal-footer">
          {!shareResult ? (
            <>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShareDraft(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={isGeneratingShare}
                onClick={handleCreateShareLink}
              >
                {isGeneratingShare ? (
                  <>
                    <RefreshCw size={14} className="spin-animation" />
                    <span>Generating Link...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    <span>Generate Self-Destructing Link</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setShareDraft(null)}
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
