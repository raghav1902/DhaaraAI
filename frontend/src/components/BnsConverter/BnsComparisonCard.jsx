import React from 'react';
import { Gavel, Shield, Scale, MessageSquare, BookOpen, AlertCircle } from 'lucide-react';

export default function BnsComparisonCard({ selectedItem, isHindi, onAskAi }) {
  if (!selectedItem) {
    return (
      <div className="glass-panel" style={{ padding: '36px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        {isHindi ? 'विस्तार देखने हेतु बाईं ओर से कोई धारा चुनें।' : 'Select a legal section from the list to view side-by-side details.'}
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Title Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.04em' }}>
            {selectedItem.category}
          </span>
        </div>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
          {isHindi ? selectedItem.offense_hi : selectedItem.offense_en}
        </h3>
      </div>

      {/* Split Comparison Cards: BNS vs IPC */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
        {/* Active Law: BNS */}
        <div style={{
          background: 'var(--accent-light)',
          border: '1px solid var(--accent-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px'
        }}>
          <div style={{ fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.04em' }}>
            {isHindi ? 'लागू नया कानून (1 जुलाई 2024 से)' : 'Current Active Law (Post July 1, 2024)'}
          </div>
          <div style={{ fontSize: '19px', fontWeight: '800', color: 'var(--accent)', margin: '4px 0 2px' }}>
            BNS Section {selectedItem.bns_section}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-main)', fontWeight: '700', lineHeight: '1.4' }}>
            {selectedItem.bns_title}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {selectedItem.bns_act || 'Bharatiya Nyaya Sanhita, 2023'}
          </div>
        </div>

        {/* Legacy Law: IPC */}
        <div style={{
          background: 'var(--subtle-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'var(--radius-md)',
          padding: '16px'
        }}>
          <div style={{ fontSize: '10.5px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            {isHindi ? 'पुराना निरस्त कानून (30 जून 2024 तक)' : 'Legacy Law (Pre July 1, 2024)'}
          </div>
          <div style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-main)', margin: '4px 0 2px' }}>
            IPC Section {selectedItem.ipc_section}
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', fontWeight: '700', lineHeight: '1.4' }}>
            {selectedItem.ipc_title}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {selectedItem.ipc_act || 'Indian Penal Code, 1860'}
          </div>
        </div>
      </div>

      {/* Statutory Parameters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
        <div style={{ background: 'var(--subtle-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
            {isHindi ? 'अपराध की प्रकृति' : 'Offense Nature'}
          </span>
          <span className={`badge ${selectedItem.nature === 'Cognizable' ? 'badge-danger' : 'badge-success'}`} style={{ marginTop: '5px' }}>
            {selectedItem.nature}
          </span>
        </div>
        <div style={{ background: 'var(--subtle-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
            {isHindi ? 'जमानत की स्थिति' : 'Bail Status'}
          </span>
          <span className={`badge ${selectedItem.bailable === 'Bailable' ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: '5px' }}>
            {selectedItem.bailable}
          </span>
        </div>
        <div style={{ background: 'var(--subtle-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
            {isHindi ? 'सुनवाई अदालत' : 'Triable By'}
          </span>
          <span className="badge badge-info" style={{ marginTop: '5px' }}>
            {selectedItem.triable_by}
          </span>
        </div>
      </div>

      {/* Punishment Details */}
      <div style={{ background: 'var(--subtle-bg)', border: '1px solid var(--card-border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
          <Gavel size={16} color="var(--warning)" />
          <span style={{ fontSize: '13px', fontWeight: '750', color: 'var(--text-main)' }}>
            {isHindi ? 'सजा व जुर्माना प्रावधान' : 'Punishment & Penalty Specification'}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.55' }}>
          {selectedItem.punishment}
        </p>
      </div>

      {/* BNSS Procedure Note */}
      {selectedItem.bnss_procedure && (
        <div style={{ background: 'var(--primary-light)', border: '1px solid var(--primary-border)', borderRadius: 'var(--radius-sm)', padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <Shield size={16} color="var(--primary)" />
            <span style={{ fontSize: '13px', fontWeight: '750', color: 'var(--primary)' }}>
              {isHindi ? 'BNSS 2023 प्रक्रिया व कानूनी सुरक्षा नियम' : 'BNSS 2023 Procedural Safeguards & Trial Note'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-main)', lineHeight: '1.55' }}>
            {selectedItem.bnss_procedure}
          </p>
        </div>
      )}

      {/* Victim vs Accused Guidance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {selectedItem.victim_guidance && (
          <div style={{ background: 'var(--accent-light)', border: '1px solid var(--accent-border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Shield size={14} /> {isHindi ? 'पीड़ित / शिकायतकर्ता हेतु उपाय:' : 'Action Plan for Victim / Complainant:'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.5' }}>
              {selectedItem.victim_guidance}
            </span>
          </div>
        )}
        {selectedItem.accused_guidance && (
          <div style={{ background: 'var(--warning-light)', border: '1px solid var(--warning-border)', borderRadius: 'var(--radius-sm)', padding: '12px 14px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--warning)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Scale size={14} /> {isHindi ? 'आरोपी पक्ष हेतु वैधानिक सुरक्षाएं:' : 'Statutory Safeguards for Accused Person:'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: '1.5' }}>
              {selectedItem.accused_guidance}
            </span>
          </div>
        )}
      </div>

      {/* Ask AI Action Button */}
      {onAskAi && (
        <button
          type="button"
          onClick={() => onAskAi(`Explain BNS Section ${selectedItem.bns_section} (${selectedItem.offense_en}) and how it compares to IPC ${selectedItem.ipc_section}. What are the bail rules and trial procedure?`)}
          className="btn-primary"
          style={{
            background: 'linear-gradient(135deg, var(--emerald-600), var(--emerald-700))',
            color: '#fff',
            marginTop: 'auto'
          }}
        >
          <MessageSquare size={16} />
          <span>{isHindi ? 'इस धारा पर AI से कानूनी सलाह लें' : 'Consult LegalGPT About This Section'}</span>
        </button>
      )}
    </div>
  );
}
