import React from 'react';
import { Mail, Lock } from 'lucide-react';
import logo from '../../../assets/Vector.svg';

function Login() {
  return (
    <div className='bg-[#435334] min-h-screen w-full flex justify-center items-center p-4'>
      <div className='w-full max-w-md bg-white/10 backdrop-blur-xl border-3 border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-6'>

        {/* Header */}
        <div className='text-center'>
          <img src={logo} alt="Logo" className="w-24 h-24 mx-auto mb-4" />
          <h1 className='text-white text-3xl font-bold mb-2'>DailyDish</h1>
          <p className='text-white/80 text-sm'>Everyday ingredients. Everyday magic</p>
        </div>

        {/* Social Login Placeholders */}



        {/* Form */}
        <div className='w-full flex flex-col gap-4'>
          <div className='relative group'>
            <Mail className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type='email'
              placeholder='User Name'
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
          </div>
          <div className='relative group'>
            <Lock className='absolute left-4 top-1/2 -translate-y-1/2 text-white/60 group-focus-within:text-white transition-colors' size={20} />
            <input
              type='password'
              placeholder='Password'
              className='w-full bg-white/5 border border-white/30 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/80 focus:bg-white/10 transition-all'
            />
          </div>
        </div>

        {/* Actions */}
        <div className='w-full flex flex-col gap-4 mt-2'>
          <button className='w-full py-3.5 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold transition shadow-lg border border-white/10 active:scale-[0.98]'>
            Login
          </button>

          <p className='text-white/70 text-sm text-center'>
            You don't have account? <a href='#' className='text-white font-semibold hover:underline hover:text-white/90'
            >Signup</a>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Login