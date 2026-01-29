

import React, { useState, useEffect } from "react";

const icons = [
  { icon: "soup_kitchen", color: "#D9D9D9" },
  { icon: "kebab_dining", color: "#D9D9D9" },
  { icon: "bakery_dining", color: "#D9D9D9" },
  { icon: "restaurant", color: "#D9D9D9" },
  { icon: "lunch_dining", color: "#D9D9D9" },
  { icon: "ramen_dining", color: "#D9D9D9" },
  { icon: "local_pizza", color: "#D9D9D9" },
  { icon: "icecream", color: "#D9D9D9" },
  { icon: "local_cafe", color: "#D9D9D9" },
];

const DailyDishLoader: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % icons.length);
    }, 1300);
    return () => clearInterval(interval);
  }, []);

  const getVisibleIcons = () => {
    const visibleItems = [];
    for (let i = -2; i <= 2; i++) {
      const index = (activeIndex + i + icons.length) % icons.length;
      let position = "";
      if (i === -2) position = "far-left";
      else if (i === -1) position = "left";
      else if (i === 0) position = "center";
      else if (i === 1) position = "right";
      else if (i === 2) position = "far-right";

      visibleItems.push({ ...icons[index], key: icons[index].icon, position });
    }
    return visibleItems;
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center text-center space-y-3 z-50">
   
      <div className="relative flex items-center justify-center h-22 w-full">
        {getVisibleIcons().map((item) => (
          <span
            key={item.key}
            className={`material-symbols-outlined absolute transition-all duration-500 ease-in-out
              ${item.position === "center" ? "text-6xl opacity-100 z-20" : ""}
              ${item.position === "left" || item.position === "right" ? "text-3xl z-10" : ""}
              ${item.position === "far-left" || item.position === "far-right" ? "text-xl opacity-0 z-0" : ""}
            `}
            style={{
              transform:
                item.position === "center"
                  ? "translateX(0) translateY(0) scale(1.5)"
                  : item.position === "left"
                  ? "translateX(-70px) translateY(10px) scale(1)"
                  : item.position === "right"
                  ? "translateX(70px) translateY(10px) scale(1)"
                  : item.position === "far-left"
                  ? "translateX(-120px) translateY(25px) scale(0.5)"
                  : "translateX(120px) translateY(25px) scale(0.5)",
              color: item.position === "center" ? "#435334" : item.color,
            }}
          >
            {item.icon}
          </span>
        ))}
      </div>

     
      <p className="text-sm text-brand-accent tracking-wide animate-pulse">
        Preparing your Cuisine...
      </p>
    </div>
  );
};

export default DailyDishLoader;