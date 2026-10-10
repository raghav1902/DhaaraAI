import React from 'react';
import {
  ShieldCheck,
  FileText,
  ArrowUpRight,
  FileSearch,
  Shield,
  Lock,
  Download,
  Database,
  Check,
  LockKeyhole
} from 'lucide-react';

export default function VaultEmptyGuide({ isHindi, onNavigateTab }) {
  return (
    <div className="legal-vault__ready-stage">
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
  );
}
