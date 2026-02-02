import React, { createContext, useContext, useState } from 'react';
import type { ChatMessage, CollectedData } from '../../pantry/types/recipeConfigurationChat';
import type { Message } from '../../../components/modal/types/chat';

interface ChatContextType {
    messages: Message[];
    chatHistory: ChatMessage[];
    collectedData: CollectedData;

    addMessage: (msg: Message) => void;
    addHistory: (user: string, bot: string) => void;
    updateCollectedData: (data: CollectedData) => void;
    resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            sender: 'bot',
            content:
                "Hello! I'm Dr. Foodie, your Chef Assistant. Let's craft your perfect meal. First, what ingredients do you have to cook with today?",
            type: 'text'
        }
    ]);

    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [collectedData, setCollectedData] = useState<CollectedData>({});

    const addMessage = (msg: Message) =>
        setMessages(prev => [...prev, msg]);

    const addHistory = (user: string, bot: string) =>
        setChatHistory(prev => [
            ...prev,
            { role: 'user', content: user },
            { role: 'assistant', content: bot }
        ]);

    const updateCollectedData = (data: CollectedData) =>
        setCollectedData(data);

    const resetChat = () => {
        setMessages([]);
        setChatHistory([]);
        setCollectedData({});
    };

    return (
        <ChatContext.Provider
            value={{
                messages,
                chatHistory,
                collectedData,
                addMessage,
                addHistory,
                updateCollectedData,
                resetChat
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error('useChat must be used inside ChatProvider');
    return ctx;
};
