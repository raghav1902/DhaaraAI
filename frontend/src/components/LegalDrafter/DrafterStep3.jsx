import React from 'react';
import {
  Calendar,
  MapPin,
  Mic,
  MicOff,
  Check,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { EVIDENCE_PRESETS } from './DrafterConstants';
import DrafterTemplateFields from './DrafterTemplateFields';

export default function DrafterStep3({
  documentType = 'FIR Application',
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
  extraFields = {},
  setExtraFields = () => {},
  isListening,
  handleToggleVoiceInput,
  setStep,
  isHindi
}) {
  const updateExtra = (key, value) => {
    setExtraFields(prev => ({ ...prev, [key]: value }));
  };

  const handleEvidenceToggle = (id) => {
    if (selectedEvidences.includes(id)) {
      setSelectedEvidences(selectedEvidences.filter(item => item !== id));
    } else {
      setSelectedEvidences([...selectedEvidences, id]);
    }
  };

  return (
    <div className="drafter-step-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
      {/* 1. Date & Location */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        <div>
          <label style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={15} color="var(--primary)" />
            {isHindi ? 'दस्तावेज़ / घटना का दिनांक व समय *' : 'Date & Time of Incident / Notice *'}
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
            {isHindi ? 'घटना का स्थान / शहर / अधिकार क्षेत्र *' : 'Place of Incident / Jurisdiction *'}
          </label>
          <input
            type="text"
            className="input-field"
            value={incidentLocation}
            onChange={e => setIncidentLocation(e.target.value)}
            placeholder={isHindi ? 'उदा. रिंग रोड चौराहा, जयपुर / ऑनलाइन' : 'e.g. Sector 18 Market, Delhi / Online'}
            style={{ height: '42px', fontSize: '13.5px' }}
          />
        </div>
      </div>

      {/* 2. DYNAMIC TEMPLATE-SPECIFIC FIELDS BOX */}
      <DrafterTemplateFields
        documentType={documentType}
        extraFields={extraFields}
        updateExtra={updateExtra}
        isHindi={isHindi}
      />

      {/* 3. Detailed Facts with Voice Input */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
            {isHindi ? 'घटना का संपूर्ण विवरण (Chronological Facts of the Case) *' : 'Chronological Statement of Facts *'}
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
          className="input-field"
          rows={5}
          value={facts}
          onChange={e => setFacts(e.target.value)}
          placeholder={isHindi
            ? 'घटना का सिलसिलेवार विवरण लिखें (उदा. किसने क्या कहा, कितना लेन-देन हुआ, क्या धोखाधड़ी या घटना घटी)...'
            : 'Detail the facts chronologically (e.g. sequence of events, transaction IDs, breach of trust, verbal communication)...'}
          style={{ width: '100%', resize: 'vertical', fontSize: '13.5px', lineHeight: '1.5' }}
        />
      </div>

      {/* 4. Evidence Presets */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '8px', display: 'block' }}>
          {isHindi ? 'संलग्न किए जाने वाले साक्ष्य व अभिलेख (Evidence / Enclosures):' : 'Attached Supporting Evidence & Enclosures:'}
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
          {EVIDENCE_PRESETS.map(item => {
            const isChecked = selectedEvidences.includes(item.id);
            return (
              <label
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: isChecked ? 'var(--primary-light)' : 'var(--card-bg)',
                  border: isChecked ? '1px solid var(--primary)' : '1px solid var(--card-border)',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  color: isChecked ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: isChecked ? '600' : '400',
                  transition: 'all 0.15s ease'
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleEvidenceToggle(item.id)}
                  style={{ display: 'none' }}
                />
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '4px',
                  border: isChecked ? 'none' : '1.5px solid var(--text-muted)',
                  background: isChecked ? 'var(--primary)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  flexShrink: 0
                }}>
                  {isChecked && <Check size={12} />}
                </span>
                <span>{isHindi ? item.hi : item.en}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Custom Evidence */}
      <div>
        <label style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
          {isHindi ? 'अन्य कोई विशिष्ट साक्ष्य / दस्तावेज़ संख्या:' : 'Any Other Custom Evidence / Document Reference:'}
        </label>
        <input
          type="text"
          className="input-field"
          value={customEvidence}
          onChange={e => setCustomEvidence(e.target.value)}
          placeholder={isHindi ? 'उदा. स्पीड पोस्ट ट्रैकिंग संख्या, गवाहों के नाम...' : 'e.g. Speed Post Tracking No, Witness particulars...'}
          style={{ height: '38px', fontSize: '13px' }}
        />
      </div>

      {/* 6. Relief / Prayer Sought */}
      <div>
        <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-main)', marginBottom: '4px', display: 'block' }}>
          {isHindi ? 'मांगी गई राहत / विधिक प्रार्थना (Relief / Prayer Sought) *' : 'Relief / Prayer Demanded *'}
        </label>
        <textarea
          className="input-field"
          rows={2}
          value={reliefSought}
          onChange={e => setReliefSought(e.target.value)}
          placeholder={isHindi
            ? 'उदा. 15 दिन के भीतर ₹2,50,000 लौटाएं अन्यथा धारा 138 NI Act के तहत मुकदमा किया जाएगा / प्राथमिकी दर्ज की जाए / जमानत मंजूर की जाए...'
            : 'e.g. Registration of FIR and recovery of funds / Pay Rs. 2,50,000 within 15 days / Release applicant on bail...'}
          style={{ width: '100%', resize: 'vertical', fontSize: '13px' }}
        />
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setStep(2)}
          style={{ padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> {isHindi ? 'पीछे (पक्षकारों का विवरण)' : 'Back (Parties Details)'}
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setStep(4)}
          style={{ padding: '9px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {isHindi ? 'आगे बढ़ें (समीक्षा एवं जनरेट)' : 'Next (Review & Generate)'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
