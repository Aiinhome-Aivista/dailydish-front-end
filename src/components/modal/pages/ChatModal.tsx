import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../../features/chat/context/ChatContext';
import { Send, ChefHat, Utensils, Globe, Leaf, X, ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CookerIcon from '../../../assets/cooker.svg';
import AnimatedChef from '../../../assets/animated_chef-removebg-preview.png';
import { useAuth } from '../../../features/auth/context/AuthContext';
import { sendChatMessage } from '../api/chatService';
import type { Message, RecipeState } from '../types/chat';


interface ChatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerateRecipe?: (data: any) => void;
}


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
                                value={ing.unit || 'gm'} // Default to gm if undefined
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

export default function ChatModal({ isOpen, onClose, onGenerateRecipe }: ChatModalProps) {
    const { user, userId } = useAuth();
    const navigate = useNavigate();

    const { messages, chatHistory, collectedData, addMessage, addHistory, updateCollectedData } = useChat();

    // Auto-scroll on messages change


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

    // Auto-scroll on messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);


    // --- Logic Handlers ---

    const handleSendMessage = async (customText?: string) => {
        if (!inputValue.trim() && !customText) return;
        const text = customText || inputValue;
        setInputValue('');
        await triggerMessageSend(text);
    };

    const handleCuisineSelect = (cuisine: string) => {
        triggerMessageSend(cuisine);
        setRecipeState(prev => ({ ...prev, cuisine }));
    };



    const triggerMessageSend = async (text: string) => {
        if (!text) return;
        const currentUserId = userId || "guest_user";
        const userMsg: Message = { id: Date.now().toString(), sender: 'user', content: text };
        addMessage(userMsg);
        setIsTyping(true);

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
                const recipes = response.data?.recipes || response.data?.data?.recipes;
                if (recipes && recipes.length > 0) {
                    // If logged in, navigate directly
                    if (userId) {
                        navigate('/ai-menu', {
                            state: {
                                recipes,
                                chatContext: {
                                    user_id: currentUserId || "guest_user",
                                    message: text,
                                    chat_history: chatHistory,
                                    collected_data: collectedData
                                }
                            }
                        });
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

                let msgType: 'text' | 'cuisine-selector' | 'details-selector' | 'final-action' | 'meal-type-selector' | 'ingredient-qty-selector' = 'text';

                if (
                    botResponse.toLowerCase().includes("cooking plan") ||
                    botResponse.toLowerCase().includes("confirm")
                ) {
                    msgType = 'final-action';
                } else if (response.collected_data?.ingredients?.some((i: any) => i.unclear)) {
                    msgType = 'ingredient-qty-selector';
                } else if (botResponse.toLowerCase().includes("cuisine")) {
                    msgType = 'cuisine-selector';
                } else if (
                    botResponse.toLowerCase().includes("daily meal") &&
                    botResponse.toLowerCase().includes("special occasion")
                ) {
                    msgType = 'meal-type-selector';
                }

                const botMsg: Message = {
                    id: Date.now().toString() + '_bot',
                    sender: 'bot',
                    content: botResponse,
                    type: msgType
                };

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

    const CuisineSelector = () => {
        const cuisines = [
            { name: 'Oriental', icon: <Utensils className="w-5 h-5" /> },
            { name: 'Indian-Sub', icon: <Globe className="w-5 h-5" /> },
            { name: 'Central Asian', icon: <Leaf className="w-5 h-5" /> },
            { name: 'European', icon: <ChefHat className="w-5 h-5" /> },
            { name: 'Inter-Continental', icon: <ChefHat className="w-5 h-5" /> },

        ];

        // if (isCompleted) return null; // Keep visible

        return (
            <div className="flex gap-2 overflow-x-auto pb-2 mt-2 hide-scrollbar snap-x">
                {cuisines.map((c) => {
                    const isSelected = recipeState.cuisine === c.name;
                    return (
                        <button
                            key={c.name}
                            // disabled={isCompleted} // Allow re-selection
                            onClick={() => handleCuisineSelect(c.name)}
                            className={`flex flex-col items-center justify-center min-w-22.5 p-3 border-2 rounded-xl transition-colors snap-start
                                ${isSelected
                                    ? 'bg-[#E8EDDE] border-[#7D9C5B] text-[#2C3E14]'
                                    : 'bg-[#E8EDDE] border-[#DCE6D3] text-[#4A5D23] hover:bg-[#D4DFCC] hover:border-[#7D9C5B]'
                                }
                            `}
                        >
                            <div className={`mb-1 ${isSelected ? 'text-[#3A4A28]' : 'text-[#5A7338]'}`}>{c.icon}</div>
                            <span className="text-[10px] font-bold uppercase tracking-wide">{c.name}</span>
                            {/* Optional: Add checkmark for selected state if desired, keeping it clean for now */}
                        </button>
                    );
                })}
            </div>
        );
    };

    const MealTypeSelector = () => {
        const mealTypes = [
            { name: 'Daily Meal' },
            { name: 'Special Occasion' },
        ];

        // if (isCompleted) return null; // We now want it to stay visible

        return (
            <div className="flex flex-row gap-2 mt-2 w-full">
                {mealTypes.map((type) => {
                    const isSelected = recipeState.mealType === type.name;
                    return (
                        <button
                            key={type.name}
                            // disabled={isCompleted} // Allow re-selection
                            onClick={() => {
                                triggerMessageSend(type.name);
                                setRecipeState(prev => ({ ...prev, mealType: type.name }));
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
                    {messages.map((msg, index) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up items-end gap-2`}>
                            {msg.sender === 'bot' && (
                                // <div className="relative rounded-full p-1 bg-[#E8EDDE] shadow-lg flex items-center justify-center -top-3">
                                //     <img src={AnimatedChef} alt="Dr. Foodie" className="w-20 h-18 object-contain z-0" />
                                // </div>

                                <div className="rounded-full  flex items-center justify-center -top-3 relative overflow-hidden bg-[#435334B2] shadow-lg w-18 h-18" >
                                    <img
                                        src={AnimatedChef}
                                        alt="Dr. Foodie"
                                        className="w-21 h-21 object-contain translate-y-2"
                                    />
                                </div>


                            )}

                            {/* Bot Avatar (only for bot) */}
                            {/* {msg.sender === 'bot' && (
                                <div className="w-8 h-8 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 text-[#7D9C5B]">
                                </div>
                            )} */}

                            {/* Bubble */}
                            {/* <div className={`max-w-[85%] ${msg.sender === 'user'
                                ? 'bg-[#CEDEBDB2] backdrop-blur-[40px] text-[#2C3E14] rounded-xl shadow-md'
                                : 'bg-[#435334B2] backdrop-blur-[36px] text-[#F4F8F1] rounded-2xl shadow-sm border border-white/10'
                                } p-4 text-sm leading-relaxed`}
                            > */}
                            <div
                                className={`max-w-[75%] wrap-break-word whitespace-pre-wrap ${msg.sender === 'user'
                                    ? 'bg-[#CEDEBDB2] backdrop-blur-2xl text-[#2C3E14] rounded-xl shadow-md'
                                    : 'bg-[#435334B2] backdrop-blur-[36px] text-[#F4F8F1] rounded-2xl shadow-sm border border-white/10'
                                    } p-4 text-sm leading-relaxed`}
                            >
                                {/* Text Content - Always show for user messages, or when type is text */}
                                {msg.sender === 'user' || msg.type === 'text' || msg.type === 'cuisine-selector' || msg.type === 'details-selector' || msg.type === 'meal-type-selector' || msg.type === 'ingredient-qty-selector' ? (
                                    <p>{msg.content}</p>
                                ) : msg.type === 'final-action' ? (
                                    <CookingPlanTable content={msg.content as string} />
                                ) : null}

                                {/* Render Widgets inside the bubble flow */}
                                {msg.type === 'cuisine-selector' && <CuisineSelector />}
                                {msg.type === 'meal-type-selector' && <MealTypeSelector />}
                                {msg.type === 'ingredient-qty-selector' && (
                                    <QuantitySelector
                                        initialIngredients={collectedData.ingredients?.filter(i => i.unclear) || []}
                                        onConfirm={async (updatedIngredients) => {
                                            // Construct a user message with the details
                                            const messageText = updatedIngredients.map(ing => `${ing.name} ${ing.qty}${ing.unit}`).join(', ');
                                            await handleSendMessage(messageText);
                                        }}
                                    />
                                )}

                                {/* Final Action Button */}
                                {msg.type === 'final-action' && (
                                    <div className="mt-4 pt-4 border-t border-[#E8E0D0]/20">
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
                            <div className="p-3 bg-[#435334B2] backdrop-blur-2xl text-[#F4F8F1] rounded-2xl shadow-sm border border-white/10 flex gap-1">
                                <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-[#A2B886] rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md border-t border-white/30 z-20">
                    <div className="flex items-center gap-2 bg-brand-beige p-1.5 rounded-2xl border border-brand-dark ring-1 ring-white/30 focus-within:ring-2 focus-within:ring-[#A2B886] focus-within:border-transparent transition-all">
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
                            className={`p-1 rounded-full transition-all transform flex items-center justify-center cursor-pointer ${inputValue.trim()
                                ? 'bg-brand-dark hover:bg-[#2C3E14] text-brand-beige'
                                : 'bg-brand-dark text-brand-beige scale-95'
                                }`}
                        >
                            <ArrowRight size={20} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}