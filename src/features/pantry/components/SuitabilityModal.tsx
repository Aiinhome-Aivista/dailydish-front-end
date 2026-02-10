import React, { useEffect, useState } from 'react';
import { X, Info } from 'lucide-react';

interface SuitabilityModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    reasons: string[];
}

const SuitabilityModal: React.FC<SuitabilityModalProps> = ({
    isOpen,
    onClose,
    title,
    reasons,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`
            relative w-full max-w-lg bg-[#FBF6E9] rounded-3xl shadow-2xl 
            transform transition-all duration-300 overflow-hidden
            border border-[#4A5D3B]/10
            ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
        `}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#4A5D3B]/10">
                    <div className="flex items-center gap-3 text-[#4A5D3B]">
                        <div className="p-2 bg-brand-beige rounded-full border border-[#4A5D3B]/10">
                            <Info className="w-5 h-5 text-brand-accent" />
                        </div>
                        <h3 className="text-xl font-bold capitalize">{title} Suitability Analysis</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-[#7A8F63] hover:text-[#4A5D3B] hover:bg-[#4A5D3B]/5 rounded-full transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {reasons && reasons.length > 0 ? (
                        <div className="space-y-4">
                            {reasons.map((reason, idx) => {
                                const isPositive = reason.includes("adds") || reason.includes("Good") || reason.includes("Excellent");
                                const isNegative = reason.includes("reduces") || reason.includes("High fat") || reason.includes("Not Recommended");

                                // Unified styling for all cards - no orange, consistent brand colors
                                const bgColor = "bg-[#F4F9F1]";
                                const borderColor = "border-[#95B974]/30";
                                const textColor = "text-[#4A5D23]";
                                const iconColor = "text-[#7A8F63]"; // Consistent Green Accent for icons
                                const iconBg = "bg-[#CEDEBD]"; // Consistent Green Light for icon bg

                                return (
                                    <div key={idx} className={`relative flex gap-4 p-4 rounded-2xl border ${borderColor} ${bgColor} transition-transform hover:scale-[1.01] hover:shadow-sm`}>
                                        <div className="shrink-0 pt-0.5">
                                            <div className={`w-6 h-6 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}>
                                                {isPositive ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                ) : isNegative ? (
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full bg-current" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm font-medium leading-relaxed ${textColor}`}>
                                                {reason}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
                            <Info className="w-12 h-12 text-[#A4B592] mb-3" />
                            <p className="text-[#7A8F63] font-medium">No specific analysis details available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuitabilityModal;
