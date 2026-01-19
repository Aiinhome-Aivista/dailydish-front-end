import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';
import logo from '../../../assets/icons/Recipe logo.svg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await login({ email, password });

      navigate('/recipe-configuration');
    } catch (err) {

    }
  };

  return (
    <div className='bg-[#435334] h-screen w-full flex justify-center items-center p-4'>
      <div className='w-full max-w-md rounded-3xl border-3 border-[#FFFFFF40] bg-white/10 p-8 shadow-2xl backdrop-blur-lg flex flex-col items-center gap-6'>

        {/* Header */}
        <div className='text-center'>
          <img src={logo} alt="Logo" className="w-18 h-18 mx-auto mb-4" />
          <h1 className='text-[#FAF1E4] text-3xl font-bold mb-2'>DailyDish</h1>
          <p className='text-white/80 text-sm'>Everyday ingredients. Everyday magic</p>
        </div>

        {/* Error Message */}
        {(error || localError) && (
          <div className="w-full bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-center">
            <p className="text-white text-sm">{error || localError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='w-full flex flex-col gap-4'>
          <div className='relative group'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type='email'
              placeholder='Email Address'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
          </div>
          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type='password'
              placeholder='Password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
          </div>

          {/* Actions */}
          <div className='w-full flex flex-col gap-4 mt-2'>
            <button
              type="submit"
              disabled={isLoading}
              className='w-full py-3.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition shadow-lg border border-white/10 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            <p className='text-white/70 text-sm text-center'>
              You don't have account? <button type='button' className='text-white font-semibold hover:underline hover:text-white/90 cursor-pointer'
                onClick={() => navigate('/signup')}>Signup</button>
            </p>
          </div>
        </form>

      </div>
    </div>
  )
}

export default Login