import { Sparkles } from "lucide-react";
import { useState } from "react";

import RecipeLogo from "../../../assets/icons/Recipe logo.svg";
import ChatModal from "./ChatModal";

interface FirstSectionProps {
  onGetStarted?: () => void;
}



// ... existing imports

// Imports
import Image1 from "../../../assets/1.svg";
import Image2 from "../../../assets/2.svg";
import Image3 from "../../../assets/3.svg";

const FirstSection = ({ onGetStarted }: FirstSectionProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

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
        <div className="mb-6 animate-bounce-slow">
          <img src={RecipeLogo} alt="Bowl" className="w-24 h-24 filter drop-shadow-lg" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-center mb-10 leading-none text-[#FAF1E4] drop-shadow-md">
          Turn Your Fridge
          <br />
          <span className="bg-linear-to-r from-[#FAF1E4] to-[#CEDEBD] bg-clip-text text-transparent leading-none">
            Into a Feast.
          </span>
        </h1>
        <p className="text-[#FAF1E4] text-center text-base md:text-xl max-w-2xl mb-12 font-medium drop-shadow-sm">
          Enter your ingredients and let our craft the perfect recipe tailored
          to your cuisine preference and nutritional needs.
        </p>

        <div className="w-full max-w-2xl relative">
          {/* Left Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
            <span className="material-symbols-outlined text-[#435334] text-[24px]">
              menu_book_2
            </span>
          </div>

          {/* Textarea */}
          <textarea
            onClick={handleOpenChat}
            placeholder="Hi, I'm Dr. Foodie your food expert. How can I help you today?"
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
        leading-[3.5rem]
        font-medium
        text-[#2C3E14]
        placeholder:text-[#435334]/70
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
