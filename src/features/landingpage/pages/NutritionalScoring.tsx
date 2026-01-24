import React from 'react';
import NavBar from '../../../components/layout/NavBar';
import LandingFooter from '../components/LandingFooter';

const NutritionalScoring = () => {
  return (
    <div className="h-full w-full">
      <NavBar />
      <main className="pt-20 pb-20 px-6 md:px-12 max-w-6xl mx-auto min-h-[60vh]">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-brand-dark mb-6">Nutritional Scoring</h1>
          <p className="text-lg text-brand-dark/80 leading-relaxed max-w-3xl mx-auto">
            Every recipe comes with a dynamic Nutri-Score and full macro-nutrient breakdown (Proteins, Carbs, Fats).
            Make informed decisions about your meals with comprehensive nutritional insights.
          </p>
        </div>

        {/* What is Nutri-Score Section */}
        <section className="mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">What is Nutri-Score?</h2>
            <p className="text-lg text-brand-dark/80 leading-relaxed mb-6">
              Nutri-Score is a nutritional rating system that helps you understand the nutritional quality of food at a glance.
              It uses a simple color-coded scale from A (dark green - best nutritional quality) to E (dark orange - poorest nutritional quality).
            </p>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="text-center p-4 bg-green-600 text-white rounded-lg">
                <div className="text-2xl font-bold">A</div>
                <div className="text-sm">Excellent</div>
              </div>
              <div className="text-center p-4 bg-green-400 text-white rounded-lg">
                <div className="text-2xl font-bold">B</div>
                <div className="text-sm">Good</div>
              </div>
              <div className="text-center p-4 bg-yellow-400 text-white rounded-lg">
                <div className="text-2xl font-bold">C</div>
                <div className="text-sm">Average</div>
              </div>
              <div className="text-center p-4 bg-orange-400 text-white rounded-lg">
                <div className="text-2xl font-bold">D</div>
                <div className="text-sm">Poor</div>
              </div>
              <div className="text-center p-4 bg-red-500 text-white rounded-lg">
                <div className="text-2xl font-bold">E</div>
                <div className="text-sm">Bad</div>
              </div>
            </div>
            <p className="text-base text-brand-dark/70">
              The score is calculated based on positive nutrients (fiber, protein, fruits, vegetables, nuts) and negative nutrients
              (energy, saturated fat, sugars, sodium) per 100g of food.
            </p>
          </div>
        </section>

        {/* Macro-Nutrients Breakdown Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-dark mb-8 text-center">Macro-Nutrient Breakdown</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥩</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-dark mb-3">Proteins</h3>
              <p className="text-brand-dark/80 mb-4">
                Essential for muscle repair, immune function, and overall body maintenance.
                Sources include meat, fish, eggs, dairy, legumes, and nuts.
              </p>
              <div className="text-sm text-brand-dark/60">
                Recommended: 10-35% of daily calories
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍞</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-dark mb-3">Carbohydrates</h3>
              <p className="text-brand-dark/80 mb-4">
                Primary energy source for the body and brain. Includes sugars, starches, and fiber.
                Found in grains, fruits, vegetables, and legumes.
              </p>
              <div className="text-sm text-brand-dark/60">
                Recommended: 45-65% of daily calories
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧈</span>
              </div>
              <h3 className="text-xl font-semibold text-brand-dark mb-3">Fats</h3>
              <p className="text-brand-dark/80 mb-4">
                Important for hormone production, nutrient absorption, and cell membrane health.
                Includes saturated, unsaturated, and trans fats from various sources.
              </p>
              <div className="text-sm text-brand-dark/60">
                Recommended: 20-35% of daily calories
              </div>
            </div>
          </div>
        </section>

        {/* How It Helps Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-brand-primary to-brand-secondary rounded-lg p-8 text-brand-dark">
            <h2 className="text-3xl font-bold mb-6 text-center">How Nutritional Scoring Helps You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-3">Make Informed Choices</h3>
                <p className="mb-4">
                  Quickly identify healthier options when comparing similar recipes or ingredients.
                  The Nutri-Score provides an at-a-glance assessment of nutritional quality.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Balance Your Diet</h3>
                <p className="mb-4">
                  Track your macro-nutrient intake to ensure you're getting the right balance
                  of proteins, carbs, and fats for your lifestyle and health goals.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Meet Dietary Goals</h3>
                <p className="mb-4">
                  Whether you're aiming for weight loss, muscle gain, or simply maintaining
                  a healthy lifestyle, our detailed breakdowns help you stay on track.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-3">Learn and Improve</h3>
                <p className="mb-4">
                  Understand the nutritional composition of your meals and gradually
                  improve your food choices over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-dark mb-8 text-center">Additional Nutritional Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">Calorie Tracking</h3>
              <p className="text-brand-dark/80">
                Precise calorie calculations for each recipe, helping you manage your daily
                energy intake and maintain your target weight goals.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">Portion Control</h3>
              <p className="text-brand-dark/80">
                Nutritional information is provided per serving, making it easy to adjust
                portions and understand the impact on your overall nutrition.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">Allergen Information</h3>
              <p className="text-brand-dark/80">
                Clear identification of common allergens and dietary restrictions,
                ensuring safe and suitable meal choices for everyone.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-brand-dark mb-4">Customizable Goals</h3>
              <p className="text-brand-dark/80">
                Set personal nutritional targets and receive recommendations
                tailored to your specific health and fitness objectives.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-brand-primary rounded-lg p-8 text-brand-dark">
            <h2 className="text-2xl font-bold mb-4">Start Making Healthier Choices Today</h2>
            <p className="mb-6">
              Join DailyDish and discover how easy it is to eat healthier with our comprehensive
              nutritional scoring system guiding your every meal decision.
            </p>
            <button className="bg-white text-brand-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Get Started
            </button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
};

export default NutritionalScoring;