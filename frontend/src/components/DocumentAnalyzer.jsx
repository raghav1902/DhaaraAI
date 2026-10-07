import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Sparkles,
  RefreshCw,
  Upload,
  FileCheck,
  Loader2,
  ShieldCheck,
  Crown
} from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/contractAnalyzerData';
import AnalysisResultsView from './DocumentAnalyzer/AnalysisResultsView';
import { API_BASE } from '../config/apiConfig';
import ProFeatureLock from './ProFeatureLock';
import './DocumentAnalyzer/DocumentAnalyzer.css';

export default function DocumentAnalyzer({
  language = 'English',
  user,
  onNavigateTab,
  onOpenUpgradeModal
}) {
  const isHindi = language === 'Hindi';
  const isPro = user?.plan === 'plus' || user?.plan === 'pro' || user?.plan === 'enterprise';

  const [usageStats, setUsageStats] = useState(null);

  const fetchUsage = async () => {
    try {
      const token = user?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${API_BASE}/api/user/usage`, { headers });
      setUsageStats(res.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchUsage();
  }, [user]);

  const auditsUsed = usageStats?.features?.contract_audit?.used ?? 0;
  const auditLimit = usageStats?.features?.contract_audit?.limit ?? 3;
  const auditsRemaining = isPro ? 999 : Math.max(0, auditLimit - auditsUsed);

  const [documentType, setDocumentType] = useState('Rental / Lease Agreement');
  const [documentText, setDocumentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const loadSample = (key) => {
    const sample = SAMPLE_CONTRACTS[key];
    if (sample) {
      setDocumentText(sample.text);
      setUploadedFileName(null);
      if (key === 'rent') setDocumentType('Rental / Lease Agreement');
      else if (key === 'employment') setDocumentType('Employment Contract / Bond');
      else setDocumentType('Freelance / Service Agreement');
      setAnalysis(null);
      setError(null);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return;
    if (!/\.(pdf|txt|md|png|jpg|jpeg)$/i.test(file.name)) {
      setError(isHindi ? 'कृपया PDF, TXT या MD फ़ाइल चुनें।' : 'Choose a PDF, TXT, MD, or Image file.');
      return;
    }

    if (!isPro && auditsRemaining <= 0) {
      const msg = isHindi
        ? 'निःशुल्क 3 अनुबंध ऑडिट की सीमा पूरी हो चुकी है। असीमित दस्तावेज़ ऑडिट के लिए DhaaraAI Plus में अपग्रेड करें।'
        : 'Free tier limit of 3 contract audits reached. Upgrade to DhaaraAI Plus for unlimited file audits.';
      setError(msg);
      if (onOpenUpgradeModal) onOpenUpgradeModal('Contract Risk Audit', msg);
      else if (onNavigateTab) onNavigateTab('settings');
      return;
    }

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = user?.token;
      const headers = {
        'Content-Type': 'multipart/form-data',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const res = await axios.post(`${API_BASE}/api/upload-document`, formData, { headers });

      if (res.data && res.data.text) {
        setDocumentText(res.data.text);
        setUploadedFileName(res.data.filename);
        setAnalysis(null);
      } else {
        setError(isHindi ? 'दस्तावेज से टेक्स्ट नहीं निकाला जा सका।' : 'Could not extract text from document.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      if (err.response?.status === 403) {
        const detail = err.response?.data?.detail?.message ||
          (isHindi ? 'निःशुल्क ऑडिट सीमा समाप्त हो गई है।' : 'Free contract audit limit reached.');
        setError(detail);
        if (onOpenUpgradeModal) onOpenUpgradeModal('Contract Risk Audit', detail);
        else if (onNavigateTab) onNavigateTab('settings');
      } else {
        const detail = err.response?.data?.detail;
        setError(detail || (isHindi ? 'दस्तावेज अपलोड करने में त्रुटि आई।' : 'Failed to upload and extract document.'));
      }
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileUpload = (e) => uploadFile(e.target.files?.[0]);

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError(isHindi ? 'कृपया अनुबंध का टेक्स्ट दर्ज करें।' : 'Please enter or paste the contract text to audit.');
      return;
    }

    if (!isPro && auditsRemaining <= 0) {
      const msg = isHindi
        ? 'निःशुल्क 3 अनुबंध ऑडिट की सीमा पूरी हो चुकी है। असीमित विश्लेषण के लिए DhaaraAI Plus में अपग्रेड करें।'
        : 'Free tier limit of 3 contract audits reached. Upgrade to DhaaraAI Plus for unlimited audits.';
      setError(msg);
      if (onOpenUpgradeModal) onOpenUpgradeModal('Contract Risk Audit', msg);
      else if (onNavigateTab) onNavigateTab('settings');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = user?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(`${API_BASE}/api/analyze-contract`, {
        document_text: documentText,
        document_type: documentType,
        language: language
      }, { headers });

      setAnalysis(res.data);
      fetchUsage();
    } catch (err) {
      console.error('Contract audit error:', err);
      if (err.response?.status === 403) {
        const detail = err.response?.data?.detail?.message ||
          (isHindi ? 'निःशुल्क 3 अनुबंध ऑडिट की सीमा समाप्त हो गई है।' : 'Free tier limit of 3 audits reached.');
        setError(detail);
        if (onOpenUpgradeModal) onOpenUpgradeModal('Contract Risk Audit', detail);
        else if (onNavigateTab) onNavigateTab('settings');
      } else {
        setError(isHindi
          ? '[500 Internal Server Error] दस्तावेज विश्लेषण में त्रुटि आई। कृपया पुनः प्रयास करें या बैकएंड की स्थिति जांचें।'
          : '[500 Internal Server Error] Failed to analyze document. Ensure backend server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyClause = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="contract-audit animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Banner */}
      <div className="contract-audit__header module-header-banner">
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '75%' }}>
            <div style={{
              background: 'linear-gradient(135deg, var(--royal-700), #1e3a8a)',
              padding: '10px',
              borderRadius: 'var(--radius-sm)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(29, 78, 216, 0.25)',
              flexShrink: 0
            }}>
              <FileSearch size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                  {isHindi ? 'अनुबंध जोखिम ऑडिट' : 'Contract Risk & Unfair Clause Audit'}
                </h2>
                {isPro ? (
                  <span
                    style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      color: '#d97706',
                      border: '1px solid #f59e0b',
                      borderRadius: '999px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Crown size={12} /> PLUS
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onOpenUpgradeModal ? onOpenUpgradeModal('Contract Risk Audit') : onNavigateTab('settings')}
                    style={{
                      background: auditsRemaining <= 1 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(37, 99, 235, 0.1)',
                      color: auditsRemaining <= 1 ? '#dc2626' : '#2563eb',
                      border: `1px solid ${auditsRemaining <= 1 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(37, 99, 235, 0.3)'}`,
                      borderRadius: '999px',
                      padding: '3px 9px',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer'
                    }}
                    title={isHindi ? 'अपग्रेड करने के लिए क्लिक करें' : 'Click to upgrade to Plus'}
                  >
                    <span>{isHindi ? `ऑडिट: ${auditsUsed}/${auditLimit} प्रयुक्त` : `Audits: ${auditsUsed}/${auditLimit} Used (${auditsRemaining} Left)`}</span>
                    <span style={{ fontSize: '9.5px', fontWeight: 800, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#ffffff', borderRadius: '4px', padding: '1.5px 6px', letterSpacing: '0.03em', textTransform: 'uppercase' }}>
                      ★ UPGRADE
                    </span>
                  </button>
                )}
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                {isHindi
                  ? 'किरायानामा, एम्प्लॉयमेंट बॉन्ड व सर्विस एग्रीमेंट में गैर-कानूनी या एकतरफा शर्तों की तत्काल जांच करें।'
                  : 'Screen rent deeds, employment bonds, and commercial agreements for unfair terms, non-competes, and statutory violations.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Selector Chips */}
        <div style={{ position: 'relative', zIndex: 2, marginTop: '14px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', maxWidth: 'min(760px, calc(100% - 240px))', borderTop: '1px solid var(--card-border)', paddingTop: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={14} color="var(--primary)" />
            {isHindi ? 'त्वरित नमूना अनुबंध लोड करें:' : 'Try Sample Legal Agreements:'}
          </span>
          <button
            type="button"
            onClick={() => loadSample('rent')}
            className="btn-ghost"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {isHindi ? 'आवासीय किराया अनुबंध (Rent Deed)' : 'Rent Deed (11 Months)'}
          </button>
          <button
            type="button"
            onClick={() => loadSample('employment')}
            className="btn-ghost"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {isHindi ? 'जॉब व सर्विस बॉन्ड (Employment Bond)' : 'Employment Service Bond'}
          </button>
          <button
            type="button"
            onClick={() => loadSample('freelance')}
            className="btn-ghost"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            {isHindi ? 'फ्रीलांस सर्विस अनुबंध (Consultancy)' : 'Freelance Agreement'}
          </button>
        </div>

        <div className="module-banner-visual" aria-hidden="true">
          <img
            src="/assets/legal/contracts/contract_audit.webp"
            alt=""
            className="module-banner-image"
            loading="lazy"
          />
          <div className="module-banner-gradient" />
        </div>
      </div>

      {/* Input Section */}
      <div className="glass-panel contract-audit__workspace" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
              {isHindi ? 'दस्तावेज का प्रकार (Document Category)' : 'Document Category'}
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="input-field"
            >
              <option value="Rental / Lease Agreement">Residential / Commercial Rental Agreement</option>
              <option value="Employment Contract / Bond">Employment Offer, Service Bond & Non-Compete</option>
              <option value="Freelance / Service Agreement">Freelancer / Consultancy / Vendor Agreement</option>
              <option value="Loan & Promissory Note">Personal / Business Loan Deed</option>
              <option value="NDA & Confidentiality">Non-Disclosure Agreement (NDA)</option>
              <option value="General Legal Agreement">General Civil Contract</option>
            </select>
          </div>
        </div>

        {/* Document Upload Dropzone */}
        <div
          className={`contract-audit__dropzone${isDragging ? ' is-dragging' : ''}${uploading ? ' is-uploading' : ''}`}
          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false); }}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); uploadFile(e.dataTransfer.files?.[0]); }}
          style={{
            border: '2px dashed var(--primary-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            background: 'var(--subtle-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'var(--primary-light)', padding: '10px', borderRadius: 'var(--radius-sm)', color: 'var(--primary)', display: 'flex' }}>
              <Upload size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-main)' }}>
                {isHindi ? 'PDF या टेक्स्ट दस्तावेज अपलोड करें' : 'Upload Contract / Legal PDF'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isHindi ? 'समर्थित प्रारूप: .pdf, .txt, .md (स्वचालित टेक्स्ट निष्कर्षण)' : 'Supported formats: .pdf, .txt, .md, image (auto extraction)'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.txt,.md,.png,.jpg,.jpeg"
              style={{ display: 'none' }}
              id="contract-file-upload"
            />
            <label
              htmlFor="contract-file-upload"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-xs)',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--primary)',
                cursor: uploading ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: 'var(--card-shadow)'
              }}
            >
              {uploading ? (
                <>
                  <Loader2 size={15} className="spin" />
                  {isHindi ? 'दस्तावेज पढ़ा जा रहा है...' : 'Extracting Text...'}
                </>
              ) : (
                <>
                  <Upload size={15} />
                  {isHindi ? 'फाइल चुनें (.pdf / .txt / .md)' : 'Browse File/Image'}
                </>
              )}
            </label>
          </div>
        </div>

        {uploadedFileName && (
          <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', padding: '8px 14px', borderRadius: 'var(--radius-xs)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '12.5px' }}>
            <FileCheck size={16} />
            <span><strong>{uploadedFileName}</strong> {isHindi ? 'सफलतापूर्वक लोड किया गया!' : 'successfully loaded!'}</span>
          </div>
        )}

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
              {isHindi ? 'अनुबंध का पाठ (Text) अथवा निष्कर्षित सामग्री' : 'Contract Clauses or Extracted Text'}
            </label>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {documentText.length} {isHindi ? 'अक्षर' : 'characters'}
            </span>
          </div>
          <textarea
            rows={8}
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder={isHindi
              ? "यहाँ अनुबंध की शर्तें, एग्रीमेंट का टेक्स्ट अथवा विवादित क्लाउज पेस्ट करें..."
              : "Paste the contract clauses, rent agreement, or employment contract text here to inspect..."}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--card-border)',
              fontSize: '13.5px',
              fontFamily: 'monospace',
              lineHeight: '1.5',
              background: 'var(--subtle-bg)',
              color: 'var(--text-main)',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {error && (
          <div style={{ background: 'var(--danger-light)', border: '1px solid var(--danger-border)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius-xs)', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} /> {error}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
          {documentText && (
            <button
              type="button"
              onClick={() => { setDocumentText(''); setAnalysis(null); setError(null); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '13.5px',
                cursor: 'pointer',
                padding: '8px 12px'
              }}
            >
              {isHindi ? 'साफ़ करें' : 'Clear'}
            </button>
          )}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary"
            style={{
              padding: '11px 24px',
              fontSize: '14px',
              opacity: loading ? 0.75 : 1
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={17} className="ask-ai-send-loading" />
                {isHindi ? 'कानूनी ऑडिट जारी है...' : 'Auditing Contract Clauses...'}
              </>
            ) : (
              <>
                <Sparkles size={17} />
                {isHindi ? 'अनुबंध की कानूनी समीक्षा करें' : 'Audit Document for Legal Red Flags'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Analysis Results View */}
      <AnalysisResultsView analysis={analysis} isHindi={isHindi} copyClause={copyClause} />

      {/* Toast Notification */}
      {copiedIndex !== null && (
        <div className="toast-container">
          <div className="toast-message">
            <CheckCircle2 size={18} color="var(--accent)" />
            {isHindi ? 'शर्त क्लिपबोर्ड पर कॉपी की गई!' : 'Clause copied to clipboard!'}
          </div>
        </div>
      )}
    </div>
  );
}
