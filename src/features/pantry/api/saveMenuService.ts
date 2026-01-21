import axiosApi from '../../../lib/axiosApi';
import { API_ENDPOINTS } from '../../../config/endpoints';
import type { SavedMenuResponse, SaveRecipeRequest, SaveRecipeResponse } from '../types/saveMenu';

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
};