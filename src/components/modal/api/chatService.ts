import { chatRecipeConfiguration } from '../../../features/pantry/api/recipeConfigurationService';
import type { ChatMessage, CollectedData } from '../../../features/pantry/types/recipeConfigurationChat';

type ChatServiceParams = {
    userId: string;
    message: string;
    chatHistory: ChatMessage[];
    collectedData: CollectedData;
};

export const sendChatMessage = async ({ userId, message, chatHistory, collectedData }: ChatServiceParams) => {
    return await chatRecipeConfiguration({
        user_id: userId,
        message,
        chat_history: chatHistory,
        collected_data: collectedData
    });
};
