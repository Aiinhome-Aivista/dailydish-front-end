import { useState } from 'react'
import NavBar from '../../../components/layout/NavBar'
import { useNavigate } from 'react-router-dom'
import Footer from '../../../components/layout/Footer';
import PageTransitionOverlay from '../../../animations/pages/PageTransitionOverlay';
import { motion } from 'framer-motion';
import LoginModal from '../../auth/pages/LoginModal';
import SignUpModal from '../../auth/pages/SignUpModal';
import AnimatedChef from '../../../assets/animated_chef-removebg-preview.png';
import { Utensils, Globe, Leaf, ChefHat, Sparkles } from 'lucide-react';

function ExploreRecipes() {
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

  const handleBack = () => {
    setIsLeaving(true);
    setIsTransitioning(true);
    setTimeout(() => {
      navigate('/', { state: { skipSplash: true } });
    }, 2500);
  };

  // Specific cuisines for the marquee/carousel
  const cuisines = [
    { name: 'Oriental', icon: <Utensils className="w-5 h-5 text-brand-light" /> },
    { name: 'Indian-Sub', icon: <Globe className="w-5 h-5 text-brand-light" /> },
    { name: 'Central Asian', icon: <Leaf className="w-5 h-5 text-brand-light" /> },
    { name: 'European', icon: <ChefHat className="w-5 h-5 text-brand-light" /> },
    { name: 'Inter-Continental', icon: <Sparkles className="w-5 h-5 text-brand-light" /> },
  ];

  const lifestyles = [
    { name: 'Vegan', desc: 'Plant-based deliciousness without compromise.', icon: '🌿' },
    { name: 'Keto', desc: 'Low carb, high energy meals for your goals.', icon: '🥑' },
    { name: 'Gluten-Free', desc: 'Flavor-first recipes for gluten sensitivity.', icon: '🌾' },
    { name: 'High Protein', desc: 'Fuel your muscles with protein-packed meals.', icon: '💪' },
  ];

  const collections = [
    { title: 'The Spice Route', desc: 'Explore fiery flavors from around the world.', color: 'bg-orange-500/10' },
    { title: '15-Min Wonders', desc: 'Gourmet results even when you are in a rush.', color: 'bg-blue-500/10' },
    { title: 'Pantry Stars', desc: 'Incredible meals from the simplest ingredients.', color: 'bg-yellow-500/10' },
  ];

  return (
    <div className="min-h-screen bg-brand-beige relative overflow-hidden">
      <PageTransitionOverlay isTransitioning={isTransitioning} />

      <NavBar
        showBackButton={true}
        onBackClick={handleBack}
        onLoginClick={openLoginModal}
        onSignUpClick={openSignUpModal}
      />

      <motion.div
        initial={false}
        animate={isLeaving ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col pt-20"
      >
        <div className="flex flex-col items-center">
          {/* --- Hero Section --- */}
          <section className="relative pt-12 pb-20 px-4 w-full text-center">
            <div className="max-w-5xl mx-auto z-10 relative">
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="mb-8 relative inline-block"
              >
                <div className="w-32 h-32 md:w-40 md:h-40  flex items-center justify-center p-4  mx-auto">
                  <img
                    src={AnimatedChef}
                    alt="Dr. Foodie"
                    className="w-full h-full object-contain  transform scale-125 translate-y-2"
                  />
                </div>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-brand-dark mb-6 tracking-tight leading-tight">
                Mind Blowing <span className="text-brand-accent">Recipes</span> Await
              </h1>
              <p className="text-xl md:text-2xl text-brand-dark/80 mb-12 max-w-4xl mx-auto font-medium">
                DailyDish uses advanced AI to transform your unique combination of ingredients into chef-quality culinary experiences.
              </p>
              <button
                className="bg-brand-dark text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-brand-accent transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 cursor-pointer flex items-center gap-3 mx-auto"
                onClick={openLoginModal}
              >
                Start Exploring <span className="text-2xl">→</span>
              </button>
            </div>
          </section>

          {/* --- Main Categories Grid --- */}
          <section className="py-12 px-6 w-full max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {[
                { title: 'Spicy Delights', icon: '🌶️', desc: 'Ignite your taste buds' },
                { title: 'Healthy Options', icon: '🥗', desc: 'Nutritious & flavorful' },
                { title: 'Quick & Easy', icon: '⏱️', desc: 'Meals in under 30 mins' },
              ].map((cat, i) => (
                <div key={i} className="bg-[#435334B2] backdrop-blur-2xl text-white rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-white/10 group text-left">
                  <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">{cat.icon}</div>
                  <h3 className="text-2xl font-bold mb-2">{cat.title}</h3>
                  <p className="text-white/70 text-sm font-medium">{cat.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* --- Cuisine Carousel (Marquee) --- */}
          <section className="py-16 bg-[#435334] w-full overflow-hidden border-y border-white/10 mt-12">
            <div className="max-w-6xl mx-auto px-6 mb-12 text-center text-white">
              <h2 className="text-3xl font-black mb-2 uppercase tracking-wide">Master Your Cuisines</h2>
              <p className="text-brand-light/60 font-medium italic">Specific culinary paths curated for you</p>
            </div>

            <div className="flex gap-6 animate-marquee whitespace-nowrap px-4 hover:pause">
              <div className="flex gap-12 items-center min-w-full">
                {[...cuisines, ...cuisines, ...cuisines].map((c, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-10 py-6 rounded-3xl border border-white/20 hover:bg-white/20 hover:border-brand-accent transition-all cursor-pointer group">
                    <div className="bg-brand-accent p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                      {c.icon}
                    </div>
                    <span className="text-2xl font-black text-white tracking-tight">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <style>{`
              @keyframes marquee {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-33.33%); }
              }
              .animate-marquee {
                  animation: marquee 40s linear infinite;
              }
              .pause:hover {
                  animation-play-state: paused;
              }
            `}</style>
          </section>

          {/* --- Featured Collections --- */}
          <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 px-4 gap-6">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-4">Curated Collections</h2>
                <p className="text-lg text-brand-dark/70 font-medium tracking-tight">Hand-picked categories to inspire your next kitchen masterpiece.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {collections.map((col, i) => (
                <div key={i} className={`group ${col.color} p-10 rounded-[3rem] border border-brand-dark/5 hover:border-brand-accent/30 transition-all duration-500 cursor-pointer overflow-hidden relative shadow-sm`}>
                  <div className="absolute top-0 right-0 p-8 transform group-hover:rotate-12 group-hover:scale-110 transition-transform duration-500 opacity-20 md:opacity-100">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl">✨</div>
                  </div>
                  <h3 className="text-2xl font-black text-brand-dark mb-4 relative z-10">{col.title}</h3>
                  <p className="text-brand-dark/70 font-medium leading-relaxed mb-8 max-w-[85%] relative z-10">{col.desc}</p>
                  <div className="flex items-center gap-2 text-brand-accent font-black text-sm tracking-widest uppercase group-hover:gap-4 transition-all">
                    View Collection <span className="text-lg">→</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* --- Lifestyle Choices --- */}
          <section className="py-24 bg-[#2a3a24] text-white w-full overflow-hidden relative mt-12">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
              <div className="text-center mb-20">
                <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Built for Your Life</h2>
                <p className="text-brand-light/70 text-xl font-medium max-w-2xl mx-auto">Your dietary goals are our priority. We tailor every single suggestion to match your lifestyle perfectly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {lifestyles.map((style, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 hover:border-brand-accent/50 transition-all group cursor-pointer text-center md:text-left">
                    <div className="text-6xl mb-8 group-hover:scale-110 transition-transform inline-block filter drop-shadow-xl">{style.icon}</div>
                    <h3 className="text-2xl font-black mb-4 tracking-tight">{style.name}</h3>
                    <p className="text-white/50 text-base leading-relaxed font-medium">{style.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '60px 60px' }}></div>
          </section>

          {/* --- Stats and CTA --- */}
          <section className="py-32 px-6 w-full max-w-7xl">
            <div className="max-w-4xl mx-auto bg-brand-light rounded-[4rem] p-12 md:p-20 shadow-2xl relative border border-brand-accent/10 overflow-hidden">
              <div className="text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-brand-dark mb-10 tracking-tight">Ready to revolutionize your kitchen?</h2>

                <div className="flex justify-center gap-10 md:gap-16 mb-16 flex-wrap">
                  <div className="text-center">
                    <div className="text-5xl font-black text-brand-accent tracking-tighter">50K+</div>
                    <div className="text-xs font-black text-brand-dark/40 uppercase tracking-[0.2em] mt-3">Recipes Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-brand-accent tracking-tighter">98%</div>
                    <div className="text-xs font-black text-brand-dark/40 uppercase tracking-[0.2em] mt-3">Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-5xl font-black text-brand-accent tracking-tighter">Zero</div>
                    <div className="text-xs font-black text-brand-dark/40 uppercase tracking-[0.2em] mt-3">Food Waste</div>
                  </div>
                </div>

                <p className="text-xl text-brand-dark/70 mb-12 max-w-xl mx-auto font-medium leading-relaxed">
                  Join our community of 50k+ food lovers and start your culinary adventure with DailyDish today.
                </p>

                <button
                  className="bg-brand-accent text-white px-14 py-6 rounded-full text-2xl font-black hover:scale-105 transition-all shadow-xl shadow-brand-accent/30 cursor-pointer active:scale-95"
                  onClick={openSignUpModal}
                >
                  Join DailyDish Free
                </button>

             
              </div>

              {/* Decorative blobs */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-accent/10 rounded-full blur-[80px]"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand-dark/5 rounded-full blur-[80px]"></div>
            </div>
          </section>
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

export default ExploreRecipes
