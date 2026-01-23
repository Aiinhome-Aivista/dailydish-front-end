import React from 'react';
import NavBar from '../../../components/layout/NavBar';
import LandingFeatures from '../components/Features';
import LandingLeftovers from '../components/Leftovers';
import ReadyToCook from '../components/ReadyToCook';
import LandingFooter from '../components/LandingFooter';
import FirstSection from '../components/FirstSection';

function LandingPage() {
  return (
    <div className="h-full w-full">
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
