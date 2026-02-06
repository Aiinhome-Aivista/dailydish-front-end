import { useState, useRef, useEffect } from 'react';
import { Send, ChefHat, Utensils, Globe, Leaf, ArrowRight, Check, RefreshCw } from 'lucide-react';
import CookerIcon from '../../../assets/cooker.svg';
import AnimatedChef from '../../../assets/animated_chef-removebg-preview.png';
import { useAuth } from '../../auth/context/AuthContext';
import { useChat } from '../../chat/context/ChatContext';
import { sendChatMessage } from '../../../components/modal/api/chatService';
import type { Message } from '../../../components/modal/types/chat';
import { useNavigate } from 'react-router-dom';
import DailyDishLoader from '../../../components/feedback/DailyDishLoader';





// --- Helper Components ---

const ParsedText = ({ text }: { text: string }) => {
  if (!text) return null;
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, lineIdx) => (
        <p key={lineIdx} className="leading-relaxed">
          {line.split(/(\*\*.*?\*\*)/g).map((part, partIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIdx} className="font-bold text-[#2C3E14]">{part.slice(2, -2)}</strong>;
            }
            return <span key={partIdx}>{part}</span>;
          })}
        </p>
      ))}
    </div>
  );
};

const CookingPlanTable = ({ content }: { content: string }) => {
  // Parsing logic
  const parseContent = (text: string) => {
    // Expected format: **Key:** Value
    // const tableData: { key: string; value: string }[] = []; // This was unused, `extracted` is used instead
    let introText = '';
    let footerText = '';

    const keyRegex = /\*\*([^*]+):\*\*\s*(.*?)(?=(?:\*\*|$))/g;


    const extracted: { key: string; value: string }[] = [];

    const rawMatches = [...text.matchAll(keyRegex)];

    if (rawMatches.length === 0) {
      return { title: '', tableData: [], footerText: text };
    }

    rawMatches.forEach((m) => {
      const key = m[1].trim();
      let value = m[2].trim();

      // Split footer if present in value
      const splitFooter = value.split(/\s*['"]?Confirm['"]?\s+to\s+generate/i);
      if (splitFooter.length > 1) {
        value = splitFooter[0].trim();
      }

      if (['Ingredients', 'Cuisine', 'Serving', 'Time', 'Type'].some(k => key.includes(k))) {
        extracted.push({ key, value });
      }
    });

    // Extract Footer
    // Simple heuristic: find "Confirm" or the end of the last match
    const confirmIndex = text.toLowerCase().indexOf("'confirm'");
    if (confirmIndex !== -1) {
      footerText = text.substring(confirmIndex);
    } else {
      const lastMatch = rawMatches[rawMatches.length - 1];
      const footerIndex = lastMatch.index! + lastMatch[0].length;
      if (text.length > footerIndex) {
        const remainder = text.substring(footerIndex).trim();
        // Just take it if it looks like a sentence
        if (remainder.length > 5) footerText = remainder;
      }
    }

    // Extract Title (text before first match)
    const firstMatchIndex = rawMatches[0].index!;
    if (firstMatchIndex > 0) {
      introText = text.substring(0, firstMatchIndex).trim();
    }

    return { title: introText, tableData: extracted, footerText };
  };

  const { title, tableData, footerText } = parseContent(content);

  if (tableData.length === 0) {
    return <ParsedText text={content} />;
  }

  return (
    <div className="w-full">
      {title && <div className="mb-3 font-medium text-[#2C3E14]"><ParsedText text={title} /></div>}

      <div className="overflow-hidden rounded-xl border border-[#DCE6D3] mb-4">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#E8EDDE] text-[#3A4A28] uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="px-4 py-3 border-r border-[#DCE6D3] w-1/3">Detail</th>
              <th className="px-4 py-3">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DCE6D3] bg-white/40">
            {tableData.map((row, idx) => (
              <tr key={idx} className="hover:bg-white/60 transition-colors">
                <td className="px-4 py-2.5 font-semibold text-[#4A5D23] border-r border-[#DCE6D3]">{row.key}</td>
                <td className="px-4 py-2.5 text-[#2C3E14]">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {footerText && (
        <div className="text-xs text-[#5A7338] mt-2 italic border-t border-[#7D9C5B]/20 pt-2">
          <ParsedText text={footerText} />
        </div>
      )}
    </div>
  );
};

const QuantitySelector = ({ initialIngredients, onConfirm }: { initialIngredients: any[], onConfirm: (ingredients: any[]) => void }) => {
  const [ingredients, setIngredients] = useState(initialIngredients.map(i => ({ ...i, unit: i.unit || 'gm' })));

  // Update local state when input changes
  const handleChange = (index: number, field: string, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };

  const units = ['gm', 'kg', 'cup', 'tbsp', 'tsp', 'pieces'];

  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <div className="p-3 bg-white/20 rounded-xl mt-2">
        <p className="text-sm font-semibold text-[#2C3E14] mb-1">ingredients:</p>
        {ingredients.map((ing, idx) => (
          <p key={idx} className="text-xs text-[#4A5D23]">
            {ing.name}: {ing.qty} {ing.unit}
          </p>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 mt-2 w-full p-2 bg-white/40 rounded-xl border border-[#DCE6D3]">
      {ingredients.map((ing, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-[#4A5D23] uppercase tracking-wide ml-1">{ing.name}</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Qty"
              value={ing.qty === "some" ? "" : ing.qty}
              onChange={(e) => handleChange(idx, 'qty', e.target.value)}
              className="w-16 p-2 rounded-lg border border-[#DCE6D3] text-sm bg-white/80 focus:border-[#7D9C5B] outline-none text-[#2C3E14] text-center"
            />
            <div className="relative">
              <select
                value={ing.unit || 'gm'}
                onChange={(e) => handleChange(idx, 'unit', e.target.value)}
                className="p-2 pr-6 rounded-lg border border-[#DCE6D3] text-sm bg-white/80 focus:border-[#7D9C5B] outline-none appearance-none text-[#2C3E14]"
              >
                {units.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#4A5D23]">
                <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Show send button inline */}
            {idx === ingredients.length - 1 && (
              <button
                onClick={() => {
                  setIsSubmitted(true);
                  onConfirm(ingredients);
                }}
                className="p-2 bg-[#6A8E4C] hover:bg-[#58783D] text-white rounded-lg transition-colors shadow-sm flex items-center justify-center"
              >
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- Main Component ---
export default function RecipeConfigurationChat() {
  const { user, userId } = useAuth();
  const navigate = useNavigate();
  // const { showToast } = useToast(); // Removed unused
  // const [isGenerating, setIsGenerating] = useState(false); // Removed unused

  const { messages, chatHistory, collectedData, addMessage, addHistory, updateCollectedData, resetChat } = useChat();

  useEffect(() => {
    resetChat();
  }, []);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [localMealType, setLocalMealType] = useState<string | null>(null); // Track locally for instant UI feedback

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- Logic Handlers ---

  const handleSendMessage = async (customText?: string) => {
    if (!inputValue.trim() && !customText) return;

    const userText = customText || inputValue;
    const currentUserId = userId || user?.username || "guest_user"; // Fallback if no user

    // 1. Add User Message (UI)
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', content: userText };
    addMessage(userMsg);
    setInputValue('');
    setIsTyping(true);
    try {
      const response = await sendChatMessage({
        userId: currentUserId,
        message: userText,
        chatHistory: chatHistory,
        collectedData: collectedData
      });

      if (response && response.status === 'success') {
        const botResponse = response.message;

        // Add Bot Message (UI)
        const botMsg: Message = {
          id: Date.now().toString() + '_bot',
          sender: 'bot',
          content: botResponse,
          type: 'text' // Default to text
        };

        // Check for direct recipe generation in chat response
        const respData = response.data as any;
        if (respData && (respData.recipes || (respData.data && respData.data.recipes))) {
          const recipes = respData.recipes || respData.data.recipes;
          if (recipes && recipes.length > 0) {
            navigate('/ai-menu', {
              state: {
                recipes,
                chatContext: {
                  user_id: currentUserId,
                  message: userText,
                  chat_history: chatHistory,
                  collected_data: collectedData
                }
              }
            });
            return;
          }
        }

        let cuisineOptions: string[] | undefined;

        if (botResponse.toLowerCase().includes("cooking plan") || botResponse.toLowerCase().includes("confirm")) {
          botMsg.type = 'final-action';
        } else if (response.collected_data?.ingredients?.some((i: any) => i.unclear)) {
          botMsg.type = 'ingredient-qty-selector';
        } else if (botResponse.toLowerCase().includes("cuisine") && !botResponse.toLowerCase().includes("cooking plan")) {
          botMsg.type = 'cuisine-selector';
          const notFeasible = (response.collected_data as any)?._cuisine_not_feasible;
          if (notFeasible?.alternatives && Array.isArray(notFeasible.alternatives) && notFeasible.alternatives.length > 0) {
            cuisineOptions = notFeasible.alternatives;
          }
        } else if (botResponse.toLowerCase().includes("daily meal") && botResponse.toLowerCase().includes("special occasion")) {
          botMsg.type = 'meal-type-selector';
        }

        if (cuisineOptions) {
          (botMsg as any).cuisineOptions = cuisineOptions;
        }

        addMessage(botMsg);

        // Update API State
        updateCollectedData(response.collected_data);

        // Update History with the exchange
        addHistory(userText, botResponse);

      } else {
        // Handle error
        addMessage({ id: Date.now().toString(), sender: 'bot', content: "Sorry, I'm having trouble connecting to the kitchen server.", type: 'text' });
      }
    } catch (error) {
      console.error("Chat API Error", error);
      addMessage({ id: Date.now().toString(), sender: 'bot', content: "Sorry, something went wrong.", type: 'text' });
    } finally {
      setIsTyping(false);
    }
  };

  const handleCuisineSelect = (cuisine: string) => {
    // Treat selection as a user message
    triggerMessageSend(cuisine);
    // Removed setRecipeState as recipeState is no longer used
    // setRecipeState(prev => ({ ...prev, cuisine }));
  };



  const handleGenerateRecipe = async () => {
    // Removed isGenerating check as state is removed
    // Navigate immediately to AiCuratedMenu to handle the generation
    // We treat this as sending "generate now"
    const currentUserId = userId || user?.username || "guest_user";
    navigate('/ai-menu', {
      state: {
        waitingForRecipes: true,
        chatContext: {
          user_id: currentUserId,
          message: "generate now",
          chat_history: chatHistory,
          collected_data: collectedData
        }
      }
    });
  };

  const handleReset = async () => {
    setIsResetting(true);
    // Add artificial delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    resetChat();
    setIsResetting(false);
  };

  const triggerMessageSend = async (text: string) => {
    // Re-implement simplified version for direct calls
    if (!text) return;
    const currentUserId = userId || user?.username || "guest_user";
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', content: text };
    addMessage(userMsg);
    setIsTyping(true);

    // If text is "generate now" or "confirm", we navigate immediately to show loader on result page
    if (text.toLowerCase() === 'generate now' || text.toLowerCase() === 'confirm') {
      navigate('/ai-menu', {
        state: {
          waitingForRecipes: true,
          chatContext: {
            user_id: currentUserId,
            message: text,
            chat_history: chatHistory, // Note: collected_data is usually appended by the backend or inferred
            collected_data: collectedData
          }
        }
      });
      return;
    }

    try {
      const response = await sendChatMessage({
        userId: currentUserId,
        message: text,
        chatHistory: chatHistory,
        collectedData: collectedData
      });

      if (response && response.status === 'success') {
        const botResponse = response.message;

        // Check for direct recipe generation in chat response
        const respData = response.data as any;
        const recipes = respData?.recipes || respData?.data?.recipes;
        if (recipes && recipes.length > 0) {
          navigate('/ai-menu', {
            state: {
              recipes,
              chatContext: {
                user_id: currentUserId,
                message: text,
                chat_history: chatHistory,
                collected_data: collectedData
              }
            }
          });
          return;
        }

        let msgType: 'text' | 'cuisine-selector' | 'details-selector' | 'final-action' | 'meal-type-selector' | 'ingredient-qty-selector' = 'text';
        let cuisineOptions: string[] | undefined;

        if (botResponse.toLowerCase().includes("cooking plan") || botResponse.toLowerCase().includes("confirm")) {
          msgType = 'final-action';
        } else if (response.collected_data?.ingredients?.some((i: any) => i.unclear)) {
          msgType = 'ingredient-qty-selector';
        } else if (botResponse.toLowerCase().includes("cuisine") && !botResponse.toLowerCase().includes("cooking plan")) {
          msgType = 'cuisine-selector';
          const notFeasible = (response.collected_data as any)?._cuisine_not_feasible;
          if (notFeasible?.alternatives && Array.isArray(notFeasible.alternatives) && notFeasible.alternatives.length > 0) {
            cuisineOptions = notFeasible.alternatives;
          }
        } else if (botResponse.toLowerCase().includes("daily meal") && botResponse.toLowerCase().includes("special occasion")) {
          msgType = 'meal-type-selector';
        }

        const botMsg: Message = {
          id: Date.now().toString() + '_bot',
          sender: 'bot',
          content: botResponse,
          type: msgType
        };

        if (cuisineOptions) {
          (botMsg as any).cuisineOptions = cuisineOptions;
        }

        addMessage(botMsg);
        updateCollectedData(response.collected_data);
        addHistory(text, botResponse);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Interactive Widgets (Sub-components) ---

  const MealTypeSelector = () => {
    const mealTypes = [
      { name: 'Daily Meal' },
      { name: 'Special Occasion' },
    ];

    // logic adapted from ChatModal
    // Prioritize local state effectively for instant feedback, fallback to collectedData
    const currentSelection = localMealType || collectedData?.meal_type || collectedData?.mealType;

    return (
      <div className="flex flex-row gap-2 mt-2 w-full">
        {mealTypes.map((type) => {
          const isSelected = currentSelection === type.name;
          return (
            <button
              key={type.name}
              // disabled={isCompleted} // Allow re-selection
              onClick={() => {
                triggerMessageSend(type.name);
                setLocalMealType(type.name); // Immediate UI update
              }}
              className={`flex items-center gap-3 p-2 border rounded-lg transition-colors text-left flex-1
                ${isSelected
                  ? 'bg-[#E8EDDE] border-[#7D9C5B] text-[#2C3E14]'
                  : 'bg-[#E8EDDE]/50 border-[#DCE6D3] text-[#4A5D23] hover:bg-[#D4DFCC]'
                }
              `}
            >
              <div className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center
                ${isSelected ? 'bg-[#5A7338] border-[#5A7338]' : 'border-[#5A7338]'}
              `}>
                {isSelected && <Check size={10} strokeWidth={4} className="text-white" />}
              </div>
              <span className="text-xs font-bold uppercase tracking-wide whitespace-nowrap">{type.name}</span>
            </button>
          );
        })}
      </div>
    );
  };

  const CuisineSelector = ({ options }: { options?: string[] }) => {
    const defaultCuisines = [
      { name: 'Oriental', icon: <Utensils className="w-5 h-5" /> },
      { name: 'Indian-Sub', icon: <Globe className="w-5 h-5" /> },
      { name: 'Central Asian', icon: <Leaf className="w-5 h-5" /> }, // Placeholder icon
      { name: 'European', icon: <ChefHat className="w-5 h-5" /> },
      { name: 'Inter-Continental', icon: <ChefHat className="w-5 h-5" /> },
    ];

    const cuisines = (options && options.length > 0)
      ? options.map((name) => {
          const defaultMatch = defaultCuisines.find(c => c.name === name);
          return {
            name,
            icon: defaultMatch ? defaultMatch.icon : <Globe className="w-5 h-5" />
          };
        })
      : defaultCuisines;

    return (
      <div className="flex gap-2 overflow-x-auto pb-2 mt-2 hide-scrollbar snap-x">
        {cuisines.map((c) => (
          <button
            key={c.name}
            onClick={() => handleCuisineSelect(c.name)}
            className="flex flex-col items-center justify-center min-w-22.5 p-3 bg-[#E8EDDE] border-2 border-[#DCE6D3] rounded-xl hover:bg-[#D4DFCC] hover:border-[#7D9C5B] transition-colors text-[#4A5D23] snap-start"
          >
            <div className="mb-1 text-[#5A7338]">{c.icon}</div>
            <span className="text-[10px] font-bold uppercase tracking-wide">{c.name}</span>
          </button>
        ))}
      </div>
    );
  };






  return (
    <div className="flex flex-col w-full text-[#2C3E14] h-[calc(97vh-9rem)] relative overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-3 pb-1 border-b border-[#43533414] relative z-10">

        <img src={CookerIcon} alt="" className='w-9 h-9' />


        <div className="flex-1">
          <h1 className="font-bold text-2xl text-[#3A4A28] leading-tight">Dr. Foodie</h1>
          {/* <h1 className="font-bold text-2xl text-brand-beige leading-tight">Dr. Foodie</h1> */}
          <p className="text-sm text-[#7B8C65]"> Chef Assistant</p>
        </div>

        <button
          onClick={handleReset}
          className="p-2 rounded-xl border-2 border-[#DCE6D3] bg-[#E8EDDE] hover:bg-[#D4DFCC] hover:border-[#7D9C5B] text-[#5A7338] transition-all cursor-pointer"
          title="Restart Chat"
          disabled={isResetting}
        >
          <RefreshCw size={20} className={isResetting ? 'animate-spin' : ''} />
        </button>
      </div>




      {/* Chat Stream */}
      <div className="flex-1 overflow-y-auto space-y-6 hide-scrollbar relative z-10 mt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>
          {`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `}
        </style>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up items-center gap-2`}>
            {msg.sender === 'bot' && (
              <div className="rounded-full  flex items-center justify-center relative overflow-hidden bg-[#435334B2] shadow-lg w-15 h-15" >
                <img
                  src={AnimatedChef}
                  alt="Dr. Foodie"
                  className="w-20 h-20 object-contain translate-y-2"
                />
              </div>
            )}
            <div
              className={`max-w-[75%] wrap-break-word whitespace-pre-wrap ${msg.sender === 'user'
                ? 'bg-[#CEDEBDB2] backdrop-blur-[36px] text-[#2C3E14] rounded-2xl shadow-md z-70'
                : 'bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1] rounded-2xl shadow-sm border border-white/10'
                } p-4 text-sm leading-relaxed`}
            >
              {/* Text Content - Always show for user messages, or when type is text */}
              {msg.sender === 'user' || msg.type === 'text' || msg.type === 'cuisine-selector' || msg.type === 'details-selector' || msg.type === 'meal-type-selector' || msg.type === 'ingredient-qty-selector' ? (
                <p>{msg.content}</p>
              ) : msg.type === 'final-action' ? (
                <CookingPlanTable content={msg.content as string} />
              ) : null}

              {/* Render Widgets inside the bubble flow */}
              {msg.type === 'cuisine-selector' && <CuisineSelector options={(msg as any).cuisineOptions} />}
              {msg.type === 'meal-type-selector' && <MealTypeSelector />}
              {msg.type === 'ingredient-qty-selector' && (
                <QuantitySelector
                  initialIngredients={collectedData.ingredients?.filter(i => i.unclear) || []}
                  onConfirm={async (updatedIngredients) => {
                    const messageText = updatedIngredients.map(ing => `${ing.name} ${ing.qty}${ing.unit}`).join(', ');
                    await handleSendMessage(messageText);
                  }}
                />
              )}


              {/* Final Action Button */}
              {msg.type === 'final-action' && (
                <div className="mt-4 pt-4 border-t border-[#E8E0D0]/20">
                  <button className="w-full py-3 bg-[#6A8E4C] hover:bg-[#58783D] text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
                    onClick={handleGenerateRecipe}
                  >
                    Generate Recipe <Send size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start items-center ">
            <div className="p-3 bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1] rounded-2xl shadow-sm border border-white/10 flex gap-1">
              <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce delay-100"></span>
              <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sticky Input Area */}
      <div className="pl-4 pr-2 relative z-10 pb-2">
        <div className="flex items-center gap-2 bg-brand-beige p-1.5 rounded-2xl border border-brand-dark ring-1 ring-white/30 focus-within:ring-1 focus-within:ring-[#A2B886] focus-within:border-transparent transition-all">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="e.g. Fresh Atlantic Salmon, Broccoli, Lemon..."
            className="flex-1 bg-transparent px-2 py-3 outline-none text-[#4A5D23] placeholder-[#6B7F4F] text-sm font-medium"
          />
          {/* <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className={`p-3 rounded-full transition-all transform ${inputValue.trim() ? 'bg-[#7D9C5B] hover:bg-[#6A8E4C]' : 'scale-95'}`}
          >
            <Send size={18} className="text-brand-dark" />
          </button> */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim()}
            className={`p-1 rounded-full transition-all transform flex items-center justify-center cursor-pointer ${inputValue.trim()
              ? 'bg-brand-dark hover:bg-[#2C3E14] text-brand-beige'
              : 'bg-brand-dark text-brand-beige scale-95'
              }`}
          >
            <ArrowRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isResetting && (
        <div className="absolute inset-0 flex  items-center justify-center">
          <div className="opacity-90 absolute inset-0 z-20">
            <DailyDishLoader />
          </div>
        </div>
      )}
    </div>
  );
}