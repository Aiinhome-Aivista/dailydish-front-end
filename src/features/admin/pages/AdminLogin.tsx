import { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../../../assets/icons/Recipe logo.svg';
import { authService } from '../../auth/api/authService';
import { adminAuthService } from '../api/adminauthservice';
import { useToast } from '../../../shared/context/ToastContext';
import type { CaptchaResponse } from '../../auth/types/captcha';

const AdminLogin = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaData, setCaptchaData] = useState<CaptchaResponse | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isRefreshingCaptcha, setIsRefreshingCaptcha] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCaptcha = async () => {
    setIsRefreshingCaptcha(true);
    try {
      const data = await authService.getCaptcha();
      if (data) {
        setCaptchaData(data);
        setCaptcha('');
      }
    } catch (err) {
      console.error('Failed to fetch captcha:', err);
    } finally {
      setIsRefreshingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminAuthService.login({
        email,
        password,
        captcha,
        captcha_id: captchaData?.captcha_id
      });

      if (response && response.status === 'success') {
        const timestamp = Date.now();
        localStorage.setItem('admin_token', response.token);
        localStorage.setItem('admin_user_id', response.admin_id);
        localStorage.setItem('admin_username', response.username);
        localStorage.setItem('admin_role', response.role);
        localStorage.setItem('admin_token_timestamp', timestamp.toString());

        showToast('success', 'Admin Login Successful!', `Welcome back, ${response.username}`);
        navigate('/admin/dashboard');
      } else {
        setError(response?.message || 'Admin login failed');
        fetchCaptcha();
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during admin login');
      fetchCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#435334]">
      <div className="w-full max-w-[480px] flex flex-col items-center">

        {/* Branding & Login Card */}
        <div className="w-full bg-white/10 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-8 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)]">

          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center p-3 mb-4">
              <img src={logo} alt="DailyDish Logo" className="w-full h-full object-contain brightness-0 invert" />
            </div>
            <h1 className="text-white text-3xl font-bold tracking-tight mb-2">
              DailyDish Admin Login
            </h1>
            <p className="text-white/60 text-sm font-medium">Everyday ingredients. Everyday magic</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm text-center font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                <Mail size={20} />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all font-medium"
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors">
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-white placeholder-white/40 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Captcha Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-2xl p-2 flex items-center justify-center min-h-[56px] border border-white/10 relative overflow-hidden">
                  {captchaData ? (
                    (() => {
                      const image = captchaData.captcha_image || (captchaData as any).image;
                      if (image) {
                        const src = image.startsWith('http') || image.startsWith('data:image')
                          ? image
                          : `data:image/png;base64,${image}`;
                        return <img src={src} alt="Captcha" className="max-h-[36px] brightness-0 invert opacity-70 relative z-10" />;
                      }
                      return <span className="text-white/80 font-mono text-xl tracking-[0.3em] relative z-10">{(captchaData as any).captcha}</span>;
                    })()
                  ) : (
                    <div className="w-full h-8 bg-white/5 animate-pulse rounded-lg" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  disabled={isRefreshingCaptcha}
                  className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={22} className={isRefreshingCaptcha ? 'animate-spin' : ''} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Enter captcha code"
                required
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-all text-center tracking-[0.1em]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#7A8F63] hover:bg-[#8CA274] text-white rounded-2xl font-bold text-lg transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin text-white" size={24} />
              ) : (
                <>
                  Login
                </>
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
