import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Key,
  Clock,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  Download,
  Flame,
  FileText,
  ExternalLink,
  ChevronLeft
} from 'lucide-react';
import './SharedDocumentViewer.css';

const API_BASE = 'http://localhost:8000';

export default function SharedDocumentViewer({ shareId, onBack = null }) {
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [unlocking, setUnlocking] = useState(false);
  const [unlockedDoc, setUnlockedDoc] = useState(null);
  const [copied, setCopied] = useState(false);
  const [timeLeftStr, setTimeLeftStr] = useState('');

  // Fetch document metadata on mount
  useEffect(() => {
    if (!shareId) return;

    let isMounted = true;
    setLoading(true);
    setError('');

    fetch(`${API_BASE}/api/vault/shared/${shareId}`)
      .then(async (res) => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.detail || 'This shared legal link is invalid or has expired.');
        }
        return res.json();
      })
      .then((res) => {
        if (!isMounted) return;
        setMeta(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [shareId]);

  // Live countdown timer
  useEffect(() => {
    if (!meta?.expires_at) return;

    const updateTimer = () => {
      const now = Date.now() / 1000;
      const diff = meta.expires_at - now;
      if (diff <= 0) {
        setTimeLeftStr('Expired');
      } else {
        const hours = Math.floor(diff / 3600);
        const mins = Math.floor((diff % 3600) / 60);
        const secs = Math.floor(diff % 60);
        if (hours > 0) {
          setTimeLeftStr(`${hours}h ${mins}m left`);
        } else {
          setTimeLeftStr(`${mins}m ${secs}s left`);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [meta]);

  const handleUnlock = async (e) => {
    e?.preventDefault();
    if (!password.trim()) {
      setError('Please enter the confidential passcode to unlock.');
      return;
    }

    setUnlocking(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE}/api/vault/shared/${shareId}/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || 'Incorrect password or link has expired.');
      }

      setUnlockedDoc(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setUnlocking(false);
    }
  };

  const handleCopy = () => {
    if (!unlockedDoc?.content) return;
    navigator.clipboard.writeText(unlockedDoc.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!unlockedDoc?.content) return;
    const blob = new Blob([unlockedDoc.content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${(unlockedDoc.title || 'shared_legal_document').replace(/[^a-zA-Z0-9_\u0900-\u097F]/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (loading) {
    return (
      <div className="vault-shared-portal">
        <div className="vault-shared-card animate-fade-in" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div className="vault-shared-spinner" />
          <h3 style={{ margin: '16px 0 6px', color: 'var(--text-main)', fontSize: '18px' }}>
            Verifying End-to-End Secure Link...
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Consulting zero-knowledge encryption records...
          </p>
        </div>
      </div>
    );
  }

  // Document Destroyed / Expired state
  if (meta?.is_destroyed || meta?.is_expired || error && !meta) {
    return (
      <div className="vault-shared-portal">
        <div className="vault-shared-card vault-shared-card--destroyed animate-fade-in">
          <div className="vault-shared-destroyed-icon">
            <Flame size={32} />
          </div>
          <div className="vault-shared-badge vault-shared-badge--destroyed">
            <ShieldAlert size={12} />
            <span>LINK SELF-DESTRUCTED / EXPIRED</span>
          </div>
          <h2 className="vault-shared-title" style={{ marginTop: '12px' }}>
            Confidential Document Unavailable
          </h2>
          <p className="vault-shared-desc">
            {meta?.destroyed_reason || error || 'This secure link has either expired or reached its single-view limit. In compliance with strict lawyer-client privilege, the payload has been permanently purged.'}
          </p>

          <div className="vault-shared-security-strip">
            <ShieldCheck size={14} color="var(--emerald-600)" />
            <span>Cryptographic payload securely wiped from memory.</span>
          </div>

          {onBack && (
            <button type="button" className="btn-secondary vault-shared-back-btn" onClick={onBack}>
              <ChevronLeft size={16} /> Return to Legal Platform
            </button>
          )}
        </div>
      </div>
    );
  }

  // Successfully Decrypted View
  if (unlockedDoc) {
    return (
      <div className="vault-shared-portal">
        <div className="vault-shared-doc-view animate-fade-in">
          <div className="vault-shared-doc-header">
            <div className="vault-shared-doc-meta">
              <span className="badge badge-primary font-mono text-xs">
                {unlockedDoc.doc_type || 'CONFIDENTIAL LEGAL DRAFT'}
              </span>
              {unlockedDoc.was_burned_on_view && (
                <span className="vault-shared-burn-tag">
                  <Flame size={12} /> BURNED AFTER READING
                </span>
              )}
              <h2 className="vault-shared-doc-title">{unlockedDoc.title}</h2>
              <div className="vault-shared-doc-subtitle">
                <span>Decrypted via One-Time Passcode</span> •{' '}
                <span>Shared: {new Date(unlockedDoc.created_at * 1000).toLocaleString()}</span>
              </div>
            </div>

            <div className="vault-shared-doc-actions">
              <button type="button" className="btn-secondary" onClick={handleCopy}>
                {copied ? <Check size={14} color="var(--emerald-600)" /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Full Draft'}</span>
              </button>
              <button type="button" className="btn-primary" onClick={handleDownload}>
                <Download size={14} />
                <span>Download (.txt)</span>
              </button>
            </div>
          </div>

          {unlockedDoc.was_burned_on_view && (
            <div className="vault-shared-burn-notice">
              <Flame size={16} />
              <div>
                <strong>Notice:</strong> This document was set to burn after 1 view. The encrypted server payload has already been destroyed. If you refresh or close this tab, this link cannot be re-opened.
              </div>
            </div>
          )}

          <div className="vault-shared-doc-content">
            <pre className="vault-shared-doc-text">{unlockedDoc.content}</pre>
          </div>

          <div className="vault-shared-doc-footer">
            <div className="vault-shared-watermark">
              <ShieldCheck size={14} color="var(--emerald-600)" />
              <span>DhaaraAI Secure Legal Vault • 256-bit AES Zero-Knowledge Verification</span>
            </div>
            {onBack && (
              <button type="button" className="btn-secondary" onClick={onBack}>
                Close Document
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pre-Unlock Screen (Waiting for Passcode)
  return (
    <div className="vault-shared-portal">
      <div className="vault-shared-card animate-fade-in">
        <div className="vault-shared-lock-icon">
          <Lock size={28} />
        </div>

        <div className="vault-shared-badge">
          <Shield size={12} />
          <span>CONFIDENTIAL LEGAL DISCLOSURE</span>
        </div>

        <h2 className="vault-shared-title">Secure Contract Link</h2>
        <p className="vault-shared-desc">
          A lawyer or client has shared a confidential document with you via a self-destructing, password-protected link.
        </p>

        {meta && (
          <div className="vault-shared-meta-box">
            <div className="vault-shared-meta-row">
              <span className="vault-shared-meta-label">Document Title:</span>
              <span className="vault-shared-meta-val font-semibold">{meta.title}</span>
            </div>
            <div className="vault-shared-meta-row">
              <span className="vault-shared-meta-label">Classification:</span>
              <span className="vault-shared-meta-val">{meta.doc_type || 'Legal Document'}</span>
            </div>
            <div className="vault-shared-meta-row">
              <span className="vault-shared-meta-label">Expiry Status:</span>
              <span className="vault-shared-meta-val font-mono" style={{ color: 'var(--amber-500)', fontWeight: 600 }}>
                <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                {timeLeftStr || 'Within 24 Hours'}
              </span>
            </div>
            {meta.one_time_view && (
              <div className="vault-shared-meta-row" style={{ color: '#ef4444' }}>
                <span className="vault-shared-meta-label" style={{ color: '#ef4444' }}>Single-Use Rule:</span>
                <span className="vault-shared-meta-val font-semibold">
                  <Flame size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  Self-destructs upon first view
                </span>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleUnlock} className="vault-shared-form">
          <label className="vault-shared-input-label">
            <Key size={14} /> Enter Passcode Provided by Sender:
          </label>
          <div className="vault-shared-input-wrap">
            <input
              type="password"
              className="input-field vault-shared-input"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter passcode..."
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="vault-shared-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-primary vault-shared-submit-btn"
            disabled={unlocking}
          >
            {unlocking ? (
              <>
                <div className="vault-shared-btn-spinner" />
                <span>Decrypting Payload...</span>
              </>
            ) : (
              <>
                <Unlock size={17} />
                <span>Decrypt & View Contract</span>
              </>
            )}
          </button>
        </form>

        <div className="vault-shared-trust-footer">
          <span className="vault-shared-trust-item">
            <ShieldCheck size={13} color="var(--emerald-500)" />
            Zero Server Retention
          </span>
          <span className="vault-shared-trust-item">
            <Lock size={13} color="var(--royal-500)" />
            PBKDF2-SHA256 Encrypted
          </span>
        </div>
      </div>
    </div>
  );
}
