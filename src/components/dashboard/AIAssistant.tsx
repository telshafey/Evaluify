import React, { useState, useRef, useEffect, FormEvent } from 'react';
// Fix: Corrected import for @google/genai to use GoogleGenAI as per guidelines.
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon, PaperAirplaneIcon, XCircleIcon, SpinnerIcon } from '../icons.tsx';
import { useLanguage } from '../../App.tsx';

const translations = {
    en: {
        placeholder: "Ask about assessments, results, or features...",
        greeting: "Hello! How can I help you today?",
    },
    ar: {
        placeholder: "اسأل عن التقييمات أو النتائج أو الميزات...",
        greeting: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
    }
}

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { lang } = useLanguage();
    const t = translations[lang];
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // Fix: Initialize GoogleGenAI with apiKey from process.env as per guidelines.
    const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ sender: 'ai', text: t.greeting }]);
        }
    }, [isOpen, messages.length, t.greeting]);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // FIX: Use ai.models.generateContent as per guidelines
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are a helpful assistant for an online assessment platform called "evaluify". Keep your answers concise and helpful. User question: "${input}"`,
            });
            
            // FIX: Access response text directly from the response object and provide a fallback
            const aiMessage: Message = { sender: 'ai', text: response.text ?? "Sorry, I couldn't get a response." };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Gemini API error:", error);
            const errorMessage: Message = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-24 right-5 z-[90] w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl transition-all duration-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center"><SparklesIcon className="w-5 h-5 me-2 text-purple-500"/> AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)}><XCircleIcon className="w-6 h-6 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"/></button>
                </div>
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-primary-500 text-white rounded-br-none' : 'bg-slate-100 dark:bg-slate-700 rounded-bl-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-xs px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-700 rounded-bl-none">
                                <SpinnerIcon className="w-5 h-5 text-slate-500"/>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={t.placeholder}
                        className="w-full bg-slate-100 dark:bg-slate-700 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isLoading}
                    />
                    <button type="submit" disabled={isLoading || !input.trim()} className="ms-3 bg-primary-500 text-white rounded-full p-3 hover:bg-primary-600 disabled:opacity-50">
                        <PaperAirplaneIcon className="w-5 h-5"/>
                    </button>
                </form>
            </div>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-5 right-5 z-[100] bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                aria-label="Toggle AI Assistant"
            >
                <SparklesIcon className="w-8 h-8" />
            </button>
        </>
    );
};

export default AIAssistant;