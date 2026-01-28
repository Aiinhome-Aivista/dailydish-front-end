import { Sparkles } from "lucide-react";
import { useState } from "react";
import cookerIcon from "../../../assets/cooker.svg";
import ChatModal from "./ChatModal";

interface FirstSectionProps {
  onGetStarted?: () => void;
}

const FirstSection = ({ onGetStarted }: FirstSectionProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleOpenChat = () => {
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  const handleGenerateRecipe = () => {
    setIsChatOpen(false);
    // Open login modal
    if (onGetStarted) {
      onGetStarted();
    }
  };
  return (
    <div className="flex flex-col items-center pt-16 pb-24 px-4">
      <div className="mb-6 animate-bounce-slow">
        <img src={cookerIcon} alt="Bowl" className="w-24 h-24" />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold text-center mb-10 leading-none text-brand-dark">
        Turn Your Fridge
        <br />
        <span className="bg-linear-to-r from-brand-dark to-brand-accent bg-clip-text text-transparent leading-none">
          Into a Feast.
        </span>
      </h1>
      <p className="text-brand-accent text-center text-base md:text-xl max-w-2xl mb-12 font-medium">
        Enter your ingredients and let our AI craft the perfect recipe tailored
        to your cuisine preference and nutritional needs.
      </p>

      <div className="w-full max-w-2xl relative">
        {/* Left Icon */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <span className="material-symbols-outlined text-brand-dark text-[24px]">
            menu_book_2
          </span>
        </div>

        {/* Textarea */}
        <textarea
          onClick={handleOpenChat}
          placeholder="Hi, I'm Dr. Foodi—your food expert. How can I help you today?"
          readOnly
          rows={1}
          className="
      w-full
      h-12
      pl-12
      pr-28
      rounded-lg
      bg-brand-light
      resize-none
      cursor-pointer
      text-[15px]
      leading-[3rem]
      placeholder:text-[#435334]
      focus:outline-none
      focus:ring-2
      focus:ring-brand-dark/20
    "
        />

        {/* Generate Button */}
        <button
          onClick={handleOpenChat}
          className="
      absolute
      right-2
     bottom-4
      h-8
      bg-brand-dark
      text-brand-beige
      px-3
      rounded-md
      font-bold
      flex
      items-center
      gap-2
      hover:bg-opacity-90
      transition-all
      cursor-pointer
    "
        >
          Generate <Sparkles size={16} />
        </button>
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
