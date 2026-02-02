import axiosApi from '../../../lib/axiosApi';
import { API_ENDPOINTS } from '../../../config/endpoints';
import type { RecipeDetailsResponse } from '../types/recipeDetails';

interface GetRecipeDetailsParams {
    menu_name: string;
    cooking_time: string;
    image_url: string;
}

export const getRecipeDetails = async ({ menu_name, cooking_time, image_url }: GetRecipeDetailsParams) => {
    try {
        const response = await axiosApi<RecipeDetailsResponse>(API_ENDPOINTS.RECIPEDETAILS, {
            method: 'POST',
            data: {
                menu_name,
                cooking_time,
                image_url
            }
        });
        return response;
    } catch (error) {
        throw error;
    }
};
