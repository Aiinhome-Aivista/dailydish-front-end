import React from 'react';
import { Sparkles } from 'lucide-react';
import cookerIcon from '../../../assets/cooker.svg';

const LandingHero = () => {
    return (
        <div className="flex flex-col items-center pt-16 pb-24 px-4">
            <div className="mb-6 animate-bounce-slow">
                <img src={cookerIcon} alt="Bowl" className="w-24 h-24" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-center text-brand-dark mb-6 leading-tight">
                Turn Your Fridge<br />
                <span className="text-brand-dark">Into a Feast.</span>
            </h1>
            <p className="text-brand-dark/70 text-center text-lg md:text-xl max-w-2xl mb-12">
                Enter your ingredients and let our AI craft the perfect recipe tailored to your cuisine preference and nutritional needs.
            </p>

            <div className="w-full max-w-2xl relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <input
                    type="text"
                    placeholder="Enter Ingredients (e.g. Tomato, Garlic, Chicken...)"
                    className="w-full pl-12 pr-32 py-4 bg-brand-light/30 border border-brand-dark/10 rounded-lg text-brand-dark placeholder:text-brand-dark/40 focus:outline-none focus:ring-2 focus:ring-brand-dark/20 backdrop-blur-sm"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-brand-light text-white px-6 rounded-md font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all">
                    Generate <Sparkles size={16} />
                </button>
            </div>
        </div>
    );
};

export default LandingHero;
