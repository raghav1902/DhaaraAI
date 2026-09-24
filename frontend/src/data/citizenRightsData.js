import { Shield, HeartHandshake, Car, Lock } from 'lucide-react';

export const HELPLINES = [
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

export const RIGHTS_TOPICS = [
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
