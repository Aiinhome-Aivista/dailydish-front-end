import { useState } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import LogOutModal from '../modal/pages/LogOutModal';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  onMenuClick: () => void;
  className?: string;
  currentDate?: Date;
  viewMode?: 'week' | 'month';
  onPrev?: () => void;
  onNext?: () => void;
  onViewChange?: (mode: 'week' | 'month') => void;
  onToday?: () => void;
}

const Header = ({ onMenuClick, className = '', currentDate, viewMode, onPrev, onNext, onViewChange, onToday }: HeaderProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const isMealPlan = location.pathname === '/meal-plan';
  const isSharePage = location.pathname === '/share-masterpiece';

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
    navigate("/");
  };

  const handleCloseModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <header className={`w-full bg-brand-light flex items-center justify-between sticky top-0 z-30 py-4 px-6 ${className}`}>
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-brand-dark hover:bg-brand-light/50 rounded-lg md:hidden cursor-pointer"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {/* Meal Plan Controls - Only visible on /meal-plan */}
        {isMealPlan && (
          <div className="flex-1 flex flex-col md:flex-row items-center  gap-4 animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-4">
              <button
                onClick={onPrev}
                className="hover:bg-black/10 rounded-full p-1 transition-colors cursor-pointer"
              >
                <ChevronLeft size={20} className="text-brand-dark" />
              </button>
              <h2 className="text-xl font-bold text-brand-dark min-w-[150px] text-center">
                {currentDate?.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={onNext}
                className="hover:bg-black/10 rounded-full p-1 transition-colors cursor-pointer"
              >
                <ChevronRight size={20} className="text-brand-dark" />
              </button>
            </div>

            <motion.div layout className="flex bg-[#43533414] rounded-full p-1.5">
              {viewMode === 'week' ? (
                <>
                  <motion.button
                    layout
                    onClick={() => onViewChange?.('week')}
                    className="px-4 py-1.5 rounded-full text-sm font-bold bg-[#7A8F63] text-white shadow-md transition-all cursor-pointer"
                  >
                    Week
                  </motion.button>
                  <motion.button
                    layout
                    onClick={() => onViewChange?.('month')}
                    className="px-4 py-1.5 rounded-full text-sm font-bold text-[#3e5035] hover:bg-black/5 transition-all cursor-pointer"
                  >
                    Month
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button
                    layout
                    onClick={() => onViewChange?.('month')}
                    className="px-4 py-1.5 rounded-full text-sm font-bold bg-[#7A8F63] text-white shadow-md transition-all cursor-pointer"
                  >
                    Month
                  </motion.button>
                  <motion.button
                    layout
                    onClick={() => onViewChange?.('week')}
                    className="px-4 py-1.5 rounded-full text-sm font-bold text-[#3e5035] hover:bg-black/5 transition-all cursor-pointer"
                  >
                    Week
                  </motion.button>
                </>
              )}
            </motion.div>
            <div className='flex justify-end flex-1 pr-4'>
              <button
                onClick={onToday}
                className="hidden md:flex items-center gap-2 border border-brand-dark cursor-pointer text-[#3e5035] px-4 py-1.5 rounded-full text-sm font-bold transition-colors"
              >
                <span className="bg-[#7A8F63] text-brand-dark p-2 text-xs rounded-full">{new Date().getDate()}</span>
                Today
              </button>
            </div>


          </div>
        )}
        {isSharePage && (
          <div className="flex-1 flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <h2 className="text-xl font-bold text-brand-dark cursor-pointer" onClick={() => navigate("/meal-plan")}>Share Your Masterpiece</h2>
            <p className=' text-xs font-medium text-brand-dark'>Inspire the community with your culinary creation.</p>
          </div>
        )}


        <div className="flex items-center gap-4">

          <button className="hidden md:flex group items-center h-12 bg-brand-accent hover:bg-brand-dark rounded-full transition-all duration-500 ease-in-out max-w-12 hover:max-w-50 cursor-pointer overflow-hidden shadow-sm hover:shadow-md">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px] text-brand-dark group-hover:text-white transition-colors duration-300">face</span>
            </div>

            <span className="text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-4">
              {user?.username || "User"}
            </span>
          </button>

          <button
            onClick={handleLogoutClick}
            className="group flex items-center h-12 bg-brand-accent hover:bg-brand-dark rounded-full transition-all duration-500 ease-in-out max-w-12 hover:max-w-30 cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
          >
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px] text-brand-dark group-hover:text-white transition-colors">logout</span>
            </div>
            <span className="text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-4">
              Logout
            </span>
          </button>
        </div>
      </header>

      <LogOutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};


export default Header;