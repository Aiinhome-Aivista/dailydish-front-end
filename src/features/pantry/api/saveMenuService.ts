import axiosApi from '../../../lib/axiosApi';
import { API_ENDPOINTS } from '../../../config/endpoints';
import type { SavedMenuResponse, SaveRecipeRequest, SaveRecipeResponse } from '../types/saveMenu';
import type { SaveMealRequest, SaveMealResponse, GetSavedMealResponse } from '../types/saveMeal';
import type { RecipeUpdateServingsRequest, RecipeUpdateServingsResponse } from '../types/recipeDetails';

export const pantryService = {
    saveMenu: async (data: SaveRecipeRequest) => {
        try {
            const response = await axiosApi<SaveRecipeResponse>(API_ENDPOINTS.SAVEMENU, {
                method: 'POST',
                data
            });
            return response;
        } catch (error) {
            console.error('Error saving menu:', error);
            throw error;
        }
    },
    getSavedMenus: async () => {
        try {
            const response = await axiosApi<SavedMenuResponse>(API_ENDPOINTS.GETSAVEDMENU, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching saved menus:', error);
            throw error;
        }
    },
    saveMeal: async (data: SaveMealRequest) => {
        try {
            const response = await axiosApi<SaveMealResponse>(API_ENDPOINTS.SAVEMEAL, {
                method: 'POST',
                data
            });
            return response;
        } catch (error) {
            console.error('Error saving meal:', error);
            throw error;
        }
    },
    getSavedMeal: async () => {
        try {
            const response = await axiosApi<GetSavedMealResponse>(API_ENDPOINTS.GETSAVEDMEAL, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching saved meal:', error);
            throw error;
        }
    },
    deleteMenu: async (data: { menu_name: string }) => {
        try {
            const response = await axiosApi<{ status: string; message: string }>(API_ENDPOINTS.DELETESAVEDRECIPE, {
                method: 'POST',
                data
            });
            return response;
        } catch (error) {
            console.error('Error deleting menu:', error);
            throw error;
        }
    },
    deleteMeal: async (data: { menu_name: string }) => {
        try {
            const response = await axiosApi<{ status: string; message: string }>(API_ENDPOINTS.DELETESAVEDMEAL, {
                method: 'POST',
                data
            });
            return response;
        } catch (error) {
            console.error('Error deleting meal:', error);
            throw error;
        }
    },
    updateServings: async (data: RecipeUpdateServingsRequest) => {
        try {
            const response = await axiosApi<RecipeUpdateServingsResponse>(API_ENDPOINTS.RECIPEUPDATESERVINGS, {
                method: 'POST',
                data
            });
            return response;
        } catch (error) {
            console.error('Error updating servings:', error);
            throw error;
        }
    },
};