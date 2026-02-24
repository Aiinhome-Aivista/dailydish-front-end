import { useState, useEffect } from 'react';
import { Eye, EyeOff, RefreshCw, LogIn } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f0a]">
      <div className="w-full max-w-[440px] flex flex-col items-center">

        {/* Branding Logo */}
        <div className="mb-2">
          <div className="w-20 h-20  flex items-center justify-center p-4">
            <img src={logo} alt="DailyDish Logo" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-4">
          <h1 className="text-white text-3xl font-bold tracking-tight mb-2 drop-shadow-[0_0_15px_rgba(111,154,78,0.4)]">
            DailyDish Admin Panel
          </h1>
          <p className="text-brand-light/60 text-sm font-medium">Sign in to access your dashboard</p>
        </div>

        {/* Login Card */}
        <div className="w-full bg-[#162416] border border-white/5 rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)]">

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <p className="text-red-400 text-sm text-center font-medium leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-light/40 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <input
                type="email"
                placeholder="admin@dailydish.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0a0f0a] border border-white/5 rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all font-medium"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-light/40 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0f0a] border border-white/5 rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/30 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/30 hover:text-brand-accent transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Captcha Section */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-brand-light/40 uppercase tracking-[0.2em] ml-1">Captcha</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-black/40 bg-[radial-gradient(#ffffff_0.5px,transparent_0.5px)] [background-size:6px_6px] rounded-2xl p-2 flex items-center justify-center min-h-[56px] border border-white/5 shadow-inner relative overflow-hidden">
                  {captchaData ? (
                    (() => {
                      const image = captchaData.captcha_image || (captchaData as any).image;
                      if (image) {
                        const src = image.startsWith('http') || image.startsWith('data:image')
                          ? image
                          : `data:image/png;base64,${image}`;
                        return <img src={src} alt="Captcha" className="max-h-[36px] invert opacity-80 relative z-10" />;
                      }
                      return <span className="text-white font-mono text-xl tracking-[0.3em] relative z-10">{(captchaData as any).captcha}</span>;
                    })()
                  ) : (
                    <div className="w-full h-8 bg-white/5 animate-pulse rounded-lg" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={fetchCaptcha}
                  disabled={isRefreshingCaptcha}
                  className="p-4 bg-[#0a0f0a] hover:bg-white/5 text-brand-accent rounded-2xl border border-white/5 transition-all shadow-lg disabled:opacity-50"
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
                className="w-full bg-[#0a0f0a] border border-white/5 rounded-2xl py-4 px-5 text-white placeholder-white/20 focus:outline-none focus:border-brand-accent/50 transition-all text-center tracking-[0.1em]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-accent hover:bg-brand-primary text-white rounded-2xl font-bold text-lg transition-all shadow-[0_15px_30px_-5px_rgba(111,154,78,0.4)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <RefreshCw className="animate-spin text-white" size={24} />
              ) : (
                <>
                  <LogIn size={24} />
                  Login
                </>
              )}
            </button>
          </form>

          {/* Status Indicator */}

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
