import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Trash2,
  Search,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
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
import ViewPostModal from '../components/modal/ViewPostModal';
import DeleteConfirmationModal from '../components/modal/DeleteConfirmationModal';

const AllBlogPost = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modal State
  const [postToView, setPostToView] = useState<AdminPost | null>(null);
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

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user_id');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_role');
      showToast('success', 'Logged Out', 'Successfully logged out');
      navigate('/admin');
    }
  };

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
    <div className="min-h-screen bg-brand-beige text-brand-dark flex overflow-hidden">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 ${isSidebarCollapsed ? 'lg:w-24' : 'lg:w-64'} w-64 bg-brand-beige border-r border-brand-primary transform transition-all duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} px-6 h-20 bg-[#CEDEBD] shrink-0 transition-all mb-6`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(111,154,78,0.2)] flex-shrink-0">
                {localStorage.getItem('admin_username')?.charAt(0).toUpperCase() || 'A'}
              </div>
              {!isSidebarCollapsed && (
                <span className="text-xl font-bold tracking-tight whitespace-nowrap text-brand-dark">{localStorage.getItem('admin_username') || 'Admin'}</span>
              )}
            </div>
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-1.5 hover:bg-brand-dark/5 rounded-lg text-brand-dark/40 hover:text-brand-dark transition-colors ml-2"
            >
              {isSidebarCollapsed ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl font-bold text-sm transition-all duration-300 text-brand-primary hover:bg-brand-light/50 hover:text-brand-dark`}
            >
              <LayoutDashboard size={20} className="flex-shrink-0" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap">Dashboard</span>}
            </button>
            <button
              onClick={() => navigate('/admin/all-blog-posts')}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl font-bold text-sm transition-all duration-300 bg-[#CEDEBD36] text-brand-accent border border-brand-light`}
            >
              <FileText size={20} className="flex-shrink-0" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap">Blog Posts</span>}
            </button>
          </nav>

          <div className="px-4 mt-auto pb-10 border-t border-brand-dark/5 pt-6">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-all`}
            >
              <LogOut size={20} className="shrink-0" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-brand-light flex items-center justify-between px-6 lg:px-10 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-brand-dark/60 hover:text-brand-dark transition-colors">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl lg:text-2xl font-bold">All Blog Posts</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-brand-dark/10 rounded-xl py-2.5 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-brand-accent/50 transition-all font-medium text-brand-dark"
              />
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-6 lg:p-10 bg-brand-beige">
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
                            onClick={() => setPostToView(post)}
                            className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest hover:underline transition-all"
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
      </main>

      <ViewPostModal
        isOpen={!!postToView}
        onClose={() => setPostToView(null)}
        post={postToView}
      />

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