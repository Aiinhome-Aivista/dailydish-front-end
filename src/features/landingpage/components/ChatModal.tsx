import React, { useState, useRef, useEffect } from 'react';
import { Send, ChefHat, Utensils, Globe, Leaf, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CookerIcon from '../../../assets/cooker.svg';
import { useAuth } from '../../auth/context/AuthContext';
import { chatRecipeConfiguration } from '../../pantry/api/recipeConfigurationService';
import type { ChatMessage, CollectedData } from '../../pantry/types/recipeConfiguration';
import { Sparkles } from 'lucide-react';


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
    onGenerateRecipe?: (data: any) => void;
}

export default function ChatModal({ isOpen, onClose, onGenerateRecipe }: ChatModalProps) {
    const { user, userId } = useAuth();
    const navigate = useNavigate();

    // Initial Chat State
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'bot',
            content: "Hello! I'm Dr. Foodie, your Chef Assistant. Let's craft your perfect meal. First, what ingredients do you have to cook with today?",
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
        const currentUserId = userId || user?.username || "guest_user";

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

                // Check for direct recipe generation in chat response (Parity with triggerMessageSend)
                const recipes = response.data?.recipes || response.data?.data?.recipes;
                if (recipes && recipes.length > 0) {
                    const context = {
                        user_id: currentUserId,
                        message: userText,
                        chat_history: chatHistory,
                        collected_data: collectedData
                    };

                    if (userId) {
                        navigate('/ai-menu', { state: { recipes } });
                        return;
                    } else {
                        if (onGenerateRecipe) onGenerateRecipe(context);
                    }
                }
                const botMsg: Message = {
                    id: Date.now().toString() + '_bot',
                    sender: 'bot',
                    content: botResponse,
                    type: 'text'
                };

                if (
                    botResponse.toLowerCase().includes("cooking plan") ||
                    botResponse.toLowerCase().includes("confirm")
                ) {
                    botMsg.type = 'final-action';
                } else if (botResponse.includes("What type of cuisine") || (response.collected_data.ingredients && !response.collected_data.cuisine)) {
                    botMsg.type = 'cuisine-selector';
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
        const currentUserId = userId || user?.username || "guest_user";
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
                    // If logged in, navigate directly
                    if (userId) {
                        navigate('/ai-menu', { state: { recipes } });
                        return;
                    } else {
                        const context = {
                            user_id: currentUserId || "guest_user",
                            message: text,
                            chat_history: chatHistory,
                            collected_data: collectedData
                        };
                        if (onGenerateRecipe) onGenerateRecipe(context);
                    }
                }

                let msgType: 'text' | 'cuisine-selector' | 'details-selector' | 'final-action' = 'text';

                if (
                    botResponse.toLowerCase().includes("cooking plan") ||
                    botResponse.toLowerCase().includes("confirm")
                ) {
                    msgType = 'final-action';
                } else if (botResponse.includes("What type of cuisine") || (response.collected_data.ingredients && !response.collected_data.cuisine)) {
                    msgType = 'cuisine-selector';
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
            { name: 'Inter-Continental', icon: <ChefHat className="w-5 h-5" /> },

        ];

        const isCompleted = recipeState.cuisine !== null;
        if (isCompleted) return null;

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

    // --- New Component: Cooking Plan Table ---
    const CookingPlanTable = ({ content }: { content: string }) => {
        // Parsing logic
        const parseContent = (text: string) => {
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
            const confirmIndex = text.toLowerCase().indexOf("'confirm'");
            if (confirmIndex !== -1) {
                footerText = text.substring(confirmIndex);
            } else {
                const lastMatch = rawMatches[rawMatches.length - 1];
                const footerIndex = lastMatch.index! + lastMatch[0].length;
                if (text.length > footerIndex) {
                    const remainder = text.substring(footerIndex).trim();
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



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-2xl h-[80vh] bg-linear-to-b from-[#E8F1E0] to-[#F5F9ED] rounded-2xl shadow-2xl flex flex-col border border-white/30 overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 text-[#4A5D23] hover:text-brand-dark transition-colors cursor-pointer"
                    aria-label="Close"
                >
                    <X size={28} />
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b border-white/30 bg-linear-to-b from-[#E8F1E0] to-[#E8F1E0]/95 backdrop-blur-sm">
                    <img src={CookerIcon} alt="" className='w-9 h-9' />
                    <div>
                        <h1 className="font-bold text-xl text-[#3A4A28] leading-tight">Dr. Foodie</h1>
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
                            {/* {msg.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 text-[#7D9C5B]">
                                </div>
                            )} */}

                            {/* Bubble */}
                            <div className={`max-w-[85%] ${msg.sender === 'user'
                                ? 'bg-[#7D9C5B] text-white rounded-xl shadow-md'
                                : 'bg-white/30 backdrop-blur-xl border border-white/50 text-[#4A5D23] rounded-2xl  shadow-sm ring-1 ring-white/40'
                                } p-4 text-sm leading-relaxed`}
                            >
                                {/* Text Content - Always show for user messages, or when type is text */}
                                {msg.sender === 'user' || msg.type === 'text' || msg.type === 'cuisine-selector' || msg.type === 'details-selector' ? (
                                    <p>{msg.content}</p>
                                ) : msg.type === 'final-action' ? (
                                    <CookingPlanTable content={msg.content as string} />
                                ) : null}

                                {/* Render Widgets inside the bubble flow */}
                                {msg.type === 'cuisine-selector' && <CuisineSelector />}


                                {/* Final Action Button */}
                                {msg.type === 'final-action' && (
                                    <div className="mt-4 pt-4 border-t border-[#E8E0D0]">
                                        <button
                                            onClick={() => {
                                                const context = {
                                                    user_id: userId || user?.username || "guest_user",
                                                    message: "generate now",
                                                    chat_history: chatHistory,
                                                    collected_data: collectedData
                                                };

                                                if (userId) {
                                                    navigate('/ai-menu', {
                                                        state: {
                                                            waitingForRecipes: true,
                                                            chatContext: context
                                                        }
                                                    });
                                                } else {
                                                    if (onGenerateRecipe) onGenerateRecipe(context);
                                                }
                                            }}
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
                        <div className="flex justify-start items-center">
                            <div className="p-4 rounded-2xl shadow-sm flex gap-1">
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
                            placeholder="e.g. Fresh Atlantic Salmon, Broccoli, Lemon..."
                            className="flex-1 bg-transparent px-2 py-3 outline-none text-[#4A5D23] placeholder-[#6B7F4F] text-sm font-medium"
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputValue.trim()}
                            className={`p-3 rounded-full transition-all transform ${inputValue.trim() ? 'bg-[#7D9C5B] hover:bg-[#6A8E4C]' : 'scale-95'}`}
                        >
                            <Send size={18} className="text-brand-dark" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}