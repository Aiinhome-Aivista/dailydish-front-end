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
    const loopedFeatures = [...features, ...features, ...features, ...features];

    return (
        <div className="py-20 bg-brand-light overflow-hidden">
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-25%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                .mask-gradient {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <h2 className="text-4xl md:text-5xl font-bold text-center text-brand-light mb-4 scroll-animate">
                    <span className="text-brand-accent">Why Cook with Dr. Foodie?</span>
                </h2>
                <p className="text-center text-brand-dark max-w-xl mx-auto mb-16 font-medium scroll-animate delay-1">
                    Our smart generator considers everything from your pantry inventory to your specific long-term health goals.
                </p>
            </div>

            <div className="relative w-full overflow-hidden mask-gradient">
                <div className="flex gap-8 w-max animate-scroll px-4">
                    {loopedFeatures.map((feature, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(feature.link)}
                            className="p-8 rounded-2xl border border-[#4353343D] bg-[#43533414]  transition-all duration-300 cursor-pointer min-w-[300px] w-[300px] md:w-[380px] group shadow-sm hover:shadow-md"
                        >
                            <div className="w-12 h-12 bg-brand-accent rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                                <MaterialIcon iconName={feature.iconName} />
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-3">{feature.title}</h3>
                            <p className="text-brand-dark/80 text-sm leading-relaxed font-medium">
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
