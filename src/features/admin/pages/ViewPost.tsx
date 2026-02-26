import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Check, Star, CheckCircle, XCircle } from 'lucide-react';
import { adminPostService, type AdminPost } from '../api/adminPostService';
import { useToast } from '../../../shared/context/ToastContext';
import defaultRecipeImage from '../../../assets/Recipe_default_image.webp';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';
import { BASE_URL } from '../../../config/endpoints';

const ViewPost = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [post, setPost] = useState<AdminPost | null>(location.state?.post || null);
  const [loading, setLoading] = useState(!post);
  const [error, setError] = useState<string | null>(null);

  const fetchPostDetails = async () => {
    if (!postId) return;
    setLoading(true);
    try {
      // Since there's no getPostById in adminPostService yet, we fetch all and find
      // This is a workaround until a proper backend endpoint is available
      const response = await adminPostService.getPosts();
      if (response?.status === 'success') {
        const found = response.data.find(p => p.id === Number(postId));
        if (found) {
          setPost(found);
        } else {
          // Try approved posts
          const approvedRes = await adminPostService.getCommunityFeed();
          const foundApproved = approvedRes.data.find(p => p.id === Number(postId));
          if (foundApproved) {
            setPost(foundApproved);
          } else {
            // Try rejected posts
            const rejectedRes = await adminPostService.getRejectedPosts();
            const foundRejected = rejectedRes.data.find(p => p.id === Number(postId));
            if (foundRejected) {
              setPost(foundRejected);
            } else {
              setError('Post not found');
            }
          }
        }
      }
    } catch (err) {
      setError('Failed to load post details');
      showToast('error', 'Error', 'Failed to fetch post details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!post) {
      fetchPostDetails();
    }
  }, [postId]);

  const handleApprove = async () => {
    if (!post) return;
    try {
      await adminPostService.approvePost(post.id);
      showToast('success', 'Success', 'Post approved successfully');
      navigate('/admin/dashboard');
    } catch (error) {
      showToast('error', 'Error', 'Failed to approve post');
    }
  };

  const handleReject = async () => {
    // Here you might want to open a modal for reason, but for simplicity:
    if (!post) return;
    const reason = prompt("Enter rejection reason:");
    if (reason === null) return;
    try {
      await adminPostService.rejectPost(post.id, reason);
      showToast('warn', 'Rejected', 'Post has been rejected');
      navigate('/admin/dashboard');
    } catch (error) {
      showToast('error', 'Error', 'Failed to reject post');
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return defaultRecipeImage;
    if (url.startsWith('http')) return url;
    const cleanUrl = url.replace(/^\/+/, '');
    return `${BASE_URL.replace(/\/$/, '')}/${cleanUrl}`;
  };

  if (loading) return <div className="h-full flex items-center justify-center p-20"><DailyDishLoader /></div>;
  if (error || !post) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 p-20">
      <p className="text-red-500 font-bold">{error || 'Post not found'}</p>
      <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-brand-dark hover:underline font-bold">
        <ArrowLeft size={20} /> Back to Dashboard
      </button>
    </div>
  );

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto pb-40">
      {/* Header / Nav */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-brand-dark hover:text-brand-accent transition-all font-bold group cursor-pointer"
        >
          <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-brand-accent group-hover:text-white transition-all">
            <ArrowLeft size={22} />
          </div>
          <span className="text-lg">Back to Overview</span>
        </button>

        <div className={`px-6 py-2.5 rounded-full font-black text-xs uppercase tracking-widest shadow-md ${post.status === 'approved' ? 'bg-brand-accent text-white' :
          post.status === 'pending' ? 'bg-yellow-500 text-white' : 'bg-red-500 text-white'
          }`}>
          {post.status}
        </div>
      </div>

      <div className="space-y-16">
        {/* Full Width Hero Image - Ultra Wide Aspect */}
        <div className="relative aspect-[30/10] rounded-[3.5rem] overflow-hidden bg-white/10">
          <img
            src={getImageUrl(post.image_url)}
            alt={post.menu_name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.src = defaultRecipeImage; }}
          />
          <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-brand-dark/10 flex items-center gap-3 shadow-xl">
            <Star size={20} className="text-brand-accent fill-brand-accent" />
            <span className="text-lg font-black text-brand-dark">{(post.rating / 2).toFixed(1)} / 5.0</span>
          </div>
        </div>

        {/* Content Section - Single Column Full Width */}
        <div className="px-4 md:px-10">
          <div className="max-w-5xl"> 
            <h1 className="text-xl md:text-xl lg:text-xl font-black text-brand-dark  pb-4">
              {post.menu_name}
            </h1>

            <div className="flex items-center gap-6 pb-8 border-b border-brand-dark/10">
              <div className="w-12 h-12 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-accent font-black text-2xl border border-brand-accent/20 shadow-sm">
                {post.shared_by?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-lg font-black text-brand-dark uppercase tracking-widest">{post.shared_by}</p>
                <p className="text-base text-brand-primary font-semibold">{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-sm font-black text-brand-accent uppercase tracking-[0.3em] mb-6">User's Post Comment</h3>
              <p className="text-xl md:text-xl font-medium text-brand-dark border-l-[8px] border-brand-accent pl-10 bg-brand-accent/5 py-10 rounded-r-[3rem]">
                "{post.comment}"
              </p>
            </div>
          </div>



          {/* Moderation Actions - STICKY TO THE RIGHT BOTTOM */}
          {post.status === 'pending' && (
            <div className="pt-10 border-t-2 border-dashed border-brand-dark/10 flex flex-col items-end">
              <div className="flex flex-col sm:flex-row gap-8 w-full sm:w-auto">
                <button
                  onClick={handleReject}
                  className="px-8 py-4 bg-white border-2 border-red-500/20 text-red-600 hover:bg-red-500 hover:text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-4 cursor-pointer order-2 sm:order-1"
                >
                  <XCircle size={24} /> Reject Post
                </button>
                <button
                  onClick={handleApprove}
                  className="px-8 py-4 bg-brand-accent hover:bg-brand-primary text-white rounded-[2.5rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-2xl shadow-brand-accent/40 active:scale-95 flex items-center justify-center gap-4 cursor-pointer order-1 sm:order-2"
                >
                  <CheckCircle size={24} /> Approve Post
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPost;