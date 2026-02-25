import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, StarHalf, Clock, Users, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { communityService } from '../api/communityService';
import type { CommunityPost } from '../types/community';
import { BASE_URL } from '../../../config/endpoints';
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';
import LandingFooter from '../../../components/layout/Footer';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';
import PageTransitionOverlay from '../../../animations/pages/PageTransitionOverlay';
import Navbar from '../../../components/layout/NavBar';

import foodVideo from '../../../assets/videos/foodvideo.mp4';

const Community = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLeaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
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

    const [isTransitioning] = useState(false);



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
                initial={{ y: -50, opacity: 0 }}
                animate={isLeaving ? { y: -60, opacity: 0 } : { y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col min-h-screen"
            >
                {/* Header */}
                <Navbar />

                <section className="relative h-[60vh] min-h-125 w-full flex items-center justify-center overflow-hidden">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                    >
                        <source src={foodVideo} type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

                    <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-4 tracking-tight"
                        >
                            A Global <span className="text-brand-accent">Community</span> of <span className="text-brand-accent italic">dailydish</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl md:text-xl font-medium mb-12 opacity-90 max-w-3xl mx-auto"
                        >
                            Join thousands of home cooks sharing their culinary journeys and secret family recipes.
                        </motion.p>

                        {/* Search Bar in Hero */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-xl h-14 px-8 group focus-within:bg-white/20 transition-all shadow-2xl">
                                <Search size={24} className="text-white/60 group-focus-within:text-white transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search for recipes, chefs, or flavors..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent border-none text-xl text-white placeholder:text-white/40 focus:outline-none w-full ml-4"
                                />
                            </div>
                        </motion.div>
                    </div>
                </section>

                <main className="grow bg-brand-beige">
                    {/* Welcome Section */}
                    <section className="bg-white py-20 border-b border-brand-accent/5">
                        <div className="max-w-7xl mx-auto px-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <h2 className="text-4xl md:text-4xl font-bold text-brand-dark mb-6 leading-tight">
                                        Welcome to the <br />
                                        <span className="text-brand-accent">Inner Circle</span>
                                    </h2>
                                    <p className="text-lg text-brand-dark/70 leading-relaxed mb-8">
                                        Food is more than just sustenance; it's a universal language that connects us all. Our community is a vibrant tapestry of flavors, stories, and shared experiences from every corner of the globe.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <div className="bg-brand-beige px-6 py-4 rounded-2xl flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                                <Users size={20} />
                                            </div>
                                            <div>
                                                <span className="block text-xl font-bold text-brand-dark leading-none">10k+</span>
                                                <span className="text-xs uppercase tracking-widest text-brand-dark/50 font-bold">Active dr.Foodies</span>
                                            </div>
                                        </div>
                                        <div className="bg-brand-beige px-6 py-4 rounded-2xl flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent">
                                                <Star size={20} />
                                            </div>
                                            <div>
                                                <span className="block text-xl font-bold text-brand-dark leading-none">50k+</span>
                                                <span className="text-xs uppercase tracking-widest text-brand-dark/50 font-bold">Recipes Shared</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="relative rounded-[2.5rem] overflow-hidden aspect-[16/9] lg:aspect-[6/4] shadow-2xl group border border-brand-accent/10"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=2070"
                                        alt="Warm Community Dining"
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/30 to-transparent opacity-70" />
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="p-4"
                                        >
                                            <p className="text-white text-xl md:text-3xl font-black italic leading-tight drop-shadow-lg mb-6">
                                                "Food is the ingredient that binds us together. Every shared recipe is a bridge between cultures."
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-[3px] w-12 bg-brand-accent rounded-full shadow-[0_0_15px_rgba(var(--brand-accent),0.5)]" />
                                                <span className="text-white font-black text-sm uppercase tracking-[0.2em] drop-shadow-md">dr.Foodie Community</span>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </section>

                    {/* Trending Challenges Section */}
                    <section className="py-24 bg-white relative overflow-hidden">
                        {/* Decorative Divider */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-px bg-linear-to-r from-transparent via-brand-accent/20 to-transparent" />

                        <div className="max-w-7xl mx-auto px-6">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
                                        Active <span className="text-brand-accent italic">Challenges</span>
                                    </h2>
                                    <p className="text-lg text-brand-dark/60 max-w-xl">
                                        Push your culinary boundaries and compete with chefs worldwide for exclusive badges and rewards.
                                    </p>
                                </div>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[
                                    { title: "Mediterranean Magic", participants: "1.2k", prize: "Elite Badge", color: "from-blue-500 to-cyan-400" },
                                    { title: "The Spice Route", participants: "850", prize: "Spice Master", color: "from-orange-500 to-red-500" },
                                    { title: "15-Min Gourmets", participants: "2.5k", prize: "Speed Chef", color: "from-green-500 to-emerald-400" }
                                ].map((challenge, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="group relative bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-brand-accent/5"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${challenge.color} mb-6 flex items-center justify-center text-white shadow-lg shadow-blue-500/20`}>
                                            <Star size={24} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-brand-dark mb-2">{challenge.title}</h3>
                                        <div className="flex items-center gap-4 text-sm font-medium text-brand-dark/50 mb-8">
                                            <span className="flex items-center gap-1.2"><Users size={14} /> {challenge.participants} joined</span>
                                            <span className="flex items-center gap-1.2"><Star size={14} /> {challenge.prize}</span>
                                        </div>
                                        <div className="w-full h-2 bg-brand-beige rounded-full overflow-hidden">
                                            <div className="h-full bg-brand-accent w-[65%]" />
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </section>



                    <div className="max-w-7xl mx-auto px-6 py-32 border-t border-brand-accent/5 bg-brand-beige">

                        <div className="mb-20 text-center max-w-3xl mx-auto">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="text-4xl md:text-5xl font-bold text-brand-dark mb-4"
                            >
                                Culinary <span className="text-brand-accent">Masterpieces</span>
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-lg md:text-xl text-brand-dark/60 font-medium"
                            >
                                Welcome to our Global Kitchen. Discover and be inspired by what our community is cooking today.
                            </motion.p>
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
                                            onClick={() => navigate(`/blog/${createSlug(post.menu_name)}`, { state: { post } })}
                                        >
                                            <div className="bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden shadow-[0_4px_9px_5px_rgba(0,0,0,0.05)] hover:shadow-xl hover:scale-[1.01] transition-all duration-500 flex flex-col h-full p-4">
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
                                                                <Star size={14} className="text-[#43533426]" />
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
                    </div>
                </main>

                <LandingFooter />
            </motion.div>
        </div >
    );
};

export default Community;
