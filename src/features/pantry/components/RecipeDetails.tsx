
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import broccoliImage from '../../../assets/Broccolli_image.svg';

export default function RecipeDetails() {
  const [servings, setServings] = useState(2);

  // Mock Data
  const recipe = {
    title: "Broccoli-Quinoa",
    subtitle: "Based on: Chicken , Broccoli, Garlic, Oriental Cuisine",
    prepTime: "15m",
    cookTime: "30m",
    nutrition: {
      calories: 420,
      fiber: "12g",
      fiberDaily: "48%",
      protein: 18,
      carbs: 54,
      fats: 14
    },
    ingredients: [
      { name: "No-waste cooking algorithms.", qty: "1 cup (cooked)" },
      { name: "Chickpeas (rinsed & drained)", qty: "1/2 can" },
      { name: "English Cucumber (diced)", qty: "1 medium" },
      { name: "Kalamata Olives", qty: "1/4 cup" },
      { name: "Lemon-Tahini Dressing", qty: "2 tbsp" },
    ],
    steps: [
      {
        title: "Prepare the Grain Base",
        desc: "Rinse quinoa under cold water. Combine with 2 parts water or vegetable broth in a small pot. Bring to a boil, then simmer covered for 15 minutes until liquid is absorbed."
      },
      {
        title: "Vegetable Prep",
        desc: "While quinoa cooks, dice the cucumber, halve the cherry tomatoes, and thinly slice the red onion. Toss together with a pinch of sea salt to release juices."
      },
      {
        title: "Assemble & Dress",
        desc: "Divide quinoa into bowls. Top with vegetable mix, chickpeas, and olives. Drizzle with lemon-tahini dressing and garnish with fresh parsley and crumbled feta."
      }
    ]
  };

  return (
    <div className="h-full text-brand-dark">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-2xl font-bold">Recipe | {recipe.title}</h1>
        <p className="text-brand-accent font-medium text-sm">{recipe.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          {/* Hero Image */}
          <div className="relative h-60 md:h-90 rounded-3xl overflow-hidden group shadow-lg">
            {/* Placeholder for Image - Using a gradient/color block since I don't have the asset */}
            <div className="absolute inset-0 bg-slate-800 ">
              <img
                src={broccoliImage}
                alt="Broccoli-Quinoa"
                className="w-full h-full object-cover opacity-60"
              />
            </div>

            <div className="absolute bottom-0 left-0 p-8 w-full bg-gradient-to-t from-black/80 to-transparent text-white">
              <h2 className="text-3xl font-bold mb-2 text-[#FAF1E4]">{recipe.title}</h2>
              <div className="flex gap-4 text-sm font-medium">
                <span className="flex items-center gap-1">{recipe.prepTime} prep</span>
                <span className="flex items-center gap-1">{recipe.cookTime} cook</span>
                {/* "cock" was in the design, assuming typo for "cook", correcting to "cook" but sticking to design if strict, I'll use cook */}
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="h-fit">
            <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 h-fit">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#43533414]">
                <h3 className="text-xl font-bold">Ingredients</h3>
                <div className="flex items-center bg-[#CEDEBD] rounded-lg p-1">
                  <span className="text-xs font-bold px-2">Servings:</span>
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-6 h-6 flex items-center justify-center bg-[#FAF1E4] rounded text-sm hover:bg-white"
                  >-</button>
                  <span className="w-8 text-center font-bold">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-[#7A8F63] text-white rounded text-sm hover:bg-[#687a54]"
                  >+</button>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {recipe.ingredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="min-w-6 h-6 rounded-full bg-[#95B974] flex items-center justify-center text-white">
                        <Check size={14} strokeWidth={4} />
                      </div>
                      <span className="font-bold text-sm lg:text-base">{ing.name}</span>
                    </div>
                    <span className="text-sm font-medium opacity-70 whitespace-nowrap">{ing.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-[#95B974] hover:bg-[#7A8F63] text-[#FAF1E4] py-2 rounded-xl font-bold text-lg shadow-md transition-colors mt-6">
              Add to Meal Planner
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-8">
          {/* Nutrition Dashboard */}
          <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 flex flex-col justify-between">
            <h3 className="text-xl font-bold mb-4">Nutrition Dashboard</h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#CEDEBD36] rounded-2xl p-6 text-center">
                <div className="text-xs font-bold text-brand-accent mb-1">CALORIES</div>
                <div className="text-3xl font-extrabold text-brand-accent">{recipe.nutrition.calories}</div>
                <div className="text-xs text-brand-accent">Per Serving</div>
              </div>
              <div className="bg-[#CEDEBD36] rounded-2xl p-6 text-center">
                <div className="text-xs font-bold text-brand-accent mb-1">FIBER</div>
                <div className="text-3xl font-extrabold text-brand-accent">{recipe.nutrition.fiber}</div>
                <div className="text-xs text-brand-accent">{recipe.nutrition.fiberDaily} DV</div>
              </div>
            </div>

            <div className="space-y-4 text-sm font-bold">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Protein</span>
                  <span>{recipe.nutrition.protein}G</span>
                </div>
                <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                  <div className="h-full bg-[#95B974] w-[30%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Carbohydrates</span>
                  <span>{recipe.nutrition.carbs}G</span>
                </div>
                <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                  <div className="h-full bg-[#95B974] w-[65%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Fats</span>
                  <span>{recipe.nutrition.fats}G</span>
                </div>
                <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                  <div className="h-full bg-[#95B974] w-[20%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Preparation Steps */}
          <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 h-fit">
            <h3 className="text-xl font-bold pb-4">Preparation Steps</h3>

            <div className="space-y-4">
              {recipe.steps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#4A5D3B] text-[#FAF1E4] flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{step.title}</h4>
                    <p className="text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}