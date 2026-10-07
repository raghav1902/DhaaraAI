// Advanced Statutory & Judicial Fee Matrices for Indian Legal Framework

export const STAMP_DUTY_RATES = {
  'Andhra Pradesh': { male: 5, female: 5, joint: 5, registry: 1, surcharge: 1.5, metroCess: 0.5, ceilingReg: null },
  'Arunachal Pradesh': { male: 6, female: 6, joint: 6, registry: 1, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Assam': { male: 6, female: 5, joint: 5.5, registry: 2, surcharge: 0.5, metroCess: 0, ceilingReg: null },
  'Bihar': { male: 6, female: 5.6, joint: 5.8, registry: 2, surcharge: 0.8, metroCess: 0, ceilingReg: null },
  'Chandigarh': { male: 5, female: 5, joint: 5, registry: 1, surcharge: 0, metroCess: 1.0, ceilingReg: null },
  'Chhattisgarh': { male: 5, female: 4, joint: 4.5, registry: 4, surcharge: 1.0, metroCess: 0, ceilingReg: null },
  'Delhi': { male: 6, female: 4, joint: 5, registry: 1, surcharge: 0, metroCess: 1.0, ceilingReg: null },
  'Goa': { male: 5, female: 5, joint: 5, registry: 3, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Gujarat': { male: 4.9, female: 4.9, joint: 4.9, registry: 1, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Haryana': { male: 7, female: 5, joint: 6, registry: 1.5, surcharge: 1.0, metroCess: 1.0, ceilingReg: 50000 },
  'Himachal Pradesh': { male: 6, female: 4, joint: 5, registry: 2, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Jammu & Kashmir': { male: 7, female: 5, joint: 6, registry: 1.2, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Jharkhand': { male: 4, female: 4, joint: 4, registry: 3, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Karnataka': { male: 5, female: 5, joint: 5, registry: 1, surcharge: 2.0, metroCess: 1.0, ceilingReg: null }, // 2% cess + 1% metro cess in urban
  'Kerala': { male: 8, female: 8, joint: 8, registry: 2, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Madhya Pradesh': { male: 7.5, female: 7.5, joint: 7.5, registry: 3, surcharge: 2.0, metroCess: 1.0, ceilingReg: null },
  'Maharashtra': { male: 6, female: 5, joint: 5.5, registry: 1, surcharge: 1.0, metroCess: 1.0, ceilingReg: 30000 }, // Maharashtra reg capped at 30k, 1% LBT/Metro cess
  'Manipur': { male: 7, female: 7, joint: 7, registry: 1, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Meghalaya': { male: 9.9, female: 9.9, joint: 9.9, registry: 1, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Mizoram': { male: 9, female: 9, joint: 9, registry: 1, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Nagaland': { male: 7.5, female: 7.5, joint: 7.5, registry: 1.5, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Odisha': { male: 5, female: 4, joint: 4.5, registry: 2, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Punjab': { male: 7, female: 5, joint: 6, registry: 1, surcharge: 1.0, metroCess: 1.0, ceilingReg: null },
  'Rajasthan': { male: 6, female: 5, joint: 5.5, registry: 1, surcharge: 1.2, metroCess: 0.5, ceilingReg: null },
  'Sikkim': { male: 5, female: 5, joint: 5, registry: 1, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Tamil Nadu': { male: 7, female: 7, joint: 7, registry: 4, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Telangana': { male: 5.5, female: 5.5, joint: 5.5, registry: 0.5, surcharge: 1.5, metroCess: 0, ceilingReg: null },
  'Tripura': { male: 5, female: 5, joint: 5, registry: 1, surcharge: 0, metroCess: 0, ceilingReg: null },
  'Uttar Pradesh': { male: 7, female: 6, joint: 6.5, registry: 1, surcharge: 1.0, metroCess: 0, ceilingReg: 20000 }, // UP 1% reg capped at 20,000
  'Uttarakhand': { male: 5, female: 3.75, joint: 4.37, registry: 2, surcharge: 0, metroCess: 0, ceilingReg: 25000 },
  'West Bengal': { male: 6, female: 6, joint: 6, registry: 1, surcharge: 1.0, metroCess: 0, ceilingReg: null }
};

// Civil Suit Categories under Court Fees Act 1870 / State Amendments
export const CIVIL_SUIT_TYPES = [
  {
    id: 'money_recovery',
    labelEn: 'Money Recovery / Commercial Claim (Ad-Valorem)',
    labelHi: 'धन वसूली / वाणिज्यिक दावा (एड-वैलोरेम)',
    type: 'ad_valorem',
    desc: 'Section 7(i) - Based strictly on suit valuation'
  },
  {
    id: 'possession_land',
    labelEn: 'Possession of Land / Immovable Property',
    labelHi: 'भूमि / अचल संपत्ति का कब्जा',
    type: 'ad_valorem',
    desc: 'Section 7(v) - Market valuation or land revenue multiple'
  },
  {
    id: 'permanent_injunction',
    labelEn: 'Permanent / Mandatory Injunction',
    labelHi: 'स्थाई / आज्ञापक व्यादेश (Injunction)',
    type: 'fixed_with_claim',
    fixedFee: 250,
    desc: 'Schedule II Article 17 - Fixed fee + nominal relief charge'
  },
  {
    id: 'declaration_injunction',
    labelEn: 'Declaration of Title with Consequential Relief',
    labelHi: 'हक घोषणा एवं परिणामी अनुतोष',
    type: 'hybrid',
    desc: 'Section 7(iv)(c) - Ad-valorem on plaintiff valuation subject to minimum'
  },
  {
    id: 'partition',
    labelEn: 'Partition Suit (Joint Family / Co-owners)',
    labelHi: 'बंटवारा वाद (संयुक्त परिवार संपत्ति)',
    type: 'fixed_partition',
    fixedInJoint: 500,
    desc: 'Schedule II Art 17(vi) - Fixed fee if in constructive possession'
  },
  {
    id: 'specific_performance',
    labelEn: 'Specific Performance of Contract',
    labelHi: 'संविदा का विनिर्दिष्ट पालन (Agreement to Sell)',
    type: 'ad_valorem',
    desc: 'Section 7(x) - Calculated on agreed sale consideration'
  },
  {
    id: 'matrimonial_divorce',
    labelEn: 'Matrimonial Petition / Divorce / Restitution',
    labelHi: 'वैवाहिक याचिका / तलाक / दाम्पत्य अधिकार',
    type: 'fixed',
    fixedFee: 100,
    desc: 'Hindu Marriage Act / Special Marriage Act fixed stamp'
  },
  {
    id: 'probate_will',
    labelEn: 'Probate / Letters of Administration / Succession',
    labelHi: 'प्रोबेट / वसीयत / उत्तराधिकार प्रमाण पत्र',
    type: 'probate_slab',
    desc: 'Indian Succession Act Schedule I Art 11 (2% to 4%)'
  }
];

export const TRAFFIC_VIOLATIONS = [
  { id: 'drunk', labelEn: 'Drunk Driving', labelHi: 'शराब पीकर गाड़ी चलाना', firstOffence: 10000, repeatOffence: 15000, section: 'Sec 185', courtMandatory: true },
  { id: 'license', labelEn: 'Driving Without Valid License', labelHi: 'बिना वैध लाइसेंस के', firstOffence: 5000, repeatOffence: 10000, section: 'Sec 181', courtMandatory: false },
  { id: 'insurance', labelEn: 'Driving Without Third-Party Insurance', labelHi: 'बिना थर्ड-पार्टी बीमा के', firstOffence: 2000, repeatOffence: 4000, section: 'Sec 196', courtMandatory: false },
  { id: 'speed_lmv', labelEn: 'Over-speeding (Light Motor Vehicle)', labelHi: 'तेज गति (LMV)', firstOffence: 2000, repeatOffence: 4000, section: 'Sec 183(1)', courtMandatory: false },
  { id: 'speed_heavy', labelEn: 'Over-speeding (Medium/Heavy Commercial Vehicle)', labelHi: 'तेज गति (भारी व्यावसायिक वाहन)', firstOffence: 4000, repeatOffence: 8000, section: 'Sec 183(2)', courtMandatory: false },
  { id: 'helmet', labelEn: 'Riding Two-Wheeler Without Helmet', labelHi: 'बिना हेलमेट दोपहिया', firstOffence: 1000, repeatOffence: 1000, section: 'Sec 194D', courtMandatory: false, extra: 'License suspension 3 months' },
  { id: 'seatbelt', labelEn: 'Not Wearing Seat Belt', labelHi: 'सीट बेल्ट न लगाना', firstOffence: 1000, repeatOffence: 1000, section: 'Sec 194B', courtMandatory: false },
  { id: 'mobile', labelEn: 'Using Mobile Phone While Driving', labelHi: 'गाड़ी चलाते समय मोबाइल उपयोग', firstOffence: 5000, repeatOffence: 10000, section: 'Sec 184(c)', courtMandatory: false },
  { id: 'tripleriding', labelEn: 'Triple Riding (Two-Wheeler)', labelHi: 'दोपहिया पर तीन सवारी', firstOffence: 1000, repeatOffence: 1000, section: 'Sec 194C', courtMandatory: false },
  { id: 'redlight', labelEn: 'Jumping Red Light / Dangerous Driving', labelHi: 'लाल बत्ती उल्लंघन', firstOffence: 5000, repeatOffence: 10000, section: 'Sec 184', courtMandatory: false },
  { id: 'emergency', labelEn: 'Obstructing Emergency Vehicles (Ambulance/Fire)', labelHi: 'एम्बुलेंस/फायर ब्रिगेड को रास्ता न देना', firstOffence: 10000, repeatOffence: 10000, section: 'Sec 194E', courtMandatory: true },
  { id: 'juvenile', labelEn: 'Offences by Juveniles (Guardian Penalty)', labelHi: 'नाबालिग द्वारा ड्राइविंग (अभिभावक जुर्माना)', firstOffence: 25000, repeatOffence: 25000, section: 'Sec 199A', courtMandatory: true, extra: 'Vehicle RC cancelled 1 yr' },
  { id: 'norc', labelEn: 'Vehicle Without Valid Registration (RC)', labelHi: 'बिना वैध आरसी के वाहन', firstOffence: 5000, repeatOffence: 10000, section: 'Sec 192', courtMandatory: false },
  { id: 'emission', labelEn: 'PUC / Pollution Norms Violation', labelHi: 'प्रदूषण प्रमाण पत्र (PUC) उल्लंघन', firstOffence: 10000, repeatOffence: 10000, section: 'Sec 190(2)', courtMandatory: false },
  { id: 'stunt', labelEn: 'Racing / Stunt Driving on Public Road', labelHi: 'सार्वजनिक सड़क पर स्टंट/रेसिंग', firstOffence: 5000, repeatOffence: 10000, section: 'Sec 189', courtMandatory: true }
];

export const GST_RETURNS = [
  {
    id: 'gstr1', code: 'GSTR-1', name: 'Outward Supplies Statement',
    nilDaily: 20, regDaily: 50, maxTurnoverUnder5Cr: 2000, maxTurnoverAbove5Cr: 10000,
    descEn: 'Details of outward supplies (sales)', descHi: 'बाह्य आपूर्ति (बिक्री) विवरण'
  },
  {
    id: 'gstr3b', code: 'GSTR-3B', name: 'Monthly Summary Return & Tax Pay',
    nilDaily: 20, regDaily: 50, maxTurnoverUnder5Cr: 2000, maxTurnoverAbove5Cr: 10000,
    descEn: 'Monthly summary & tax settlement return', descHi: 'मासिक सारांश एवं कर भुगतान रिटर्न'
  },
  {
    id: 'gstr4', code: 'GSTR-4', name: 'Composition Scheme Annual Return',
    nilDaily: 20, regDaily: 50, maxTurnoverUnder5Cr: 2000, maxTurnoverAbove5Cr: 2000,
    descEn: 'Annual return for composition dealers', descHi: 'कंपोजिशन डीलरों हेतु वार्षिक रिटर्न'
  },
  {
    id: 'gstr9', code: 'GSTR-9', name: 'Annual Consolidated Return',
    nilDaily: 50, regDaily: 200, maxTurnoverUnder5Cr: 10000, maxTurnoverAbove5Cr: 20000,
    descEn: 'Annual return for regular taxpayers', descHi: 'नियमित करदाताओं हेतु वार्षिक रिटर्न'
  },
  {
    id: 'gstr9c', code: 'GSTR-9C', name: 'Reconciliation Statement & Audit',
    nilDaily: 50, regDaily: 200, maxTurnoverUnder5Cr: 10000, maxTurnoverAbove5Cr: 20000,
    descEn: 'Annual self-certified reconciliation (Turnover > 5Cr)', descHi: 'वार्षिक समाधान विवरणी'
  }
];

export const ADVOCATE_FEE_SCALES = [
  {
    id: 'civil', labelEn: 'Civil Suit / Title / Property Dispute', labelHi: 'दीवानी मुकदमा / संपत्ति विवाद',
    juniorMin: 15000, juniorMax: 50000, seniorMin: 50000, seniorMax: 300000,
    hcJuniorMin: 40000, hcJuniorMax: 150000, hcSeniorMin: 150000, hcSeniorMax: 1200000,
    scJuniorMin: 100000, scJuniorMax: 400000, scSeniorMin: 400000, scSeniorMax: 5000000,
    typicalHearings: 8, draftingFee: 10000, noticeFee: 3500
  },
  {
    id: 'criminal', labelEn: 'Criminal Defence / Bail / Trial', labelHi: 'आपराधिक बचाव / जमानत / विचारण',
    juniorMin: 20000, juniorMax: 80000, seniorMin: 80000, seniorMax: 500000,
    hcJuniorMin: 50000, hcJuniorMax: 200000, hcSeniorMin: 200000, hcSeniorMax: 1500000,
    scJuniorMin: 150000, scJuniorMax: 600000, scSeniorMin: 600000, scSeniorMax: 7000000,
    typicalHearings: 6, draftingFee: 15000, noticeFee: 5000
  },
  {
    id: 'consumer', labelEn: 'Consumer Dispute (DCDRC / SCDRC / NCDRC)', labelHi: 'उपभोक्ता फोरम विवाद',
    juniorMin: 8000, juniorMax: 25000, seniorMin: 25000, seniorMax: 120000,
    hcJuniorMin: 30000, hcJuniorMax: 100000, hcSeniorMin: 100000, hcSeniorMax: 600000,
    scJuniorMin: 80000, scJuniorMax: 300000, scSeniorMin: 300000, scSeniorMax: 2500000,
    typicalHearings: 4, draftingFee: 7500, noticeFee: 3000
  },
  {
    id: 'divorce', labelEn: 'Matrimonial / Mutual Divorce / Contested', labelHi: 'वैवाहिक / आपसी सहमति या विवादित तलाक',
    juniorMin: 20000, juniorMax: 65000, seniorMin: 65000, seniorMax: 350000,
    hcJuniorMin: 45000, hcJuniorMax: 180000, hcSeniorMin: 180000, hcSeniorMax: 1000000,
    scJuniorMin: 120000, scJuniorMax: 500000, scSeniorMin: 500000, scSeniorMax: 4000000,
    typicalHearings: 5, draftingFee: 12000, noticeFee: 4000
  },
  {
    id: 'cheque', labelEn: 'Cheque Bounce (NI Act Sec 138)', labelHi: 'चेक बाउंस (NI एक्ट धारा 138)',
    juniorMin: 10000, juniorMax: 35000, seniorMin: 35000, seniorMax: 150000,
    hcJuniorMin: 35000, hcJuniorMax: 120000, hcSeniorMin: 120000, hcSeniorMax: 600000,
    scJuniorMin: 100000, scJuniorMax: 350000, scSeniorMin: 350000, scSeniorMax: 2500000,
    typicalHearings: 5, draftingFee: 8000, noticeFee: 3500
  },
  {
    id: 'labour', labelEn: 'Employment / Industrial Tribunal / Labour', labelHi: 'श्रम / औद्योगिक न्यायाधिकरण',
    juniorMin: 12000, juniorMax: 45000, seniorMin: 45000, seniorMax: 180000,
    hcJuniorMin: 35000, hcJuniorMax: 150000, hcSeniorMin: 150000, hcSeniorMax: 800000,
    scJuniorMin: 100000, scJuniorMax: 400000, scSeniorMin: 400000, scSeniorMax: 3000000,
    typicalHearings: 6, draftingFee: 9000, noticeFee: 3000
  }
];
