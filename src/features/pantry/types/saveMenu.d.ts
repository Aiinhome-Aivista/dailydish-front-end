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

export interface SavedMenuItem {
    _id: string;
    menu_name: string;
    cooking_time: string;
    description: string;
    image_url: string;
    user_id: string;
    created_at?: string;
}

export interface SavedMenuResponse {
    status: string;
    saved_menus: SavedMenuItem[];
}
