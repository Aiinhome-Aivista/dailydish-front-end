export interface CaptchaResponse {
    captcha_id: string;
    captcha_image: string; // Base64 encoded image or URL
    status: string;
}
