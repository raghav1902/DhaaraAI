import React, { useState } from 'react';
import {
  Shield,
  PhoneCall,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  UserCheck,
  Car,
  Lock,
  HeartHandshake,
  Search,
  ChevronRight,
  Sparkles,
  Phone,
  AlertTriangle,
  CreditCard,
  Home
} from 'lucide-react';

const HELPLINES = [
  {
    number: "112",
    title: "National Emergency Response (All-in-One)",
    title_hi: "राष्ट्रीय आपातकालीन सहायता (पुलिस, फायर, एम्बुलेंस)",
    desc: "24/7 central emergency number across India for immediate police dispatch.",
    desc_hi: "पुलिस, अग्निशमन और एम्बुलेंस हेतु पूरे भारत में 24/7 एकीकृत आपातकालीन नंबर।",
    badge: "Immediate SOS",
    color: "#dc2626"
  },
  {
    number: "1930",
    title: "Cyber Financial Fraud Helpline",
    title_hi: "साइबर वित्तीय धोखाधड़ी हेल्पलाइन (गोल्डन ऑवर)",
    desc: "Citizen Financial Cyber Fraud Reporting System (CFCFRMS) to freeze money in scam beneficiary accounts within golden hour.",
    desc_hi: "ऑनलाइन यूपीआई व बैंक फ्रॉड होते ही तुरंत कॉल करें ताकि ठग के खाते से पैसे तुरंत फ्रीज किए जा सकें।",
    badge: "Call Within 24 Hrs",
    color: "#2563eb"
  },
  {
    number: "181",
    title: "Women in Distress Helpline",
    title_hi: "महिला हेल्पलाइन (घरेलू हिंसा व संकट सहायता)",
    desc: "National 24/7 toll-free emergency response for women facing domestic violence, harassment, or abuse.",
    desc_hi: "घरेलू हिंसा, छेड़छाड़ अथवा किसी भी संकट में फंसी महिलाओं के लिए 24/7 निःशुल्क सहायता।",
    badge: "Confidential",
    color: "#db2777"
  },
  {
    number: "15100",
    title: "NALSA Free Legal Aid & Tele-Law",
    title_hi: "नालसा निःशुल्क कानूनी सलाह (Tele-Law)",
    desc: "National Legal Services Authority helpline providing free legal advice and government-appointed advocates.",
    desc_hi: "राष्ट्रीय विधिक सेवा प्राधिकरण द्वारा जरूरतमंद नागरिकों को मुफ्त कानूनी परामर्श और सरकारी वकील।",
    badge: "Free Legal Aid",
    color: "#059669"
  },
  {
    number: "1098",
    title: "Childline India (Child Protection)",
    title_hi: "चाइल्डलाइन (बाल सुरक्षा व सहायता)",
    desc: "Emergency helpline for children in need of care, protection, and rescue from exploitation.",
    desc_hi: "शोषण, बाल मजदूरी व संकटग्रस्त बच्चों की तत्काल सुरक्षा हेतु समर्पित हेल्पलाइन।",
    badge: "Child Rights",
    color: "#d97706"
  },
  {
    number: "1915",
    title: "National Consumer Helpline (NCH)",
    title_hi: "राष्ट्रीय उपभोक्ता हेल्पलाइन",
    desc: "Grievance redressal against defective products, fraudulent e-commerce, and service deficiencies.",
    desc_hi: "दोषपूर्ण सामान, ई-कॉमर्स फ्रॉड व सेवा में कमी के विरुद्ध शिकायत निवारण।",
    badge: "Consumer Rights",
    color: "#7c3aed"
  }
];

const RIGHTS_TOPICS = [
  {
    id: "police_arrest",
    icon: Shield,
    title: "Police Encounters & Arrest Rights",
    title_hi: "पुलिस पूछताछ, हिरासत व गिरफ्तारी के अधिकार",
    color: "#2563eb",
    rules: [
      {
        heading: "Section 35(3) BNSS Notice (Old 41A CrPC) — No Casual Arrest",
        heading_hi: "धारा 35(3) BNSS नोटिस — 7 वर्ष से कम सजा में सीधी गिरफ्तारी पर रोक",
        desc: "For any offense punishable with imprisonment up to 7 years (such as simple cheating, rash driving, property disputes), police CANNOT casually arrest without prior written notice of appearance and recorded written justification.",
        desc_hi: "7 वर्ष तक की सजा वाले मामलों में पुलिस बिना पूर्व नोटिस (धारा 35(3) BNSS) और बिना लिखित कानूनी कारण दर्ज किए मनमाने ढंग से गिरफ्तार नहीं कर सकती।"
      },
      {
        heading: "D.K. Basu Guidelines & Arrest Memo",
        heading_hi: "डी.के. बासु गाइडलाइंस व अरेस्ट मेमो का अधिकार",
        desc: "Police officer must carry clear visible name badges. An Arrest Memo must be prepared on the spot mentioning date, time, and signed by at least one respectable witness or family member.",
        desc_hi: "पुलिसकर्मी की वर्दी पर नाम का बैज होना अनिवार्य है। मौके पर अरेस्ट मेमो बनाया जाना चाहिए जिस पर समय व तारीख दर्ज हो और परिवार या स्वतंत्र गवाह के हस्ताक्षर हों।"
      },
      {
        heading: "Right to Inform Kin & Medical Examination",
        heading_hi: "परिजन को सूचना व स्वास्थ्य परीक्षण का अधिकार",
        desc: "Under Section 36 & 53 BNSS, the arrested person has the statutory right to have a friend, relative, or lawyer informed within 8 to 12 hours. Mandatory medical examination must be conducted every 48 hours.",
        desc_hi: "गिरफ्तारी के 8 से 12 घंटे के भीतर अपने किसी रिश्तेदार या वकील को सूचित कराने का अधिकार है। साथ ही हर 48 घंटे में डॉक्टर से स्वास्थ्य जांच अनिवार्य है।"
      },
      {
        heading: "Handcuffing Restrictions",
        heading_hi: "हथकड़ी लगाने पर सुप्रीम कोर्ट के कड़े नियम",
        desc: "Supreme Court (Prem Shankar Shukla case) ruled that routine handcuffing is a violation of Article 21. Handcuffs can only be used under exceptional recorded circumstances of extreme violence or confirmed escape risk.",
        desc_hi: "सामान्य मामलों में हथकड़ी लगाना संविधान के अनुच्छेद 21 का उल्लंघन है। केवल आदतन या अत्यधिक हिंसक अपराधियों के मामले में ही विशेष कारणों से हथकड़ी लगाई जा सकती है।"
      }
    ]
  },
  {
    id: "women_rights",
    icon: HeartHandshake,
    title: "Women's Special Legal Safeguards",
    title_hi: "महिलाओं के विशेष विधिक अधिकार व सुरक्षाएं",
    color: "#db2777",
    rules: [
      {
        heading: "Sunset to Sunrise Arrest Ban (Sec 43(5) BNSS)",
        heading_hi: "सूर्यास्त के बाद और सूर्योदय से पहले गिरफ्तारी पर रोक",
        desc: "Except under extraordinary circumstances with prior written permission of a Judicial Magistrate, no woman can be arrested after sunset and before sunrise.",
        desc_hi: "असाधारण परिस्थितियों व न्यायिक मजिस्ट्रेट की विशेष पूर्व अनुमति के बिना किसी भी महिला को शाम (सूर्यास्त) के बाद और सुबह (सूर्योदय) से पहले गिरफ्तार नहीं किया जा सकता।"
      },
      {
        heading: "Search & Interrogation by Female Officer Only",
        heading_hi: "तलाशी व पूछताछ केवल महिला पुलिस अधिकारी द्वारा",
        desc: "Under Section 49 BNSS, body search of any female can strictly be done only by another female officer with strict regard to decency.",
        desc_hi: "धारा 49 BNSS के तहत किसी भी महिला की शारीरिक तलाशी केवल और केवल महिला पुलिसकर्मी द्वारा ही ली जा सकती है।"
      },
      {
        heading: "Right to Zero FIR Anywhere in India",
        heading_hi: "देश के किसी भी थाने में 'जीरो FIR' का अधिकार",
        desc: "A woman can lodge a Zero FIR at ANY police station regardless of where the incident occurred. The police cannot refuse registration citing jurisdictional territorial limits.",
        desc_hi: "घटना कहीं भी घटी हो, महिला भारत के किसी भी नजदीकी थाने में 'जीरो एफआईआर' दर्ज करा सकती है। पुलिस क्षेत्राधिकार का बहाना बनाकर मना नहीं कर सकती।"
      },
      {
        heading: "Free Legal Aid & Legal Representation",
        heading_hi: "मुफ्त सरकारी वकील व कानूनी सहायता",
        desc: "Under Section 12 of Legal Services Authorities Act, 1987, all women, irrespective of their annual income or financial status, are automatically entitled to 100% free legal aid.",
        desc_hi: "कानूनी सेवा प्राधिकरण अधिनियम के तहत सभी महिलाएं (आय सीमा चाहे कुछ भी हो) अदालत में पूरी तरह से मुफ्त कानूनी सहायता व सरकारी वकील पाने की हकदार हैं।"
      }
    ]
  },
  {
    id: "traffic_rights",
    icon: Car,
    title: "Traffic Police & Motorist Rights",
    title_hi: "ट्रैफिक पुलिस व वाहन चालकों के कानूनी अधिकार",
    color: "#d97706",
    rules: [
      {
        heading: "DigiLocker & mParivahan Statutory Validity",
        heading_hi: "डिजिलॉकर व mParivahan की कानूनी मान्यता",
        desc: "Under Rule 139 of Central Motor Vehicles Rules and IT Act, digital driving license and RC on DigiLocker/mParivahan are legally equivalent to original physical cards. Police cannot compel physical documents.",
        desc_hi: "मोटर वाहन नियम व आईटी एक्ट के तहत डिजिलॉकर या mParivahan पर प्रदर्शित डिजिटल डीएल व आरसी पूरी तरह वैध हैं। पुलिस मूल कागजात की जिद नहीं कर सकती।"
      },
      {
        heading: "No Right to Snatch Vehicle Keys",
        heading_hi: "वाहन की चाबी छीनने या टायर की हवा निकालने का अधिकार नहीं",
        desc: "Traffic police officers have no statutory authority to snatch keys from the ignition or forcefully deflate tires. You have the right to remain inside the vehicle and present credentials.",
        desc_hi: "ट्रैफिक पुलिसकर्मी को वाहन की चाबी खींचने या गाड़ी के टायर की हवा निकालने का कोई कानूनी अधिकार नहीं है।"
      },
      {
        heading: "Officer Rank for Issuing Spot Challans",
        heading_hi: "चालान काटने वाले अधिकारी की रैंक",
        desc: "Only an officer of the rank of Assistant Sub-Inspector (ASI) or Sub-Inspector (SI) and above carries the authority to issue compounding spot challans. Constables cannot levy spot fines.",
        desc_hi: "मौके पर नकद या रसीदी चालान काटने का अधिकार कम से कम ASI या SI रैंक के अधिकारी को ही होता है। कांस्टेबल मौके पर जुर्माना नहीं वसूल सकते।"
      }
    ]
  },
  {
    id: "cyber_fraud",
    icon: Lock,
    title: "Cybercrime & Online Banking Golden Hour",
    title_hi: "साइबर फ्रॉड व बैंकिंग धोखाधड़ी (गोल्डन ऑवर)",
    color: "#059669",
    rules: [
      {
        heading: "Immediate Call to 1930 (Golden Hour Window)",
        heading_hi: "तत्काल 1930 पर कॉल (गोल्डन ऑवर में राशि फ्रीज)",
        desc: "If money is debited fraudulently via UPI or net banking, dial 1930 within the first 2-4 hours. The national portal directly instructs the recipient banks to freeze the siphoned funds before the scammer withdraws at an ATM.",
        desc_hi: "धोखाधड़ी होते ही तुरंत 1930 पर कॉल करें। यह सिस्टम ठग के खाते से पैसे निकाले जाने से पहले संबंधित बैंक को सीधे खाता फ्रीज करने का आदेश देता है।"
      },
      {
        heading: "RBI Limited Liability Circular (3-Day Zero Liability)",
        heading_hi: "आरबीआई सीमित दायित्व नियम (3 दिन में सूचना पर शून्य नुकसान)",
        desc: "Under RBI Circular DBR.No.Leg.BC.78/09.07.005/2017-18, if third-party security breach/fraud is notified to the bank within 3 working days, the customer bears zero liability.",
        desc_hi: "यदि बैंक सुरक्षा में चूक या तीसरे पक्ष के फ्रॉड की सूचना बैंक को 3 कार्यदिवसों के भीतर दे दी जाए, तो ग्राहक की देनदारी शून्य होती है।"
      }
    ]
  }
];

export default function CitizenRights({ language = 'English' }) {
  const isHindi = language === 'Hindi';
  const [selectedTopic, setSelectedTopic] = useState('police_arrest');
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStep, setActiveStep] = useState(null);
  const [expandedRule, setExpandedRule] = useState(null);

  const copyHelpline = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const currentTopic = RIGHTS_TOPICS.find(t => t.id === selectedTopic) || RIGHTS_TOPICS[0];

  const filteredRules = currentTopic.rules.filter(r => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.heading.toLowerCase().includes(q) ||
      r.heading_hi.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.desc_hi.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div className="" style={{ padding: '24px', borderRadius: '16px', borderLeft: '5px solid #2563eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ background: 'linear-gradient(135deg, #1e40af, #3b82f6)', padding: '12px', borderRadius: '14px', color: '#fff' }}>
            <Shield size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
              {isHindi ? 'नागरिक कानूनी अधिकार व आपातकालीन सुरक्षा गाइड (Kanooni Adhikar)' : 'Citizen Legal Rights & Emergency Protection Playbook'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
              {isHindi
                ? 'पुलिस पूछताछ, गिरफ्तारी, महिलाओं की सुरक्षा, ट्रैफिक चालान व साइबर धोखाधड़ी में आपके अनिवार्य संवैधानिक व विधिक अधिकार।'
                : 'Your statutory rights under BNSS 2023, Constitution of India, Supreme Court directives, and Motor Vehicles Act.'}
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Helpline Grid */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <PhoneCall size={20} color="#dc2626" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
            {isHindi ? 'राष्ट्रीय आपातकालीन हेल्पलाइन निर्देशिका (One-Tap Helplines)' : 'National Emergency Helplines (Direct Tap & Free Legal Aid)'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {HELPLINES.map((hl, idx) => (
            <div
              key={idx}
              className="hover-tactile"
              style={{
                border: '1px solid #e2e8f0',
                background: '#fff',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: hl.color, letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={20} color={hl.color} /> {hl.number}
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', background: `${hl.color}15`, color: hl.color }}>
                    {hl.badge}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: '600', color: 'var(--text-main)' }}>
                  {isHindi ? hl.title_hi : hl.title}
                </h4>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {isHindi ? hl.desc_hi : hl.desc}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                <a
                  href={`tel:${hl.number}`}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    color: 'var(--primary)',
                    textDecoration: 'none',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = 'var(--primary)'; }}
                >
                  {isHindi ? 'कॉल करें' : 'Dial Now'}
                </a>
                <button
                  type="button"
                  onClick={() => copyHelpline(hl.number)}
                  style={{
                    background: '#fff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--text-main)'
                  }}
                >
                  {copiedNumber === hl.number ? <Check size={14} color="#166534" /> : <Copy size={14} />}
                  {copiedNumber === hl.number ? (isHindi ? 'कॉपी' : 'Copied') : (isHindi ? 'नंबर लें' : 'Copy')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Situation Navigator */}
      <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Sparkles size={18} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text-main)' }}>
            {isHindi ? 'आपात स्थिति में त्वरित निर्णय मार्गदर्शिका (Instant Action Wizard)' : 'Instant Decision Wizard: What To Do If...'}
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {[
            {
              icon: AlertTriangle,
              label: isHindi ? "पुलिस ने हिरासत में लिया?" : "Detained by Police?",
              advice: isHindi
                ? "मांगें: धारा 35(3) BNSS का नोटिस। अरेस्ट मेमो पर तारीख व समय लिखवाएं। अपने वकील या परिजन को फोन करने का अधिकार मांगें।"
                : "Ask for Section 35(3) BNSS Notice. Insist on immediate Arrest Memo with date/time. Exercise right to phone call under Sec 36 BNSS."
            },
            {
              icon: CreditCard,
              label: isHindi ? "बैंक / UPI से अवैध निकासी?" : "Online Fraud / UPI Debit?",
              advice: isHindi
                ? "पहले 1930 पर कॉल कर शिकायत संख्या लें। बैंक ऐप से कार्ड/यूपीआई ब्लॉक करें और 3 दिन के भीतर बैंक को लिखित ईमेल भेजें।"
                : "Dial 1930 within 2 hours. Block UPI/card via banking app. Submit written dispute to bank within 3 days for zero liability."
            },
            {
              icon: UserCheck,
              label: isHindi ? "ट्रैफिक पुलिस ने रोका?" : "Stopped by Traffic Cop?",
              advice: isHindi
                ? "डिजीलॉकर से डीएल व आरसी दिखाएं। चाबी निकालने का पुलिस को अधिकार नहीं है। केवल ASI या उच्च अधिकारी को ही मौके पर जुर्माना लेने का अधिकार है।"
                : "Show DigiLocker/mParivahan. Cop cannot pull your keys. Only Sub-Inspector (SI) or above can compound spot fines."
            },
            {
              icon: Home,
              label: isHindi ? "मकान मालिक जबरन बेदखल करे?" : "Landlord Threatening Eviction?",
              advice: isHindi
                ? "मकान मालिक बिना अदालत के आदेश बिजली/पानी नहीं काट सकता। पुलिस में अवैध बेदखली व आपराधिक अतिचार (Sec 329 BNS) की शिकायत करें।"
                : "Landlord cannot cut electricity/water without court order. File complaint for illegal dispossession and criminal trespass (Sec 329 BNS)."
            }
          ].map((scenario, i) => {
            const Icon = scenario.icon;
            return (
              <div
                key={i}
                className="hover-tactile"
                onClick={() => setActiveStep(activeStep === i ? null : i)}
                style={{
                  border: activeStep === i ? '1px solid var(--primary)' : '1px solid #e2e8f0',
                  background: activeStep === i ? 'rgba(59, 130, 246, 0.06)' : '#fff',
                  borderRadius: '10px',
                  padding: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={16} color="var(--primary)" />
                    <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>
                      {scenario.label}
                    </span>
                  </div>
                  <ChevronRight size={16} color={activeStep === i ? 'var(--primary)' : 'var(--text-muted)'} />
                </div>
                {activeStep === i && (
                  <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#1e3a8a', lineHeight: '1.5', background: '#eff6ff', padding: '8px', borderRadius: '6px' }}>
                    {scenario.advice}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Rights Handbook Tabs */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
        {/* Topic Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
          {RIGHTS_TOPICS.map((topic) => {
            const Icon = topic.icon;
            const isSelected = selectedTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => setSelectedTopic(topic.id)}
                style={{
                  background: isSelected ? 'var(--primary)' : 'rgba(241, 245, 249, 0.8)',
                  color: isSelected ? '#fff' : 'var(--text-main)',
                  border: isSelected ? '1px solid var(--primary)' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '9px 16px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={16} />
                {isHindi ? topic.title_hi : topic.title}
              </button>
            );
          })}
        </div>

        {/* Search within Rights */}
        <div style={{ marginBottom: '20px', position: 'relative' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHindi ? "अधिकारों व नियमों में खोजें..." : "Search statutory rules and citizen rights..."}
            style={{
              width: '100%',
              padding: '9px 14px 9px 36px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13.5px',
              background: '#f8fafc',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Rules List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filteredRules.map((rule, idx) => {
            const isExpanded = expandedRule === idx;
            return (
              <div
                key={idx}
                onClick={() => setExpandedRule(isExpanded ? null : idx)}
                style={{
                  background: '#fff',
                  border: '1px solid #e2e8f0',
                  borderLeft: `3px solid ${currentTopic.color}`,
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isExpanded ? '0 2px 4px rgba(0,0,0,0.04)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'var(--text-main)' }}>
                    {isHindi ? rule.heading_hi : rule.heading}
                  </h4>
                  <ChevronRight
                    size={18}
                    color="var(--text-muted)"
                    style={{
                      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }}
                  />
                </div>
                {isExpanded && (
                  <p style={{ margin: '10px 0 0', fontSize: '12.5px', color: '#475569', lineHeight: '1.6', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    {isHindi ? rule.desc_hi : rule.desc}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Toast Notification */}
      {copiedNumber && (
        <div className="toast-container">
          <div className="toast-message">
            <Check size={18} color="#4ade80" />
            {isHindi ? 'हेल्पलाइन नंबर कॉपी किया गया!' : 'Helpline number copied to clipboard!'}
          </div>
        </div>
      )}
    </div>
  );
}
