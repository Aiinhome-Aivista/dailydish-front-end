import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Clock, Users, ArrowRight } from 'lucide-react';
import { communityService } from '../../community/api/communityService';
import type { CommunityPost } from '../../community/types/community';
import { BASE_URL } from '../../../config/endpoints';
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';

const Community = () => {
    const navigate = useNavigate();
    const [masterpieces, setMasterpieces] = useState<CommunityPost[]>([]);

    const createSlug = (name: string) => {
        return encodeURIComponent(name.toLowerCase().trim().replace(/\s+/g, '-'));
    };

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const response = await communityService.getCommunityFeed();
                if (response?.status === 'success' && response.data) {
                    setMasterpieces(response.data);
                }
            } catch (err) {
                console.error('Failed to load community feed:', err);
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

    // Duplicate for infinite scroll, fallback to empty array if still loading
    const loopedMasterpieces = masterpieces.length > 0
        ? [...masterpieces, ...masterpieces, ...masterpieces]
        : [];

    if (masterpieces.length === 0) return null; // Or show loading state

    return (
        <section className="py-8 bg-brand-light overflow-hidden">
            {/* Header Section */}
            <div className="max-w-6xl mx-auto px-6 md:px-10 text-center mb-4">
                <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
                    <span className="text-brand-dark">Culinary <span className='text-brand-accent'>Masterpieces</span></span>
                </h2>
                <p className="text-brand-dark max-w-xl mx-auto font-medium">
                    Join thousands of happy home cooks who have transformed their kitchen experience.
                </p>
            </div>

            <div className="relative w-full overflow-hidden mask-gradient">
                <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-25%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                .mask-gradient {
                    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
                <div className="flex gap-8 w-max animate-scroll px-4 py-8">
                    {loopedMasterpieces.map((post, index) => (
                        <div
                            key={`${post.post_id}-${index}`}
                            className="w-[300px] flex-shrink-0 cursor-pointer group"
                            onClick={() => navigate(`/community/${createSlug(post.menu_name)}`, { state: { post } })}
                        >
                            <div className="bg-brand-accent/40 backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-500 flex flex-col h-full p-4">
                                {/* Small Image & Header */}
                                <div className="flex gap-4 mb-4">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-white/50 shadow-sm">
                                        <img
                                            src={getImageUrl(post.image_url)}
                                            alt={post.menu_name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = defaultRecipeImage;
                                            }}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-center">
                                        <h3 className="text-lg font-bold text-[#3e5035] leading-snug line-clamp-2">
                                            {post.menu_name}
                                        </h3>
                                        <span className="text-xs font-bold text-[#7A8F63] uppercase tracking-wider mt-1">
                                            By {post.shared_by}
                                        </span>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={`${i < Math.floor(post.rating) ? "text-brand-accent fill-brand-accent" : "text-gray-300"}`}
                                        />
                                    ))}
                                    <span className="text-xs font-bold text-[#435334] ml-1">{post.rating}</span>
                                </div>

                                {/* Story */}
                                <div className="flex flex-col flex-grow max-h-[160px] overflow-hidden">
                                    <p className="text-brand-dark font-medium text-sm mb-4 line-clamp-3 ">
                                        "{post.comment}"
                                    </p>
                                </div>

                                {/* Footer Info */}
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/20">
                                    <div className="flex gap-3">
                                        <div className="flex items-center gap-1 text-[#3e5035]">
                                            <Clock size={12} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">{post.meal_details?.time_breakdown?.cook_time || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[#3e5035]">
                                            <Users size={12} />
                                            <span className="text-[9px] font-bold uppercase tracking-widest">Serves {post.meal_details?.servings || '1'}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-[#7A8F63] hover:text-[#435334] font-bold text-[9px] uppercase tracking-widest transition-colors group/btn">
                                        Review
                                        <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Community;
