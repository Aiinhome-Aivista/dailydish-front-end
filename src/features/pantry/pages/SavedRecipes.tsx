import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { pantryService } from "../api/saveMenuService";
import type { SavedMenuItem } from "../types/recipeTypes";
import broccoliImage from "../../../assets/Broccolli_image.svg";
import CuisineLoader from "../../../components/feedback/DailyDishLoader";

const SavedRecipes = () => {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState<SavedMenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                setLoading(true);
                const response = await pantryService.getSavedMenus();
                if (response && response.status === 'success') {
                    setRecipes(response.saved_menus);
                }
            } catch (error) {
                console.error("Failed to fetch saved recipes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedRecipes();
    }, []);

    if (loading) {
        return <CuisineLoader />;
    }

    return (
        <div className="h-full">
            {/* Header Section */}
            <div className="max-w-full mb-8">
                <h1 className="text-3xl font-bold text-brand-dark">
                    Saved Recipes
                </h1>
                <p className="text-sm text-brand-accent font-medium">
                    Your favorite dishes
                </p>
            </div>

            {/* Grid Section */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div
                            key={recipe._id}
                            onClick={() => navigate('/recipe-details', {
                                state: {
                                    menu_name: recipe.menu_name,
                                    cooking_time: recipe.cooking_time,
                                    description: recipe.description,
                                    image_url: recipe.image_url
                                }
                            })}
                            className="group relative flex flex-col p-4 rounded-4xl cursor-pointer transition-all duration-300 bg-[#d2e4c4] hover:shadow-md hover:scale-[1.01]"
                        >
                            {/* Image Container */}
                            <div className="h-40 w-full mb-5 overflow-hidden rounded-2xl">
                                <img
                                    src={recipe.image_url || broccoliImage}
                                    loading="lazy"
                                    alt={recipe.menu_name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = broccoliImage;
                                    }}
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-2 text-[#3e5035]">
                                    {recipe.menu_name}
                                </h3>

                                <p className="text-sm leading-relaxed text-[#5e7054] mb-6 line-clamp-3">
                                    {recipe.description}
                                </p>

                                {/* Footer: Meta & Action */}
                                <div className="mt-auto flex items-center justify-between">
                                    <div className="flex flex-col gap-3">
                                        <span className="text-xs font-bold text-[#3e5035]">
                                            {recipe.cooking_time}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-1 text-xs font-bold text-[#9dbd87] group-hover:text-[#7a9d63] transition-colors">
                                        <span>View Recipe</span>
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full flex justify-center items-center py-20">
                        <p className="text-xl text-[#7A8F63] font-bold">No saved recipes found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedRecipes;
