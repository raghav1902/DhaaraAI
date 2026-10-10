import React from 'react';
import {
  FolderOpen,
  SlidersHorizontal,
  Trash2,
  Clock,
  Eye,
  Share2,
  Download
} from 'lucide-react';

export default function VaultDocCard({
  draft,
  isHindi,
  movingDraftId,
  setMovingDraftId,
  handleUpdateFolder,
  handleDelete,
  setPreviewDraft,
  openShareModal,
  vaultFolders
}) {
  return (
    <div className="legal-vault__card">
      <div className="legal-vault__card-header">
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
                {vaultFolders.filter((f) => f.id !== 'all').map((f) => (
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
  );
}
