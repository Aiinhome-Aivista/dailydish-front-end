import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { pantryService } from '../api/saveMenuService';
import type { SavedMealItem } from '../types/saveMeal';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';
import { Check, ArrowLeft, ArrowRight, Share2 } from 'lucide-react';
import defaultRecipeImage from "../../../assets/Recipe_default_image.webp";

import { useToast } from '../../../shared/context/ToastContext';
import DeleteModal from '../../../components/modal/pages/DeleteModal';

interface MealPlanContext {
    currentDate: Date;
    viewMode: 'week' | 'month';
}

const MealPlan = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const { currentDate, viewMode } = useOutletContext<MealPlanContext>();
    const [meals, setMeals] = useState<SavedMealItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [activeMeal, setActiveMeal] = useState<SavedMealItem | null>(null);
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);

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

    // Calendar Helpers
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
        const daysArray = [];

        // Adjust for Monday start (0 = Mon, 6 = Sun)
        const startDay = firstDay === 0 ? 6 : firstDay - 1;

        // Previous month days
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            daysArray.push({
                date: new Date(year, month - 1, prevMonthDays - i),
                isCurrentMonth: false
            });
        }

        // Current month days
        for (let i = 1; i <= days; i++) {
            daysArray.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }

        // Next month days to fill grid (up to 35 or 42 cells)
        const remainingCells = (7 - (daysArray.length % 7)) % 7;
        for (let i = 1; i <= remainingCells; i++) {
            daysArray.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }

        return daysArray;
    };

    const getWeekDays = (date: Date) => {
        const current = new Date(date);
        const day = current.getDay();
        const diff = current.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        const monday = new Date(current.setDate(diff));
        const week = [];

        for (let i = 0; i < 7; i++) {
            const nextDay = new Date(monday);
            nextDay.setDate(monday.getDate() + i);
            week.push(nextDay);
        }
        return week;
    };


    const isSameDay = (date1: Date, date2: Date) => {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const getMealsForDate = (date: Date) => {
        return meals.filter(meal => {
            // Assuming saved_at is a string that can be parsed by Date
            // Adjust if saved_at format is different
            const mealDate = new Date(meal.saved_at);
            return isSameDay(mealDate, date);
        });
    };

    if (loading) {
        return <DailyDishLoader />;
    }

    return (
        <div className={`h-full text-brand-dark pb-10 space-y-6 ${viewMode === 'month' ? 'overflow-hidden no-scrollbar' : 'overflow-y-auto'}`}>


            {activeMeal ? (
                (() => {
                    const mealItem = activeMeal;
                    const meal = mealItem.details;
                    // Combine ingredients for display
                    let allIngredients: any[] = [];
                    if (meal.ingredients_used && meal.ingredients_used.length > 0) {
                        allIngredients = meal.ingredients_used.map((i: any) => ({ ...i, available: true }));
                    } else if (meal.ingredients_analysis) {
                        allIngredients = [
                            ...(meal.ingredients_analysis?.current?.map((i: any) => ({ ...i, available: true })) || []),
                            ...(meal.ingredients_analysis?.missing?.map((i: any) => ({ ...i, available: false })) || [])
                        ];
                    }

                    const cookingSteps = meal.steps?.cooking || [];
                    const prepSteps = meal.steps?.preparation || [];

                    return (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 px-2">
                            <button
                                onClick={() => setActiveMeal(null)}
                                className="mb-4 flex items-center gap-2 hover:bg-black/5 rounded-lg px-2 py-1 w-fit transition-colors text-brand-dark"
                            >
                                <ArrowLeft size={20} />
                                <span className="font-bold">Back to Plan</span>
                            </button>

                            <div className="mb-6 flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-bold text-[#3e5035]">{meal.menu_name}</h2>
                                    <p className="text-sm text-[#7A8F63] font-medium">Saved for: {new Date(mealItem.saved_at).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => confirmDelete(meal.menu_name)}
                                    className="p-2 hover:bg-red-100 rounded-full transition-colors group/delete cursor-pointer"
                                    title="Delete Meal"
                                >
                                    <span className="material-symbols-outlined text-red-400 group-hover/delete:text-red-600">
                                        delete
                                    </span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="flex flex-col gap-8">
                                    {/* Hero Image */}
                                    <div className="relative h-60 md:h-80 rounded-4xl overflow-hidden group">
                                        <div className="absolute inset-0 bg-slate-800 ">
                                            <img
                                                src={defaultRecipeImage}
                                                alt={meal.menu_name}
                                                className="w-full h-full object-cover opacity-70"
                                                onError={(e) => {
                                                    e.currentTarget.src = defaultRecipeImage;
                                                }}
                                            />
                                        </div>

                                        <div className="absolute bottom-0 left-0 p-8 w-full bg-linear-to-t from-black/80 to-transparent text-white">
                                            <div className="flex gap-4 text-sm font-bold mb-2">
                                                {meal.time_breakdown?.prep_time && <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">{meal.time_breakdown.prep_time} prep</span>}
                                                {meal.time_breakdown?.cook_time && <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">{meal.time_breakdown.cook_time} cook</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ingredients */}
                                    <div className="h-fit">
                                        <div className="bg-[#CEDEBD36] border border-[#7A8F63]/20 rounded-3xl p-8 h-fit">
                                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#7A8F63]/20">
                                                <h3 className="text-xl font-bold text-[#3e5035]">Ingredients</h3>
                                                <div className="flex items-center bg-[#E8EDDE] rounded-lg p-1 text-[#3e5035]">
                                                    <span className="text-xs font-bold px-2">Servings:</span>
                                                    <span className="w-8 text-center font-bold px-2">{meal.servings}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                {allIngredients.map((ing, idx) => (
                                                    <div key={idx} className="flex items-center justify-between group py-2">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`min-w-6 h-6 rounded-full flex items-center justify-center text-white ${ing.available ? 'bg-[#95B974]' : 'bg-orange-400'}`}>
                                                                <Check size={14} strokeWidth={4} />
                                                            </div>
                                                            <span className="font-bold text-sm lg:text-base text-[#3e5035]">
                                                                {ing.name} <span className="text-[#7A8F63] font-normal">({ing.qty})</span>
                                                            </span>
                                                        </div>
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
                                        <div className="bg-[#CEDEBD]/30 border border-[#7A8F63]/20 rounded-3xl p-8">
                                            <h3 className="text-xl font-bold mb-6 text-[#3e5035]">Nutrition Dashboard</h3>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <div className="bg-[#E8EDDE] rounded-2xl p-6 text-center">
                                                    <div className="text-xs font-bold text-[#7A8F63] mb-1 uppercase tracking-wider">Calories</div>
                                                    <div className="text-3xl font-extrabold text-[#3e5035]">{meal.nutrition.total_calories?.replace(' kcal', '')}</div>
                                                    <div className="text-xs text-[#7A8F63] mt-1">kcal</div>
                                                </div>
                                                <div className="bg-[#E8EDDE] rounded-2xl p-6 text-center">
                                                    <div className="text-xs font-bold text-[#7A8F63] mb-1 uppercase tracking-wider">Fiber</div>
                                                    <div className="text-3xl font-extrabold text-[#3e5035]">{meal.nutrition.fiber}</div>
                                                    <div className="text-xs text-[#7A8F63] mt-1">g</div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                {[
                                                    { label: 'Protein', value: meal.nutrition.protein, color: 'bg-[#95B974]', width: '30%' },
                                                    { label: 'Carbohydrates', value: meal.nutrition.carbohydrates, color: 'bg-[#EoC9A6]', width: '65%' }, // Adjusted color placeholder
                                                    { label: 'Fats', value: meal.nutrition.fat, color: 'bg-[#F2D0A9]', width: '20%' }
                                                ].map((nutrient, i) => (
                                                    <div key={i}>
                                                        <div className="flex justify-between mb-2 text-sm font-bold text-[#3e5035]">
                                                            <span>{nutrient.label}</span>
                                                            <span>{nutrient.value}</span>
                                                        </div>
                                                        <div className="h-3 bg-[#E8EDDE] rounded-full overflow-hidden">
                                                            <div className={`h-full ${nutrient.color === 'bg-[#EoC9A6]' ? 'bg-orange-300' : nutrient.color} w-full`} style={{ width: nutrient.width }}></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Instructions */}
                                    <div className="bg-[#CEDEBD]/30 border border-[#7A8F63]/20 rounded-3xl p-8">
                                        <h3 className="text-xl font-bold mb-6 text-[#3e5035]">Instructions</h3>

                                        {prepSteps.length > 0 && (
                                            <div className="mb-8">
                                                <h4 className="text-lg font-bold text-[#7A8F63] mb-4">Preparation</h4>
                                                <div className="space-y-4">
                                                    {prepSteps.map((step: string, idx: number) => (
                                                        <div key={idx} className="flex gap-4">
                                                            <div className="shrink-0 w-8 h-8 rounded-full bg-[#B5C99A] text-[#3e5035] flex items-center justify-center font-bold text-sm">
                                                                {idx + 1}
                                                            </div>
                                                            <p className="text-sm leading-relaxed text-[#3e5035] pt-1">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <h4 className="text-lg font-bold text-[#7A8F63] mb-4">Cooking</h4>
                                            <div className="space-y-4">
                                                {cookingSteps.map((step: string, idx: number) => (
                                                    <div key={idx} className="flex gap-4">
                                                        <div className="shrink-0 w-8 h-8 rounded-full bg-[#7A8F63] text-white flex items-center justify-center font-bold text-sm">
                                                            {idx + 1}
                                                        </div>
                                                        <p className="text-sm leading-relaxed text-[#3e5035] pt-1">{step}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()
            ) : (
                // Calendar Grid
                <div className="w-full">
                    {/* Days Header */}
                    <div className="grid grid-cols-7 mb-4">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center">
                                <span className="text-brand-dark font-normal uppercase tracking-widest text-sm">{day}</span>
                            </div>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className={`grid grid-cols-7 ${viewMode === 'week' ? 'gap-4 min-h-125' : 'gap-2'}`}>
                        {(viewMode === 'week' ? getWeekDays(currentDate) : getDaysInMonth(currentDate)).map((dayObj, index) => {
                            const date = viewMode === 'week' ? dayObj : (dayObj as any).date;
                            const isCurrentMonth = viewMode === 'week' ? true : (dayObj as any).isCurrentMonth;
                            const dayMeals = getMealsForDate(date);
                            const isToday = isSameDay(date, new Date());

                            if (!isCurrentMonth && viewMode === 'month') return <div key={index} className="opacity-0"></div>; // Or render faded

                            return (
                                <div key={index} className={`flex flex-col ${viewMode === 'week' ? 'min-h-37.5' : 'h-24 p-2 transition-colors'}`}>
                                    {/* Date Number */}
                                    <div className="flex justify-center mb-2">
                                        <span className={`${viewMode === 'month' ? 'text-lg' : 'text-xl'} font-bold ${isToday ? 'text-brand-accent scale-110' : 'text-brand-dark'}`}>
                                            {date.getDate().toString().padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Meal Render Section */}
                                    <div className={`flex flex-col gap-3 overflow-y-auto no-scrollbar ${viewMode === 'month' ? 'flex-1 items-center px-1 pb-2' : ''}`}>
                                        {viewMode === 'month' ? (
                                            <>
                                                <div className="flex flex-wrap gap-2 justify-center">
                                                    {dayMeals.slice(0, 4).map((mealItem) => (
                                                        <div
                                                            key={mealItem.id}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedCardId(mealItem.id === selectedCardId ? null : mealItem.id);
                                                            }}
                                                            className={`w-10 h-10 rounded-full border-2 overflow-hidden shrink-0 shadow-sm transition-all hover:scale-110 cursor-pointer ${selectedCardId === mealItem.id ? 'border-brand-accent ring-2 ring-brand-accent/20' : 'border-white'}`}
                                                            title={mealItem.details.menu_name}
                                                        >
                                                            <img
                                                                src={defaultRecipeImage}
                                                                alt={mealItem.details.menu_name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                                {dayMeals.length > 4 && (
                                                    <div className="mt-2 py-1 px-3 bg-brand-accent/10 rounded-full">
                                                        <span className="text-[10px] font-black text-brand-accent uppercase tracking-widest leading-none">
                                                            +{dayMeals.length - 4} more
                                                        </span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            dayMeals.map((mealItem) => {
                                                const meal = mealItem.details;
                                                const ingredientsCount = (meal.ingredients_used?.length || 0) + (meal.ingredients_analysis?.current?.length || 0) + (meal.ingredients_analysis?.missing?.length || 0);

                                                return (
                                                    <div
                                                        key={mealItem.id}
                                                        onClick={() => setSelectedCardId(mealItem.id === selectedCardId ? null : mealItem.id)}
                                                        className={`rounded-3xl p-3 transition-all hover:scale-[1.02] group cursor-pointer border-2 ${selectedCardId === mealItem.id
                                                            ? 'border-brand-accent bg-[#F1EDDC] shadow-md'
                                                            : 'border-transparent bg-[#F1EDDC]'
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3 mb-2">
                                                            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 mt-1">
                                                                <img
                                                                    src={defaultRecipeImage}
                                                                    alt={meal.menu_name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h3 className="font-bold text-sm text-[#3e5035] leading-tight truncate w-full">{meal.menu_name}</h3>
                                                            </div>
                                                        </div>

                                                        <div className="text-center mb-2">
                                                            <span className="text-3xl font-extrabold text-[#3e5035] block leading-none">{ingredientsCount}</span>
                                                            <span className="text-xs font-medium text-brand-dark">Ingredients</span>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-auto pt-2">
                                                            <span className="text-xs font-semibold text-brand-accent">
                                                                {meal.time_breakdown?.cook_time || '30mins'}
                                                            </span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate('/share-masterpiece', { state: { meal: mealItem } });
                                                                    }}
                                                                    className="text-brand-accent hover:text-brand-dark transition-colors cursor-pointer"
                                                                    title="Share Masterpiece"
                                                                >
                                                                    <Share2 size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate('/recipe-details', {
                                                                            state: {
                                                                                menu_name: meal.menu_name,
                                                                                cooking_time: meal.time_breakdown?.cook_time,
                                                                                image_url: defaultRecipeImage,
                                                                                details: meal
                                                                            }
                                                                        });
                                                                    }}
                                                                    className="text-brand-accent hover:text-brand-dark transition-colors cursor-pointer"
                                                                    title="View Details"
                                                                >
                                                                    <ArrowRight size={17} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
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