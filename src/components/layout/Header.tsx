import { useAuth } from '../../features/auth/hooks/useAuth';
import Logo from '../../assets/cooker.svg';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { logout } = useAuth();

  return (
    <header className="h-20 w-full px-6 bg-[#CEDEBD] flex items-center justify-between sticky top-0 z-30 md:static">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 text-brand-dark hover:bg-brand-light/50 rounded-lg md:hidden"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
              {/* Logo and Title */}
        <div className="flex items-center gap-4 px-6 h-20">
          <img src={Logo} alt="DailyDish Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-[#435334] text-xl font-bold">DailyDish</h1>
        </div>

      <div className="flex items-center gap-4">
      

        <button className="w-12 h-12 rounded-full bg-[#95B974] flex items-center justify-center hover:bg-[#435334] hover:text-white transition-colors group">
          <span className="material-symbols-outlined text-[20px] text-[#435334] group-hover:text-white transition-colors">face_4</span>
        </button>
          <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#95B974] text-[#435334] hover:bg-[#435334] hover:text-white transition-colors font-medium cursor-pointer hover:logout"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          
        </button>
      </div>
    </header>
  );
};

export default Header;