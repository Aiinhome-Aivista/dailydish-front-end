import { useState, useEffect } from 'react';
import { pantryService } from '../api/saveMenuService';
import type { SavedMealItem } from '../types/saveMeal';
import CuisineLoader from '../../../components/feedback/DailyDishLoader';
import { Check } from 'lucide-react';
import broccoliImage from '../../../assets/Broccolli_image.svg';

const MealPlan = () => {
    const [meals, setMeals] = useState<SavedMealItem[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <CuisineLoader />;
    }

    if (!meals || meals.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <p className="text-xl text-[#7A8F63] font-bold mb-4">No meal plan found.</p>
                <p className="text-brand-accent">Add recipes to your meal planner to see them here.</p>
            </div>
        );
    }

    return (
        <div className="h-full text-brand-dark overflow-y-auto pb-10 space-y-12">
            {/* Header Section */}
            <div className="max-w-full">
                <h1 className="text-3xl font-bold text-brand-dark">
                    Your Meal Plan
                </h1>
                <p className="text-sm text-brand-accent font-medium">
                    {meals.length} Planned Meals
                </p>
            </div>

            {meals.map((mealItem) => {
                const meal = mealItem.details;
                // Combine ingredients for display
                const allIngredients = [
                    ...(meal.ingredients_analysis?.current?.map((i: any) => ({ ...i, available: true })) || []),
                    ...(meal.ingredients_analysis?.missing?.map((i: any) => ({ ...i, available: false })) || [])
                ];

                const cookingSteps = meal.steps?.cooking || [];
                const prepSteps = meal.steps?.preparation || [];

                return (
                    <div key={mealItem.id} className="border-b border-[#43533414] pb-12 last:border-0 last:pb-0">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold">{meal.menu_name}</h2>
                            <p className="text-sm text-brand-accent">Saved at: {mealItem.saved_at}</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="flex flex-col gap-8">
                                {/* Hero Image */}
                                <div className="relative h-60 md:h-90 rounded-3xl overflow-hidden group shadow-lg">
                                    <div className="absolute inset-0 bg-slate-800 ">
                                        <img
                                            src={broccoliImage}
                                            alt={meal.menu_name}
                                            className="w-full h-full object-cover opacity-60"
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
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default MealPlan;