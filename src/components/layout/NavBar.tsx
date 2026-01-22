import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import cookerIcon from '../../assets/cooker.svg';
import { useNavigate, useLocation } from 'react-router-dom';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <nav className="w-full py-3 px-5 md:px-12 flex justify-between items-center bg-[#CEDEBD] relative z-50">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <img src={cookerIcon} alt="DailyDish Logo" className="w-8 h-8" />
                <span className="text-[#435334] font-bold text-xl">DailyDish</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 text-[#435334] font-bold text-sm">
                <a href="#" className="hover:text-brand-accent transition-colors">How it Works</a>
                <a href="#" className="hover:text-brand-accent transition-colors">Pricing</a>
                <button onClick={() => navigate("/explore-recipes")} className={`hover:text-brand-accent transition-colors cursor-pointer ${location.pathname === '/explore-recipes' ? 'text-brand-accent font-bold' : ''}`}>Explore Recipes</button>
                <a href="#" className="hover:text-brand-accent transition-colors">Community</a>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
                <button className="px-5 py-2 text-brand-dark font-semibold hover:opacity-80 transition-opacity cursor-pointer" onClick={() => navigate("/login")}>
                    Log In
                </button>
                <button className="px-5 py-2 bg-brand-dark text-white font-semibold rounded-lg hover:bg-opacity-90 transition-opacity cursor-pointer" onClick={() => navigate("/signup")}>
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
                    <a href="#" className="text-brand-dark font-medium cursor-pointer" onClick={() => setIsOpen(false)}>How it Works</a>
                    <a href="#" className="text-brand-dark font-medium cursor-pointer" onClick={() => setIsOpen(false)}>Pricing</a>
                    <button className={`text-brand-dark font-medium cursor-pointer ${location.pathname === '/explore-recipes' ? 'text-brand-accent font-bold' : ''}`} onClick={() => { setIsOpen(false); navigate("/explore-recipes"); }}>Explore Recipes</button>
                    <a href="#" className="text-brand-dark font-medium cursor-pointer" onClick={() => setIsOpen(false)}>Community</a>
                    <hr className="w-1/2 border-brand-dark opacity-20" />
                    <button className="text-brand-dark font-semibold cursor-pointer"
                    onClick={() => navigate("/login")}>Log In</button>
                    <button className="px-5 py-2 bg-brand-dark text-white font-semibold rounded-lg cursor-pointer" onClick={() => navigate("/signup")}>Sign Up Free</button>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
