import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  FileSearch,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Copy,
  Check,
  Sparkles,
  FileText,
  Scale,
  Lightbulb,
  Info,
  RefreshCw,
  Upload,
  FileCheck,
  Loader2
} from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/contractAnalyzerData';
import AnalysisResultsView from './DocumentAnalyzer/AnalysisResultsView';

export default function DocumentAnalyzer({ language = 'English' }) {
  const isHindi = language === 'Hindi';
  const [documentType, setDocumentType] = useState('Rental / Lease Agreement');
  const [documentText, setDocumentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:8000/api/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data && res.data.text) {
        setDocumentText(res.data.text);
        setUploadedFileName(res.data.filename);
        setAnalysis(null);
      } else {
        setError(isHindi ? 'दस्तावेज से टेक्स्ट नहीं निकाला जा सका।' : 'Could not extract text from document.');
      }
    } catch (err) {
      console.error('File upload error:', err);
      const detail = err.response?.data?.detail;
      setError(detail || (isHindi ? 'दस्तावेज अपलोड करने में त्रुटि आई।' : 'Failed to upload and extract document.'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError(isHindi ? 'कृपया अनुबंध का टेक्स्ट दर्ज करें।' : 'Please enter or paste the contract text to audit.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:8000/api/analyze-contract', {
        document_text: documentText,
        document_type: documentType,
        language: language
      });
      setAnalysis(res.data);
    } catch (err) {
      console.error('Contract audit error:', err);
      setError(isHindi
        ? '[500 Internal Server Error] दस्तावेज विश्लेषण में त्रुटि आई। कृपया पुनः प्रयास करें या बैकएंड की स्थिति जांचें।'
        : '[500 Internal Server Error] Failed to analyze document. Ensure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const copyClause = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const getRiskBadgeColor = (score) => {
    const s = String(score).toLowerCase();
    if (s.includes('critical')) return { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' };
    if (s.includes('high')) return { bg: '#ffedd5', text: '#9a3412', border: '#fdba74' };
    if (s.includes('medium')) return { bg: '#fef9c3', text: '#854d0e', border: '#fde047' };
    return { bg: '#dcfce7', text: '#166534', border: '#86efac' };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="" style={{ padding: '24px', borderRadius: '16px', borderLeft: '5px solid var(--primary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', padding: '12px', borderRadius: '14px', color: '#fff' }}>
              <FileSearch size={26} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
                {isHindi ? 'AI विधिक दस्तावेज व अनुबंध समीक्षक (Contract Audit)' : 'AI Legal Document & Contract Risk Analyzer'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                {isHindi
                  ? 'भारतीय अनुबंध कानून (Indian Contract Act 1872), मॉडल टेनेंसी एक्ट व उपभोक्ता संरक्षण कानूनों के तहत एकतरफा व गैर-कानूनी शर्तों की जांच करें।'
                  : 'Screen rental deeds, employment bonds, and freelance agreements for unfair clauses, unlawful forfeiture, and Indian statutory compliance.'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Sample Chips */}
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
            {isHindi ? 'नमूना अनुबंध लोड करें:' : 'Load Sample Contract:'}
          </span>
          <button
            type="button"
            onClick={() => loadSample('rent')}
            style={{
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.25)',
              color: 'var(--primary)',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '12.5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {isHindi ? 'आवासीय किराया अनुबंध' : 'Rental Agreement'}
          </button>
          <button
            type="button"
            onClick={() => loadSample('employment')}
            style={{
              background: 'rgba(234, 88, 12, 0.08)',
              border: '1px solid rgba(234, 88, 12, 0.25)',
              color: '#ea580c',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '12.5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {isHindi ? 'जॉब व सर्विस बॉन्ड' : 'Employment Bond'}
          </button>
          <button
            type="button"
            onClick={() => loadSample('freelance')}
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#059669',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '12.5px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            {isHindi ? 'फ्रीलांस सर्विस अनुबंध' : 'Freelance Agreement'}
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 240px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '6px', color: 'var(--text-main)' }}>
              {isHindi ? 'दस्तावेज का प्रकार' : 'Document Category'}
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#fff',
                fontSize: '14px',
                outline: 'none',
                color: 'var(--text-main)'
              }}
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

        {/* Document Upload Area */}
        <div style={{
          border: '2px dashed #cbd5e1',
          borderRadius: '12px',
          padding: '16px 20px',
          background: '#f8fafc',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          transition: 'all 0.2s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '10px', color: 'var(--primary)', display: 'flex' }}>
              <Upload size={20} />
            </div>
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-main)' }}>
                {isHindi ? 'PDF या टेक्स्ट दस्तावेज अपलोड करें' : 'Upload Contract / Legal PDF'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {isHindi ? 'समर्थित प्रारूप: .pdf, .txt (स्वचालित टेक्स्ट निष्कर्षण)' : 'Supported formats: .pdf, .txt (auto text extraction)'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.txt,.md"
              style={{ display: 'none' }}
              id="contract-file-upload"
            />
            <label
              htmlFor="contract-file-upload"
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--primary)',
                cursor: uploading ? 'wait' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
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
                  {isHindi ? 'फाइल चुनें (.pdf / .txt)' : 'Browse File'}
                </>
              )}
            </label>
          </div>
        </div>

        {uploadedFileName && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '8px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontSize: '12.5px' }}>
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
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              fontSize: '13.5px',
              fontFamily: 'monospace',
              lineHeight: '1.5',
              background: '#f8fafc',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {error && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '12px 16px', borderRadius: '8px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
            style={{
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '11px 24px',
              fontSize: '14.5px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              opacity: loading ? 0.75 : 1
            }}
          >
            {loading ? (
              <>
                <RefreshCw size={18} className="spin" />
                {isHindi ? 'कानूनी ऑडिट जारी है...' : 'Auditing Contract...'}
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {isHindi ? 'अनुबंध की कानूनी समीक्षा करें' : 'Audit Document for Red Flags'}
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
            <CheckCircle2 size={18} color="#4ade80" />
            {isHindi ? 'शर्त क्लिपबोर्ड पर कॉपी की गई!' : 'Clause copied to clipboard!'}
          </div>
        </div>
      )}
    </div>
  );
}
