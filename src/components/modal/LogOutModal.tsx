import React from 'react';

interface LogOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogOutModal: React.FC<LogOutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-brand-beige rounded-2xl w-full max-w-md p-6 shadow-xl border border-brand-dark/10 transform transition-all scale-100 opacity-100 h-65">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-brand-light rounded-full flex items-center justify-center mb-4 text-brand-dark">
            <span className="material-symbols-outlined text-2xl">logout</span>
          </div>

          <h3 className="text-xl font-bold text-brand-dark mb-2">
            Confirm Logout
          </h3>

          <p className="text-[#7A8F63] text-sm mb-6">
            Are you sure you want to log out? <br />
            You will need to sign in again to access your pantry.
          </p>

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-brand-dark/20 text-brand-dark font-semibold text-sm hover:bg-brand-light/20 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-lg bg-brand-accent text-brand-dark font-bold text-sm hover:bg-brand-dark hover:text-white transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogOutModal;
