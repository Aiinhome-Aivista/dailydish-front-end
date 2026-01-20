import { useState } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import Logo from '../../assets/cooker.svg';
import LogOutModal from '../modal/LogOutModal';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    logout();
  };

  const handleCloseModal = () => {
    setIsLogoutModalOpen(false);
  };

  return (
    <>
      <header className="w-full bg-[#CEDEBD] flex items-center justify-between sticky top-0 z-30 py-4 px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-brand-dark hover:bg-brand-light/50 rounded-lg md:hidden"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="w-12 h-12 rounded-full bg-[#95B974] flex items-center justify-center hover:bg-[#435334] hover:text-white transition-colors group">
            <span className="material-symbols-outlined text-[20px] text-[#435334] group-hover:text-white transition-colors">face_4</span>
          </button>
          <button
            onClick={handleLogoutClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#95B974] text-[#435334] hover:bg-[#435334] hover:text-white transition-colors font-medium cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
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