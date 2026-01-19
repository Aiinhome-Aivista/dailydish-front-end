import { Mail, Lock, User } from 'lucide-react';
import logo from '../../../assets/Vector.svg';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();
  return (
    <div className='bg-[#435334] min-h-screen w-full flex justify-center items-center p-4'>
      <div className='w-full max-w-md bg-white/10 backdrop-blur-xl border-3 border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6'>

        {/* Header */}
        <div className='text-center'>
          <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className='text-white text-3xl font-bold mb-2'>DailyDish</h1>
          <p className='text-white/80 text-sm'>Create your account</p>
        </div>

        {/* Form */}
        <div className='w-full flex flex-col gap-4'>
          {/* Full Name */}
          <div className='relative group'>
            <User className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type='text'
              placeholder='Full Name'
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
          </div>

          {/* Email */}
          <div className='relative group'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type='email'
              placeholder='Email Address'
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
          </div>

          {/* Password */}
          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type='password'
              placeholder='Password'
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
          </div>

          {/* Confirm Password */}
          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type='password'
              placeholder='Confirm Password'
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
          </div>
        </div>

        {/* Actions */}
        <div className='w-full flex flex-col gap-4 mt-2'>
          <button className='w-full py-3.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition shadow-lg border border-white/10 active:scale-[0.98]'>
            Sign Up
          </button>

          <p className='text-white/70 text-sm text-center'>
            Already have an account? <button className='text-white font-semibold hover:underline hover:text-white/90'
              onClick={() => navigate('/login')}>Login</button>
          </p>
        </div>

      </div>
    </div>
  )
}

export default SignUp