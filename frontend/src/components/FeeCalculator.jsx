import React, { useState } from 'react';
import {
  Calculator, Building, Landmark, ShoppingCart, Car, Receipt, Scale
} from 'lucide-react';
import PropertyTab from './FeeCalculator/PropertyTab';
import CivilCourtTab from './FeeCalculator/CivilCourtTab';
import ConsumerCourtTab from './FeeCalculator/ConsumerCourtTab';
import TrafficChallanTab from './FeeCalculator/TrafficChallanTab';
import GstLateFeeTab from './FeeCalculator/GstLateFeeTab';
import AdvocateFeeTab from './FeeCalculator/AdvocateFeeTab';
import './FeeCalculator.css';

export default function FeeCalculator({ language = 'English', user, onNavigateTab, onOpenUpgradeModal }) {
  const isHindi = language === 'Hindi' || language === 'हिंदी';
  const isPro = user?.plan === 'plus' || user?.plan === 'pro' || user?.plan === 'enterprise';

  const [calcType, setCalcType] = useState('property');

  const TABS = [
    { id: 'property', icon: Building, labelEn: 'Property & Registry', labelHi: 'संपत्ति पंजीकरण', isPro: true },
    { id: 'court', icon: Landmark, labelEn: 'Civil Court Fee', labelHi: 'दीवानी कोर्ट फीस' },
    { id: 'consumer', icon: ShoppingCart, labelEn: 'Consumer Commission', labelHi: 'उपभोक्ता आयोग' },
    { id: 'traffic', icon: Car, labelEn: 'Traffic Challan', labelHi: 'ट्रैफिक चालान' },
    { id: 'gst', icon: Receipt, labelEn: 'GST Late Fee', labelHi: 'GST विलंब शुल्क', isPro: true },
    { id: 'advocate', icon: Scale, labelEn: 'Advocate Fee Studio', labelHi: 'वकील शुल्क' },
  ];

  return (
    <div className="fee-calculator animate-fade-in">
      <div className="fee-calculator__header">
        <div className="fee-calculator__header-left">
          <div className="fee-calculator__icon-badge">
            <Calculator size={22} />
          </div>
          <div>
            <div className="fee-calculator__title-row">
              <h2 className="fee-calculator__title">
                {isHindi ? 'न्यायालय शुल्क और स्टाम्प ड्यूटी स्टूडियो' : 'Legal Fee & Stamp Duty Studio'}
              </h2>
            </div>
            <p className="fee-calculator__subtitle">
              {isHindi
                ? '6 प्रमुख विधिक मॉड्यूल: संपत्ति स्टाम्प, दीवानी कोर्ट, उपभोक्ता, ट्रैफिक, GST एवं अधिवक्ता शुल्क'
                : '6 Dedicated Statutory Modules'}
            </p>
          </div>
        </div>

        <div className="module-banner-visual" aria-hidden="true">
          <img
            src="/assets/legal/fees/property_registry.webp"
            alt=""
            className="module-banner-image"
            loading="lazy"
          />
          <div className="module-banner-gradient" />
        </div>
      </div>

      <div className="fee-calculator__tabs-bar" role="tablist">
        {TABS.map(({ id, icon: Icon, labelEn, labelHi, isPro: tabIsPro }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={calcType === id}
            onClick={() => setCalcType(id)}
            className={`fee-calculator__tab-btn ${calcType === id ? 'is-active' : ''}`}
            style={{ position: 'relative' }}
          >
            <Icon size={16} />
            <span>{isHindi ? labelHi : labelEn}</span>
            {tabIsPro && !isPro && (
              <span
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '999px',
                  marginLeft: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '2px'
                }}
              >
                🔒 PRO
              </span>
            )}
          </button>
        ))}
      </div>

      {calcType === 'property' && (
        <PropertyTab
          isHindi={isHindi}
          isPro={isPro}
          onNavigateTab={onNavigateTab}
          onOpenUpgradeModal={onOpenUpgradeModal}
        />
      )}
      {calcType === 'court' && (
        <CivilCourtTab isHindi={isHindi} />
      )}
      {calcType === 'consumer' && (
        <ConsumerCourtTab isHindi={isHindi} />
      )}
      {calcType === 'traffic' && (
        <TrafficChallanTab isHindi={isHindi} />
      )}
      {calcType === 'gst' && (
        <GstLateFeeTab
          isHindi={isHindi}
          isPro={isPro}
          onNavigateTab={onNavigateTab}
          onOpenUpgradeModal={onOpenUpgradeModal}
        />
      )}
      {calcType === 'advocate' && (
        <AdvocateFeeTab isHindi={isHindi} />
      )}
    </div>
  );
}
