import React from 'react';
import { CheckCircle2, AlertCircle, ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';

export default function DrafterStep4({
  documentType,
  incidentCategory,
  complainant,
  accused,
  isAccusedUnknown,
  incidentDatetime,
  incidentLocation,
  facts,
  draftError,
  isGenerating,
  handleGenerateDraft,
  setStep,
  isHindi
}) {
  return (
    <div className="drafter-step-content drafter-review-step animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
      <div style={{ background: 'var(--subtle-bg)', borderRadius: '12px', border: '1px solid var(--card-border)', padding: '20px' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: '17px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={20} color="var(--primary)" />
          {isHindi ? 'विवरण की अंतिम समीक्षा (Draft Summary)' : 'Draft Parameters Summary'}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '13.5px' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'दस्तावेज़:' : 'Document:'}</span>
            <strong>{documentType}</strong> ({isHindi ? 'हिंदी प्रारूप' : 'English Draft'})
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'श्रेणी:' : 'Category:'}</span>
            <strong>{incidentCategory}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'परिवादी:' : 'Complainant:'}</span>
            <strong>{complainant.name || 'N/A'}</strong> ({complainant.phone})
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'आरोपी:' : 'Accused:'}</span>
            <strong>{isAccusedUnknown ? (isHindi ? 'अज्ञात व्यक्ति' : 'Unknown Person') : accused.name}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'समय व स्थान:' : 'Time & Place:'}</span>
            <span>{incidentDatetime || 'N/A'} | {incidentLocation || 'N/A'}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px' }}>{isHindi ? 'संबंधित थाना:' : 'Police Station:'}</span>
            <span>{complainant.police_station || 'Jurisdictional PS'}</span>
          </div>
        </div>

        <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--card-border)' }}>
          <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '12px', marginBottom: '4px' }}>
            {isHindi ? 'घटना के तथ्य:' : 'Factual Brief:'}
          </span>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-main)', background: 'var(--card-bg)', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--card-border)' }}>
            {facts}
          </p>
        </div>
      </div>

      {draftError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px' }}>
          <AlertCircle size={18} />
          <span>{draftError}</span>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '20px' }}>
        <button
          type="button"
          onClick={() => setStep(3)}
          disabled={isGenerating}
          style={{ background: 'none', border: '1px solid #cbd5e1', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> {isHindi ? 'बदलाव करें' : 'Edit Details'}
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={handleGenerateDraft}
          disabled={isGenerating}
          style={{ padding: '12px 28px', fontSize: '15px', fontWeight: '600' }}
        >
          {isGenerating ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              {isHindi ? 'कानूनी ड्राफ्ट तैयार किया जा रहा है...' : 'Generating Official Legal Draft...'}
            </>
          ) : (
            <>
              <Sparkles size={18} />
              {isHindi ? 'अंतिम ड्राफ्ट जनरेट करें' : 'Generate Formal Legal Draft'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
