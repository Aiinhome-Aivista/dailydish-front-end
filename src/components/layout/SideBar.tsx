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
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium text-sm ${isActive
      ? 'bg-brand-light text-[#95B974] font-bold'
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
          fixed top-0 left-0 z-50 h-screen w-64 bg-brand-beige border-r border-[#95B974]
          transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block
        `}
      >


        {/* Navigation */}
        {/* Navigation */}
        <div className="flex-1 flex flex-col px-4 py-2 space-y-1 overflow-y-auto">
          {/* Top Section */}
          <div className="space-y-1">
            <NavItem
              icon="skillet"
              label="My Pantry"
              to="/pantry"
              isActive={currentPath === '/pantry'}
            />
            <NavItem
              icon="bookmark"
              label="Saved Recipes"
              to="/saved-recipes"
              isActive={currentPath === '/saved-recipes'}
            />
            <NavItem
              icon="calendar_month"
              label="Meal Plan"
              to="/meal-plan"
              isActive={currentPath === '/meal-plan'}
            />
          </div>

          {/* Bottom Section - Pushed to bottom */}
          <div className="mt-auto space-y-1 pb-4">
            <NavItem
              icon="help"
              label="How it Works"
              to="/how-it-works"
            />
            <NavItem
              icon="payments"
              label="Pricing"
              to="/pricing"
            />
            <NavItem
              icon="explore"
              label="Explore Recipes"
              to="/explore"
            />
            <NavItem
              icon="group"
              label="Community"
              to="/community"
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;