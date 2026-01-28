import axiosApi from "../../../lib/axiosApi";
import { API_ENDPOINTS } from "../../../config/endpoints";
import type { RecipeGenerationRequest, RecipeGenerationResponse, ChatRequest, ChatResponse } from "../types/recipeConfiguration";


export const generateRecipes = async (data: RecipeGenerationRequest): Promise<RecipeGenerationResponse | null> => {
    return await axiosApi<RecipeGenerationResponse>(API_ENDPOINTS.GENERATERECIPE, {
        method: "POST",
        data,
    });
};

export const chatRecipeConfiguration = async (data: ChatRequest): Promise<ChatResponse | null> => {
    return await axiosApi<ChatResponse>(API_ENDPOINTS.CHATRECIPECONFIGURATION, {
        method: "POST",
        data,
    });
};
