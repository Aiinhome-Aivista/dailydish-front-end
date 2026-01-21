import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import cookerIcon from "../../../assets/cooker.svg";

// --- SUB COMPONENT: THE ULTIMATE LOGO ---
const AnimatedCooker = () => {
  return (
    <div className="relative flex justify-center items-center">
      {/* 1. AMBIENT GLOW BEHIND LOGO (New!) */}
      <div 
        className="absolute w-32 h-32 bg-[#E6E6D8] rounded-full blur-3xl -z-10"
        style={{ animation: 'glow-pulse 4s ease-in-out infinite' }}
      />

      <svg
        width="160" // Increased slightly for impact
        height="160"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        {/* SMOKE ANIMATION */}
        <g style={{ color: '#435334', transformOrigin: 'bottom' }}>
          <path
            d="M75 60 C 70 50, 80 40, 75 30"
            stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"
            className="smoke-path"
            style={{ animationDelay: '0.2s' }}
          />
          <path
            d="M100 65 C 95 50, 110 40, 100 25"
            stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"
            className="smoke-path"
            style={{ animationDelay: '1.2s' }}
          />
          <path
            d="M125 60 C 120 50, 130 40, 125 30"
            stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round"
            className="smoke-path"
            style={{ animationDelay: '0.7s' }}
          />
        </g>

        {/* COOKER IMAGE */}
        <g className="floater">
          <image 
            href={cookerIcon} 
            width="120" 
            height="120" 
            x="40" 
            y="60"
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
    </div>
  );
};

// --- MAIN COMPONENT ---
const FirstSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4 overflow-hidden relative">
      
      {/* --- ADVANCED ANIMATION STYLES --- */}
      <style>{`
        /* 1. LOGO ENTRANCE: Elastic Spring Effect */
        @keyframes elasticPop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.15); opacity: 1; }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }

        /* 2. TEXT ENTRANCE: Cinematic Blur + Slide */
        @keyframes blurInUp {
          0% { 
            opacity: 0; 
            transform: translateY(30px); 
            filter: blur(10px); /* Starts blurry */
          }
          100% { 
            opacity: 1; 
            transform: translateY(0); 
            filter: blur(0); /* Ends sharp */
          }
        }

        /* 3. AMBIENT GLOW PULSE */
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }

        /* 4. SMOKE & FLOAT (Standard) */
        @keyframes smoke-rise {
          0% { transform: translateY(0) scaleX(1); opacity: 0; }
          30% { opacity: 0.6; }
          100% { transform: translateY(-35px) scaleX(1.3); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        /* --- CLASSES --- */
        .logo-enter {
          opacity: 0;
          animation: elasticPop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .content-enter {
          opacity: 0;
          animation: blurInUp 1s ease-out forwards;
        }

        .smoke-path {
          animation: smoke-rise 3.5s ease-in-out infinite;
          opacity: 0;
        }

        .floater {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>

      {/* 1. LOGO SECTION */}
      <div className="mb-8 logo-enter" style={{ animationDelay: '0ms' }}>
         <AnimatedCooker />
      </div>

      {/* 2. MAIN TITLE */}
      <h1 
        className="text-5xl md:text-7xl font-bold text-center mb-10 leading-none text-brand-dark content-enter"
        style={{ animationDelay: '800ms' }}
      >
        Turn Your Fridge
        <br />
        <span className="bg-linear-to-r from-brand-dark to-brand-accent bg-clip-text text-transparent leading-none">
          Into a Feast.
        </span>
      </h1>

      {/* 3. SUBTITLE */}
      <p 
        className="text-brand-accent text-center text-base md:text-xl max-w-2xl mb-12 font-medium content-enter"
        style={{ animationDelay: '1000ms' }}
      >
        Enter your ingredients and let our AI craft the perfect recipe tailored
        to your cuisine preference and nutritional needs.
      </p>

      {/* 4. INPUT SECTION (With added hover interactions) */}
      <div 
        className="w-full max-w-2xl relative content-enter"
        style={{ animationDelay: '1200ms' }}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <span className="material-symbols-outlined text-brand-dark text-[24px]">
            menu_book_2
          </span>
        </div>
        
        <input 
          type="text"
          placeholder="Enter Ingredients (e.g. Tomato, Garlic, Chicken...)"
          className="font-normal w-full pl-12 pr-32 py-4 rounded-lg bg-brand-light/50 border border-transparent 
                     focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:bg-white focus:shadow-lg
                     transition-all duration-300 placeholder-[#435334]/70 text-[#435334]"
        />

        <button
          onClick={() => navigate("/login")}
          className="absolute right-2 top-2 bottom-2 bg-brand-dark text-brand-beige px-6 rounded-md font-bold flex items-center gap-2 
                     hover:bg-opacity-90 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shadow-md hover:shadow-xl"
        >
          Generate <Sparkles size={16} className="animate-pulse"/>
        </button>
      </div>
    </div>
  );
};

export default FirstSection;