import axiosApi from '../../../lib/axiosApi';
import { API_ENDPOINTS } from '../../../config/endpoints';
import type { LoginPayload, LoginResponse } from '../types/login';
import type { SignUpPayload, SignUpResponse } from '../types/signUp';


export const authService = {
    login: async (credentials: LoginPayload): Promise<LoginResponse | null> => {
        return await axiosApi<LoginResponse>(API_ENDPOINTS.LOGIN, {
            method: 'POST',
            data: credentials,
        });
    },

    register: async (userData: SignUpPayload): Promise<SignUpResponse | null> => {
        return await axiosApi<SignUpResponse>(API_ENDPOINTS.REGISTER, {
            method: 'POST',
            data: userData,
        });
    },
};
