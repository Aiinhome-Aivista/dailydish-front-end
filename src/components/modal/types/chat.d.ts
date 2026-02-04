import React from 'react';

export type Message = {
    id: string;
    sender: 'bot' | 'user';
    content: React.ReactNode;
    type?: 'text' | 'cuisine-selector' | 'details-selector' | 'final-action' | 'meal-type-selector' | 'ingredient-qty-selector';
};

export type RecipeState = {
    ingredients: string[];
    cuisine: string | null;
    cookingTime: string | null;
    servings: number;
    mealType: string | null;
};
