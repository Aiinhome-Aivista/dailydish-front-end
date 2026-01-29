import React, { useState } from 'react';
import NavBar from '../../../components/layout/NavBar';
import LandingFeatures from '../components/Features';
import LandingLeftovers from '../components/Leftovers';
import ReadyToCook from '../components/ReadyToCook';
import LandingFooter from '../components/LandingFooter';
import FirstSection from '../components/FirstSection';
import LoginModal from '../../auth/components/LoginModal';
import SignUpModal from '../../auth/components/SignUpModal';

function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const openLoginModal = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  const openSignUpModal = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  const closeAllModals = () => {
    setShowLoginModal(false);
    setShowSignUpModal(false);
  };

  return (
    <div className="h-full w-full">
      <NavBar onLoginClick={openLoginModal} onSignUpClick={openSignUpModal} />
      <main>
        <FirstSection onGetStarted={openLoginModal} />
        <LandingFeatures />
        <LandingLeftovers />
        <ReadyToCook />
      </main>
      <LandingFooter />

      {/* Modals */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={closeAllModals}
        onSwitchToSignUp={openSignUpModal}
      />
      <SignUpModal 
        isOpen={showSignUpModal}
        onClose={closeAllModals}
        onSwitchToLogin={openLoginModal}
      />
    </div>
  );
}

export default LandingPage;