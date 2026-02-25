import axiosApi from '../../../lib/axiosApi';
import { API_ENDPOINTS } from '../../../config/endpoints';
import type { CommunityPost } from '../../community/types/community';

export interface AdminPost extends Omit<CommunityPost, 'post_id'> {
    id: number;
    status: 'pending' | 'approved' | 'rejected';
}

export interface AdminPostsResponse {
    status: string;
    data: AdminPost[];
}

export const adminPostService = {
    getPosts: async (): Promise<AdminPostsResponse> => {
        try {
            const response = await axiosApi<AdminPostsResponse>(API_ENDPOINTS.ADMIN_PENDING_POST, {
                method: 'GET',
            });

            if (response && Array.isArray(response.data)) {
                // Map post_id to id for consistency in frontend and payloads
                response.data = response.data.map(post => ({
                    ...post,
                    id: (post as any).id || (post as any).post_id
                }));
            }

            return response || { status: 'error', data: [] };
        } catch (error) {
            console.error('Error fetching admin posts:', error);
            throw error;
        }
    },

    getRejectedPosts: async (): Promise<AdminPostsResponse> => {
        try {
            const response = await axiosApi<AdminPostsResponse>(API_ENDPOINTS.ADMIN_REJECTED_POST, {
                method: 'GET',
            });

            if (response && Array.isArray(response.data)) {
                response.data = response.data.map(post => ({
                    ...post,
                    id: (post as any).id || (post as any).post_id
                }));
            }

            return response || { status: 'error', data: [] };
        } catch (error) {
            console.error('Error fetching rejected posts:', error);
            throw error;
        }
    },

    getCommunityFeed: async (): Promise<AdminPostsResponse> => {
        try {
            const response = await axiosApi<AdminPostsResponse>(API_ENDPOINTS.GETCOMMUNITYFEED, {
                method: 'GET',
            });

            if (response && Array.isArray(response.data)) {
                // Map post_id to id for consistency in frontend and payloads
                response.data = response.data.map(post => ({
                    ...post,
                    id: (post as any).id || (post as any).post_id,
                    status: (post as any).status || 'approved' // Default to approved for community feed
                }));
            }

            return response || { status: 'error', data: [] };
        } catch (error) {
            console.error('Error fetching community feed:', error);
            throw error;
        }
    },

    approvePost: async (postId: number) => {
        try {
            return await axiosApi(API_ENDPOINTS.ADMIN_APPROVE_POST, {
                method: 'POST',
                data: { post_id: postId },
            });
        } catch (error) {
            console.error('Error approving post:', error);
            throw error;
        }
    },

    deletePost: async (postId: number) => {
        try {
            return await axiosApi(API_ENDPOINTS.ADMIN_DELETE_POST, {
                method: 'POST',
                data: { post_id: postId },
            });
        } catch (error) {
            console.error('Error deleting post:', error);
            throw error;
        }
    },

    updatePost: async (postId: number, data: Partial<AdminPost>) => {
        try {
            // Mocking update as it's not explicitly in the screenshots, but keeping structure
            console.warn('Update endpoint not explicitly defined. post_id:', postId, 'data:', data);
            return { status: 'success' };
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    },

    rejectPost: async (postId: number, reason: string) => {
        try {
            return await axiosApi(API_ENDPOINTS.ADMIN_REJECT_POST, {
                method: 'POST',
                data: {
                    post_id: postId,
                    reason: reason
                },
            });
        } catch (error) {
            console.error('Error rejecting post:', error);
            throw error;
        }
    }
};
