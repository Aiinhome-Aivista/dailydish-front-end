import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/layout/NavBar';
import LandingFooter from '../components/LandingFooter';

const AiPersonalization = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full relative">
      <NavBar />
      <button
        onClick={() => navigate('/landing')}
        className="absolute top-18 right-12 bg-brand-primary text-brand-dark px-4 py-2 rounded-lg font-semibold hover:bg-[#CEDEBD] transition-colors cursor-pointer flex items-center gap-2"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Back
      </button>
      <main className="pt-20 pb-20 px-6 md:px-12 max-w-6xl mx-auto min-h-[60vh]">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">AI Personalization</h1>
          <p className="text-lg text-brand-dark/80 leading-relaxed max-w-3xl mx-auto">
            The more you cook, the better the AI understands your flavor profile, dislikes, and dietary restrictions.
            Experience truly personalized meal recommendations that evolve with your tastes.
          </p>
        </div>

        {/* How It Works Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-brand-dark mb-6 text-center">How AI Personalization Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">Initial Assessment</h3>
                <p className="text-brand-dark/80">
                  Start with basic preferences, dietary restrictions, and cooking experience level.
                  Our AI creates your initial profile to begin personalization.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">Continuous Learning</h3>
                <p className="text-brand-dark/80">
                  Every recipe you view, cook, rate, or save teaches the AI about your preferences.
                  The system adapts in real-time to your feedback.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-dark mb-3">Smart Recommendations</h3>
                <p className="text-brand-dark/80">
                  Receive increasingly accurate suggestions tailored to your unique taste profile,
                  cooking habits, and nutritional goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-dark mb-8 text-center">AI-Powered Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Flavor Profile Analysis</h3>
              <p className="text-brand-dark/80 text-sm">
                Identifies your preferred taste combinations, spice levels, and ingredient pairings
                to suggest recipes that match your palate perfectly.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🚫</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Smart Allergen Detection</h3>
              <p className="text-brand-dark/80 text-sm">
                Automatically filters out ingredients you're allergic to or prefer to avoid,
                ensuring all recommendations are safe for you.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Cooking Skill Adaptation</h3>
              <p className="text-brand-dark/80 text-sm">
                Adjusts recipe complexity based on your cooking experience and time constraints,
                from beginner-friendly to gourmet challenges.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Nutritional Intelligence</h3>
              <p className="text-brand-dark/80 text-sm">
                Considers your health goals, dietary needs, and nutritional preferences
                to balance taste with wellness objectives.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Seasonal Adaptation</h3>
              <p className="text-brand-dark/80 text-sm">
                Suggests recipes using in-season ingredients and adapts to weather patterns
                for optimal freshness and variety.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Family & Group Cooking</h3>
              <p className="text-brand-dark/80 text-sm">
                Learns preferences for multiple people in your household and suggests
                meals that accommodate everyone's tastes and dietary needs.
              </p>
            </div>
          </div>
        </section>

        {/* Learning Process Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg p-8 text-text-brand-dark">
            <h2 className="text-3xl font-bold mb-6 text-center">The Learning Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">What the AI Learns From You</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✓</span>
                    <span>Recipes you save and revisit</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✓</span>
                    <span>Ratings and reviews you give</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✓</span>
                    <span>Ingredients you substitute or avoid</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✓</span>
                    <span>Cooking times and complexity preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✓</span>
                    <span>Dietary restrictions and preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-300 mr-2">✓</span>
                    <span>Meal times and portion sizes</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">How Recommendations Improve</h3>
                <div className="space-y-4">
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold text-yellow-300">Week 1-2</div>
                    <div className="text-sm">Basic personalization based on initial setup</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold text-yellow-300">Week 3-4</div>
                    <div className="text-sm">Improved suggestions based on your first recipes</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold text-yellow-300">Month 2+</div>
                    <div className="text-sm">Highly accurate recommendations matching your taste</div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="font-semibold text-yellow-300">Month 6+</div>
                    <div className="text-sm">Anticipates preferences and suggests new discoveries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-dark mb-8 text-center">Why AI Personalization Matters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">🎯 Reduced Food Waste</h3>
              <p className="text-brand-dark/80">
                By suggesting recipes you'll actually enjoy and finish, you waste less food
                and save money on groceries.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">⏰ Time Savings</h3>
              <p className="text-brand-dark/80">
                Skip the endless scrolling through irrelevant recipes. Get instant suggestions
                that match your preferences and schedule.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">🌱 Healthier Eating</h3>
              <p className="text-brand-dark/80">
                The AI considers your nutritional goals while respecting your taste preferences,
                making healthy eating enjoyable.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">✨ Culinary Discovery</h3>
              <p className="text-brand-dark/80">
                Gradually introduces new ingredients and flavors that complement your existing
                preferences, expanding your culinary horizons.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy & Data Section */}
        <section className="mb-16">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-brand-dark mb-6 text-center">Your Data, Your Control</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🔒</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Secure & Private</h3>
                <p className="text-brand-dark/80 text-sm">
                  Your cooking preferences and data are encrypted and stored securely.
                  We never share your personal information with third parties.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">⚙️</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Full Control</h3>
                <p className="text-brand-dark/80 text-sm">
                  You can view, edit, or reset your AI profile at any time.
                  Adjust preferences or start fresh whenever you want.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">🧠</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Smart Learning</h3>
                <p className="text-brand-dark/80 text-sm">
                  The AI only learns from your explicit actions and feedback.
                  No assumptions are made without your input.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-brand-primary rounded-lg p-8 text-text-brand-dark">
            <h2 className="text-2xl font-bold mb-4">Experience Personalized Cooking</h2>
            <p className="mb-6">
              Join DailyDish and let our AI transform your cooking experience.
              Start with a few recipes and watch as recommendations become perfectly tailored to you.
            </p>
            <button className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Start Your Culinary Journey
            </button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default AiPersonalization;