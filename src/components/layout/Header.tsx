import Logo from '../../assets/cooker.svg';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
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

        {/* Logo and Title */}
        <div className="flex items-center gap-4 relative group">
          <img src={Logo} alt="DailyDish Logo" className="w-12 h-12 object-contain" />
          <h1 className="text-[#435334] text-2xl font-bold">DailyDish</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">


        <button className="w-12 h-12 rounded-full bg-[#95B974] flex items-center justify-center hover:bg-brand-dark/90 transition-colors">
          <span className="material-symbols-outlined text-[20px] text-[#435334]">face_4</span>
        </button>
      </div>
    </header>
  );
};

export default Header;