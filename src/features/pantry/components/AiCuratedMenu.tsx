import React, { useState } from 'react';
import { Heart, ChevronRight } from 'lucide-react';

// Define the shape of a recipe item
interface Recipe {
  id: number;
  title: string;
  description: string;
  time: string;
  image: string;
  tags?: string[];
}

const AiMenuDashboard: React.FC = () => {
  // Simulating the selection state. In the image, the second item is selected.
  const [selectedId, setSelectedId] = useState<number>(2);

  const recipes: Recipe[] = [
    {
      id: 1,
      title: "Rise-jira",
      description: "A fresh Mediterranean delight with roasted garlic, aromatic herbs, and had-squeezed lemon zest.",
      time: "20 mins",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 2,
      title: "Broccoli-Quinoa",
      description: "Nutrient-dense bowl perfect for a healthy lunch. Packed with fiber and antioxidants.",
      time: "45 mins",
      image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      title: "Pesto Pasta",
      description: "Classic basil pesto with a healthy AI twist, incorporating blended broccoli for extra nutrition.",
      time: "65 mins",
      image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      title: "Garlic-Brocco",
      description: "Flash-fried broccoli and spinach with a kick of red chili and toasted with garlic.",
      time: "20 mins",
      image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <div className="min-h-screen p-4 text-[#3f4f3a]">
      {/* Header Section */}
      <div className="max-w-full mb-10">
        <h1 className="text-4xl font-bold mb-2 tracking-tight text-[#3e5035]">
          Your AI-Curated Menu
        </h1>
        <p className="text-lg text-[#95b87f] font-medium">
          Based on: <span className="opacity-80">Chicken , Broccoli, Garlic, Oriental Cuisine</span>
        </p>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            onClick={() => setSelectedId(recipe.id)}
            className={`
              group relative flex flex-col p-4 rounded-[32px] cursor-pointer transition-all duration-300
              ${selectedId === recipe.id 
                ? 'bg-[#d2e4c4] ring-[3px] ring-[#3ba9f5] shadow-lg scale-[1.02]' 
                : 'bg-[#d2e4c4] hover:shadow-md hover:scale-[1.01]'
              }
            `}
          >
            {/* Image Container */}
            <div className="h-48 w-full mb-5 overflow-hidden rounded-2xl">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
              <h3 className="text-xl font-bold mb-2 text-[#3e5035]">
                {recipe.title}
              </h3>
              
              <p className="text-sm leading-relaxed text-[#5e7054] mb-6 line-clamp-3">
                {recipe.description}
              </p>

              {/* Footer: Meta & Action */}
              <div className="mt-auto flex items-center justify-between">
                <div className="flex flex-col gap-3">
                    <span className="text-xs font-bold text-[#3e5035]">
                    {recipe.time}
                    </span>
                     {/* Heart Icon */}
                    <button className="text-[#8ba37a] hover:text-[#3e5035] transition-colors">
                        <Heart size={18} fill="currentColor" className="opacity-60 hover:opacity-100" />
                    </button>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#9dbd87] group-hover:text-[#7a9d63] transition-colors">
                  <span>View Recipe</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiMenuDashboard;