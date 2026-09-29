import React from 'react';
import { Calendar, MapPin, Mic, MicOff, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import { EVIDENCE_PRESETS } from './DrafterConstants';

export default function DrafterStep3({
  incidentDatetime,
  setIncidentDatetime,
  incidentLocation,
  setIncidentLocation,
  facts,
  setFacts,
  selectedEvidences,
  setSelectedEvidences,
  customEvidence,
  setCustomEvidence,
  reliefSought,
  setReliefSought,
  isListening,
  handleToggleVoiceInput,
  setStep,
  isHindi
}) {
  const handleEvidenceToggle = (id) => {
    if (selectedEvidences.includes(id)) {
      setSelectedEvidences(selectedEvidences.filter(item => item !== id));
    } else {
      setSelectedEvidences([...selectedEvidences, id]);
    }
  };

  return (
    <div className="drafter-step-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="var(--primary)" />
            {isHindi ? 'घटना का दिनांक व समय *' : 'Date & Time of Occurrence *'}
          </label>
          <input
            type="text"
            className="input-field"
            value={incidentDatetime}
            onChange={e => setIncidentDatetime(e.target.value)}
            placeholder={isHindi ? 'उदा. 21-09-2026, दोपहर 02:30 बजे' : 'e.g. 21-09-2026, 02:30 PM'}
            style={{ height: '42px', fontSize: '13.5px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={15} color="var(--primary)" />
            {isHindi ? 'घटना का स्थान *' : 'Exact Place of Occurrence *'}
          </label>
          <input
            type="text"
            className="input-field"
            value={incidentLocation}
            onChange={e => setIncidentLocation(e.target.value)}
            placeholder={isHindi ? 'उदा. रिंग रोड चौराहा / ऑनलाइन इंटरनेट बैंकिंग' : 'e.g. Sector 18 Market / Online Banking'}
            style={{ height: '42px', fontSize: '13.5px' }}
          />
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
            {isHindi ? 'घटना का संपूर्ण विवरण (Facts of the Case) *' : 'Detailed Statement of Facts *'}
          </label>
          <button
            type="button"
            onClick={handleToggleVoiceInput}
            className={isListening ? 'mic-recording-pulse' : 'btn-ghost'}
            style={{
              background: isListening ? '#fee2e2' : 'rgba(59, 130, 246, 0.08)',
              color: isListening ? '#dc2626' : 'var(--primary)',
              border: isListening ? '1px solid #fca5a5' : '1px solid rgba(59, 130, 246, 0.2)',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            {isListening ? (
              <>
                <MicOff size={14} />
                {isHindi ? 'बोलना बंद करें' : 'Stop Listening'}
              </>
            ) : (
              <>
                <Mic size={14} />
                {isHindi ? 'बोलकर टाइप करें' : 'Voice Type'}
              </>
            )}
          </button>
        </div>
        <textarea
          rows={5}
          className="input-field"
          value={facts}
          onChange={e => setFacts(e.target.value)}
          placeholder={isHindi
            ? 'क्रमबद्ध रूप से लिखें कि क्या हुआ, आरोपी ने क्या कहा या किया, क्या नुकसान हुआ, आदि...'
            : 'State what happened in chronological order: what the accused did, transaction details, loss or injury caused...'}
          style={{ fontSize: '13.5px', lineHeight: '1.5', resize: 'vertical' }}
        />
      </div>

      {/* Evidence Checklist */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
          {isHindi ? 'संलग्न साक्ष्य व प्रमाण चुनें (Checklist of Evidence):' : 'Select Attached Evidence & Enclosures:'}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '8px' }}>
          {EVIDENCE_PRESETS.map(item => {
            const isSelected = selectedEvidences.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleEvidenceToggle(item.id)}
                style={{
                  background: isSelected ? 'var(--primary-light)' : 'var(--card-bg)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '12.5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  border: isSelected ? 'none' : '1px solid var(--card-border)',
                  background: isSelected ? 'var(--primary)' : 'var(--card-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {isSelected && <Check size={12} />}
                </div>
                <span style={{ color: 'var(--text-main)' }}>{isHindi ? item.hi : item.en}</span>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '10px' }}>
          <input
            type="text"
            className="input-field"
            value={customEvidence}
            onChange={e => setCustomEvidence(e.target.value)}
            placeholder={isHindi ? 'अन्य कोई दस्तावेज या शिकायत संख्या (उदा. 1930 साइबर कंप्लेंट पावती)' : 'Other additional documents or complaint references (optional)'}
            style={{ height: '38px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Relief / Prayer */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>
          {isHindi ? 'मांगी गई राहत / कानूनी प्रार्थना (Relief / Prayer)' : 'Relief / Demands Sought'}
        </label>
        <input
          type="text"
          className="input-field"
          value={reliefSought}
          onChange={e => setReliefSought(e.target.value)}
          placeholder={isHindi
            ? 'उदा. धारा 173 BNSS के तहत तुरंत FIR दर्ज कर अभियुक्तों की गिरफ्तारी व वसूली की जाए।'
            : 'e.g. Immediate registration of FIR, freezing of beneficiary accounts, and recovery of damages.'}
          style={{ height: '42px', fontSize: '13.5px' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <button
          type="button"
          onClick={() => setStep(2)}
          style={{ background: 'none', border: '1px solid #cbd5e1', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> {isHindi ? 'पीछे जाएं' : 'Back'}
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setStep(4)}
          disabled={!facts.trim() || !incidentLocation.trim()}
          style={{ opacity: (!facts.trim() || !incidentLocation.trim()) ? 0.6 : 1 }}
        >
          {isHindi ? 'समीक्षा करें (Review Details)' : 'Review Details'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
