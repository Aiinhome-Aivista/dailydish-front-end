import { useState } from 'react';
import { useAuth } from '../../features/auth/hooks/useAuth';
import LogOutModal from '../modal/pages/LogOutModal';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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
      <header className="w-full bg-brand-light flex items-center justify-between sticky top-0 z-30 py-4 px-6">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-brand-dark hover:bg-brand-light/50 rounded-lg md:hidden cursor-pointer"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button className="group flex items-center h-12 bg-brand-accent hover:bg-brand-dark rounded-full transition-all duration-500 ease-in-out max-w-[48px] hover:max-w-[200px] cursor-pointer overflow-hidden shadow-sm hover:shadow-md">
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[24px] text-brand-dark group-hover:text-white transition-colors duration-300">face_4</span>
            </div>
            <span className="text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-4">
              {user?.username || "User"}
            </span>
          </button>
            <button
            onClick={handleLogoutClick}
            className="group flex items-center h-12 bg-brand-accent hover:bg-brand-dark rounded-full transition-all duration-500 ease-in-out max-w-[48px] hover:max-w-[120px] cursor-pointer overflow-hidden shadow-sm hover:shadow-md"
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