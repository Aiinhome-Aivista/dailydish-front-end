import React from 'react';
import { useNavigate } from 'react-router-dom';

interface MaterialIconProps {
    iconName: string;
}

const MaterialIcon: React.FC<MaterialIconProps> = ({ iconName }) => (
    <span className="material-symbols-outlined text-xl text-[#FAF1E4]">
        {iconName}
    </span>
);

const features = [
    {
        title: 'Nutritional Scoring',
        description: 'Every recipe comes with a dynamic Nutri-Score and full macro-nutrient breakdown (Proteins, Carbs, Fats)',
        iconName: 'nutrition',
        link: '/nutritional-scoring',
    },
    {
        title: 'Dr. Foodie Assistant',
        description: 'The more you cook, the better Dr. Foodie learns your taste preferences, dislikes, and dietary needs.',
        iconName: 'psychology_alt',
        link: '/ai-personalization',
    },
    {
        title: 'Speed & Efficiency',
        description: 'Get delicious meal ideas in seconds, optimized for the time you have available and minimal waste.',
        iconName: 'psychiatry',
        link: '/speed-efficiency',
    }
];

const LandingFeatures = () => {
    const navigate = useNavigate();
    return (
        <div className="py-20 px-6 md:px-12 bg-brand-light">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-brand-light mb-4">
                    <span className="text-brand-accent">Why Cook with Dr. Foodie?</span>
                </h2>
                <p className="text-center text-brand-dark max-w-xl mx-auto mb-16 font-medium">
                    Our smart generator considers everything from your pantry inventory to your specific long-term health goals.
                </p>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} onClick={() => navigate(feature.link)} className="p-6 rounded-2xl border border-[#4353343D] bg-[#43533414] hover:bg-brand-light/30 transition-colors cursor-pointer">
                            <div className="w-10 h-10 bg-brand-accent rounded-lg flex items-center justify-center mb-4">
                                <MaterialIcon iconName={feature.iconName} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-2">{feature.title}</h3>
                            <p className="text-brand-dark text-sm leading-relaxed font-medium">
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
