import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { TRAFFIC_VIOLATIONS } from '../../data/feeCalculatorData';
import StatutoryReceipt, { formatCurrency } from './StatutoryReceipt';

export default function TrafficChallanTab({ isHindi }) {
  const [selectedViolations, setSelectedViolations] = useState([]);
  const [repeatOffenceMap, setRepeatOffenceMap] = useState({});
  const [commercialVehicle, setCommercialVehicle] = useState(false);

  const handleViolationToggle = (id) => {
    setSelectedViolations(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleRepeatToggle = (id) => {
    setRepeatOffenceMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  let totalFine = 0;
  let courtMandatoryCount = 0;
  const itemized = [];

  selectedViolations.forEach(id => {
    const v = TRAFFIC_VIOLATIONS.find(x => x.id === id);
    if (!v) return;

    const isRepeat = !!repeatOffenceMap[id];
    let fine = isRepeat ? v.repeatOffence : v.firstOffence;

    if (commercialVehicle && (id === 'speed_heavy' || id === 'norc')) {
      fine = Math.round(fine * 1.25);
    }

    totalFine += fine;
    if (v.courtMandatory) courtMandatoryCount++;

    itemized.push({
      id: v.id,
      label: `${v.labelEn} (${v.section})${isRepeat ? ' [Repeat Offence]' : ''}`,
      fine,
      section: v.section,
      courtMandatory: v.courtMandatory,
      extra: v.extra
    });
  });

  const receiptText = `════ DHAARAAI TRAFFIC COMPOUNDING ASSESSMENT ════
Governing Act: MOTOR VEHICLES (AMENDMENT) ACT 2019
Vehicle Category: ${commercialVehicle ? 'COMMERCIAL / TRANSPORT VEHICLE' : 'PRIVATE / NON-COMMERCIAL'}
Total Infractions Recorded: ${selectedViolations.length}
Court Appearance Compulsory: ${courtMandatoryCount > 0 ? `YES (${courtMandatoryCount} Non-Compoundable Offences)` : 'NO (100% Compoundable at Traffic Virtual Court)'}
--------------------------------------------------
${itemized.map(item => `• ${item.label}: ${formatCurrency(item.fine)}`).join('\n')}
--------------------------------------------------
TOTAL COMPOUNDABLE STATUTORY PENALTY: ${formatCurrency(totalFine)}
*Virtual Court disposal available at vcourts.gov.in`;

  return (
    <div className="fee-calculator__panel animate-fade-in">
      <div className="fee-calculator__panel-form">
        <div className="fee-calc__header-group">
          <h3 className="fee-calculator__panel-title">
            {isHindi ? 'यातायात चालान व मोटर वाहन अधिनियम 2019' : 'Motor Vehicles Act 2019 Penalty Studio'}
          </h3>
          <p className="fee-calc__section-desc">
            {isHindi
              ? 'प्रथम बनाम द्वितीय अपराध जुर्माना, गैर-शमनीय अपराध एवं वर्चुअल कोर्ट चालान विश्लेषण'
              : 'First vs Repeat offence fine structures, non-compoundable court summons identification, and Virtual Court assessment.'}
          </p>
        </div>

        <div className="fee-calc__vehicle-toggle-row">
          <label className="fee-calc__checkbox-label">
            <input
              type="checkbox"
              checked={commercialVehicle}
              onChange={(e) => setCommercialVehicle(e.target.checked)}
            />
            <span>{isHindi ? 'व्यावसायिक / भारी वाहन (Commercial Transport Vehicle - Applicable Surcharges)' : 'Commercial / Transport Vehicle Classification'}</span>
          </label>
        </div>

        <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
          {isHindi ? 'उल्लंघन सूची (उल्लंघन और प्रथम/पुनः अपराध चुनें):' : 'Recorded Traffic Infractions (Select Violation & Offence Tier):'}
        </label>

        <div className="fee-calculator__violations-list">
          {TRAFFIC_VIOLATIONS.map((v) => {
            const isChecked = selectedViolations.includes(v.id);
            const isRepeat = !!repeatOffenceMap[v.id];
            const effectiveFine = isRepeat ? v.repeatOffence : v.firstOffence;

            return (
              <div key={v.id} className={`fee-calculator__violation-card ${isChecked ? 'is-selected' : ''}`}>
                <div className="fee-calculator__violation-main" onClick={() => handleViolationToggle(v.id)}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => { }}
                    className="fee-calculator__violation-checkbox"
                  />
                  <div className="fee-calculator__violation-details">
                    <div className="fee-calculator__violation-header">
                      <span className="fee-calculator__violation-name">{isHindi ? v.labelHi : v.labelEn}</span>
                      <span className="fee-calculator__violation-section">{v.section}</span>
                    </div>
                    {v.extra && <span className="fee-calculator__violation-extra">{v.extra}</span>}
                    {v.courtMandatory && (
                      <span className="fee-calculator__court-badge">
                        <AlertTriangle size={11} /> Court Mandatory (Non-Compoundable)
                      </span>
                    )}
                  </div>
                </div>

                <div className="fee-calculator__violation-right">
                  <div className="fee-calculator__violation-fine font-mono">
                    {formatCurrency(effectiveFine)}
                  </div>

                  {isChecked && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRepeatToggle(v.id);
                      }}
                      className={`fee-calc__repeat-btn ${isRepeat ? 'is-active' : ''}`}
                    >
                      {isRepeat ? (isHindi ? 'पुनः अपराध (2nd+)' : 'Repeat Offence') : (isHindi ? 'प्रथम अपराध (1st)' : '1st Offence')}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <StatutoryReceipt
        documentTitle={isHindi ? 'ट्रैफिक चालान एवं शमन मूल्यांकन' : 'TRAFFIC COMPOUNDING AUDIT'}
        scheduleCode="MOTOR VEHICLES (AMENDMENT) ACT 2019"
        subTitle={isHindi ? 'राज्य पुलिस व वर्चुअल कोर्ट चालान अनुसूची' : 'Ministry of Road Transport & Highways (MoRTH)'}
        jurisdictionLabel={isHindi ? 'वाहन वर्ग' : 'Vehicle Type'}
        jurisdictionVal={commercialVehicle ? 'Commercial Transport' : 'Private / Non-Transport'}
        valuationLabel={isHindi ? 'चिह्नित धाराएं' : 'Recorded Infractions'}
        valuationVal={`${selectedViolations.length} Violations`}
        lines={[
          { label: 'Aggregated Compounding Fine', value: formatCurrency(totalFine) },
          { label: 'Court Mandate Status', value: courtMandatoryCount > 0 ? `${courtMandatoryCount} Court Appearances Req.` : '100% Settleable Online', warn: courtMandatoryCount > 0 },
          { label: 'Payment Gateway (Virtual Court)', value: 'vcourts.gov.in / Parivahan' },
          { label: 'License Suspension Risk', value: selectedViolations.includes('helmet') || selectedViolations.includes('drunk') ? 'High Risk (Section 206)' : 'Standard Points', warn: selectedViolations.includes('helmet') || selectedViolations.includes('drunk') }
        ]}
        totalVal={totalFine}
        isCalculated={totalFine > 0}
        emptyPrompt={isHindi ? 'ऊपर दिए गए सूची में से उल्लंघन का चयन करें।' : 'Select traffic violations from the list to assess compounding penalties and virtual court requirements.'}
        receiptText={receiptText}
        statutoryNote={isHindi
          ? '* मोटर वाहन संशोधन अधिनियम 2019 के अनुसार। शराब पीकर गाड़ी चलाने या नाबालिग द्वारा ड्राइविंग जैसे मामलों में कोर्ट में पेशी अनिवार्य है।'
          : '* Offence compounding regulated under Sec 200 of MV Act. Offences marked "Court Mandatory" cannot be settled on the spot and require Virtual/Regular Court hearing.'}
        isHindi={isHindi}
      />
    </div>
  );
}
