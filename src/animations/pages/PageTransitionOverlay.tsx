import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import Logo from '../../assets/icons/Recipe logo.svg';

interface PageTransitionOverlayProps {
  isTransitioning: boolean;
}

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
        style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
      />
      <svg
        width="120"
        height="120"
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        style={{ color: '#F2F0E4', animation: 'bounce-in 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards' }}
      >
        {/* Smoke Group */}
        <g style={{ transformOrigin: 'bottom' }}>
          <path
            d="M75 60 C 70 50, 80 40, 75 30"
            stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
            style={{ animation: 'smoke-rise 3s ease-in-out infinite', animationDelay: '0.2s' }}
          />
          <path
            d="M100 65 C 95 50, 110 40, 100 25"
            stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
            style={{ animation: 'smoke-rise 3s ease-in-out infinite', animationDelay: '1.2s' }}
          />
          <path
            d="M125 60 C 120 50, 130 40, 125 30"
            stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round"
            style={{ animation: 'smoke-rise 3s ease-in-out infinite', animationDelay: '0.7s' }}
          />
        </g>
        {/* Bowl Image */}
        <g style={{ animation: 'float 4s ease-in-out infinite' }}>
          <image
            href={Logo}
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

const PageTransitionOverlay = ({ isTransitioning }: PageTransitionOverlayProps) => {
  // 5 panels for the staggered effect
  const panels = [0, 1, 2, 3, 4];

  // Animation variants for the panels
  const panelVariants: Variants = {
    initial: { y: "100%" },
    animate: (i: number) => ({
      y: 0,
      transition: {
        duration: 1.5,
        ease: [0.76, 0, 0.24, 1],
        delay: i * 0.1,
      },
    }),
    exit: (i: number) => ({
      y: "-100%",
      transition: {
        duration: 1.5,
        ease: [0.76, 0, 0.24, 1],
        delay: i * 0.1,
      },
    }),
  };

  // Animation variants for the logo
  const logoVariants: Variants = {
    initial: { opacity: 0, scale: 0.8, y: 20 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 1.0,
        ease: "easeOut",
      } as any,
    },
    exit: {
      opacity: 0,
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      } as any,
    },
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none flex overflow-hidden">
      <AnimatePresence>
        {isTransitioning && (
          <>
            {/* Staggered Panels */}
            {panels.map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={panelVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="h-full w-[20vw] bg-linear-to-b from-brand-dark to-[#7A8F63]"
              />
            ))}

            {/* Centered Logo Reveal */}
            <div className="absolute inset-0 flex items-center justify-center z-101">
              <motion.div
                variants={logoVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="flex flex-col items-center gap-4"
              >
                <div className="">
                  <AnimatedLogo />
                </div>
                <span className="text-white font-bold text-3xl tracking-tight drop-shadow-lg">
                  DailyDish
                </span>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageTransitionOverlay;
