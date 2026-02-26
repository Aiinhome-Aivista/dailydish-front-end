import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, StarHalf } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { communityService } from "../api/communityService";
import type { CommunityPost } from "../types/community";
import { BASE_URL } from "../../../config/endpoints";
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';
import { useToast } from "../../../shared/context/ToastContext";
import DailyDishLoader from "../../../components/feedback/DailyDishLoader";
import ViewRejectedReasonModal from "../../../components/modal/pages/ViewRejectedReasonModal";

const ManageBlogPost = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'published' | 'pending' | 'rejected'>('published');
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  const getImageUrl = (url: string) => {
    if (!url) return defaultRecipeImage;
    if (url.startsWith('http')) return url;
    const cleanUrl = url.replace(/^\/+/, '');
    return `${BASE_URL.replace(/\/$/, '')}/${cleanUrl}`;
  };

  const handleOpenReason = (post: CommunityPost) => {
    setSelectedPost(post);
    setIsReasonModalOpen(true);
  };

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
        <motion.div layout className="flex bg-[#F1EDDC] rounded-full p-1.5 w-fit">
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
                onClick={() => navigate(`/blog/${encodeURIComponent(post.menu_name.toLowerCase().trim().replace(/\s+/g, '-'))}`, { state: { post } })}
              >
                {/* Image Container */}
                <div className="h-40 w-full mb-5 overflow-hidden rounded-2xl">
                  <img
                    src={getImageUrl(post.image_url)}
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

                  <p className="text-sm leading-relaxed text-[#5e7054] mb-4 line-clamp-3">
                    {post.comment}
                  </p>

                  {/* Rating Section - Matching Community.tsx style */}
                  <div className="flex items-center gap-1 mb-6">
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

                  {/* Footer: Meta & Action */}
                  <div className="mt-auto">
                    {activeTab === 'rejected' && (
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenReason(post);
                            }}
                            className="w-fit px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5"
                          >
                            View Rejection Reason
                          </button>

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
                            className="w-10 h-10 flex items-center justify-center bg-[#7A8F63] text-white rounded-xl shadow-lg transition-all active:scale-95 hover:bg-[#6b7e56] hover:shadow-xl group/edit"
                          >
                            <span className="material-symbols-outlined text-lg transition-transform group-hover/edit:rotate-12">edit</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab !== 'rejected' && (
                      <div className="flex items-center justify-between">
                        {/* Any other footer info for published/pending could go here if needed */}
                      </div>
                    )}
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
      <ViewRejectedReasonModal
        isOpen={isReasonModalOpen}
        onClose={() => setIsReasonModalOpen(false)}
        post={selectedPost}
      />
    </div>
  );
};

export default ManageBlogPost;