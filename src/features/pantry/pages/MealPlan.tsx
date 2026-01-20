import React from 'react';
import { useNavigate } from 'react-router-dom';


const MealPlan: React.FC<{
    title?: string;
    message?: string;
}> = ({
    title = "Under Development",
    message = "We're cooking up something special! This feature is currently in the oven and will be ready to serve soon."
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center p-6">
            <div className="bg-[#CEDEBD] p-8 rounded-full mb-6 shadow-sm animate-pulse">
                <span className="material-symbols-outlined text-6xl text-[#435334]">
                    construction
                </span>
            </div>
            <h2 className="text-3xl font-bold text-[#435334] mb-3">{title}</h2>
            <p className="text-[#7A8F63] font-medium max-w-md mb-8 text-lg">
                {message}
            </p>
            <button
                onClick={() => navigate(-1)}
                className="px-8 py-3 bg-[#435334] text-[#FAF1E4] rounded-xl hover:bg-[#2d3823] transition-all font-bold flex items-center gap-2 cursor-pointer"
            >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Go Back
            </button>
        </div>
    );
};

export default MealPlan;