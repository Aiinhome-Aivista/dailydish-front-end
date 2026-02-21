export interface ShareToCommunityRequest {
    meal_id: number;
    rating: number;
    comment: string;
    image: File;
}

export interface ShareToCommunityResponse {
    status: string;
    message: string;
    data?: any;
}
