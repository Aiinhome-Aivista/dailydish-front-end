import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, X } from 'lucide-react';
import logo from '../../../assets/icons/Recipe logo.svg';
import { authService } from '../api/authService';
import { useToast } from '../../../shared/context/ToastContext';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

function SignUpModal({ isOpen, onClose, onSwitchToLogin }: SignUpModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData);
      if (response && response.status === 'success') {
        showToast('success', 'Success', response.message || "Registration Successful!");
        // Switch to login modal
        onSwitchToLogin();
      } else {
        setError(response?.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center p-4 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className='relative w-full max-w-md rounded-3xl border border-white/30 bg-white/10 p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-6 max-h-[90vh] overflow-y-auto'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-white/60 hover:text-white transition-colors z-10 cursor-pointer'
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className='text-center'>
          <img src={logo} alt="Logo" className="w-16 h-16 mx-auto mb-3" />
          <h1 className='text-white text-2xl font-bold mb-1'>DailyDish</h1>
          <p className='text-white/70 text-sm'>Everyday ingredients. Everyday magic</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center">
            <p className="text-white text-sm">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
          {/* Full Name */}
          <div className='relative group'>
            <User className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type='text'
              name='username'
              placeholder='Full Name'
              value={formData.username}
              onChange={handleChange}
              required
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
          </div>

          {/* Email */}
          <div className='relative group'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type='email'
              name='email'
              placeholder='Email Address'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
          </div>

          {/* Password */}
          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder='Password'
              value={formData.password}
              onChange={handleChange}
              required
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name='confirm_password'
              placeholder='Confirm Password'
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Actions */}
          <div className='w-full flex flex-col gap-4 mt-2'>
            <button
              type="submit"
              disabled={loading}
              className='w-full py-3.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition shadow-lg border border-white/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <p className='text-white/70 text-sm text-center'>
              Already have an account? <button 
                type='button' 
                className='text-white font-semibold hover:underline hover:text-white/90 cursor-pointer'
                onClick={onSwitchToLogin}
              >
                Login
              </button>
            </p>
          </div>
        </form>

      </div>
    </div>
  )
}

export default SignUpModal
