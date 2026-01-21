export interface SaveRecipeRequest {
    menu_name: string;
    cooking_time: string;
    description: string;
    image_url: string;
}

export interface DeleteRecipeRequest {
    menu_name: string;
}

export interface SaveRecipeResponse {
    message: string;
    status: string;
}

export interface SavedMenuItem {
    id: number;
    menu_name: string;
    cooking_time: string;
    description: string;
    image_url: string;
    ingredients?: { name: string; qty: string }[];
    number_of_people?: number;
    saved_at?: string;
    cuisine_preference?: string;
}

export interface SavedMenuResponse {
    status: string;
    data: SavedMenuItem[];
}
