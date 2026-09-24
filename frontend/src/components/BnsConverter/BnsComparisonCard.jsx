import React from 'react';
import { Gavel, Shield, Scale } from 'lucide-react';

export default function BnsComparisonCard({ selectedItem, isHindi, onAskAi }) {
  if (!selectedItem) {
    return (
      <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        {isHindi ? 'विस्तार देखने हेतु बाईं ओर से कोई धारा चुनें।' : 'Select a section from the list to view side-by-side details.'}
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Title Header */}
      <div>
        <span style={{ fontSize: '11.5px', fontWeight: '700', textTransform: 'uppercase', color: '#059669', letterSpacing: '0.04em' }}>
          {selectedItem.category}
        </span>
        <h3 style={{ margin: '4px 0', fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
          {isHindi ? selectedItem.offense_hi : selectedItem.offense_en}
        </h3>
      </div>

      {/* Split Comparison Boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
        {/* Active Law: BNS */}
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#166534' }}>
            {isHindi ? 'लागू नया कानून (1 जुलाई 2024 से)' : 'Current Active Law (Post July 1, 2024)'}
          </span>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#15803d', margin: '4px 0' }}>
            BNS Section {selectedItem.bns_section}
          </div>
          <div style={{ fontSize: '12.5px', color: '#14532d', fontWeight: '600', lineHeight: '1.4' }}>
            {selectedItem.bns_title}
          </div>
          <div style={{ fontSize: '11px', color: '#166534', marginTop: '4px' }}>
            {selectedItem.bns_act}
          </div>
        </div>

        {/* Legacy Law: IPC */}
        <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#475569' }}>
            {isHindi ? 'पुराना निरस्त कानून (30 जून 2024 तक)' : 'Legacy Law (Pre July 1, 2024)'}
          </span>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#334155', margin: '4px 0' }}>
            IPC Section {selectedItem.ipc_section}
          </div>
          <div style={{ fontSize: '12.5px', color: '#475569', fontWeight: '600', lineHeight: '1.4' }}>
            {selectedItem.ipc_title}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            {selectedItem.ipc_act}
          </div>
        </div>
      </div>

      {/* Statutory Parameters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
            {isHindi ? 'अपराध की प्रकृति' : 'Offense Nature'}
          </span>
          <span className={`badge ${selectedItem.nature === 'Cognizable' ? 'badge-danger' : 'badge-success'}`} style={{ marginTop: '4px' }}>
            {selectedItem.nature}
          </span>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
            {isHindi ? 'जमानत की स्थिति' : 'Bail Status'}
          </span>
          <span className={`badge ${selectedItem.bailable === 'Bailable' ? 'badge-success' : 'badge-danger'}`} style={{ marginTop: '4px' }}>
            {selectedItem.bailable}
          </span>
        </div>
        <div style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>
            {isHindi ? 'सुनवाई अदालत' : 'Triable By'}
          </span>
          <span className="badge badge-info" style={{ marginTop: '4px' }}>
            {selectedItem.triable_by}
          </span>
        </div>
      </div>

      {/* Punishment Details */}
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Gavel size={16} color="#d97706" />
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
            {isHindi ? 'सजा व जुर्माना प्रावधान' : 'Punishment & Penalty Specification'}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: '1.5' }}>
          {selectedItem.punishment}
        </p>
      </div>

      {/* BNSS Procedure Note */}
      {selectedItem.bnss_procedure && (
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <Shield size={16} color="#2563eb" />
            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e40af' }}>
              {isHindi ? 'BNSS प्रक्रिया व कानूनी सुरक्षा नियम' : 'BNSS 2023 Procedural Safeguard & Trial Note'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '12.5px', color: '#1e3a8a', lineHeight: '1.5' }}>
            {selectedItem.bnss_procedure}
          </p>
        </div>
      )}

      {/* Victim vs Accused Guidance */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {selectedItem.victim_guidance && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Shield size={14} /> {isHindi ? 'पीड़ित / शिकायतकर्ता के अधिकार:' : 'Action Plan for Victim / Complainant:'}
            </span>
            <span style={{ fontSize: '12px', color: '#14532d', lineHeight: '1.5' }}>
              {selectedItem.victim_guidance}
            </span>
          </div>
        )}
        {selectedItem.accused_guidance && (
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 14px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
              <Scale size={14} /> {isHindi ? 'आरोपी पक्ष हेतु सुरक्षा प्रावधान:' : 'Safeguards for Accused / Signer:'}
            </span>
            <span style={{ fontSize: '12px', color: '#78350f', lineHeight: '1.5' }}>
              {selectedItem.accused_guidance}
            </span>
          </div>
        )}
      </div>

      {/* Ask AI Action Button */}
      {onAskAi && (
        <button
          type="button"
          onClick={() => onAskAi(`Explain BNS Section ${selectedItem.bns_section} (${selectedItem.offense_en}) and how it compares to IPC ${selectedItem.ipc_section}. What are my legal rights?`)}
          style={{
            background: 'linear-gradient(135deg, #059669, #047857)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            padding: '10px 16px',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: 'auto'
          }}
        >
          <Scale size={16} />
          {isHindi ? 'इस धारा पर AI से विस्तृत सलाह लें' : 'Consult AI on this BNS Section'}
        </button>
      )}
    </div>
  );
}
