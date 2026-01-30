import React, { useState, useEffect, } from "react";
import { Heart, ChevronRight, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { GeneratedRecipe, } from "../types/recipeConfiguration";
import type { SaveRecipeRequest } from "../types/saveMenu";
import defaultRecipeImage from "../../../assets/Recipe_default_image.webp";
import { pantryService } from "../api/saveMenuService";
import { useToast } from "../../../shared/context/ToastContext";
import { chatRecipeConfiguration } from '../api/recipeConfigurationService';
import type { Recipe } from "../types/aiCuratedMenu";
import { AxiosError } from "axios";
import DailyDishLoader from "../../../components/feedback/DailyDishLoader";
import { useAuth } from "../../auth/context/AuthContext";




const AiMenuDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, userId } = useAuth();
  const [selectedId, setSelectedId] = useState<number>(0);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<number>>(new Set());
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generationContext, setGenerationContext] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      let chatContext = location.state?.chatContext;
      const waitingForRecipes = location.state?.waitingForRecipes;

      // Check localStorage if not in state
      if (!chatContext) {
        const pendingContext = localStorage.getItem('pending_chat_context');
        if (pendingContext) {
          try {
            chatContext = JSON.parse(pendingContext);
            // Add user_id if missing or if it's guest_user
            if (!chatContext.user_id || chatContext.user_id === 'guest_user') {
              const currentUserId = userId || localStorage.getItem('user_id');
              if (currentUserId) {
                chatContext.user_id = currentUserId;
              }
            }
            localStorage.removeItem('pending_chat_context');
          } catch (e) {
            console.error("Error parsing pending chat context", e);
          }
        }
      } else {
        // If state is passed but user_id is guest_user (e.g. direct navigation which shouldn't happen for login flow usually, but good for safety)
        if (chatContext.user_id === 'guest_user') {
          const currentUserId = userId || localStorage.getItem('user_id');
          if (currentUserId) {
            chatContext.user_id = currentUserId;
          }
        }
      }

      // Extract context for display
      if (chatContext && chatContext.collected_data) {
        const data = chatContext.collected_data;
        const parts = [];

        if (data.ingredients && Array.isArray(data.ingredients) && data.ingredients.length > 0) {
          // Handle both simple string arrays or object arrays if the type definition varies, 
          // but based on types it's {name, qty}[]
          const ingredientsList = data.ingredients.map((i: any) => i.name || i).join(", ");
          if (ingredientsList) parts.push(ingredientsList);
        }

        if (data.cuisine || data.cuisine_preference) {
          parts.push(data.cuisine || data.cuisine_preference);
        }

        if (parts.length > 0) {
          setGenerationContext(parts.join(" + "));
        }
      }


      const hasRecipes = location.state?.recipes && Array.isArray(location.state.recipes) && location.state.recipes.length > 0;

      if ((waitingForRecipes && chatContext) || (!hasRecipes && chatContext)) { // Fetch only if waiting or no recipes exist
        setIsLoading(true);
        try {
          const response = await chatRecipeConfiguration(chatContext);
          if (response && response.status === 'success') {
            const respData = response.data as any;
            const generatedRecipes: GeneratedRecipe[] = respData?.recipes || respData?.data?.recipes || [];

            const mappedRecipes: Recipe[] = generatedRecipes.map((rec, index) => ({
              id: index + 1,
              title: rec.menu_name,
              description: rec.description,
              time: rec.cooking_time,
              image: defaultRecipeImage,
            }));
            setRecipes(mappedRecipes);
            setSelectedId(0);

            // SAVE STATE TO HISTORY SO IT PERSISTS ON BACK NAVIGATION
            navigate(location.pathname, {
              replace: true,
              state: {
                recipes: generatedRecipes,
                chatContext: chatContext
              }
            });
          } else {
            showToast("error", "Error", "Failed to generate recipes from chat.");
          }
        } catch (error) {
          console.error("Fetch recipes error", error);
          showToast("error", "Error", "An error occurred while fetching recipes.");
        } finally {
          setIsLoading(false);
        }
      } else if (hasRecipes) {
        const generatedRecipes: GeneratedRecipe[] = location.state.recipes;

        const mappedRecipes: Recipe[] = generatedRecipes.map((rec, index) => {
          return {
            id: index + 1,
            title: rec.menu_name,
            description: rec.description,
            time: rec.cooking_time,
            image: defaultRecipeImage,
          };
        });
        setRecipes(mappedRecipes);
        setSelectedId(0);
      } else {
        setRecipes([]);
      }
    };
    init();
  }, [location.state]);

  const handleSaveRecipe = async (e: React.MouseEvent, recipe: Recipe) => {
    e.stopPropagation();
    if (savingId) return;

    try {
      setSavingId(recipe.id);
      const payload: SaveRecipeRequest = {
        menu_name: recipe.title,
        cooking_time: recipe.time,
        description: recipe.description,
        image_url: recipe.image
      };

      const response = await pantryService.saveMenu(payload);

      if (response && response.status === 'success') {
        showToast("success", "Success", "Recipe saved successfully!");
        setSavedRecipeIds(prev => new Set(prev).add(recipe.id));
      } else {
        showToast("error", "Error", "Failed to save recipe.");
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 409) {
        showToast("info", "Info", "This recipe is already in your saved list.");
        setSavedRecipeIds(prev => new Set(prev).add(recipe.id));
      } else {
        console.error("Failed to save recipe", error);
        const errorMessage = (error as any).response?.data?.message || (error as any).message || "An error occurred while saving the recipe.";
        showToast("error", "Error", errorMessage);
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="h-full">
      {/* Header Section */}
      <div className="max-w-full mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/recipe-configuration")}
            className=" rounded-xl font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-brand-dark">
              arrow_back
            </span>
          </button>
          <h1 className="text-3xl font-bold text-brand-dark">
            Welcome to Your kitchen
          </h1>
        </div>
        <p className="text-xl text-brand-accent font-medium ml-9">
          Based on:{" "}
          <span className="text-lg text-brand-accent font-medium ">{generationContext || "Your preferences"}</span>
        </p>
      </div >

      {/* Grid Section */}
      {
        isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            {/* <Loader2 size={48} className="animate-spin text-brand-accent mb-4" /> */}
            <DailyDishLoader />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => setSelectedId(recipe.id)}
                  className={`
                group relative flex flex-col p-4 rounded-2xl cursor-pointer transition-all duration-300
                ${selectedId === recipe.id
                      ? "bg-[#d2e4c4] ring-[3px] ring-brand-accent shadow-lg scale-[1.02]"
                      : "bg-[#d2e4c4] hover:shadow-md hover:scale-[1.01]"
                    }

                `}
                >
                  {/* Image Container */}
                  <div className="h-40 w-full mb-5 overflow-hidden rounded-2xl">
                    <img
                      src={recipe.image}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = defaultRecipeImage;
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col grow">
                    <h3 className="text-xl font-bold mb-2 text-[#3e5035]">
                      {recipe.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-[#5e7054] mb-6 line-clamp-3">
                      {recipe.description}
                    </p>

                    {/* Footer: Meta & Action */}
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-col gap-3">
                        <span className="text-xs font-bold text-[#3e5035]">
                          {recipe.time}
                        </span>
                        {/* Heart Icon */}
                        <button
                          onClick={(e) => handleSaveRecipe(e, recipe)}
                          disabled={savingId === recipe.id || savedRecipeIds.has(recipe.id)}
                          className="text-[#8ba37a] hover:text-[#3e5035] transition-colors disabled:opacity-50"
                        >
                          {savingId === recipe.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : savedRecipeIds.has(recipe.id) ? (
                            <Heart
                              size={18}
                              fill="#3e5035"
                              className="text-[#3e5035]"
                            />
                          ) : (
                            <Heart
                              size={18}
                              className="opacity-60 hover:opacity-100"
                            />
                          )}
                        </button>
                      </div>

                      <div
                        className="flex items-center gap-1 text-xs font-bold text-[#9dbd87] group-hover:text-[#7a9d63] transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/recipe-details', {
                            state: {
                              menu_name: recipe.title,
                              cooking_time: recipe.time,
                              description: recipe.description,
                              image_url: recipe.image
                            }
                          });
                        }}
                      >
                        <span>View Recipe</span>
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex justify-center items-center py-36 opacity-100">
                <p className="text-xl text-brand-dark font-bold">No recipe found</p>
              </div>
            )}
          </div>
        )
      }
    </div >

  );
};

export default AiMenuDashboard;
