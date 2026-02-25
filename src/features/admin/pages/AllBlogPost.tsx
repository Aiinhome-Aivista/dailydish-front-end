import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  SearchX,
  Star,
  Users,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminPostService, type AdminPost } from '../api/adminPostService';
import { useToast } from '../../../shared/context/ToastContext';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';
import { BASE_URL } from '../../../config/endpoints';

import DeleteConfirmationModal from '../components/modal/DeleteConfirmationModal';
import { useOutletContext } from 'react-router-dom';

const AllBlogPost = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

  // Modal State
  const [postToDelete, setPostToDelete] = useState<AdminPost | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await adminPostService.getCommunityFeed();
      if (response && response.status === 'success') {
        setPosts(response.data || []);
      } else {
        setPosts([]);
      }
    } catch (error) {
      showToast('error', 'Error', 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchPosts();
  }, [navigate]);


  const handleDelete = async (postId: number) => {
    try {
      await adminPostService.deletePost(postId);
      showToast('success', 'Success', 'Post deleted successfully');
      setPostToDelete(null);
      fetchPosts();
    } catch (error) {
      showToast('error', 'Error', 'Failed to delete post');
    }
  };

  const filteredPosts = posts.filter(post =>
    (post.menu_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.shared_by || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.username || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getImageUrl = (url: string) => {
    if (!url) return defaultRecipeImage;
    if (url.startsWith('http')) return url;
    const cleanUrl = url.replace(/^\/+/, '');
    return `${BASE_URL.replace(/\/$/, '')}/${cleanUrl}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-brand-accent text-white';
      case 'pending': return 'bg-yellow-500 text-black';
      case 'rejected': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="h-full">
      <section className="p-6 lg:p-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-20 flex justify-center">
              <DailyDishLoader />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-32 bg-white/30 border border-brand-dark/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-6">
              <div className="w-20 h-20 bg-brand-dark/5 rounded-full flex items-center justify-center text-brand-dark/20 mb-6">
                <SearchX size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">No posts found</h3>
              <p className="text-brand-dark/40 max-w-sm">We couldn't find any blog posts matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <AnimatePresence mode='popLayout'>
                {filteredPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group relative flex flex-col p-4 rounded-4xl cursor-pointer transition-all duration-500 bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 hover:shadow-xl hover:scale-[1.01]"
                  >
                    <div className="h-40 w-full mb-5 overflow-hidden rounded-2xl relative">
                      <img
                        src={getImageUrl(post.image_url)}
                        alt={post.menu_name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => { e.currentTarget.src = defaultRecipeImage; }}
                      />
                      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-brand-dark/10 flex items-center gap-2">
                        <Star size={14} className="text-brand-accent fill-brand-accent" />
                        <span className="text-xs font-bold text-brand-dark">{(post.rating / 2).toFixed(1)}</span>
                      </div>
                      <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full shadow-lg ${getStatusColor(post.status)}`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">{post.status}</span>
                      </div>
                    </div>

                    <div className="flex flex-col grow">
                      <div className="mb-2">
                        <h4 className="text-xl font-bold mb-1 text-[#3e5035] line-clamp-1">{post.menu_name}</h4>
                        <div className="flex items-center gap-2 text-[#5e7054] text-xs font-medium">
                          <Users size={14} className="text-brand-accent" />
                          <span>By <span className="text-[#3e5035] font-bold">{post.username}</span></span>
                          <span className="w-1 h-1 rounded-full bg-brand-dark/10" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-[#5e7054] mb-6 line-clamp-3 italic">"{post.comment}"</p>

                      <div className="mt-auto pt-6 border-t border-brand-dark/5 flex items-center justify-between gap-3">
                        <button
                          onClick={() => navigate(`/admin/view-post/${post.id}`, { state: { post } })}
                          className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest hover:underline transition-all cursor-pointer"
                        >
                          <Eye size={16} />
                          View Post
                        </button>
                        <button
                          onClick={() => setPostToDelete(post)}
                          className="p-3 bg-brand-dark/5 hover:bg-red-500/10 text-brand-dark/60 hover:text-red-500 rounded-xl transition-all border border-brand-dark/5"
                          title="Delete Post"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <DeleteConfirmationModal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => postToDelete && handleDelete(postToDelete.id)}
        post={postToDelete}
      />
    </div>
  );
};

export default AllBlogPost;