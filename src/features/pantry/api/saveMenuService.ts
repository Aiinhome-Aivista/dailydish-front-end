import axiosApi from '../../../lib/axiosApi';
import { API_ENDPOINTS } from '../../../config/endpoints';
import type { SavedMenuResponse } from '../types/saveMenu';

export const pantryService = {
    getSavedMenus: async () => {
        try {
            const response = await axiosApi<SavedMenuResponse>(API_ENDPOINTS.SAVEMENU, {
                method: 'POST',
            });
            return response;
        } catch (error) {
            console.error('Error fetching saved menus:', error);
            throw error;
        }
    },
};