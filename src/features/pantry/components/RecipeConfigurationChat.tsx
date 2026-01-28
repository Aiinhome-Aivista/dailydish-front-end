import React, { useState, useRef, useEffect } from 'react';
import { Send, ChefHat, Clock, Users, Calendar, Utensils, Globe, Leaf, Check } from 'lucide-react';

// --- Types ---
type Message = {
  id: string;
  sender: 'bot' | 'user';
  content: React.ReactNode;
  // We use 'type' to determine if we should render text or a specialized widget
  type?: 'text' | 'cuisine-selector' | 'details-selector' | 'final-action';
};

type RecipeState = {
  ingredients: string[];
  cuisine: string | null;
  cookingTime: string | null;
  servings: number;
  mealType: string | null;
};

// --- Main Component ---
export default function RecipeConfigurationChat() {
  // Initial Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      content: "Hello! I'm your AI Chef. Let's craft your perfect meal. First, what ingredients do we have to work with today?",
      type: 'text'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Form State Capture
  const [recipeState, setRecipeState] = useState<RecipeState>({
    ingredients: [],
    cuisine: null,
    cookingTime: null,
    servings: 4,
    mealType: null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- Logic Handlers ---

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // 1. Add User Message (Ingredients)
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setRecipeState(prev => ({ ...prev, ingredients: [...prev.ingredients, inputValue] }));
    setInputValue('');
    setIsTyping(true);

    // 2. Simulate Bot Delay -> Ask for Cuisine
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          content: "Delicious choice! 🐟 Now, what culinary direction should we take this?",
          type: 'cuisine-selector'
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCuisineSelect = (cuisine: string) => {
    // 1. Add User Selection as a message
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: cuisine }]);
    setRecipeState(prev => ({ ...prev, cuisine }));
    setIsTyping(true);

    // 2. Simulate Bot Delay -> Ask for Details (Time/Servings)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          content: "Great choice. How much time do you have, and how many people are eating?",
          type: 'details-selector'
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleDetailsSubmit = (time: string, servings: number, type: string) => {
    // 1. Add User Selection as a summary message
    const responseText = `${time} cooking time, for ${servings} people (${type})`;
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', content: responseText }]);
    setRecipeState(prev => ({ ...prev, cookingTime: time, servings, mealType: type }));
    setIsTyping(true);

    // 2. Simulate Bot Delay -> Final Call to Action
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'bot',
          content: "Perfect. I have enough information to craft a unique 5-star recipe for you.",
          type: 'final-action'
        }
      ]);
      setIsTyping(false);
    }, 1000);
  };

  // --- Interactive Widgets (Sub-components) ---

  const CuisineSelector = () => {
    const cuisines = [
      { name: 'Oriental', icon: <Utensils className="w-5 h-5" /> },
      { name: 'Indian-Sub', icon: <Globe className="w-5 h-5" /> },
      { name: 'Central Asian', icon: <Leaf className="w-5 h-5" /> }, // Placeholder icon
      { name: 'European', icon: <ChefHat className="w-5 h-5" /> },
    ];

    // Check if this step is already completed to disable interaction
    const isCompleted = recipeState.cuisine !== null;

    if (isCompleted) return null; // Hide widget after selection to keep chat clean

    return (
      <div className="flex gap-2 overflow-x-auto pb-2 mt-2 hide-scrollbar snap-x">
        {cuisines.map((c) => (
          <button
            key={c.name}
            onClick={() => handleCuisineSelect(c.name)}
            className="flex flex-col items-center justify-center min-w-[90px] p-3 bg-[#E8EDDE] border-2 border-[#DCE6D3] rounded-xl hover:bg-[#D4DFCC] hover:border-[#7D9C5B] transition-colors text-[#4A5D23] snap-start"
          >
            <div className="mb-1 text-[#5A7338]">{c.icon}</div>
            <span className="text-[10px] font-bold uppercase tracking-wide">{c.name}</span>
          </button>
        ))}
      </div>
    );
  };

  const DetailsWidget = () => {
    const [localTime, setLocalTime] = useState('30m');
    const [localServings, setLocalServings] = useState(4);
    const [localType, setLocalType] = useState('Daily');

    // Check if this step is already completed
    const isCompleted = recipeState.cookingTime !== null;

    if (isCompleted) return null;

    return (
      <div className="rounded-xl  mt-2 w-full">


        {/* Servings Counter */}
        <div>
          <label className="text-xs font-bold text-[#4A5D23] uppercase mb-2 flex items-center gap-1">
            <Users className="w-3 h-3" /> Servings
          </label>
          <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-[#D1DAC6] w-fit">
            <button
              onClick={() => setLocalServings(Math.max(1, localServings - 1))}
              className="w-8 h-8 flex items-center justify-center bg-[#E8EDDE] rounded text-[#4A5D23] hover:bg-[#D4DFCC]"
            >-</button>
            <span className="font-semibold text-[#4A5D23] w-6 text-center">{localServings}</span>
            <button
              onClick={() => setLocalServings(localServings + 1)}
              className="w-8 h-8 flex items-center justify-center bg-[#E8EDDE] rounded text-[#4A5D23] hover:bg-[#D4DFCC]"
            >+</button>
          </div>
        </div>

        {/* Meal Type */}
        <div>
          <label className="text-xs font-bold text-[#4A5D23] uppercase mb-2 flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Meal Type
          </label>
          <div className="flex gap-2">
            {['Daily', 'Special'].map(t => (
              <button
                key={t}
                onClick={() => setLocalType(t)}
                className={`px-4 py-1 text-sm rounded-lg border transition-colors ${localType === t ? 'bg-[#A2B886] text-white border-[#A2B886]' : 'bg-white border-[#D1DAC6] text-[#6B7F4F]'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Button */}
        <button
          onClick={() => handleDetailsSubmit(localTime, localServings, localType)}
          className="w-full py-2 bg-[#7D9C5B] text-white rounded-lg font-semibold hover:bg-[#6A8E4C] transition-colors flex justify-center items-center gap-2"
        >
          Confirm Details <Check size={16} />
        </button>
      </div>
    );
  };

  // --- Render ---
  return (
    <div className="flex flex-col h-screen w-full mx-auto text-[#2C3E14]">

      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#7D9C5B] rounded-full flex items-center justify-center text-white shadow-sm">
          <ChefHat size={22} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-[#3A4A28] leading-tight">Recipe Configuration</h1>
          <p className="text-xs text-[#7B8C65]">AI Chef Assistant</p>
        </div>
      </div>

      {/* Chat Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>

            {/* Bot Avatar (only for bot) */}
            {msg.sender === 'bot' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 text-[#7D9C5B]">

              </div>
            )}

            {/* Bubble */}
            <div className={`max-w-[85%] ${msg.sender === 'user'
              ? 'bg-[#7D9C5B] text-white rounded-2xl rounded-tr-none shadow-md'
              : 'bg-white/30 backdrop-blur-xl border border-white/50 text-[#4A5D23] rounded-2xl rounded-tl-none shadow-sm ring-1 ring-white/40'
              } p-4 text-sm leading-relaxed`}
            >
              {/* Text Content */}
              {(msg.type === 'text' || msg.type === 'cuisine-selector' || msg.type === 'details-selector' || msg.type === 'final-action') && (
                <p>{msg.content}</p>
              )}

              {/* Render Widgets inside the bubble flow */}
              {msg.type === 'cuisine-selector' && <CuisineSelector />}
              {msg.type === 'details-selector' && <DetailsWidget />}

              {/* Final Action Button */}
              {msg.type === 'final-action' && (
                <div className="mt-4 pt-4 border-t border-[#E8E0D0]">
                  <button className="w-full py-3 bg-[#6A8E4C] hover:bg-[#58783D] text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
                    Generate Recipe <Send size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start items-center ml-10">
            <div className=" p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Input Area */}
      <div className="p-4 bg-white/10 backdrop-blur-md sticky bottom-0 z-20 border-t border-white/30">
        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl p-1.5 rounded-full border border-white/40 shadow-lg ring-1 ring-white/30 focus-within:ring-2 focus-within:ring-[#A2B886] focus-within:border-transparent transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="e.g. Fresh Atlantic Salmon..."
            className="flex-1 bg-transparent px-4 py-3 outline-none text-[#4A5D23] placeholder-[#6B7F4F] text-sm font-medium"
            disabled={recipeState.mealType !== null}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || recipeState.mealType !== null}
            className={`p-3 rounded-full  transition-all transform ${inputValue.trim() ? 'bg-[#7D9C5B] hover:bg-[#6A8E4C]' : 'scale-95'
              }`}
          >
            <Send size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}