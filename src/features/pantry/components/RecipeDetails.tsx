
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, Loader2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';
import { pantryService } from '../api/saveMenuService';
import { getRecipeDetails } from '../api/recipeDetailsService';
import { useToast } from '../../../shared/context/ToastContext';
import { AxiosError } from 'axios';
import type { RecipeDetailData, IngredientAnalysisItem } from '../types/recipeDetails';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';


export default function RecipeDetails() {
  const { showToast } = useToast();
  const [servings, setServings] = useState(4);
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingServings, setUpdatingServings] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [recipeData, setRecipeData] = useState<RecipeDetailData | null>(null);
  const dataFetchedRef = useRef(false);

  const { menu_name, cooking_time, image_url } = location.state || {};

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!menu_name || dataFetchedRef.current) return;
      dataFetchedRef.current = true;

      try {
        setLoading(true);
        const response = await getRecipeDetails({
          menu_name,
          cooking_time: cooking_time || "10 minutes",
          image_url: defaultRecipeImage
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
        details: {
          ...recipeData,
          ingredients_analysis: recipeData.ingredients_analysis,
        }
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
        const errorMessage = (error as any).response?.data?.message || (error as any).message || "An error occurred while adding to Meal Planner.";
        showToast("error", "Error", errorMessage);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateServings = async (newServings: number) => {
    if (newServings < 1 || !recipeData || !menu_name) return;

    try {
      setUpdatingServings(true);
      const response = await pantryService.updateServings({
        new_servings: newServings,
        recipe_details: {
          menu_name: recipeData.menu_name,
          servings: recipeData.servings,
          time_breakdown: recipeData.time_breakdown,
          ingredients_analysis: recipeData.ingredients_analysis,
          ingredients_used: recipeData.ingredients_used,
          nutrition: recipeData.nutrition
        }
      });

      if (response && response.status === 'success') {
        const { details } = response;
        setServings(details.servings);
        setRecipeData(prev => prev ? ({
          ...prev,
          servings: details.servings,
          nutrition: details.nutrition,
          ingredients_analysis: details.ingredients_analysis,
          ingredients_used: details.ingredients_used,
          time_breakdown: details.time_breakdown
        }) : null);
        showToast("success", "Success", response.message || "Recipe servings updated successfully.");
      }
    } catch (error) {
      console.error("Failed to update servings", error);
      showToast("error", "Error", "Failed to update servings.");
    } finally {
      setUpdatingServings(false);
    }
  };

  const getSuitabilityColor = (item: string) => {
    const match = item.match(/(\d+)%/);
    if (match) {
      const value = parseInt(match[1]);
      if (value <= 35) return "bg-red-400";
      if (value <= 65) return "bg-orange-400";
      if (value <= 100) return "bg-brand-accent";
      return "bg-[#95B974]";
    }
    return "bg-brand-accent";
  };

  // Combine ingredients for display
  let allIngredients: (IngredientAnalysisItem & { available: boolean })[] = [];
  if (recipeData?.ingredients_analysis) {
    allIngredients = [
      ...(recipeData.ingredients_analysis?.current || []).map(i => ({ ...i, available: true })),
      ...(recipeData.ingredients_analysis?.missing || []).map(i => ({ ...i, available: false }))
    ];
  } else if (recipeData?.ingredients_used) {
    allIngredients = recipeData.ingredients_used.map(i => ({ ...i, available: true }));
  }

  // Separate steps for display
  const cookingSteps = recipeData?.steps?.cooking || [];
  const prepSteps = recipeData?.steps?.preparation || [];

  return (
    <div className="w-full text-brand-dark min-h-full flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20, rotate: -5, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
        className="mb-6 relative z-10 shrink-0"
      >
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-2 text-brand-accent font-bold hover:text-brand-dark transition-colors cursor-pointer"
        >
          <ArrowLeft size={20} />
          Back to Menu
        </button>
        <h1 className="text-2xl md:text-2xl font-bold">Recipe | {menu_name || recipeData?.menu_name}</h1>
        <p className="text-brand-accent font-medium text-sm">Delicious & Healthy Choice</p>
      </motion.div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[50vh]">
          <DailyDishLoader />
        </div>
      ) : !recipeData ? (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh]">
          <p className="text-xl text-[#7A8F63] font-bold mb-4">Recipe details not found.</p>
          <button
            onClick={() => navigate("/ai-menu")}
            className="bg-brand-accent text-white px-6 py-2 rounded-xl font-bold"
          >
            Go Back
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-8"
        >
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            {/* Hero Image */}
            <motion.div
              layoutId={`image-container-${menu_name}`}
              className="relative h-60 md:h-90 rounded-3xl overflow-hidden group shadow-lg z-20"
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 bg-slate-800 ">
                <motion.img
                  layoutId={`image-${menu_name}`}
                  src={defaultRecipeImage}
                  alt={recipeData.menu_name}
                  className="w-full h-full object-cover opacity-60"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  onError={(e: any) => {
                    e.currentTarget.src = defaultRecipeImage;
                  }}
                />
              </div>

              <div className="absolute bottom-0 left-0 p-8 w-full bg-linear-to-t from-black/80 to-transparent text-white">
                <motion.h2
                  layoutId={`title-${menu_name}`}
                  className="text-3xl font-bold mb-2 text-brand-beige"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  {recipeData.menu_name}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="flex gap-4 text-sm font-medium"
                >
                  <span className="flex items-center gap-1">{recipeData.time_breakdown?.prep_time} prep</span>
                  <span className="flex items-center gap-1">{recipeData.time_breakdown?.cook_time} cook</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Ingredients */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotate: 3, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
              className="h-fit"
            >
              <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 h-fit backdrop-blur-xl">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#43533414]">
                  <h3 className="text-xl font-bold">Ingredients <span className="text-sm font-medium text-brand-accent ml-2">(Suggested for {servings} {servings > 1 ? 'People' : 'Person'})</span></h3>
                  <div className="flex items-center bg-brand-light rounded-lg p-1">
                    <span className="text-xs font-bold px-2">Servings:</span>
                    <button
                      onClick={() => handleUpdateServings(servings - 1)}
                      disabled={updatingServings || servings <= 1}
                      className={`w-6 h-6 flex items-center justify-center bg-brand-beige rounded text-sm hover:bg-white ${updatingServings || servings <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >-</button>
                    <span className="w-8 text-center font-bold flex justify-center items-center">
                      {updatingServings ? <Loader2 size={12} className="animate-spin" /> : servings}
                    </span>
                    <button
                      onClick={() => handleUpdateServings(servings + 1)}
                      disabled={updatingServings}
                      className={`w-6 h-6 flex items-center justify-center bg-[#7A8F63] text-white rounded text-sm hover:bg-[#687a54] ${updatingServings ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >+</button>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <div className="flex items-center justify-between pb-2 border-b border-[#43533414]">
                    <span className="text-sm font-bold text-brand-dark pl-2">Actual ingredients</span>
                    <span className="text-sm font-bold text-[#4A5D23]">Recommended</span>
                  </div>
                  {allIngredients.map((ing, idx) => (
                    <div key={idx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className={`min-w-6 h-6 rounded-full flex items-center justify-center text-white ${ing.available ? 'bg-[#95B974]' : 'bg-orange-400'}`}>
                          <Check size={14} strokeWidth={4} />
                        </div>
                        <span className="font-bold text-sm lg:text-base">
                          {ing.name} <span className="text-[#7A8F63] font-normal">({ing.qty})</span>
                        </span>
                      </div>
                      {ing.model_qty && (
                        <span className="text-sm font-medium opacity-70 whitespace-nowrap bg-[#E8EDDE] px-2 py-1 rounded text-[#4A5D23] flex items-center text-center">
                          {ing.model_qty}
                        </span>
                      )}
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
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {/* Nutrition Dashboard */}
            {/* Right Column Content - Wrapper for sequential transition */}
            <div className="flex flex-col gap-8">
              {/* Nutrition Dashboard */}
              <motion.div
                initial={{ opacity: 0, x: 50, rotate: -3, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
                className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 flex flex-col justify-between backdrop-blur-xl "
              >
                <h3 className="text-xl font-bold mb-4">Nutrition Dashboard</h3>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#CEDEBD36] rounded-2xl p-6 text-center">
                    <div className="text-xs font-bold text-brand-accent mb-1">CALORIES</div>
                    <div className="text-3xl font-extrabold text-brand-accent">{recipeData.nutrition?.total_calories?.replace(' kcal', '')}</div>
                    <div className="text-xs text-brand-accent">Per Serving</div>
                  </div>
                  <div className="bg-[#CEDEBD36] rounded-2xl p-6 text-center">
                    <div className="text-xs font-bold text-brand-accent mb-1">FIBER</div>
                    <div className="text-3xl font-extrabold text-brand-accent">{recipeData.nutrition?.fiber}</div>
                    <div className="text-xs text-brand-accent">{/* Daily Value not in API */}</div>
                  </div>
                </div>

                <div className="space-y-4 text-sm font-bold">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Protein</span>
                      <span>{recipeData.nutrition?.protein}</span>
                    </div>
                    <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                      <div className="h-full bg-brand-accent w-[30%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Carbohydrates</span>
                      <span>{recipeData.nutrition?.carbohydrates}</span>
                    </div>
                    <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                      <div className="h-full bg-brand-accent w-[65%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Fats</span>
                      <span>{recipeData.nutrition?.fat}</span>
                    </div>
                    <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                      <div className="h-full bg-brand-accent w-[20%]"></div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Suitability */}
              {recipeData.suitability && recipeData.suitability.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 50, rotate: 3, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
                  className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-6 backdrop-blur-xl"
                >
                  <h3 className="text-lg font-bold mb-3">Suitability</h3>
                  <div className="flex flex-wrap gap-2">
                    {recipeData.suitability.map((item, idx) => (
                      <span key={idx} className={`${getSuitabilityColor(item)} text-brand-beige px-3 py-1 rounded-full text-sm font-bold shadow-sm`}>
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Preparation Steps */}
              {prepSteps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 50, rotate: -2, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
                  className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 h-fit backdrop-blur-xl"
                >
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
                </motion.div>
              )}

              {/* Cooking Steps */}
              <motion.div
                initial={{ opacity: 0, y: 50, rotate: 2, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
                className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 h-fit backdrop-blur-xl"
              >
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
              </motion.div>
            </div>

          </div>
        </motion.div>
      )}
    </div>
  );
}
