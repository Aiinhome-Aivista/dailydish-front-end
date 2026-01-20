import React from 'react';
import { useNavigate } from 'react-router-dom';


const MealPlan: React.FC<{
    title?: string;
    message?: string;
}> = ({
    title = "Under Development",
}) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[80vh] text-center p-6">
            <div className="bg-[#CEDEBD] p-8 rounded-full mb-6 shadow-sm animate-pulse">
                <span className="material-symbols-outlined text-6xl text-[#435334]">
                    construction
                </span>
            </div>
            <h2 className="text-3xl font-bold text-[#435334] mb-3">{title}</h2>
        </div>
    );
};

export default MealPlan;