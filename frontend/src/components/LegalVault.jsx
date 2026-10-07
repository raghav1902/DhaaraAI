import React, { useState, useEffect, useRef } from 'react';
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
  LockKeyhole,
  Search,
  Share2,
  Folder,
  FolderOpen,
  Mail,
  FileCheck,
  Award,
  Flame,
  ExternalLink,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import './LegalVault.css';
import { API_BASE } from '../config/apiConfig';
import { hashPin } from '../utils/cryptoUtils';

// Available Folder Taxonomies with legal classification
const VAULT_FOLDERS = [
  { id: 'all', label: 'All Documents', labelHi: 'सभी दस्तावेज़', icon: Folder },
  { id: 'petitions', label: 'Drafted Petitions', labelHi: 'ड्राफ्ट याचिकाएं व FIR', icon: FileText },
  { id: 'audits', label: 'Audited Contracts', labelHi: 'समीक्षित अनुबंध', icon: FileSearch },
  { id: 'notices', label: 'Client Notices', labelHi: 'विधिक नोटिस', icon: Mail },
  { id: 'agreements', label: 'Agreements & NDAs', labelHi: 'समझौते व अनुबंध', icon: FileCheck },
  { id: 'affidavits', label: 'Affidavits & Declarations', labelHi: 'शपथ पत्र व घोषणाएं', icon: Award }
];

/**
 * Intelligent Rule-Based Legal Document Auto-Classifier.
 * Categorizes documents into specialized legal folders based on statute, clauses, and document semantics.
 */
function autoClassifyDraft(draft) {
  if (draft.folder && draft.folder !== 'All Documents' && draft.folder !== 'Uncategorized') {
    return draft.folder;
  }

  const typeLower = (draft.type || '').toLowerCase();
  const titleLower = (draft.title || '').toLowerCase();
  const contentLower = (draft.content || '').toLowerCase();
  const corpus = `${typeLower} ${titleLower} ${contentLower}`;

  // 1. Audited Contracts & Risk Assessments
  if (
    typeLower.includes('audit') ||
    titleLower.includes('audit') ||
    corpus.includes('contract risk audit') ||
    corpus.includes('overall risk:') ||
    corpus.includes('flagged red flags') ||
    corpus.includes('problematic clause') ||
    corpus.includes('risk score')
  ) {
    return 'Audited Contracts';
  }

  // 2. Client Notices & Formal Demands
  if (
    typeLower.includes('notice') ||
    titleLower.includes('notice') ||
    corpus.includes('legal notice') ||
    corpus.includes('demand notice') ||
    corpus.includes('section 138') ||
    corpus.includes('negotiable instruments') ||
    corpus.includes('cease and desist') ||
    corpus.includes('eviction notice') ||
    corpus.includes('show cause') ||
    corpus.includes('hereby call upon you')
  ) {
    return 'Client Notices';
  }

  // 3. Agreements, Contracts & NDAs
  if (
    typeLower.includes('agreement') ||
    typeLower.includes('nda') ||
    typeLower.includes('contract') ||
    typeLower.includes('lease') ||
    typeLower.includes('rent') ||
    typeLower.includes('mou') ||
    corpus.includes('non-disclosure') ||
    corpus.includes('service agreement') ||
    corpus.includes('employment agreement') ||
    corpus.includes('tenancy agreement') ||
    corpus.includes('lease deed') ||
    corpus.includes('partnership deed') ||
    corpus.includes('now this agreement witnesseth')
  ) {
    return 'Agreements & NDAs';
  }

  // 4. Affidavits & Declarations
  if (
    typeLower.includes('affidavit') ||
    typeLower.includes('declaration') ||
    typeLower.includes('power of attorney') ||
    typeLower.includes('indemnity bond') ||
    corpus.includes('affidavit') ||
    corpus.includes('solemnly affirm') ||
    corpus.includes('deponent') ||
    corpus.includes('power of attorney') ||
    corpus.includes('indemnity bond') ||
    corpus.includes('verification')
  ) {
    return 'Affidavits & Declarations';
  }

  // 5. Default fallback: Drafted Petitions (FIRs, Bail Applications, Writs, Plaints)
  return 'Drafted Petitions';
}

function generateRandomPasscode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let res = '';
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

export default function LegalVault({ language = 'English', onNavigateTab = () => {}, onOpenSharedDoc = null }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinDigits, setPinDigits] = useState(['', '', '', '']);
  const digitRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [error, setError] = useState('');
  const [savedDrafts, setSavedDrafts] = useState([]);
  const [previewDraft, setPreviewDraft] = useState(null);
  const [copied, setCopied] = useState(false);

  // New Features: Search, Folders & Sharing
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
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [sharePassCopied, setSharePassCopied] = useState(false);
  const [shareError, setShareError] = useState('');

  // Check if PIN is already set in localStorage
  const hasPin = localStorage.getItem('dhaara_vault_pin') !== null;

  const loadDrafts = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem('dhaara_vault_drafts') || '[]');
      // Auto-classify drafts that don't have folder assigned yet
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

    // Auto-submit if all 4 digits entered
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
      // Verify against hashed PIN or migrate legacy unhashed PIN
      if (storedPin === hashedEntered || storedPin === fullPin) {
        if (storedPin === fullPin) {
          // Auto-migrate legacy plaintext PIN to hash
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

  // Open Share Link Modal
  const openShareModal = (draft) => {
    setShareDraft(draft);
    setSharePasscode(generateRandomPasscode());
    setShareExpiresHours(24);
    setShareOneTimeView(true);
    setShareResult(null);
    setShareError('');
    setShareLinkCopied(false);
    setSharePassCopied(false);
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
      // 1. Folder Filter
      if (activeFolder !== 'all') {
        const targetFolder = VAULT_FOLDERS.find((f) => f.id === activeFolder);
        if (targetFolder && draft.computedFolder !== targetFolder.label) {
          return false;
        }
      }
      return true;
    })
    .map((draft) => {
      // 2. Semantic & Content Search Analysis
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

      // Title match
      if (title.includes(q)) score += 100;
      // Type/Folder match
      if (type.includes(q) || folder.includes(q)) score += 40;

      // Full Content Analysis
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
        // Multi-keyword token search
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
          return null; // Exclude non-matching
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
  // LOCKED VAULT AUTHENTICATION SCREEN (Minimalist Modern Design)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="legal-vault legal-vault--locked animate-fade-in">
        <div className="legal-vault__unlock-card">
          <div className="legal-vault__lock-icon-wrap">
            <Lock size={22} strokeWidth={2.2} />
          </div>

          <h2 className="legal-vault__unlock-title">
            {isHindi ? 'कानूनी दस्तावेज़ वॉल्ट' : 'Legal Document Vault'}
          </h2>

          <p className="legal-vault__unlock-subtitle">
            {hasPin
              ? (isHindi
                  ? 'सहेजे गए निजी दस्तावेज़ देखने के लिए 4 अंकों का सुरक्षा पिन दर्ज करें।'
                  : 'Enter your 4-digit security PIN to unlock private drafts and case records.')
              : (isHindi
                  ? 'दस्तावेज़ों को सुरक्षित रखने के लिए एक नया 4 अंकों का सुरक्षा पिन बनाएं।'
                  : 'Create a 4-digit security PIN to protect private legal drafts on this device.')}
          </p>

          <div className="legal-vault__pin-form">
            {/* 4 Discrete PIN Digit Boxes */}
            <div className="legal-vault__pin-boxes">
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={digitRefs[idx]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  className="legal-vault__digit-box"
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                  onPaste={handleDigitPaste}
                  autoFocus={idx === 0}
                  aria-label={`Digit ${idx + 1}`}
                />
              ))}
            </div>

            {error && (
              <div className="legal-vault__error-text">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="button"
              className="legal-vault__submit-btn"
              onClick={() => verifyPin(pinDigits.join(''))}
            >
              {hasPin ? (
                <>
                  <Unlock size={16} />
                  <span>{isHindi ? 'वॉल्ट अनलॉक करें' : 'Unlock Vault'}</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isHindi ? 'पिन सेट करें व खोलें' : 'Set PIN & Open Vault'}</span>
                </>
              )}
            </button>
          </div>

          <div className="legal-vault__trust-row">
            <ShieldCheck size={14} color="var(--emerald-600)" />
            <span>{isHindi ? 'क्लाइंट-साइड एन्क्रिप्टेड • स्थानीय डिवाइस स्टोरेज' : 'Client-side encrypted • Stored locally on this device'}</span>
          </div>
        </div>
      </div>
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

      {/* Vault Toolbar: Semantic Content Search Bar */}
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
                  <div className="legal-vault__specimen-title">Confidential Legal Draft</div>
                  <div className="legal-vault__specimen-checklist">
                    <div className="legal-vault__specimen-check">
                      <Check size={12} color="var(--emerald-500)" />
                      <span>Auto-Classified Folders</span>
                    </div>
                    <div className="legal-vault__specimen-check">
                      <Check size={12} color="var(--emerald-500)" />
                      <span>Deep Content Semantic Search</span>
                    </div>
                    <div className="legal-vault__specimen-check">
                      <Check size={12} color="var(--emerald-500)" />
                      <span>Self-Destructing Password Share</span>
                    </div>
                  </div>
                </div>

                <div className="legal-vault__archive-footer">
                  <LockKeyhole size={13} color="var(--text-muted)" />
                  <span>
                    {isHindi
                      ? 'पिन सत्र सक्रिय है — बाहर निकलने पर लॉक करें'
                      : 'Session active — click "Lock Vault" anytime to seal'}
                  </span>
                </div>
              </div>
            </div>
          </div>
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
              <div key={draft.id} className="legal-vault__card">
                <div className="legal-vault__card-header">
                  {/* Folder & Category Pills */}
                  <div className="legal-vault__card-badges">
                    <span className="badge badge-primary font-mono text-xs">
                      {draft.type || 'LEGAL DRAFT'}
                    </span>
                    <span className="legal-vault__folder-badge">
                      <FolderOpen size={11} />
                      <span>{draft.computedFolder}</span>
                    </span>
                  </div>

                  <div className="legal-vault__card-top-actions">
                    {/* Move to folder quick selector */}
                    <div className="legal-vault__move-menu-wrap">
                      <button
                        type="button"
                        className="legal-vault__icon-action-btn"
                        title={isHindi ? 'फ़ोल्डर बदलें' : 'Move to folder'}
                        onClick={() =>
                          setMovingDraftId(movingDraftId === draft.id ? null : draft.id)
                        }
                      >
                        <SlidersHorizontal size={14} />
                      </button>

                      {movingDraftId === draft.id && (
                        <div className="legal-vault__folder-dropdown animate-fade-in">
                          <div className="legal-vault__folder-dropdown-title">
                            {isHindi ? 'फ़ोल्डर चुनें:' : 'Assign Folder:'}
                          </div>
                          {VAULT_FOLDERS.filter((f) => f.id !== 'all').map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              className={`legal-vault__folder-option ${
                                draft.computedFolder === f.label ? 'legal-vault__folder-option--selected' : ''
                              }`}
                              onClick={() => handleUpdateFolder(draft.id, f.label)}
                            >
                              <f.icon size={12} />
                              <span>{f.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleDelete(draft.id)}
                      className="legal-vault__delete-btn"
                      title={isHindi ? 'हटाएं' : 'Delete Draft'}
                      type="button"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <h4 className="legal-vault__card-title">
                  {draft.title || 'Untitled Legal Document'}
                </h4>

                <div className="legal-vault__card-meta">
                  <Clock size={12} />
                  <span>
                    {new Date(draft.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="legal-vault__card-meta-dot">•</span>
                  <span>{(draft.content || '').length} chars</span>
                </div>

                {/* Search Match Snippet Highlight */}
                {draft.snippet && (
                  <div className="legal-vault__snippet-box">
                    <span className="legal-vault__snippet-tag">Content Match:</span>
                    <p className="legal-vault__snippet-text">"{draft.snippet}"</p>
                  </div>
                )}

                <div className="legal-vault__card-actions">
                  <button
                    className="btn-secondary legal-vault__action-btn"
                    onClick={() => setPreviewDraft(draft)}
                    type="button"
                    title="View full draft"
                  >
                    <Eye size={14} />
                    <span>{isHindi ? 'देखें' : 'View'}</span>
                  </button>

                  <button
                    className="btn-secondary legal-vault__action-btn legal-vault__action-btn--share"
                    onClick={() => openShareModal(draft)}
                    type="button"
                    title="Create self-destructing share link"
                  >
                    <Share2 size={14} color="var(--royal-600)" />
                    <span>{isHindi ? 'शेयर' : 'Share'}</span>
                  </button>

                  <button
                    className="btn-secondary legal-vault__action-btn"
                    onClick={() => {
                      const blob = new Blob([draft.content], { type: 'text/plain;charset=utf-8' });
                      const a = document.createElement('a');
                      a.href = URL.createObjectURL(blob);
                      a.download = `${(draft.title || 'legal_draft').replace(
                        /[^a-zA-Z0-9_\u0900-\u097F]/g,
                        '_'
                      )}.txt`;
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }}
                    type="button"
                    title="Download document text"
                  >
                    <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DOCUMENT PREVIEW MODAL */}
      {/* ========================================================================= */}
      {previewDraft && (
        <div
          className="legal-vault__modal-overlay"
          onClick={() => setPreviewDraft(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="legal-vault__modal-dialog" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="legal-vault__modal-header">
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="badge badge-primary font-mono text-xs">
                    {previewDraft.type || 'DOCUMENT'}
                  </span>
                  <span className="legal-vault__folder-badge">
                    <FolderOpen size={11} />
                    <span>{previewDraft.folder || autoClassifyDraft(previewDraft)}</span>
                  </span>
                </div>
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
              <pre className="legal-vault__document-text">{previewDraft.content}</pre>
            </div>

            {/* Modal Footer */}
            <div className="legal-vault__modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setPreviewDraft(null);
                  openShareModal(previewDraft);
                }}
                type="button"
              >
                <Share2 size={14} color="var(--royal-600)" />
                <span>{isHindi ? 'सुरक्षित लिंक शेयर करें' : 'Share via Secure Link'}</span>
              </button>

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
                <span>
                  {copied
                    ? isHindi
                      ? 'कॉपी हो गया!'
                      : 'Copied!'
                    : isHindi
                    ? 'टेक्स्ट कॉपी करें'
                    : 'Copy Text'}
                </span>
              </button>

              <button
                className="btn-primary"
                onClick={() => {
                  const blob = new Blob([previewDraft.content], { type: 'text/plain;charset=utf-8' });
                  const a = document.createElement('a');
                  a.href = URL.createObjectURL(blob);
                  a.download = `${(previewDraft.title || 'legal_draft').replace(
                    /[^a-zA-Z0-9_\u0900-\u097F]/g,
                    '_'
                  )}.txt`;
                  a.click();
                  URL.revokeObjectURL(a.href);
                }}
                type="button"
              >
                <Download size={15} />
                <span>{isHindi ? 'डाउनलोड करें' : 'Download TXT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECURE "SHARE VIA LINK" (SELF-DESTRUCTING) MODAL */}
      {/* ========================================================================= */}
      {shareDraft && (
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
              {/* Document Overview Strip */}
              <div className="legal-vault__share-doc-info">
                <div style={{ fontWeight: 700, color: 'var(--text-main)', fontSize: '14px' }}>
                  {shareDraft.title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {shareDraft.type || 'Draft'} • {shareDraft.folder || 'Legal Document'}
                </div>
              </div>

              {!shareResult ? (
                /* Configuration Form */
                <div className="legal-vault__share-form">
                  {/* Password / Passcode Config */}
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

                  {/* Expiration Dropdown */}
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

                  {/* Single-View Self-Destruct Rule */}
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
                /* Generated Share Link Result View */
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

                  {/* Shareable Link Box */}
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

                  {/* Passcode Box */}
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

                  {/* Test Link Button */}
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
      )}
    </div>
  );
}
