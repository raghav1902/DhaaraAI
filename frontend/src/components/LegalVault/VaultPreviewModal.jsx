import React, { useState } from 'react';
import { X, FolderOpen, Share2, Copy, Check, Download } from 'lucide-react';

export default function VaultPreviewModal({
  previewDraft,
  setPreviewDraft,
  openShareModal,
  isHindi,
  autoClassifyDraft
}) {
  const [copied, setCopied] = useState(false);

  if (!previewDraft) return null;

  return (
    <div
      className="legal-vault__modal-overlay"
      onClick={() => setPreviewDraft(null)}
      role="dialog"
      aria-modal="true"
    >
      <div className="legal-vault__modal-dialog" onClick={(e) => e.stopPropagation()}>
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

        <div className="legal-vault__modal-body">
          <pre className="legal-vault__document-text">{previewDraft.content}</pre>
        </div>

        <div className="legal-vault__modal-footer">
          <button
            className="btn-secondary"
            onClick={() => {
              const draftToShare = previewDraft;
              setPreviewDraft(null);
              openShareModal(draftToShare);
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
  );
}
