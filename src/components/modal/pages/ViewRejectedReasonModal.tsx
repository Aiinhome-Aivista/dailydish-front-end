import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info } from 'lucide-react';
import type { CommunityPost } from '../../../features/community/types/community';

interface ViewRejectedReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: CommunityPost | null;
}

const ViewRejectedReasonModal: React.FC<ViewRejectedReasonModalProps> = ({ isOpen, onClose, post }) => {
    if (!post) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-[#CEDEBDB2] backdrop-blur-xl  rounded-4xl p-8 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/40 rounded-xl text-red-600">
                                    <Info size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#3e5035]">Rejection Reason</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full text-[#3e5035]/40 hover:text-[#3e5035] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/30 shadow-sm">
                                <p className="text-sm text-[#3e5035]/60 mb-1">Recipe Name:</p>
                                <p className="font-bold text-brand-accent">{post.menu_name}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#3e5035]/60 uppercase tracking-widest ml-1">
                                    Feedback from Admin
                                </label>
                                <div className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl py-6 px-8 min-h-[120px] max-h-[200px] overflow-y-auto custom-scrollbar text-sm text-[#3e5035] leading-relaxed italic shadow-inner">
                                    "{(post as any).rejected_reason || 'No specific reason provided by the administrator.'}"
                                </div>
                            </div>


                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ViewRejectedReasonModal;
