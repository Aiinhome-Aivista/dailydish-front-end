export interface SignUpPayload {
    username?: string; 
    email: string;
    password?: string;
    confirm_password?: string;
}

export interface SignUpResponse {
    message: string;
    status: string;
    user_id: string;
}