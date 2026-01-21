import React, { useState, useEffect, } from "react";
import { Heart, ChevronRight, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { GeneratedRecipe, } from "../types/recipeConfiguration";
import type { SaveRecipeRequest } from "../types/saveMenu";
import brocooli from "../../../assets/Broccolli_image.svg";
import { pantryService } from "../api/saveMenuService";
import { useToast } from "../../../shared/context/ToastContext";
import { AxiosError } from "axios";

// Define the shape of a recipe item
interface Recipe {
  id: number;
  title: string;
  description: string;
  time: string;
  image: string;
  tags?: string[];
}

const AiMenuDashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState<number>(0);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState<Set<number>>(new Set());
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    if (location.state && location.state.recipes) {
      const generatedRecipes: GeneratedRecipe[] = location.state.recipes;
      // const mappedRecipes: Recipe[] = generatedRecipes.map((rec, index) => ({
      //   id: index + 1,
      //   title: rec.menu_name,
      //   description: rec.description,
      //   time: rec.cooking_time,
      //   image: `${rec.image_url}&cache=${index}`,
      // }));

      const mappedRecipes: Recipe[] = generatedRecipes.map((rec, index) => {
        const seed = Date.now() + index; // 🔑 unique seed per recip
        return {
          id: index + 1,
          title: rec.menu_name,
          description: rec.description,
          time: rec.cooking_time,
          image: `${rec.image_url.replace(/seed=\d+/, `seed=${seed}`)}`,
        };
      });
      setRecipes(mappedRecipes);
      setSelectedId(0);
    } else {
      setRecipes([]);
    }
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
        setSavedRecipeIds(prev => new Set(prev).add(recipe.id)); // Mark as saved anyway
      } else {
        console.error("Failed to save recipe", error);
        showToast("error", "Error", "An error occurred while saving the recipe.");
      }
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="h-full">
      {/* Header Section */}
      <div className="max-w-full mb-8">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => navigate(-1)}
            className=" rounded-xl font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-brand-dark">
              arrow_back
            </span>
          </button>
          <h1 className="text-3xl font-bold text-brand-dark">
            Your AI-Curated Menu
          </h1>
        </div>
        <p className="text-sm text-brand-accent font-medium">
          Based on:{" "}
          <span className="">Chicken , Broccoli, Garlic, Oriental Cuisine</span>
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.length > 0 ? (
          recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => setSelectedId(recipe.id)}
              className={`
                group relative flex flex-col p-4 rounded-4xl cursor-pointer transition-all duration-300
                ${selectedId === recipe.id
                  ? "bg-[#d2e4c4] ring-[3px] ring-[#95B974] shadow-lg scale-[1.02]"
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
                    e.currentTarget.src = brocooli;
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
          <div className="col-span-full flex justify-center items-center py-20">
            <p className="text-xl text-[#7A8F63] font-bold">No recipe found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMenuDashboard;
