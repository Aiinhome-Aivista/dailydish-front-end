import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pantryService } from '../api/saveMenuService';
import type { SavedMealItem } from '../types/saveMeal';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';
import { Check, ArrowLeft, ChevronRight } from 'lucide-react';
import defaultRecipeImage from "../../../assets/Recipe_default_image.webp";

import { useToast } from '../../../shared/context/ToastContext';
import DeleteModal from '../../../components/modal/pages/DeleteModal';

const MealPlan = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [meals, setMeals] = useState<SavedMealItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeMeal, setActiveMeal] = useState<SavedMealItem | null>(null);

    const confirmDelete = (menu_name: string) => {
        setSelectedMeal(menu_name);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedMeal) return;

        try {
            setIsDeleting(true);
            const response = await pantryService.deleteMeal({ menu_name: selectedMeal });
            if (response && response.status === 'success') {
                showToast("success", "Deleted", response.message || "Meal deleted successfully");
                setMeals(prev => prev.filter(m => m.details.menu_name !== selectedMeal));
                setIsDeleteModalOpen(false);
                if (activeMeal?.details.menu_name === selectedMeal) {
                    setActiveMeal(null);
                }
            } else {
                showToast("error", "Error", "Failed to delete meal");
            }
        } catch (error) {
            console.error("Failed to delete meal", error);
            showToast("error", "Error", "An error occurred while deleting the meal");
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const fetchSavedMeal = async () => {
            try {
                setLoading(true);
                const response = await pantryService.getSavedMeal();

                if (response && response.status === 'success' && Array.isArray(response.data)) {
                    setMeals(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch saved meal", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSavedMeal();
    }, []);

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

    if (loading) {
        return <DailyDishLoader />;
    }

    return (
        <div className="h-full text-brand-dark overflow-y-auto pb-10 space-y-4">
            {/* Header Section */}
            <div className="w-full flex items-start gap-2">
                <button
                    onClick={() => {
                        if (activeMeal) {
                            setActiveMeal(null);
                        } else {
                            navigate("/ai-menu");
                        }
                    }}
                    className="mt-1 hover:bg-black/5 rounded-full text-brand-dark transition-colors cursor-pointer"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-brand-dark leading-tight">
                        {activeMeal ? 'Meal Details' : 'Your Meal Plan'}
                    </h1>
                    {!activeMeal && (
                        <p className="text-sm text-brand-accent font-medium mt-1">
                            {meals.length} Planned Meals
                        </p>
                    )}
                </div>
            </div>

            {activeMeal ? (
                (() => {
                    const mealItem = activeMeal;
                    const meal = mealItem.details;
                    // Combine ingredients for display
                    const allIngredients = [
                        ...(meal.ingredients_analysis?.current?.map((i: any) => ({ ...i, available: true })) || []),
                        ...(meal.ingredients_analysis?.missing?.map((i: any) => ({ ...i, available: false })) || [])
                    ];

                    const cookingSteps = meal.steps?.cooking || [];
                    const prepSteps = meal.steps?.preparation || [];

                    return (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold">{meal.menu_name}</h2>
                                    <p className="text-sm text-brand-accent">Saved at: {mealItem.saved_at}</p>
                                </div>
                                {/* <button
                                    onClick={() => confirmDelete(meal.menu_name)}
                                    className="p-2 hover:bg-red-100 rounded-full transition-colors group/delete cursor-pointer"
                                    title="Delete Meal"
                                >
                                    <span className="material-symbols-outlined text-red-400 group-hover/delete:text-red-600">
                                        delete
                                    </span>
                                </button> */}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="flex flex-col gap-8">
                                    {/* Hero Image */}
                                    <div className="relative h-60 md:h-90 rounded-3xl overflow-hidden group shadow-lg">
                                        <div className="absolute inset-0 bg-slate-800 ">
                                            <img
                                                src={defaultRecipeImage}
                                                alt={meal.menu_name}
                                                className="w-full h-full object-cover opacity-60"
                                                onError={(e) => {
                                                    e.currentTarget.src = defaultRecipeImage;
                                                }}
                                            />
                                        </div>

                                        <div className="absolute bottom-0 left-0 p-8 w-full bg-linear-to-t from-black/80 to-transparent text-white">
                                            <h2 className="text-3xl font-bold mb-2 text-brand-beige">{meal.menu_name}</h2>
                                            <div className="flex gap-4 text-sm font-medium">
                                                {meal.time_breakdown?.prep_time && <span className="flex items-center gap-1">{meal.time_breakdown.prep_time} prep</span>}
                                                {meal.time_breakdown?.cook_time && <span className="flex items-center gap-1">{meal.time_breakdown.cook_time} cook</span>}
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
                                                    <span className="w-8 text-center font-bold px-2">{meal.servings}</span>
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
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="flex flex-col gap-8">
                                    {/* Nutrition Dashboard */}
                                    {meal.nutrition && (
                                        <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 flex flex-col justify-between">
                                            <h3 className="text-xl font-bold mb-4">Nutrition Dashboard</h3>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="bg-[#CEDEBD36] rounded-2xl p-6 text-center">
                                                    <div className="text-xs font-bold text-brand-accent mb-1">CALORIES</div>
                                                    <div className="text-3xl font-extrabold text-brand-accent">{meal.nutrition.total_calories?.replace(' kcal', '')}</div>
                                                    <div className="text-xs text-brand-accent">Per Serving</div>
                                                </div>
                                                <div className="bg-[#CEDEBD36] rounded-2xl p-6 text-center">
                                                    <div className="text-xs font-bold text-brand-accent mb-1">FIBER</div>
                                                    <div className="text-3xl font-extrabold text-brand-accent">{meal.nutrition.fiber}</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4 text-sm font-bold">
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span>Protein</span>
                                                        <span>{meal.nutrition.protein}</span>
                                                    </div>
                                                    <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                                                        <div className="h-full bg-brand-accent w-[30%]"></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span>Carbohydrates</span>
                                                        <span>{meal.nutrition.carbohydrates}</span>
                                                    </div>
                                                    <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                                                        <div className="h-full bg-brand-accent w-[65%]"></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between mb-1">
                                                        <span>Fats</span>
                                                        <span>{meal.nutrition.fat}</span>
                                                    </div>
                                                    <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden">
                                                        <div className="h-full bg-brand-accent w-[20%]"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Suitability */}
                                    {meal.suitability && meal.suitability.length > 0 && (
                                        <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-6">
                                            <h3 className="text-lg font-bold mb-3">Suitability</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {meal.suitability.map((item: string, idx: number) => (
                                                    <span key={idx} className={`${getSuitabilityColor(item)} text-brand-beige px-3 py-1 rounded-full text-sm font-bold shadow-sm`}>
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                                                        {/* Preparation Steps */}
                                    {prepSteps.length > 0 && (
                                        <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 h-fit">
                                            <h3 className="text-xl font-bold pb-4">Preparation Steps</h3>
                                            <div className="space-y-4">
                                                {prepSteps.map((step: string, idx: number) => (
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

                                    {/* Cooking Steps */}
                                    <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 h-fit">
                                        <h3 className="text-xl font-bold pb-4">Cooking Steps</h3>
                                        <div className="space-y-4">
                                            {cookingSteps.map((step: string, idx: number) => (
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

                                </div>
                            </div>
                        </div>
                    );
                })()
            ) : meals.length > 0 ? (
                <div className="max-w-7xl  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {meals.map((mealItem) => {
                        const meal = mealItem.details;
                        return (
                            <div
                                key={mealItem.id}
                                onClick={() => setActiveMeal(mealItem)}
                                className="group relative flex flex-col p-4 rounded-4xl cursor-pointer transition-all duration-300 bg-[#d2e4c4] hover:shadow-md hover:scale-[1.01]"
                            >
                                {/* Image Container */}
                                <div className="h-40 w-full mb-5 overflow-hidden rounded-2xl">
                                    <img
                                        src={defaultRecipeImage}
                                        loading="lazy"
                                        alt={meal.menu_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = defaultRecipeImage;
                                        }}
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex flex-col grow">
                                    <h3 className="text-xl font-bold mb-2 text-[#3e5035]">
                                        {meal.menu_name}
                                    </h3>

                                    <div className="text-sm leading-relaxed text-[#5e7054] mb-6 line-clamp-3">
                                        <p className="text-xs font-medium mb-2">
                                            Saved: {mealItem.saved_at}
                                        </p>
                                        {meal.suitability && meal.suitability.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {meal.suitability.slice(0, 3).map((tag: string, idx: number) => (
                                                    <span key={idx} className="text-[10px] px-2 py-1 bg-white/50 rounded-full text-[#3e5035] font-bold">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {meal.suitability.length > 3 && (
                                                    <span className="text-[10px] px-2 py-1 bg-white/50 rounded-full text-[#3e5035] font-bold">
                                                        +{meal.suitability.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer: Meta & Action */}
                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex flex-row gap-2">
                                            {meal.time_breakdown?.prep_time && (
                                                <>
                                                    <span className="text-xs font-bold text-[#3e5035]">
                                                        {meal.time_breakdown.prep_time} prep
                                                    </span>
                                                    <span className="text-xs font-bold text-[#3e5035]">
                                                        {meal.time_breakdown.cook_time} cook
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    confirmDelete(meal.menu_name);
                                                }}
                                                className=" rounded-full pr-8 cursor-pointer "
                                                title="Delete Meal"
                                            >
                                                <span className="material-symbols-outlined text-sm text-brand-accent">
                                                    delete
                                                </span>
                                            </button>
                                            <div className="flex flex-row items-center gap-1 text-xs font-bold text-[#9dbd87] group-hover:text-[#7a9d63] transition-colors">
                                                <span>View Plan</span>
                                                <ChevronRight size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex justify-center items-center py-45 opacity-100">
                    <p className="text-xl text-brand-dark font-bold">No saved meals found</p>
                </div>
            )}

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Meal"
                message={`Are you sure you want to delete "${selectedMeal}"?`}
                description="This action cannot be undone. The meal will be permanently removed from your meal plan."
                isLoading={isDeleting}
            />
        </div>
    );
};

export default MealPlan;