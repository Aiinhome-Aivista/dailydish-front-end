import { chatRecipeConfiguration } from './recipeConfigurationService';
import type { ChatRequest } from '../types/recipeConfigurationChat';
import type { GeneratedRecipe } from '../types/aiCuratedMenu';

export const fetchAiRecipes = async (chatContext: ChatRequest): Promise<GeneratedRecipe[]> => {
    try {
        const response = await chatRecipeConfiguration(chatContext);
        if (response && response.status === 'success') {
            const respData = response.data as any;
            // Handle different possible response structures
            const generatedRecipes: GeneratedRecipe[] = respData?.recipes || respData?.data?.recipes || [];
            return generatedRecipes;
        }
        return [];
    } catch (error) {
        console.error("Fetch recipes error", error);
        throw error;
    }
};
