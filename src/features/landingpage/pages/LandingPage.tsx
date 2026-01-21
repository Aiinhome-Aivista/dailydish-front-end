import React from 'react';
import NavBar from '../../../components/layout/NavBar';
import LandingFeatures from '../components/Features';
import LandingLeftovers from '../components/Leftovers';
import ReadyToCook from '../components/ReadyToCook';
import LandingFooter from '../components/Footer';
import FirstSection from '../components/FirstSection';

function LandingPage() {
  return (
    // Added 'animate-fade-in' to the main wrapper
    <div className="h-full w-full animate-[fadeIn_0.5s_ease-out]">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <NavBar />
      <main>
        <FirstSection/>
        <LandingFeatures />
        <LandingLeftovers />
        <ReadyToCook />
      </main>
      <LandingFooter />
    </div>
  );
}

export default LandingPage;