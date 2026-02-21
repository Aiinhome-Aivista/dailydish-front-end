export interface Nutrition {
    carbohydrates: string;
    fat: string;
    fiber: string;
    protein: string;
    total_calories: string;
}

export interface IngredientItem {
    name: string;
    qty: string;
    model_qty?: string;
}

export interface RecipeSteps {
    preparation: string[];
    cooking: string[];
}

export interface TimeBreakdown {
    prep_time: string;
    cook_time: string;
}

export interface SuitabilityReasons {
    adult: string[];
    child: string[];
    senior: string[];
}

export interface CommunityMealDetails {
    menu_name: string;
    description?: string;
    cooking_time?: string;
    servings: number;
    time_breakdown: TimeBreakdown;
    ingredients_used: IngredientItem[];
    suitability: string[];
    steps: RecipeSteps;
    nutrition: Nutrition;
    suitability_reasons?: SuitabilityReasons;
}

export interface CommunityPost {
    post_id: number;
    menu_name: string;
    shared_by: string;
    rating: number;
    comment: string;
    image_url: string;
    created_at: string;
    meal_details: CommunityMealDetails;
}

export interface CommunityFeedResponse {
    status: string;
    count: number;
    data: CommunityPost[];
}
