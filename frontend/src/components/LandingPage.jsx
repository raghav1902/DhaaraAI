import React, { useState, useEffect } from 'react';
import LandingStyles from './landing/LandingStyles';
import LandingNavbar from './landing/LandingNavbar';
import HeroSection from './landing/HeroSection';
import LogoMarquee from './landing/LogoMarquee';
import VideoDemoSection from './landing/VideoDemoSection';
import HowItWorksSection from './landing/HowItWorksSection';
import InteractiveDemo from './landing/InteractiveDemo';
import FeaturesSection from './landing/FeaturesSection';
import ToolkitSection from './landing/ToolkitSection';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="dhaara-landing" style={{
      backgroundColor: '#f1f5f9',
      backgroundImage: `linear-gradient(rgba(203, 213, 225, 0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(203, 213, 225, 0.45) 1px, transparent 1px)`,
      backgroundSize: '48px 48px',
      color: '#0f172a',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      overflowX: 'hidden'
    }}>
      <LandingStyles />

      {/* 1. Navbar */}
      <LandingNavbar isScrolled={isScrolled} onExplore={onExplore} />

      {/* 2. Hero Section */}
      <HeroSection onExplore={onExplore} />

      {/* 3. 'Trusted By' Logo Marquee */}
      <LogoMarquee />

      {/* 4. Video Demo / App Walkthrough Placeholder */}
      <VideoDemoSection />

      {/* 5. 'How It Works' 3-Step Flow */}
      <HowItWorksSection />

      {/* 6. Interactive Mini-Playground */}
      <InteractiveDemo />

      {/* 7. Core Features Deep Dive */}
      <FeaturesSection />

      {/* 8. Specialized Legal Toolkit */}
      <ToolkitSection />

      {/* 9. Comparison: Traditional vs DhaaraAI */}
      <ComparisonSection />

      {/* 10. Security & Privacy Dedicated Banner */}
      <SecuritySection />

      {/* 11. Integrations Ecosystem */}
      <IntegrationsSection />

      {/* 12. 'Wall of Love' Testimonials */}
      <TestimonialsSection />

      {/* 13. Pricing Plans */}
      <PricingSection onExplore={onExplore} />

      {/* 14. Latest Legal Tech Insights */}
      <BlogSection onSelectArticle={(key) => setActiveModal(key)} />

      {/* 15. FAQ Section */}
      <FAQSection />

      {/* 16. Final High-Impact CTA Banner */}
      <CtaBanner onExplore={onExplore} />

      {/* 17. Multi-column Footer */}
      <LandingFooter onOpenModal={(modal) => setActiveModal(modal)} />

      {/* Universal Reader Modal */}
      <UniversalModal activeModal={activeModal} onClose={() => setActiveModal(null)} />
    </div>
  );
}
