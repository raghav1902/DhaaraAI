import React from 'react';
import { User, UserX, ArrowLeft, ArrowRight } from 'lucide-react';

export default function DrafterStep2({
  documentType = 'FIR Application',
  complainant,
  setComplainant,
  isAccusedUnknown,
  setIsAccusedUnknown,
  accused,
  setAccused,
  setStep,
  isHindi
}) {
  const dt = (documentType || '').toLowerCase();
  const isBail = dt.includes('bail');
  const isRTI = dt.includes('rti');
  const isConsumer = dt.includes('consumer');
  const isMaintenance = dt.includes('maintenance');
  const isAffidavit = dt.includes('affidavit');

  // Dynamic Complainant / Applicant Titles
  let complainantTitle = isHindi ? 'परिवादी / आवेदक का विवरण' : 'Complainant / Sender Particulars';
  let complainantSub = isHindi ? 'आवेदक का पूरा नाम *' : 'Full Name *';
  if (isBail) {
    complainantTitle = isHindi ? 'अभियुक्त / आवेदक का विवरण (Applicant / Accused)' : 'Applicant / Accused Particulars';
    complainantSub = isHindi ? 'अभियुक्त / आवेदक का पूरा नाम *' : 'Accused / Applicant Full Name *';
  } else if (isRTI) {
    complainantTitle = isHindi ? 'आरटीआई आवेदक का विवरण (RTI Applicant)' : 'RTI Applicant Particulars';
    complainantSub = isHindi ? 'आवेदक का पूरा नाम *' : 'RTI Applicant Full Name *';
  } else if (isAffidavit) {
    complainantTitle = isHindi ? 'शपथकर्ता का विवरण (Deponent Particulars)' : 'Deponent Particulars (Person making Oath)';
    complainantSub = isHindi ? 'शपथकर्ता का पूरा नाम *' : 'Deponent Full Name *';
  } else if (isConsumer) {
    complainantTitle = isHindi ? 'उपभोक्ता / परिवादी का विवरण (Consumer / Complainant)' : 'Consumer / Complainant Particulars';
  } else if (isMaintenance) {
    complainantTitle = isHindi ? 'आवेदक (पत्नी / बच्चे / माता-पिता)' : 'Applicant Particulars (Wife / Child / Parent)';
  }

  // Dynamic Accused / Respondent Titles
  let accusedTitle = isHindi ? 'आरोपी / प्रतिवादी का विवरण (Accused Particulars)' : 'Accused / Respondent Particulars';
  let accusedNameLabel = isHindi ? 'प्रतिवादी / आरोपी का नाम *' : 'Name of Accused / Opposite Party *';
  let accusedNamePlaceholder = isHindi ? 'उदा. अमित वर्मा / अज्ञात' : 'e.g. Amit Verma / Unknown entity';
  let accusedAddressLabel = isHindi ? 'प्रतिवादी / आरोपी का पता *' : 'Address of Accused / Opposite Party *';

  if (isBail) {
    accusedTitle = isHindi ? 'विपक्षी: राज्य / अभियोजन (Respondent: State)' : 'Respondent: State / Prosecuting Authority';
    accusedNameLabel = isHindi ? 'विपक्षी (राज्य / पुलिस थाना)' : 'Opposite Party (State through PS)';
    accusedNamePlaceholder = isHindi ? 'राज्य (मार्फत थाना प्रभारी...)' : 'State (Through SHO / Jurisdictional Police)';
  } else if (isRTI) {
    accusedTitle = isHindi ? 'लोक सूचना अधिकारी (Public Authority / PIO)' : 'Public Authority / PIO Office';
    accusedNameLabel = isHindi ? 'विभाग / लोक सूचना अधिकारी (PIO) पदनाम' : 'Public Authority / PIO Designation';
    accusedNamePlaceholder = isHindi ? 'उदा. लोक सूचना अधिकारी, नगर निगम' : 'e.g. Public Information Officer, Municipal Corp.';
    accusedAddressLabel = isHindi ? 'कार्यालय का पूर्ण पता' : 'Office Postal Address';
  } else if (isAffidavit) {
    accusedTitle = isHindi ? 'जिसके समक्ष प्रस्तुत होना है (Authority / Court)' : 'Before Whom Presented (Court / Official Authority)';
    accusedNameLabel = isHindi ? 'सक्षम अधिकारी / न्यायालय / संस्था' : 'Authority / Court / Deposition Purpose';
    accusedNamePlaceholder = isHindi ? 'उदा. नोटरी पब्लिक / सक्षम न्यायालय / पासपोर्ट कार्यालय' : 'e.g. Notary Public / Sessions Court / Passport Office';
  } else if (isConsumer) {
    accusedTitle = isHindi ? 'विपक्षी कंपनी / सेवा प्रदाता (Opposite Party)' : 'Opposite Party (Company / Seller)';
    accusedNameLabel = isHindi ? 'विक्रेता / कंपनी / डीलर का नाम *' : 'Name of Company / Dealer / Manufacturer *';
    accusedNamePlaceholder = isHindi ? 'उदा. मेसर्स एक्सवाईजेड इलेक्ट्रॉनिक्स प्राइवेट लिमिटेड' : 'e.g. M/s XYZ Electronics Pvt. Ltd.';
  } else if (isMaintenance) {
    accusedTitle = isHindi ? 'अनावेदक (पति / संतान / विपक्षी)' : 'Respondent Particulars (Spouse / Respondent)';
    accusedNameLabel = isHindi ? 'अनावेदक (पति) का नाम *' : 'Respondent (Spouse) Name *';
  }

  return (
    <div className="drafter-step-content animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
      {/* Complainant Section */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '18px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
        <h4 style={{ margin: '0 0 14px', fontSize: '15px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="var(--primary)" />
          {complainantTitle}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              {complainantSub}
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
              {isHindi ? 'संबंधित पुलिस थाना / शहर / अधिकार क्षेत्र *' : 'Jurisdictional PS / City / Court *'}
            </label>
            <input
              type="text"
              className="input-field"
              value={complainant.police_station}
              onChange={e => setComplainant({ ...complainant, police_station: e.target.value })}
              placeholder={isHindi ? 'उदा. थाना कोतवाली, जयपुर / कड़कड़डूमा कोर्ट' : 'e.g. PS Cyber Crime / Connaught Place / Sessions Court'}
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

      {/* Accused / Respondent Section */}
      <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '18px', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserX size={18} color="#dc2626" />
            {accusedTitle}
          </h4>
          {!isBail && !isRTI && !isAffidavit && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isAccusedUnknown}
                onChange={e => {
                  setIsAccusedUnknown(e.target.checked);
                  if (e.target.checked) {
                    setAccused({
                      name: isHindi ? 'अज्ञात व्यक्ति (जांच का विषय)' : 'Unknown Person(s) / Under Investigation',
                      address: isHindi ? 'अज्ञात पता (जांच का विषय)' : 'Unknown Address'
                    });
                  } else {
                    setAccused({ name: '', address: '' });
                  }
                }}
              />
              {isHindi ? 'आरोपी / विपक्षी अज्ञात है' : 'Accused / Entity is Unknown'}
            </label>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              {accusedNameLabel}
            </label>
            <input
              type="text"
              className="input-field"
              value={accused.name}
              onChange={e => setAccused({ ...accused, name: e.target.value })}
              disabled={isAccusedUnknown}
              placeholder={accusedNamePlaceholder}
              style={{ height: '40px', fontSize: '13.5px' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', marginBottom: '4px', display: 'block' }}>
              {accusedAddressLabel}
            </label>
            <input
              type="text"
              className="input-field"
              value={accused.address}
              onChange={e => setAccused({ ...accused, address: e.target.value })}
              disabled={isAccusedUnknown}
              placeholder={isHindi ? 'मकान नंबर, व्यावसायिक पता, वेबसाइट, बैंक खाता विवरण या अज्ञात' : 'House / Office No, Street, City, Bank A/c, or Digital URL'}
              style={{ height: '40px', fontSize: '13.5px' }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--card-border)' }}>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => setStep(1)}
          style={{ padding: '9px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> {isHindi ? 'पीछे (प्रारूप चुनें)' : 'Back (Select Template)'}
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setStep(3)}
          style={{ padding: '9px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          {isHindi ? 'आगे बढ़ें (तथ्य व विवरण)' : 'Next (Facts & Particulars)'} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
