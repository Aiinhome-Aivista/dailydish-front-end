export interface Ingredient {
  name: string;
  qty: string;
  unit?: string;
  unclear?: boolean;
}

// interface Ingredient { // Removed duplicate interface
//   id: string;
//   name: string;
//   qty: string;
//   unit: string;
// }

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

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface CollectedData {
  ingredients?: Ingredient[];
  [key: string]: any;
}

export interface ChatRequest {
  user_id: string;
  message: string;
  chat_history: ChatMessage[];
  collected_data: CollectedData;
}

export interface ChatResponse {
  bot_name?: string;
  collected_data: CollectedData;
  message: string;
  status: string;
  user_id?: string;
  chat_history?: ChatMessage[];
  data?: {
    recipes?: GeneratedRecipe[];
    data?: {
      recipes: GeneratedRecipe[];
      total_recipes?: number;
    };
    [key: string]: any;
  };
}


export interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  type?: 
    | 'text'
    | 'cuisine-selector'
    | 'details-selector'
    | 'meal-type-selector'
    | 'ingredient-qty-selector'
    | 'final-action';
  ingredients?: any[]; // ✅ ADD THIS
}

