import axiosApi from '../../../lib/axiosApi';
import { API_ENDPOINTS } from '../../../config/endpoints';
import type { CommunityFeedResponse } from '../types/community';

export const communityService = {
    getCommunityFeed: async () => {
        try {
            const response = await axiosApi<CommunityFeedResponse>(API_ENDPOINTS.GETCOMMUNITYFEED, {
                method: 'GET',
            });
            return response;
        } catch (error) {
            console.error('Error fetching community feed:', error);
            throw error;
        }
    },
};
