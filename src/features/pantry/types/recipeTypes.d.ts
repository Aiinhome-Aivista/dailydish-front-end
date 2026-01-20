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
