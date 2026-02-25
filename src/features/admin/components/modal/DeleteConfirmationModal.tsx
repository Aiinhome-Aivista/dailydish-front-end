import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import type { AdminPost } from '../../api/adminPostService';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    post: AdminPost | null;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, post }) => {
    if (!post) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-8 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3 text-red-600">
                                <Trash2 size={24} />
                                <h3 className="text-2xl font-bold">Delete Post</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-full text-[#3e5035]/40 hover:text-[#3e5035] transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
                                <p className="text-sm text-[#3e5035]/80 leading-relaxed">
                                    Are you sure you want to delete <span className="text-[#3e5035] font-bold">"{post.menu_name}"</span>? This action cannot be undone and will permanently remove the post from the community feed.
                                </p>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-white/40 hover:bg-white/60 text-[#3e5035] rounded-2xl font-bold transition-all border border-white/30 text-sm"
                                >
                                    No, Keep it
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 text-sm flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmationModal;
