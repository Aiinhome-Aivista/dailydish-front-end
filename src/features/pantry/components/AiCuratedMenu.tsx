import React, { useState, useEffect } from 'react';
import { Heart, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { GeneratedRecipe } from '../types/recipeTypes';
import brocooli from '../../../assets/Broccolli_image.svg';

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
  const [selectedId, setSelectedId] = useState<number>(0);
  const [recipes, setRecipes] = useState<Recipe[]>([]);



  useEffect(() => {
    if (location.state && location.state.recipes) {
      const generatedRecipes: GeneratedRecipe[] = location.state.recipes;
      const mappedRecipes: Recipe[] = generatedRecipes.map((rec, index) => ({
        id: index + 1,
        title: rec.menu_name,
        description: rec.description,
        time: rec.cooking_time,
        image: rec.image_url,
      }));
      setRecipes(mappedRecipes);
      setSelectedId(0);

    } else {
      setRecipes([]);
      ;
    }
  }, [location.state]);



  return (
    <div className="h-full">
      {/* Header Section */}
      <div className="max-w-full mb-8">
        <h1 className="text-3xl font-bold text-brand-dark">
          Your AI-Curated Menu
        </h1>
        <p className="text-sm text-brand-accent font-medium">
          Based on: <span className="">Chicken , Broccoli, Garlic, Oriental Cuisine</span>
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
                  ? 'bg-[#d2e4c4] ring-[3px] ring-[#95B974] shadow-lg scale-[1.02]'
                  : 'bg-[#d2e4c4] hover:shadow-md hover:scale-[1.01]'
                }

                `}
            >
              {/* Image Container */}
              <div className="h-40 w-full mb-5 overflow-hidden rounded-2xl">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  onError={(e) => {
                    e.currentTarget.src = brocooli;
                  }}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col flex-grow">
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
                    <button className="text-[#8ba37a] hover:text-[#3e5035] transition-colors">
                      <Heart size={18} fill="currentColor" className="opacity-60 hover:opacity-100" />
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