import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, User, Baby, GraduationCap } from 'lucide-react';
import type { SuitabilityModalProps } from '../types/suitability';

const SuitabilityModal: React.FC<SuitabilityModalProps> = ({ isOpen, onClose, category, reasons }) => {
    if (!category) return null;

    const getCategoryIcon = () => {
        switch (category) {
            case 'adult': return <User size={24} />;
            case 'child': return <Baby size={24} />;
            case 'senior': return <GraduationCap size={24} />;
            default: return <Info size={24} />;
        }
    };

    const getCategoryTitle = () => {
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    const getStatusColor = (text: string) => {
        if (text.toLowerCase().includes('not recommended')) return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (text.toLowerCase().includes('recommended with moderation')) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
        if (text.toLowerCase().includes('excellent') || text.toLowerCase().includes('good')) return 'text-brand-accent bg-brand-accent/10 border-brand-accent/20';
        return 'text-brand-dark bg-brand-dark/5 border-brand-dark/10';
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md  bg-[#CEDEBDB2]   backdrop-blur-lg rounded-4xl shadow-2xl  overflow-hidden max-h-[85vh] flex flex-col"
                    >
                        {/* Sticky Header */}
                        <div className="sticky top-0 z-20 h-28 bg-brand-accent flex items-center px-8 overflow-hidden shrink-0">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/5 rounded-full -ml-10 -mb-10 blur-2xl" />

                            <div className="flex items-center gap-4 z-10">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-accent shadow-lg">
                                    {getCategoryIcon()}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-tight">
                                        Suitability Analysis
                                    </h3>
                                    <p className="text-white/80 font-bold text-[10px] uppercase tracking-widest">
                                        Analysis for {getCategoryTitle()}s
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all cursor-pointer group"
                            >
                                <X size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Scrollable Content Area */}
                        <div className="overflow-y-auto p-8 custom-scrollbar">
                            <div className="space-y-3">
                                {reasons.map((reason, idx) => {
                                    const isSummary = reason.toLowerCase().includes('recommended');
                                    return (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + idx * 0.05 }}
                                            className={`p-4 rounded-2xl border ${isSummary ? getStatusColor(reason) : 'bg-white/40 border-brand-dark/5 shadow-sm'}`}
                                        >
                                            <div className="flex gap-3 items-start">
                                                {!isSummary && (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 shrink-0" />
                                                )}
                                                <p className={`text-sm leading-relaxed ${isSummary ? 'font-black uppercase tracking-wider text-center w-full' : 'font-bold text-brand-dark/70'}`}>
                                                    {reason}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                          
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuitabilityModal;
