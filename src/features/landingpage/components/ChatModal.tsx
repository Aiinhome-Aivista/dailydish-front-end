import React, { useState, useRef, useEffect } from 'react';
import { Send, ChefHat, Clock, Users, Calendar, Utensils, Globe, Leaf, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CookerIcon from '../../../assets/cooker.svg';
import { useAuth } from '../../auth/context/AuthContext';
import { chatRecipeConfiguration } from '../../pantry/api/recipeConfigurationService';
import type { ChatMessage, CollectedData } from '../../pantry/types/recipeConfiguration';
import { Loader2 } from 'lucide-react';
// --- Types ---
type Message = {
  id: string;
  sender: 'bot' | 'user';
  content: React.ReactNode;
  type?: 'text' | 'cuisine-selector' | 'details-selector' | 'final-action';
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

export default function ChatModal({ isOpen, onClose, onGenerateRecipe }: ChatModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Initial Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      content: "Hello! I'm Dr. Foodi, your Chef Assistant. Let's craft your perfect meal. First, what ingredients do we have to work with today?",
      type: 'text'
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // API State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [collectedData, setCollectedData] = useState<CollectedData>({});

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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const currentUserId = user?.username || "guest_user";

    // 1. Add User Message (UI)
    const userMsg: Message = { id: Date.now().toString(), sender: 'user', content: userText };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await chatRecipeConfiguration({
        user_id: currentUserId,
        message: userText,
        chat_history: chatHistory,
        collected_data: collectedData
      });

      if (response && response.status === 'success') {
        const botResponse = response.message;
        const botMsg: Message = {
          id: Date.now().toString() + '_bot',
          sender: 'bot',
          content: botResponse,
          type: 'text'
        };

        if (botResponse.includes("What type of cuisine") || (response.collected_data.ingredients && !response.collected_data.cuisine)) {
          botMsg.type = 'cuisine-selector';
        } else if (botResponse.includes("create the perfect recipe") || botResponse.includes("craft a unique")) {
          if (response.collected_data.cooking_time) {
            botMsg.type = 'final-action';
          }
        }

        setMessages(prev => [...prev, botMsg]);
        setCollectedData(response.collected_data);

        const newHistoryItemUser: ChatMessage = { role: 'user', content: userText };
        const newHistoryItemBot: ChatMessage = { role: 'assistant', content: botResponse };
        setChatHistory(prev => [...prev, newHistoryItemUser, newHistoryItemBot]);

      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', content: "Sorry, I'm having trouble connecting to the kitchen server.", type: 'text' }]);
      }
    } catch (error) {
      console.error("Chat API Error", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'bot', content: "Sorry, something went wrong.", type: 'text' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCuisineSelect = (cuisine: string) => {
    triggerMessageSend(cuisine);
    setRecipeState(prev => ({ ...prev, cuisine }));
  };



  const triggerMessageSend = async (text: string) => {
    if (!text) return;
    const currentUserId = user?.username || "guest_user";
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

        // Check for direct recipe generation in chat response
        const recipes = response.data?.recipes || response.data?.data?.recipes;
        if (recipes && recipes.length > 0) {
          navigate('/ai-curated-menu', { state: { recipes } });
          return;
        }

        let msgType: 'text' | 'cuisine-selector' | 'details-selector' | 'final-action' = 'text';

        if (botResponse.toLowerCase().includes("cuisine")) {
          msgType = 'cuisine-selector';
        } else if (
          response.collected_data.ingredients &&
          response.collected_data.cuisine &&
          response.collected_data.cooking_time &&
          response.collected_data.number_of_people
        ) {
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Interactive Widgets (Sub-components) ---

  const CuisineSelector = () => {
    const cuisines = [
      { name: 'Oriental', icon: <Utensils className="w-5 h-5" /> },
      { name: 'Indian-Sub', icon: <Globe className="w-5 h-5" /> },
      { name: 'Central Asian', icon: <Leaf className="w-5 h-5" /> },
      { name: 'European', icon: <ChefHat className="w-5 h-5" /> },
    ];

    const isCompleted = recipeState.cuisine !== null;
    if (isCompleted) return null;

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



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl h-[80vh] bg-gradient-to-b from-[#E8F1E0] to-[#F5F9ED] rounded-2xl shadow-2xl flex flex-col border border-white/30 overflow-hidden">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-[#4A5D23] hover:text-brand-dark transition-colors"
          aria-label="Close"
        >
          <X size={28} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b border-white/30 bg-gradient-to-b from-[#E8F1E0] to-[#E8F1E0]/95 backdrop-blur-sm">
          <img src={CookerIcon} alt="" className='w-9 h-9' />
          <div>
            <h1 className="font-bold text-xl text-[#3A4A28] leading-tight">Dr. Foodi Chat</h1>
            <p className="text-xs text-[#7B8C65]">Your Food Expert</p>
          </div>
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style>
            {`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}
          </style>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>

              {/* Bot Avatar (only for bot) */}
              {msg.sender === 'bot' && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 text-[#7D9C5B]">
                </div>
              )}

              {/* Bubble */}
              <div className={`max-w-[85%] ${msg.sender === 'user'
                ? 'bg-[#7D9C5B] text-white rounded-xl rounded-tr-none shadow-md'
                : 'bg-white/30 backdrop-blur-xl border border-white/50 text-[#4A5D23] rounded-2xl rounded-tl-none shadow-sm ring-1 ring-white/40'
                } p-4 text-sm leading-relaxed`}
              >
                {/* Text Content - Always show for user messages, or when type is text */}
                {msg.sender === 'user' || msg.type === 'text' || msg.type === 'cuisine-selector' || msg.type === 'details-selector' || msg.type === 'final-action' ? (
                  <p>{msg.content}</p>
                ) : null}

                {/* Render Widgets inside the bubble flow */}
                {msg.type === 'cuisine-selector' && <CuisineSelector />}


                {/* Final Action Button */}
                {msg.type === 'final-action' && (
                  <div className="mt-4 pt-4 border-t border-[#E8E0D0]">
                    <button
                      onClick={() => onGenerateRecipe && onGenerateRecipe(collectedData)}
                      className="w-full py-3 bg-[#6A8E4C] hover:bg-[#58783D] text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
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
              <div className="p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce delay-100"></span>
                <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/10 backdrop-blur-md border-t border-white/30 z-20">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl p-1.5 rounded-2xl border border-white/40 shadow-lg ring-1 ring-white/30 focus-within:ring-2 focus-within:ring-[#A2B886] focus-within:border-transparent transition-all">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your answer here..."
              className="flex-1 bg-transparent px-4 py-3 outline-none text-[#4A5D23] placeholder-[#6B7F4F] text-sm font-medium"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className={`p-3 rounded-full transition-all transform ${inputValue.trim() ? 'bg-[#7D9C5B] hover:bg-[#6A8E4C]' : 'scale-95'}`}
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
