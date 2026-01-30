import NavBar from '../../../components/layout/NavBar'
import { useNavigate } from 'react-router-dom'
import Footer from './LandingFooter';

function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <NavBar />
      <button
        onClick={() => navigate('/', { state: { skipSplash: true } })}
        className="absolute top-18 right-12 bg-brand-primary text-brand-dark px-4 py-2 rounded-lg font-semibold hover:bg-brand-light transition-colors cursor-pointer flex items-center gap-2"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        Back
      </button>

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

          {/* Step 3 */}
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
              <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1] rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">⏲️</div>
                  <h3 className="text-xl font-bold  mb-2">Cooking Guide</h3>
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
              <div className="text-6xl mb-6 animate-bounce">📅</div>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
                4. Plan Your Week
              </h2>
              <p className="text-lg text-[#5e7054] leading-relaxed">
                Use our drag-and-drop meal planner to organize your week.
                Generate shopping lists appropriately and stay effortless.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1]  rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">🗓️</div>
                  <h3 className="text-xl font-bold  mb-2">Meal Planner</h3>
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
                Inspire others, exchange tips, and become a master home chef.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1]  rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">🤳</div>
                  <h3 className="text-xl font-bold  mb-2">Community</h3>
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
                onClick={() => navigate("/signup")}
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
    </div>
  )
}

export default HowItWorks
