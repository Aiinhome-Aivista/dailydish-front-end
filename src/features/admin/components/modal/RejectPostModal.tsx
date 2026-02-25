import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';
import type { AdminPost } from '../../api/adminPostService';

interface RejectPostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    post: AdminPost | null;
}

const RejectPostModal: React.FC<RejectPostModalProps> = ({ isOpen, onClose, onConfirm, post }) => {
    const [reason, setReason] = useState('');

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
                        className="relative w-full max-w-lg bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 rounded-[2.5rem] p-8 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/40 rounded-xl text-red-600">
                                    <AlertCircle size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#3e5035]">Reject Post</h3>
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
                                <p className="text-sm text-[#3e5035]/60 mb-1">Rejecting post:</p>
                                <p className="font-bold text-brand-accent">{post.menu_name}</p>
                                <p className="text-xs text-[#3e5035]/40 mt-1">By {post.username}</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[#3e5035]/60 uppercase tracking-widest ml-1">
                                    Rejection Reason
                                </label>
                                <textarea
                                    autoFocus
                                    className="w-full bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl py-4 px-6 focus:outline-none focus:border-red-500/50 transition-all h-32 text-sm text-[#3e5035] placeholder-[#3e5035]/30 resize-none shadow-inner"
                                    placeholder="Explain why this post is being rejected..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-4 bg-white/40 hover:bg-white/60 text-[#3e5035] rounded-2xl font-bold transition-all border border-white/30 text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => onConfirm(reason)}
                                    disabled={!reason.trim()}
                                    className="flex-1 py-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-lg active:scale-95 text-sm"
                                >
                                    Confirm Rejection
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RejectPostModal;
