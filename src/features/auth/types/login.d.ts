export interface LoginPayload {
    email: string;
    password?: string;
}

export interface LoginResponse {
    message: string;
    status: string;
    token: string;
    user_id: string;
}
