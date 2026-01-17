import BowlIcon from "../assets/Layer 3.svg";

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Outer rounded container */}
      <div className="w-[96%] h-[92vh] bg-olive rounded-2xl flex flex-col items-center justify-center relative">

        {/* Center content */}
        <div className="text-center">
          <BowlIcon />

          <h1 className="mt-4 text-3xl font-semibold text-lightOlive">
            DailyDish
          </h1>

          <p className="mt-1 text-sm text-[#E6E6D8] opacity-80">
            Everyday ingredients. Everyday magic.
          </p>
        </div>

        {/* Footer */}
        <p className="absolute bottom-6 text-xs text-[#E6E6D8] opacity-40">
          ©2020 AiInhome Technologies Pvt. Ltd. All rights reserved
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;
