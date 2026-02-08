import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Send, Sparkles, User, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockResponses = [
  "I can help you understand your billing and invoices. What would you like to know?",
  "Based on your usage, I recommend considering the Annual Pro plan - you'd save 17% compared to monthly billing.",
  "Your next invoice of $990 is due on March 20, 2025. Would you like me to break down the charges?",
];

const AIChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hello! I'm your AI billing assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: mockResponses[Math.floor(Math.random() * mockResponses.length)] }]);
      setIsTyping(false);
    }, 1500);
  };

  const suggestions = ['What is my current plan?', 'Explain my last invoice', 'How can I reduce costs?'];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Billing Assistant</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Ask me anything about your subscription
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-[10px] font-bold text-accent uppercase tracking-widest">
              GPT-4 Enhanced
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-1 space-y-6 mb-6 custom-scrollbar scroll-smooth">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'ai' && (
                <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[85%] md:max-w-[75%] p-4 rounded-2xl shadow-sm leading-relaxed",
                  msg.role === 'user'
                    ? "bg-primary text-primary-foreground rounded-tr-none ml-12"
                    : "bg-card border border-border rounded-tl-none mr-12 glass-card"
                )}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none glass-card">
                <div className="flex gap-1.5 px-2">
                  <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                  <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 bg-background/50 backdrop-blur-sm p-4 rounded-3xl border border-border shadow-2xl">
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
            {suggestions.map((s, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                onClick={() => setInput(s)}
                className="whitespace-nowrap rounded-full border-dashed hover:border-solid transition-all"
              >
                {s}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 h-12 rounded-2xl bg-muted/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-base px-6"
            />
            <Button
              onClick={sendMessage}
              className="w-12 h-12 rounded-2xl bg-gradient-primary border-0 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIChatPage;
