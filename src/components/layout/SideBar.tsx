import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Logo from '../../assets/cooker.svg';

interface SideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const NavItem = ({
  icon,
  label,
  to,
  isActive
}: {
  icon: string,
  label: string,
  to: string,
  isActive?: boolean
}) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-bold text-sm ${isActive
      ? 'bg-brand-light text-brand-accent'
      : 'text-[#95B974] hover:bg-brand-light/50 hover:text-brand-dark '
      }`}
  >
    <span className="material-symbols-outlined text-[20px]">{icon}</span>
    <span>{label}</span>
  </Link>
);

const SideBar = ({ isOpen, onClose }: SideBarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-60 bg-brand-beige border-r border-[#95B974]
          transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block
        `}
      >
        {/* Logo and Title - Matches Header Background */}
        <div className="flex items-center gap-4 px-6 h-20 bg-[#CEDEBD] shrink-0">
          <img src={Logo} alt="DailyDish Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-[#435334] text-xl font-bold">DailyDish</h1>
        </div>
        {/* Navigation */}
        <div className="flex-1 flex flex-col px-4 py-2">
          {/* Top Section - scrollable nav */}
          <div className="flex-1 space-y-1 overflow-y-auto ">
            <NavItem
              icon="award_meal"
              label="My Pantry"
              to="/pantry"
              isActive={currentPath === '/pantry'}
            />
            <NavItem
              icon="dine_heart"
              label="Saved Recipes"
              to="/saved-recipes"
              isActive={currentPath === '/saved-recipes'}
            />
            <NavItem
              icon="kitchen"
              label="Meal Plan"
              to="/meal-plan"
              isActive={currentPath === '/meal-plan'}
            />
          </div>

          {/* Bottom Section - stays pinned */}
          <div className="mt-80 space-y-2 p-4">
            <a href="#" className="flex items-center gap-3 text-brand-dark">How it works</a>
            <a href="#" className="flex items-center gap-3 text-brand-dark">Pricing</a>
            <a href="#" className="flex items-center gap-3 text-brand-dark">Explore recipes</a>
            <a href="#" className="flex items-center gap-3 text-brand-dark">Community</a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;