import React from 'react';
import { Apple, Brain, Zap } from 'lucide-react';
import type { Feature } from '../types';

const features: Feature[] = [
    {
        title: 'Nutritional Scoring',
        description: 'Every recipe comes with a dynamic Nutri-Score and full macro-nutrient breakdown (Proteins, Carbs, Fats)',
        icon: Apple,
    },
    {
        title: 'AI Personalization',
        description: 'The more you cook, the better the AI understands your flavor profile, dislikes, and dietary restrictions.',
        icon: Brain,
    },
    {
        title: 'Speed & Efficiency',
        description: 'Get delicious meal ideas in seconds, optimized for the time you have available and minimal waste.',
        icon: Zap,
    }
];

const LandingFeatures = () => {
    return (
        <div className="py-20 px-6 md:px-12 bg-[#CEDEBD]">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-brand-light mb-4">
                    <span className="text-[#95B974]">Why Cook with AI?</span>
                </h2>
                <p className="text-center text-brand-dark/70 max-w-2xl mx-auto mb-16">
                    Our smart generator considers everything from your pantry inventory to your specific long-term health goals.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="p-8 rounded-2xl border border-[#4353343D] bg-brand-light/20 hover:bg-brand-light/30 transition-colors">
                            <div className="w-10 h-10 bg-brand-accent/20 rounded-lg flex items-center justify-center text-brand-dark mb-6">
                                <feature.icon size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                            <p className="text-brand-dark/70 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LandingFeatures;
