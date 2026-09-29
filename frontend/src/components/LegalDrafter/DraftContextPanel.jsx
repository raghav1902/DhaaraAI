import React from 'react';
import { FileText, CheckCircle2, Circle, UserRound, MapPin, CalendarDays, Paperclip } from 'lucide-react';

export default function DraftContextPanel({ step, documentType, incidentCategory, complainant, incidentDatetime, incidentLocation, facts, selectedEvidences, reliefSought, isHindi }) {
  const details = [
    { icon: UserRound, label: isHindi ? 'आवेदक' : 'Applicant', value: complainant.name },
    { icon: CalendarDays, label: isHindi ? 'दिनांक व समय' : 'Date & time', value: incidentDatetime },
    { icon: MapPin, label: isHindi ? 'घटना का स्थान' : 'Incident location', value: incidentLocation },
    { icon: Paperclip, label: isHindi ? 'चुने गए साक्ष्य' : 'Evidence selected', value: selectedEvidences.length ? `${selectedEvidences.length} ${isHindi ? 'संलग्नक' : 'items'}` : '' }
  ];
  const sections = [
    { label: isHindi ? 'दस्तावेज़ का प्रकार' : 'Document type', done: Boolean(documentType) },
    { label: isHindi ? 'पक्षकारों का विवरण' : 'Party details', done: Boolean(complainant.name && complainant.phone) },
    { label: isHindi ? 'घटना व साक्ष्य' : 'Incident & evidence', done: Boolean(facts.trim() && incidentLocation.trim()) },
    { label: isHindi ? 'अंतिम समीक्षा' : 'Final review', done: step > 4 }
  ];

  return (
    <aside className="drafter-context-panel" aria-label={isHindi ? 'ड्राफ्ट सारांश' : 'Draft summary'}>
      <section className="drafter-context-card">
        <div className="drafter-context-title"><span><FileText size={17} /></span><div><h3>{isHindi ? 'ड्राफ्ट का सारांश' : 'Draft at a glance'}</h3><p>{isHindi ? 'आपके मौजूदा विवरण' : 'Your current details'}</p></div></div>
        <div className="drafter-context-document"><small>{isHindi ? 'चुना गया दस्तावेज़' : 'SELECTED DOCUMENT'}</small><strong>{documentType === 'Legal Demand Notice' ? (isHindi ? 'विधिक मांग नोटिस' : 'Legal Demand Notice') : (isHindi ? 'FIR शिकायत आवेदन' : 'FIR Complaint Application')}</strong><span>{incidentCategory}</span></div>
        <div className="drafter-context-details">{details.map(({ icon: Icon, label, value }) => <div className="drafter-context-detail" key={label}><Icon size={14} /><div><small>{label}</small><strong>{value || (isHindi ? 'अभी जोड़ा नहीं गया' : 'Not added yet')}</strong></div></div>)}</div>
        {reliefSought.trim() && <div className="drafter-context-relief"><small>{isHindi ? 'मांगी गई राहत' : 'RELIEF SOUGHT'}</small><p>{reliefSought}</p></div>}
      </section>
      <section className="drafter-context-card drafter-context-progress">
        <h3>{isHindi ? 'तैयारी की स्थिति' : 'Preparation progress'}</h3>
        {sections.map(({ label, done }) => <div className="drafter-context-check" key={label}>{done ? <CheckCircle2 size={15} /> : <Circle size={15} />}<span>{label}</span><b>{done ? (isHindi ? 'पूरा' : 'Done') : (isHindi ? 'बाकी' : 'Next')}</b></div>)}
      </section>
      <div className="drafter-context-note"><FileText size={15} /><span>{isHindi ? 'वास्तविक दस्तावेज़ जनरेट करने के बाद उसका पूर्वावलोकन यहां उपलब्ध होगा।' : 'The generated legal document preview is available after you create the draft.'}</span></div>
    </aside>
  );
}
