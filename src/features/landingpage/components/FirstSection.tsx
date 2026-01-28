

import { Sparkles } from "lucide-react";
import cookerIcon from "../../../assets/cooker.svg";

interface FirstSectionProps {
  onGetStarted?: () => void;
}

const FirstSection = ({ onGetStarted }: FirstSectionProps) => {
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

      <div className="w-full max-w-2xl relative ">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <span className="material-symbols-outlined text-brand-dark text-[24px]">
            menu_book_2
          </span>
        </div>
        <textarea
          placeholder={`Hi, I’m Dr. Foodi—your food expert. How can I help you 
today? Enter ingredients (e.g. Tomato, Garlic, Chicken...)`}
          rows={2}
          className="font-normal w-full pl-12  py-1 rounded-lg placeholder:[#435334] focus:outline-none focus:ring-2 focus:ring-brand-dark/20 bg-brand-light resize-none"
        />

        <button
          onClick={onGetStarted}
          className="absolute right-2 top-2 bottom-4 bg-brand-dark text-brand-beige px-2 rounded-md font-bold flex items-center gap-2 hover:bg-opacity-90 transition-all cursor-pointer"
        >
          Generate <Sparkles size={16} />
        </button>
      </div>
    </div>
  );
};

export default FirstSection;
