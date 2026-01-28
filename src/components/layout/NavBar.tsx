import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import cookerIcon from '../../assets/cooker.svg';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavBarProps {
    onLoginClick?: () => void;
    onSignUpClick?: () => void;
}

const NavBar = ({ onLoginClick, onSignUpClick }: NavBarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginClick = () => {
        if (onLoginClick) {
            onLoginClick();
        } else {
            navigate("/login");
        }
    };

    const handleSignUpClick = () => {
        if (onSignUpClick) {
            onSignUpClick();
        } else {
            navigate("/signup");
        }
    };

    return (
        <nav className="w-full py-3 px-5 md:px-12 flex justify-between items-center bg-[#CEDEBD] relative z-50 sticky top-0">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <img src={cookerIcon} alt="DailyDish Logo" className="w-8 h-8" />
                <span className="text-[#435334] font-bold text-xl">DailyDish</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 text-[#435334] font-bold text-sm">
                 <button onClick={() => navigate("/How-it-Works")} className={`hover:text-brand-accent transition-colors cursor-pointer ${location.pathname === '/How-it-Works' ? 'text-brand-accent font-bold' : ''}`}>How it Works</button>
                <a href="#" className="hover:text-brand-accent transition-colors">Pricing</a>
                <button onClick={() => navigate("/explore-recipes")} className={`hover:text-brand-accent transition-colors cursor-pointer ${location.pathname === '/explore-recipes' ? 'text-brand-accent font-bold' : ''}`}>Explore Recipes</button>
                <a href="#" className="hover:text-brand-accent transition-colors">Community</a>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
                <button className="px-5 py-2 text-brand-dark font-semibold hover:opacity-80 transition-opacity cursor-pointer" onClick={handleLoginClick}>
                    Log In
                </button>
                <button className="px-5 py-2 bg-brand-dark text-white font-semibold rounded-lg hover:bg-opacity-90 transition-opacity cursor-pointer" onClick={handleSignUpClick}>
                    Sign Up Free
                </button>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-brand-dark"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-full bg-brand-light shadow-lg flex flex-col items-center py-6 gap-6 md:hidden">
                    <button className={`text-brand-dark font-medium cursor-pointer ${location.pathname === '/How-it-Works' ? 'text-brand-accent font-bold' : ''}`} onClick={() => { setIsOpen(false); navigate("/How-it-Works"); }}>How it Works</button>
                    <a href="#" className="text-brand-dark font-medium cursor-pointer" onClick={() => setIsOpen(false)}>Pricing</a>
                    <button className={`text-brand-dark font-medium cursor-pointer ${location.pathname === '/explore-recipes' ? 'text-brand-accent font-bold' : ''}`} onClick={() => { setIsOpen(false); navigate("/explore-recipes"); }}>Explore Recipes</button>
                    <a href="#" className="text-brand-dark font-medium cursor-pointer" onClick={() => setIsOpen(false)}>Community</a>
                    <hr className="w-1/2 border-brand-dark opacity-20" />
                    <button className="text-brand-dark font-semibold cursor-pointer" onClick={() => { setIsOpen(false); handleLoginClick(); }}>Log In</button>
                    <button className="px-5 py-2 bg-brand-dark text-white font-semibold rounded-lg cursor-pointer" onClick={() => { setIsOpen(false); handleSignUpClick(); }}>Sign Up Free</button>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
