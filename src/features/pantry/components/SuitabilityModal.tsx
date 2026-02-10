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
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {reasons && reasons.length > 0 ? (
                        <ul className="space-y-3">
                            {reasons.map((reason, idx) => {
                                // Simple logic to color code based on content if needed, e.g. "adds", "reduces"
                                const isPositive = reason.includes("adds") || reason.includes("Good") || reason.includes("Excellent");
                                const isNegative = reason.includes("reduces") || reason.includes("High fat") || reason.includes("Not Recommended");

                                let iconColor = "text-brand-accent"; // default
                                if (reason.toLowerCase().includes("not recommended")) iconColor = "text-red-500";

                                return (
                                    <li key={idx} className="flex gap-3 text-[#4A5D3B] text-sm leading-relaxed bg-white/50 p-3 rounded-xl border border-[#4A5D3B]/5">
                                        <span className={`mt-0.5 shrink-0 ${iconColor}`}>•</span>
                                        <span>{reason}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-[#7A8F63] italic">No specific analysis details available.</p>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 pt-2 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl font-bold text-brand-beige bg-brand-accent hover:bg-[#687a54] transition-colors cursor-pointer"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuitabilityModal;
