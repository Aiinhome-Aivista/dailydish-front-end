import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  Star,
  XCircle,
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminPostService, type AdminPost } from '../api/adminPostService';
import { useToast } from '../../../shared/context/ToastContext';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';
import { BASE_URL } from '../../../config/endpoints';
import RejectPostModal from '../components/modal/RejectPostModal';
import DeleteConfirmationModal from '../components/modal/DeleteConfirmationModal';
import { useOutletContext } from 'react-router-dom';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  // Modal State
  const [postToReject, setPostToReject] = useState<AdminPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<AdminPost | null>(null);
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

  const handleViewPost = (post: AdminPost) => {
    navigate(`/admin/view-post/${post.id}`, { state: { post } });
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
    <div className="h-full">
      {/* Dashboard View */}
      <section className="p-6 lg:p-10">
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
            <div className="py-32 flex flex-col items-center justify-center text-center">
              <h3 className="text-2xl font-bold mb-2">No {activeTab} posts found</h3>

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
                          <div className="flex flex-col gap-3 flex-1">
                            <button
                              onClick={() => handleViewPost(post)}
                              className="w-full flex items-center justify-center gap-2 text-brand-accent text-[10px] font-bold uppercase tracking-widest hover:underline transition-all py-2"
                            >
                              <Eye size={14} /> View Post
                            </button>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApprove(post.id)}
                                className="flex-1 py-3 bg-brand-accent hover:bg-brand-primary text-white rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all shadow-lg shadow-brand-accent/20 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                              <button
                                onClick={() => setPostToReject(post)}
                                className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all border border-red-500/20 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <button
                              onClick={() => handleViewPost(post)}
                              className="flex items-center gap-2 text-brand-accent text-xs font-bold uppercase tracking-widest hover:underline transition-all"
                            >
                              <Eye size={16} /> View Post
                            </button>
                      
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

      <RejectPostModal
        isOpen={!!postToReject}
        onClose={() => setPostToReject(null)}
        onConfirm={(reason) => postToReject && handleReject(postToReject.id, reason)}
        post={postToReject}
      />

 

    </div >
  );
};

export default AdminDashboard;
