// Payload Ingredient
export interface Ingredient {
  name: string;
  qty: string;
}

// UI Ingredient
export interface UiIngredient {
  id: string;
  name: string;
  qty: string;
  unit: string;
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
  message?: string;
}

interface RowProps {
  name: string;
  qty: string;
  unit: string;
  onDelete: () => void;
}
interface OptionProps {
  label: string;
  active?: boolean;
  icon?: string;
  onClick?: () => void;
}
// Recipe Details Types


// Cuisine Essentials Types

export interface CuisineEssentialsRequest {
  cuisine: string;
}

export interface CuisineEssentialsData {
  common_spices: string[];
  cuisine: string;
  description: string;
  essential_cooking_items: string[];
}

export interface CuisineEssentialsResponse {
  data: CuisineEssentialsData;
  status: string;
  user_id: string;
}
