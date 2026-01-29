
export interface TimeBreakdown {
    prep_time: string;
    cook_time: string;

}

export interface IngredientItem {
    name: string;
    qty: string;
}

export interface IngredientsAnalysis {
    current: IngredientItem[];
    missing: IngredientItem[];
}

export interface RecipeSteps {
    preparation: string[];
    cooking: string[];
}

export interface RecipeNutrition {
    total_calories: string;
    protein: string;
    fat: string;
    fiber: string;
    carbohydrates: string;
}

export interface MealDetails {
    menu_name: string;
    description: string;
 
    cooking_time: string;
    servings: number;
    time_breakdown: TimeBreakdown;
    ingredients_analysis: IngredientsAnalysis;
    suitability: string[];
    steps: RecipeSteps;
    nutrition: RecipeNutrition;
}

export interface SaveMealRequest {
    details: MealDetails;
}

export interface DeleteMealRequest {
    menu_name: string;
}

export interface SaveMealResponse {
    status: string;
    message: string;
    data?: any;
}

export interface SavedMealItem {
    id: number;
    menu_name: string;
    saved_at: string;
    details: MealDetails;
}

export interface GetSavedMealResponse {
    status: string;
    count: number;
    data: SavedMealItem[];
}