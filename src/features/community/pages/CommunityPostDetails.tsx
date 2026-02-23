import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Clock, Users, Check } from 'lucide-react';
import { communityService } from '../api/communityService';
import type { CommunityPost } from '../types/community';
import { BASE_URL } from '../../../config/endpoints';
import cookerIcon from '../../../assets/cooker.svg';
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';
import LandingFooter from '../../../components/layout/Footer';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';
import SocialShare from '../../../helper/SocialShare';

const CommunityPostDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [post, setPost] = useState<CommunityPost | null>(location.state?.post || null);
    const [allPosts, setAllPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(!post);
    const [error, setError] = useState<string | null>(null);

    const createSlug = (name: string) => {
        return encodeURIComponent(name.toLowerCase().trim().replace(/\s+/g, '-'));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await communityService.getCommunityFeed();
                if (response?.status === 'success' && response.data) {
                    setAllPosts(response.data);

                    const foundPost = response.data.find((p: CommunityPost) => createSlug(p.menu_name) === slug);
                    if (foundPost) {
                        setPost(foundPost);
                        // SEO Updates
                        document.title = `${foundPost.menu_name} - Community Creations | DailyDish`;
                        const metaDesc = document.querySelector('meta[name="description"]');
                        if (metaDesc) {
                            metaDesc.setAttribute('data-original-content', metaDesc.getAttribute('content') || '');
                            metaDesc.setAttribute('content', foundPost.comment || `Discover how to make ${foundPost.menu_name} on DailyDish.`);
                        }
                    } else {
                        setError('Post not found.');
                    }
                }
            } catch (err) {
                setError('Failed to load post details.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        window.scrollTo(0, 0);

        // Cleanup function to reset SEO tags when leaving the page
        return () => {
            document.title = "DailyDish";
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                const originalContent = metaDesc.getAttribute('data-original-content');
                if (originalContent) {
                    metaDesc.setAttribute('content', originalContent);
                    metaDesc.removeAttribute('data-original-content');
                } else {
                    // Fallback to a default description if no original was stored
                    metaDesc.setAttribute('content', 'DailyDish - Your ultimate culinary companion.');
                }
            }
        };
    }, [slug]);

    const getImageUrl = (url: string) => {
        if (!url) return defaultRecipeImage;
        if (url.startsWith('http')) return url;
        const cleanUrl = url.replace(/^\/+/, '');
        return `${BASE_URL.replace(/\/$/, '')}/${cleanUrl}`;
    };

    const currentIndex = allPosts.findIndex(p => createSlug(p.menu_name) === slug);
    const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
    const nextPost = currentIndex !== -1 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

    if (loading) return <div className="min-h-full bg-[#FAF1E4] flex items-center justify-center py-20"><DailyDishLoader /></div>;
    if (error || !post) return (
        <div className="min-h-full bg-[#FAF1E4] flex flex-col items-center justify-center gap-4 py-20">
            <p className="text-red-500 font-bold">{error || 'Post not found'}</p>
            <button onClick={() => navigate('/community')} className="text-brand-accent hover:underline">Back to Community</button>
        </div>
    );

    return (
        <div className="bg-[#FAF1E4] text-brand-dark selection:bg-brand-accent/30 w-full overflow-x-hidden">
            {/* Header */}
            <header className="w-full bg-brand-light flex items-center justify-between sticky top-0 z-50 py-4 px-6 md:px-12 shadow-sm">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <img src={cookerIcon} alt="DailyDish Logo" className="w-8 h-8" />
                    <span className="text-brand-dark font-bold text-xl italic">DailyDish</span>
                </div>
                <button
                    onClick={() => navigate("/community")}
                    className="p-2 text-brand-dark   hover:bg-[#43533414] rounded-full transition-colors cursor-pointer flex items-center justify-center"
                >
                    <ArrowLeft size={24} />
                </button>
            </header>

            <main className="max-w-[1280px] mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10">
                    <nav className="flex items-center gap-2 text-sm text-brand-dark mb-4 md:mb-0">
                        <button onClick={() => navigate('/')} className="hover:text-brand-dark transition-colors">Home</button>
                        <span className="opacity-40">&gt;</span>
                        <button onClick={() => navigate('/community')} className="hover:text-brand-dark transition-colors">Recipes</button>
                        <span className="opacity-40">&gt;</span>
                        <span className="font-bold text-brand-dark truncate max-w-full">{post.menu_name}</span>
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden md:block">
                            <div className="flex items-center justify-end gap-2">
                                <p className='text-sm text-brand-dark'>Shared By :</p>
                                <p className="text-sm font-medium text-brand-accent">{post.shared_by}</p>
                            </div>
                            <p className="text-[10px] text-brand-primary uppercase tracking-widest  text-left">
                                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="text-left md:hidden">
                            <div className="flex items-center gap-2">
                                <p className='text-sm text-brand-dark'>Shared By:</p>
                                <p className="text-sm font-medium text-brand-accent">{post.shared_by}</p>
                            </div>
                            <p className="text-[10px] text-brand-primary uppercase tracking-widest mt-0.5">
                                {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Hero Section */}
                <section className="relative w-full aspect-[21/10] rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 border border-white/20 ">
                    <img
                        src={getImageUrl(post.image_url)}
                        alt={post.menu_name}
                        className="w-full h-full object-cover bg-black/40"
                        onError={(e) => {
                            e.currentTarget.src = defaultRecipeImage;
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-2xl text-white">
                        <h1 className="text-4xl md:text-6xl font-black leading-tight mb-4 drop-shadow-lg uppercase tracking-tight">
                            {post.menu_name}
                        </h1>

                    </div>
                </section>

                {/* Summary / Culinary Story */}
                <div className="px-2 mb-12">
                    <p className="text-xl md:text-xl font-medium text-brand-dark italic leading-relaxed">
                        {post.comment}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    {/* Left Column: Post Details */}
                    <article className="lg:w-[70%] space-y-12">

                        {/* Stats Row */}
                        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 p-6 rounded-3xl flex flex-col items-center shadow-sm">
                                <Clock size={20} className="text-brand-accent mb-2" />
                                <span className="text-[10px] font-black text-[#7A8F63] uppercase tracking-widest mb-1">Cook Time</span>
                                <span className="text-sm font-bold text-brand-dark">{post.meal_details?.time_breakdown?.cook_time || 'N/A'}</span>
                            </div>
                            <div className="bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 p-6 rounded-3xl flex flex-col items-center shadow-sm">
                                <Users size={20} className="text-brand-accent mb-2" />
                                <span className="text-[10px] font-black text-[#7A8F63] uppercase tracking-widest mb-1">Servings</span>
                                <span className="text-sm font-bold text-brand-dark">{post.meal_details?.servings || '1'}</span>
                            </div>
                            <div className="bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 p-6 rounded-3xl flex flex-col items-center shadow-sm">
                                <div className="text-brand-accent text-xl font-black mb-2">{post.meal_details?.ingredients_used?.length || 0}</div>
                                <span className="text-[10px] font-black text-[#7A8F63] uppercase tracking-widest mb-1">Ingredients</span>
                                <span className="text-sm font-bold text-brand-dark">Items Included</span>
                            </div>
                            <div className="bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 p-6 rounded-3xl flex flex-col items-center shadow-sm">
                                <div className="text-brand-accent text-xl font-black mb-2">{post.meal_details?.steps?.cooking?.length || 0}</div>
                                <span className="text-[10px] font-black text-[#7A8F63] uppercase tracking-widest mb-1">Process</span>
                                <span className="text-sm font-bold text-brand-dark">Cooking Steps</span>
                            </div>
                        </div> */}

                        {/* Ingredients & Steps */}
                        <div className="space-y-12">
                            {post.meal_details?.ingredients_used && (
                                <section className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 backdrop-blur-xl shadow-sm">
                                    <h3 className="text-xl font-black text-brand-dark mb-8 pb-4 border-b border-[#43533414]">
                                        Ingredients <span className="text-sm font-medium text-brand-accent ml-2">(Suggested)</span>
                                    </h3>
                                    <div className="space-y-4">
                                        {post.meal_details.ingredients_used.map((ingredient, idx) => (
                                            <div key={idx} className="flex items-center gap-3">
                                                <div className="min-w-6 h-6 rounded-full bg-[#95B974] flex items-center justify-center text-white shrink-0">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                                <span className="font-bold text-sm lg:text-base text-brand-dark">
                                                    {ingredient.name} <span className="text-[#7A8F63] font-normal">({ingredient.qty})</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {post.meal_details?.steps && (
                                <section className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 backdrop-blur-xl shadow-sm">
                                    <h3 className="text-xl font-black text-brand-dark mb-8 pb-4 border-b border-[#43533414]">Cooking Method</h3>
                                    <div className="space-y-6">
                                        {post.meal_details.steps.cooking.map((step, idx) => (
                                            <div key={idx} className="flex gap-4">
                                                <div className="shrink-0 w-8 h-8 rounded-full bg-[#4A5D3B] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm md:text-base text-brand-dark leading-relaxed font-medium">{step}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* Social Share & Nav */}
                        <div className="flex flex-col gap-12 pt-12 border-t border-[#435334]/10">
                            <div className="flex items-center gap-4">
                                <h3 className="text-xs font-black text-brand-dark uppercase tracking-[0.2em] shrink-0">Share:</h3>
                                <SocialShare />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                {prevPost ? (
                                    <div
                                        onClick={() => navigate(`/community/${createSlug(prevPost.menu_name)}`, { state: { post: prevPost } })}
                                        className="cursor-pointer group p-6 rounded-2xl border border-[#7A8F63]/10 hover:bg-[#CEDEBDB2] transition-all text-left"
                                    >
                                        <p className="text-[10px] uppercase tracking-widest text-[#7A8F63] mb-2 group-hover:translate-x-1 transition-transform font-black">Previous Creation</p>
                                        <h4 className="text-brand-dark font-bold group-hover:text-brand-accent transition-colors truncate">{prevPost.menu_name}</h4>
                                    </div>
                                ) : <div />}
                                {nextPost ? (
                                    <div
                                        onClick={() => navigate(`/community/${createSlug(nextPost.menu_name)}`, { state: { post: nextPost } })}
                                        className="cursor-pointer group p-6 rounded-2xl border border-[#7A8F63]/10 hover:bg-[#CEDEBDB2] transition-all text-right"
                                    >
                                        <p className="text-[10px] uppercase tracking-widest text-[#7A8F63] mb-2 group-hover:-translate-x-1 transition-transform font-black">Next Creation</p>
                                        <h4 className="text-brand-dark font-bold group-hover:text-brand-accent transition-colors truncate">{nextPost.menu_name}</h4>
                                    </div>
                                ) : <div />}
                            </div>
                        </div>
                    </article>

                    {/* Right Column: Sidebar (Nutrition) */}
                    <aside className="lg:w-[30%]">
                        <div className="sticky top-32 space-y-8">
                            {post.meal_details?.nutrition && (
                                <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-3xl p-8 backdrop-blur-xl shadow-sm">
                                    <h3 className="text-xl font-bold text-brand-dark mb-6">Nutrition Dashboard</h3>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-2xl p-6 text-center">
                                            <div className="text-[10px] font-black text-brand-accent mb-1 uppercase tracking-widest">CALORIES</div>
                                            <div className="text-3xl font-black text-brand-accent">
                                                {post.meal_details.nutrition.total_calories?.toString().replace(/[^\d]/g, '') || '0'}
                                            </div>
                                            <div className="text-[10px] font-bold text-brand-accent/60 uppercase tracking-tighter">Per Serving</div>
                                        </div>
                                        <div className="bg-[#CEDEBD36] border border-[#43533414] rounded-2xl p-6 text-center">
                                            <div className="text-[10px] font-black text-brand-accent mb-1 uppercase tracking-widest">FIBER</div>
                                            <div className="text-3xl font-black text-brand-accent">
                                                {post.meal_details.nutrition.fiber || '0g'}
                                            </div>
                                            <div className="text-[10px] font-bold text-brand-accent/60 uppercase tracking-tighter">Dietary</div>
                                        </div>
                                    </div>

                                    <div className="space-y-5 text-sm font-bold">
                                        {[
                                            { label: 'Protein', value: post.meal_details.nutrition.protein, color: 'bg-brand-accent', width: '70%', raw: post.meal_details.nutrition.protein },
                                            { label: 'Carbohydrates', value: post.meal_details.nutrition.carbohydrates, color: 'bg-brand-accent', width: '65%', raw: post.meal_details.nutrition.carbohydrates },
                                            { label: 'Fats', value: post.meal_details.nutrition.fat, color: 'bg-brand-accent', width: '40%', raw: post.meal_details.nutrition.fat }
                                        ].map((macro) => (
                                            <div key={macro.label}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-black text-brand-dark uppercase tracking-widest">{macro.label}</span>
                                                    <span className="text-sm font-black text-brand-dark">{macro.value || '0g'}</span>
                                                </div>
                                                <div className="h-3 bg-[#CEDEBD36] rounded-full overflow-hidden border border-[#43533414]">
                                                    <div
                                                        className={`h-full ${macro.color} transition-all duration-500`}
                                                        style={{ width: macro.width }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>


                                </div>
                            )}


                        </div>
                    </aside>
                </div>
            </main>

            <LandingFooter />
        </div>
    );
};

export default CommunityPostDetails;
