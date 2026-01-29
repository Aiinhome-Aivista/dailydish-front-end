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
  isActive,
  isCollapsed
}: {
  icon: string,
  label: string,
  to: string,
  isActive?: boolean,
  isCollapsed: boolean
}) => (
  <Link
    to={to}
    className={`relative group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${isActive
      ? 'bg-[#CEDEBD36] text-brand-accent border border-brand-light'
      : 'text-[#95B974] hover:bg-brand-light/50 hover:text-brand-dark '
      } ${isCollapsed ? 'justify-center px-2' : ''}`}
  >
    <span className="material-symbols-outlined text-[24px]">{icon}</span>
    {!isCollapsed && <span className="whitespace-nowrap overflow-hidden transition-all duration-300">{label}</span>}
    {isCollapsed && (
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-[#435334] text-[#F5F9ED] text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none shadow-lg border border-[#CEDEBD]/20">
        {label}
        {/* Arrow */}
        <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-[#435334]"></div>
      </div>
    )}
  </Link>
);

const SideBar = ({ isOpen, onClose }: SideBarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = React.useState(true);

  // Default to My Pantry being active if path is / or /pantry
  const isPantryActive = ['/recipe-configuration-chat', '/ai-menu', '/recipe-details'].includes(currentPath) || currentPath === '/';

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
          fixed top-0 left-0 z-50 h-full bg-brand-beige border-r border-[#95B974]
          transition-all duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-20' : 'w-60'}
          md:translate-x-0 md:static md:block
        `}
      >
        {/* Logo and Title */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 h-20 bg-[#CEDEBD] shrink-0 transition-all`}>
          <div className="flex items-center gap-3">
            <img src={Logo} alt="DailyDish Logo" className="w-10 h-10 object-contain" />
            {!isCollapsed && <h1 className="text-[#435334] text-xl font-bold whitespace-nowrap overflow-hidden">DailyDish</h1>}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`hidden md:block p-1  transition-colors text-[#435334] ${isCollapsed ? 'absolute -right-2  text-brand-dark top-8  cursor-pointer' : ''}`}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <span className="material-symbols-outlined text-sm block cursor-pointer text-brand-accent">
              {isCollapsed ? 'chevron_right' : 'chevron_left'}
            </span>
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col px-4 py-2">
          {/* Top Section - scrollable nav */}
          <div className={`flex-1 space-y-1 ${isCollapsed ? 'overflow-visible' : 'overflow-y-auto'}`}>
            <NavItem
              icon="award_meal"
              label="My Dish"
              to="/recipe-configuration-chat"
              isActive={isPantryActive}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon="dine_heart"
              label="Saved Recipes"
              to="/saved-recipes"
              isActive={currentPath === '/saved-recipes'}
              isCollapsed={isCollapsed}
            />
            <NavItem
              icon="kitchen"
              label="Meal Plan"
              to="/meal-plan"
              isActive={currentPath === '/meal-plan'}
              isCollapsed={isCollapsed}
            />
          </div>

          {/* Bottom Section */}
          <div className={`mt-80 space-y-2 p-4 ${isCollapsed ? 'items-center flex flex-col' : ''}`}>
            <a href="#" className={`flex items-center gap-3 text-brand-dark rounded-xl hover:bg-brand-light/50 ${isCollapsed ? 'justify-center w-full p-2' : ''}`} title="How it works">
              {isCollapsed && <span className="material-symbols-outlined">help</span>}
              {!isCollapsed && <span>How it works</span>}
            </a>
            <a href="#" className={`flex items-center gap-3 text-brand-dark rounded-xl hover:bg-brand-light/50 ${isCollapsed ? 'justify-center w-full p-2' : ''}`} title="Pricing">
              {isCollapsed && <span className="material-symbols-outlined">payments</span>}
              {!isCollapsed && <span>Pricing</span>}
            </a>
            <a href="#" className={`flex items-center gap-3 text-brand-dark rounded-xl hover:bg-brand-light/50 ${isCollapsed ? 'justify-center w-full p-2' : ''}`} title="Explore recipes">
              {isCollapsed && <span className="material-symbols-outlined">explore</span>}
              {!isCollapsed && <span>Explore recipes</span>}
            </a>
            <a href="#" className={`flex items-center gap-3 text-brand-dark rounded-xl hover:bg-brand-light/50 ${isCollapsed ? 'justify-center w-full p-2' : ''}`} title="Community">
              {isCollapsed && <span className="material-symbols-outlined">group</span>}
              {!isCollapsed && <span>Community</span>}
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;