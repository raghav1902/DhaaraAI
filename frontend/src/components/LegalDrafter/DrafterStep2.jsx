import React from 'react';
import { User, UserX, ArrowLeft, ArrowRight } from 'lucide-react';

export default function DrafterStep2({
  complainant,
  setComplainant,
  isAccusedUnknown,
  setIsAccusedUnknown,
  accused,
  setAccused,
  setStep,
  isHindi
}) {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
      {/* Complainant Section */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '18px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '15px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="var(--primary)" />
          {isHindi ? 'परिवादी / आवेदक का विवरण (Complainant Particulars)' : 'Complainant / Sender Particulars'}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              {isHindi ? 'आवेदक का पूरा नाम *' : 'Full Name *'}
            </label>
            <input
              type="text"
              className="input-field"
              value={complainant.name}
              onChange={e => setComplainant({ ...complainant, name: e.target.value })}
              placeholder={isHindi ? 'उदा. राजेश शर्मा' : 'e.g. Rajesh Sharma'}
              style={{ height: '40px', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              {isHindi ? 'पिता / पति का नाम' : 'Father / Spouse Name'}
            </label>
            <input
              type="text"
              className="input-field"
              value={complainant.father_name}
              onChange={e => setComplainant({ ...complainant, father_name: e.target.value })}
              placeholder={isHindi ? 'उदा. श्री मोहन शर्मा' : 'e.g. Shri Mohan Sharma'}
              style={{ height: '40px', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              {isHindi ? 'मोबाइल नंबर *' : 'Contact Mobile No. *'}
            </label>
            <input
              type="text"
              className="input-field"
              value={complainant.phone}
              onChange={e => setComplainant({ ...complainant, phone: e.target.value })}
              placeholder="98XXXXXXXX"
              style={{ height: '40px', fontSize: '13.5px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              {isHindi ? 'संबंधित पुलिस थाना / शहर *' : 'Jurisdictional Police Station / City *'}
            </label>
            <input
              type="text"
              className="input-field"
              value={complainant.police_station}
              onChange={e => setComplainant({ ...complainant, police_station: e.target.value })}
              placeholder={isHindi ? 'उदा. थाना कोतवाली, जयपुर' : 'e.g. PS Cyber Crime / Connaught Place'}
              style={{ height: '40px', fontSize: '13.5px' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              {isHindi ? 'आवेदक का पूरा स्थायी/वर्तमान पता *' : 'Full Residential Address *'}
            </label>
            <input
              type="text"
              className="input-field"
              value={complainant.address}
              onChange={e => setComplainant({ ...complainant, address: e.target.value })}
              placeholder={isHindi ? 'मकान नंबर, गली, इलाका, शहर, पिन कोड' : 'House No, Street, Landmark, City, PIN Code'}
              style={{ height: '40px', fontSize: '13.5px' }}
            />
          </div>
        </div>
      </div>

      {/* Accused Section */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '18px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserX size={18} color="#dc2626" />
            {isHindi ? 'आरोपी / प्रतिवादी का विवरण (Accused Particulars)' : 'Accused / Respondent Particulars'}
          </h4>

          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              checked={isAccusedUnknown}
              onChange={e => setIsAccusedUnknown(e.target.checked)}
              style={{ width: '16px', height: '16px' }}
            />
            <strong>{isHindi ? 'आरोपी अज्ञात है (उदा. साइबर फ्रॉड, चोरी, हिट एंड रन)' : 'Accused is Unknown / Cyber Culprit'}</strong>
          </label>
        </div>

        {!isAccusedUnknown ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '500', color: '#475569', marginBottom: '4px', display: 'block' }}>
                {isHindi ? 'आरोपी का नाम या संस्था *' : 'Accused Name / Organization *'}
              </label>
              <input
                type="text"
                className="input-field"
                value={accused.name}
                onChange={e => setAccused({ ...accused, name: e.target.value })}
                placeholder={isHindi ? 'उदा. सुमित सक्सेना / एक्सवाईजेड फाइनेंस' : 'e.g. Sumit Saxena / XYZ Finance'}
                style={{ height: '40px', fontSize: '13.5px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '500', color: '#475569', marginBottom: '4px', display: 'block' }}>
                {isHindi ? 'आरोपी का पता / मोबाइल / डिजिटल हैंडल' : 'Address / Mobile / Handle'}
              </label>
              <input
                type="text"
                className="input-field"
                value={accused.address}
                onChange={e => setAccused({ ...accused, address: e.target.value })}
                placeholder={isHindi ? 'पता, फोन नंबर, या डिजिटल खाता' : 'Known residence, phone, or Telegram/bank ID'}
                style={{ height: '40px', fontSize: '13.5px' }}
              />
            </div>
          </div>
        ) : (
          <div style={{ background: 'var(--subtle-bg)', padding: '12px 16px', borderRadius: '8px', border: '1px dashed var(--card-border)', fontSize: '13px', color: 'var(--text-muted)' }}>
            {isHindi
              ? 'आरोपी को "अज्ञात व्यक्ति (Unknown Culprit)" के रूप में चिह्नित किया गया है। पुलिस धारा 173 BNSS के तहत तकनीकी विश्लेषण, बैंक UTR व कॉल रिकॉर्ड के आधार पर आरोपी की शिनाख्त करेगी।'
              : 'Accused will be formally addressed as "Unknown Person(s)". Investigating officers will trace the culprits using cyber/banking audit trails under Section 173 BNSS.'}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '20px' }}>
        <button
          type="button"
          onClick={() => setStep(1)}
          style={{ background: 'none', border: '1px solid #cbd5e1', padding: '9px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> {isHindi ? 'पीछे जाएं' : 'Back'}
        </button>

        <button
          type="button"
          className="btn-primary"
          onClick={() => setStep(3)}
          disabled={!complainant.name || !complainant.phone}
          style={{ opacity: (!complainant.name || !complainant.phone) ? 0.6 : 1 }}
        >
          {isHindi ? 'आगे बढ़ें (घटना व साक्ष्य)' : 'Next (Incident & Evidence)'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
