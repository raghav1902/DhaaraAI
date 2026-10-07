import React, { useState, useEffect } from 'react';
import LandingStyles from './landing/LandingStyles';
import LandingNavbar from './landing/LandingNavbar';
import HeroSection from './landing/HeroSection';
import LogoMarquee from './landing/LogoMarquee';
import HowItWorksSection from './landing/HowItWorksSection';
import InteractiveDemo from './landing/InteractiveDemo';
import ToolkitSection from './landing/ToolkitSection';
import FeaturesSection from './landing/FeaturesSection';
import ComparisonSection from './landing/ComparisonSection';
import SecuritySection from './landing/SecuritySection';
import IntegrationsSection from './landing/IntegrationsSection';
import TestimonialsSection from './landing/TestimonialsSection';
import PricingSection from './landing/PricingSection';
import BlogSection from './landing/BlogSection';
import FAQSection from './landing/FAQSection';
import CtaBanner from './landing/CtaBanner';
import LandingFooter from './landing/LandingFooter';
import UniversalModal from './landing/UniversalModal';

export default function LandingPage({ onExplore }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    document.body.classList.remove('dark-theme');
    document.documentElement.classList.remove('dark-theme');
    const handleScroll = () => setIsScrolled(window.scrollY > 25);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="dhaara-landing" style={{
      backgroundColor: '#faf8f5',
      backgroundImage: `radial-gradient(#e7e3da 0.75px, transparent 0.75px), radial-gradient(#e7e3da 0.75px, #faf8f5 0.75px)`,
      backgroundSize: '36px 36px',
      backgroundPosition: '0 0, 18px 18px',
      color: '#0b1329',
      minHeight: '100vh',
      overflowX: 'hidden'
    }}>
      <LandingStyles />

      {/* 1. Sticky Frosted Navbar */}
      <LandingNavbar isScrolled={isScrolled} onExplore={onExplore} />

      {/* 2. Hero Section with Authentic Indian Legal Imagery + Laptop Studio */}
      <HeroSection onExplore={onExplore} />

      {/* 3. Trust & Statistics Strip + Marquee */}
      <LogoMarquee />

      {/* 4. How DhaaraAI Works (3 Steps + Supreme Court Sketch) */}
      <HowItWorksSection />

      {/* 5. Interactive Demo (See DhaaraAI in Action + Try It Yourself) */}
      <InteractiveDemo />

      {/* 6. Core Capabilities & Specialized Legal Toolkit */}
      <ToolkitSection />

      {/* 7. Deep-Dive Capabilities (Research, Precedents, Contract Review) */}
      <FeaturesSection />

      {/* 8. Traditional Legal Research vs. DhaaraAI */}
      <ComparisonSection />

      {/* 9. Security & Privacy Dedicated Section */}
      <SecuritySection />

      {/* 10. Workflow Integrations Ecosystem */}
      <IntegrationsSection />

      {/* 11. Advocates & In-House Counsel Testimonials */}
      <TestimonialsSection />

      {/* 12. Transparent Pricing Plans */}
      <PricingSection onExplore={onExplore} />

      {/* 13. Latest Legal Tech Insights */}
      <BlogSection onSelectArticle={(key) => setActiveModal(key)} />

      {/* 14. Frequently Asked Questions */}
      <FAQSection />

      {/* 15. Final High-Impact CTA Banner */}
      <CtaBanner onExplore={onExplore} />

      {/* 16. Multi-Column Footer */}
      <LandingFooter onOpenModal={(modal) => setActiveModal(modal)} />

      {/* Universal Modal */}
      <UniversalModal activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
