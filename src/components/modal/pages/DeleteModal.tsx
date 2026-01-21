import React, { useEffect, useState } from 'react';
import { Loader2, X, AlertTriangle } from 'lucide-react';
import  type { DeleteModalProps } from '../types/delete';




const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  description,
  isLoading = false,
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
        onClick={isLoading ? undefined : onClose}
      />

      {/* Modal Content */}
      <div
        className={`
                    relative w-full max-w-md bg-[#FBF6E9] rounded-3xl shadow-2xl 
                    transform transition-all duration-300 overflow-hidden
                    border border-[#4A5D3B]/10
                    ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}
                `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#4A5D3B]/10">
          <div className="flex items-center gap-3 text-[#4A5D3B]">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 text-[#7A8F63] hover:text-[#4A5D3B] hover:bg-[#4A5D3B]/5 rounded-full transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-lg font-medium text-[#4A5D3B] mb-2">
            {message}
          </p>
          {description && (
            <p className="text-sm text-[#7A8F63] leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-[#4A5D3B] bg-[#4A5D3B]/5 hover:bg-[#4A5D3B]/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-3 rounded-xl font-bold text-[#FBF6E9] bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;