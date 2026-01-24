import React from 'react'
import NavBar from '../../../components/layout/NavBar'
import { useNavigate } from 'react-router-dom'
import Footer from './LandingFooter';

function HowItWorks() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <NavBar />
      
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-[#435334] mb-6">
            How It Works
          </h1>
          <p className="text-xl md:text-2xl text-[#5e7054] mb-12 leading-relaxed">
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#435334] mb-4">
                1. Tell Us What You Have
              </h2>
              <p className="text-lg text-[#5e7054] leading-relaxed">
                Input your available ingredients, dietary preferences, and cooking time. 
                Our AI analyzes your pantry to create personalized recipe suggestions.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="text-xl font-bold text-[#435334] mb-2">Smart Input</h3>
                  <p className="text-[#5e7054]">Voice or text input for easy ingredient entry</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center mb-20">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pl-12">
              <div className="text-6xl mb-6 animate-pulse">🤖</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#435334] mb-4">
                2. AI Creates Magic
              </h2>
              <p className="text-lg text-[#5e7054] leading-relaxed">
                Our advanced AI combines your ingredients with culinary expertise to generate 
                delicious, innovative recipes tailored just for you.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">✨</div>
                  <h3 className="text-xl font-bold text-[#435334] mb-2">AI-Powered</h3>
                  <p className="text-[#5e7054]">Intelligent recipe generation with flavor optimization</p>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center mb-20">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
              <div className="text-6xl mb-6 animate-bounce">👨‍🍳</div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#435334] mb-4">
                3. Cook & Enjoy
              </h2>
              <p className="text-lg text-[#5e7054] leading-relaxed">
                Follow step-by-step instructions with built-in timers and tips. 
                Save your favorites and build your personal recipe collection.
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">⏲️</div>
                  <h3 className="text-xl font-bold text-[#435334] mb-2">Cooking Guide</h3>
                  <p className="text-[#5e7054]">Interactive cooking assistant with real-time guidance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">🌱</div>
              <h3 className="font-bold text-[#435334] mb-2">Eco-Friendly</h3>
              <p className="text-sm text-[#5e7054]">Reduce food waste with smart ingredient usage</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-bold text-[#435334] mb-2">Lightning Fast</h3>
              <p className="text-sm text-[#5e7054]">Get recipes in seconds, not hours</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-bold text-[#435334] mb-2">Personalized</h3>
              <p className="text-sm text-[#5e7054]">Recipes tailored to your taste preferences</p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-bold text-[#435334] mb-2">Mobile First</h3>
              <p className="text-sm text-[#5e7054]">Cook anywhere with our mobile app</p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#435334] mb-6">
              Ready to Start Cooking?
            </h2>
            <p className="text-lg text-[#5e7054] mb-8">
              Join thousands of home cooks creating amazing meals every day
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="bg-[#435334] text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-[#2a3a24] transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Get Started Free
              </button>
              <button 
                className="border-2 border-[#435334] text-[#435334] px-8 py-4 rounded-full text-lg font-bold hover:bg-[#435334] hover:text-white transition-all duration-300 cursor-pointer"
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
