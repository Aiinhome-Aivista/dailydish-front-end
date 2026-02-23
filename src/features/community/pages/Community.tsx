import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, StarHalf, Clock, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityService } from '../api/communityService';
import type { CommunityPost } from '../types/community';
import { BASE_URL } from '../../../config/endpoints';
import cookerIcon from '../../../assets/cooker.svg';
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';
import LandingFooter from '../../../components/layout/Footer';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';
import PageTransitionOverlay from '../../../animations/pages/PageTransitionOverlay';
import { useAuth } from '../../../features/auth/context/AuthContext';

const Community = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLeaving, setIsLeaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const { user, isLoggedIn } = useAuth();
    const itemsPerPage = 9;

    const createSlug = (name: string) => {
        return encodeURIComponent(name.toLowerCase().trim().replace(/\s+/g, '-'));
    };

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const response = await communityService.getCommunityFeed();
                if (response?.status === 'success' && response.data) {
                    setPosts(response.data);
                }
            } catch (err) {
                setError('Failed to load community feed.');
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    const getImageUrl = (url: string) => {
        if (!url) return defaultRecipeImage;
        if (url.startsWith('http')) return url;
        const cleanUrl = url.replace(/^\/+/, '');
        return `${BASE_URL.replace(/\/$/, '')}/${cleanUrl}`;
    };

    const filteredPosts = posts.filter(post => {
        return post.menu_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.shared_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.comment.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
    const displayedPosts = filteredPosts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleBack = () => {
        setIsLeaving(true);
        setIsTransitioning(true);
        setTimeout(() => {
            navigate('/', { state: { skipSplash: true } });
        }, 2500); 
    };

    // Fail-safe variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    } as any;

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 25 }
        }
    } as any;

    return (
        <div className="min-h-screen bg-brand-beige text-brand-dark selection:bg-brand-accent/30 overflow-x-hidden relative">
            <PageTransitionOverlay isTransitioning={isTransitioning} />
            <motion.div
                initial={false}
                animate={isLeaving ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col min-h-screen"
            >
                {/* Header */}
                <header className="w-full bg-brand-light flex items-center justify-between sticky top-0 z-50 py-4 px-6 md:px-12 shadow-sm">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                        <img src={cookerIcon} alt="DailyDish Logo" className="w-8 h-8" />
                        <span className="text-brand-dark font-bold text-xl italic">DailyDish</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {isLoggedIn && (
                            <button className="hidden md:flex group items-center h-12 bg-brand-accent hover:bg-brand-dark rounded-full transition-all duration-500 ease-in-out max-w-12 hover:max-w-50 cursor-pointer overflow-hidden shadow-sm hover:shadow-md">
                                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[24px] text-brand-dark group-hover:text-white transition-colors duration-300">face</span>
                                </div>
                                <span className="text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pr-4">
                                    {user?.username || "User"}
                                </span>
                            </button>
                        )}
                        <motion.button
                            onClick={handleBack}
                            className="p-2 text-brand-dark rounded-full transition-colors cursor-pointer flex items-center justify-center"
                            initial={{ x: 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            whileHover={{ scale: 1.15, backgroundColor: "rgba(67, 83, 52, 0.15)" }}
                            whileTap={{ scale: 0.85, rotate: -10 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <ArrowLeft size={24} />
                        </motion.button>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 py-12 min-h-[60vh] grow">
                    {/* Title Section */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-14">
                        <motion.div
                            initial={hasMounted ? { opacity: 0, x: -20 } : false}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-3xl"
                        >
                            <h1 className="text-4xl md:text-4xl font-bold text-brand-dark leading-tight tracking-tight md:whitespace-nowrap">
                                Culinary <span className="italic text-brand-accent">Masterpieces</span>
                            </h1>
                            <p className="text-brand-accent text-md font-medium leading-relaxed">
                                Discover and be inspired by what our community is cooking today.
                            </p>
                        </motion.div>

                        {/* Search Bar */}
                        <motion.div
                            initial={hasMounted ? { opacity: 0, scale: 0.95 } : false}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center bg-[#CEDEBD36] border border-[#95B97480] rounded-full h-12 px-5 w-full md:w-80 group focus-within:border-brand-accent transition-all shadow-sm mt-6 md:mt-0"
                        >
                            <Search size={18} className="text-brand-dark/40 group-focus-within:text-brand-accent transition-colors" />
                            <input
                                type="text"
                                placeholder="Search creations..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none text-sm text-brand-dark focus:outline-none w-full ml-3 placeholder:text-[#435334]/50"
                            />
                        </motion.div>
                    </div>

                    {/* Feed Content */}
                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32 gap-4">
                            <DailyDishLoader />
                        </div>
                    ) : error ? (
                        <div className="text-center py-32">
                            <p className="text-red-500 mb-4">{error}</p>
                            <button onClick={() => window.location.reload()} className="text-brand-accent hover:underline">Try Again</button>
                        </div>
                    ) : displayedPosts.length === 0 ? (
                        <div className="text-center py-32 text-brand-dark/50">
                            <p className="text-2xl font-bold mb-2">No masterpieces found</p>
                            <p className="text-sm opacity-60">Try adjusting your search query.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-12">
                            <motion.div
                                key={currentPage + (hasMounted ? "-mounted" : "-initial")}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {displayedPosts.map((post) => (
                                    <motion.div
                                        variants={itemVariants}
                                        key={post.post_id}
                                        className="group h-full cursor-pointer"
                                        onClick={() => navigate(`/community/${createSlug(post.menu_name)}`, { state: { post } })}
                                    >
                                        <div className="bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-500 flex flex-col h-full p-4">
                                            {/* Image & Header Row */}
                                            <div className="flex gap-4 mb-4">
                                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border border-white/50 shadow-sm">
                                                    <img
                                                        src={getImageUrl(post.image_url)}
                                                        alt={post.menu_name}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                        onError={(e) => {
                                                            e.currentTarget.src = defaultRecipeImage;
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex flex-col justify-center min-w-0">
                                                    <h3 className="text-lg font-bold text-[#3e5035] leading-snug line-clamp-2 group-hover:text-brand-dark transition-colors mb-1">
                                                        {post.menu_name}
                                                    </h3>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-bold text-[#7A8F63] uppercase tracking-wider truncate">
                                                            By {post.shared_by}
                                                        </span>
                                                        <span className="text-[10px] text-brand-dark/50 font-bold uppercase tracking-widest">
                                                            {new Date(post.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 mb-3">
                                                {[...Array(5)].map((_, i) => {
                                                    const starValue = i + 1;
                                                    const normalizedRating = post.rating / 2;
                                                    return (
                                                        <span key={i} className="relative">
                                                            <Star size={14} className="text-gray-300" />
                                                            {normalizedRating >= starValue ? (
                                                                <Star size={14} className="text-brand-accent fill-brand-accent absolute inset-0" />
                                                            ) : normalizedRating >= starValue - 0.5 ? (
                                                                <StarHalf size={14} className="text-brand-accent fill-brand-accent absolute inset-0" />
                                                            ) : null}
                                                        </span>
                                                    );
                                                })}
                                                <span className="text-xs font-bold text-brand-dark ml-1">
                                                    {(post.rating / 2).toFixed(1)}
                                                </span>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col flex-grow min-h-0">
                                                <div className="max-h-40 overflow-hidden mb-4">
                                                    <p className="text-brand-dark font-medium text-sm line-clamp-3 ">
                                                        "{post.comment}"
                                                    </p>
                                                </div>

                                                {/* Footer Info */}
                                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/10">
                                                    <div className="flex gap-4">
                                                        <div className="flex items-center gap-1.5 text-[#3e5035]">
                                                            <Clock size={14} />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">{post.meal_details?.time_breakdown?.cook_time || 'N/A'}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-[#3e5035]">
                                                            <Users size={14} />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">Serves {post.meal_details?.servings || '1'}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-[#7A8F63] hover:text-brand-dark font-bold text-[10px] uppercase tracking-widest transition-colors group/btn">
                                                        Review
                                                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>

                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3 mt-4">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`w-10 h-10 rounded-full border border-[#43533414] flex items-center justify-center transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-brand-dark hover:bg-white hover:shadow-md'}`}
                                    >
                                        <ArrowLeft size={18} />
                                    </button>

                                    <div className="flex gap-2">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageChange(page)}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentPage === page ? 'bg-brand-accent text-white scale-110 shadow-lg shadow-brand-accent/20' : 'bg-[#CEDEBD36] text-brand-dark hover:bg-white hover:shadow-md'}`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`w-10 h-10 rounded-full border border-[#43533414] flex items-center justify-center transition-all ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-brand-dark hover:bg-white hover:shadow-md'}`}
                                    >
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </main>

                <LandingFooter />
            </motion.div>
        </div>
    );
};

export default Community;
