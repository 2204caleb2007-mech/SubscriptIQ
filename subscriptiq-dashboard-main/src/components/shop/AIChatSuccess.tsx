import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Sparkles, Send } from 'lucide-react';

interface AIChatSuccessProps {
    items: any[];
    userName: string;
}

export const AIChatSuccess: React.FC<AIChatSuccessProps> = ({ items, userName }) => {
    const [messages, setMessages] = useState<{ role: 'ai' | 'user'; content: string }[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const itemNames = items.map(i => i.name).join(', ');
        const productSentence = items.length === 1
            ? `I see you've just grabbed the **${items[0].name}**. Excellent choice!`
            : `I've just processed your order for: **${itemNames}**. You've got quite a collection starting there!`;

        const welcomeMessage = `Hello ${userName}! 🎉 I'm your SubscriptIQ AI assistant. ${productSentence} Your invoice is being prepared by my digital hands as we speak. Is there anything else you'd like to explore?`;

        // Simulate AI thinking and typing
        const startChat = async () => {
            await new Promise(r => setTimeout(r, 1000));
            setIsTyping(true);
            await new Promise(r => setTimeout(r, 2000));
            setIsTyping(false);
            setMessages([{ role: 'ai', content: welcomeMessage }]);
        };

        startChat();
    }, [items, userName]);

    return (
        <div className="flex flex-col h-[300px] bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-blue-600 text-white' : 'bg-slate-200 dark:bg-slate-700'
                                }`}>
                                {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                            </div>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'ai'
                                    ? 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 dark:text-slate-200'
                                    : 'bg-blue-600 text-white'
                                }`}>
                                <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<b class="text-blue-600 dark:text-blue-400">$1</b>') }} />
                            </div>
                        </motion.div>
                    ))}

                    {isTyping && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                <Bot className="w-4 h-4" />
                            </div>
                            <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex gap-1">
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                                <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        placeholder="Talk to AI assistant..."
                        className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl pr-10 py-2 text-xs focus:ring-1 focus:ring-blue-500"
                        disabled
                    />
                    <div className="absolute right-2 p-1.5 text-slate-400">
                        <Send className="w-3.5 h-3.5" />
                    </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400 justify-center">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>AI is summarizing your purchase...</span>
                </div>
            </div>
        </div>
    );
};
