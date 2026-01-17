import React from 'react';
import NavBar from '../../../components/layout/NavBar';
import LandingHero from '../components/LandingHero';
import LandingFeatures from '../components/Features';
import LandingLeftovers from '../components/Leftovers';
import LandingCTA from '../components/CTA';
import LandingFooter from '../components/Footer';

function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-beige selection:bg-brand-accent selection:text-white">
      <NavBar />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingLeftovers />
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;
