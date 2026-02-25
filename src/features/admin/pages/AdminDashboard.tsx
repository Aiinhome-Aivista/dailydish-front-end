import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FileText,
  CheckCircle,
  Search,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Clock,
  Star,
  ArrowLeft,
  ArrowRight,
  XCircle,
  Eye,
  Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminPostService, type AdminPost } from '../api/adminPostService';
import { useToast } from '../../../shared/context/ToastContext';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';
import { BASE_URL } from '../../../config/endpoints';
import RejectPostModal from '../components/modal/RejectPostModal';
import DeleteConfirmationModal from '../components/modal/DeleteConfirmationModal';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modal State
  const [postToReject, setPostToReject] = useState<AdminPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<AdminPost | null>(null);
  const [postToView, setPostToView] = useState<AdminPost | null>(null);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<AdminPost>>({});

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Fetch pending, approved and rejected posts to get a full picture
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        adminPostService.getPosts(),
        adminPostService.getCommunityFeed(),
        adminPostService.getRejectedPosts()
      ]);

      let allPosts: AdminPost[] = [];

      if (pendingRes && pendingRes.status === 'success') {
        allPosts = [...(pendingRes.data || [])];
      }

      if (approvedRes && approvedRes.status === 'success') {
        allPosts = [...allPosts, ...(approvedRes.data || [])];
      }

      if (rejectedRes && rejectedRes.status === 'success') {
        allPosts = [...allPosts, ...(rejectedRes.data || [])];
      }

      setPosts(allPosts);
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
      showToast('success', 'Logged Out', 'Successfully logged out from admin panel');
      navigate('/admin');
    }
  };

  const handleApprove = async (postId: number) => {
    try {
      await adminPostService.approvePost(postId);
      showToast('success', 'Success', 'Post approved successfully');
      fetchPosts();
    } catch (error) {
      showToast('error', 'Error', 'Failed to approve post');
    }
  };

  const handleReject = async (postId: number, reason: string) => {
    try {
      await adminPostService.rejectPost(postId, reason);
      showToast('warn', 'Rejected', 'Post has been rejected');
      setPostToReject(null);
      fetchPosts();
    } catch (error) {
      showToast('error', 'Error', 'Failed to reject post');
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

  const handleOpenEdit = (post: AdminPost) => {
    setEditingPost(post);
    setEditFormData({
      menu_name: post.menu_name,
      comment: post.comment,
      rating: post.rating
    });
  };

  const handleUpdate = async () => {
    if (!editingPost) return;
    try {
      await adminPostService.updatePost(editingPost.id, editFormData);
      showToast('success', 'Updated', 'Post updated successfully');
      setEditingPost(null);
      fetchPosts();
    } catch (error) {
      showToast('error', 'Error', 'Failed to update post');
    }
  };

  const filteredPosts = posts.filter(post =>
    post.status === activeTab &&
    ((post.menu_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.shared_by || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.username || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getImageUrl = (url: string) => {
    if (!url) return defaultRecipeImage;
    if (url.startsWith('http')) return url;
    const cleanUrl = url.replace(/^\/+/, '');
    return `${BASE_URL.replace(/\/$/, '')}/${cleanUrl}`;
  };

  return (
    <div className="min-h-screen bg-brand-beige text-brand-dark flex overflow-hidden">
      {/* Sidebar for Desktop */}
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
            {[
              { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', active: true },
              { icon: FileText, label: 'Blog Posts', path: '/admin/all-blog-posts', active: false },
            ].map((item, idx) => (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 rounded-xl font-bold text-sm transition-all duration-300 ${item.active ? 'bg-[#CEDEBD36] text-brand-accent border border-brand-light' : 'text-brand-primary hover:bg-brand-light/50 hover:text-brand-dark'}`}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!isSidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            ))}
          </nav>

          <div className="px-4 mt-auto pb-10 border-t border-brand-dark/5 pt-6">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3 px-4'} py-3 text-red-500 hover:bg-red-500/10 rounded-xl font-medium transition-all`}
              title={isSidebarCollapsed ? 'Logout' : ''}
            >
              <LogOut size={20} className="shrink-0" />
              {!isSidebarCollapsed && <span className="whitespace-nowrap">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-brand-light flex items-center justify-between px-6 lg:px-10 flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-brand-dark/60 hover:text-brand-dark transition-colors">
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-xl lg:text-2xl font-bold">Community Moderation</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/30" size={18} />
              <input
                type="text"
                placeholder="Search posts or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-brand-dark/10 rounded-xl py-2.5 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-brand-accent/50 transition-all font-medium text-brand-dark"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center text-brand-accent font-bold">
              {localStorage.getItem('admin_username')?.charAt(0) || 'A'}
            </div>
          </div>
        </header>

        {/* Dashboard View */}
        <section className="flex-1 overflow-y-auto p-6 lg:p-10 bg-brand-beige">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats Widgets */}
              <div className="bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-black/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/40 rounded-2xl text-brand-dark">
                    <Clock size={24} />
                  </div>
                  <span className="text-xs font-bold text-[#3e5035]/60 uppercase tracking-widest">Pending</span>
                </div>
                <h3 className="text-3xl font-bold text-[#3e5035]">{posts.filter(p => p.status === 'pending').length}</h3>
                <p className="text-[#5e7054] text-sm mt-1">Awaiting approval</p>
              </div>
              <div className="bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-black/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/40 rounded-2xl text-[#3e5035]">
                    <CheckCircle size={24} />
                  </div>
                  <span className="text-xs font-bold text-[#3e5035]/60 uppercase tracking-widest">Approved</span>
                </div>
                <h3 className="text-3xl font-bold text-[#3e5035]">{posts.filter(p => p.status === 'approved').length}</h3>
                <p className="text-[#5e7054] text-sm mt-1">Successfully published</p>
              </div>
              <div className="bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-black/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/40 rounded-2xl text-[#3e5035]">
                    <XCircle size={24} />
                  </div>
                  <span className="text-xs font-bold text-[#3e5035]/60 uppercase tracking-widest">Rejected</span>
                </div>
                <h3 className="text-3xl font-bold text-[#3e5035]">{posts.filter(p => p.status === 'rejected').length}</h3>
                <p className="text-[#5e7054] text-sm mt-1">Moderated out</p>
              </div>
              <div className="bg-[#CEDEBDB2] backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-xl shadow-black/5">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/40 rounded-2xl text-[#3e5035]">
                    <Users size={24} />
                  </div>
                  <span className="text-xs font-bold text-[#3e5035]/60 uppercase tracking-widest">Authors</span>
                </div>
                <h3 className="text-3xl font-bold text-[#3e5035]">{new Set(posts.map(p => p.shared_by)).size}</h3>
                <p className="text-[#5e7054] text-sm mt-1">Contributors</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-center justify-between">
              <div className="flex bg-[#CEDEBDB2] backdrop-blur-md p-1.5 rounded-2xl border border-white/30 w-full sm:w-auto">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' : 'text-[#3e5035]/40 hover:text-[#3e5035]'}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'approved' ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' : 'text-[#3e5035]/40 hover:text-[#3e5035]'}`}
                >
                  Approved
                </button>
                <button
                  onClick={() => setActiveTab('rejected')}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'rejected' ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/20' : 'text-[#3e5035]/40 hover:text-[#3e5035]'}`}
                >
                  Rejected
                </button>
              </div>
            </div>

            {loading ? (
              <div className="py-20 flex justify-center">
                <DailyDishLoader />
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="py-32 flex flex-col items-center justify-center text-center p-6 bg-white/30 border border-brand-dark/5 rounded-[3rem]">
                <h3 className="text-2xl font-bold mb-2">No {activeTab} posts found</h3>
                <p className="text-brand-dark/40 max-w-sm">We couldn't find any {activeTab} posts matching your criteria.</p>
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
                          {post.status === 'pending' ? (
                            <div className="flex gap-2 flex-1">
                              <button
                                onClick={() => handleApprove(post.id)}
                                className="flex-1 py-3 bg-brand-accent hover:bg-brand-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-brand-accent/20 active:scale-95 flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button
                                onClick={() => setPostToReject(post)}
                                className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-red-500/20 active:scale-95 flex items-center justify-center gap-1.5"
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full">
                              <button
                                onClick={() => setPostToView(post)}
                                className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest hover:underline transition-all"
                              >
                                <Eye size={16} /> View Post
                              </button>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenEdit(post)}
                                  className="p-3 bg-brand-dark/5 hover:bg-brand-accent/10 text-brand-dark/60 hover:text-brand-accent rounded-xl transition-all border border-brand-dark/5"
                                  title="Edit Post"
                                >
                                  <FileText size={18} />
                                </button>
                                <button
                                  onClick={() => setPostToDelete(post)}
                                  className="p-3 bg-brand-dark/5 hover:bg-red-500/10 text-brand-dark/60 hover:text-red-600 rounded-xl transition-all border border-brand-dark/5"
                                  title="Delete Post"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          )}
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


      <RejectPostModal
        isOpen={!!postToReject}
        onClose={() => setPostToReject(null)}
        onConfirm={(reason) => postToReject && handleReject(postToReject.id, reason)}
        post={postToReject}
      />

      <DeleteConfirmationModal
        isOpen={!!postToDelete}
        onClose={() => setPostToDelete(null)}
        onConfirm={() => postToDelete && handleDelete(postToDelete.id)}
        post={postToDelete}
      />

      <AnimatePresence>
        {editingPost && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setEditingPost(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white border border-brand-dark/10 rounded-[2.5rem] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-brand-dark">Edit Post</h3>
                <button
                  onClick={() => setEditingPost(null)}
                  className="p-2 hover:bg-brand-dark/5 rounded-full text-brand-dark/40 hover:text-brand-dark transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Menu Name</label>
                  <input
                    type="text"
                    className="w-full bg-white border border-brand-dark/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-accent transition-all text-sm text-brand-dark"
                    value={editFormData.menu_name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, menu_name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Rating (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className="w-full bg-white border border-brand-dark/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-accent transition-all text-sm text-brand-dark"
                      value={editFormData.rating || 0}
                      onChange={(e) => setEditFormData({ ...editFormData, rating: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-dark/40 uppercase tracking-widest ml-1">Comment</label>
                  <textarea
                    className="w-full bg-white border border-brand-dark/10 rounded-2xl py-4 px-6 focus:outline-none focus:border-brand-accent transition-all h-32 text-sm resize-none text-brand-dark"
                    value={editFormData.comment || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, comment: e.target.value })}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setEditingPost(null)}
                    className="flex-1 py-4 bg-brand-dark/5 hover:bg-brand-dark/10 text-brand-dark rounded-2xl font-bold transition-all border border-brand-dark/5 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="flex-1 py-4 bg-brand-accent hover:bg-brand-primary text-white rounded-2xl font-bold transition-all shadow-lg shadow-brand-accent/20 active:scale-95 text-sm"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
