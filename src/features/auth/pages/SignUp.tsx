import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import logo from '../../../assets/icons/Recipe logo.svg';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import { useToast } from '../../../shared/context/ToastContext';

function SignUp() {
  const navigate = useNavigate();
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
        navigate("/login", { state: { successMessage: response.message || "Registration Successful!" } });
      } else {
        setError(response?.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-[#435334] h-screen w-full flex justify-center items-center p-4'>
      <div className='w-full max-w-md rounded-3xl border-3 border-[#FFFFFF40] bg-white/10 p-6 shadow-2xl backdrop-blur-lg flex flex-col items-center gap-6'>

        {/* Header */}
        <div className='text-center'>
          <img src={logo} alt="Logo" className="w-18 h-18 mx-auto mb-4" />
          <h1 className='text-[#FAF1E4] text-3xl font-bold mb-2'>DailyDish</h1>
          <p className='text-white/80 text-sm'>Everyday ingredients. Everyday magic</p>
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
            {/* <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} /> */}
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
              className='w-full py-3.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition shadow-lg border border-white/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <p className='text-white/70 text-sm text-center'>
              Already have an account? <button type='button' className='text-white font-semibold hover:underline hover:text-white/90 cursor-pointer'
                onClick={() => navigate('/login')}>Login</button>
            </p>
          </div>
        </form>

      </div>
    </div>
  )
}

export default SignUp