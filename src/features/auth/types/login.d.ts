export interface LoginPayload {
    email: string;
    password?: string;
    captcha?: string;
    captcha_id?: string;
}

export interface LoginResponse {
    message: string;
    status: string;
    token: string;
    user_id: string;
    username: string;
}
