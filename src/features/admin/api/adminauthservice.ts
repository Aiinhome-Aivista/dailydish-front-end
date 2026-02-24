import axiosApi from '../../../lib/axiosApi';
import { API_ENDPOINTS } from '../../../config/endpoints';
import type { AdminLoginPayload, AdminLoginResponse } from '../types/adminlogin';

export const adminAuthService = {
    login: async (credentials: AdminLoginPayload): Promise<AdminLoginResponse | null> => {
        return await axiosApi<AdminLoginResponse>(API_ENDPOINTS.ADMINLOGIN, {
            method: 'POST',
            data: credentials,
        });
    }
};
