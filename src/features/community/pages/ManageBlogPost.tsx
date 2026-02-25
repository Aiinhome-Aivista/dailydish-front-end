import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { communityService } from "../api/communityService";
import type { CommunityPost } from "../types/community";
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';
import { useToast } from "../../../shared/context/ToastContext";
import DailyDishLoader from "../../../components/feedback/DailyDishLoader";

const ManageBlogPost = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'pending' | 'rejected'>('published');

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        setLoading(true);
        const response = await communityService.getMyPosts();
        if (response && response.status === 'success') {
          setPosts(response.data || []);
        } else {
          showToast("error", "Error", "Failed to fetch your posts");
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
        showToast("error", "Error", "An error occurred while fetching your posts");
      } finally {
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const filteredPosts = posts.filter(post => {
    const status = post.status;
    if (activeTab === 'published') return status === 'approved';
    if (activeTab === 'pending') return status === 'pending';
    return status === 'rejected';
  });

  if (loading) {
    return <DailyDishLoader />;
  }

  return (
    <div className="h-full">
      {/* Header / Tabs Section */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-start gap-2">
          <button
            onClick={() => navigate(-1)}
            className="mt-1 -ml-1 hover:bg-black/5 rounded-full text-brand-dark transition-colors cursor-pointer"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-brand-dark leading-tight">
              Manage Blog Posts
            </h1>
            <p className="text-sm text-brand-accent font-medium mt-1">
              Track and view your community contributions
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <motion.div layout className="flex bg-[#43533414] rounded-full p-1.5 w-fit">
          <motion.button
            layout
            onClick={() => setActiveTab('published')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${activeTab === 'published'
              ? 'bg-[#7A8F63] text-white shadow-md'
              : 'text-[#3e5035] hover:bg-black/5'
              }`}
          >
            Published Post
          </motion.button>
          <motion.button
            layout
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${activeTab === 'pending'
              ? 'bg-[#7A8F63] text-white shadow-md'
              : 'text-[#3e5035] hover:bg-black/5'
              }`}
          >
            Under Review
          </motion.button>
          <motion.button
            layout
            onClick={() => setActiveTab('rejected')}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${activeTab === 'rejected'
              ? 'bg-[#7A8F63] text-white shadow-md'
              : 'text-[#3e5035] hover:bg-black/5'
              }`}
          >
            Rejected Post
          </motion.button>
        </motion.div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <motion.div
                key={post.post_id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative flex flex-col p-4 rounded-4xl cursor-pointer transition-all duration-500 bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 hover:shadow-xl hover:scale-[1.01]"
                onClick={() => navigate(`/community/${encodeURIComponent(post.menu_name.toLowerCase().trim().replace(/\s+/g, '-'))}`, { state: { post } })}
              >
                {/* Image Container */}
                <div className="h-40 w-full mb-5 overflow-hidden rounded-2xl">
                  <img
                    src={post.image_url || defaultRecipeImage}
                    loading="lazy"
                    alt={post.menu_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = defaultRecipeImage;
                    }}
                  />
                </div>

                {/* Content */}
                <div className="flex flex-col grow">
                  <h3 className="text-xl font-bold mb-2 text-[#3e5035]">
                    {post.menu_name}
                  </h3>

                  <p className="text-sm leading-relaxed text-[#5e7054] mb-6 line-clamp-3">
                    {post.comment}
                  </p>

                  {/* Footer: Meta & Action */}
                  <div className="mt-auto flex flex-col gap-4">
                    {activeTab === 'rejected' && (post as any).rejection_reason && (
                      <div className="p-3 bg-red-500/5 rounded-2xl border border-red-500/10">
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block mb-1">Rejection Reason</span>
                        <p className="text-xs text-red-600/80 font-medium italic line-clamp-2">"{(post as any).rejection_reason}"</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">

                      </div>

                      <div className="flex items-center gap-3">
                        {activeTab === 'rejected' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate('/share-masterpiece', {
                                state: {
                                  meal: {
                                    id: (post as any).meal_id || post.post_id,
                                    details: post.meal_details || { menu_name: post.menu_name },
                                    rating: post.rating,
                                    comment: post.comment,
                                    image_url: post.image_url,
                                    post_id: post.post_id
                                  }
                                }
                              });
                            }}
                            className="px-4 py-2 bg-brand-accent text-brand-dark rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#84a863] transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Edit
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full flex flex-col justify-center items-center py-32">
              <div className="w-16 h-16 bg-[#43533414] rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-brand-accent text-3xl">
                  {activeTab === 'published' ? 'article' : activeTab === 'pending' ? 'schedule' : 'error'}
                </span>
              </div>
              <p className="text-xl text-brand-dark font-bold">
                No {activeTab === 'published' ? 'published' : activeTab === 'pending' ? 'under review' : 'rejected'} posts found
              </p>
              <p className="text-sm text-brand-dark/50 font-medium mt-1">
                {activeTab === 'published'
                  ? "Share your masterpieces to see them here!"
                  : activeTab === 'pending'
                    ? "Your posts are being reviewed by our team. Check back soon!"
                    : "Keep cooking! Your rejected posts will show up here with reasons."}
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ManageBlogPost;