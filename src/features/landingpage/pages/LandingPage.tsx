import React, { useState } from 'react';
import NavBar from '../../../components/layout/NavBar';
import LandingFeatures from '../components/Features';
import LandingLeftovers from '../components/Leftovers';
import ReadyToCook from '../components/ReadyToCook';
import LandingFooter from '../../../components/layout/Footer';
import FirstSection from '../components/FirstSection';
import LoginModal from '../../auth/pages/LoginModal';
import SignUpModal from '../../auth/pages/SignUpModal';
import Community from '../components/Community';

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

  React.useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.15,
      rootMargin: '0px 0px -80px 0px'
    });

    // Observe all elements with scroll-animate class
    const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale, .scroll-animate-fade');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="h-full w-full">
      <NavBar onLoginClick={openLoginModal} onSignUpClick={openSignUpModal} />
      <main>
        <FirstSection onGetStarted={openLoginModal} />
        <LandingFeatures />
        <LandingLeftovers />
        <ReadyToCook />
        <Community />
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
