import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import RecipeLogo from "../../../assets/icons/Recipe logo.svg";
import ChatModal from "../../../components/modal/pages/ChatModal";
import AnimatedChef from "../../../assets/animated_chef-removebg-preview.png";
import Image1 from "../../../assets/1.svg";
import Image2 from "../../../assets/2.svg";
import Image3 from "../../../assets/3.svg";
import { useNavigate } from "react-router-dom";
import LogoLoop from "../../../animations/pages/LogoLoop";
import { motion } from "framer-motion";
import BlurText from "../../../animations/pages/BlurText";
import ShinyText from "../../../animations/pages/ShinyText";

interface FirstSectionProps {
  onGetStarted?: () => void;
}

const FirstSection = ({ onGetStarted }: FirstSectionProps) => {
  const [isFridgeComplete, setIsFridgeComplete] = useState(false);
  const [isFeastComplete, setIsFeastComplete] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  // Typewriter animation state
  const [placeholderText, setPlaceholderText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = "Hi, I'm Dr. Foodie your food expert. How can I help you today?";
  const typingSpeed = 50;
  const deletingSpeed = 30;
  const pauseDuration = 2000;

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing
        if (placeholderText.length < fullText.length) {
          setPlaceholderText(fullText.slice(0, placeholderText.length + 1));
          timer = setTimeout(handleTyping, typingSpeed);
        } else {
          // Finished typing, pause before deleting
          timer = setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting
        if (placeholderText.length > 0) {
          setPlaceholderText(fullText.slice(0, placeholderText.length - 1));
          timer = setTimeout(handleTyping, deletingSpeed);
        } else {
          // Finished deleting, start typing again
          setIsDeleting(false);
          timer = setTimeout(handleTyping, 500);
        }
      }
    };

    timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting]);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleGenerateRecipe = (data: any) => {
    setIsChatOpen(false);

    // Save data for post-login generation
    localStorage.setItem('pending_chat_context', JSON.stringify(data));

    // Open login modal
    if (onGetStarted) {
      onGetStarted();
    }
  };

  return (
    <div className="relative pt-16 pb-24 px-4 overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 flex pointer-events-none">
        <div className="flex-1 relative">
          <img src={Image1} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 relative">
          <img src={Image2} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 relative">
          <img src={Image3} alt="" className="w-full h-full object-cover" />
        </div>
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <div className="mb-6 scroll-animate scroll-animate-scale cursor-pointer" onClick={() => navigate("/")}>
          <LogoLoop
            items={[RecipeLogo]}
            speed={0}
            logoHeight={96}
            width="auto"
            renderItem={(item) => (
              <motion.img
                src={item as string}
                alt="Bowl"
                className="w-24 h-24 filter drop-shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              />
            )}
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-10 overflow-visible flex flex-col items-center gap-0">
          {!isFridgeComplete ? (
            <BlurText
              text="Turn Your Fridge"
              delay={0.05}
              initialDelay={0}
              animateBy="words"
              direction="top"
              as="span"
              className="text-brand-beige drop-shadow-md leading-tight"
              onAnimationComplete={() => setIsFridgeComplete(true)}
            />
          ) : (
            <ShinyText
              text="Turn Your Fridge"
              disabled={false}
              speed={3}
              className="text-brand-beige leading-tight"
              color="#FAF1E4"
              shineColor="#95B974"
            />
          )}

          {!isFeastComplete ? (
            <BlurText
              text="Into a Feast."
              delay={0.05}
              initialDelay={0.2}
              animateBy="words"
              direction="bottom"
              as="span"
              className="overflow-visible pb-2 mt-[-0.05em]"
              itemClassName="bg-linear-to-r from-brand-beige to-brand-light bg-clip-text text-transparent drop-shadow-sm"
              start={true}
              onAnimationComplete={() => setIsFeastComplete(true)}
            />
          ) : (
            <ShinyText
              text="Into a Feast."
              disabled={false}
              speed={3}
              className="overflow-visible pb-2 mt-[-0.05em]"
              color="#CEEBDD"
              shineColor="#435334"
            />
          )}
        </h1>
        <BlurText
          text="Enter your ingredients and let us craft the perfect recipe tailored to your cuisine preference and nutritional needs."
          delay={0.015}
          initialDelay={0.4}
          animateBy="words"
          direction="top"
          className="text-brand-beige text-center text-base md:text-xl max-w-2xl mb-12 font-medium drop-shadow-sm"
        />

        <div className="w-full max-w-2xl relative scroll-animate delay-2">

          <div className="absolute left-2 top-7 -translate-y-1/2 z-20 
            rounded-full overflow-hidden backdrop-blur-md shadow-lg 
            flex items-center justify-center w-8 h-8 bg-brand-dark">
            <img
              src={AnimatedChef}
              alt="Dr. Foodie"
              className="w-full h-full object-cover translate-y-1"
            />
          </div>

          {/* Textarea */}
          <textarea
            onClick={handleOpenChat}
            placeholder={placeholderText}
            readOnly
            rows={1}
            className="
        w-full
        h-14
        pl-12
        pr-32
        rounded-xl
        bg-[#F5F9ED]/90
        backdrop-blur-md
        resize-none
        cursor-pointer
        text-[15px]
        leading-14
        font-medium
        text-[#2C3E14]
        placeholder:text-brand-dark/70
        focus:outline-none
        focus:ring-2
        focus:ring-[#A2B886]
        shadow-xl
        transition-all
      "
          />

          {/* Generate Button */}
          <button
            onClick={handleOpenChat}
            className="
        absolute
        right-2
        bottom-3
        top-2
        bg-[#2C3E14]
        text-[#F5F9ED]
        px-3
        rounded-lg
        font-bold
        flex
        items-center
        gap-2
        hover:bg-[#3A4A28]
        hover:scale-105
        active:scale-95
        transition-all
        cursor-pointer
        shadow-md
      "
          >
            Generate <Sparkles size={16} />
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        onGenerateRecipe={handleGenerateRecipe}
      />
    </div>
  );
};

export default FirstSection;
