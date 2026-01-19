import React from 'react';
import LogoSvg from '../../../assets/Vector.svg';
const AnimatedLogo = () => {
  return (
    <div className="relative flex justify-center items-center">
      <style>{`
        @keyframes smoke-rise {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          30% { opacity: 0.8; }
          100% { transform: translateY(-25px) scaleX(1.2); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
      `}</style>
      <div 
        className="absolute w-24 h-24 bg-[#E6E6D8] rounded-full blur-2xl -z-10 top-8"
        style={{animation: 'glow-pulse 3s ease-in-out infinite'}}
      />
      <svg
        width="120"
        height="120"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{color: '#F2F0E4', animation: 'bounce-in 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards'}}
      >
        {/* Smoke Group */}
        <g style={{transformOrigin: 'bottom'}}>
          <path
            d="M75 60 C 70 50, 80 40, 75 30"
            stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
            style={{animation: 'smoke-rise 3s ease-in-out infinite', animationDelay: '0.2s'}}
          />
          <path
            d="M100 65 C 95 50, 110 40, 100 25"
            stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
            style={{animation: 'smoke-rise 3s ease-in-out infinite', animationDelay: '1.2s'}}
          />
          <path
            d="M125 60 C 120 50, 130 40, 125 30"
            stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
            style={{animation: 'smoke-rise 3s ease-in-out infinite', animationDelay: '0.7s'}}
          />
        </g>
        {/* Bowl Image - Replace with your uploaded icon */}
        <g style={{animation: 'float 4s ease-in-out infinite'}}>
          <image 
            href={LogoSvg} 
            width="120" 
            height="80" 
            x="40" 
            y="80"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
    </div>
  );
};


const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-[#435334] flex items-center justify-center overflow-hidden">
      <div className="w-[96%] h-[92vh] bg-olive rounded-2xl flex flex-col items-center justify-center relative shadow-2xl">
        
        {/* Main Content */}
        <div className="text-center z-10">
          <AnimatedLogo />

          {/* Title with staggered slide-up reveal */}
          <h1 className=" text-4xl font-bold text-[#95B974] animate-[fade-in-up_1s_ease-out_0.5s_both]">
            DailyDish
          </h1>

          {/* Subtitle with longer delay */}
          <p className="mt-2 text-sm text-[#CEDEBD] opacity-80 tracking-wide animate-[fade-in-up_1s_ease-out_0.8s_both]">
            Everyday ingredients. Everyday magic.
          </p>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs text-[#E6E6D8] opacity-30 animate-pulse">
          ©2020 AiInhome Technologies Pvt. Ltd. All rights reserved
        </p>
      </div>

      {/* Add global utility keyframe for the text slide-up */}
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;