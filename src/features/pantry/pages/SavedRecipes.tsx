import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { pantryService } from "../api/saveMenuService";
import type { SavedMenuItem } from "../types/saveMenu";
import broccoliImage from "../../../assets/Broccolli_image.svg";
import { useToast } from "../../../shared/context/ToastContext";
import DeleteModal from "../../../components/modal/pages/DeleteModal";
import CuisineLoader from "../../../components/feedback/DailyDishLoader";


const SavedRecipes = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [recipes, setRecipes] = useState<SavedMenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const confirmDelete = (e: React.MouseEvent, menu_name: string) => {
        e.stopPropagation();
        setSelectedRecipe(menu_name);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedRecipe) return;

        try {
            setIsDeleting(true);
            const response = await pantryService.deleteMenu({ menu_name: selectedRecipe });
            if (response && response.status === 'success') {
                showToast("success", "Deleted", response.message || "Recipe deleted successfully");
                navigate("/saved-recipes");
                setRecipes(prev => prev.filter(r => r.menu_name !== selectedRecipe));
                setIsDeleteModalOpen(false);
            } else {
                showToast("error", "Error", "Failed to delete recipe");
            }
        } catch (error) {
            console.error("Failed to delete recipe", error);
            showToast("error", "Error", "An error occurred while deleting the recipe");
        } finally {
            setIsDeleting(false);

        }
    };

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                setLoading(true);
                const response = await pantryService.getSavedMenus();
                if (response && response.status === 'success') {
                    setRecipes(response.data || []);
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
            <div className="max-w-full flex items-start gap-2 mb-4">
                <button
                    onClick={() => navigate('/ai-menu')}
                    className="mt-1 -ml-1 hover:bg-black/5 rounded-full text-brand-dark transition-colors cursor-pointer"
                   
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-brand-dark leading-tight">
                        Saved Recipes
                    </h1>
                    <p className="text-sm text-brand-accent font-medium mt-1">
                        Your favorite dishes
                    </p>
                </div>
            </div>

            {/* Grid Section */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recipes.length > 0 ? (
                    recipes.map((recipe) => (
                        <div
                            key={recipe.id}
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
                            <div className="flex flex-col grow">
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

                                    <div className="flex flex-row items-center gap-3">
                                        <button
                                            onClick={(e) => confirmDelete(e, recipe.menu_name)}
                                            className=" hover:bg-brand-beige rounded-full p-1"
                                            title="Delete Recipe"
                                        >
                                            <span className="material-symbols-outlined text-brand-accent">
                                                delete
                                            </span>
                                        </button>
                                        <div className="flex flex-row items-center gap-1 text-xs font-bold text-[#9dbd87] group-hover:text-[#7a9d63] transition-colors">
                                            <span>View Recipe</span>
                                            <ChevronRight size={16} />
                                        </div>
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

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Recipe"
                message={`Are you sure you want to delete "${selectedRecipe}"?`}
                description="This action cannot be undone. The recipe will be permanently removed from your saved list."
                isLoading={isDeleting}
            />
        </div>
    );
};

export default SavedRecipes;
