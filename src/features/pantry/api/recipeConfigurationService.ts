import axiosApi from "../../../lib/axiosApi";
import { API_ENDPOINTS } from "../../../config/endpoints";
import type { RecipeGenerationRequest, RecipeGenerationResponse } from "../types/recipeConfiguration";


export const generateRecipes = async (data: RecipeGenerationRequest): Promise<RecipeGenerationResponse | null> => {
    return await axiosApi<RecipeGenerationResponse>(API_ENDPOINTS.GENERATERECIPE, {
        method: "POST",
        data,
    });
};
