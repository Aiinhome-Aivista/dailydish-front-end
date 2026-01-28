import axiosApi from "../../../lib/axiosApi";
import { API_ENDPOINTS } from "../../../config/endpoints";
import type { RecipeGenerationRequest, RecipeGenerationResponse, CuisineEssentialsRequest, CuisineEssentialsResponse } from "../types/recipeConfiguration";


export const generateRecipes = async (data: RecipeGenerationRequest): Promise<RecipeGenerationResponse | null> => {
    return await axiosApi<RecipeGenerationResponse>(API_ENDPOINTS.GENERATERECIPE, {
        method: "POST",
        data,
    });
};

export const getCuisineEssentials = async (data: CuisineEssentialsRequest): Promise<CuisineEssentialsResponse | null> => {
    return await axiosApi<CuisineEssentialsResponse>(API_ENDPOINTS.CUISINEESSENTIALS, {
        method: "POST",
        data,
    });
};
