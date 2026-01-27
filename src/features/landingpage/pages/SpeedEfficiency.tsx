import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../../components/layout/NavBar';
import LandingFooter from '../components/LandingFooter';

const SpeedEfficiency = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full relative">
      <NavBar />
      <button
        onClick={() => navigate('/', { state: { skipSplash: true } })}
        className="absolute top-18 right-12 bg-brand-primary text-brand-dark px-4 py-2 rounded-lg font-semibold hover:bg-[#CEDEBD] transition-colors z-50"
      >
        ← Back
      </button>
      <main className="pt-20 pb-20 px-6 md:px-12 max-w-6xl mx-auto min-h-[60vh]">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">Speed & Efficiency</h1>
          <p className="text-lg text-brand-dark/80 leading-relaxed max-w-3xl mx-auto">
            Get delicious meal ideas in seconds, optimized for the time you have available and minimal waste.
            Transform your cooking from time-consuming chore to efficient, enjoyable experience.
          </p>
        </div>

        {/* Lightning Fast Discovery */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-white">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Lightning-Fast Recipe Discovery</h2>
              <p className="text-lg opacity-90 max-w-2xl mx-auto">
                No more endless scrolling or decision paralysis. Get personalized meal suggestions
                instantly based on your available time, ingredients, and preferences.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2">5</div>
                <div className="text-sm opacity-90">Seconds to find recipes</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2">15-60</div>
                <div className="text-sm opacity-90">Minutes total cooking time</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                <div className="text-4xl font-bold mb-2">80%</div>
                <div className="text-sm opacity-90">Less time spent planning</div>
              </div>
            </div>
          </div>
        </section>

        {/* Time Optimization Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-dark mb-8 text-center">Smart Time Optimization</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⏱️</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Time-Based Filtering</h3>
              <p className="text-brand-dark/80 text-sm">
                Filter recipes by total time, prep time, or cook time. Perfect for busy weeknights,
                leisurely weekends, or quick lunch breaks.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Parallel Cooking</h3>
              <p className="text-brand-dark/80 text-sm">
                Recipes designed for efficient multitasking. Prep multiple components simultaneously
                to minimize total cooking time.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Voice-Activated Cooking</h3>
              <p className="text-brand-dark/80 text-sm">
                Hands-free cooking instructions. Get step-by-step guidance without stopping
                to read your phone or tablet.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔥</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">One-Pot Meals</h3>
              <p className="text-brand-dark/80 text-sm">
                Minimal cleanup with recipes designed to use single pots, pans, or sheets.
                Less time cooking means less time cleaning.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🧊</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Make-Ahead Prep</h3>
              <p className="text-brand-dark/80 text-sm">
                Prepare ingredients or components in advance. Store prepped items for
                ultra-fast assembly when you're ready to cook.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-brand-dark mb-3">Express Mode</h3>
              <p className="text-brand-dark/80 text-sm">
                Ultra-fast recipes for when you need dinner on the table in 15 minutes or less.
                Perfect for unexpected busy days or late nights.
              </p>
            </div>
          </div>
        </section>

        {/* Waste Reduction Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-brand-dark mb-6 text-center">Minimal Food Waste</h2>
            <p className="text-lg text-brand-dark/80 text-center mb-8 max-w-3xl mx-auto">
              Smart portioning, ingredient optimization, and leftover utilization to ensure
              nothing goes to waste while maximizing your grocery budget.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-brand-dark mb-4">Smart Portion Control</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-brand-dark/80">Adjustable serving sizes based on household needs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-brand-dark/80">Precise measurements to avoid over-purchasing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-brand-dark/80">Leftovers transformed into new meals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-brand-dark/80">Storage suggestions for optimal freshness</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-dark mb-4">Ingredient Optimization</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-brand-dark/80">Recipes using commonly available ingredients</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-brand-dark/80">Minimal specialty item requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-brand-dark/80">Cross-recipe ingredient utilization</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-brand-dark/80">Seasonal ingredient recommendations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Efficiency Tools Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-dark mb-8 text-center">Kitchen Efficiency Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">🛒 Smart Shopping Lists</h3>
              <p className="text-brand-dark/80 mb-4">
                Automatically generated shopping lists with quantities optimized for your recipes.
                Never buy too much or too little again.
              </p>
              <div className="text-sm text-brand-dark/60">
                • Categorized by store sections<br/>
                • Quantity calculations<br/>
                • Cross-recipe ingredient consolidation
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">📋 Step-by-Step Timers</h3>
              <p className="text-brand-dark/80 mb-4">
                Built-in timers for each cooking step with notifications and progress tracking.
                Never overcook or burn your food.
              </p>
              <div className="text-sm text-brand-dark/60">
                • Automatic step progression<br/>
                • Pause and resume functionality<br/>
                • Multiple timer management
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">🔍 Pantry Inventory</h3>
              <p className="text-brand-dark/80 mb-4">
                Track what you have on hand and get recipes that use your existing ingredients first.
                Maximize your current stock.
              </p>
              <div className="text-sm text-brand-dark/60">
                • Expiration date tracking<br/>
                • Low-stock alerts<br/>
                • Recipe suggestions from inventory
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">📊 Meal Planning Calendar</h3>
              <p className="text-brand-dark/80 mb-4">
                Plan your week in advance with drag-and-drop meal scheduling.
                Prepare efficiently for the entire week.
              </p>
              <div className="text-sm text-brand-dark/60">
                • Weekly overview<br/>
                • Prep day scheduling<br/>
                • Grocery list generation
              </div>
            </div>
          </div>
        </section>

        {/* Time Comparison Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg p-8 text-brand-dark">
            <h2 className="text-3xl font-bold mb-8 text-center">Time Savings Comparison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-300">Traditional Cooking</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                    <span>Recipe Research</span>
                    <span className="font-bold">30-60 min</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                    <span>Shopping</span>
                    <span className="font-bold">45-90 min</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                    <span>Meal Prep</span>
                    <span className="font-bold">20-40 min</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                    <span>Cooking</span>
                    <span className="font-bold">30-60 min</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/20 rounded-lg p-3 border-2 border-yellow-300">
                    <span className="font-semibold">Total Time</span>
                    <span className="font-bold text-yellow-300">2.5-4 hours</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-green-300">With DailyDish</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                    <span>Recipe Discovery</span>
                    <span className="font-bold">5-10 sec</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                    <span>Smart Shopping</span>
                    <span className="font-bold">10-15 min</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                    <span>Guided Prep</span>
                    <span className="font-bold">10-20 min</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                    <span>Efficient Cooking</span>
                    <span className="font-bold">15-45 min</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/20 rounded-lg p-3 border-2 border-green-300">
                    <span className="font-semibold">Total Time</span>
                    <span className="font-bold text-green-300">35-90 min</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <div className="inline-block bg-white text-brand-primary px-6 py-3 rounded-lg font-bold">
                Save 2+ Hours Per Meal
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-brand-primary rounded-lg p-8 text-brand-dark">
            <h2 className="text-2xl font-bold mb-4">Reclaim Your Time</h2>
            <p className="mb-6">
              Stop wasting hours on meal planning and cooking. With DailyDish, you can have
              delicious, healthy meals ready faster than ever before.
            </p>
            <button className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors" onClick={() => navigate('/login')}>
              Start Cooking Efficiently
            </button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default SpeedEfficiency;