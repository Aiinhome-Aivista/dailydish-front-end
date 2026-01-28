import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, X } from 'lucide-react';
import logo from '../../../assets/icons/Recipe logo.svg';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../../../shared/context/ToastContext';

import { useNavigate } from 'react-router-dom';
import { generateRecipes } from '../../pantry/api/recipeConfigurationService';
import type { RecipeGenerationRequest } from '../../pantry/types/recipeConfiguration';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

function LoginModal({ isOpen, onClose, onSwitchToSignUp }: LoginModalProps) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await login({ email, password });
      showToast('success', 'Success', 'Login Successful!');

      // Check for pending recipe data
      const pendingData = localStorage.getItem('pending_recipe_data');
      if (pendingData) {
        try {
          const parsedData = JSON.parse(pendingData);
          localStorage.removeItem('pending_recipe_data');

          // Construct Payload 
          const payload: RecipeGenerationRequest = {
            ingredients: parsedData.ingredients || [],
            cuisine_preference: (parsedData.cuisine as string) || 'Any',
            number_of_people: Number(parsedData.number_of_people || 2),
            cooking_time: (parsedData.cooking_time as string) || '30m',
            cooking_preference: (parsedData.meal_type as string) || 'Daily'
          };

          showToast('info', 'Generating', 'Preparing your AI Menu...');
          const response = await generateRecipes(payload);

          if (response && response.status === 'success') {
            const recipes = response.data?.recipes || response.data?.data?.recipes || [];
            onClose();
            navigate('/ai-curated-menu', { state: { recipes } });
          } else {
            showToast('error', 'Generation Failed', 'Could not generate recipes from saved chat.');
            onClose();
          }
        } catch (e) {
          onClose();
        }
      } else {
        onClose();
      }
    } catch (err) {
      // Error is handled by the auth context
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
      <div className='relative w-full max-w-md rounded-3xl border border-white/30 bg-white/10 p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center gap-6'>
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-white/60 hover:text-white transition-colors'
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
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              Don't have an account? <button
                type='button'
                className='text-white font-semibold hover:underline hover:text-white/90 cursor-pointer'
                onClick={onSwitchToSignUp}
              >
                Sign Up
              </button>
            </p>
          </div>
        </form>

      </div>
    </div>
  )
}

export default LoginModal
