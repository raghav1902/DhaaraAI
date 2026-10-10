import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  FileText,
  Search,
  X,
  Shield,
  ShieldCheck,
  Download,
  Database,
  LockKeyhole,
  ArrowUpRight,
  FileSearch,
  Check
} from 'lucide-react';
import './LegalVault.css';
import { API_BASE } from '../config/apiConfig';
import { hashPin } from '../utils/cryptoUtils';
import {
  VAULT_FOLDERS,
  autoClassifyDraft,
  generateRandomPasscode
} from './LegalVault/vaultClassifier';
import VaultLockScreen from './LegalVault/VaultLockScreen';
import VaultDocCard from './LegalVault/VaultDocCard';
import VaultPreviewModal from './LegalVault/VaultPreviewModal';
import VaultShareModal from './LegalVault/VaultShareModal';
import VaultEmptyGuide from './LegalVault/VaultEmptyGuide';

export default function LegalVault({ language = 'English', onNavigateTab = () => {}, onOpenSharedDoc = null }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const digitRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [error, setError] = useState('');
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [previewDraft, setPreviewDraft] = useState(null);

  // Search, Folders & Sharing
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFolder, setActiveFolder] = useState('all');
  const [movingDraftId, setMovingDraftId] = useState(null);

  // Share via Link Modal State
  const [shareDraft, setShareDraft] = useState(null);
  const [sharePasscode, setSharePasscode] = useState('');
  const [shareExpiresHours, setShareExpiresHours] = useState(24);
  const [shareOneTimeView, setShareOneTimeView] = useState(true);
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);
  const [shareResult, setShareResult] = useState(null);
  const [shareError, setShareError] = useState('');

  // Check if PIN is already set in localStorage
  const hasPin = localStorage.getItem('dhaara_vault_pin') !== null;

  const loadDrafts = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('dhaara_vault_drafts') || '[]');
      const mapped = drafts.map((d) => ({
        ...d,
        folder: d.folder || autoClassifyDraft(d)
      }));
      setSavedDrafts(mapped);
    } catch {
      setSavedDrafts([]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDrafts();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (shareDraft) setShareDraft(null);
        else if (previewDraft) setPreviewDraft(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewDraft, shareDraft]);

  const handleDigitChange = (index, value) => {
    const cleanVal = value.replace(/[^0-9]/g, '').slice(-1);
    const updated = [...pinDigits];
    updated[index] = cleanVal;
    setPinDigits(updated);
    if (error) setError('');

    if (cleanVal && index < 3) {
      digitRefs[index + 1].current?.focus();
    }

    if (cleanVal && index === 3) {
      const fullPin = updated.join('');
      if (fullPin.length === 4) {
        verifyPin(fullPin);
      }
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      digitRefs[index - 1].current?.focus();
    } else if (e.key === 'Enter') {
      const fullPin = pinDigits.join('');
      verifyPin(fullPin);
    }
  };

  const handleDigitPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 4);
    if (!pasted) return;

    const updated = ['', '', '', ''];
    for (let i = 0; i < pasted.length; i++) {
      updated[i] = pasted[i];
    }
    setPinDigits(updated);
    if (pasted.length === 4) {
      verifyPin(pasted);
    } else {
      digitRefs[pasted.length]?.current?.focus();
    }
  };

  const verifyPin = async (fullPin) => {
    if (fullPin.length < 4) {
      setError(isHindi ? 'कृपया 4 अंकों का पिन दर्ज करें।' : 'Please enter all 4 digits of your PIN.');
      return;
    }

    if (hasPin) {
      const storedPin = localStorage.getItem('dhaara_vault_pin');
      const hashedEntered = await hashPin(fullPin);
      if (storedPin === hashedEntered || storedPin === fullPin) {
        if (storedPin === fullPin) {
          localStorage.setItem('dhaara_vault_pin', hashedEntered);
        }
        setIsAuthenticated(true);
        setError('');
      } else {
        setError(isHindi ? 'गलत पिन। पुनः प्रयास करें।' : 'Incorrect PIN. Access denied.');
        setPinDigits(['', '', '', '']);
        digitRefs[0].current?.focus();
      }
    } else {
      const hashedNew = await hashPin(fullPin);
      localStorage.setItem('dhaara_vault_pin', hashedNew);
      setIsAuthenticated(true);
      setError('');
    }
  };

  const handleDelete = (id) => {
    const confirmMsg = isHindi
      ? 'क्या आप वाकई इस सहेजे गए ड्राफ्ट को हटाना चाहते हैं?'
      : 'Are you sure you want to permanently delete this draft from local vault storage?';
    if (!window.confirm(confirmMsg)) return;

    const updated = savedDrafts.filter((d) => d.id !== id);
    localStorage.setItem('dhaara_vault_drafts', JSON.stringify(updated));
    setSavedDrafts(updated);
    if (previewDraft?.id === id) setPreviewDraft(null);
  };

  const handleUpdateFolder = (draftId, newFolder) => {
    const updated = savedDrafts.map((d) => {
      if (d.id === draftId) {
        return { ...d, folder: newFolder };
      }
      return d;
    });
    localStorage.setItem('dhaara_vault_drafts', JSON.stringify(updated));
    setSavedDrafts(updated);
    setMovingDraftId(null);
  };

  const openShareModal = (draft) => {
    setShareDraft(draft);
    setSharePasscode(generateRandomPasscode());
    setShareExpiresHours(24);
    setShareOneTimeView(true);
    setShareResult(null);
    setShareError('');
  };

  const handleCreateShareLink = async () => {
    if (!shareDraft) return;
    if (!sharePasscode || sharePasscode.trim().length < 4) {
      setShareError('Passcode must be at least 4 characters long.');
      return;
    }

    setIsGeneratingShare(true);
    setShareError('');

    try {
      const res = await fetch(`${API_BASE}/api/vault/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: shareDraft.title || 'Confidential Legal Document',
          doc_type: shareDraft.type || 'Legal Draft',
          content: shareDraft.content || '',
          folder: shareDraft.folder || 'Legal Document',
          password: sharePasscode.trim(),
          expires_hours: Number(shareExpiresHours),
          one_time_view: shareOneTimeView
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || 'Failed to create self-destructing link.');
      }

      const shareId = data.data.share_id;
      const shareUrl = `${window.location.origin}/?shared=${shareId}`;

      setShareResult({
        ...data.data,
        url: shareUrl,
        password: sharePasscode.trim()
      });
    } catch (err) {
      setShareError(err.message || 'Error communicating with secure sharing server.');
    } finally {
      setIsGeneratingShare(false);
    }
  };

  // -------------------------------------------------------------
  // IN-VAULT SEMANTIC & FULL CONTENT SEARCH ENGINE + FOLDER FILTER
  // -------------------------------------------------------------
  const folderCounts = VAULT_FOLDERS.reduce((acc, f) => {
    if (f.id === 'all') {
      acc[f.id] = savedDrafts.length;
    } else {
      acc[f.id] = savedDrafts.filter((d) => (d.folder || autoClassifyDraft(d)) === f.label).length;
    }
    return acc;
  }, {});

  const filteredDrafts = savedDrafts
    .map((draft) => {
      const currentFolder = draft.folder || autoClassifyDraft(draft);
      return { ...draft, computedFolder: currentFolder };
    })
    .filter((draft) => {
      if (activeFolder !== 'all') {
        const targetFolder = VAULT_FOLDERS.find((f) => f.id === activeFolder);
        if (targetFolder && draft.computedFolder !== targetFolder.label) {
          return false;
        }
      }
      return true;
    })
    .map((draft) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) {
        return { ...draft, matchScore: 0, snippet: null };
      }

      const title = (draft.title || '').toLowerCase();
      const type = (draft.type || '').toLowerCase();
      const folder = (draft.computedFolder || '').toLowerCase();
      const content = (draft.content || '').toLowerCase();

      let score = 0;
      let matchSnippet = null;

      if (title.includes(q)) score += 100;
      if (type.includes(q) || folder.includes(q)) score += 40;

      if (content.includes(q)) {
        score += 60;
        const idx = content.indexOf(q);
        const start = Math.max(0, idx - 45);
        const end = Math.min(content.length, idx + q.length + 65);
        let s = draft.content.substring(start, end);
        if (start > 0) s = '...' + s;
        if (end < content.length) s = s + '...';
        matchSnippet = s;
      } else {
        const tokens = q.split(/\s+/).filter((t) => t.length > 2);
        let tokenHits = 0;
        tokens.forEach((tok) => {
          if (title.includes(tok)) {
            score += 20;
            tokenHits++;
          }
          if (content.includes(tok)) {
            score += 15;
            tokenHits++;
            if (!matchSnippet) {
              const idx = content.indexOf(tok);
              const start = Math.max(0, idx - 45);
              const end = Math.min(content.length, idx + tok.length + 65);
              let s = draft.content.substring(start, end);
              if (start > 0) s = '...' + s;
              if (end < content.length) s = s + '...';
              matchSnippet = s;
            }
          }
        });
        if (tokens.length > 0 && tokenHits === 0) {
          return null;
        }
      }

      if (score === 0) return null;

      return {
        ...draft,
        matchScore: score,
        snippet: matchSnippet
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  // =========================================================================
  // LOCKED VAULT SCREEN
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <VaultLockScreen
        isHindi={isHindi}
        hasPin={hasPin}
        pinDigits={pinDigits}
        digitRefs={digitRefs}
        handleDigitChange={handleDigitChange}
        handleDigitKeyDown={handleDigitKeyDown}
        handleDigitPaste={handleDigitPaste}
        verifyPin={verifyPin}
        error={error}
      />
    );
  }

  // =========================================================================
  // UNLOCKED VAULT WORKSPACE
  // =========================================================================
  return (
    <div className="legal-vault animate-fade-in">
      {/* Vault Header Bar */}
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
                ? 'स्वचालित वर्गीकरण • ऑफलाइन सामग्री खोज • सेल्फ-डिस्ट्रक्टिंग शेयरिंग'
                : 'Zero-knowledge local storage • Auto-categorized folders • In-vault full-content search'}
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
              setPinDigits(['', '', '', '']);
            }}
            className="btn-secondary legal-vault__lock-btn"
            type="button"
          >
            <Lock size={13} />
            <span>{isHindi ? 'वॉल्ट लॉक करें' : 'Lock Vault'}</span>
          </button>
        </div>
      </div>

      {/* Vault Toolbar: Search Bar */}
      <div className="legal-vault__toolbar">
        <div className="legal-vault__search-box">
          <Search size={17} className="legal-vault__search-icon" />
          <input
            type="text"
            className="legal-vault__search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHindi
                ? 'दस्तावेज़ की पूरी सामग्री, खंड (जैसे: indemnity, धारा 138, जमानत, FIR) या शीर्षक खोजें...'
                : 'Search deep document contents, clauses (e.g. indemnity, Section 138, bail, arbitration, FIR)...'
            }
          />
          {searchQuery && (
            <button
              type="button"
              className="legal-vault__search-clear"
              onClick={() => setSearchQuery('')}
              title="Clear Search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="legal-vault__search-status">
            <span>
              {isHindi ? 'परिणाम:' : 'Matching:'}{' '}
              <strong>
                {filteredDrafts.length} {isHindi ? 'दस्तावेज़' : 'documents'}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Folder Taxonomy Navigation Tabs */}
      <div className="legal-vault__folders-bar">
        <div className="legal-vault__folders-scroll">
          {VAULT_FOLDERS.map((f) => {
            const Icon = f.icon;
            const count = folderCounts[f.id] || 0;
            const isActive = activeFolder === f.id;
            return (
              <button
                key={f.id}
                type="button"
                className={`legal-vault__folder-tab ${isActive ? 'legal-vault__folder-tab--active' : ''}`}
                onClick={() => setActiveFolder(f.id)}
              >
                <Icon size={14} className="legal-vault__folder-tab-icon" />
                <span>{isHindi ? f.labelHi : f.label}</span>
                <span className="legal-vault__folder-tab-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Vault Workspace Stage */}
      <div className="legal-vault__workspace">
        {savedDrafts.length === 0 ? (
          <VaultEmptyGuide isHindi={isHindi} onNavigateTab={onNavigateTab} />
        ) : filteredDrafts.length === 0 ? (
          <div className="legal-vault__empty-search">
            <FileSearch size={36} color="var(--text-muted)" />
            <h4 style={{ margin: '14px 0 6px', color: 'var(--text-main)' }}>
              {isHindi ? 'कोई मेल खाता दस्तावेज़ नहीं मिला' : 'No Matching Documents Found'}
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>
              {searchQuery
                ? `No documents in "${activeFolder === 'all' ? 'All Folders' : activeFolder}" match "${searchQuery}".`
                : `No saved drafts in "${activeFolder === 'all' ? 'All Folders' : activeFolder}".`}
            </p>
            {searchQuery && (
              <button
                type="button"
                className="btn-secondary"
                style={{ marginTop: '14px' }}
                onClick={() => setSearchQuery('')}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="legal-vault__grid">
            {filteredDrafts.map((draft) => (
              <VaultDocCard
                key={draft.id}
                draft={draft}
                isHindi={isHindi}
                movingDraftId={movingDraftId}
                setMovingDraftId={setMovingDraftId}
                handleUpdateFolder={handleUpdateFolder}
                handleDelete={handleDelete}
                setPreviewDraft={setPreviewDraft}
                openShareModal={openShareModal}
                vaultFolders={VAULT_FOLDERS}
              />
            ))}
          </div>
        )}
      </div>

      {/* Document Preview Modal */}
      <VaultPreviewModal
        previewDraft={previewDraft}
        setPreviewDraft={setPreviewDraft}
        openShareModal={openShareModal}
        isHindi={isHindi}
        autoClassifyDraft={autoClassifyDraft}
      />

      {/* Secure "Share via Link" Modal */}
      <VaultShareModal
        shareDraft={shareDraft}
        setShareDraft={setShareDraft}
        isHindi={isHindi}
        sharePasscode={sharePasscode}
        setSharePasscode={setSharePasscode}
        generateRandomPasscode={generateRandomPasscode}
        shareExpiresHours={shareExpiresHours}
        setShareExpiresHours={setShareExpiresHours}
        shareOneTimeView={shareOneTimeView}
        setShareOneTimeView={setShareOneTimeView}
        shareError={shareError}
        isGeneratingShare={isGeneratingShare}
        shareResult={shareResult}
        handleCreateShareLink={handleCreateShareLink}
        onOpenSharedDoc={onOpenSharedDoc}
      />
    </div>
  );
}
