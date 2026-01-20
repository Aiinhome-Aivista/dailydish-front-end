export interface Ingredient {
    name: string;
    qty: string;
}

export interface RecipeGenerationRequest {
    ingredients: Ingredient[];
    cuisine_preference: string;
    number_of_people: number;
    cooking_time: string;
    cooking_preference: string;
}

export interface GeneratedRecipe {
    cooking_time: string;
    description: string;
    image_url: string;
    menu_name: string;
}

export interface RecipeGenerationResponse {
    data: {
        recipes: GeneratedRecipe[];
    };
    status: string;
    user_id: string;
}

// Recipe Details Types

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

export interface SaveRecipeRequest {
    menu_name: string;
    cooking_time: string;
    description: string;
    image_url: string;
}

export interface SaveRecipeResponse {
    message: string;
    status: string;
}
