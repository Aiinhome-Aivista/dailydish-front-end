export interface RecipeNutrition {
    carbohydrates: string;
    fat: string;
    fiber: string;
    protein: string;
    total_calories: string;
}

export interface RecipeSteps {
    cooking: string[];
    preparation: string[];
}

export interface IngredientAnalysisItem {
    name: string;
    qty: string;
}

export interface IngredientsAnalysis {
    current: IngredientAnalysisItem[];
    missing: IngredientAnalysisItem[];
}

export interface RecipeDetailData {
    menu_name: string;
    description: string;
    cooking_time: string;
    servings: number;
    nutrition: RecipeNutrition;
    steps: RecipeSteps;
    ingredients_analysis: IngredientsAnalysis;
    suitability: string[];
    time_breakdown: {
        cook_time: string;
        prep_time: string;
    };
}

export interface RecipeDetailsResponse {
    details: RecipeDetailData;
    status: string;
    user_id: string;
}


export interface RecipeUpdateServingsRequest {
    new_servings: number;
    recipe_details: {
        menu_name: string;
        servings: number;
        time_breakdown: {
            cook_time: string;
            prep_time: string;
        };
        ingredients_analysis: IngredientsAnalysis;
        nutrition: RecipeNutrition;
    };
}

export interface RecipeUpdateServingsResponse {
    details: {
        menu_name: string;
        servings: number;
        time_breakdown: {
            cook_time: string;
            prep_time: string;
        };
        ingredients_analysis: IngredientsAnalysis;
        nutrition: RecipeNutrition;
    };
    message: string;
    status: string;
}
