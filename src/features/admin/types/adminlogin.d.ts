export interface AdminLoginPayload {
    email: string;
    password: string;
    captcha: string;
    captcha_id?: string;
}

export interface AdminLoginResponse {
    admin_id: string;
    message: string;
    role: string;
    status: 'success' | 'error';
    token: string;
    username: string;
}
