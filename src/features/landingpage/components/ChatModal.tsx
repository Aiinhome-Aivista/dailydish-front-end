import React, { useState, useRef, useEffect } from 'react';
import { Send, ChefHat, Utensils, Globe, Leaf, X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CookerIcon from '../../../assets/cooker.svg';
import { useAuth } from '../../auth/context/AuthContext';
import { chatRecipeConfiguration } from '../../pantry/api/recipeConfigurationService';
import type { ChatMessage, CollectedData } from '../../pantry/types/recipeConfiguration';

// --- Types ---
type Message = {
  id: string;
  sender: 'bot' | 'user';
  content: string;
  type?: 'text' | 'cuisine-selector' | 'details-selector' | 'final-action' | 'plan-summary';
};

type RecipeState = {
  ingredients: string[];
  cuisine: string | null;
  cookingTime: string | null;
  servings: number;
  mealType: string | null;
};

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateRecipe?: (data: CollectedData) => void;
}

// --- Helper: Simple Text Formatter ---
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

// --- Helper: Plan Summary Card ---
const PlanSummaryCard = ({ content }: { content: string }) => {
  return (
    <div className="bg-white/60 p-4 rounded-xl border border-white/50 mt-2 shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#7D9C5B]/20">
        <Sparkles className="w-4 h-4 text-[#7D9C5B]" />
        <span className="font-bold text-[#3A4A28] text-sm uppercase tracking-wide">Cooking Plan</span>
      </div>
      <div className="text-sm text-[#4A5D23]">
        <ParsedText text={content} />
      </div>
    </div>
  );
};

export default function ChatModal({ isOpen, onClose, onGenerateRecipe }: ChatModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Initial Chat State
  const initialBotMessage: Message = {
    id: '1',
    sender: 'bot',
    content: "Hello! I'm Dr. Foodi, your Chef Assistant. Let's craft your perfect meal. First, what ingredients do we have to work with today?",
    type: 'text'
  };

  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [collectedData, setCollectedData] = useState<CollectedData>({});
  
  // Local state tracking
  const [recipeState, setRecipeState] = useState<RecipeState>({
    ingredients: [],
    cuisine: null,
    cookingTime: null,
    servings: 4,
    mealType: null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- Logic Handlers ---

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userText = inputValue;
    triggerMessageSend(userText);
    setInputValue('');
  };

  const handleCuisineSelect = (cuisine: string) => {
    triggerMessageSend(cuisine);
    setRecipeState(prev => ({ ...prev, cuisine }));
  };

  const triggerMessageSend = async (text: string) => {
    if (!text) return;
    const currentUserId = user?.username || "guest_user";
    
    // UI: Add User Message
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await chatRecipeConfiguration({
        user_id: currentUserId,
        message: text,
        chat_history: chatHistory,
        collected_data: collectedData
      });

      if (response && response.status === 'success') {
        const botResponse = response.message;
        const recipes = response.data?.recipes || response.data?.data?.recipes;
        
        // 1. Check for RESET condition
        // If the bot says "reset" or "start over", clear everything
        const isReset = botResponse.toLowerCase().includes("reset complete") || 
                        botResponse.toLowerCase().includes("start over") ||
                        botResponse.toLowerCase().includes("start fresh");

        if (isReset) {
            setMessages([{
                id: Date.now().toString(),
                sender: 'bot',
                content: botResponse,
                type: 'text'
            }]);
            setChatHistory([]);
            setCollectedData({});
            setRecipeState({
                ingredients: [],
                cuisine: null,
                cookingTime: null,
                servings: 4,
                mealType: null
            });
            setIsTyping(false);
            return; // Stop here, don't append to old history
        }

        // 2. Normal Logic (if not resetting)
        if (recipes && recipes.length > 0) {
          navigate('/ai-curated-menu', { state: { recipes } });
          return;
        }

        // Determine Message Type
        let msgType: Message['type'] = 'text';
        
        if (botResponse.toLowerCase().includes("cuisine")) {
          msgType = 'cuisine-selector';
        } else if (botResponse.includes("Cooking Plan") || botResponse.includes("Ingredients:")) {
          msgType = 'plan-summary';
        } else if (response.collected_data.ingredients && response.collected_data.cuisine && response.collected_data.cooking_time) {
           msgType = 'final-action';
        }

        const botMsg: Message = {
          id: Date.now().toString() + '_bot',
          sender: 'bot',
          content: botResponse,
          type: msgType
        };

        setMessages(prev => [...prev, botMsg]);
        setCollectedData(response.collected_data);
        setChatHistory(prev => [...prev, { role: 'user', content: text }, { role: 'assistant', content: botResponse }]);
      
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', content: "I'm having trouble understanding. Could you try again?", type: 'text' }]);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', content: "I'm having trouble connecting to the kitchen server.", type: 'text' }]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Render Helpers ---

  const CuisineSelector = () => {
    const cuisines = [
      { name: 'Oriental', icon: <Utensils className="w-5 h-5" /> },
      { name: 'Indian-Sub', icon: <Globe className="w-5 h-5" /> },
      { name: 'Central Asian', icon: <Leaf className="w-5 h-5" /> },
      { name: 'European', icon: <ChefHat className="w-5 h-5" /> },
    ];
    
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 mt-3 hide-scrollbar snap-x">
        {cuisines.map((c) => (
          <button
            key={c.name}
            onClick={() => handleCuisineSelect(c.name)}
            className="flex flex-col items-center justify-center min-w-[80px] p-2 bg-white/80 border border-[#DCE6D3] rounded-xl hover:bg-[#D4DFCC] hover:border-[#7D9C5B] transition-all text-[#4A5D23] shadow-sm snap-start group"
          >
            <div className="mb-1 text-[#5A7338] group-hover:scale-110 transition-transform">{c.icon}</div>
            <span className="text-[10px] font-bold uppercase tracking-wide">{c.name}</span>
          </button>
        ))}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl h-[85vh] bg-[#F4F7F1] rounded-3xl shadow-2xl flex flex-col border border-white/60 overflow-hidden font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-[#E0E6D8] z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E8EDDE] rounded-full flex items-center justify-center border border-[#DCE6D3]">
               <img src={CookerIcon} alt="Icon" className='w-6 h-6 opacity-80' />
            </div>
            <div>
              <h1 className="font-bold text-lg text-[#3A4A28]">Dr. Foodi</h1>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-xs text-[#7B8C65] font-medium">Online Assistant</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-[#7B8C65] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-[#F4F7F1]">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-[#7D9C5B] flex items-center justify-center mr-2 mt-1 shadow-sm text-white shrink-0">
                  <ChefHat size={16} />
                </div>
              )}

              <div className={`max-w-[85%] relative group`}>
                <div className={`
                  p-3.5 text-sm shadow-sm
                  ${msg.sender === 'user' 
                    ? 'bg-[#7D9C5B] text-white rounded-2xl rounded-tr-none' 
                    : 'bg-white text-[#3A4A28] border border-[#E0E6D8] rounded-2xl rounded-tl-none'
                  }
                `}>
                  {/* Content Rendering */}
                  {msg.type === 'plan-summary' ? (
                    <PlanSummaryCard content={msg.content} />
                  ) : (
                    <ParsedText text={msg.content} />
                  )}

                  {/* Contextual Widgets */}
                  {msg.type === 'cuisine-selector' && <CuisineSelector />}
                  
                  {/* Action Buttons */}
                  {msg.type === 'final-action' && (
                     <div className="mt-3 pt-3 border-t border-[#E0E6D8] flex gap-2">
                        <button 
                           onClick={() => onGenerateRecipe && onGenerateRecipe(collectedData)}
                           className="flex-1 py-2 bg-[#7D9C5B] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm hover:bg-[#6A8E4C] transition-colors flex items-center justify-center gap-2"
                        >
                           Generate Recipe <Send size={12} />
                        </button>
                     </div>
                  )}
                </div>
                
                <div className={`text-[10px] text-gray-400 mt-1 px-1 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>

            </div>
          ))}

          {isTyping && (
             <div className="flex items-center gap-2 ml-10">
                <div className="flex space-x-1 bg-white/50 border border-white p-2 rounded-xl rounded-tl-none w-fit">
                  <div className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce delay-150"></div>
                </div>
                <span className="text-xs text-[#A2B886] animate-pulse">Dr. Foodi is thinking...</span>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-4 bg-white/80 backdrop-blur-md border-t border-[#E0E6D8]">
          <div className="flex items-center gap-2 bg-white border border-[#E0E6D8] p-1.5 rounded-full shadow-inner focus-within:ring-2 focus-within:ring-[#7D9C5B]/50 transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="e.g., I have chicken and rice..."
              className="flex-1 bg-transparent px-4 py-2 outline-none text-[#3A4A28] placeholder-[#AAB59B] text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className={`p-2.5 rounded-full transition-all duration-300 ${
                inputValue.trim() 
                  ? 'bg-[#7D9C5B] text-white shadow-md hover:bg-[#6A8E4C] rotate-0' 
                  : 'bg-[#E8EDDE] text-[#AAB59B] cursor-not-allowed -rotate-12'
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}