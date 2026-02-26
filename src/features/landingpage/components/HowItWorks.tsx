import { useState } from 'react';
import NavBar from '../../../components/layout/NavBar'
import { useNavigate } from 'react-router-dom'
import Footer from '../../../components/layout/Footer';
import PageTransitionOverlay from '../../../animations/pages/PageTransitionOverlay';
import { motion } from 'framer-motion';
import { ChefHat, CalendarDays, Users } from 'lucide-react';
import LoginModal from '../../auth/pages/LoginModal';
import SignUpModal from '../../auth/pages/SignUpModal';

function HowItWorks() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
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
    <div className="min-h-screen bg-brand-beige relative overflow-hidden">
      <PageTransitionOverlay isTransitioning={isTransitioning} />

      <NavBar
        onLoginClick={openLoginModal}
        onSignUpClick={openSignUpModal}
      />

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={isLeaving ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col"
      >
        {/* Hero Section */}
        <div className="pt-20 pb-16 px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-4xl font-bold text-brand-dark mb-6">
              How It Works
            </h1>
            <p className="text-xl md:text-2xl text-brand-dark mb-12 leading-relaxed">
              Transform your everyday ingredients into extraordinary meals in just a few simple steps
            </p>
          </div>
        </div>

        {/* Steps Section */}
        <div className="pb-20 px-4">
          <div className="max-w-6xl mx-auto">

            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-center mb-20">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <div className="text-6xl mb-6 animate-bounce">🥕</div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                  1. Tell Us What You Have
                </h2>
                <p className="text-lg text-brand-dark leading-relaxed">
                  Input your available ingredients, dietary preferences, and cooking time.
                  Our AI analyzes your pantry to create personalized recipe suggestions.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1] rounded-3xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className="text-xl font-bold  mb-2">Smart Input</h3>
                    <p className="">Voice or text input for easy ingredient entry</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-center mb-20">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <div className="text-6xl mb-6 animate-bounce">👨‍🍳</div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                  2. Cook & Enjoy
                </h2>
                <p className="text-lg text-[#5e7054] leading-relaxed">
                  Follow step-by-step instructions with built-in timers and tips.
                  Save your favorites and build your personal recipe collection.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1] rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-center relative z-10">
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 blur-xl bg-orange-500/30 rounded-full" />
                        <ChefHat size={44} className="relative z-10" style={{ stroke: 'url(#chef-gradient)', strokeWidth: 2.5 }} />
                        <svg width="0" height="0" className="absolute">
                          <defs>
                            <linearGradient id="chef-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#fbbf24" />
                              <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Cooking Guide</h3>
                    <p className="">Interactive cooking assistant with real-time guidance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-20">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
                <div className="text-6xl mb-6 animate-pulse">❤️</div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                  3. Save Your Favorites
                </h2>
                <p className="text-lg text-[#5e7054] leading-relaxed">
                  Loved a recipe? Save it to your digital cookbook with a single click.
                  Build your personal collection of go-to meals for any occasion.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1] rounded-3xl p-8 shadow-2xl">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📚</div>
                    <h3 className="text-xl font-bold  mb-2">Digital Cookbook</h3>
                    <p className="">Your personal collection, organized and accessible</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row items-center mb-20">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
                <CalendarDays size={44} className="relative z-10 animate-bounce" style={{ stroke: 'url(#calendar-gradient)', strokeWidth: 2.5 }} />
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                  4. Plan Your Week
                </h2>
                <p className="text-lg text-[#5e7054] leading-relaxed">
                  Use our drag-and-drop meal planner to organize your week.
                  Generate shopping lists appropriately and stay effortless.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1] rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-center relative z-10">
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 blur-xl bg-emerald-500/30 rounded-full" />
                        <CalendarDays size={44} className="relative z-10" style={{ stroke: 'url(#calendar-gradient)', strokeWidth: 2.5 }} />
                        <svg width="0" height="0" className="absolute">
                          <defs>
                            <linearGradient id="calendar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#34d399" />
                              <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Meal Planner</h3>
                    <p className="">Effortless weekly planning and organization</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-20">
              <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
                <div className="text-6xl mb-6 animate-pulse">🌟</div>
                <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                  5. Share Your Journey
                </h2>
                <p className="text-lg text-[#5e7054] leading-relaxed">
                  Share your culinary creations with the DailyDish community.
                  Inspire others, exchange tips, and become a master home dr.Foodie.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1] rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="text-center relative z-10">
                    <div className="mb-4 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 blur-xl bg-indigo-500/30 rounded-full" />
                        <Users size={44} className="relative z-10" style={{ stroke: 'url(#users-gradient)', strokeWidth: 2.5 }} />
                        <svg width="0" height="0" className="absolute">
                          <defs>
                            <linearGradient id="users-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#818cf8" />
                              <stop offset="100%" stopColor="#4f46e5" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Community</h3>
                    <p className="">Connect, share, and grow with fellow foodies</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-3">🌱</div>
                <h3 className="font-bold text-brand-dark mb-2">Eco-Friendly</h3>
                <p className="text-sm text-[#5e7054]">Reduce food waste with smart ingredient usage</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-3">⚡</div>
                <h3 className="font-bold text-brand-dark mb-2">Lightning Fast</h3>
                <p className="text-sm text-[#5e7054]">Get recipes in seconds, not hours</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-bold text-brand-dark mb-2">Personalized</h3>
                <p className="text-sm text-[#5e7054]">Recipes tailored to your taste preferences</p>
              </div>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-3xl mb-3">📱</div>
                <h3 className="font-bold text-brand-dark mb-2">Mobile First</h3>
                <p className="text-sm text-[#5e7054]">Cook anywhere with our mobile app</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6">
                Ready to Start Cooking?
              </h2>
              <p className="text-lg text-[#5e7054] mb-8">
                Join thousands of home cooks creating amazing meals every day
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  className="bg-brand-dark text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#2a3a24] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                  onClick={openSignUpModal}
                >
                  Get Started Free
                </button>
                <button
                  className="border-2 border-brand-dark text-brand-dark px-8 py-4 rounded-full text-lg font-bold hover:bg-brand-dark hover:text-white transition-all duration-300 cursor-pointer"
                  onClick={() => navigate("/explore-recipes")}
                >
                  Explore Recipes
                </button>
              </div>
            </div>

          </div>
        </div>
        <Footer />
      </motion.div>

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
  )
}

export default HowItWorks
