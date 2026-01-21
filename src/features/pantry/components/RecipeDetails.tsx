
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, Loader2, Heart } from 'lucide-react';
import broccoliImage from '../../../assets/Broccolli_image.svg';
import axiosApi from '../../../lib/axiosApi';
import { API_ENDPOINTS } from '../../../config/endpoints';
import { pantryService } from '../api/saveMenuService';
import { useToast } from '../../../shared/context/ToastContext';
import { AxiosError } from 'axios';
import type { RecipeDetailsResponse, RecipeDetailData, } from '../types/recipeDetails';
import CuisineLoader from '../../../components/feedback/DailyDishLoader';


export default function RecipeDetails() {
  const { showToast } = useToast();
  const [servings, setServings] = useState(4);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [recipeData, setRecipeData] = useState<RecipeDetailData | null>(null);

  const { menu_name, cooking_time, image_url } = location.state || {};

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!menu_name) return;

      try {
        setLoading(true);
        const response = await axiosApi<RecipeDetailsResponse>(API_ENDPOINTS.RECIPEDETAILS, {
          method: 'POST',
          data: {
            menu_name,
            cooking_time: cooking_time || "10 minutes"
          }
        });

        if (response && response.status === 'success') {
          setRecipeData(response.details);
          setServings(response.details.servings);
        }
      } catch (error) {
        console.error("Failed to fetch recipe details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [menu_name, cooking_time]);

  const handleSaveRecipe = async () => {
    if (!recipeData || !menu_name) return;

    try {
      setSaving(true);

      const payload = {
        details: recipeData
      };

      const response = await pantryService.saveMeal(payload);

      if (response && response.status === 'success') {
        showToast("success", "Success", "Added to Meal Planner successfully!");
        setIsSaved(true);
      } else {
        showToast("error", "Error", "Failed to add to Meal Planner.");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        showToast("info", "Info", "Recipe is already in Meal Planner.");
        setIsSaved(true);
      } else {
        console.error("Failed to save meal", error);
        showToast("error", "Error", "An error occurred while adding to Meal Planner.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <CuisineLoader />;
  }

  if (!recipeData) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-xl text-[#7A8F63] font-bold mb-4">Recipe details not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-brand-accent text-white px-6 py-2 rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Combine ingredients for display
  const allIngredients = [
    ...recipeData.ingredients_analysis.current.map(i => ({ ...i, available: true })),
    ...recipeData.ingredients_analysis.missing.map(i => ({ ...i, available: false }))
  ];

  // Separate steps for display
  const cookingSteps = recipeData.steps.cooking || [];
  const prepSteps = recipeData.steps.preparation || [];

  return (
    <div className="h-full text-brand-dark">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-brand-accent font-bold hover:text-brand-dark transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </button>
        <h1 className="text-2xl md:text-2xl font-bold">Recipe | {recipeData.menu_name}</h1>
        <p className="text-brand-accent font-medium text-sm">Delicious & Healthy Choice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="flex flex-col gap-8">
          {/* Hero Image */}
          <div className="relative h-60 md:h-90 rounded-3xl overflow-hidden group shadow-lg">
            <div className="absolute inset-0 bg-slate-800 ">
              <img
                src={image_url || broccoliImage} // Use passed image or fallback
                alt={recipeData.menu_name}
                className="w-full h-full object-cover opacity-60"
                onError={(e) => { e.currentTarget.src = broccoliImage; }}
              />
            </div>

            <div className="absolute bottom-0 left-0 p-8 w-full bg-linear-to-t from-black/80 to-transparent text-white">
              <h2 className="text-3xl font-bold mb-2 text-brand-beige">{recipeData.menu_name}</h2>
              <div className="flex gap-4 text-sm font-medium">
                <span className="flex items-center gap-1">{recipeData.time_breakdown.prep_time}m prep</span>
                <span className="flex items-center gap-1">{recipeData.time_breakdown.cook_time}m cook</span>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="h-fit">
            <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 h-fit">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#43533414]">
                <h3 className="text-xl font-bold">Ingredients</h3>
                <div className="flex items-center bg-brand-light rounded-lg p-1">
                  <span className="text-xs font-bold px-2">Servings:</span>
                  <button
                    onClick={() => setServings(Math.max(1, servings - 1))}
                    className="w-6 h-6 flex items-center justify-center bg-brand-beige rounded text-sm hover:bg-white"
                  >-</button>
                  <span className="w-8 text-center font-bold">{servings}</span>
                  <button
                    onClick={() => setServings(servings + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-[#7A8F63] text-white rounded text-sm hover:bg-[#687a54]"
                  >+</button>
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {allIngredients.map((ing, idx) => (
                  <div key={idx} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className={`min-w-6 h-6 rounded-full flex items-center justify-center text-white ${ing.available ? 'bg-[#95B974]' : 'bg-orange-400'}`}>
                        <Check size={14} strokeWidth={4} />
                      </div>
                      <span className="font-bold text-sm lg:text-base">{ing.name}</span>
                    </div>
                    <span className="text-sm font-medium opacity-70 whitespace-nowrap">{ing.qty}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveRecipe}
              disabled={saving || isSaved}
              className={`w-full py-2 rounded-xl font-bold text-lg shadow-md transition-colors mt-6 flex items-center justify-center gap-2 cursor-pointer  ${isSaved
                ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#2E7D32]'
                : 'bg-brand-accent hover:bg-[#7A8F63] text-brand-beige'
                }`}
            >
              {saving ? (
                <Loader2 className="animate-spin" size={20} />
              ) : isSaved ? (
                <>
                  <Heart size={20} fill="currentColor" />
                  Saved
                </>
              ) : (
                <>
                  Add to Meal Planner
                </>
              )}
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
                <div className="text-3xl font-extrabold text-brand-accent">{recipeData.nutrition.total_calories?.replace(' kcal', '')}</div>
                <div className="text-xs text-brand-accent">Per Serving</div>
              </div>
              <div className="bg-[#CEDEBD36] rounded-2xl p-6 text-center">
                <div className="text-xs font-bold text-brand-accent mb-1">FIBER</div>
                <div className="text-3xl font-extrabold text-brand-accent">{recipeData.nutrition.fiber}</div>
                <div className="text-xs text-brand-accent">{/* Daily Value not in API */}</div>
              </div>
            </div>

            <div className="space-y-4 text-sm font-bold">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Protein</span>
                  <span>{recipeData.nutrition.protein}</span>
                </div>
                <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                  <div className="h-full bg-brand-accent w-[30%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Carbohydrates</span>
                  <span>{recipeData.nutrition.carbohydrates}</span>
                </div>
                <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                  <div className="h-full bg-brand-accent w-[65%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Fats</span>
                  <span>{recipeData.nutrition.fat}</span>
                </div>
                <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                  <div className="h-full bg-brand-accent w-[20%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Suitability */}
          {recipeData.suitability && recipeData.suitability.length > 0 && (
            <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-3">Suitability</h3>
              <div className="flex flex-wrap gap-2">
                {recipeData.suitability.map((item, idx) => (
                  <span key={idx} className="bg-brand-accent text-brand-beige px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cooking Steps */}
          <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 h-fit">
            <h3 className="text-xl font-bold pb-4">Cooking Steps</h3>
            <div className="space-y-4">
              {cookingSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[#4A5D3B] text-brand-beige flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="text-sm leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preparation Steps */}
          {prepSteps.length > 0 && (
            <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 h-fit">
              <h3 className="text-xl font-bold pb-4">Preparation Steps</h3>
              <div className="space-y-4">
                {prepSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-brand-accent text-brand-beige flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="text-sm leading-relaxed">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
