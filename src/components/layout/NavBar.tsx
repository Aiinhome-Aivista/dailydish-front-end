import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import cookerIcon from '../../assets/cooker.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import LogoLoop from '../../animations/ui/LogoLoop';

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
                <LogoLoop
                    items={[cookerIcon]}
                    speed={0}
                    logoHeight={32}
                    width="auto"
                    renderItem={(item) => (
                        <motion.img
                            src={item as string}
                            alt="DailyDish Logo"
                            className="w-8 h-8"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        />
                    )}
                />
                <span className="text-[#435334] font-bold text-xl">DailyDish</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8 text-[#435334] font-bold text-sm items-center">
                <motion.button
                    onClick={() => navigate("/How-it-Works")}
                    className={`hover:text-brand-accent transition-colors cursor-pointer ${location.pathname === '/How-it-Works' ? 'text-brand-accent font-bold' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    How it Works
                </motion.button>
                {/* <motion.a
                    href="#"
                    className="hover:text-brand-accent transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    Pricing
                </motion.a> */}
                <motion.button
                    onClick={() => navigate("/explore-recipes")}
                    className={`hover:text-brand-accent transition-colors cursor-pointer ${location.pathname === '/explore-recipes' ? 'text-brand-accent font-bold' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    Explore Recipes
                </motion.button>
                <motion.button
                    onClick={() => navigate("/community")}
                    className={`hover:text-brand-accent transition-colors cursor-pointer ${location.pathname === '/community' ? 'text-brand-accent font-bold' : ''}`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    Community
                </motion.button>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
                <motion.button
                    className="px-5 py-2 text-brand-dark font-semibold hover:opacity-80 transition-opacity cursor-pointer"
                    onClick={handleLoginClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    Log In
                </motion.button>
                <motion.button
                    className="px-5 py-2 bg-brand-dark text-white font-semibold rounded-lg hover:bg-opacity-90 transition-opacity cursor-pointer"
                    onClick={handleSignUpClick}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                    Sign Up Free
                </motion.button>
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
                    <button className={`text-brand-dark font-medium cursor-pointer ${location.pathname === '/community' ? 'text-brand-accent font-bold' : ''}`} onClick={() => { setIsOpen(false); navigate("/community"); }}>Community</button>
                    <hr className="w-1/2 border-brand-dark opacity-20" />
                    <motion.button
                        className="text-brand-dark font-semibold cursor-pointer"
                        onClick={() => { setIsOpen(false); handleLoginClick(); }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Log In
                    </motion.button>
                    <motion.button
                        className="px-5 py-2 bg-brand-dark text-white font-semibold rounded-lg cursor-pointer"
                        onClick={() => { setIsOpen(false); handleSignUpClick(); }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Sign Up Free
                    </motion.button>
                </div>
            )}
        </nav>
    );
};

export default NavBar;
